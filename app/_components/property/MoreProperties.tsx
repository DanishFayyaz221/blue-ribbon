import Link from "next/link";
import { DragScroll } from "../ui/DragScroll";
import { ArrowInline } from "../ui/ArrowInline";
import { LineReveal } from "../ui/LineReveal";
import { PropertyCard, type PropertyCardData } from "./PropertyCard";

/**
 * "More Properties" strip for the appraisal routes: heading and "Explore more"
 * link on one line, then three price-first cards. Presentational only — the
 * caller passes the listings — because the appraisal flow is a client
 * component and cannot fetch them itself (see getAppraisalListings).
 *
 * Same responsive shape as the home page's LatestProperties: a swipeable
 * carousel on phones, a three-up grid from sm. Kept separate rather than
 * reusing that component because this one leads with the price, as the
 * appraisal comp does, where the home page leads with the address.
 */
export function MoreProperties({ properties }: { properties: PropertyCardData[] }) {
  if (properties.length === 0) return null;

  return (
    <section className="w-full bg-white py-[clamp(28px,3.2vw,60px)]">
      <div className="container-page">
        <div className="flex flex-col gap-[10px] sm:flex-row sm:items-end sm:justify-between">
          <LineReveal
            as="h2"
            className="font-display font-bold text-brand-bunker text-[clamp(1.05rem,1.8vw,2rem)] leading-[1.1]"
          >
            More Properties
          </LineReveal>
          <Link
            href="/buy"
            className="group inline-flex items-center gap-[6px] self-end sm:self-auto font-display text-[13px] sm:text-[15px] lg:text-[18px] font-medium tracking-[0.02em] text-brand-bunker/70 sm:text-brand-bunker hover:text-brand-navy"
          >
            Explore more
            <ArrowInline />
          </Link>
        </div>

        {/* Phones: horizontal-scroll carousel */}
        <div className="sm:hidden -mx-[var(--page-px)] mt-[24px]">
          <DragScroll className="no-scrollbar flex snap-x snap-mandatory items-stretch gap-[16px] overflow-x-auto px-[var(--page-px)] pb-[8px]">
            {properties.map((p, i) => (
              <div key={p.href ?? i} className="flex snap-start shrink-0 w-[78%]">
                <PropertyCard {...p} variant="wide" dense addressFirst={false} />
              </div>
            ))}
          </DragScroll>
        </div>

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
