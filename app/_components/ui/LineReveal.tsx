"use client";

import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";

type Props = {
  /** Plain text. A "\n" forces a line break; everything else wraps naturally. */
  children: string;
  /** Block-level tag to render — h1, h2, p, div… Masks are block elements, so
   *  an inline `as` would break the surrounding layout. */
  as?: ElementType;
  className?: string;
  /** Seconds to wait before the first line starts. */
  delay?: number;
  /** Seconds between consecutive lines. Kononenko's Si(1) = 0.1s. */
  stagger?: number;
  /** Seconds for one line to travel. Kononenko's Si(6) = 1.109s. */
  duration?: number;
  /** false → play as soon as the text is measured, not when it scrolls into
   *  view. For above-the-fold copy that must not wait for an observer. */
  trigger?: boolean;
};

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Line-mask text reveal, modelled on kononenkogroup.com's `linereveal`
 * directive (GSAP SplitText, type/mask "lines", from yPercent 101 → 0).
 *
 * SSR renders the words inline so the markup is crawlable and hydrates with
 * no mismatch. After hydration (and after web fonts settle, since they change
 * where lines break) each word's offsetTop is read and words sharing a top are
 * grouped into a line; the element re-renders as one overflow-hidden mask per
 * line with the line sitting just below the mask. When the element enters the
 * viewport the lines slide up in a stagger. Re-measured when the width or the
 * font size changes so a resize never leaves a mask mid-line.
 *
 * Until measured, `html.reveal-armed .lr:not(.lr-ready)` hides the element in
 * CSS (same gate the site's other reveals use), so there is no flash of
 * unmasked text between first paint and the first animation frame.
 */
export function LineReveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  stagger = 0.1,
  duration = 1.109,
  trigger = true,
}: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [inView, setInView] = useState(false);
  // Bumped whenever the measured width changes so the layout effect re-runs.
  const [measureKey, setMeasureKey] = useState(0);

  const words = tokenize(children);

  // Measure once words are laid out. Fonts first: Poppins swaps in late and a
  // different glyph width moves the wrap points, which would leave a mask
  // holding a line and a half.
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || lines !== null) return;

    let cancelled = false;
    const measure = () => {
      if (cancelled || !rootRef.current) return;
      const spans = Array.from(
        rootRef.current.querySelectorAll<HTMLElement>("[data-lr-w]"),
      );
      if (spans.length === 0) return;
      const grouped: string[][] = [];
      let lastTop: number | null = null;
      for (const span of spans) {
        const top = span.offsetTop;
        if (lastTop === null || Math.abs(top - lastTop) > 1) {
          grouped.push([]);
          lastTop = top;
        }
        grouped[grouped.length - 1]!.push(span.textContent ?? "");
      }
      setLines(grouped.map((g) => g.join(" ")));
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
  }, [children, lines, measureKey]);

  // Width change → drop the lines so the effect above re-measures.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    let lastWidth = root.getBoundingClientRect().width;
    let lastFont = getComputedStyle(root).fontSize;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? lastWidth;
      // A viewport-scaled font (clamp/vw) can change size while a max-width
      // holds the element's width still. The wrap points move all the same,
      // so the font size is compared too — the observer fires either way,
      // because a font change moves the element's height.
      const font = getComputedStyle(root).fontSize;
      if (Math.abs(w - lastWidth) < 1 && font === lastFont) return;
      lastWidth = w;
      lastFont = font;
      setLines(null);
      setMeasureKey((k) => k + 1);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  // Reveal on scroll. Kononenko's ScrollTrigger default is
  // `start: "top bottom-=15%"` — the element's top crossing 85% of the
  // viewport height — which is rootMargin bottom -15% here. Plays once.
  useEffect(() => {
    if (lines === null || inView) return;
    const root = rootRef.current;
    // No scroll trigger (or no observer support): reveal on the next frame.
    // Deferring one frame lets the masked start state paint first, so the
    // slide actually transitions instead of mounting at its resting position.
    if (!trigger || !root || typeof IntersectionObserver === "undefined") {
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
    io.observe(root);
    return () => io.disconnect();
  }, [lines, inView, trigger]);

  const ready = lines !== null;
  const style = {
    "--lr-dur": `${duration}s`,
  } as CSSProperties;

  return (
    <Tag
      ref={rootRef}
      className={`lr${ready ? " lr-ready" : ""}${inView ? " lr-in" : ""} ${className}`.trim()}
      style={style}
      suppressHydrationWarning
    >
      {ready
        ? lines.map((line, i) => (
            <span key={i} className="lr-mask">
              <span
                className="lr-line"
                style={{ transitionDelay: `${delay + i * stagger}s` }}
              >
                {line}
              </span>
            </span>
          ))
        : words.map((w, i) =>
            w === "\n" ? (
              <br key={i} />
            ) : (
              // The space sits BETWEEN the word boxes, not inside them. Each
              // word is an inline-block, and a trailing space inside an
              // inline-block is trimmed at the box's own line end — the words
              // would then be measured packed edge to edge, a line would take
              // one or two words more than the rendered text can hold, and
              // the mask would wrap it into two rows.
              <Fragment key={i}>
                <span className="lr-w" data-lr-w="">
                  {w}
                </span>{" "}
              </Fragment>
            ),
          )}
    </Tag>
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
  out.pop(); // trailing "\n" from the last segment
  return out;
}
