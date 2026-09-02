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
    let scanFrame = 0;

    // On any back/forward or bfcache restore, reveal EVERYTHING immediately.
    // Losing the scroll-in animation on a back navigation is fine; leaving the
    // page blank is not. Running at several delays covers the case where Next
    // swaps in the RSC payload after the event has already fired.
    const revealAll = () => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.reveal-in), .reveal-scale:not(.reveal-in)")
        .forEach((el) => el.classList.add("reveal-in"));
    };
    const onNavRestore = () => {
      revealAll();
      requestAnimationFrame(revealAll);
      setTimeout(revealAll, 100);
      setTimeout(revealAll, 400);
    };
    window.addEventListener("pageshow", onNavRestore);
    window.addEventListener("popstate", onNavRestore);

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
            const rect = el.getBoundingClientRect();
            if (rect.top < vh && rect.bottom > 0) {
              el.classList.add("reveal-in");
              return;
            }
            observer?.observe(el);
          });
      };
      scan();

      // Never scan straight off the mutation. A streamed <Suspense> boundary
      // lands in the DOM one task before React hydrates it, and MutationObserver
      // fires on the microtask in between — adding reveal-in there would leave
      // the DOM ahead of the server HTML at the moment React checks it, which is
      // exactly the hydration mismatch this defers past.
      const queueScan = () => {
        if (scanFrame) return;
        // Reassigned rather than nested-and-forgotten so the id stays truthy
        // across both frames — it doubles as the "already queued" guard and as
        // the handle cleanup cancels.
        scanFrame = requestAnimationFrame(() => {
          scanFrame = requestAnimationFrame(() => {
            scanFrame = 0;
            scan();
          });
        });
      };

      mo = new MutationObserver(queueScan);
      mo.observe(document.body, { childList: true, subtree: true });
    }));

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scanFrame);
      observer?.disconnect();
      mo?.disconnect();
      window.removeEventListener("pageshow", onNavRestore);
      window.removeEventListener("popstate", onNavRestore);
    };
  }, []);

  return null;
}
