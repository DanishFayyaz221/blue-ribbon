import { connection } from "next/server";
import { PropertyCard } from "../property/PropertyCard";
import Link from "next/link";
import { ArrowInline } from "../ui/ArrowInline";
import { LineReveal } from "../ui/LineReveal";
import { MobileCarousel } from "../ui/MobileCarousel";
import { getListings } from "@/lib/db/queries";

export async function BestSuitedForYou() {
  // Defer to request time so the section reflects the feed rather than being
  // frozen into the build output.
  await connection();

  // Sorted by price rather than recency. "Our latest Properties" further down
  // the page already sorts by modTime, and pulling both from the same order
  // would render the two sections identically.
  const { items } = await getListings({ sort: "price-asc", perPage: 6 });

  if (items.length === 0) return null;

  return (
    <section className="w-full bg-white sm:bg-brand-soft py-[clamp(36px,3.2vw,60px)]">
      <div className="container-page">
        {/* Phone: the heading breaks after "Explore" with the link beside it,
            as in the mobile comp. */}
        <div className="flex items-end justify-between gap-[16px] sm:hidden">
          <LineReveal
            as="h2"
            className="font-display font-bold text-brand-navy text-[26px] leading-[1.1]"
          >
            {"Explore\nProperties"}
          </LineReveal>
          <Link
            href="/buy"
            className="group mb-[4px] inline-flex shrink-0 items-center gap-[6px] font-display text-[12px] font-medium tracking-[0.02em] text-brand-bunker"
          >
            Explore more
            <ArrowInline />
          </Link>
        </div>
        <LineReveal
          as="h2"
          className="hidden sm:block font-display font-bold text-brand-navy text-[clamp(1.3rem,1.8vw,2rem)] leading-[1.1]"
        >
          Explore Properties
        </LineReveal>

        {/* Phone: one full-width card at a time under the round arrows. */}
        <MobileCarousel
          ariaLabel="Explore properties"
          className="mt-[20px] sm:hidden"
          items={items.map((p) => (
            <PropertyCard
              key={p.id}
              {...p}
              variant="tall"
              addressFirst
              aspect="aspect-[3/2]"
              sizes="100vw"
            />
          ))}
        />

        {/* Three up only from lg. At md a third column would leave each card
            around 234px wide, and the 15/8 crop would collapse to a 125px
            strip. */}
        <div className="focus-peers mt-[clamp(28px,2.7vw,52px)] hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-x-[clamp(10px,0.8vw,16px)] gap-y-[clamp(16px,1.8vw,32px)]">
          {items.map((p, i) => (
            <div
              key={p.id}
              suppressHydrationWarning
              className={`reveal reveal-delay-${(i % 3) + 1} hover-lift`}
            >
              {/* dense: two across a phone leaves ~166px per card, well under
                  what the wide variant's default 16px padding and 16px address
                  were sized for. */}
              <PropertyCard
                {...p}
                variant="wide"
                dense
                addressFirst
                // 15/8 across a 166px card is an 89px strip. A chunkier crop
                // on the phone only; sm and up keeps the section's wide look.
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
