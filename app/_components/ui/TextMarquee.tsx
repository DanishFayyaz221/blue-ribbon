/**
 * Full-bleed scrolling text band: `label` repeated on one track, twice over.
 * The track slides by half its own width and loops, so the loop point lands
 * exactly where the second run begins and the seam never shows (see
 * .animate-marquee in globals.css; it stands still under reduced motion).
 *
 * Decorative — callers that need the words for assistive tech render their
 * own sr-only heading beside it.
 */
export function TextMarquee({
  label,
  repeat = 6,
  className = "",
}: {
  label: string;
  /** Enough that one run is wider than any viewport the band loops on. */
  repeat?: number;
  className?: string;
}) {
  const items = Array.from({ length: repeat }, () => label);
  return (
    <div aria-hidden className={`w-full overflow-hidden ${className}`}>
      <div className="animate-marquee flex w-max">
        {[0, 1].map((run) => (
          <div key={run} className="flex shrink-0 items-center">
            {items.map((text, i) => (
              <span
                key={i}
                className="flex items-center whitespace-nowrap font-display font-bold leading-none text-white text-[clamp(44px,6vw,110px)]"
              >
                {text}
                <span className="mx-[0.35em] text-[0.55em]">&bull;</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
