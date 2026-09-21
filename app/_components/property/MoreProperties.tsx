import Link from "next/link";
import { ArrowInline } from "../ui/ArrowInline";
import { LineReveal } from "../ui/LineReveal";
import { AutoplayCardCarousel } from "./AutoplayCardCarousel";
import { PropertyCard, type PropertyCardData } from "./PropertyCard";

/**
 * "More Properties" strip for the appraisal routes: heading and "Explore more"
 * link on one line, then three price-first cards. Presentational only — the
 * caller passes the listings — because the appraisal flow is a client
 * component and cannot fetch them itself (see getAppraisalListings).
 *
 * Same responsive shape as the home page's LatestProperties: one card at a
 * time under round arrows on phones, a three-up grid from sm. Kept separate
 * rather than reusing that component because the grid here leads with the
 * price, as the appraisal comp does, where the home page leads with the
 * address. (The phone card is address-first on both: that is how the mobile
 * comp draws it.)
 */
export function MoreProperties({ properties }: { properties: PropertyCardData[] }) {
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
            className="group mb-[4px] inline-flex shrink-0 items-center gap-[6px] self-end sm:mb-0 sm:self-auto font-display text-[12px] sm:text-[15px] lg:text-[18px] font-medium tracking-[0.02em] text-brand-bunker hover:text-brand-navy"
          >
            Explore more
            <ArrowInline />
          </Link>
        </div>

        {/* Phone: one full-width card at a time, playing itself — the same
            carousel as the home page's LatestProperties. */}
        <AutoplayCardCarousel properties={properties} ariaLabel="More properties" />

        {/* Tablet / desktop: grid */}
        <div className="focus-peers hidden sm:grid mt-[clamp(24px,2.7vw,52px)] grid-cols-2 md:grid-cols-3 gap-[clamp(12px,1.3vw,24px)]">
          {properties.map((p, i) => (
            <div
              key={p.href ?? i}
              suppressHydrationWarning
              className={`reveal reveal-delay-${(i % 3) + 1} hover-lift flex`}
            >
              <PropertyCard
                {...p}
                variant="tall"
                addressFirst={false}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
