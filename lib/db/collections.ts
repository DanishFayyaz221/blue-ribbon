import type { Collection, IndexDescription } from "mongodb";
import { getDb } from "./mongo";
import type { ListingDoc } from "@/lib/reaxml/schema";

export const COLLECTIONS = {
  listings: "listings",
  ingestRuns: "ingest_runs",
} as const;

/** One row per processed feed file. The audit trail when a listing looks wrong. */
export type IngestRun = {
  sourceFile: string;
  startedAt: Date;
  finishedAt: Date | null;
  status: "ok" | "failed";
  listingsSeen: number;
  listingsWritten: number;
  /** Incoming file was older than what we already hold — correctly ignored. */
  listingsStale: number;
  /** Other agencies' listings. Expected: this feed is multi-tenant. */
  listingsSkipped: number;
  skipReasons: string[];
  error: string | null;
};

export async function listings(): Promise<Collection<ListingDoc>> {
  return (await getDb()).collection<ListingDoc>(COLLECTIONS.listings);
}

export async function ingestRuns(): Promise<Collection<IngestRun>> {
  return (await getDb()).collection<IngestRun>(COLLECTIONS.ingestRuns);
}

/**
 * `_id` is the REAXML `uniqueID`, so uniqueness is enforced by the primary key
 * and a duplicate file can never fork a listing into two documents. No
 * separate unique index is needed.
 */
export const LISTING_INDEXES: IndexDescription[] = [
  // The shape of nearly every public query: visible listings of one category,
  // newest first. `agentID` leads because the feed is multi-tenant.
  {
    key: { agentID: 1, isPublic: 1, category: 1, modTime: -1 },
    name: "agency_public_category_recent",
  },

  // Price filtering. Partial so the index only carries listings that actually
  // publish a number.
  {
    key: { category: 1, "price.value": 1 },
    name: "category_price",
    partialFilterExpression: { "price.display": true },
  },

  // Suburb browse — the most common filter on an agency site.
  { key: { "address.suburb": 1, isPublic: 1 }, name: "suburb_public" },

  // Bed / bath / parking filters.
  {
    key: { "features.bedrooms": 1, "features.bathrooms": 1, "features.totalParking": 1 },
    name: "features_counts",
  },

  // Radius search. Sparse because 2dsphere rejects null geometry and not every
  // listing carries coordinates.
  { key: { location: "2dsphere" }, name: "location_2dsphere", sparse: true },

  // Public URL lookup.
  { key: { slug: 1 }, name: "slug_unique", unique: true },

  // The media worker's claim query: listings with at least one undownloaded
  // image that has not exhausted its retries.
  {
    key: { "images.localPath": 1, "images.attempts": 1 },
    name: "media_pending",
  },

  // Free-text search across address and copy.
  {
    key: {
      headline: "text",
      description: "text",
      "address.street": "text",
      "address.suburb": "text",
    },
    name: "listing_text",
    weights: { "address.suburb": 10, "address.street": 5, headline: 3, description: 1 },
  },
];

export const INGEST_RUN_INDEXES: IndexDescription[] = [
  { key: { startedAt: -1 }, name: "startedAt_desc" },
  // Keep 90 days of history, then let Mongo reclaim it.
  { key: { startedAt: 1 }, name: "ttl_90d", expireAfterSeconds: 60 * 60 * 24 * 90 },
];

/**
 * Creates every index. Safe to run repeatedly — Mongo ignores an index that
 * already exists with an identical definition. Run on deploy.
 */
export async function ensureIndexes(): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTIONS.listings).createIndexes(LISTING_INDEXES);
  await db.collection(COLLECTIONS.ingestRuns).createIndexes(INGEST_RUN_INDEXES);
}
