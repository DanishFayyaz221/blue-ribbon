import Link from "next/link";

type Props = {
  current: number;
  total: number;
  hrefFor: (page: number) => string;
};

export function Pagination({ current, total, hrefFor }: Props) {
  if (total <= 1) return null;
  const clamp = (n: number) => Math.max(1, Math.min(total, n));
  const prev = clamp(current - 1);
  const next = clamp(current + 1);
  const disabledPrev = current <= 1;
  const disabledNext = current >= total;

  return (
    <nav aria-label="Pagination" className="flex justify-center">
      <div className="flex items-center gap-[18px] rounded-full border border-brand-silver px-[20px] py-[10px]">
        {disabledPrev ? (
          <span aria-hidden className="flex h-[20px] w-[20px] items-center justify-center text-brand-bunker opacity-30">
            <Arrow direction="left" />
          </span>
        ) : (
          <Link
            href={hrefFor(prev)}
            aria-label="Previous page"
            className="flex h-[20px] w-[20px] items-center justify-center text-brand-bunker transition hover:text-brand-navy"
          >
            <Arrow direction="left" />
          </Link>
        )}
        <span className="font-display text-[14px] font-medium text-brand-bunker tabular-nums">
          {current} / {total}
        </span>
        {disabledNext ? (
          <span aria-hidden className="flex h-[20px] w-[20px] items-center justify-center text-brand-bunker opacity-30">
            <Arrow direction="right" />
          </span>
        ) : (
          <Link
            href={hrefFor(next)}
            aria-label="Next page"
            className="flex h-[20px] w-[20px] items-center justify-center text-brand-bunker transition hover:text-brand-navy"
          >
            <Arrow direction="right" />
          </Link>
        )}
      </div>
    </nav>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {direction === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}
