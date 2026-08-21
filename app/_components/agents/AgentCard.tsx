import Link from "next/link";
import { AgentAvatar } from "./AgentAvatar";

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
}: AgentCardData & { compact?: boolean }) {
  return (
    <Link href={href} className="group block w-full">
      <div className="relative aspect-[37/50] w-full overflow-hidden rounded-[32px]">
        <AgentAvatar
          name={name}
          image={image}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="transition duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className={`mt-[clamp(14px,1.2vw,20px)] font-display ${compact ? "" : ""}`}>
        <p className="text-[clamp(14px,0.95vw,17px)] font-medium tracking-[0.02em] text-black leading-[1.3]">
          {name}
        </p>
        <p className="mt-[6px] text-[clamp(12px,0.85vw,15px)] font-medium tracking-[0.02em] text-brand-mineshaft leading-[1.45]">
          {role}
        </p>
        {(phone || email || listingCount) && (
          <div className="mt-[8px] space-y-[2px] text-[clamp(11px,0.78vw,13px)] text-brand-bunker/70">
            {phone && <p>{phone}</p>}
            {email && <p className="truncate">{email}</p>}
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
