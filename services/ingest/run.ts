/**
 * One-shot ingest pass. Driven by a systemd timer rather than a long-running
 * watcher: files arrive at most every ten minutes, and a process that exits
 * cannot leak memory or wedge on a stuck handle.
 *
 *   npx tsx services/ingest/run.ts
 */
import { getClient } from "@/lib/db/mongo";
import { ensureIndexes } from "@/lib/db/collections";
import { downloadPendingMedia, processIncoming } from "./ingest";

async function main() {
  const started = Date.now();
  await ensureIndexes();

  const runs = await processIncoming();
  for (const run of runs) {
    console.log(
      `[ingest] ${run.sourceFile} ${run.status} ` +
        `seen=${run.listingsSeen} written=${run.listingsWritten} ` +
        `stale=${run.listingsStale} skipped=${run.listingsSkipped}` +
        (run.error ? ` error=${run.error}` : ""),
    );
    for (const reason of run.skipReasons) console.log(`[ingest]   skip ${reason}`);
  }

  const media = await downloadPendingMedia();
  console.log(
    `[media] listings=${media.listings} downloaded=${media.downloaded} failed=${media.failed}`,
  );

  console.log(`[ingest] done in ${Date.now() - started}ms, ${runs.length} file(s)`);
}

main()
  .catch((error) => {
    console.error("[ingest] fatal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await (await getClient()).close();
  });
