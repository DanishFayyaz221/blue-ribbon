import Image from "next/image";
import Link from "next/link";
import { ArrowInline } from "../ui/ArrowInline";
import { LineReveal } from "../ui/LineReveal";
import { AutoplayCardCarousel } from "./AutoplayCardCarousel";
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
  phoneTone,
  heading = "You may also like",
  showExplore = true,
}: {
  properties: PropertyCardData[];
  exploreHref?: string;
  tone?: "light" | "dark";
  /**
   * Show the "Keep Exploring" link beside the heading. Off on the Buy page,
   * where the strip already sits on the listings index — a link back to the
   * page you are reading is not an invitation anywhere.
   */
  showExplore?: boolean;
  /**
   * Tone on phones, when it differs from `tone`. The mobile comp puts the
   * listing pages' strip on the navy satin while their desktop keeps it on
   * white; a light strip with `phoneTone="dark"` paints the satin and white
   * copy below sm only.
   */
  phoneTone?: "light" | "dark";
  /** The strip's title — "Explore Properties" on the Market Insights page. */
  heading?: string;
}) {
  if (properties.length === 0) return null;
  const dark = tone === "dark";
  const phoneDark = (phoneTone ?? tone) === "dark";
  // Satin backdrop of its own only when the phone is dark and desktop is not;
  // a dark strip proper sits inside the caller's panel.
  const phoneSatin = phoneDark && !dark;
  const Wrapper = dark ? "div" : "section";

  // The phone comp breaks the heading onto two lines — "You may / also like",
  // "Explore / Properties" — so the first half of the words takes line one.
  const words = heading.split(/\s+/);
  const phoneHeading =
    words.length > 1
      ? `${words.slice(0, Math.ceil(words.length / 2)).join(" ")}\n${words.slice(Math.ceil(words.length / 2)).join(" ")}`
      : heading;

  const headingTone = dark
    ? "text-white"
    : phoneDark
      ? "text-white sm:text-brand-bunker"
      : "text-brand-bunker";
  const linkTone = dark
    ? "text-white/80 hover:text-white"
    : phoneDark
      ? "text-white sm:text-brand-bunker hover:text-brand-navy"
      : "text-brand-bunker/70 sm:text-brand-bunker hover:text-brand-navy";

  return (
    <Wrapper
      className={
        dark
          ? "w-full"
          : phoneSatin
            ? "relative w-full overflow-hidden py-[clamp(28px,3.2vw,60px)] sm:bg-white"
            : "w-full bg-white py-[clamp(28px,3.2vw,60px)]"
      }
    >
      {/* `pointer-events-none`: this backdrop covers the whole band, so
          without it it swallowed the taps meant for the "Explore more" link
          and the cards underneath — the link looked focused but never
          navigated. It is decorative, so it should never take a pointer. */}
      {phoneSatin && (
        <div className="pointer-events-none absolute inset-0 sm:hidden" aria-hidden>
          <Image src="/images/bg.png" alt="" fill sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-[#001F4D1F]" />
        </div>
      )}
      {/* `relative z-10` in the dark case too. It used to be dropped there,
          which left the content with no stacking context of its own and the
          backdrop above free to paint over it. */}
      <div className={dark ? "relative z-10" : "container-page relative z-10"}>
        <div className="flex items-end justify-between gap-[16px] sm:flex-row sm:items-end sm:justify-between">
          <LineReveal
            as="h2"
            className={`sm:hidden font-display font-bold text-[26px] leading-[1.1] ${headingTone}`}
          >
            {phoneHeading}
          </LineReveal>
          <LineReveal
            as="h2"
            className={`hidden sm:block font-display font-bold text-[clamp(1.05rem,1.8vw,2rem)] leading-[1.1] ${headingTone}`}
          >
            {heading}
          </LineReveal>
          {showExplore && (
            <Link
              href={exploreHref}
              className={`group mb-[4px] inline-flex shrink-0 items-center gap-[6px] self-end sm:mb-0 sm:self-auto font-display text-[12px] sm:text-[15px] lg:text-[18px] font-medium tracking-[0.02em] ${linkTone}`}
            >
              <span className="sm:hidden">Explore more</span>
              <span className="hidden sm:inline">Keep Exploring</span>
              <ArrowInline />
            </Link>
          )}
        </div>

        {/* Phone: one full-width card at a time, playing itself — each card
            cycles its first few photos, then the row steps to the next
            listing. The address leads, as in the mobile comp. */}
        <AutoplayCardCarousel
          properties={properties}
          ariaLabel={heading}
          tone={phoneDark ? "dark" : "light"}
          variant={phoneDark ? "compact" : "tall"}
        />

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
                addressFirst
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
