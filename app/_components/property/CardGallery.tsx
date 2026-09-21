"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type Ref } from "react";

type Props = {
  images: string[];
  alt: string;
  sizes: string;
  /** Applied to every frame — the card's own hover zoom lives here. */
  imageClassName?: string;
  /**
   * Ref to the layer that holds the photo track (not the arrows or dots).
   * A caller can transform this layer — the featured card's 3D tilt writes
   * to it every frame — while the controls stay put and clickable.
   */
  mediaRef?: Ref<HTMLDivElement>;
  /**
   * Extra classes for that same layer. ParallaxMedia marks it so the
   * `.focus-peers` hover rule can blur the layer itself rather than the veil
   * over it — see the note there.
   */
  mediaClassName?: string;
  /**
   * Marks the lead frame as `priority` for next/image. Set this when the
   * gallery is placed above the fold (e.g. the Parramatta featured hero) so
   * Next preloads it and stops warning that the LCP image lacks priority.
   * Default false because most callers render below the fold.
   */
  priority?: boolean;
  /**
   * Cycle this card's own photos on a timer, up to this many frames (capped
   * again by how many the listing actually has). 0, the default, leaves the
   * gallery still — every card outside the phone "Explore Properties" row
   * is driven by its hover arrows and nothing else.
   */
  autoplayFrames?: number;
  /** Milliseconds each frame is held. */
  autoplayMs?: number;
  /**
   * Called once the last autoplayed frame has had its turn, so the carousel
   * around the card can move on to the next listing. The gallery resets to
   * its first frame at the same time, ready for when it comes round again.
   */
  onAutoplayEnd?: () => void;
  /**
   * Pauses the timer. A carousel passes false for the cards that are not the
   * one on screen; leave it undefined in a list, where nothing outside knows
   * which card is in view, and the gallery watches for itself instead.
   */
  autoplayActive?: boolean;
  /**
   * Show the prev/next arrows on phones too. They are desktop-only by
   * default: on a small card in a list they would cover a good share of the
   * photo for a control nobody asked for. A large single card — the featured
   * hero — is the case where they earn their place, since without them a
   * phone has no way at all into the gallery.
   */
  arrowsOnPhone?: boolean;
};

/**
 * The photo area of a listing card, browsable in place.
 *
 * Frames sit side by side on a track that slides, rather than stacked and
 * toggled. Stacking was the earlier approach and it fought the `.focus-peers`
 * hover rule, which sets opacity on every `img` at a higher specificity than
 * Tailwind's `opacity-0` and so revealed the hidden frames. On a track the
 * frames are clipped by the container instead of hidden, so that rule has
 * nothing to override.
 *
 * Frames mount progressively. A results grid can hold a dozen cards, and
 * mounting six photos each would pull ~70 images on first paint for photos
 * most visitors never advance to — so first paint costs exactly one image per
 * card, and the next frame is fetched on hover, before the arrows it belongs
 * to have even been clicked.
 */
