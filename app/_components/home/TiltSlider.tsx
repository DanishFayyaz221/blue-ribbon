"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

type Props = {
  /** One node per slide. Rendered three times (clones either side) so the
   *  row can wrap seamlessly. */
  items: ReactNode[];
  /** CSS width of one slide from `sm` up, e.g. "clamp(300px, 28vw, 440px)". */
  slideWidth: string;
  /** CSS width of one slide below `sm`. */
  slideWidthMobile?: string;
  /** CSS gap between slides. */
  gap?: string;
  ariaLabel?: string;
  className?: string;
  /**
   * Pixels per second the row glides on its own while it is on screen and
   * the pointer is not over it. 0 leaves it to scroll, drag and the arrows.
   * The glide runs in the same direction as the "next" arrow, pauses while
   * the visitor hovers, drags or steps, and picks up again afterwards.
   */
  autoplay?: number;
  /** Show the prev/next arrows. Off where the row glides by itself. */
  arrows?: boolean;
  /**
   * Glide the row sideways with the page scroll while it is on screen (the
   * reference behaviour). Off, the row moves only by the glide, a drag, the
   * wheel or the arrows.
   */
  scrollLink?: boolean;
};

// Motion constants, lifted from realevate.agency's projects slider so the
// feel matches the reference exactly rather than approximately.
const ARROW_MS = 500;
const ARROW_EASE = cubicBezier(0.31, 0.04, 0, 0.99);
/** Horizontal px moved per vertical px scrolled while the section is on screen. */
const SCROLL_RATIO = 1;
/** The section counts as "in view" up to this fraction of a viewport below it. */
const IN_VIEW_MARGIN = 0.12;
const DRAG_MULT = 2.5;
const FLING_MULT = 1200;
/** px/ms — releases slower than this settle instead of flinging. */
const FLING_MIN_VELOCITY = 0.15;
const LERP_DRAGGING = 0.08;
const LERP_SETTLING = 0.12;
const DRAG_THRESHOLD = 5;
const FRICTION = 0.94;
const WHEEL_MULT = 0.8;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Tilted, scroll-linked, infinitely looping row — a port of the slider on
 * realevate.agency's category pages.
 *
 * How it moves:
 * - While the section is on screen, the row glides sideways 1:1 with the
 *   page's vertical scroll (scroll down → offset shrinks → the track slides
 *   to the right, same sign as the reference). Off screen it holds its
 *   position, so it never drifts while you read something else.
 * - Grab and drag horizontally (mouse or touch). Releasing with speed flings
 *   the row on with friction; releasing slowly settles it where it is.
 *   Vertical swipes fall through to the page.
 * - Horizontal wheel / shift+wheel nudges it. The arrows step one slide and
 *   snap to the slide nearest the centre.
 * - Three copies of the slides sit on the track and the offset is folded
 *   back into the middle copy's range every frame, so the loop is seamless.
 *
 * The tilt itself is pure CSS (`rotate` on the track, the inverse on each
 * item — see .tilt-slider in globals.css); the per-frame transform written
 * here is only a translate, so the two compose without fighting.
 */
