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
  /**
   * Show a row of dots beneath the slides instead of the arrows — one per
   * slide, the current one filled. Swipe is the way through either way; dots
   * take less room and read as position rather than as controls.
   */
  dots?: boolean;
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
  /** Fires with the slide index whenever the current slide changes. */
  onIndexChange?: (index: number) => void;
  /**
   * Handed a `next()` the caller can invoke to advance the carousel — for a
   * slide that decides for itself when it is done, like a card cycling its
   * own photos before the row moves on.
   */
  controlsRef?: (controls: { next: () => void }) => void;
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
  dots = false,
  restScale = 1,
  tone = "light",
  arrowsClassName = "mt-[24px] justify-center",
  onIndexChange,
  controlsRef,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = items.length;
  const peek = slideWidth !== "100%";

  const slides = useCallback(
    () => Array.from(viewportRef.current?.querySelectorAll<HTMLElement>("[data-slide]") ?? []),
    [],
  );

  // Drag with a mouse, as well as swiping with a finger. Touch already pans
  // the track natively; a pointer does not, so on a desktop browser — and in
  // its phone emulator, which is how this layout gets looked at — the only
  // way through was the dots. This drives the same native scrollLeft, so
  // snapping, the index read below and the dots all keep working unchanged.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    // Set once the pointer has actually travelled. A click on a dot or a tile
    // registers as a pointerdown too, so the drag only takes over after a few
    // pixels — below that the link underneath keeps its click.
    let moved = false;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = viewport.scrollLeft;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved) {
        if (Math.abs(dx) < 4) return;
        moved = true;
        // Only capture once this is definitely a drag, so a plain click is
        // never swallowed. Snapping is suspended for the duration, or the
        // track fights the pointer on every frame.
        viewport.setPointerCapture(e.pointerId);
        viewport.style.scrollSnapType = "none";
        viewport.style.cursor = "grabbing";
        viewport.style.userSelect = "none";
      }
      viewport.scrollLeft = startLeft - dx;
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (!moved) return;
      if (viewport.hasPointerCapture(e.pointerId)) {
        viewport.releasePointerCapture(e.pointerId);
      }
      viewport.style.scrollSnapType = "";
      viewport.style.cursor = "";
      viewport.style.userSelect = "";
      // Settle on whichever slide the release landed nearest — restoring snap
      // alone does not move an already-scrolled track in every browser.
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
      const el = slides()[best];
      if (el) {
        viewport.scrollTo({
          left: el.offsetLeft + el.offsetWidth / 2 - viewport.clientWidth / 2,
          behavior: "smooth",
        });
      }
    };

    // A drag that ends over a tile must not also open it.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    // Slides are links wrapping images, and the browser's own drag-and-drop
    // would otherwise start on the first pixel of movement and take the
    // pointer with it — leaving a ghost image and no scrolling at all.
    const onDragStart = (e: Event) => e.preventDefault();

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("click", onClick, true);
    viewport.addEventListener("dragstart", onDragStart);
    return () => {
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("click", onClick, true);
      viewport.removeEventListener("dragstart", onDragStart);
    };
  }, [slides]);

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

  // Both of these are read through refs so the effects below depend on
  // nothing a parent re-render would change: a caller that passes inline
  // functions would otherwise re-run them on each of its own renders.
  const goToRef = useRef(goTo);
  const indexChangeRef = useRef(onIndexChange);
  // The live index for the handle below, which must not close over a stale
  // one. Written in the effect, not during render, as the compiler's ref rule
  // requires — the handle is only ever called from a timer, long after.
  const indexRef = useRef(index);
  useEffect(() => {
    goToRef.current = goTo;
    indexChangeRef.current = onIndexChange;
    indexRef.current = index;
  });

  useEffect(() => {
    indexChangeRef.current?.(index);
  }, [index]);

  useEffect(() => {
    if (!controlsRef) return;
    controlsRef({ next: () => goToRef.current(indexRef.current + 1) });
  }, [controlsRef]);

  return (
    <div className={className}>
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        className="no-scrollbar flex cursor-grab snap-x snap-mandatory overflow-x-auto"
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

      {dots && count > 1 ? (
        // Dots take the arrows' place: still tappable, but they read as
        // "where you are" first and as a control second. The hit area is
        // padded out to a comfortable size while the dot itself stays small.
        <div
          className={`relative z-10 flex items-center justify-center gap-[2px] ${arrowsClassName}`}
        >
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className="group flex h-[24px] w-[20px] cursor-pointer items-center justify-center"
            >
              <span
                className={`block h-[7px] w-[7px] rounded-full transition-all duration-300 ${
                  i === index
                    ? tone === "dark"
                      ? "bg-white"
                      : "bg-brand-bunker"
                    : tone === "dark"
                      ? "bg-white/35"
                      : "bg-brand-bunker/25"
                }`}
              />
            </button>
          ))}
        </div>
      ) : arrows && count > 1 ? (
        // The two arrows sit close together, near enough to read as a pair.
        <div className={`relative z-10 flex items-center gap-[8px] ${arrowsClassName}`}>
          <RoundArrow direction="prev" tone={tone} onClick={() => goTo(index - 1)} />
          <RoundArrow direction="next" tone={tone} onClick={() => goTo(index + 1)} />
        </div>
      ) : null}
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
      // Opaque, not just an outlined ring. Where the row is pulled up over
      // the slides (the team page overlays it on the card) a see-through
      // button let the photo slide past inside it, which read as the control
      // breaking up rather than as one moving behind the other.
      className={`flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full border transition active:scale-95 ${
        tone === "dark"
          ? "border-white/80 bg-brand-navy text-white"
          : "border-brand-bunker/80 bg-white text-brand-bunker"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-[16px] w-[16px] ${direction === "next" ? "-scale-x-100" : ""}`}
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
