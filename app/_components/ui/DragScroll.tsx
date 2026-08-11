"use client";

import { useRef, type ReactNode } from "react";

/**
 * Horizontal scroller that also works with mouse drag. Touch devices already
 * scroll natively; this only kicks in for pointerType "mouse", where browsers
 * offer no built-in drag-to-scroll. Snap is suspended during the drag because
 * scroll-snap fights manual scrollLeft updates, and a post-drag click is
 * swallowed so dragging over a card link doesn't navigate.
 */
export function DragScroll({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0 });

  return (
    <div
      ref={ref}
      className={className}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        drag.current = {
          down: true,
          moved: false,
          startX: e.clientX,
          startLeft: ref.current.scrollLeft,
        };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d.down || e.pointerType !== "mouse" || !ref.current) return;
        const dx = e.clientX - d.startX;
        if (!d.moved && Math.abs(dx) < 4) return;
        d.moved = true;
        ref.current.style.scrollSnapType = "none";
        ref.current.scrollLeft = d.startLeft - dx;
      }}
      onPointerUp={() => {
        drag.current.down = false;
        ref.current?.style.removeProperty("scroll-snap-type");
      }}
      onPointerLeave={() => {
        drag.current.down = false;
        ref.current?.style.removeProperty("scroll-snap-type");
      }}
      onClickCapture={(e) => {
        if (!drag.current.moved) return;
        drag.current.moved = false;
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}
