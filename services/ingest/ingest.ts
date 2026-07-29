import { createHash } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir, readdir, readFile, rename, unlink } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { MongoServerError } from "mongodb";
import { listings, ingestRuns, type IngestRun } from "@/lib/db/collections";
import { parseFeed } from "@/lib/reaxml/parse";
import type { Listing, ListingDoc, Media } from "@/lib/reaxml/schema";

const AGENT_ID = process.env.REAPIT_AGENT_ID ?? "BRB04";
const INCOMING = process.env.REAPIT_FEED_INCOMING ?? "/srv/reapit-feed/var/www/html";
const PROCESSED = process.env.REAPIT_FEED_PROCESSED ?? "/srv/reapit-feed/processed";
const FAILED = process.env.REAPIT_FEED_FAILED ?? "/srv/reapit-feed/failed";
const MEDIA_DIR = process.env.MEDIA_STORAGE_DIR ?? "/srv/blueribbon/media";
const MEDIA_PREFIX = process.env.MEDIA_PUBLIC_PREFIX ?? "/media";

/**
 * Hosts the media worker is willing to fetch from.
 *
 * The feed is only semi-trusted — it is machine-generated, but a malformed or
 * tampered file could otherwise point the downloader at internal addresses.
 * Without this the worker is an SSRF primitive running on the same box as the
 * database.
 */
const ALLOWED_MEDIA_HOSTS = new Set(["agentboxcdn.com.au", "www.agentboxcdn.com.au"]);

const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const MAX_DOWNLOAD_ATTEMPTS = 5;

// ---------------------------------------------------------------------------
// Upsert
// ---------------------------------------------------------------------------

export type UpsertOutcome = "written" | "stale";

/**
 * Carries download state forward across feed updates.
 *
 * Agentbox resends the full listing on every change, including images that
 * have not moved. Without this merge each delivery would reset `localPath` to
 * null and the worker would re-download every photo of every listing — which
 * is both wasteful and the kind of traffic pattern that gets a portal noticed.
 */
function mergeMediaState(incoming: Media[], existing: Media[] | undefined): Media[] {
  if (!existing?.length) return incoming;

  const byId = new Map(existing.map((m) => [m.id, m]));

  return incoming.map((img) => {
    const prior = byId.get(img.id);
    if (!prior?.localPath) return img;

    // Only reuse the file if it is genuinely the same image. A changed URL or
    // modTime means Agentbox replaced it.
    const sameUrl = prior.sourceUrl === img.sourceUrl;
    const sameMod = (prior.modTime?.getTime() ?? 0) === (img.modTime?.getTime() ?? 0);
    if (!sameUrl || !sameMod) return img;

    return {
      ...img,
      localPath: prior.localPath,
      sha256: prior.sha256,
      attempts: prior.attempts,
      lastError: prior.lastError,
    };
  });
}

/**
 * Writes a listing, refusing to overwrite newer data.
 *
 * Files arrive in ten-minute batches and can land out of order — a retried
 * delivery of an older revision must not clobber a newer one. The `modTime`
 * condition in the filter is what enforces that.
 */
export async function upsertListing(listing: Listing): Promise<UpsertOutcome> {
  const col = await listings();
  const existing = await col.findOne(
    { _id: listing.uniqueID },
    { projection: { images: 1, floorplans: 1 } },
  );

  const doc: ListingDoc = {
    ...listing,
    _id: listing.uniqueID,
    images: mergeMediaState(listing.images, existing?.images),
    floorplans: mergeMediaState(listing.floorplans, existing?.floorplans),
  };

  try {
    const result = await col.updateOne(
      { _id: listing.uniqueID, modTime: { $lt: listing.modTime } },
      { $set: doc },
      { upsert: true },
    );
    return result.matchedCount > 0 || result.upsertedCount > 0 ? "written" : "stale";
  } catch (error) {
    // The filter did not match because what we hold is newer or identical, so
    // the upsert fell through to an insert and collided on _id. That is the
    // guard working, not a failure.
    if (error instanceof MongoServerError && error.code === 11000) return "stale";
    throw error;
  }
}

// ---------------------------------------------------------------------------
// File processing
// ---------------------------------------------------------------------------

export async function processFile(filePath: string): Promise<IngestRun> {
  const sourceFile = path.basename(filePath);
  const run: IngestRun = {
    sourceFile,
    startedAt: new Date(),
    finishedAt: null,
    status: "ok",
    listingsSeen: 0,
    listingsWritten: 0,
    listingsStale: 0,
    listingsSkipped: 0,
    skipReasons: [],
    error: null,
  };

  try {
    const xml = await readFile(filePath, "utf8");
    const { listings: parsed, skipped } = parseFeed(xml, sourceFile, AGENT_ID);

    run.listingsSeen = parsed.length + skipped.length;
    run.listingsSkipped = skipped.length;
    run.skipReasons = skipped.map((s) => `${s.uniqueID ?? "?"}: ${s.reason}`);

    for (const listing of parsed) {
      const outcome = await upsertListing(listing);
      if (outcome === "written") run.listingsWritten++;
      else run.listingsStale++;
    }
  } catch (error) {
    run.status = "failed";
    run.error = error instanceof Error ? error.message : String(error);
  }

  run.finishedAt = new Date();
  return run;
}

