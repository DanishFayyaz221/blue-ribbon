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
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-[8px]">
      <button
        type="button"
        aria-label="Previous page"
        disabled={current === 1}
        onClick={() => setPage(current - 1)}
        className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-brand-silver text-brand-bunker transition hover:bg-brand-soft disabled:opacity-40"
      >
        <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => setPage(p)}
          aria-current={p === current ? "page" : undefined}
          className={`h-[36px] min-w-[36px] rounded-full px-[12px] font-display text-[14px] font-medium transition ${
            p === current
              ? "bg-brand-navy text-white"
              : "border border-brand-silver text-brand-bunker hover:bg-brand-soft"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={current === total}
        onClick={() => setPage(current + 1)}
        className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-brand-silver text-brand-bunker transition hover:bg-brand-soft disabled:opacity-40"
      >
        <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}