export function CardGallery({
  images,
  alt,
  sizes,
  imageClassName = "",
  mediaRef,
  mediaClassName = "",
  priority = false,
  autoplayFrames = 0,
  autoplayMs = 2200,
  onAutoplayEnd,
  autoplayActive,
  arrowsOnPhone = false,
}: Props) {
  const [index, setIndex] = useState(0);
  /** Highest frame index mounted so far. */
  const [warm, setWarm] = useState(0);
  /** Whether this card is on screen — only consulted in the self-watch case. */
  const [seen, setSeen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const last = images.length - 1;
  /** Last frame autoplay will reach: the cap, or the gallery's end if shorter. */
  const autoLast = Math.min(last, Math.max(0, autoplayFrames - 1));
  // Told from outside when a carousel is driving, self-watched in a list.
  const watchSelf = autoplayFrames > 0 && autoplayActive === undefined;
  const active = autoplayActive ?? seen;
  const autoplaying = autoplayFrames > 0 && active;

  // List case: run only while the card is actually in view. A results page
  // can hold twenty of these, and twenty timers ticking through photos
  // nobody is looking at would fetch every one of those images for nothing.
  useEffect(() => {
    if (!watchSelf) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setSeen(entries.some((e) => e.isIntersecting)),
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [watchSelf]);
  // Autoplay needs its whole run mounted up front: the frames sit clipped
  // outside the container, where lazy loading never fetches them, and one
  // arriving just as its turn comes up shows as a blank beat. Derived rather
  // than pushed into `warm` from an effect — it is a function of the props.
  const mounted = Math.min(
    images.length,
    Math.max(warm + 1, autoplayFrames > 0 ? autoLast + 1 : 0),
  );

  const go = (next: number) => {
    // Clamped, not wrapped. On a sliding track, wrapping from the first frame
    // to the last would race the whole strip past the viewer in one step.
    const clamped = Math.max(0, Math.min(last, next));
    setIndex(clamped);
    setWarm((w) => Math.max(w, clamped + 1));
  };

  // The callback is read through a ref so the timer below depends only on
  // the frame and the flags — a parent that hands over a fresh function each
  // render would otherwise restart the countdown on every one of its renders.
  const endRef = useRef(onAutoplayEnd);
  useEffect(() => {
    endRef.current = onAutoplayEnd;
  });

  // Auto-advance: hold each frame in turn, and once the last one has had its
  // full turn tell the carousel to move on and rewind to the first frame.
  useEffect(() => {
    if (!autoplaying) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setTimeout(() => {
      if (index < autoLast) {
        setIndex(index + 1);
        setWarm((w) => Math.max(w, index + 2));
        return;
      }
      setIndex(0);
      endRef.current?.();
    }, autoplayMs);
    return () => window.clearTimeout(id);
  }, [autoplaying, index, autoLast, autoplayMs]);

  // A paused card shows its first frame, so it starts from the top when it
  // comes round again. Rendered from the flag rather than reset through an
  // effect: there is no state to unwind, and the card is off screen while it
  // is paused, so nothing is seen to jump back.
  // A card a carousel has parked shows its first frame, so it starts from the
  // top when it comes round again. A self-watching card in a list keeps the
  // frame it was on: it is only paused because it scrolled off, and rewinding
  // it would be visible on the way back up.
  const frame = autoplayFrames > 0 && autoplayActive === false ? 0 : index;

  return (
    <>
      {/* Media layer: the sliding track lives inside it, so a caller's
          transform on this layer (see mediaRef) composes with the slide. */}
      {/* In-view sentinel for the self-watching case. Its own element rather
          than sharing the media layer below: that layer already carries the
          caller's `mediaRef` (the featured card writes its 3D tilt there),
          and a ref belonging to a prop is not ours to reassign. A zero-size
          marker costs nothing and measures the same rectangle, since both are
          pinned to the card. */}
      {watchSelf && (
        <div ref={rootRef} aria-hidden className="pointer-events-none absolute inset-0" />
      )}
      <div ref={mediaRef} className={`absolute inset-0 ${mediaClassName}`.trim()}>
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{ transform: `translate3d(-${frame * 100}%, 0, 0)` }}
      >
        {images.slice(0, mounted).map((src, i) => (
          // Index, not src: a feed occasionally repeats a photo URL, and
          // duplicate keys would drop a frame.
          //
          // overflow-hidden per slide, not just on the container: the hover
          // zoom scales every mounted frame, so without it the neighbouring
          // frame grows ~6px past its own slide and shows as a sliver down
          // the edge of the one on screen.
          <div key={i} className="relative h-full w-full shrink-0 overflow-hidden">
            <Image
              src={src}
              alt={i === 0 ? alt : ""}
              aria-hidden={i !== 0}
              fill
              // The lead frame stays lazy by default so below-the-fold cards
              // cost nothing. Callers above the fold pass `priority` so Next
              // preloads the LCP image instead of warning about it. Later
              // frames are mounted deliberately and sit clipped outside the
              // container, where lazy loading would never fetch them.
              priority={i === 0 && priority}
              loading={i === 0 ? undefined : "eager"}
              sizes={sizes}
              className={`object-cover ${imageClassName}`}
            />
          </div>
        ))}
      </div>
      </div>

      {images.length > 1 && (
        <>
          <GalleryArrow
            side="left"
            label="Previous photo"
            disabled={frame === 0}
            onClick={() => go(frame - 1)}
            onPhone={arrowsOnPhone}
          />
          <GalleryArrow
            side="right"
            label="Next photo"
            disabled={frame === last}
            // Fetch the frame this arrow leads to while the pointer is still
            // travelling towards it, so the first slide is not the one that
            // waits on a network round trip. The handler sits on the arrow
            // rather than the track because the card's stretched link covers
            // the track and would swallow the pointer event first.
            onPointerEnter={() => setWarm((w) => Math.max(w, frame + 1))}
            onClick={() => go(frame + 1)}
            onPhone={arrowsOnPhone}
          />

          {/* Progress dots. The card reads as a gallery before anyone hovers.
              While autoplaying, only the frames the timer visits get a dot —
              the row is then an honest progress bar for the cycle, rather
              than promising photos this card will never reach on its own. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[10px] z-20 flex justify-center gap-[5px]">
            {(autoplayFrames > 0 ? images.slice(0, autoLast + 1) : images).map((_, i) => (
              <span
                key={i}
                className={`h-[5px] rounded-full transition-all duration-300 ${
                  i === frame ? "w-[16px] bg-white" : "w-[5px] bg-white/55"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function GalleryArrow({
  side,
  label,
  disabled,
  onClick,
  onPointerEnter,
  onPhone = false,
}: {
  side: "left" | "right";
  label: string;
  disabled: boolean;
  onClick: () => void;
  onPointerEnter?: () => void;
  /** Render on phones as well, permanently visible — there is no hover there. */
  onPhone?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      className={`absolute top-1/2 z-20 flex h-[34px] w-[34px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-black/25 text-white backdrop-blur-[2px] transition duration-200 hover:bg-black/45 focus-visible:opacity-100 disabled:pointer-events-none disabled:opacity-30 ${
        side === "left" ? "left-[10px]" : "right-[10px]"
      } ${
        // On a phone the arrow is simply there — fading it in on hover would
        // mean never showing it at all. From sm it goes back to the hover
        // reveal either way, so a card that opts in does not end up with two
        // permanently visible controls on the desktop layout as well.
        onPhone ? "flex" : "hidden sm:flex"
      } sm:opacity-0 sm:group-hover:opacity-100`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[16px] w-[16px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={side === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );
}
