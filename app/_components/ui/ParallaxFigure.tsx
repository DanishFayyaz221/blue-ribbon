"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-linked parallax frame, ported from realevate.agency's
 * `category-values__figure` treatment.
 *
 * The child image is oversized relative to this frame and drifts vertically
 * inside it while easing out of a slight zoom. The frame itself never moves,
 * and `overflow-hidden` on the caller's element clips the overspill — which is
 * why the image must be larger than the frame, or the drift would expose a gap
 * at whichever edge it travels away from.
 *
 * The motion is scrub-linked, not time-based: GSAP maps it across the scroll
 * range from the frame's top entering the viewport bottom to its bottom
 * leaving the viewport top, so it plays forward on the way down and backward
 * on the way up. `scrub: 0.3` lets the image ease toward its scroll-derived
 * target over ~0.3s instead of tracking the wheel rigidly, which is what gives
 * the motion its weight.
 *
 * Defaults are the reference's own values for this layout (8% travel, 1.12
 * scale) — deliberately gentler than its full-bleed banners (20% / 1.2),
 * because a strong parallax next to body copy fights the text for attention.
 *
 * GSAP loads on demand: the import sits inside the effect so it stays out of
 * the server bundle and off the critical path, and never loads at all for
 * visitors who prefer reduced motion.
 */
export function ParallaxFigure({
  children,
  className = "",
  /** Vertical drift as a percentage of the image's own height, applied ±. */
  travelY = 8,
  /** Starting scale, easing to 1 across the scroll range. */
  scale = 1.12,
  /** Seconds the image takes to catch up to its scroll-derived target. */
  scrub = 0.3,
  /**
   * How far the moving layer extends beyond the frame on every side, as a
   * percentage. This is what stops the drift pulling an edge into view.
   *
   * It sits on the layer rather than on the image itself: a `next/image` with
   * `fill` carries its own inline `width:100%;height:100%`, so insets applied
   * to the image only shift it — it keeps the frame's size and slides off,
   * exposing the background. Growing the layer instead makes the image grow
   * with it, because `fill` measures against its positioned ancestor.
   */
  overscan = 14,
  /**
   * Where the image is held while it moves.
   *
   * `center` is the reference treatment: the image is oversized on every
   * side and drifts through the frame, so some of its top and bottom is
   * always outside the clip — up to a fifth of its height at the ends of
   * the travel. Fine for a landscape, fatal for a headshot, whose subject's
   * hair sits a few percent below the top edge.
   *
   * `top` keeps the full slide but front-loads it into the card's entry.
   * The image overhangs the frame at the top only, by the travel distance,
   * and eases out (power3) rather than tracking the scroll linearly: it
   * slides down fastest while the card is still low on the screen, and the
   * part above the frame is back inside it by the time the card is in the
   * upper half — 2% left at the halfway point, none at the top. The zoom
   * runs about the top edge, so it never lifts that edge and only ever adds
   * cover at the bottom and sides. `overscan` is ignored in this mode.
   */
  anchor = "center",
  /**
   * Forwarded to the frame. Callers whose frame also carries a `reveal` class
   * need this: RevealOnScroll adds `reveal-in` to those elements before React
   * hydrates, so without it React reports a server/client attribute mismatch.
   */
  suppressHydrationWarning,
}: {
  children: ReactNode;
  className?: string;
  travelY?: number;
  scale?: number;
  scrub?: number;
  overscan?: number;
  anchor?: "center" | "top";
  suppressHydrationWarning?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  // Top-anchored overhang, as a percentage of the frame's height: exactly the
  // distance the layer slides down, plus a hair so rounding at the end of
  // the travel can never open a seam along the top edge.
  const topOverscan = travelY * 1.02;

  useEffect(() => {
    const frame = frameRef.current;
    const layer = layerRef.current;
    if (!frame || !layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const pinned = anchor === "top";
      // Pinned: the slide is in pixels, not a percentage — a pixel offset is
      // not multiplied by the scale, so the top edge lands exactly on the
      // frame's at the end of the travel (see ScrollZoomFigure). Re-read on
      // refresh, since the frame's height follows the viewport.
      const travelPx = () => (frame.offsetHeight * topOverscan) / 100;
      // At the start the layer sits highest and the zoom about its top edge
      // is all that reaches the bottom of the frame, so the zoom has a
      // floor: scale >= (1 + 2a) / (1 + a) for an overhang of a.
      const startScale = pinned
        ? Math.max(scale, (100 + 2 * topOverscan) / (100 + topOverscan) + 0.01)
        : scale;
      const tween = gsap.fromTo(
        layer,
        pinned ? { y: () => -travelPx(), scale: startScale } : { yPercent: -travelY, scale },
        {
          ...(pinned ? { y: () => travelPx() } : { yPercent: travelY }),
          scale: 1,
          // The reference rows track the scroll linearly. Pinned portraits
          // ease out instead, which is what keeps the head clear once the
          // card is up the screen — see the `anchor` note above.
          ease: pinned ? "power3.out" : "none",
          force3D: true,
          // The tween is driven entirely by scroll position, so it must not
          // paint its end state on mount before the trigger is measured.
          immediateRender: false,
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub,
            // Listing photos arrive at their own pace; without this, a frame
            // measured before its image loads keeps stale start/end offsets.
            invalidateOnRefresh: true,
          },
        },
      );

      // A late-loading image changes the frame's height and invalidates the
      // scroll range ScrollTrigger measured on mount.
      const img = frame.querySelector("img");
      const onLoad = () => ScrollTrigger.refresh();
      if (img && !img.complete) img.addEventListener("load", onLoad, { once: true });

      cleanup = () => {
        img?.removeEventListener("load", onLoad);
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(layer, { clearProps: "transform" });
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [travelY, scale, scrub, anchor, topOverscan]);

  return (
    <div
      ref={frameRef}
      className={className}
      suppressHydrationWarning={suppressHydrationWarning}
    >
      {/* The transformed layer is separate from the frame so the frame keeps
          its own layout box and clipping while only the contents move. It is
          inset negatively so it overhangs the frame on all four sides, giving
          the drift room to travel without revealing what sits behind. */}
      <div
        ref={layerRef}
        className="absolute will-change-transform"
        style={
          anchor === "top"
            ? { top: `-${topOverscan}%`, right: 0, bottom: 0, left: 0, transformOrigin: "50% 0%" }
            : {
                top: `-${overscan}%`,
                right: `-${overscan}%`,
                bottom: `-${overscan}%`,
                left: `-${overscan}%`,
              }
        }
      >
        {children}
      </div>
    </div>
  );
}
