import Image from "next/image";

type Props = {
  name: string;
  /** Real headshot. When absent, initials are shown instead. */
  image?: string;
  sizes: string;
  className?: string;
};

/**
 * An agent's photo, or their initials when no photo exists.
 *
 * The Agentbox feed carries no images, so a headshot only appears once someone
 * adds one to `lib/agents/profiles.ts`. Falling back to a generic stock photo
 * would put one real person's face on another person's card, which on a team
 * page is a false statement about who works at the agency.
 */
export function AgentAvatar({ name, image, sizes, className = "" }: Props) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        fill
        sizes={sizes}
        className={`object-cover object-top ${className}`}
      />
    );
  }

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className="flex h-full w-full items-center justify-center bg-brand-navy"
      aria-label={name}
      role="img"
    >
      <span className="font-display text-[clamp(28px,4vw,64px)] font-semibold tracking-[0.04em] text-white/90">
        {initials}
      </span>
    </div>
  );
}
