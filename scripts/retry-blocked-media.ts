/**
 * Clears the download attempt counter on photos that were refused because
 * their host was not on the allow-list.
 *
 * The media worker only picks up an image while `attempts < 5`. An image
 * rejected for its host is not retried — `downloadImage` sets attempts
 * straight to the maximum, because retrying a blocked host would be pointless
 * — so adding a host to the allow-list is not enough on its own: the images
 * that failed before the change stay parked at the cap forever.
 *
 * This resets only those, matched on the recorded `lastError`, so photos that
 * genuinely failed five times (dead URL, timeout) keep their count and are not
 * dragged back into the queue.
 *
 *   npx tsx --env-file=.env.local scripts/retry-blocked-media.ts
 */
import { getClient, getDb } from "@/lib/db/mongo";

async function main() {
  const db = await getDb();
  const col = db.collection("listings");

  const match = { $regex: "^blocked host: " };

  const before = await col.countDocuments({
    $or: [
      { images: { $elemMatch: { localPath: null, lastError: match } } },
      { floorplans: { $elemMatch: { localPath: null, lastError: match } } },
    ],
  });
  console.log(`listings with host-blocked media: ${before}`);

  // Array filters, so only the blocked entries are touched; an image that
  // already has a file, or failed for some other reason, is left alone.
  const result = await col.updateMany(
    {
      $or: [
        { images: { $elemMatch: { localPath: null, lastError: match } } },
        { floorplans: { $elemMatch: { localPath: null, lastError: match } } },
      ],
    },
    {
      $set: {
        "images.$[img].attempts": 0,
        "images.$[img].lastError": null,
        "floorplans.$[fp].attempts": 0,
        "floorplans.$[fp].lastError": null,
      },
    },
    {
      arrayFilters: [
        { "img.localPath": null, "img.lastError": match },
        { "fp.localPath": null, "fp.lastError": match },
      ],
    },
  );

  console.log(`listings updated: ${result.modifiedCount}`);
  console.log("the media worker will pick these up on its next run.");
}

main()
  .catch((error) => {
    console.error("failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await (await getClient()).close();
  });
