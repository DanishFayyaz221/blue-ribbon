import Link from "next/link";
import { CardGallery } from "./CardGallery";

export type PropertyCardData = {
  href?: string;
  image: string;
  /** Extra photos for the in-card carousel. Falls back to `image` alone. */
  gallery?: string[];
  address: string;
  guide?: string;
  beds?: number;
  baths?: number;
  cars?: number;
  type?: string;
};

type PropertyCardProps = PropertyCardData & {
  variant?: "wide" | "tall" | "compact";
  /** Override the responsive `sizes` hint when the grid is not the variant's default width. */
  sizes?: string;
  /**
   * Override the variant's image crop, e.g. "aspect-[4/3]". Wanted where a
   * grid runs fewer, wider columns than the variant assumes and the default
   * portrait crop would make the card tower.
   */
  aspect?: string;
  /**
   * Tighten the phone-width padding and type. For grids that run two `wide`
   * cards across a phone, where a card is ~166px and the default 16px padding
   * plus 16px address leaves a full street address wrapping to five lines.
   * Ignored from `sm` up, where the card is wide enough either way.
   */
  dense?: boolean;
};

export function PropertyCard({
  href = "/property/1",
  image,
  gallery,
  address,
  guide,
  beds,
  baths,
  cars,
  type,
  variant = "tall",
  sizes,
  aspect,
  dense = false,
}: PropertyCardProps) {
  const frames = gallery && gallery.length > 0 ? gallery : [image];
  const metaStats: { key: string; label: string; value: number; icon: React.ReactNode }[] = [];
  if (beds != null) metaStats.push({ key: "bed", label: "Bed", value: beds, icon: <BedIcon /> });
  if (baths != null) metaStats.push({ key: "bath", label: "Bath", value: baths, icon: <BathIcon /> });
  if (cars != null) metaStats.push({ key: "car", label: "Car", value: cars, icon: <CarIcon /> });

  // No background colour: the card sits on white in most sections but on
  // brand-soft in "Best Suited for You", where a hard-coded white would read
  // as a band across the card.
  // One consistent size for the meta row across every variant of the card.
  // The row used to shrink to 11px in `dense` mode, sit at 13px in the
  // default wide/tall cards, and stretch to a 15px clamp on sm+, which made
  // the bed/bath/car numbers look different from one card to another and read
  // as a bug. A single size (13px on mobile, 14px on sm+) removes that.
  const renderMeta = (tone: "onLight" | "onDark") =>
    metaStats.length > 0 || type ? (
      <p
        className={`mt-[8px] flex flex-wrap items-center gap-x-[14px] gap-y-[4px] font-display text-[13px] font-semibold sm:mt-[10px] sm:gap-x-[16px] sm:text-[14px] ${
          tone === "onDark" ? "text-white/80" : "text-brand-navy"
        }`}
      >
        {metaStats.map((stat) => (
          <span key={stat.key} className="inline-flex items-center gap-[5px]">
            {stat.icon}
            {stat.value}
            {/* The glyph carries the meaning visually; screen readers need the
                word, or the row reads as a bare "2 1 1". */}
            <span className="sr-only">{stat.label}</span>
          </span>
        ))}
        {type && <span>{type}</span>}
      </p>
    ) : null;

  /**
   * The photo area, plus a link stretched over it.
   *
   * The card used to be one big <a>. It cannot be any more: the carousel
   * arrows are buttons, and a button nested inside an anchor is invalid HTML
   * that navigates on click instead of paging the photos. So the card root is
   * a plain element, the photo gets its own overlay link at z-10, and the
   * arrows sit above it at z-20 — clicking the photo still opens the listing,
   * clicking an arrow does not.
   */
  const media = (imageClassName: string, defaultSizes: string) => (
    <>
      <CardGallery
        images={frames}
        alt={address}
        sizes={sizes ?? defaultSizes}
        imageClassName={imageClassName}
      />
      {/* Mouse-only twin of the text link below. Hidden from assistive tech
          and skipped by tab so the card exposes one link, not two identical
          ones — the text link already carries the address. */}
      <Link
        href={href}
        aria-hidden
        tabIndex={-1}
        className="absolute inset-0 z-10"
      />
    </>
  );

  if (variant === "wide") {
    return (
      <div className="group block w-full overflow-hidden rounded-[16px] border border-brand-silver/60 bg-white sm:rounded-[clamp(16px,1.35vw,24px)] sm:border-0 sm:bg-transparent sm:overflow-visible">
        <div
          className={`relative ${aspect ?? "aspect-[15/8]"} w-full overflow-hidden sm:rounded-[clamp(16px,1.35vw,24px)] sm:shadow-[0_4px_4px_0_rgba(0,0,0,0.18)]`}
        >
          {media(
            "transition duration-500 group-hover:scale-[1.02]",
            "(max-width: 1024px) 100vw, 45vw",
          )}
        </div>
        <Link
          href={href}
          className={`block sm:p-0 sm:mt-[clamp(20px,2vw,40px)] font-display ${
            dense ? "p-[10px]" : "p-[16px]"
          }`}
        >
          {/* Price first, then address: buyers scan for price/status on the
              portals they compare us against, so the address becomes the
              secondary line here rather than the loudest element. */}
          {guide && (
            <p
              className={`font-bold leading-[1.25] text-brand-navy sm:line-clamp-none ${
                dense
                  ? "line-clamp-1 text-[15px]"
                  : "text-[clamp(18px,1.35vw,24px)]"
              }`}
            >
              {guide}
            </p>
          )}
          <p
            className={`${guide ? "mt-[4px]" : ""} font-medium leading-[1.4] text-brand-bunker/85 sm:line-clamp-none ${
              // Clamped rather than shrunk further: a card this narrow cannot
              // show a full NSW street address without either three lines of
              // 11px type or a truncation, and two readable lines beats both.
              dense
                ? "line-clamp-2 text-[12px]"
                : "text-[clamp(13px,0.95vw,16px)]"
            }`}
          >
            {address}
          </p>
          {renderMeta("onLight")}
        </Link>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="group block w-full">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[clamp(10px,1vw,16px)]">
          {media(
            "transition duration-500 group-hover:scale-[1.02]",
            "(max-width: 768px) 100vw, 33vw",
          )}
        </div>
        <Link href={href} className="block mt-[clamp(14px,1.4vw,22px)] font-display">
          {guide && (
            <p className="text-[clamp(16px,1.2vw,20px)] font-bold leading-[1.2] text-white">
              {guide}
            </p>
          )}
          <p className={`${guide ? "mt-[4px]" : ""} text-[clamp(12px,0.9vw,15px)] font-medium leading-[1.4] text-white/85`}>
            {address}
          </p>
          {renderMeta("onDark")}
        </Link>
      </div>
    );
  }

  return (
    <div className="group flex h-full w-full flex-col">
      <div
        // Portrait while the card is narrow (one or two across), landscape at
        // lg where the listing grids run three across and a card is ~427px —
        // a 3/4 crop there stands 569px tall, past what the viewport leaves
        // for it once the heading and the text block are counted.
        className={`relative ${aspect ?? "aspect-[3/4] lg:aspect-[4/3]"} w-full overflow-hidden rounded-[clamp(16px,1.35vw,24px)]`}
      >
        {media(
          "transition duration-500 group-hover:scale-[1.03]",
          "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
        )}
      </div>
      <Link
        href={href}
        className="mt-[12px] flex flex-1 flex-col font-display sm:mt-[clamp(16px,2vw,42px)]"
      >
        {guide && (
          <p className="line-clamp-1 text-[16px] font-bold leading-[1.2] text-brand-navy sm:line-clamp-none sm:text-[clamp(18px,1.35vw,24px)]">
            {guide}
          </p>
        )}
        <p className={`${guide ? "mt-[6px]" : ""} line-clamp-2 text-[13px] font-medium leading-[1.4] text-brand-bunker/85 sm:line-clamp-none sm:text-[clamp(13px,0.95vw,16px)] sm:leading-[1.5]`}>
          {address}
        </p>
        {renderMeta("onLight")}
      </Link>
    </div>
  );
}

