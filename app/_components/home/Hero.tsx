"use client";

import Link from "next/link";
import { useState } from "react";

const dealTypes = ["Buy", "Sell", "Rent"] as const;
type DealType = (typeof dealTypes)[number];

/** Suggestions are streamed in separately; see SuburbOptions. */
const SUBURB_LIST_ID = "hero-suburbs";

/**
 * Where each deal type sends the visitor. Buy and Rent hand off to the results
 * pages, which already own the filtering, so the hero never needs its own query
 * layer. Sell is not a listings search at all — it belongs to the appraisal
 * flow.
 */
function actionFor(deal: DealType): string {
  if (deal === "Rent") return "/rent";
  if (deal === "Sell") return "/property-report-digital-appraisal";
  return "/buy";
}

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative aspect-[1920/860] min-h-[380px] sm:min-h-[460px] max-h-[680px] w-full">
        <div className="absolute inset-0 scale-[1.04] blur-[6px]">
          <video
            className="h-full w-full object-cover"
            src="/hero-video/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />

        <div className="container-page absolute inset-x-0 top-[38%] -translate-y-1/2 sm:top-1/2">
          <h1 className="text-center font-display font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] text-[clamp(1.5rem,2vw,2.25rem)] leading-[1.1] tracking-[-0.01em]">
            <span className="block sm:inline">Own Your</span>{" "}
            <span className="block text-white sm:inline sm:text-brand-sky">Australian Dream</span>
          </h1>

          <div className="mt-[clamp(22px,2.5vw,42px)] hidden sm:block">
            <SearchBar />
          </div>

          <div className="mt-[24px] sm:hidden">
            <MobileSearch />
          </div>
        </div>

        <div className="container-page absolute inset-x-0 bottom-[64px] sm:bottom-[clamp(20px,2.5vw,48px)] flex justify-center">
          <Link
            href="/property-report-digital-appraisal"
            className="flex h-[44px] sm:h-[52px] w-full max-w-[480px] items-center justify-center bg-white/30 px-4 text-center font-display text-[12px] sm:text-[14px] lg:text-[16px] font-medium text-white backdrop-blur-sm transition hover:bg-white/40"
          >
            Get your property estimate in just 9 seconds!
          </Link>
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
    <form
      action={actionFor(deal)}
      method="get"
      className="mx-auto flex w-full max-w-[1280px] flex-col gap-[12px] sm:flex-row sm:items-stretch sm:gap-0"
    >
      <div className="flex w-full flex-1 flex-col items-stretch bg-white sm:flex-row">
        <div className="relative flex h-[52px] sm:h-[56px] lg:h-[60px] w-full sm:w-[160px] lg:w-[170px] items-center justify-center border-b sm:border-b-0 sm:border-r border-brand-silver">
          <button
            type="button"
            onClick={() => setDealOpen((v) => !v)}
            aria-expanded={dealOpen}
            className="flex h-full w-full items-center justify-center gap-[8px] font-display text-[15px] lg:text-[17px] font-medium text-black"
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

        <div className="flex h-[52px] sm:h-[56px] lg:h-[60px] flex-1 items-center px-[16px] lg:px-[20px]">
          <input
            type="text"
            name="q"
            list={SUBURB_LIST_ID}
            aria-label="Suburb, postcode, region or address"
            placeholder="Enter suburb, postcode, region or address"
            className="w-full bg-transparent font-display text-[13px] lg:text-[15px] font-medium tracking-[0.02em] text-black placeholder:text-brand-graychat focus:outline-none"
          />
        </div>

        <div className="flex h-[52px] sm:h-[56px] lg:h-[60px] items-center justify-between gap-[12px] border-t sm:border-t-0 sm:border-l border-brand-silver px-[16px] lg:px-[20px] sm:w-[260px] lg:w-[280px]">
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
              viewBox="0 0 24 24"
              className="h-[18px] w-[20px] lg:h-[20px] lg:w-[22px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="21" y1="6" x2="14" y2="6" />
              <line x1="10" y1="6" x2="3" y2="6" />
              <line x1="21" y1="12" x2="12" y2="12" />
              <line x1="8" y1="12" x2="3" y2="12" />
              <line x1="21" y1="18" x2="16" y2="18" />
              <line x1="12" y1="18" x2="3" y2="18" />
              <line x1="14" y1="4" x2="14" y2="8" />
              <line x1="8" y1="10" x2="8" y2="14" />
              <line x1="16" y1="16" x2="16" y2="20" />
            </svg>
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="flex h-[52px] sm:h-[56px] lg:h-[60px] w-full sm:w-[160px] lg:w-[180px] items-center justify-center rounded-[16px] sm:rounded-[20px] bg-brand-navy font-display text-[14px] lg:text-[16px] font-medium text-white transition hover:bg-brand-navy-deep sm:ml-0"
      >
        Search
      </button>
    </form>
  );
}

function MobileSearch() {
  const [deal, setDeal] = useState<DealType>("Buy");

  return (
    <form action={actionFor(deal)} method="get" className="mx-auto w-full max-w-[420px]">
      <div className="flex h-[52px] w-full items-stretch overflow-hidden rounded-[12px] bg-white py-[6px] pl-[16px] pr-[6px]">
        <input
          type="text"
          name="q"
          list={SUBURB_LIST_ID}
          aria-label="Suburb or postcode"
          placeholder="Enter suburb, postcode..."
          className="flex-1 bg-transparent pr-[12px] font-display text-[14px] font-medium text-black placeholder:text-brand-graychat focus:outline-none"
        />
        <button
          type="submit"
          className="flex w-[96px] items-center justify-center rounded-[8px] bg-brand-navy font-display text-[14px] font-medium text-white transition hover:bg-brand-navy-deep"
        >
          Search
        </button>
      </div>

      <div className="mt-[18px] flex items-center justify-between px-[8px]">
        {dealTypes.map((d) => {
          const active = deal === d;
          return (
            <button
              key={d}
              type="button"
              onClick={() => setDeal(d)}
              className="relative flex h-[28px] items-center justify-center"
            >
              <span
                className={`font-display text-[15px] font-medium ${
                  active ? "text-white" : "text-white/70"
                }`}
              >
                {d}
              </span>
              {active && (
                <span className="absolute -bottom-[4px] left-0 right-0 h-[2px] bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </form>
  );
}
