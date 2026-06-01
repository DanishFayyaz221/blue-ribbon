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
}: PropertyCardProps) {
  const meta = beds != null || baths != null || cars != null || type ? (
    <p className="mt-[8px] flex flex-wrap items-center gap-x-[18px] gap-y-[4px] font-display text-[13px] font-semibold bg-white text-brand-navy sm:hidden">
      {beds != null && <span>{beds} Beds</span>}
      {baths != null && <span>{baths} Bath</span>}
      {cars != null && <span>{cars} Cars</span>}
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
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <div className="p-[16px] sm:p-0 sm:mt-[clamp(20px,2vw,40px)] font-display">
          <p className="text-[clamp(16px,1.18vw,22px)] font-semibold sm:font-medium leading-[1.4] text-brand-navy">
            {address}
          </p>
          {guide && (
            <p className="text-[clamp(13px,0.95vw,18px)] leading-[1.5] text-brand-bunker/70 sm:text-black mt-[4px]">
              Guide {guide}
            </p>
          )}
          {meta}
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    const guideText = guide?.startsWith("$") ? `Guide ${guide}` : guide;
    return (
      <Link href={href} className="group block w-full">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px]">
          <Image
            src={image}
            alt={address}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <div className="mt-[14px] font-display">
          <p className="text-[15px] font-medium leading-[1.3] text-white">{address}</p>
          {guideText && (
            <p className="text-[13px] leading-[1.4] text-white/80 mt-[2px]">{guideText}</p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block w-full">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[clamp(20px,1.7vw,32px)]">
        <Image
          src={image}
          alt={address}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-[clamp(16px,2vw,42px)] font-display">
        <p className="text-[clamp(16px,1.18vw,22px)] font-medium leading-[1.4] text-brand-navy">
          {address}
        </p>
        {guide && (
          <p className="text-[clamp(13px,0.95vw,18px)] leading-[1.5] text-black mt-[4px]">
            Guide {guide}
          </p>
        )}
        {meta}
      </div>
    </Link>
  );
}
