"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type GalleryImage = { src: string; alt: string };

type Props = {
  images: GalleryImage[];
  /** Used for the dialog label and as alt text when an image has none. */
  address: string;
  /**
   * "collage" is the desktop five-up mosaic. "hero" is the single mobile image.
   * Both open the same viewer.
   */
  variant?: "collage" | "hero";
  /** Shown when the listing carries no downloaded images. */
  fallback?: string;
};

export function PhotoGallery({ images, address, variant = "collage", fallback }: Props) {
  // Which photo the viewer is showing, or null when closed. Holding the index
  // rather than a boolean lets a click open the viewer on the photo clicked.
  const [openAt, setOpenAt] = useState<number | null>(null);
  const close = useCallback(() => setOpenAt(null), []);

  const shown = images.length > 0 ? images : fallback ? [{ src: fallback, alt: address }] : [];
  if (shown.length === 0) return null;

  return (
    <>
      {variant === "hero" ? (
        <HeroImage image={shown[0]} count={images.length} onOpen={() => setOpenAt(0)} />
      ) : (
        <Collage images={shown} total={images.length} onOpen={setOpenAt} />
      )}
      {openAt !== null && (
        <Lightbox images={shown} startAt={openAt} address={address} onClose={close} />
      )}
    </>
  );
}

/**
 * Five-up mosaic: one large image beside a two-by-two grid.
 *
 * The rounding sits on the wrapper rather than each tile, so only the four
 * outer corners curve and the seams between tiles stay square.
 */
function Collage({
  images,
  total,
  onOpen,
}: {
  images: GalleryImage[];
  total: number;
  onOpen: (index: number) => void;
}) {
  // The mosaic needs five images to read as intended. Below that it would leave
  // visible holes in the grid, so a single image is shown instead.
  if (images.length < 5) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => onOpen(0)}
          aria-label="Open photo gallery"
          className="relative block aspect-[16/7] max-h-[560px] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)]"
        >
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            priority
            sizes="(max-width: 639px) 1px, 100vw"
            className="object-cover"
          />
        </button>
        {total > 1 && <ShowAllButton total={total} onClick={() => onOpen(0)} />}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid aspect-[2/1] max-h-[560px] w-full grid-cols-4 grid-rows-2 gap-[8px] overflow-hidden rounded-[clamp(8px,1vw,16px)]">
        <Tile
          image={images[0]}
          onClick={() => onOpen(0)}
          priority
          sizes="(max-width: 639px) 1px, 50vw"
          className="col-span-2 row-span-2"
        />
        {images.slice(1, 5).map((img, i) => (
          <Tile
            key={img.src}
            image={img}
            onClick={() => onOpen(i + 1)}
            sizes="(max-width: 639px) 1px, 25vw"
          />
        ))}
      </div>
      <ShowAllButton total={total} onClick={() => onOpen(0)} />
    </div>
  );
}

function Tile({
  image,
  onClick,
  sizes,
  className = "",
  priority = false,
}: {
  image: GalleryImage;
  onClick: () => void;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open photo gallery — ${image.alt}`}
      className={`group relative overflow-hidden ${className}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition duration-300 group-hover:brightness-90"
      />
    </button>
  );
}

function HeroImage({
  image,
  count,
  onOpen,
}: {
  image: GalleryImage;
  count: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open photo gallery"
      className="relative block aspect-[16/11] w-full overflow-hidden rounded-[14px]"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="(max-width: 639px) 100vw, 1px"
        className="object-cover"
      />
      {count > 1 && (
        <span className="absolute bottom-[12px] right-[12px] flex items-center gap-[6px] rounded-[8px] bg-black/60 px-[10px] py-[6px] font-display text-[12px] font-medium text-white">
          <GridIcon />
          {count}
        </span>
      )}
    </button>
  );
}

function ShowAllButton({ total, onClick }: { total: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-[clamp(12px,1.2vw,20px)] right-[clamp(12px,1.2vw,20px)] flex items-center gap-[8px] rounded-[8px] border border-brand-bunker/20 bg-white px-[14px] py-[9px] font-display text-[13px] font-semibold text-brand-bunker shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition hover:bg-brand-soft"
    >
      <GridIcon />
      Show all {total} photos
    </button>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="currentColor" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

/**
 * Full-screen viewer: one photo at a time with a thumbnail rail.
 *
 * Photos are shown with `object-contain` on a dark backdrop rather than cropped
 * to a tile. Listing photography is framed deliberately, and cropping it to fit
 * a grid hides exactly the parts of a room a renter is trying to judge.
 */
function Lightbox({
  images,
  startAt,
  address,
  onClose,
}: {
  images: GalleryImage[];
  startAt: number;
  address: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startAt);
  const railRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const count = images.length;
  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, go]);

  // Keep the active thumbnail visible as the visitor arrows through, otherwise
  // the rail and the main image disagree about where they are.
  useEffect(() => {
    railRef.current?.children[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index]);

  const current = images[index];

  const dialog = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photos of ${address}`}
      className="fixed inset-0 z-[100] flex flex-col bg-[#0B0B0B]"
    >
      <div className="flex shrink-0 items-center justify-between px-[clamp(12px,2vw,28px)] py-[12px]">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-[8px] rounded-[8px] px-[10px] py-[8px] font-display text-[14px] font-medium text-white transition hover:bg-white/10"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
          Close
        </button>
        <span className="font-display text-[13px] font-medium text-white/80" aria-live="polite">
          {index + 1} / {count}
        </span>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-[clamp(8px,5vw,72px)]"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          // Only a deliberate horizontal drag should change photo — a short
          // movement is usually a tap or a vertical scroll.
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div className="relative h-full w-full">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            priority
            sizes="100vw"
            className="object-contain"
          />
        </div>

        {count > 1 && (
          <>
            <NavButton side="left" onClick={() => go(-1)} />
            <NavButton side="right" onClick={() => go(1)} />
          </>
        )}
      </div>

      {count > 1 && (
        <div
          ref={railRef}
          className="no-scrollbar flex shrink-0 gap-[8px] overflow-x-auto px-[clamp(12px,2vw,28px)] py-[14px]"
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === index}
              className={`relative h-[54px] w-[80px] shrink-0 overflow-hidden rounded-[6px] transition ${
                i === index ? "ring-2 ring-white" : "opacity-55 hover:opacity-100"
              }`}
            >
              <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // No SSR guard needed: the viewer only mounts after a click, so `document`
  // exists by the time createPortal runs.
  return createPortal(dialog, document.body);
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 -translate-y-1/2 flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white/90 text-brand-bunker shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition hover:bg-white ${
        side === "left" ? "left-[clamp(8px,1.5vw,24px)]" : "right-[clamp(8px,1.5vw,24px)]"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[20px] w-[20px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={side === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );
}
