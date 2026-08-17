"use client";

import { useEffect } from "react";

export function ScrollToResults() {
  useEffect(() => {
    const el = document.getElementById("results");
    if (!el) return;
    // Wait for layout to settle so the offset is correct.
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return null;
}