/**
 * Processes every XML file waiting in the feed directory.
 *
 * Files are moved rather than deleted — a failed parse is the only evidence of
 * what Agentbox actually sent, and it is needed to diagnose the failure.
 */
export async function processIncoming(): Promise<IngestRun[]> {
  await Promise.all([
    mkdir(PROCESSED, { recursive: true }),
    mkdir(FAILED, { recursive: true }),
  ]);

  const entries = await readdir(INCOMING).catch(() => [] as string[]);
  const files = entries.filter((f) => f.toLowerCase().endsWith(".xml")).sort();
  const runs: IngestRun[] = [];
  const col = await ingestRuns();

  for (const file of files) {
    const from = path.join(INCOMING, file);
    const run = await processFile(from);

    const destDir = run.status === "ok" ? PROCESSED : FAILED;
    await rename(from, path.join(destDir, file)).catch((e: unknown) => {
      run.error = `${run.error ?? ""} | move failed: ${String(e)}`.trim();
    });

    await col.insertOne(run);
    runs.push(run);
  }

  return runs;
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

function safeSegment(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]/g, "_");
}

async function downloadImage(uniqueID: string, img: Media): Promise<Media> {
  const url = new URL(img.sourceUrl);

  if (url.protocol !== "https:" || !ALLOWED_MEDIA_HOSTS.has(url.hostname)) {
    return { ...img, attempts: MAX_DOWNLOAD_ATTEMPTS, lastError: `blocked host: ${url.hostname}` };
  }

  const ext = safeSegment(img.format || path.extname(url.pathname).slice(1) || "jpg");
  const dir = path.join(MEDIA_DIR, safeSegment(uniqueID));
  const filename = `${safeSegment(img.id)}.${ext}`;
  const dest = path.join(dir, filename);
  const tmp = `${dest}.tmp`;

  try {
    await mkdir(dir, { recursive: true });

    const response = await fetch(img.sourceUrl, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const type = response.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) throw new Error(`unexpected content-type: ${type}`);

    const declared = Number(response.headers.get("content-length") ?? 0);
    if (declared > MAX_IMAGE_BYTES) throw new Error(`too large: ${declared} bytes`);
    if (!response.body) throw new Error("empty body");

    const hash = createHash("sha256");
    let bytes = 0;

    // Hash and size-check while streaming, so an undeclared oversized response
    // is still caught rather than filling the disk.
    const source = Readable.fromWeb(response.body as Parameters<typeof Readable.fromWeb>[0]);
    source.on("data", (chunk: Buffer) => {
      bytes += chunk.length;
      hash.update(chunk);
      if (bytes > MAX_IMAGE_BYTES) source.destroy(new Error("exceeded size limit"));
    });

    await pipeline(source, createWriteStream(tmp));
    await rename(tmp, dest);

    return {
      ...img,
      localPath: `${MEDIA_PREFIX}/${safeSegment(uniqueID)}/${filename}`,
      sha256: hash.digest("hex"),
      attempts: img.attempts + 1,
      lastError: null,
    };
  } catch (error) {
    await unlink(tmp).catch(() => {});
    return {
      ...img,
      attempts: img.attempts + 1,
      lastError: error instanceof Error ? error.message : String(error),
    };
  }
}

export type MediaStats = { listings: number; downloaded: number; failed: number };

/**
 * Downloads images that have no local copy yet.
 *
 * Self-hosting is mandatory: Reapit disables the feed for hotlinking, so a
 * listing whose images never download must render without them rather than
 * falling back to the CDN URL.
 */
export async function downloadPendingMedia(limit = 25): Promise<MediaStats> {
  const col = await listings();
  const stats: MediaStats = { listings: 0, downloaded: 0, failed: 0 };

  const pending = await col
    .find({
      images: {
        $elemMatch: { localPath: null, attempts: { $lt: MAX_DOWNLOAD_ATTEMPTS } },
      },
    })
    .limit(limit)
    .toArray();

  for (const doc of pending) {
    const settle = async (media: Media[]) =>
      Promise.all(
        media.map(async (img) => {
          if (img.localPath || img.attempts >= MAX_DOWNLOAD_ATTEMPTS) return img;
          const result = await downloadImage(doc._id, img);
          if (result.localPath) stats.downloaded++;
          else stats.failed++;
          return result;
        }),
      );

    const [images, floorplans] = await Promise.all([
      settle(doc.images),
      settle(doc.floorplans),
    ]);

    await col.updateOne({ _id: doc._id }, { $set: { images, floorplans } });
    stats.listings++;
  }

  return stats;
}
