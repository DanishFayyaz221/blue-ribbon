/**
 * Diagonal navy band across a photo's corner carrying the listing's state —
 * "Sold" on sold stock, "For Lease" on rentals still on the market.
 *
 * The parent must be `relative overflow-hidden`: the band is deliberately
 * longer than the corner and relies on the clip to trim both ends. It sits
 * above overlay links but lets clicks through, so tapping the corner still
 * does whatever tapping the photo does.
 *
 * Class strings are spelled out in full rather than assembled, so Tailwind
 * can see them.
 */
const CORNER = {
  // Cards: top-right, clear of the carousel's left arrow.
  right: {
    card: "right-[-44px] top-[20px] rotate-45 sm:right-[-50px] sm:top-[26px]",
    hero: "right-[-62px] top-[30px] rotate-45 sm:right-[-72px] sm:top-[40px]",
  },
  // Large photos: top-left, as in the listing page comp, where the top-right
  // is taken by other overlays.
  left: {
    card: "left-[-44px] top-[20px] -rotate-45 sm:left-[-50px] sm:top-[26px]",
    hero: "left-[-62px] top-[30px] -rotate-45 sm:left-[-72px] sm:top-[40px]",
  },
} as const;

const SIZE = {
  card: "w-[180px] py-[6px] text-[14px] sm:w-[210px] sm:py-[10px] sm:text-[clamp(15px,1.25vw,22px)]",
  hero: "w-[240px] py-[9px] text-[18px] sm:w-[290px] sm:py-[13px] sm:text-[clamp(20px,1.6vw,28px)]",
} as const;

/**
 * A label longer than "Sold" does not fit the stretch of band left showing
 * across the corner. The band runs further from the corner, where that
 * stretch is longer, and the type steps down, so "For Lease" clears both
 * clipped ends.
 */
const LONG_CORNER = {
  right: {
    card: "right-[-52px] top-[30px] rotate-45 sm:right-[-62px] sm:top-[36px]",
    hero: "right-[-78px] top-[40px] rotate-45 sm:right-[-90px] sm:top-[52px]",
  },
  left: {
    card: "left-[-52px] top-[30px] -rotate-45 sm:left-[-62px] sm:top-[36px]",
    hero: "left-[-78px] top-[40px] -rotate-45 sm:left-[-90px] sm:top-[52px]",
  },
} as const;

const LONG_SIZE = {
  card: "w-[220px] py-[6px] text-[12px] sm:w-[260px] sm:py-[9px] sm:text-[clamp(13px,1vw,17px)]",
  hero: "w-[280px] py-[9px] text-[15px] sm:w-[340px] sm:py-[13px] sm:text-[clamp(16px,1.25vw,22px)]",
} as const;

export function ListingRibbon({
  label = "Sold",
  corner = "right",
  size = "card",
}: {
  label?: string;
  corner?: keyof typeof CORNER;
  size?: keyof typeof SIZE;
}) {
  const long = label.length > 4;
  const place = long ? LONG_CORNER[corner][size] : CORNER[corner][size];
  const scale = long ? LONG_SIZE[size] : SIZE[size];
  return (
    <span
      aria-label={label}
      className={`pointer-events-none absolute z-20 bg-brand-navy text-center font-display font-bold uppercase leading-none tracking-[0.12em] text-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] ${place} ${scale}`}
    >
      {label}
    </span>
  );
}
