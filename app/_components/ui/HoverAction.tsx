"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Text in the cursor-following pill. */
  label?: string;
  /** Classes for the frame: size, radius, clipping. */
  className?: string;
};

/** The pill sits this far below the cursor, as the reference places it. */
const OFFSET_Y = 30;

/**
 * Hover treatment ported from storeyarchitecture.co.uk's project tiles
 * (their `StyleHoveringAction` component), value for value.
 *
 * Three things happen together while the pointer is over the frame:
 *
 * 1. The media shrinks to 90% over 0.65s (power2.out) inside the frame's dark
 *    ground, so a border of it shows around the photo, and eases back to full
 *    size over 0.4s on leave.
 * 2. A white pill with the label and a dotted ring fades in over 0.5s and
 *    follows the pointer, 30px beneath it, trailing by 0.2s — GSAP `quickTo`,
 *    so every mouse move retargets the same tween instead of starting one.
 *    It keeps its place on scroll and resize, since the pointer may not move.
 * 3. Each frame the ring turns to face the direction the pill is travelling,
 *    by the shortest way round, trailing by 0.35s.
 *
 * Pointer-only: nothing is wired on touch devices, where there is no hover to
 * begin with, or for visitors who prefer reduced motion. GSAP loads on demand.
 */
export function HoverAction({ children, label = "View photos", className = "" }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  /** Follows the pointer. */
  const followerRef = useRef<HTMLDivElement>(null);
  /** Fades in and out. */
  const pillRef = useRef<HTMLDivElement>(null);
  /** Turns toward the direction of travel. */
  const ringRef = useRef<HTMLDivElement>(null);
  /** Shrinks on hover. */
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const follower = followerRef.current;
    const pill = pillRef.current;
    const ring = ringRef.current;
    const media = mediaRef.current;
    if (!frame || !follower || !pill || !ring || !media) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      const cursor = { x: 0, y: 0 };
      let hovering = false;
      let lastX = 0;
      let lastY = 0;

      const toX = gsap.quickTo(follower, "x", { duration: 0.2, ease: "power2.out" });
      const toY = gsap.quickTo(follower, "y", { duration: 0.2, ease: "power2.out" });
      const toRotation = gsap.quickTo(ring, "rotation", { duration: 0.35, ease: "power2.out" });

      const place = () => {
        if (!hovering) return;
        const r = frame.getBoundingClientRect();
        toX(cursor.x - r.left);
        toY(cursor.y - r.top + OFFSET_Y);
      };

      const tick = () => {
        if (!hovering) return;
        const x = Number(gsap.getProperty(follower, "x"));
        const y = Number(gsap.getProperty(follower, "y"));
        const dx = x - lastX;
        const dy = y - lastY;
        if (dx * dx + dy * dy >= 1) {
          const target = Math.atan2(dy, dx) * (180 / Math.PI);
          const current = Number(gsap.getProperty(ring, "rotation")) || 0;
          let delta = target - current;
          while (delta > 180) delta -= 360;
          while (delta < -180) delta += 360;
          toRotation(current + delta);
        }
        lastX = x;
        lastY = y;
      };

      const onMove = (e: MouseEvent) => {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
        place();
      };
      const onEnter = (e: MouseEvent) => {
        hovering = true;
        cursor.x = e.clientX;
        cursor.y = e.clientY;
        const r = frame.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top + OFFSET_Y;
        gsap.set(follower, { x, y });
        lastX = x;
        lastY = y;
        gsap.to(pill, { opacity: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        gsap.to(media, { scale: 0.9, duration: 0.65, ease: "power2.out", overwrite: "auto" });
      };
      const onLeave = () => {
        hovering = false;
        gsap.to(pill, { opacity: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        gsap.to(media, { scale: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
      };

      frame.addEventListener("mousemove", onMove);
      frame.addEventListener("mouseenter", onEnter);
      frame.addEventListener("mouseleave", onLeave);
      gsap.ticker.add(tick);
      document.addEventListener("scroll", place, { passive: true, capture: true });
      window.addEventListener("resize", place, { passive: true });

      cleanup = () => {
        frame.removeEventListener("mousemove", onMove);
        frame.removeEventListener("mouseenter", onEnter);
        frame.removeEventListener("mouseleave", onLeave);
        gsap.ticker.remove(tick);
        document.removeEventListener("scroll", place, { capture: true });
        window.removeEventListener("resize", place);
        gsap.killTweensOf([pill, media, follower, ring]);
        gsap.set([media, follower, ring], { clearProps: "transform" });
        gsap.set(pill, { clearProps: "opacity" });
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={frameRef} className={`relative overflow-hidden bg-brand-bunker ${className}`.trim()}>
      <div ref={followerRef} className="pointer-events-none absolute left-0 top-0 z-10">
        <div ref={pillRef} className="w-fit rounded-full bg-white opacity-0">
          <div className="flex items-center justify-between gap-[2.5vw] px-[1vw] py-[0.4vw]">
            <span className="whitespace-nowrap font-display text-[13px] font-medium text-brand-bunker">
              {label}
            </span>
            <div ref={ringRef} className="h-auto w-[1.5vw] min-w-[14px] origin-center text-brand-bunker">
              {/* Eight dashes on a ring, so the turn toward the travel
                  direction reads; the reference's own mark. */}
              <svg viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect x="7.43848" width="2.20921" height="1.68095" fill="currentColor" />
                <rect x="7.43848" y="15.3193" width="2.20921" height="1.68095" fill="currentColor" />
                <rect width="2.20969" height="1.68059" transform="matrix(0.695977 0.718064 -0.717774 0.696276 13.8682 1.68164)" fill="currentColor" />
                <rect width="2.20968" height="1.6806" transform="matrix(0.706959 -0.707254 0.706959 0.707254 1.68066 3.21094)" fill="currentColor" />
                <rect width="2.20967" height="1.6806" transform="matrix(-0.70979 0.704413 -0.704117 -0.710084 15.415 13.7402)" fill="currentColor" />
                <rect width="2.20968" height="1.6806" transform="matrix(-0.706959 -0.707254 0.706959 -0.707254 3.24316 15.3271)" fill="currentColor" />
                <rect width="2.21014" height="1.68025" transform="matrix(0.00383073 0.999993 -0.999993 0.00383392 16.9854 7.37891)" fill="currentColor" />
                <rect width="2.21014" height="1.68025" transform="matrix(0.00383073 0.999993 -0.999993 0.00383392 1.68066 7.37891)" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div ref={mediaRef} className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
