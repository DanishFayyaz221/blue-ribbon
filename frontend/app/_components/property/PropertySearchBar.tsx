"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const sortOptions = [
  { label: "Most Recent First", orderBy: "lastModified", order: "DESC" },
  { label: "Price (Low to High)", orderBy: "searchPrice", order: "ASC" },
  { label: "Price (High to Low)", orderBy: "searchPrice", order: "DESC" },
] as const;

type SortLabel = (typeof sortOptions)[number]["label"];

type Props = {
  initialSuburb?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  initialSort?: SortLabel;
};

export function PropertySearchBar({
  initialSuburb = "",
  initialMinPrice = "",
  initialMaxPrice = "",
  initialSort = "Most Recent First",
}: Props) {
  const router = useRouter();
  const [suburb, setSuburb] = useState(initialSuburb);
  const [min, setMin] = useState(initialMinPrice);
  const [max, setMax] = useState(initialMaxPrice);
  const [sort, setSort] = useState<SortLabel>(initialSort);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (suburb.trim()) params.set("suburb", suburb.trim());
    if (min.trim()) params.set("minPrice", min.trim());
    if (max.trim()) params.set("maxPrice", max.trim());
    const chosen = sortOptions.find((o) => o.label === sort);
    if (chosen && chosen.label !== "Most Recent First") {
      params.set("orderBy", chosen.orderBy);
      params.set("order", chosen.order);
    }
    const qs = params.toString();
    router.push(`/buy${qs ? `?${qs}` : ""}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-[12px] sm:flex-row sm:items-center">
      <input
        type="text"
        value={suburb}
        onChange={(e) => setSuburb(e.target.value)}
        placeholder="Suburb, address or postcode"
        className="h-[38px] flex-1 sm:min-w-[420px] rounded-none border border-[#001F4D] bg-white px-[16px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none"
      />
      <input
        type="text"
        inputMode="numeric"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        placeholder="Min $"
        className="h-[38px] w-full sm:w-[170px] rounded-none border border-[#001F4D] bg-white px-[16px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none"
      />
      <input
        type="text"
        inputMode="numeric"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        placeholder="Max $"
        className="h-[38px] w-full sm:w-[170px] rounded-none border border-[#001F4D] bg-white px-[16px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none"
      />
      <div className="relative w-full sm:w-[420px]">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortLabel)}
          className="h-[38px] w-full appearance-none rounded-none border border-[#001F4D] bg-white px-[16px] pr-[36px] font-display text-[13px] text-brand-bunker focus:border-brand-navy focus:outline-none"
        >
          {sortOptions.map((o) => (
            <option key={o.label}>{o.label}</option>
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
        type="submit"
        className="flex h-[38px] w-full sm:w-auto items-center justify-center gap-[8px] rounded-none bg-[#001F4D] px-[20px] font-display text-[13px] font-medium text-white transition hover:bg-[#001a40]"
      >
        <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Search
      </button>
    </form>
  );
}
