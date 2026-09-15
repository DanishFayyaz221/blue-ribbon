"use client";

import { Fragment, useEffect, useRef, type AnchorHTMLAttributes } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  /** Plain text. A "\n" starts a new mask that can wrap onto its own line. */
  children: string;
};

/**
 * Text-roll hover link, ported from studio-foundry.sujen.co's footer contact
 * links (`.roll-link` / `[data-roll]`).
 *
 * The label is rendered twice inside an overflow-hidden mask: the visible copy
 * on top, a duplicate sat one line below it. On hover every character of the
 * top copy rolls up out of the mask while its twin rolls up into place — left
 * to right, 20ms apart, 0.4s each on power1.inOut — and a hairline draws in
 * under the link from the left (globals.css). Leaving reverses the timeline
 * from wherever it is, so a quick brush of the pointer rolls back only as far
 * as it got, last character first.
 *
 * The reference splits into characters with SplitText at runtime; here the
 * split happens at render, so the markup hydrates as-is and nothing has to be
 * measured after fonts load. Spaces stay as plain text, as SplitText leaves
 * them, so they neither move nor count towards the stagger.
 *
 * Rolling only works within a single line — a character that rolled up out of
 * a second line would land in the first. A "\n" in the label therefore starts
 * a new mask; the masks sit inline and wrap as units, so a long label can
 * break across lines on a phone without a character ever crossing a line.
 *
 * GSAP loads on demand, and not at all for visitors who prefer reduced motion
 * or whose device has no hover to speak of.
 */
export function RollLink({ children, className = "", ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      const top = Array.from(el.querySelectorAll<HTMLElement>("[data-top] [data-char]"));
      const bottom = Array.from(el.querySelectorAll<HTMLElement>("[data-bottom] [data-char]"));

      // The stylesheet parks the duplicate one line down with a percentage
      // translate. GSAP reads that back from the computed matrix as a pixel
      // offset it would then keep, so `y: 0` discards it here and the same
      // position is re-expressed as the percentage the tween animates.
      gsap.set(top, { y: 0, yPercent: 0 });
      gsap.set(bottom, { y: 0, yPercent: 100 });

      const tl = gsap.timeline({ paused: true });
      tl.to(top, { yPercent: -100, duration: 0.4, ease: "power1.inOut", stagger: 0.02 }, 0);
      tl.to(bottom, { yPercent: 0, duration: 0.4, ease: "power1.inOut", stagger: 0.02 }, 0);

      const onEnter = () => tl.play();
      const onLeave = () => tl.reverse();
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);

      cleanup = () => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
        tl.kill();
        gsap.set([...top, ...bottom], { clearProps: "transform" });
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  const segments = children.split("\n");
  const chars = (text: string) =>
    Array.from(text).map((ch, i) =>
      ch === " " ? (
        " "
      ) : (
        <span key={i} data-char="" className="inline-block">
          {ch}
        </span>
      ),
    );

  return (
    <a
      ref={ref}
      {...rest}
      aria-label={children.replace(/\n/g, " ")}
      className={`roll-link relative inline-block ${className}`.trim()}
    >
      {segments.map((segment, s) => (
        <Fragment key={s}>
          {s > 0 && " "}
          <span
            aria-hidden
            className="relative inline-block overflow-hidden align-top whitespace-nowrap"
          >
            <span className="relative block" data-roll="">
              <span className="block" data-top="">
                {chars(segment)}
              </span>
              <span className="absolute left-0 top-0 block" data-bottom="">
                {chars(segment)}
              </span>
            </span>
          </span>
        </Fragment>
      ))}
    </a>
  );
}
