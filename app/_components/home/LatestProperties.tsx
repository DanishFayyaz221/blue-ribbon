import Link from "next/link";
import { connection } from "next/server";
import { PropertyCard } from "../property/PropertyCard";
import { getLatestListings } from "@/lib/db/queries";

export async function LatestProperties() {
  // Defer to request time. Without this the home page would try to reach
  // MongoDB during `next build`, and listings would be frozen at build output
  // rather than reflecting the feed.
  await connection();

  // Deliberately unfiltered by category: until Agentbox re-exports the full
  // book, the feed holds rentals only, and filtering to sales would leave the
  // home page blank.
  const properties = await getLatestListings(undefined, 4);

  if (properties.length === 0) return null;

  return (
    <section className="w-full bg-white py-[clamp(28px,3.2vw,60px)]">
      <div className="container-page">
        <div className="flex flex-col gap-[10px] sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display font-bold text-brand-bunker text-[clamp(1.05rem,1.8vw,2rem)] leading-[1.1]">
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
            {properties.map((p) => (
              <div
                key={p.id}
                className="snap-start shrink-0 basis-[78%]"
              >
                <PropertyCard {...p} variant="wide" />
              </div>
            ))}
          </div>
        </div>

        {/* Tablet / desktop: grid (unchanged) */}
        <div className="hidden sm:grid mt-[clamp(24px,2.7vw,52px)] grid-cols-2 lg:grid-cols-4 gap-[clamp(12px,1.3vw,24px)]">
          {properties.map((p) => (
            <PropertyCard key={p.id} {...p} variant="tall" />
          ))}
        </div>
      </div>
    </section>
  );
}
