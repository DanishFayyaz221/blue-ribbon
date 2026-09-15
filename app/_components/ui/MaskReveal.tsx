"use client";

import {
  Children,
  Fragment,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

/**
 * True once `ref`'s element has crossed 85% of the viewport height (the
 * site's line-reveal trigger — rootMargin bottom -15%), and stays true.
 *
 * Shared by MaskReveal and by components that place `.lr-mask` / `.lr-line`
 * markup of their own, where the masked pieces are not siblings that one
 * MaskReveal could wrap — the contact form's field labels, each inside its
 * own field, are the case in point.
 */
export function useInViewOnce(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    // No element (or no observer support): reveal on the next frame, after
    // the masked start state has painted, so the slide transitions instead
    // of mounting at rest.
    if (!el || typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, inView]);

  return inView;
}

type Props = {
  /** Block rows to reveal in order — each lands in its own mask. Fragments
   *  are unwrapped, so a conditional `<>…</>` of rows counts as its rows. */
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the first row starts. */
  delay?: number;
  /** Seconds between consecutive rows. Kononenko's Si(1) = 0.1s. */
  stagger?: number;
  /** Seconds for one row to travel. Kononenko's Si(6) = 1.109s. */
  duration?: number;
};

/**
 * Line-mask reveal for a stack of block rows: the `LineReveal` motion (same
 * mask, travel and easing, same 85%-of-viewport trigger) applied to whole
 * elements instead of to the wrapped lines of one string.
 *
 * It exists because `LineReveal` needs plain text. It regroups the words into
 * per-line masks after measuring them, so it cannot hold the listing card's
 * meta row (icons and numbers), and those masks become block children of the
 * element — on a phone a `line-clamp-2` address, which clamps a single
 * block's own lines, would then run to its full height. Here every row keeps
 * its own element, classes and clamp, the mask wraps it, and the row slides
 * up inside as a unit. A two-line address rises as one piece rather than two
 * staggered lines; that is the trade for keeping the clamp.
 *
 * Nothing is measured, so the element is ready from the first render and
 * never hidden behind the `html.reveal-armed .lr:not(.lr-ready)` gate — the
 * rows simply sit below their masks until the reveal.
 */
export function MaskReveal({
  children,
  className = "",
  delay = 0,
  stagger = 0.1,
  duration = 1.109,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(rootRef);

  const rows = flattenRows(children);
  const style = { "--lr-dur": `${duration}s` } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={`lr lr-ready${inView ? " lr-in" : ""} ${className}`.trim()}
      style={style}
    >
      {rows.map((row, i) => (
        // div, not span: the rows are <p>s, and a block inside an inline
        // element is invalid nesting even when the inline is styled as block.
        <div key={i} className="lr-mask">
          <div
            className="lr-line"
            style={{ transitionDelay: `${delay + i * stagger}s` }}
          >
            {row}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * One entry per row. `Children.toArray` already drops null/false (a
 * conditional `{type && <p>}` that came out empty) but keeps a Fragment as a
 * single node, and the card passes its rows inside one — so fragments are
 * unwrapped recursively.
 */
function flattenRows(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isValidElement(child) && child.type === Fragment
      ? flattenRows((child.props as { children?: ReactNode }).children)
      : [child],
  );
}
