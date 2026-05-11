"use client";

import { useState } from "react";

export function PropertySearchBar() {
  const [type, setType] = useState<"Buy" | "Rent">("Buy");
  const [open, setOpen] = useState(false);
  const [surroundings, setSurroundings] = useState(true);

  return (
    <div className="flex w-full flex-col gap-[12px] sm:flex-row sm:items-stretch sm:gap-0">
      <div className="flex w-full flex-1 flex-col items-stretch border border-brand-silver bg-white sm:flex-row">
        <div className="relative flex h-[52px] sm:h-[58px] w-full sm:w-[160px] items-center justify-center border-b sm:border-b-0 sm:border-r border-brand-silver">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex h-full w-full items-center justify-center gap-[8px] font-display text-[15px] font-medium text-black"
          >
            {type}
            <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {open && (
            <ul className="absolute left-0 right-0 top-full z-20 border border-brand-silver bg-white shadow-lg">
              {(["Buy", "Rent"] as const).map((v) => (
                <li key={v}>
                  <button
                    type="button"
                    onClick={() => { setType(v); setOpen(false); }}
                    className="flex w-full items-center justify-center py-[10px] font-display text-[15px] font-medium text-black hover:bg-brand-soft"
                  >
                    {v}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex h-[52px] sm:h-[58px] flex-1 items-center px-[16px]">
          <input
            type="text"
            placeholder="Enter suburb, postcode, region or address"
            className="w-full bg-transparent font-display text-[14px] font-medium text-black placeholder:text-brand-graychat focus:outline-none"
          />
        </div>

        <div className="flex h-[52px] sm:h-[58px] items-center justify-between gap-[10px] border-t sm:border-t-0 sm:border-l border-brand-silver px-[16px] sm:w-[260px]">
          <label className="flex cursor-pointer items-center gap-[10px]">
            <input
              type="checkbox"
              className="sr-only"
              checked={surroundings}
              onChange={(e) => setSurroundings(e.target.checked)}
            />
            <span className="relative flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px] border-black">
              {surroundings && <span className="h-[9px] w-[9px] rounded-full bg-black" />}
            </span>
            <span className="font-display text-[13px] font-medium text-black whitespace-nowrap">
              Surrounding suburbs
            </span>
          </label>
          <button type="button" aria-label="Filters" className="text-black hover:opacity-70">
            <svg viewBox="0 0 24 21" className="h-[16px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="6" y1="11" x2="18" y2="11" />
              <line x1="9" y1="16" x2="15" y2="16" />
            </svg>
          </button>
        </div>
      </div>

      <button
        type="button"
        className="flex h-[52px] sm:h-[58px] w-full sm:w-[180px] items-center justify-center rounded-[18px] bg-brand-navy font-display text-[16px] font-medium text-white transition hover:bg-brand-navy-deep"
      >
        Search
      </button>
    </div>
  );
}
