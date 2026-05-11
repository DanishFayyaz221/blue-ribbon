"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const dealTypes = ["Buy", "Sell", "Rent"] as const;
type DealType = (typeof dealTypes)[number];

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[clamp(560px,75vh,960px)] w-full">
        <div className="absolute inset-0 scale-[1.04] blur-[6px]">
          <Image
            src="/images/dynamic.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />

        <div className="container-page absolute inset-x-0 top-1/2 -translate-y-1/2">
          <h1 className="text-center font-display font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] text-[clamp(2.25rem,4vw,4.75rem)] leading-[1.1] tracking-[-0.01em]">
            Own Your <span className="text-brand-sky">Australian Dream</span>
          </h1>

          <div className="mt-[clamp(36px,4vw,64px)]">
            <SearchBar />
          </div>

          <div className="mt-[clamp(28px,3vw,56px)] flex justify-center">
            <Link
              href="/appraisal"
              className="flex h-[48px] sm:h-[58px] w-full max-w-[556px] items-center justify-center bg-white/30 px-4 text-center font-display text-[14px] sm:text-[18px] lg:text-[20px] font-medium text-white backdrop-blur-sm transition hover:bg-white/40"
            >
              Get your property estimate in just 9 seconds!
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchBar() {
  const [deal, setDeal] = useState<DealType>("Buy");
  const [dealOpen, setDealOpen] = useState(false);
  const [surroundings, setSurroundings] = useState(true);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[12px] sm:flex-row sm:items-stretch sm:gap-0">
      <div className="flex w-full flex-1 flex-col items-stretch bg-white sm:flex-row">
        <div className="relative flex h-[56px] sm:h-[64px] lg:h-[72px] w-full sm:w-[180px] lg:w-[195px] items-center justify-center border-b sm:border-b-0 sm:border-r border-brand-silver">
          <button
            type="button"
            onClick={() => setDealOpen((v) => !v)}
            aria-expanded={dealOpen}
            className="flex h-full w-full items-center justify-center gap-[8px] font-display text-[16px] lg:text-[20px] font-medium text-black"
          >
            {deal}
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px] lg:h-[20px] lg:w-[20px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {dealOpen && (
            <ul className="absolute left-0 right-0 top-full z-20 border border-brand-silver bg-white shadow-lg">
              {dealTypes.map((d) => (
                <li key={d}>
                  <button
                    type="button"
                    onClick={() => {
                      setDeal(d);
                      setDealOpen(false);
                    }}
                    className="flex w-full items-center justify-center py-[12px] font-display text-[16px] font-medium text-black hover:bg-brand-soft"
                  >
                    {d}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex h-[56px] sm:h-[64px] lg:h-[72px] flex-1 items-center px-[16px] lg:px-[21px]">
          <input
            type="text"
            placeholder="Enter suburb, postcode, region or address"
            className="w-full bg-transparent font-display text-[14px] lg:text-[18px] font-medium tracking-[0.02em] text-black placeholder:text-brand-graychat focus:outline-none"
          />
        </div>

        <div className="flex h-[56px] sm:h-[64px] lg:h-[72px] items-center justify-between gap-[12px] border-t sm:border-t-0 sm:border-l border-brand-silver px-[16px] lg:px-[21px] sm:w-[280px] lg:w-[300px]">
          <label className="flex cursor-pointer items-center gap-[12px]">
            <input
              type="checkbox"
              className="sr-only"
              checked={surroundings}
              onChange={(e) => setSurroundings(e.target.checked)}
            />
            <span className="relative flex h-[20px] w-[20px] items-center justify-center rounded-full border-[1.5px] border-black">
              {surroundings && <span className="h-[10px] w-[10px] rounded-full bg-black" />}
            </span>
            <span className="font-display text-[13px] lg:text-[15px] font-medium text-black">
              Surrounding suburbs
            </span>
          </label>
          <button type="button" aria-label="Filters" className="text-black hover:opacity-70">
            <svg
              viewBox="0 0 24 21"
              className="h-[16px] w-[18px] lg:h-[18px] lg:w-[21px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="6" y1="11" x2="18" y2="11" />
              <line x1="9" y1="16" x2="15" y2="16" />
            </svg>
          </button>
        </div>
      </div>

      <button
        type="button"
        className="flex h-[56px] sm:h-[64px] lg:h-[72px] w-full sm:w-[180px] lg:w-[220px] items-center justify-center rounded-[20px] sm:rounded-[24px] bg-brand-navy font-display text-[16px] lg:text-[19px] font-medium text-white transition hover:bg-brand-navy-deep sm:ml-0"
      >
        Search
      </button>
    </div>
  );
}
