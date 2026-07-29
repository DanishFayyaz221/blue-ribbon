import Link from "next/link";

type Props = {
  title: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * Shown when a listing query returns nothing.
 *
 * This is a real state, not a placeholder: the feed only sends a listing when
 * it is created or updated, so a category with no recent activity is legitimately
 * empty until Agentbox re-exports.
 */
export function EmptyListings({ title, message, ctaLabel, ctaHref }: Props) {
  return (
    <div className="flex flex-col items-center rounded-[16px] border border-brand-silver/60 bg-brand-soft/30 px-[24px] py-[clamp(40px,5vw,72px)] text-center">
      <h3 className="font-display text-[clamp(16px,1.3vw,22px)] font-semibold text-brand-bunker">
        {title}
      </h3>
      <p className="mt-[10px] max-w-[460px] font-display text-[clamp(13px,0.95vw,15px)] leading-[1.6] text-brand-bunker/70">
        {message}
      </p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="mt-[22px] inline-flex h-[46px] items-center justify-center rounded-[23px] border border-brand-navy px-[26px] font-display text-[14px] font-semibold text-brand-navy transition hover:bg-brand-soft"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
