"use client";

import { useState } from "react";

const sortOptions = ["Most Recent First", "Price (Low to High)", "Price (High to Low)"] as const;

export function PropertySearchBar() {
  const [suburb, setSuburb] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState<(typeof sortOptions)[number]>(sortOptions[0]);

  return (
    <div className="flex w-full flex-col gap-[12px] sm:flex-row sm:items-center">
      <input
        type="text"
        value={suburb}
        onChange={(e) => setSuburb(e.target.value)}
        placeholder="Suburb, address or postcode"
        className="h-[44px] flex-1 rounded-[8px] border border-brand-silver bg-white px-[16px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none"
      />
      <input
        type="text"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        placeholder="Min $"
        className="h-[44px] w-full sm:w-[140px] rounded-[8px] border border-brand-silver bg-white px-[16px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none"
      />
      <input
        type="text"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        placeholder="Max $"
        className="h-[44px] w-full sm:w-[140px] rounded-[8px] border border-brand-silver bg-white px-[16px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none"
      />
      <div className="relative w-full sm:w-[220px]">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as (typeof sortOptions)[number])}
          className="h-[44px] w-full appearance-none rounded-[8px] border border-brand-silver bg-white px-[16px] pr-[36px] font-display text-[13px] text-brand-bunker focus:border-brand-navy focus:outline-none"
        >
          {sortOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute right-[14px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-brand-bunker"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      <button
        type="button"
        className="flex h-[44px] w-full sm:w-auto items-center justify-center gap-[8px] rounded-[8px] bg-brand-navy px-[20px] font-display text-[13px] font-medium text-white transition hover:bg-brand-navy-deep"
      >
        <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Search
      </button>
    </div>
  );
}
