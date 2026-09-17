"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  /** One node per slide. */
  items: ReactNode[];
  ariaLabel?: string;
  className?: string;
  /**
   * CSS width of one slide. "100%" shows one slide per view; a narrower
   * value (e.g. "62vw") centres the current slide with its neighbours
   * peeking in from the sides.
   */
  slideWidth?: string;
  /** CSS gap between slides. */
  gap?: string;
  /** Rendered between the slides and the arrows. */
  between?: ReactNode;
  /** Show the round prev/next arrows beneath the slides. */
  arrows?: boolean;
  /** Scale for every slide but the current one; 1 leaves them alone. */
  restScale?: number;
  /** Arrow colour: dark outlines on a light ground, white on a dark one. */
  tone?: "light" | "dark";
  /**
   * Layout classes for the arrow row — position and margin. Centred beneath
   * the slides by default; the team page pulls it up beside the card's
   * details, where the comp puts it.
   */
  arrowsClassName?: string;
};

/**
 * Phone carousel from the mobile comp: slides step one at a time under a
 * pair of large round outlined arrows, and swipe as well. Native scroll with
 * snap points does the moving, so it is as smooth as the platform makes it
 * and needs no frame loop; the arrows only ask the viewport to scroll to the
 * next slide. Stepping past either end wraps around.
 *
 * The current slide is read back from the scroll position (the slide whose
 * centre is nearest the viewport's), which keeps the arrows and the swipe in
 * step and lets the peeking neighbours scale down and back as they pass.
 */
export function MobileCarousel({
  items,
  ariaLabel,
  className = "",
  slideWidth = "100%",
  gap = "16px",
  between,
  arrows = true,
  restScale = 1,
  tone = "light",
  arrowsClassName = "mt-[24px] justify-center",
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = items.length;
  const peek = slideWidth !== "100%";

  const slides = useCallback(
    () => Array.from(viewportRef.current?.querySelectorAll<HTMLElement>("[data-slide]") ?? []),
    [],
  );

  // Track the current slide from the scroll position, one read per frame.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = viewport.scrollLeft + viewport.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      slides().forEach((el, i) => {
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setIndex((cur) => (cur === best ? cur : best));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      viewport.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [slides]);

  const goTo = (i: number) => {
    const viewport = viewportRef.current;
    const el = slides()[((i % count) + count) % count];
    if (!viewport || !el) return;
    viewport.scrollTo({
      left: el.offsetLeft + el.offsetWidth / 2 - viewport.clientWidth / 2,
      behavior: "smooth",
    });
  };

  return (
    <div className={className}>
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        style={{
          gap,
          // A narrower slide is centred by padding the track either side.
          paddingInline: peek ? `calc((100% - ${slideWidth}) / 2)` : undefined,
          scrollSnapType: "x mandatory",
          overscrollBehaviorX: "contain",
          touchAction: "pan-x pan-y",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            data-slide=""
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className="shrink-0 snap-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: slideWidth,
              transform: restScale !== 1 && i !== index ? `scale(${restScale})` : undefined,
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {between}

      {arrows && count > 1 && (
        // The two arrows sit close together, near enough to read as a pair.
        <div className={`relative z-10 flex items-center gap-[8px] ${arrowsClassName}`}>
          <RoundArrow direction="prev" tone={tone} onClick={() => goTo(index - 1)} />
          <RoundArrow direction="next" tone={tone} onClick={() => goTo(index + 1)} />
        </div>
      )}
    </div>
  );
}

function RoundArrow({
  direction,
  tone,
  onClick,
}: {
  direction: "prev" | "next";
  tone: "light" | "dark";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className={`flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full border transition active:scale-95 ${
        tone === "dark" ? "border-white/80 text-white" : "border-brand-bunker/80 text-brand-bunker"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-[20px] w-[20px] ${direction === "next" ? "-scale-x-100" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <line x1="20" y1="12" x2="4" y2="12" />
        <polyline points="10 6 4 12 10 18" />
      </svg>
    </button>
  );
}
