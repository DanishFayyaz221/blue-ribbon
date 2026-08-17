"use client";

import { useEffect, useLayoutEffect } from "react";

// Runs during the commit phase — early enough to strip stale classes before
// React fires its hydration mismatch check. Falls back to useEffect on the
// server where useLayoutEffect would warn.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function RevealOnScroll() {
  useIsoLayoutEffect(() => {
    // Strip any reveal-in classes injected before hydration (bfcache, HMR,
    // browser extensions, dev overlay) so hydration diffs cleanly.
    document
      .querySelectorAll<HTMLElement>(".reveal.reveal-in, .reveal-scale.reveal-in")
      .forEach((el) => el.classList.remove("reveal-in"));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let observer: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;

    // If the browser restored us from bfcache, reveal everything so nothing
    // disappears when someone hits Back.
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      document
        .querySelectorAll<HTMLElement>(".reveal, .reveal-scale")
        .forEach((el) => el.classList.add("reveal-in"));
    };
    window.addEventListener("pageshow", onPageShow);

    // Strip any reveal-in classes injected before hydration (bfcache, HMR,
    // browser extensions) so the DOM matches the server render.
    document
      .querySelectorAll<HTMLElement>(".reveal.reveal-in, .reveal-scale.reveal-in")
      .forEach((el) => el.classList.remove("reveal-in"));

    // Wait two frames — React has finished the hydration commit by then, so
    // any class we toggle here can't cause a mismatch warning.
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document
          .querySelectorAll<HTMLElement>(".reveal, .reveal-scale")
          .forEach((el) => el.classList.add("reveal-in"));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-in");
              observer?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
      );

      const scan = () => {
        const vh = window.innerHeight;
        document
          .querySelectorAll<HTMLElement>(
            ".reveal:not(.reveal-in), .reveal-scale:not(.reveal-in)",
          )
          .forEach((el) => {
            // If we land on the page already scrolled past this element (bfcache /
            // browser back), reveal it immediately instead of leaving it invisible.
            const rect = el.getBoundingClientRect();
            if (rect.top < vh && rect.bottom > 0) {
              el.classList.add("reveal-in");
              return;
            }
            observer?.observe(el);
          });
      };
      scan();

      mo = new MutationObserver(scan);
      mo.observe(document.body, { childList: true, subtree: true });
    }));

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      mo?.disconnect();
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