export function TiltSlider({
  items,
  slideWidth,
  slideWidthMobile = "78vw",
  gap = "clamp(18px, 1.6vw, 32px)",
  ariaLabel,
  className = "",
  autoplay = 0,
  arrows = true,
  scrollLink = true,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Read by the frame loop through refs, so the loop is wired once.
  const autoplayRef = useRef(autoplay);
  const scrollLinkRef = useRef(scrollLink);
  useEffect(() => {
    autoplayRef.current = autoplay;
    scrollLinkRef.current = scrollLink;
  });
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const api = useRef<{ step: (dir: 1 | -1) => void } | null>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!root || !viewport || !track) return;
    const originals = Array.from(
      track.querySelectorAll<HTMLElement>("[data-main]"),
    );
    const count = originals.length;
    if (!count) return;

    // Geometry (px, in track coordinates before the tilt is applied).
    let step = 0; // distance between neighbouring slide centres
    let setWidth = 0; // width of one full set of slides
    let home = 0; // offset that centres slide 0 of the middle set
    // Motion state.
    let rendered = 0; // offset currently painted
    let target = 0; // offset we are easing towards
    let base = 0; // user-added offset (drag / wheel) on top of the scroll link
    let anchorOffset = 0; // offset when the scroll link was last re-anchored
    let anchorScroll = 0; // scrollY at that moment
    let velocity = 0; // fling velocity, px/s
    let interactive = false; // drag/fling in progress → eased, not scroll-linked
    let dragging = false;
    let moved = false;
    let horizontal = false;
    let animating = false; // arrow step in flight
    let wasInView = false;
    let hovered = false; // pointer over the row → the glide pauses
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animToken = 0;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastT = 0;
    let avgVelocity = 0;
    const samples: number[] = [];
    let alive = true;

    const scrollY = () => window.scrollY;
    const render = () => {
      track.style.transform = `translate3d(${-rendered}px, 0, 0)`;
    };
    // The reference tests the whole gallery section, heading included, so
    // the row starts drifting as soon as the section's top crosses the
    // margin — not only once the row itself does.
    const viewRoot = root.closest("section") ?? root;
    const inView = () => {
      const r = viewRoot.getBoundingClientRect();
      const vh = window.innerHeight;
      return r.bottom > 0 && r.top <= vh + vh * IN_VIEW_MARGIN;
    };
    const centerOf = (i: number) => {
      const el = originals[i];
      return el
        ? track.offsetLeft + el.offsetLeft + el.offsetWidth / 2 - viewport.clientWidth / 2
        : home;
    };
    const nearest = (offset: number) => {
      const mid = viewport.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < count; i++) {
        const el = originals[i]!;
        const c = track.offsetLeft + el.offsetLeft - offset + el.offsetWidth / 2;
        const d = Math.abs(c - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return best;
    };
    // Fold the offset back into the middle set's range. Every copy is
    // identical, so shifting by a whole set is invisible.
    const wrap = () => {
      if (!setWidth) return;
      const lo = home;
      const hi = home + setWidth;
      while (target >= hi) {
        target -= setWidth;
        rendered -= setWidth;
        base -= setWidth;
      }
      while (target < lo) {
        target += setWidth;
        rendered += setWidth;
        base += setWidth;
      }
    };
    const scrollLinked = () =>
      anchorOffset -
      (scrollY() - anchorScroll) * (scrollLinkRef.current ? SCROLL_RATIO : 0);
    const linked = () => (inView() ? scrollLinked() : anchorOffset);
    const followScroll = () => {
      target = linked() + base;
      rendered = target;
      wrap();
    };
    const anchor = () => {
      anchorOffset = rendered - base;
      anchorScroll = scrollY();
    };
    const leaveInteractive = () => {
      interactive = false;
      base = target - linked();
      anchor();
    };
    const cancelDrag = () => {
      if (!dragging) return;
      dragging = false;
      moved = false;
      horizontal = false;
      viewport.classList.remove("is-dragging");
    };

    const measure = () => {
      const a = originals[0]!;
      const b = originals[1];
      const s = b
        ? b.offsetLeft - a.offsetLeft
        : a.offsetWidth + (parseFloat(getComputedStyle(track).gap) || 0);
      const w = s * count;
      if (w && setWidth) {
        // Re-measure (resize): keep the visitor's place relative to the
        // slide they were looking at.
        const prevHome = home;
        const prevRendered = rendered;
        step = s;
        setWidth = w;
        home = centerOf(0);
        const d = home - prevHome;
        if (d) {
          rendered = prevRendered + d;
          target = rendered;
          anchorOffset += d;
        }
        anchor();
      } else {
        step = s;
        setWidth = w;
        home = centerOf(0);
        target = rendered = anchorOffset = home;
        anchorScroll = scrollY();
        base = 0;
        wasInView = inView();
      }
      wrap();
      render();
    };

    const readRendered = () => {
      const m = track.style.transform.match(/translate3d\((-?[\d.]+)px/);
      if (!m) return rendered;
      const v = -parseFloat(m[1]!);
      rendered = v;
      target = v;
      return v;
    };

    const snapTarget = (from: number, dir: 1 | -1) => {
      if (!step || !setWidth) return from;
      const idx = (nearest(from) + dir + count * 2) % count;
      let to = centerOf(idx);
      const d = to - from;
      if (d > setWidth / 2) to -= setWidth;
      else if (d < -setWidth / 2) to += setWidth;
      return to;
    };

    const stepTo = (dir: 1 | -1) => {
      if (dragging) return;
      velocity = 0;
      if (interactive) {
        rendered = target;
        leaveInteractive();
      }
      const from = readRendered();
      anchor();
      base = from - linked();
      interactive = false;
      const token = ++animToken;
      animating = true;
      const to = snapTarget(from, dir);
      const t0 = performance.now();
      const frame = (now: number) => {
        if (token !== animToken || !alive) return;
        const p = Math.min((now - t0) / ARROW_MS, 1);
        rendered = from + (to - from) * ARROW_EASE(p);
        target = rendered;
        render();
        if (p < 1) {
          requestAnimationFrame(frame);
        } else {
          animating = false;
          rendered = target = to;
          base = to - linked();
          anchor();
          wrap();
          render();
        }
      };
      requestAnimationFrame(frame);
    };

    const isControl = (t: EventTarget | null) =>
      !!(t as HTMLElement | null)?.closest?.("button, a, input, textarea, select");

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (isControl(e.target)) return;
      animToken++;
      animating = false;
      anchor();
      dragging = true;
      moved = false;
      horizontal = false;
      velocity = 0;
      avgVelocity = 0;
      samples.length = 0;
      target = rendered;
      startX = e.clientX;
      startY = e.clientY;
      lastX = startX;
      lastT = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!horizontal) {
        const ax = Math.abs(dx);
        const ay = Math.abs(dy);
        if (ax > ay && ax > DRAG_THRESHOLD) {
          horizontal = true;
          interactive = true;
          viewport.classList.add("is-dragging");
        } else if (ay > DRAG_THRESHOLD && ay >= ax) {
          // A vertical gesture — hand it back to the page.
          cancelDrag();
          return;
        } else {
          return;
        }
      }
      if (e.cancelable) e.preventDefault();
      moved = true;
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        samples.push((e.clientX - lastX) / dt);
        if (samples.length > 5) samples.shift();
        avgVelocity = samples.reduce((a, b) => a + b, 0) / samples.length;
      }
      lastX = e.clientX;
      lastT = now;
      target += -dx * DRAG_MULT;
      startX = e.clientX;
      startY = e.clientY;
      wrap();
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove("is-dragging");
      if (moved && Math.abs(avgVelocity) > FLING_MIN_VELOCITY) {
        velocity = -avgVelocity * FLING_MULT;
      } else {
        leaveInteractive();
      }
      moved = false;
      horizontal = false;
    };

    const onWheel = (e: WheelEvent) => {
      const ax = Math.abs(e.deltaX);
      const ay = Math.abs(e.deltaY);
      if ((ax <= ay && !e.shiftKey) || (ax < 4 && ay < 4)) return;
      e.preventDefault();
      e.stopPropagation();
      base += (e.deltaX || e.deltaY) * WHEEL_MULT;
      velocity = 0;
      followScroll();
    };

    let last = performance.now();
    const loop = (now: number) => {
      if (!alive) return;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const flinging =
        interactive && !dragging && !animating && Math.abs(velocity) > 0.5;
      if (flinging) {
        target += velocity * dt;
        velocity *= Math.pow(FRICTION, 60 * dt);
        if (Math.abs(velocity) < 0.5) velocity = 0;
        wrap();
      }
      if (!animating) {
        if (interactive) {
          const f = dragging ? LERP_DRAGGING : LERP_SETTLING;
          rendered += (target - rendered) * (1 - Math.pow(1 - f, dt * 120));
          wrap();
          if (!dragging && !flinging && Math.abs(target - rendered) < 0.5) {
            rendered = target;
            leaveInteractive();
          }
        } else {
          const iv = inView();
          if (iv && !wasInView) anchor();
          else if (!iv && wasInView) {
            anchorOffset = rendered - base;
            anchorScroll = scrollY();
          }
          wasInView = iv;
          // The glide: the visitor's own offset creeps forward each frame,
          // and followScroll folds it into the position like any drag would.
          const glide = autoplayRef.current;
          if (glide > 0 && iv && !hovered && !reduced) base += glide * dt;
          followScroll();
        }
      }
      render();
      requestAnimationFrame(loop);
    };

    // mouseenter/leave, not pointer events: a tap on a touch screen would
    // otherwise count as hovering and stall the glide until the next tap.
    const onHoverStart = () => {
      hovered = true;
    };
    const onHoverEnd = () => {
      hovered = false;
    };

    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("mouseenter", onHoverStart);
    viewport.addEventListener("mouseleave", onHoverEnd);
    window.addEventListener("pointermove", onMove, { capture: true, passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    viewport.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", measure);
    const imgs = Array.from(track.querySelectorAll("img"));
    const onImg = () => measure();
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onImg, { once: true });
    });

    api.current = { step: stepTo };
    measure();
    anchor();
    requestAnimationFrame(loop);

    return () => {
      alive = false;
      api.current = null;
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("mouseenter", onHoverStart);
      viewport.removeEventListener("mouseleave", onHoverEnd);
      window.removeEventListener("pointermove", onMove, { capture: true });
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      viewport.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", measure);
      imgs.forEach((img) => img.removeEventListener("load", onImg));
    };
  }, []);

  const style = {
    "--slide-w-desktop": slideWidth,
    "--slide-w-mobile": slideWidthMobile,
    "--slide-gap": gap,
  } as CSSProperties;

  const sets = ["a", "b", "c"] as const;

  return (
    <div
      ref={rootRef}
      className={`tilt-slider relative w-full ${className}`.trim()}
      style={style}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div ref={viewportRef} className="tilt-slider__viewport">
        <div ref={trackRef} className="tilt-slider__track">
          {sets.map((set) =>
            items.map((node, i) => (
              <div
                key={`${set}-${i}`}
                className="tilt-slider__item"
                data-main={set === "b" ? "" : undefined}
                aria-hidden={set !== "b" || undefined}
              >
                {node}
              </div>
            )),
          )}
        </div>
      </div>

      {/* Arrows sit on the slider's bottom edge like the reference: 12.5vw
          from the right from `sm` up, centred beneath the row on phones. */}
      {arrows && (
      <div className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 items-center gap-[clamp(8px,0.5vw,14px)] sm:left-auto sm:right-[12.5vw] sm:translate-x-0">
        <button
          type="button"
          onClick={() => api.current?.step(-1)}
          aria-label="Previous"
          className="flex h-[clamp(48px,3.472vw,68px)] w-[clamp(48px,3.472vw,68px)] cursor-pointer items-center justify-center rounded-full bg-white text-[#251F20] shadow-[0_4px_18px_rgba(0,0,0,0.15)] transition hover:scale-105"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[20px] w-[20px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => api.current?.step(1)}
          aria-label="Next"
          className="flex h-[clamp(48px,3.472vw,68px)] w-[clamp(48px,3.472vw,68px)] cursor-pointer items-center justify-center rounded-full bg-white text-[#251F20] shadow-[0_4px_18px_rgba(0,0,0,0.15)] transition hover:scale-105"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[20px] w-[20px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      )}
    </div>
  );
}

/** CSS cubic-bezier as a JS easing function (Newton–Raphson on the x curve). */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x;
      if (Math.abs(err) < 1e-5) break;
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    return sampleY(Math.min(1, Math.max(0, t)));
  };
}
