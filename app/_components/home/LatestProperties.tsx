import Link from "next/link";
import { PropertyCard, type PropertyCardData } from "../property/PropertyCard";

const properties: PropertyCardData[] = Array.from({ length: 4 }, () => ({
  image: "/images/latest-properties.png",
  address: "23 Elm Street, Hurley",
  guide: "$925,000",
}));

export function LatestProperties() {
  return (
    <section className="w-full bg-white py-[clamp(40px,5vw,96px)]">
      <div className="container-page">
        <div className="flex flex-col gap-[12px] sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display font-bold text-brand-bunker text-[clamp(1.4rem,2.6vw,3.15rem)] leading-[1.1]">
            Our latest Properties
          </h2>
          <Link
            href="/buy"
            className="inline-flex items-center gap-[6px] self-end sm:self-auto font-display text-[13px] sm:text-[15px] lg:text-[18px] font-medium tracking-[0.02em] text-brand-bunker/70 sm:text-brand-bunker sm:underline sm:underline-offset-4 hover:text-brand-navy"
          >
            <span className="sm:hidden">See all</span>
            <span className="hidden sm:inline">Explore more Properties</span>
            <span aria-hidden className="sm:hidden">→</span>
          </Link>
        </div>

        {/* Mobile: horizontal-scroll carousel */}
        <div className="sm:hidden -mx-[var(--page-px)] mt-[24px]">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-[16px] overflow-x-auto px-[var(--page-px)] pb-[8px]">
            {properties.map((p, i) => (
              <div
                key={i}
                className="snap-start shrink-0 basis-[78%]"
              >
                <PropertyCard {...p} variant="wide" />
              </div>
            ))}
          </div>
        </div>

        {/* Tablet / desktop: grid (unchanged) */}
        <div className="hidden sm:grid mt-[clamp(36px,3.5vw,72px)] grid-cols-2 lg:grid-cols-4 gap-[clamp(16px,1.7vw,32px)]">
          {properties.map((p, i) => (
            <PropertyCard key={i} {...p} variant="tall" />
          ))}
        </div>
      </div>
    </section>
  );
}
