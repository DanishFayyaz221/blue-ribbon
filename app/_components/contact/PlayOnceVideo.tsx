"use client";

import { useEffect, useRef } from "react";

/**
 * A muted background film that plays through once and then rests on its last
 * frame, rather than looping.
 *
 * "Once" means once per opening of the page, not once per session: the film
 * used to be remembered in module state, so returning to the page by
 * client-side navigation showed a frozen last frame instead of playing — the
 * page read as broken, since nothing announces that the still is the end of a
 * film you saw a few clicks ago. Every arrival now plays it; only looping is
 * suppressed.
 *
 * No `autoPlay` attribute: the effect starts it instead, and rewinds first so
 * an element restored with a used currentTime (a bfcache restore, or React
 * reusing the node) starts from the top rather than sitting at the end.
 * Muted, so browsers allow play() without a gesture.
 */
export function PlayOnceVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const start = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    // A video restored from the bfcache keeps its paused, played-out state,
    // and no effect re-runs on that restore — so ask for it again there too.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) start();
    };
    window.addEventListener("pageshow", onPageShow);

    start();
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      preload="auto"
      aria-hidden
      className={className}
    />
  );
}
