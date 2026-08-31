"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  alt: string;
  sizes: string;
  /** Applied to every frame — the card's own hover zoom lives here. */
  imageClassName?: string;
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
export function CardGallery({ images, alt, sizes, imageClassName = "" }: Props) {
  const [index, setIndex] = useState(0);
  /** Highest frame index mounted so far. */
  const [warm, setWarm] = useState(0);

  const last = images.length - 1;
  const mounted = Math.min(images.length, warm + 1);

  const go = (next: number) => {
    // Clamped, not wrapped. On a sliding track, wrapping from the first frame
    // to the last would race the whole strip past the viewer in one step.
    const clamped = Math.max(0, Math.min(last, next));
    setIndex(clamped);
    setWarm((w) => Math.max(w, clamped + 1));
  };

  return (
    <>
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
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
              // The lead frame stays lazy so below-the-fold cards cost nothing.
              // Later frames are mounted deliberately and sit clipped outside
              // the container, where lazy loading would never fetch them.
              loading={i === 0 ? undefined : "eager"}
              sizes={sizes}
              className={`object-cover ${imageClassName}`}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <GalleryArrow
            side="left"
            label="Previous photo"
            disabled={index === 0}
            onClick={() => go(index - 1)}
          />
          <GalleryArrow
            side="right"
            label="Next photo"
            disabled={index === last}
            // Fetch the frame this arrow leads to while the pointer is still
            // travelling towards it, so the first slide is not the one that
            // waits on a network round trip. The handler sits on the arrow
            // rather than the track because the card's stretched link covers
            // the track and would swallow the pointer event first.
            onPointerEnter={() => setWarm((w) => Math.max(w, index + 1))}
            onClick={() => go(index + 1)}
          />

          {/* Progress dots. The card reads as a gallery before anyone hovers. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[10px] z-20 flex justify-center gap-[5px]">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-[5px] rounded-full transition-all duration-300 ${
                  i === index ? "w-[16px] bg-white" : "w-[5px] bg-white/55"
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
}: {
  side: "left" | "right";
  label: string;
  disabled: boolean;
  onClick: () => void;
  onPointerEnter?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      className={`absolute top-1/2 z-20 flex h-[34px] w-[34px] -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/25 text-white backdrop-blur-[2px] transition duration-200 hover:bg-black/45 focus-visible:opacity-100 disabled:pointer-events-none disabled:opacity-30 ${
        side === "left" ? "left-[10px]" : "right-[10px]"
      } hidden sm:flex sm:opacity-0 sm:group-hover:opacity-100`}
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
