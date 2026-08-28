"use client";

import { useState } from "react";

type Props = {
  text: string;
  /**
   * Approximate paragraph count to reveal before collapsing. Split on any run
   * of blank lines — the copy uses either "\n\n" or a bare "\n" between blocks
   * depending on the feed.
   */
  previewParagraphs?: number;
  className?: string;
  /** Height of the visible preview, in px. Fixed so the fade always lands at
   *  the same place across listings — otherwise a two-line paragraph looks
   *  cut off and a ten-line one leaves no reason to click. */
  collapsedHeight?: number;
};

/**
 * Property descriptions from the feed run long — five to ten paragraphs is
 * typical. Showing them in full pushes the sidebar's Enquire / Share buttons
 * far below the fold. Collapsing to a fixed preview with a soft fade at the
 * bottom keeps the page compact while making it obvious there is more copy.
 */
export function ExpandableDescription({
  text,
  previewParagraphs = 2,
  className = "",
  collapsedHeight = 220,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  // Detect whether the copy is long enough to bother collapsing. A short
  // description gets rendered plain, without the button, so a two-paragraph
  // listing never shows a "View more" that does nothing.
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const shouldCollapse = paragraphs.length > previewParagraphs;

  if (!shouldCollapse) {
    return (
      <p className={`whitespace-pre-line ${className}`}>{text}</p>
    );
  }

  return (
    <div className={className}>
      <div
        className="relative overflow-hidden transition-[max-height] duration-500 ease-out"
        style={{ maxHeight: expanded ? "9999px" : `${collapsedHeight}px` }}
      >
        <p className="whitespace-pre-line">{text}</p>
        {!expanded && (
          // Bottom fade: hides the hard cut that a fixed maxHeight would
          // otherwise leave, so the copy reads as fading out rather than
          // being sliced.
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[110px] bg-gradient-to-t from-white via-white/85 to-transparent" />
        )}
      </div>
      <div className="mt-[12px] flex justify-center">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="inline-flex h-[38px] items-center justify-center rounded-full border border-brand-navy/20 bg-white px-[22px] font-display text-[13px] font-semibold text-brand-navy transition hover:bg-brand-soft"
        >
          {expanded ? "View less" : "View more"}
        </button>
      </div>
    </div>
  );
}
