import Link from "next/link";
import { connection } from "next/server";
import { ArrowInline } from "../ui/ArrowInline";
import { LineReveal } from "../ui/LineReveal";
import { MobileCarousel } from "../ui/MobileCarousel";
import { PropertyCard } from "../property/PropertyCard";
import { getLatestListings } from "@/lib/db/queries";

export async function LatestProperties({ excludeIds = [] }: { excludeIds?: string[] } = {}) {
  // Defer to request time. Without this the home page would try to reach
  // MongoDB during `next build`, and listings would be frozen at build output
  // rather than reflecting the feed.
  await connection();

  // Deliberately unfiltered by category: until Agentbox re-exports the full
  // book, the feed holds rentals only, and filtering to sales would leave the
  // home page blank.
  const properties = await getLatestListings(undefined, 3, excludeIds);

  if (properties.length === 0) return null;

  return (
    <section className="w-full bg-white py-[clamp(28px,3.2vw,60px)]">
      <div className="container-page">
        <div className="flex items-end justify-between gap-[16px] sm:flex-row sm:items-end sm:justify-between">
          {/* Phone: the heading breaks after "More", as in the mobile comp. */}
          <LineReveal
            as="h2"
            className="sm:hidden font-display font-bold text-brand-bunker text-[26px] leading-[1.1]"
          >
            {"More\nProperties"}
          </LineReveal>
          <LineReveal
            as="h2"
            className="hidden sm:block font-display font-bold text-brand-bunker text-[clamp(1.05rem,1.8vw,2rem)] leading-[1.1]"
          >
            More Properties
          </LineReveal>
          <Link
            href="/buy"
            className="group mb-[4px] inline-flex shrink-0 items-center gap-[6px] self-end sm:mb-0 sm:self-auto font-display text-[12px] sm:text-[15px] lg:text-[18px] font-medium tracking-[0.02em] text-brand-bunker sm:underline sm:underline-offset-4 hover:text-brand-navy"
          >
            <span className="sm:hidden">Explore more</span>
            <span className="hidden sm:inline">Explore more Properties</span>
            <ArrowInline />
          </Link>
        </div>

        {/* Phone: one full-width card at a time under the round arrows. */}
        <MobileCarousel
          ariaLabel="More properties"
          className="mt-[20px] sm:hidden"
          items={properties.map((p) => (
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

        {/* Tablet / desktop: grid */}
        <div className="focus-peers hidden sm:grid mt-[clamp(24px,2.7vw,52px)] grid-cols-2 md:grid-cols-3 gap-[clamp(12px,1.3vw,24px)]">
          {properties.map((p, i) => (
            <div
              key={p.id}
              suppressHydrationWarning
              className={`reveal reveal-delay-${(i % 3) + 1} hover-lift flex`}
            >
              {/* No aspect override: the variant now defaults to a landscape
                  crop at lg for exactly this reason, so this grid and the
                  listing pages stay in step. */}
              <PropertyCard
                {...p}
                variant="tall"
                addressFirst
                // Grid only, as in Explore Properties above: the same parallax
                // layer, so the hover blur of both grids runs on the same
                // rule and reads identically. The phone carousel stays plain,
                // where a vertical drift reads as drag against the swipe.
                parallax
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
