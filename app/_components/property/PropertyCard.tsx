import Image from "next/image";
import Link from "next/link";

export type PropertyCardData = {
  href?: string;
  image: string;
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
};

export function PropertyCard({
  href = "/property/1",
  image,
  address,
  guide,
  beds,
  baths,
  cars,
  type,
  variant = "tall",
  sizes,
}: PropertyCardProps) {
  const metaStats: { key: string; label: string; value: number; icon: React.ReactNode }[] = [];
  if (beds != null) metaStats.push({ key: "bed", label: "Bed", value: beds, icon: <BedIcon /> });
  if (baths != null) metaStats.push({ key: "bath", label: "Bath", value: baths, icon: <BathIcon /> });
  if (cars != null) metaStats.push({ key: "car", label: "Car", value: cars, icon: <CarIcon /> });

  // No background colour: the card sits on white in most sections but on
  // brand-soft in "Best Suited for You", where a hard-coded white would read
  // as a band across the card.
  const renderMeta = (tone: "onLight" | "onDark") =>
    metaStats.length > 0 || type ? (
      <p
        className={`mt-[8px] flex flex-wrap items-center gap-x-[14px] gap-y-[4px] font-display text-[13px] font-semibold sm:mt-[10px] sm:gap-x-[16px] sm:text-[clamp(12px,0.82vw,15px)] ${
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

  if (variant === "wide") {
    return (
      <Link
        href={href}
        className="group block w-full overflow-hidden rounded-[16px] border border-brand-silver/60 bg-white sm:rounded-[clamp(16px,1.7vw,32px)] sm:border-0 sm:bg-transparent sm:overflow-visible"
      >
        <div className="relative aspect-[15/8] w-full overflow-hidden sm:rounded-[clamp(16px,1.7vw,32px)] sm:shadow-[0_4px_4px_0_rgba(0,0,0,0.18)]">
          <Image
            src={image}
            alt={address}
            fill
            sizes={sizes ?? "(max-width: 1024px) 100vw, 45vw"}
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <div className="p-[16px] sm:p-0 sm:mt-[clamp(20px,2vw,40px)] font-display">
          <p className="text-[clamp(16px,1.18vw,22px)] font-semibold sm:font-medium leading-[1.4] text-brand-navy">
            {address}
          </p>
          {guide && (
            <p className="text-[clamp(13px,0.95vw,18px)] leading-[1.5] text-brand-bunker/70 sm:text-black mt-[4px]">
              {guide}
            </p>
          )}
          {renderMeta("onLight")}
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={href} className="group block w-full">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[clamp(10px,1vw,16px)]">
          <Image
            src={image}
            alt={address}
            fill
            sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <div className="mt-[clamp(14px,1.4vw,22px)] font-display">
          <p className="text-[clamp(14px,1.05vw,17px)] font-medium leading-[1.3] text-white">{address}</p>
          {guide && (
            <p className="text-[clamp(12px,0.85vw,14px)] leading-[1.4] text-white/80 mt-[4px]">{guide}</p>
          )}
          {renderMeta("onDark")}
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group flex h-full w-full flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[clamp(20px,1.7vw,32px)]">
        <Image
          src={image}
          alt={address}
          fill
          sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-[12px] flex flex-1 flex-col font-display sm:mt-[clamp(16px,2vw,42px)]">
        <p className="line-clamp-3 text-[14px] font-semibold leading-[1.3] text-brand-navy sm:line-clamp-none sm:text-[clamp(16px,1.18vw,22px)] sm:font-medium sm:leading-[1.4]">
          {address}
        </p>
        {guide && (
          <p className="mt-[6px] line-clamp-2 text-[12px] leading-[1.4] text-brand-bunker/70 sm:mt-[4px] sm:line-clamp-none sm:text-[clamp(13px,0.95vw,18px)] sm:leading-[1.5] sm:text-black">
            {guide}
          </p>
        )}
        {renderMeta("onLight")}
      </div>
    </Link>
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
  className: "h-[16px] w-[16px] shrink-0 sm:h-[17px] sm:w-[17px]",
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
