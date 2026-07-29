/**
 * Confirms the app can reach MongoDB and read listings.
 *
 * In local development this goes through an SSH tunnel to the VPS:
 *   ssh -N -L 27017:127.0.0.1:27017 root@187.124.212.156
 *
 *   npx tsx --env-file=.env.local scripts/check-db.ts
 */
import { getClient } from "../lib/db/mongo";
import { getListings, getSuburbs } from "../lib/db/queries";

async function main() {
  const page = await getListings({});
  console.log(`connected. ${page.total} listing(s), ${page.totalPages} page(s)\n`);

  for (const item of page.items) {
    console.log(`  ${item.address}`);
    console.log(`    ${item.guide}  |  ${item.beds ?? "-"} bed / ${item.baths ?? "-"} bath / ${item.cars ?? "-"} car  |  ${item.type ?? "-"}`);
    console.log(`    ${item.href}`);
    console.log(`    ${item.image}\n`);
  }

  console.log("suburbs:", (await getSuburbs()).join(", ") || "(none)");
}

main()
  .catch((error) => {
    console.error("FAILED:", error instanceof Error ? error.message : error);
    console.error("\nIs the SSH tunnel running? ssh -N -L 27017:127.0.0.1:27017 root@187.124.212.156");
    process.exitCode = 1;
  })
  .finally(async () => {
    await (await getClient()).close();
  });
