"use client";

import { useRef, useState, useEffect } from "react";

type Props = {
  text: string;
  className?: string;
  collapsedHeight?: number;
  collapseScrollOffset?: number;
};

export function ExpandableDescription({
  text,
  className = "",
  collapsedHeight = 160,
  collapseScrollOffset = 300,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState<number | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const shouldScrollAfterCollapse = useRef(false);

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
              ? "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
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
          <p className="whitespace-pre-line">
            {text}
          </p>
        </div>

        {needsCollapse && !expanded && (
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-20
              bg-linear-to-t
              from-white
              to-transparent
            "
          />
        )}
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
              rounded-full
              border
              border-brand-navy/20
              bg-white
              px-[22px]
              font-display
              text-[13px]
              font-semibold
              text-brand-navy
              transition
              hover:bg-brand-soft
            "
          >
            {expanded ? "View less" : "View more"}
          </button>
        </div>
      )}
    </div>
  );
}