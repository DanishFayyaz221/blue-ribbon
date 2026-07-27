"use client";

import { useState } from "react";
import { PropertyImage } from "./PropertyImage";

type Props = {
  images: string[];
  floorPlans: string[];
  fallback: string;
  alt: string;
};

type Tab = "photos" | "floorplan";

export function PropertyGallery({ images, floorPlans, fallback, alt }: Props) {
  const hasFloorPlan = floorPlans.length > 0;
  const [tab, setTab] = useState<Tab>("photos");
  const [index, setIndex] = useState(0);

  const list = tab === "photos" ? images : floorPlans;
  const source = list.length > 0 ? list : [fallback];
  const safeIndex = Math.min(index, source.length - 1);
  const current = source[safeIndex]!;

  const goto = (i: number) => setIndex((i + source.length) % source.length);
  const prev = () => goto(safeIndex - 1);
  const next = () => goto(safeIndex + 1);

  const switchTab = (t: Tab) => {
    setTab(t);
    setIndex(0);
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="mb-3 flex items-center justify-between border-b border-brand-silver/40 pb-3 sm:mb-4">
        <div className="flex flex-1 items-center justify-center gap-6 sm:gap-12">
          <button
            type="button"
            onClick={() => switchTab("photos")}
            className={`font-display text-[13px] sm:text-[15px] font-medium transition ${
              tab === "photos" ? "text-brand-navy" : "text-brand-bunker/60 hover:text-brand-navy"
            }`}
          >
            All Photos
          </button>
          <button
            type="button"
            onClick={() => hasFloorPlan && switchTab("floorplan")}
            disabled={!hasFloorPlan}
            className={`font-display text-[13px] sm:text-[15px] font-medium transition ${
              tab === "floorplan"
                ? "text-brand-navy"
                : hasFloorPlan
                  ? "text-brand-bunker/60 hover:text-brand-navy"
                  : "text-brand-bunker/25 cursor-not-allowed"
            }`}
          >
            Floor Plan{hasFloorPlan ? "" : " (none)"}
          </button>
        </div>
        <span className="font-display text-[13px] text-brand-bunker/70">
          {safeIndex + 1} of {source.length}
        </span>
      </div>

      {/* Main image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)] bg-brand-soft">
        <PropertyImage
          src={current}
          fallback={fallback}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 960px"
          className="object-cover"
        />
        {source.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-bunker shadow transition hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-bunker shadow transition hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {source.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {source.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-[68px] w-[100px] shrink-0 overflow-hidden rounded-[8px] transition ${
                i === safeIndex ? "ring-2 ring-brand-navy" : "opacity-70 hover:opacity-100"
              }`}
            >
              <PropertyImage
                src={src}
                fallback={fallback}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
