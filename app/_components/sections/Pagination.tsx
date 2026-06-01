"use client";

import { useState } from "react";

type Props = {
  initial?: number;
  total: number;
  onChange?: (page: number) => void;
};

export function Pagination({ initial = 1, total, onChange }: Props) {
  const [current, setCurrent] = useState(initial);
  const setPage = (p: number) => {
    setCurrent(p);
    onChange?.(p);
  };
  return (
    <nav aria-label="Pagination" className="flex justify-center">
      <div className="flex items-center gap-[18px] rounded-full border border-brand-silver px-[20px] py-[10px]">
        <button
          type="button"
          aria-label="Previous page"
          disabled={current === 1}
          onClick={() => setPage(current - 1)}
          className="flex h-[20px] w-[20px] items-center justify-center text-brand-bunker transition hover:text-brand-navy disabled:opacity-30"
        >
          <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="font-display text-[14px] font-medium text-brand-bunker tabular-nums">
          {current} / {total}
        </span>
        <button
          type="button"
          aria-label="Next page"
          disabled={current === total}
          onClick={() => setPage(current + 1)}
          className="flex h-[20px] w-[20px] items-center justify-center text-brand-bunker transition hover:text-brand-navy disabled:opacity-30"
        >
          <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
