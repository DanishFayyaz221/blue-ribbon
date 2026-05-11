import Image from "next/image";
import Link from "next/link";

export type AgentCardData = {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  image: string;
  href?: string;
};

export function AgentCard({
  name,
  role,
  image,
  href = "#",
  compact = false,
}: AgentCardData & { compact?: boolean }) {
  return (
    <Link href={href} className="group block w-full">
      <div className="relative aspect-[37/50] w-full overflow-hidden rounded-[32px]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none absolute bottom-[clamp(20px,2vw,32px)] left-[clamp(20px,2vw,32px)] flex h-[36px] w-[82px] items-center justify-center gap-[8px] bg-white/30 backdrop-blur-[1px]"
        >
          <svg viewBox="0 0 16 16" className="h-[16px] w-[16px] text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="8" cy="8" r="6.5" />
            <line x1="8" y1="7" x2="8" y2="11" />
            <circle cx="8" cy="5" r="0.6" fill="currentColor" />
          </svg>
          <span className="font-display text-[13px] font-medium tracking-[0.02em] text-white">
            About
          </span>
        </button>
      </div>
      <div className={`mt-[clamp(14px,1.2vw,20px)] font-display ${compact ? "" : ""}`}>
        <p className="text-[clamp(14px,0.95vw,17px)] font-medium tracking-[0.02em] text-black leading-[1.3]">
          {name}
        </p>
        <p className="mt-[6px] text-[clamp(12px,0.85vw,15px)] font-medium tracking-[0.02em] text-brand-mineshaft leading-[1.45]">
          {role}
        </p>
      </div>
    </Link>
  );
}
