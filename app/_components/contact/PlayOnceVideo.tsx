"use client";

import { useEffect, useRef } from "react";

/**
 * Films that have already played in this page load. Module state, so it
 * survives client-side navigation (leaving the page and coming back) but not
 * a reload — a reload is a fresh visit and plays the film again.
 */
const played = new Set<string>();

/**
 * A muted background film that plays through once and then rests on its last
 * frame. Coming back to the page without reloading shows that last frame
 * instead of replaying it.
 *
 * No `autoPlay` attribute: the server cannot know whether this visit has seen
 * the film, and an autoplaying element would start running before the effect
 * could stop it. The effect starts it instead — muted, so browsers allow
 * play() without a gesture.
 */
export function PlayOnceVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (!played.has(src)) {
      played.add(src);
      video.play().catch(() => {});
      return;
    }

    // Already seen: park on the closing frame. Seeking to `duration` itself
    // paints black in some browsers, so stop a hair short of it.
    const toEnd = () => {
      if (Number.isFinite(video.duration)) video.currentTime = Math.max(0, video.duration - 0.05);
    };
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) toEnd();
    else video.addEventListener("loadedmetadata", toEnd, { once: true });
    return () => video.removeEventListener("loadedmetadata", toEnd);
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
