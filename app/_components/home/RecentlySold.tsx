import Link from "next/link";
import { connection } from "next/server";
import { ArrowInline } from "../ui/ArrowInline";
import { PropertyCard } from "../property/PropertyCard";
import { LineReveal } from "../ui/LineReveal";
import { AutoplayCardCarousel } from "../property/AutoplayCardCarousel";
import { getSoldListings } from "@/lib/db/queries";

export async function RecentlySold() {
  // Request time, as the other listing sections: sold stock comes from the feed.
  await connection();

  const items = await getSoldListings(6);

  if (items.length === 0) return null;

  return (
    // `id`: the sold listing page's breadcrumb links back here.
    <section id="recently-sold" className="w-full scroll-mt-[80px] bg-white py-[clamp(36px,3.2vw,60px)]">
      <div className="container-page">
        <div className="flex items-end justify-between gap-[16px]">
          <LineReveal
            as="h2"
            className="font-display font-bold text-brand-navy text-[26px] sm:text-[clamp(1.3rem,1.8vw,2rem)] leading-[1.1]"
          >
            Recently Sold
          </LineReveal>
          <Link
            href="/sold"
            className="group mb-[4px] inline-flex shrink-0 items-center gap-[6px] font-display text-[12px] sm:text-[15px] font-medium tracking-[0.02em] text-brand-bunker underline underline-offset-4 hover:text-brand-navy"
          >
            See more
            <ArrowInline />
          </Link>
        </div>

        {/* Phone: one card at a time, as in Explore Properties. */}
        <AutoplayCardCarousel properties={items} ariaLabel="Recently sold" />

        {/* The same card and grid as Explore Properties — the ribbon is the
            only difference, carried in on each item's `sold` flag. */}
        <div className="focus-peers mt-[clamp(28px,2.7vw,52px)] hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-x-[clamp(10px,0.8vw,16px)] gap-y-[clamp(16px,1.8vw,32px)]">
          {items.map((p, i) => (
            <div
              key={p.id}
              suppressHydrationWarning
              className={`reveal reveal-delay-${(i % 3) + 1} hover-lift`}
            >
              <PropertyCard
                {...p}
                variant="wide"
                dense
                addressFirst
                aspect="aspect-[3/2] sm:aspect-[15/8]"
                sizes="(max-width: 767px) 48vw, (max-width: 1023px) 47vw, 30vw"
                parallax
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
