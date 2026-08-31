"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type GalleryImage = { src: string; alt: string };
export type GalleryFloorplan = { src: string; alt: string };

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
  /**
   * Optional media that continues the lightbox sequence after the photos.
   * Passing them here (rather than living behind separate tabs) means a
   * visitor can arrow from the last photo straight into the video, then
   * into the floor plans, without leaving the viewer.
   */
  videoUrl?: string;
  floorplans?: GalleryFloorplan[];
};

/** One slide in the lightbox — a photo, a video, or a floor plan. */
type Slide =
  | { kind: "photo"; src: string; alt: string }
  | { kind: "video"; url: string }
  | { kind: "floorplan"; src: string; alt: string };

export function PhotoGallery({
  images,
  address,
  variant = "collage",
  fallback,
  videoUrl,
  floorplans = [],
}: Props) {
  // Which slide the viewer is showing, or null when closed. Holding the index
  // rather than a boolean lets a click open the viewer on the photo clicked.
  const [openAt, setOpenAt] = useState<number | null>(null);
  const close = useCallback(() => setOpenAt(null), []);

  const shown = images.length > 0 ? images : fallback ? [{ src: fallback, alt: address }] : [];

  // Photos first, then the video, then floor plans — same order as the tab
  // bar reads left-to-right, so "next" past the last photo lands on video and
  // "next" past that lands on the floor plan.
  const slides = useMemo<Slide[]>(() => {
    const photoSlides: Slide[] = shown.map((img) => ({
      kind: "photo",
      src: img.src,
      alt: img.alt,
    }));
    const videoSlides: Slide[] =
      videoUrl && /^https?:\/\//i.test(videoUrl.trim())
        ? [{ kind: "video", url: videoUrl }]
        : [];
    const floorplanSlides: Slide[] = floorplans.map((fp) => ({
      kind: "floorplan",
      src: fp.src,
      alt: fp.alt,
    }));
    return [...photoSlides, ...videoSlides, ...floorplanSlides];
  }, [shown, videoUrl, floorplans]);

  if (shown.length === 0) return null;

  return (
    <>
      {variant === "hero" ? (
        <HeroImage images={shown} onOpen={setOpenAt} />
      ) : (
        <Collage images={shown} total={images.length} onOpen={setOpenAt} />
      )}
      {openAt !== null && (
        <Lightbox slides={slides} startAt={openAt} address={address} onClose={close} />
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
  images,
  onOpen,
}: {
  images: GalleryImage[];
  onOpen: (index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const current = images[index];

  const go = (delta: number) =>
    setIndex((i) => (i + delta + count) % count);

  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[14px]">
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label="Open photo gallery"
        className="absolute inset-0 block"
      >
        <Image
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 639px) 100vw, 1px"
          className="object-cover"
        />
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-[10px] top-1/2 flex h-[36px] w-[36px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-bunker shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition hover:bg-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next photo"
            className="absolute right-[10px] top-1/2 flex h-[36px] w-[36px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-bunker shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition hover:bg-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <span className="pointer-events-none absolute bottom-[12px] right-[12px] flex items-center gap-[6px] rounded-[8px] bg-black/60 px-[10px] py-[6px] font-display text-[12px] font-medium text-white">
            <GridIcon />
            {index + 1} / {count}
          </span>
        </>
      )}
    </div>
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
 * Full-screen viewer: one slide at a time with a thumbnail rail.
 *
 * A slide is a photo, the video tour, or a floor plan — the sequence lets a
 * visitor arrow through everything in one flow rather than switching tabs.
 *
 * Photos and floor plans are shown with `object-contain` on a dark backdrop
 * rather than cropped to a tile. Listing photography is framed deliberately,
 * and cropping it hides exactly the parts of a room a renter is trying to
 * judge.
 */
function Lightbox({
  slides,
  startAt,
  address,
  onClose,
}: {
  slides: Slide[];
  startAt: number;
  address: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startAt);
  const railRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const count = slides.length;
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

  const current = slides[index];

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
          // Only a deliberate horizontal drag should change slide — a short
          // movement is usually a tap or a vertical scroll.
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <SlideView slide={current} address={address} />

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
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={
                s.kind === "photo"
                  ? `View photo ${i + 1}`
                  : s.kind === "video"
                    ? "View video tour"
                    : "View floor plan"
              }
              aria-current={i === index}
              className={`relative h-[54px] w-[80px] shrink-0 overflow-hidden rounded-[6px] transition ${
                i === index ? "ring-2 ring-white" : "opacity-55 hover:opacity-100"
              }`}
            >
              <ThumbView slide={s} />
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

function SlideView({ slide, address }: { slide: Slide; address: string }) {
  if (slide.kind === "photo") {
    return (
      <div className="relative h-full w-full">
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
      </div>
    );
  }

  if (slide.kind === "floorplan") {
    return (
      <div className="relative h-full w-full">
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>
    );
  }

  return <VideoSlide url={slide.url} title={address} />;
}

function VideoSlide({ url, title }: { url: string; title: string }) {
  const embed = toEmbedUrl(url);
  const isDirectFile = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);

  return (
    <div className="relative aspect-video h-full max-h-full w-full max-w-full">
      {embed ? (
        <iframe
          src={embed}
          title={`${title} — video tour`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : isDirectFile ? (
        <video
          src={url}
          autoPlay
          loop
          muted
          playsInline
          controls
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[16px] p-[24px] text-center">
          <p className="font-display text-[15px] text-white/85">
            This video tour opens in a new tab.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[44px] items-center justify-center rounded-full bg-white px-[24px] font-display text-[14px] font-semibold text-brand-navy transition hover:bg-brand-soft"
          >
            Watch video tour
          </a>
        </div>
      )}
    </div>
  );
}

/** Kept in sync with PropertyMedia so both viewers accept the same URLs. */
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&rel=0`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id =
        u.searchParams.get("v") ||
        u.pathname.match(/\/(?:shorts|embed)\/([^/?#]+)/)?.[1];
      if (id) {
        return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&rel=0`;
      }
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace("/", "");
      return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=0`;
    }
  } catch {}
  return null;
}

function ThumbView({ slide }: { slide: Slide }) {
  if (slide.kind === "photo" || slide.kind === "floorplan") {
    return <Image src={slide.src} alt="" fill sizes="80px" className="object-cover" />;
  }
  // Video thumb: neutral placeholder with a play glyph. Pulling a poster from
  // YouTube/Vimeo would need per-provider URL parsing at thumbnail size, and
  // this reads clearly enough for a rail element.
  return (
    <div className="flex h-full w-full items-center justify-center bg-brand-navy/80 text-white">
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
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
