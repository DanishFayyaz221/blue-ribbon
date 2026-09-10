import Image from "next/image";
import { ParramattaFeaturedCard } from "./ParramattaFeaturedCard";
import { getLatestListings, getListingByAddress } from "@/lib/db/queries";

export async function ParramattaCTA() {
  // Featured property shown as the section's hero card. Pinned to a specific
  // address so the section stays consistent; if that listing ever disappears
  // from the feed we fall back to the most recent listing instead of dropping
  // the section entirely, and if the whole query fails the stock photo below
  // still renders.
  let featured = null;
  try {
    featured = await getListingByAddress("12 Betts Street");
    if (!featured) {
      [featured = null] = await getLatestListings(undefined, 1);
    }
  } catch {}

  return (
    <section className="relative w-full bg-white py-[clamp(20px,2.4vw,40px)]">
      {/* Featured Property badge, centred above the card. */}
      <div className="flex justify-center mb-[clamp(14px,1.4vw,24px)]">
        <span className="rounded-[8px] bg-brand-navy px-[18px] py-[8px] font-display text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
          Featured Property
        </span>
      </div>

      {featured ? (
        <ParramattaFeaturedCard featured={featured} />
      ) : (
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src="/images/dynamic.png"
            alt="Riverwalk Residences in Parramatta"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      )}
    </section>
  );
}
