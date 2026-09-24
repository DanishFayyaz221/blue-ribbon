/**
 * Re-derives `soldDetails` from already-processed feed files.
 *
 * The parser once read `<soldDetails><price>/<date>`, but Agentbox sends
 * `<soldPrice>/<soldDate>`, so every sold listing was stored with a null price
 * and date. A normal re-ingest cannot repair that: the modTime guard treats a
 * re-delivered revision as stale. This updates only `soldDetails`, and only on
 * documents still at the exact revision the file describes, so it can never
 * roll a listing back.
 *
 *   npx tsx --env-file=.env scripts/backfill-sold-details.ts [--apply]
 *
 * Without --apply it only reports what it would change.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { getClient } from "../lib/db/mongo";
import { listings } from "../lib/db/collections";
import { parseFeed } from "../lib/reaxml/parse";

const AGENT_ID = process.env.REAPIT_AGENT_ID ?? "BRB04";
const PROCESSED = process.env.REAPIT_FEED_PROCESSED ?? "/srv/reapit-feed/processed";
const apply = process.argv.includes("--apply");

async function main() {
  const col = await listings();
  const files = (await readdir(PROCESSED)).filter((f) => f.toLowerCase().endsWith(".xml")).sort();
  let matched = 0;
  let updated = 0;

  for (const file of files) {
    const xml = await readFile(path.join(PROCESSED, file), "utf8");
    if (!xml.includes("<soldDetails")) continue;

    const { listings: parsed } = parseFeed(xml, file, AGENT_ID);

    for (const listing of parsed) {
      if (!listing.soldDetails) continue;

      const filter = { _id: listing.uniqueID, modTime: listing.modTime };
      const current = await col.findOne(filter, { projection: { soldDetails: 1 } });
      if (!current) continue;

      matched++;
      console.log(
        `${file} ${listing.uniqueID}: ${JSON.stringify(current.soldDetails)} -> ${JSON.stringify(listing.soldDetails)}`,
      );

      if (apply) {
        const result = await col.updateOne(filter, { $set: { soldDetails: listing.soldDetails } });
        updated += result.modifiedCount;
      }
    }
  }

  console.log(`\n${matched} listing(s) at matching revision, ${apply ? `${updated} updated` : "dry run"}`);
}

main()
  .catch((error) => {
    console.error("FAILED:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await (await getClient()).close();
  });
