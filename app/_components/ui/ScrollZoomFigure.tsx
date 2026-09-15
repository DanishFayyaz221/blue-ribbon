"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-linked "grow into place" figure, ported from studio-foundry.sujen.co's
 * hero treatment.
 *
 * Two effects run together:
 *
 * 1. The FRAME scales up from `from` to 1 as it enters view, so the whole
 *    picture grows into place rather than arriving at full size. The reference
 *    eases this out, so it decelerates as it settles instead of tracking the
 *    wheel linearly.
 * 2. The IMAGE inside holds a constant zoom and drifts vertically, which is
 *    the same parallax ParallaxFigure does — except the reference derives the
 *    travel distance from the zoom rather than picking it independently:
 *    travel = (zoom - 1) / 2 of the image's height, i.e. exactly the overhang
 *    the zoom creates. That is what makes the drift self-limiting; it can
 *    never expose an edge, at any zoom, because it can only ever consume the
 *    slack it was given.
 *
 * The frame's own scale is deliberately NOT applied to the drifting layer.
 * Nesting them keeps each transform independent, so the growth cannot amplify
 * the drift past its calculated bound.
 *
 * GSAP loads on demand so it stays off the critical path, and never loads at
 * all for visitors who prefer reduced motion.
 */
export function ScrollZoomFigure({
  children,
  className = "",
  /** Frame scale when the section first enters view, easing to 1. */
  from = 0.8,
  /**
   * Constant zoom held by the image, which also sets its drift distance.
   *
   * Set to 1 to disable the drift entirely. That is what a figure using
   * `object-contain` needs: its whole point is that no part of the image is
   * cut off, and any zoom above 1 enlarges the image past the frame and
   * clips it again — defeating the fit.
   */
  zoom = 1.2,
  /** Seconds the motion takes to catch up to its scroll-derived target. */
  scrub = 0.3,
  /**
   * Grow the image inside a fixed frame rather than growing the frame itself.
   *
   * Use this wherever the frame is anchored to something — a page edge, a
   * neighbouring column, a rounded corner that has to stay put. Scaling the
   * frame there would pull it off its anchor and open a gap; scaling the
   * image keeps the frame exactly where it is, and the clip absorbs the
   * overspill. Full-bleed figures want the default, where the frame itself
   * grows and the surround shows through symmetrically.
   */
  scaleInner = false,
  suppressHydrationWarning,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  zoom?: number;
  scrub?: number;
  scaleInner?: boolean;
  suppressHydrationWarning?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

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

      // The frame grows as it rises, finishing exactly as its top reaches the
      // top of the screen — for a figure about one screen tall, the moment it
      // becomes fully visible, so the motion resolves while the image is in
      // front of you. `power1.out` is the reference's easing: a gentle
      // deceleration rather than a snap.
      // `scaleInner` runs the growth on the layer and INVERTS it: the image
      // starts oversized and settles to its natural size. Going the other way
      // would shrink it inside a frame it is meant to fill, exposing the
      // frame's own background at the edges. The overspill on the way in is
      // clipped, so the effect reads as the photo easing back rather than the
      // block changing size.
      const growTarget = scaleInner ? layer : frame;
      const growFrom = scaleInner ? 1 + (1 - from) : from;

      const grow = gsap.fromTo(
        growTarget,
        { scale: growFrom },
        {
          scale: 1,
          ease: "power1.out",
          force3D: true,
          immediateRender: false,
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "top top",
            scrub,
            invalidateOnRefresh: true,
          },
        },
      );

      // The image holds its zoom and drifts within the slack that zoom
      // created: (zoom - 1) / 2 of its height per edge.
      //
      // Expressed in PIXELS, as the reference does, not yPercent. GSAP folds
      // a percentage translate into the same matrix as the scale, so the
      // browser multiplies it by the zoom — a 10% drift becomes 12% of the
      // frame against only 10% of overhang, and the top edge lifts into view
      // by the 2% difference. A pixel offset is not scaled, so the drift stays
      // exactly within the slack the zoom created.
      //
      // `* 0.94` keeps a little back rather than spending the overhang to the
      // last pixel, so sub-pixel rounding at the extremes cannot show a seam.
      const travelPx = () => ((zoom - 1) / 2) * frame.offsetHeight * 0.94;
      // At zoom 1 there is no overhang, so there is nothing to drift within —
      // moving the layer would only pull the image off its own frame.
      // Skipped when `scaleInner` owns the layer: both tweens write `scale`
      // to the same element, and the later one would simply overwrite the
      // other. A figure that grows its image inward does not need the drift
      // as well — the growth is already the motion.
      const drift =
        zoom > 1 && !scaleInner
          ? gsap.fromTo(
              layer,
              { y: () => -travelPx(), scale: zoom },
              {
                y: () => travelPx(),
                scale: zoom,
                ease: "none",
                force3D: true,
                immediateRender: false,
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub,
                  invalidateOnRefresh: true,
                },
              },
            )
          : null;

      const img = frame.querySelector("img");
      const onLoad = () => ScrollTrigger.refresh();
      if (img && !img.complete) img.addEventListener("load", onLoad, { once: true });

      cleanup = () => {
        img?.removeEventListener("load", onLoad);
        grow.scrollTrigger?.kill();
        grow.kill();
        drift?.scrollTrigger?.kill();
        drift?.kill();
        gsap.set([frame, layer], { clearProps: "transform" });
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [from, zoom, scrub, scaleInner]);

  return (
    <div
      ref={frameRef}
      className={className}
      suppressHydrationWarning={suppressHydrationWarning}
    >
      <div ref={layerRef} className="absolute inset-0 will-change-transform">
        {children}
      </div>
    </div>
  );
}
