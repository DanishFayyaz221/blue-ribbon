import { connection } from "next/server";
import { getLatestListings, getListings } from "@/lib/db/queries";

/**
 * The two card strips shown beneath the appraisal flow.
 *
 * Fetched here rather than inside AppraisalFlow because that is a client
 * component and cannot reach MongoDB. Every appraisal route shows the same two
 * strips, so the query lives in one place instead of six.
 */
export async function getAppraisalListings() {
  // Defer to request time: these must reflect the feed, not the build output.
  await connection();

  const [{ items }, latest] = await Promise.all([
    // Sorted by price so this strip differs from "Our latest Properties"
    // directly below it, which sorts by modTime.
    getListings({ sort: "price-asc", perPage: 6 }),
    getLatestListings(undefined, 4),
  ]);

  return { samples: items, latest };
}
