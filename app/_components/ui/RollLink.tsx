"use client";

import { Fragment, useEffect, useRef, useState, type AnchorHTMLAttributes } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  /** Plain text. A "\n" starts a new mask that can wrap onto its own line. */
  children: string;
  /**
   * Put every newline-separated segment on its own line rather than letting
   * them sit inline and wrap as units — for a link that is laid out as
   * lines, like the footer's two-line address.
   */
  lines?: boolean;
  /**
   * Play the roll once as the link scrolls into view, wherever there is no
   * hover to trigger it — a touch device, or the phone layout at any width,
   * which is what a desktop browser's device emulator shows. On a wide
   * hover-capable screen this is ignored and the pointer-driven roll stands.
   */
  autoplayOnScroll?: boolean;
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
export function RollLink({
  children,
  className = "",
  lines = false,
  autoplayOnScroll = false,
  ...rest
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  // Re-runs the setup below when the layout crosses the phone breakpoint, so
  // toggling a browser's device emulator (or resizing a window) switches
  // between the hover roll and the scroll roll instead of keeping whichever
  // was wired at mount.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canHover = window.matchMedia("(hover: hover)").matches;
    // Without hover there is nothing to drive the roll, so the link is left
    // alone unless the caller asked for the scroll-triggered play.
    if (!canHover && !autoplayOnScroll) return;

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

      // Whether the scroll-triggered play runs is a question about the
      // VIEWPORT, not about the input device. It used to be gated on
      // `!canHover`, which is false in a desktop browser's phone emulator —
      // the mouse is still there — so the roll never played while testing a
      // phone layout, and never on a laptop's narrow window either. Width is
      // what the caller actually means by "on the phone layout".
      const scrollPlay = autoplayOnScroll && (!canHover || narrow);

      if (scrollPlay) {
        // Play the roll once, when the link reaches the viewport. It ends on
        // the duplicate copy, which reads identically — the roll is the
        // motion, not a change of label.
        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              tl.play();
              io.disconnect();
            }
          },
          { rootMargin: "0px 0px -15% 0px", threshold: 0 },
        );
        io.observe(el);
        cleanup = () => {
          io.disconnect();
          tl.kill();
          gsap.set([...top, ...bottom], { clearProps: "transform" });
        };
        return;
      }

      // No hover and no scroll play: nothing can drive the roll, so leave the
      // link alone rather than wiring pointer events that will never fire.
      if (!canHover) return;

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
  }, [autoplayOnScroll, narrow]);

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
          {s > 0 && !lines && " "}
          <span
            aria-hidden
            className={`relative overflow-hidden whitespace-nowrap ${
              lines ? "block" : "inline-block align-top"
            }`}
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
