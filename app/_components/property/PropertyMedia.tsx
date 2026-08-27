"use client";

import { useState } from "react";
import Image from "next/image";
import { PhotoGallery, type GalleryImage } from "./PhotoGallery";

type Floorplan = { src: string; alt: string };

type Props = {
  images: GalleryImage[];
  floorplans: Floorplan[];
  videoUrl?: string;
  address: string;
  fallback?: string;
  variant?: "collage" | "hero";
};

type Tab = "photos" | "video" | "floorplan";

/**
 * Tabbed media viewer for the property page: Photos / Video / Floor plan.
 * Only tabs with matching content render, so listings without a video or
 * floor plan stay clean.
 */
export function PropertyMedia({
  images,
  floorplans,
  videoUrl,
  address,
  fallback,
  variant = "collage",
}: Props) {
  const hasVideo = Boolean(videoUrl && /^https?:\/\//i.test(videoUrl.trim()));
  const hasFloorplan = floorplans.length > 0;
  const [tab, setTab] = useState<Tab>("photos");

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: "photos", label: "Photos", show: true },
    { key: "video", label: "Video", show: hasVideo },
    { key: "floorplan", label: "Floor plan", show: hasFloorplan },
  ];

  const visibleTabs = tabs.filter((t) => t.show);
  const activeTab = visibleTabs.some((t) => t.key === tab) ? tab : "photos";

  return (
    <div>
      {activeTab === "photos" && (
        <PhotoGallery
          images={images}
          address={address}
          variant={variant}
          fallback={fallback}
          videoUrl={videoUrl}
          floorplans={floorplans}
        />
      )}

      {activeTab === "video" && videoUrl && (
        <VideoPanel url={videoUrl} title={address} />
      )}

      {activeTab === "floorplan" && floorplans.length > 0 && (
        <FloorplanPanel floorplans={floorplans} />
      )}

      {visibleTabs.length > 1 && (
        <div className="mt-[clamp(20px,2vw,32px)] flex h-[48px] items-center justify-center gap-0 border-b border-brand-silver/40">
          {visibleTabs.map((t) => {
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-pressed={active}
                className="relative flex h-full min-w-[110px] sm:min-w-[180px] items-center justify-center px-[8px]"
              >
                <span
                  className={`font-display text-[15px] sm:text-[18px] lg:text-[20px] font-medium tracking-[0.02em] ${
                    active ? "text-brand-bunker" : "text-black/70"
                  }`}
                >
                  {t.label}
                </span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-bunker" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * YouTube/Vimeo/mp4 aware — YouTube and Vimeo URLs become embed iframes,
 * anything else is treated as a direct video file. Autoplays muted so browsers
 * allow it inline without a click.
 */
function VideoPanel({ url, title }: { url: string; title: string }) {
  const embed = toEmbedUrl(url);
  const isDirectFile = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);

  return (
    <div className="relative aspect-video max-h-[560px] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)] bg-black">
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
          className="h-full w-full object-cover"
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

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // YouTube: youtu.be/<id> or youtube.com/watch?v=<id> or /shorts/<id>
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
    // Vimeo: vimeo.com/<id>
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace("/", "");
      return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=0`;
    }
  } catch {}
  return null;
}

function FloorplanPanel({ floorplans }: { floorplans: Floorplan[] }) {
  return (
    <div className="flex flex-col gap-[16px]">
      {floorplans.map((fp) => (
        <a
          key={fp.src}
          href={fp.src}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block w-full overflow-hidden rounded-[clamp(8px,1vw,16px)] border border-brand-silver/60 bg-white"
        >
          <Image
            src={fp.src}
            alt={fp.alt}
            width={1600}
            height={1000}
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="h-auto w-full object-contain"
          />
          <span className="absolute bottom-[12px] right-[12px] rounded-[6px] bg-black/60 px-[10px] py-[6px] font-display text-[12px] text-white opacity-0 transition group-hover:opacity-100">
            View full size
          </span>
        </a>
      ))}
    </div>
  );
}
