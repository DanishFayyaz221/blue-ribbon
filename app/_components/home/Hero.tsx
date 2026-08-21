"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
      {/*
        FIX: previous aspect ratio (1920/860 ≈ 2.23:1) was much wider/shorter
        than the source video's native ratio (~16:9 ≈ 1.78:1). Combined with
        object-cover, that forced the browser to crop the top/bottom of the
        video (cutting off heads, etc). Switching to aspect-video (16:9) with
        a slightly taller min-height range fixes the crop while still filling
        the hero nicely on all screen sizes.
      */}
      <div className="relative aspect-[3/4] sm:aspect-video min-h-[calc(100svh-104px)] sm:min-h-[680px] sm:max-h-[920px] w-full">
        <div className="parallax-media absolute inset-0">
          <video
            className="h-full w-full object-cover object-top"
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

        {/*
          Anchored from the bottom, not the top. Centring this block put the
          search bar at a percentage that drifted with the hero's height
          (aspect-video between the min/max clamps), so "how far up from the
          bottom" changed with the window. Pinning the bottom edge — which is
          the search bar's own bottom edge, since it is the last visible child
          — holds it at a fixed 25% on every width.

          The max() floor keeps it clear of the estimate CTA below, which sits
          64px + 44px off the bottom on mobile: on a very short viewport a flat
          25% would land underneath it.
        */}
        {/* z-20: the deal menu drops past the estimate CTA below, which would
            otherwise paint over it — both blocks are absolute siblings, so
            without this the later one in the DOM wins. */}
        <div className="container-page absolute inset-x-0 bottom-[max(25%,132px)] z-20">
          <h1 className="animate-fade-up text-center font-display font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] text-[32px] sm:text-[clamp(1.5rem,2vw,2.25rem)] leading-[1.1] tracking-[-0.01em]">
            <span className="block sm:inline">Own Your</span>{" "}
            <span className="block text-white sm:inline sm:text-brand-sky">Australian Dream</span>
          </h1>

          <div className="animate-fade-up [animation-delay:180ms] mt-[clamp(22px,2.5vw,42px)] hidden sm:block">
            <SearchBar />
          </div>

          <div className="animate-fade-up [animation-delay:180ms] mt-[24px] sm:hidden">
            <MobileSearch />
          </div>
        </div>

        <div className="container-page absolute inset-x-0 bottom-[64px] sm:bottom-[clamp(20px,2.5vw,48px)] flex justify-center">
          <Link
            href="/property-report-digital-appraisal"
            className="animate-fade-up [animation-delay:340ms] flex h-[44px] sm:h-[52px] w-full max-w-[480px] items-center justify-center rounded-[16px] sm:rounded-[20px] bg-white/30 px-4 text-center font-display text-[12px] sm:text-[14px] lg:text-[16px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/40 hover:scale-[1.02]"
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
  const inputRef = useRef<HTMLInputElement>(null);
  const dealButtonRef = useRef<HTMLButtonElement>(null);
  const dealMenuRef = useRef<HTMLUListElement>(null);

  // Dismiss on click-away and Escape. Toggle and menu are tested separately
  // because the menu no longer sits inside the button's own cell.
  useEffect(() => {
    if (!dealOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dealButtonRef.current?.contains(target)) return;
      if (dealMenuRef.current?.contains(target)) return;
      setDealOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDealOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [dealOpen]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const submitIfMatch = () => {
      const list = input.list;
      if (!list) return;
      const matched = Array.from(list.options).some(
        (opt) => opt.value === input.value,
      );
      if (matched) input.form?.requestSubmit();
    };
    input.addEventListener("input", submitIfMatch);
    input.addEventListener("change", submitIfMatch);
    return () => {
      input.removeEventListener("input", submitIfMatch);
      input.removeEventListener("change", submitIfMatch);
    };
  }, []);

  return (
    <form
      action={actionFor(deal)}
      method="get"
      // No max-width of its own: the bar fills whatever container-page gives
      // it. The old max-w-[1280px] never bound while the container held 1184px
      // of content, but would clip the bar narrower than the rest of the page
      // now that it holds 1328px.
      className="relative mx-auto flex w-full flex-col gap-[12px] sm:flex-row sm:items-stretch sm:gap-0"
    >
      <div className="flex w-full flex-1 flex-col items-stretch overflow-hidden rounded-[16px] bg-white sm:flex-row sm:rounded-[20px]">
        <div className="flex h-[52px] sm:h-[56px] lg:h-[60px] w-full sm:w-[160px] lg:w-[170px] items-center justify-center border-b sm:border-b-0 sm:border-r border-brand-silver">
          <button
            ref={dealButtonRef}
            type="button"
            onClick={() => setDealOpen((v) => !v)}
            aria-expanded={dealOpen}
            aria-haspopup="listbox"
            className="flex h-full w-full items-center justify-center gap-[8px] font-display text-[15px] lg:text-[17px] font-medium text-black"
          >
            {deal}
            <svg
              viewBox="0 0 24 24"
              className={`h-[18px] w-[18px] transition-transform duration-200 lg:h-[20px] lg:w-[20px] ${dealOpen ? "rotate-180" : ""}`}
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
        </div>

        <div className="flex h-[52px] sm:h-[56px] lg:h-[60px] flex-1 items-center px-[16px] lg:px-[20px]">
          <input
            ref={inputRef}
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
        className="group relative isolate flex h-[52px] sm:h-[56px] lg:h-[60px] w-full sm:w-[160px] lg:w-[180px] items-center justify-center overflow-hidden rounded-[16px] sm:rounded-[20px] bg-brand-navy font-display text-[14px] lg:text-[16px] font-medium text-white transition-colors duration-300 before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-brand-navy-deep before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:translate-y-0 sm:ml-0"
      >
        <span className="relative z-10">Search</span>
      </button>

      {/*
        Deliberately a child of the form rather than of the "Buy" cell. That
        cell lives inside the pill's `overflow-hidden` wrapper — which is what
        rounds the white bar — so a menu positioned at top-full was being
        clipped away entirely: the toggle worked, nothing ever appeared.
        Anchoring to the form instead puts it just below the bar, unclipped.
        SearchBar only ever renders at sm and up (the hero swaps in
        MobileSearch below that), so the form is always a single row here and
        top-full lands directly under the Buy cell.
      */}
      {dealOpen && (
        <ul
          ref={dealMenuRef}
          role="listbox"
          className="animate-menu-in absolute left-0 top-full z-30 mt-[10px] w-full rounded-[18px] border border-black/[0.06] bg-white p-[6px] shadow-[0_20px_44px_-14px_rgba(0,31,77,0.30),0_2px_6px_rgba(0,0,0,0.05)] sm:w-[178px] lg:w-[196px]"
        >
          {dealTypes.map((d) => {
            const isActive = d === deal;
            return (
              <li key={d}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setDeal(d);
                    setDealOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-[10px] rounded-[12px] px-[14px] py-[11px] font-display text-[15px] lg:text-[16px] font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-brand-soft text-brand-navy"
                      : "text-brand-bunker hover:bg-black/[0.045]"
                  }`}
                >
                  {d}
                  {isActive && (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[15px] w-[15px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </form>
  );
}

function MobileSearch() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const submitIfMatch = () => {
      const list = input.list;
      if (!list) return;
      const matched = Array.from(list.options).some(
        (opt) => opt.value === input.value,
      );
      if (matched) input.form?.requestSubmit();
    };
    input.addEventListener("input", submitIfMatch);
    input.addEventListener("change", submitIfMatch);
    return () => {
      input.removeEventListener("input", submitIfMatch);
      input.removeEventListener("change", submitIfMatch);
    };
  }, []);

  return (
    <form action={actionFor("Buy")} method="get" className="mx-auto w-full max-w-[420px]">
      <div className="flex h-[52px] w-full items-stretch rounded-[16px] bg-white p-[6px]">
        <input
          ref={inputRef}
          type="text"
          name="q"
          list={SUBURB_LIST_ID}
          aria-label="Suburb or postcode"
          placeholder="Enter suburb, postcode..."
          className="min-w-0 flex-1 bg-transparent px-[12px] font-display text-[14px] font-medium text-black placeholder:text-brand-graychat focus:outline-none"
        />
        <button
          type="submit"
          className="group relative isolate flex h-full shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-brand-navy px-[20px] font-display text-[14px] font-medium text-white transition-colors duration-300 before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-brand-navy-deep before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:translate-y-0"
        >
          <span className="relative z-10">Search</span>
        </button>
      </div>
    </form>
  );
}
