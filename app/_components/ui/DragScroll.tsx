"use client";

import { useRef, type ReactNode } from "react";

/**
 * Horizontal scroller with manual drag for BOTH mouse and touch. Native touch
 * scrolling works on most devices, but overlay links inside listing cards can
 * swallow touch events on iOS Safari — so we drive the scrollLeft ourselves
 * instead of relying on native pan. Snap is suspended during the drag because
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

  const start = (clientX: number) => {
    if (!ref.current) return;
    drag.current = {
      down: true,
      moved: false,
      startX: clientX,
      startLeft: ref.current.scrollLeft,
    };
  };

  const move = (clientX: number) => {
    const d = drag.current;
    if (!d.down || !ref.current) return;
    const dx = clientX - d.startX;
    if (!d.moved && Math.abs(dx) < 4) return;
    d.moved = true;
    ref.current.style.scrollSnapType = "none";
    ref.current.scrollLeft = d.startLeft - dx;
  };

  const end = () => {
    drag.current.down = false;
    ref.current?.style.removeProperty("scroll-snap-type");
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        overscrollBehaviorX: "contain",
        touchAction: "pan-y",
        WebkitOverflowScrolling: "touch",
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") return;
        start(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        move(e.clientX);
      }}
      onPointerUp={end}
      onPointerLeave={end}
      onTouchStart={(e) => start(e.touches[0].clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      onTouchEnd={end}
      onTouchCancel={end}
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