/**
 * Feature glyphs for the card meta row.
 *
 * Inline rather than sprited or imported: three small paths used in one place
 * cost less as markup than another asset request, and drawing them with
 * `currentColor` lets the same icon sit on the white cards and the dark
 * "compact" ones without a second copy.
 */
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "h-[16px] w-[16px] shrink-0",
} as const;

function BedIcon() {
  return (
    <svg {...iconProps}>
      <path d="M2 17.5V6.5" />
      <path d="M2 12.5h15a5 5 0 0 1 5 5" />
      <path d="M2 17.5h20" />
      <path d="M6 12.5V10a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1v2.5" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 12V6.2A1.7 1.7 0 0 1 7 5l.9 1" />
      <path d="M2.5 12h19v2.5a4 4 0 0 1-4 4h-11a4 4 0 0 1-4-4V12Z" />
      <path d="M6.5 18.5 5.5 21" />
      <path d="M17.5 18.5 18.5 21" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg {...iconProps}>
      <path d="M5 17H3.5A1.5 1.5 0 0 1 2 15.5V13a2 2 0 0 1 1.3-1.9l1.5-.5 1.9-3.2A2 2 0 0 1 8.4 6.4h7.2a2 2 0 0 1 1.7 1l1.9 3.2 1.5.5A2 2 0 0 1 22 13v2.5a1.5 1.5 0 0 1-1.5 1.5H19" />
      <path d="M4.8 10.6h14.4" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}
