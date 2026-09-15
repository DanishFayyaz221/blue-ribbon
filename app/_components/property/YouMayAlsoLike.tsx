import Link from "next/link";
import { DragScroll } from "../ui/DragScroll";
import { ArrowInline } from "../ui/ArrowInline";
import { LineReveal } from "../ui/LineReveal";
import { PropertyCard, type PropertyCardData } from "./PropertyCard";

/**
 * "You may also like" strip: heading and a "Keep Exploring" link on one line,
 * then listing cards led by their price or headline, three across from md.
 * Presentational — the caller passes the listings. A swipeable carousel on
 * phones, a grid from sm, like the other card strips.
 *
 * `tone="light"` is a self-contained white section. `tone="dark"` renders
 * bare — no background, padding or container — for a caller that already
 * provides a dark backdrop (the property page's navy satin panel), with white
 * copy and the site's dark-background card variant.
 */
export function YouMayAlsoLike({
  properties,
  exploreHref = "/rent",
  tone = "light",
  heading = "You may also like",
}: {
  properties: PropertyCardData[];
  exploreHref?: string;
  tone?: "light" | "dark";
  /** The strip's title — "Explore Properties" on the Market Insights page. */
  heading?: string;
}) {
  if (properties.length === 0) return null;
  const dark = tone === "dark";
  const Wrapper = dark ? "div" : "section";

  return (
    <Wrapper className={dark ? "w-full" : "w-full bg-white py-[clamp(28px,3.2vw,60px)]"}>
      <div className={dark ? undefined : "container-page"}>
        <div className="flex flex-col gap-[10px] sm:flex-row sm:items-end sm:justify-between">
          <LineReveal
            as="h2"
            className={`font-display font-bold text-[clamp(1.05rem,1.8vw,2rem)] leading-[1.1] ${
              dark ? "text-white" : "text-brand-bunker"
            }`}
          >
            {heading}
          </LineReveal>
          <Link
            href={exploreHref}
            className={`group inline-flex items-center gap-[6px] self-end sm:self-auto font-display text-[13px] sm:text-[15px] lg:text-[18px] font-medium tracking-[0.02em] ${
              dark
                ? "text-white/80 hover:text-white"
                : "text-brand-bunker/70 sm:text-brand-bunker hover:text-brand-navy"
            }`}
          >
            Keep Exploring
            <ArrowInline />
          </Link>
        </div>

        {/* Phones: horizontal-scroll carousel */}
        <div className="sm:hidden -mx-[var(--page-px)] mt-[24px]">
          <DragScroll className="no-scrollbar flex snap-x snap-mandatory items-stretch gap-[16px] overflow-x-auto px-[var(--page-px)] pb-[8px]">
            {properties.map((p, i) => (
              <div key={p.href ?? i} className="flex snap-start shrink-0 w-[78%]">
                <PropertyCard {...p} variant={dark ? "compact" : "wide"} dense addressFirst={false} />
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
                variant={dark ? "compact" : "tall"}
                addressFirst={false}
                // Grid only. The phone rendering above is a horizontal
                // carousel, where a vertical scroll-drift reads as drag
                // against the swipe rather than as depth.
                parallax
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
