import Link from "next/link";
import { AgentAvatar } from "./AgentAvatar";
import { ParallaxFigure } from "../ui/ParallaxFigure";

export type AgentCardData = {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  /** Omitted when no headshot exists; initials are shown instead. */
  image?: string;
  href?: string;
  /** Published listings this agent is on. Omitted when zero. */
  listingCount?: number;
};

export function AgentCard({
  name,
  role,
  image,
  email,
  phone,
  listingCount,
  href = "#",
  compact = false,
  aspect = "aspect-[37/50]",
  detailsClassName = "",
}: AgentCardData & {
  compact?: boolean;
  /** Tailwind aspect class for the photo; the team grid keeps the comp's 37/50. */
  aspect?: string;
  /** Extra classes for the name-and-details block beneath the photo. */
  detailsClassName?: string;
}) {
  return (
    <Link href={href} className="group block w-full">
      {/* The photo slides down into place and eases out of a slight zoom as
          the card enters, and lifts on hover — the same treatment as the
          agent cards on a property page. Anchored to the top: the headshots
          have only a few percent of room above the hair, so the slide is
          front-loaded into the entry and the head is fully in frame once
          the card is up the screen. The hover scale sits on the figure's
          frame, not the image, so it does not fight the scroll transform on
          the layer inside. */}
      <div className={`relative ${aspect} w-full overflow-hidden rounded-[clamp(12px,1vw,16px)]`}>
        <ParallaxFigure
          anchor="top"
          className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        >
          <AgentAvatar
            name={name}
            image={image}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </ParallaxFigure>
      </div>
      <div className={`mt-[clamp(14px,1.2vw,20px)] font-display ${compact ? "" : ""} ${detailsClassName}`.trim()}>
        <p className="text-[clamp(14px,0.95vw,17px)] font-semibold tracking-[0.02em] text-black leading-[1.3]">
          {name}
        </p>
        <p className="mt-[6px] text-[clamp(12px,0.85vw,15px)] font-medium tracking-[0.02em] text-brand-mineshaft leading-[1.45]">
          {role}
        </p>
        {(phone || email || listingCount) && (
          <div className="mt-[8px] space-y-[2px] text-[clamp(11px,0.78vw,13px)] text-brand-bunker/70">
            {phone && <p>{phone}</p>}
            {/* Wraps rather than truncating. `truncate` cut long addresses
                mid-domain on a narrow phone ("…@blueribbonre.co…"), which is
                worse than useless — a partial address reads as a real one.
                `break-all` because an email has no spaces to break at, so
                without it the whole string is one unbreakable word. */}
            {email && <p className="break-all">{email}</p>}
            {listingCount ? (
              <p className="text-brand-navy">
                {listingCount} current {listingCount === 1 ? "listing" : "listings"}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </Link>
  );
}
