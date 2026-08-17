"use client";

import { useEffect } from "react";

export function ScrollEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    const update = () => {
      const y = window.scrollY;

      // Parallax media — moves ~30% slower than scroll, subtle scale down
      const parallaxNodes = document.querySelectorAll<HTMLElement>(".parallax-media");
      parallaxNodes.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // Only animate while the element is roughly on screen
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const offset = Math.max(-200, Math.min(200, rect.top * -0.15));
        el.style.setProperty("--parallax-y", `${offset}px`);
        el.style.setProperty("--parallax-scale", `${1 + Math.min(0.06, y / 12000)}`);
      });

      // Scale-in-on-scroll — grows from 0.96 to 1 as element enters viewport
      const scaleNodes = document.querySelectorAll<HTMLElement>(".scroll-scale-in");
      scaleNodes.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.bottom < 0 || rect.top > vh) {
          el.style.setProperty("--ss-scale", "0.96");
          return;
        }
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.6)));
        const scale = 0.96 + progress * 0.04;
        el.style.setProperty("--ss-scale", scale.toFixed(4));
      });

      // Nav shrink toggle
      const nav = document.querySelector<HTMLElement>(".nav-shrink");
      if (nav) {
        nav.setAttribute("data-scrolled", y > 24 ? "true" : "false");
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
