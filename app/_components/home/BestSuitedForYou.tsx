import { connection } from "next/server";
import { PropertyCard } from "../property/PropertyCard";
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
        {/* suppressHydrationWarning: RevealOnScroll appends `reveal-in` from
            outside React, so this element's class can legitimately differ from
            the server HTML. React leaves the extra class alone either way. */}
        <h2
          suppressHydrationWarning
          className="reveal font-display font-bold text-brand-navy text-[clamp(1.3rem,1.8vw,2rem)] leading-[1.1]"
        >
          Best Suited for You
        </h2>

        {/* Three up only from lg. At md a third column would leave each card
            around 234px wide, and the 15/8 crop would collapse to a 125px
            strip. */}
        <div className="focus-peers mt-[clamp(28px,2.7vw,52px)] grid grid-cols-2 lg:grid-cols-3 gap-x-[clamp(10px,0.8vw,16px)] gap-y-[clamp(16px,1.8vw,32px)]">
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
                // 15/8 across a 166px card is an 89px strip. A chunkier crop
                // on the phone only; sm and up keeps the section's wide look.
                aspect="aspect-[3/2] sm:aspect-[15/8]"
                sizes="(max-width: 767px) 48vw, (max-width: 1023px) 47vw, 30vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
