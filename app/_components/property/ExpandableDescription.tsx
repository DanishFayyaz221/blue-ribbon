"use client";

import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type Props = {
  text: string;
  className?: string;
  collapsedHeight?: number;
  collapseScrollOffset?: number;
};

/** One measured line: its text and where it sits inside the clip box. */
type Line = { text: string; top: number };

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Collapsible copy with a "View more" that plays the site's line-mask reveal
 * on the lines it uncovers.
 *
 * The box animates its height as before. The text inside is measured into
 * lines the way LineReveal does — words laid out as inline blocks, grouped by
 * their top offset, then re-rendered one overflow-hidden mask per line. The
 * lines that already show in the collapsed box sit still; the ones beneath it
 * start just below their masks and slide up into place, one after another,
 * the moment "View more" is clicked. "View less" parks them below their masks
 * again, out of sight behind the shrinking box, ready for the next click.
 *
 * Paragraph breaks (blank lines) keep their spacing as separate <p>s; single
 * line breaks are honoured as forced breaks in the measurement.
 */
export function ExpandableDescription({
  text,
  className = "",
  collapsedHeight = 160,
  collapseScrollOffset = 300,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState<number | null>(null);
  /** Measured lines per paragraph; null until measured (and after a resize). */
  const [paragraphs, setParagraphs] = useState<Line[][] | null>(null);
  const [measureKey, setMeasureKey] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const shouldScrollAfterCollapse = useRef(false);

  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  /*
   * Measure content height
   */
  useEffect(() => {
    if (!innerRef.current) return;

    const updateHeight = () => {
      if (!innerRef.current) return;

      setFullHeight(innerRef.current.scrollHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);

    resizeObserver.observe(innerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [text]);

  /*
   * Measure the lines. Fonts first: a late-swapping face moves the wrap
   * points, which would leave a mask holding a line and a half.
   */
  useIsoLayoutEffect(() => {
    if (paragraphs !== null || !innerRef.current) return;

    let cancelled = false;
    const measure = () => {
      if (cancelled || !innerRef.current) return;
      const paras = Array.from(
        innerRef.current.querySelectorAll<HTMLElement>("[data-para]"),
      );
      if (paras.length === 0) return;
      const result: Line[][] = paras.map((para) => {
        const spans = Array.from(para.querySelectorAll<HTMLElement>("[data-w]"));
        const lines: Line[] = [];
        let lastTop: number | null = null;
        for (const span of spans) {
          // offsetTop is measured from the clip box, the nearest positioned
          // ancestor — the same frame the collapsed height is in.
          const top = span.offsetTop;
          if (lastTop === null || Math.abs(top - lastTop) > 1) {
            lines.push({ text: "", top });
            lastTop = top;
          }
          const line = lines[lines.length - 1]!;
          const word = span.textContent ?? "";
          line.text = line.text ? `${line.text} ${word}` : word;
        }
        return lines;
      });
      setParagraphs(result);
    };

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts && fonts.status !== "loaded") {
      fonts.ready.then(measure);
    } else {
      measure();
    }
    return () => {
      cancelled = true;
    };
    // measureKey is the deliberate re-run trigger from the ResizeObserver.
  }, [text, paragraphs, measureKey]);

  /*
   * Width change → the wrap points move, so drop the lines and re-measure.
   */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof ResizeObserver === "undefined") return;
    let lastWidth = wrapper.getBoundingClientRect().width;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? lastWidth;
      if (Math.abs(w - lastWidth) < 1) return;
      lastWidth = w;
      setParagraphs(null);
      setMeasureKey((k) => k + 1);
    });
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  /*
   * Does the content need View More / View Less?
   */
  const needsCollapse =
    fullHeight !== null && fullHeight > collapsedHeight;

  /*
   * Current animated height
   */
  const currentHeight =
    !needsCollapse || expanded
      ? (fullHeight ?? collapsedHeight)
      : collapsedHeight;

  /*
   * VIEW MORE
   */
  const handleViewMore = () => {
    shouldScrollAfterCollapse.current = false;

    setExpanded(true);
  };

  /*
   * VIEW LESS
   */
  const handleViewLess = () => {
    /*
     * We only mark it as a collapse.
     * Actual scrolling happens after the height
     * animation has completed.
     */
    shouldScrollAfterCollapse.current = true;

    setExpanded(false);
  };

  /*
   * After collapse animation
   */
  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>
  ) => {
    if (event.propertyName !== "height") return;

    if (!shouldScrollAfterCollapse.current) return;

    shouldScrollAfterCollapse.current = false;

    const target = wrapperRef.current;

    if (!target) return;

    /*
     * Get the final position AFTER the collapse.
     *
     * This prevents the footer/map position from
     * affecting the calculation.
     */
    const rect = target.getBoundingClientRect();

    const absoluteTop = window.scrollY + rect.top;

    /*
     * SAME working 300px offset.
     */
    const targetScrollPosition =
      absoluteTop - collapseScrollOffset;

    /*
     * Smoothly go to the target.
     */
    window.scrollTo({
      top: Math.max(0, targetScrollPosition),
      behavior: "smooth",
    });
  };

  /*
   * The lines the collapsed box hides. Their reveal is staggered like
   * LineReveal's (0.1s a line) but capped so a long description still lands
   * within about a second of the click.
   */
  const hiddenCount = paragraphs
    ? paragraphs.flat().filter((l) => l.top >= collapsedHeight).length
    : 0;
  const stagger = hiddenCount > 0 ? Math.min(0.1, 1 / hiddenCount) : 0.1;
  let hiddenIndex = 0;

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        /*
         * Prevent browser scroll anchoring from
         * changing the page position automatically.
         */
        overflowAnchor: "none",
      }}
    >
      <div
        className="relative overflow-hidden"
        onTransitionEnd={handleTransitionEnd}
        style={{
          height: `${currentHeight}px`,

          transition:
            fullHeight !== null
              ? "height 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
              : "none",

          /*
           * Important:
           * Browser should NOT automatically adjust
           * scroll position because this element changes height.
           */
          overflowAnchor: "none",
        }}
      >
        <div ref={innerRef}>
          {paragraphs
            ? paragraphs.map((lines, pi) => (
                <p key={pi} className={pi > 0 ? "mt-[1lh]" : undefined}>
                  {lines.map((line, li) => {
                    // A line the collapsed box already shows never moves.
                    const shown = line.top < collapsedHeight;
                    const isIn = shown || expanded;
                    const delay = !shown && expanded ? hiddenIndex++ * stagger : 0;
                    return (
                      <span key={li} className="lr-mask">
                        <span
                          className="lr-line"
                          style={{
                            transform: isIn ? "translate3d(0, 0, 0)" : undefined,
                            transitionDelay: `${delay.toFixed(3)}s`,
                          }}
                        >
                          {line.text}
                        </span>
                      </span>
                    );
                  })}
                </p>
              ))
            : blocks.map((block, pi) => (
                // Pre-measure render: each word its own inline block so its
                // top can be read; the space sits between the boxes, as
                // LineReveal does, so the lines measure as they will wrap.
                <p key={pi} data-para="" className={pi > 0 ? "mt-[1lh]" : undefined}>
                  {tokenize(block).map((w, i) =>
                    w === "\n" ? (
                      <br key={i} />
                    ) : (
                      <Fragment key={i}>
                        <span className="lr-w" data-w="">
                          {w}
                        </span>{" "}
                      </Fragment>
                    ),
                  )}
                </p>
              ))}
        </div>

        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-20
            bg-linear-to-t
            from-white
            to-transparent
            transition-opacity
            duration-500
            ease-out
          "
          style={{
            opacity: needsCollapse && !expanded ? 1 : 0,
          }}
        />
      </div>

      {needsCollapse && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={
              expanded
                ? handleViewLess
                : handleViewMore
            }
            className="
              inline-flex
              h-[38px]
              items-center
              justify-center
              gap-[6px]
              rounded-full
              border
              border-brand-navy/20
              bg-white
              px-[22px]
              font-display
              text-[13px]
              font-semibold
              text-brand-navy
              transition-all
              duration-300
              hover:bg-brand-soft
              hover:border-brand-navy/40
            "
          >
            {expanded ? "View less" : "View more"}
          </button>
        </div>
      )}
    </div>
  );
}

/** Split on whitespace, keeping "\n" as its own token so it renders a <br>. */
function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const segment of text.split("\n")) {
    for (const w of segment.trim().split(/\s+/)) {
      if (w) out.push(w);
    }
    out.push("\n");
  }
  out.pop();
  return out;
}
