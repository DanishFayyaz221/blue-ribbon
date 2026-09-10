"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CardGallery } from "../property/CardGallery";
import type { ListingCard } from "@/lib/db/queries";

type Props = {
  featured: ListingCard;
};

/**
 * Interactive featured-property card for the Parramatta section. The View
 * Property pill follows the cursor while the card is hovered — the pill is
 * translated to the pointer coordinates via a transform, and revealed with a
 * short opacity + scale ease so it doesn't appear to snap in from the corner.
 */
// 3D tilt of the photo inside its frame. Small angles on a frame this wide
// already move the far edge tens of pixels in depth; the slight scale keeps
// the edge that recedes from opening a gap against the white behind it.
const TILT_Y = 4; // deg, left/right
const TILT_X = 2.5; // deg, up/down
const TILT_SCALE = 1.04;
const TILT_PERSPECTIVE = 2000; // px
const TILT_LERP = 0.12;

export function ParramattaFeaturedCard({ featured }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  // The photo layer inside CardGallery. Written to directly from a frame loop
  // rather than through state: a re-render per pointer move would rebuild
  // the gallery 60 times a second for a transform the compositor can apply
  // on its own.
  const mediaRef = useRef<HTMLDivElement>(null);
  const tilt = useRef({
    rx: 0, ry: 0, s: 1, // rendered
    tx: 0, ty: 0, ts: 1, // targets
    raf: 0,
    enabled: true,
  });
  useEffect(() => {
    const t = tilt.current;
    t.enabled = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => {
      if (t.raf) cancelAnimationFrame(t.raf);
      t.raf = 0;
    };
  }, []);
  const runTilt = () => {
    const t = tilt.current;
    if (t.raf || !t.enabled) return;
    const step = () => {
      const el = mediaRef.current;
      t.rx += (t.tx - t.rx) * TILT_LERP;
      t.ry += (t.ty - t.ry) * TILT_LERP;
      t.s += (t.ts - t.s) * TILT_LERP;
      const settled =
        Math.abs(t.tx - t.rx) < 0.005 &&
        Math.abs(t.ty - t.ry) < 0.005 &&
        Math.abs(t.ts - t.s) < 0.0005;
      if (settled) {
        t.rx = t.tx;
        t.ry = t.ty;
        t.s = t.ts;
      }
      if (el) {
        el.style.transform =
          t.rx === 0 && t.ry === 0 && t.s === 1
            ? ""
            : `perspective(${TILT_PERSPECTIVE}px) rotateX(${t.rx.toFixed(3)}deg) rotateY(${t.ry.toFixed(3)}deg) scale3d(${t.s.toFixed(4)}, ${t.s.toFixed(4)}, 1)`;
      }
      t.raf = settled ? 0 : requestAnimationFrame(step);
    };
    t.raf = requestAnimationFrame(step);
  };
  const setTiltTarget = (rx: number, ry: number, s: number) => {
    const t = tilt.current;
    t.tx = rx;
    t.ty = ry;
    t.ts = s;
    runTilt();
  };

  // The card takes the lead photo's own aspect ratio, so at full width the
  // whole photo shows with object-cover — no top/bottom crop and no zoom.
  // Read from the rendered <img> once it has loaded (its optimised copy has
  // the same proportions as the original), with 3:2 — the usual listing
  // photo shape — as the fallback until then. Clamped so an odd portrait or
  // panoramic shot can't make the section absurdly tall or thin.
  const [ratio, setRatio] = useState<number | null>(null);
  useEffect(() => {
    const img = cardRef.current?.querySelector<HTMLImageElement>("img");
    if (!img) return;
    const apply = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      const r = img.naturalWidth / img.naturalHeight;
      setRatio(Math.min(2.2, Math.max(1.25, r)));
    };
    if (img.complete && img.naturalWidth) {
      const id = requestAnimationFrame(apply);
      return () => cancelAnimationFrame(id);
    }
    img.addEventListener("load", apply);
    return () => img.removeEventListener("load", apply);
  }, [featured.image]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const card = cardRef.current;
    if (!card) return;
    // Tilt towards the pointer: right of centre turns the photo's right edge
    // away (positive rotateY), above centre tips its top away (positive
    // rotateX). Computed before the arrow check so the photo keeps following
    // the cursor while it is over the controls.
    {
      const rect = card.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setTiltTarget(-ny * 2 * TILT_X, nx * 2 * TILT_Y, TILT_SCALE);
    }
    // Over a gallery arrow the pill would sit on top of the control the
    // visitor is about to click, so it steps aside until the pointer is back
    // on the photo. Checked against the arrows' boxes rather than e.target:
    // a disabled arrow (left one on the first photo) has pointer-events:none,
    // so the event's target would be the photo beneath it, not the button.
    const arrows = card.querySelectorAll<HTMLElement>(
      'button[aria-label="Previous photo"], button[aria-label="Next photo"]',
    );
    const pad = 8;
    for (const arrow of arrows) {
      const r = arrow.getBoundingClientRect();
      if (
        e.clientX >= r.left - pad &&
        e.clientX <= r.right + pad &&
        e.clientY >= r.top - pad &&
        e.clientY <= r.bottom + pad
      ) {
        setPos(null);
        return;
      }
    }
    const rect = card.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") return;
        setHover(true);
      }}
      onPointerLeave={() => {
        setHover(false);
        setPos(null);
        // Ease the photo back to flat.
        setTiltTarget(0, 0, 1);
      }}
      onPointerMove={onMove}
      className="parramatta-featured group relative w-full overflow-hidden"
      style={{ aspectRatio: ratio ?? 3 / 2 }}
    >
      <CardGallery
        images={featured.gallery.length > 0 ? featured.gallery : [featured.image]}
        alt={featured.address}
        sizes="100vw"
        priority
        mediaRef={mediaRef}
      />

      {/* Top and bottom soft-white glow strips — matches the reference image
          where the photo is edged with a light haze that echoes the corner
          plaques. Sit under the plaques so the plaques stay crisp, not tinted
          by the haze, and pointer-events off so cursor tracking and gallery
          arrows still work through them. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-[clamp(110px,12vw,190px)] bg-gradient-to-b from-white/80 via-white/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[clamp(110px,12vw,190px)] bg-gradient-to-t from-white/80 via-white/25 to-transparent" />

      {/* Beds / Baths / Cars stats — corner-anchored plaque with a scooped
          bottom-left, casting a soft shadow onto the photo. */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-30 flex items-center bg-white/70 px-[clamp(18px,2vw,36px)] py-[clamp(14px,1.4vw,24px)] shadow-[-14px_18px_36px_-8px_rgba(0,0,0,0.35)]"
        style={{ borderBottomLeftRadius: "clamp(32px, 3.4vw, 54px)" }}
      >
        {featured.beds != null && (
          <>
            <div className="flex flex-col items-center px-[clamp(10px,1.2vw,20px)]">
              <span className="font-display text-[clamp(30px,2.8vw,44px)] font-bold text-brand-bunker leading-none">
                {featured.beds}
              </span>
              <span className="mt-[8px] font-display text-[clamp(11px,0.85vw,14px)] text-brand-bunker/70">
                Beds
              </span>
            </div>
            {(featured.baths != null || featured.cars != null) && (
              <div className="h-[clamp(30px,3vw,48px)] w-px bg-brand-bunker/15" />
            )}
          </>
        )}
        {featured.baths != null && (
          <>
            <div className="flex flex-col items-center px-[clamp(10px,1.2vw,20px)]">
              <span className="font-display text-[clamp(20px,1.7vw,28px)] font-medium text-brand-bunker leading-none">
                {featured.baths}
              </span>
              <span className="mt-[8px] font-display text-[clamp(11px,0.85vw,14px)] text-brand-bunker/70">
                Baths
              </span>
            </div>
            {featured.cars != null && (
              <div className="h-[clamp(30px,3vw,48px)] w-px bg-brand-bunker/15" />
            )}
          </>
        )}
        {featured.cars != null && (
          <div className="flex flex-col items-center px-[clamp(10px,1.2vw,20px)]">
            <span className="font-display text-[clamp(20px,1.7vw,28px)] font-medium text-brand-bunker leading-none">
              {featured.cars}
            </span>
            <span className="mt-[8px] font-display text-[clamp(11px,0.85vw,14px)] text-brand-bunker/70">
              Cars
            </span>
          </div>
        )}
      </div>

      {/* Address plaque — mirror of the stats card in the opposite corner. */}
      <div
        className="pointer-events-none absolute left-0 bottom-0 z-30 bg-white/70 px-[clamp(20px,2.4vw,44px)] py-[clamp(16px,1.6vw,26px)] shadow-[14px_-18px_36px_-8px_rgba(0,0,0,0.35)]"
        style={{ borderTopRightRadius: "clamp(32px, 3.4vw, 54px)" }}
      >
        {(() => {
          // Break the address after the first comma so "street" and
          // "suburb, state, postcode" sit on their own lines — matches the
          // design comp where the plaque is two lines tall.
          const commaAt = featured.address.indexOf(",");
          const line1 = commaAt >= 0 ? `${featured.address.slice(0, commaAt)},` : featured.address;
          const line2 = commaAt >= 0 ? featured.address.slice(commaAt + 1).trim() : "";
          return (
            <p className="font-display text-[clamp(18px,1.6vw,26px)] font-bold leading-[1.25] text-brand-navy">
              {line1}
              {line2 && (
                <>
                  <br />
                  {line2}
                </>
              )}
            </p>
          );
        })()}
      </div>

      {/* Cursor-tracking "View Property" pill. Positioned absolutely at the
          pointer's coordinates (relative to the card), transformed to centre
          on the cursor. On touch, or before the first move event, it hides. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-30 transition-opacity duration-300 ease-out"
        style={{
          transform: pos
            ? `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${hover ? 1 : 0.85})`
            : "translate3d(-9999px, -9999px, 0)",
          opacity: hover && pos ? 1 : 0,
          transition:
            "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease-out",
          willChange: "transform, opacity",
        }}
      >
        <span className="inline-flex h-[clamp(56px,4.8vw,68px)] items-center justify-center gap-[10px] rounded-full bg-white px-[clamp(40px,3.8vw,52px)] font-display text-[clamp(17px,1.4vw,22px)] font-medium text-brand-bunker shadow-[0_14px_36px_rgba(0,0,0,0.28)]">
          View Property
          <span aria-hidden className="inline-flex h-[18px] w-[18px] shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="h-full w-full"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="9 7 17 7 17 15" />
            </svg>
          </span>
        </span>
      </span>

      <Link
        href={featured.href}
        aria-label={`View property: ${featured.address}`}
        className="absolute inset-0 z-10 cursor-pointer"
      />
    </div>
  );
}
