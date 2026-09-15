"use client";

import { useEffect, useRef } from "react";
import { CardGallery } from "./CardGallery";

/**
 * Scroll-linked parallax for a listing card's photo layer.
 *
 * The sibling of `ParallaxFigure`, split out because a card is not a plain
 * figure: `CardGallery` renders arrows and progress dots over the photos, and
 * transforming a shared ancestor would drag those along with the image. So
 * this component animates the gallery's own media layer (the sliding photo
 * track, controls excluded) through the `mediaRef` seam, exactly as the
 * Parramatta featured card does for its 3D tilt.
 *
 * It renders `CardGallery` itself rather than taking it as a child. The
 * caller, `PropertyCard`, is a server component, so the ref cannot be handed
 * back across the boundary — a render prop would serialise as a function and
 * React rejects that with "Functions are not valid as a child of Client
 * Components". Owning the gallery keeps every prop that crosses the boundary
 * a plain serialisable value.
 *
 * Because the track already carries a `translate3d(-N*100%, 0, 0)` for the
 * active frame, the parallax is written with `yPercent`/`scale` — GSAP keeps
 * those as separate transform components and composes them with the inline
 * X translate rather than overwriting it, so sliding and drifting coexist.
 *
 * Motion values follow the realevate reference's `category-values__figure`
 * treatment (8% travel, 0.3s scrub) — the gentle variant, which is what this
 * strip wants: these cards sit directly above their own address and price,
 * and the full-bleed 20%/1.2 setting would fight that copy.
 */
export function ParallaxMedia({
  images,
  alt,
  sizes,
  imageClassName = "",
  /** Vertical drift as a percentage of the layer's height, applied ±. */
  travelY = 8,
  /**
   * Scale at the START of the scroll range, easing to `scaleEnd`.
   *
   * Both ends sit above 1 on purpose. Unlike ParallaxFigure, whose moving
   * layer is inset negatively past its frame, this layer is pinned to
   * `inset-0` (it has to be — it holds the gallery's sliding track), so the
   * zoom is the only thing holding an overhang. A layer at scale S overhangs
   * by (S-1)/2 per edge, and drifting by y needs that overhang to exceed y.
   * Easing all the way to 1 therefore cannot work at any starting scale: at
   * the end the overhang is zero while the drift is at its maximum, exposing
   * the card behind. Holding 1.2 at the end keeps ~10% overhang against an 8%
   * drift, which stays covered across the whole range.
   */
  scale = 1.3,
  /** Scale at the END of the scroll range. Must stay above 1 — see `scale`. */
  scaleEnd = 1.2,
  /** Seconds the layer takes to catch up to its scroll-derived target. */
  scrub = 0.3,
}: {
  images: string[];
  alt: string;
  sizes: string;
  imageClassName?: string;
  travelY?: number;
  scale?: number;
  scaleEnd?: number;
  scrub?: number;
}) {
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = mediaRef.current;
    if (!layer) return;
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

      const tween = gsap.fromTo(
        layer,
        { yPercent: -travelY, scale },
        {
          yPercent: travelY,
          scale: scaleEnd,
          ease: "none",
          force3D: true,
          // Driven entirely by scroll position, so it must not paint its end
          // state on mount before the trigger has been measured.
          immediateRender: false,
          scrollTrigger: {
            trigger: layer,
            start: "top bottom",
            end: "bottom top",
            scrub,
            // Listing photos arrive at their own pace; a card measured before
            // its image loads would otherwise keep stale start/end offsets.
            invalidateOnRefresh: true,
          },
        },
      );

      const img = layer.querySelector("img");
      const onLoad = () => ScrollTrigger.refresh();
      if (img && !img.complete) img.addEventListener("load", onLoad, { once: true });

      cleanup = () => {
        img?.removeEventListener("load", onLoad);
        tween.scrollTrigger?.kill();
        tween.kill();
        // Only the parallax's own properties are cleared. `clearProps:
        // "transform"` would also wipe the track's inline slide offset and
        // snap the gallery back to its first frame on unmount.
        gsap.set(layer, { clearProps: "yPercent,scale" });
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [travelY, scale, scaleEnd, scrub]);

  return (
    // `parallax-layer` lets the `.focus-peers` hover rule blur this layer
    // directly. It is drawn 1.2–1.3× larger than the card, so it has the
    // overhang a filter blur needs and the blur scales with the zoom.
    <CardGallery
      mediaClassName="parallax-layer"
      images={images}
      alt={alt}
      sizes={sizes}
      imageClassName={imageClassName}
      mediaRef={mediaRef}
    />
  );
}
