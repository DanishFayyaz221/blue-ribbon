"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MobileCarousel } from "../ui/MobileCarousel";
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

  // Corner plaques come in when they scroll into view, each on its own: the
  // stats sit at the top of the card and lead, the address at the bottom
  // follows as the card rises. On a fast scroll that lands both at once the
  // address's CSS delay staggers them instead. Plays once.
  //
  // `armed` goes on after mount so the hidden start state outlives the
  // page-level `reveal-armed` gate, which drops on pageshow — before the
  // visitor has scrolled this far (see globals.css).
  const statsRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [plaquesIn, setPlaquesIn] = useState({ stats: false, address: false });
  useEffect(() => {
    // Reduced motion: the stylesheet shows the plaques as they are, so there
    // is nothing to arm or observe.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Armed a frame later rather than synchronously. The start state is
    // already painted by the page-level gate, so nothing is lost, and it
    // keeps this effect from re-rendering the card inside its own commit.
    const arm = requestAnimationFrame(() => setArmed(true));
    const targets: [HTMLElement | null, "stats" | "address"][] = [
      [statsRef.current, "stats"],
      [addressRef.current, "address"],
    ];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const key = targets.find(([el]) => el === entry.target)?.[1];
          if (key) setPlaquesIn((cur) => (cur[key] ? cur : { ...cur, [key]: true }));
          io.unobserve(entry.target);
        }
      },
      // Fires once half the plaque is above the bottom tenth of the screen,
      // so it is properly on screen before it moves rather than animating
      // while still clipped by the viewport edge.
      { threshold: 0.5, rootMargin: "0px 0px -10% 0px" },
    );
    for (const [el] of targets) if (el) io.observe(el);
    return () => {
      cancelAnimationFrame(arm);
      io.disconnect();
    };
  }, []);

  const plaqueState = (key: "stats" | "address") =>
    `${armed ? " plaque-armed" : ""}${plaquesIn[key] ? " plaque-in" : ""}`;
  // Offset from the panel's own start, so a delayed panel delays its details
  // with it.
  const detailDelay = (seconds: number) => ({
    transitionDelay: `calc(var(--plaque-delay) + ${seconds.toFixed(3)}s)`,
  });

  // The stats row in display order, as a list so each item can be staggered
  // by its index. Beds leads at the larger size, as in the comp.
  const stats: { label: string; value: number; lead?: boolean }[] = [];
  if (featured.beds != null) stats.push({ label: "Beds", value: featured.beds, lead: true });
  if (featured.baths != null) stats.push({ label: "Baths", value: featured.baths });
  if (featured.cars != null) stats.push({ label: "Cars", value: featured.cars });

  // Break the address after the first comma so "street" and "suburb, state,
  // postcode" sit on their own lines — matches the design comp where the
  // plaque is two lines tall. Each line gets its own mask.
  const commaAt = featured.address.indexOf(",");
  const addressLines = (
    commaAt >= 0
      ? [`${featured.address.slice(0, commaAt)},`, featured.address.slice(commaAt + 1).trim()]
      : [featured.address]
  ).filter(Boolean);

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

  const photos = featured.gallery.length > 0 ? featured.gallery : [featured.image];

  return (
    <>
      {/* Phone: the photos edge to edge with the round arrows beneath, and
          the address and stats in a band under the photo rather than as
          plaques over it — the mobile comp's layout, which also spares the
          phone the full-height card and the cursor effects. */}
      <div className="pb-[36px] sm:hidden">
        <MobileCarousel
          ariaLabel={`Photos of ${featured.address}`}
          gap="0px"
          items={photos.map((src, i) => (
            <Link
              key={src}
              href={featured.href}
              aria-label={`View property: ${featured.address}`}
              className="relative block aspect-[5/4] w-full"
            >
              <Image
                src={src}
                alt={i === 0 ? featured.address : ""}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </Link>
          ))}
          between={
            <div className="container-page mt-[18px] flex items-start justify-between gap-[16px]">
              <Link
                href={featured.href}
                className="whitespace-pre-line font-display text-[15px] leading-[1.3] text-brand-navy"
              >
                {addressLines.join("\n")}
              </Link>
              {stats.length > 0 && (
                <div className="flex shrink-0 divide-x divide-brand-bunker/20">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col items-center px-[10px] first:pl-0 last:pr-0"
                    >
                      <span
                        className={`font-display font-bold leading-none text-brand-navy ${
                          stat.lead ? "text-[30px]" : "text-[22px]"
                        }`}
                      >
                        {stat.value}
                      </span>
                      <span className="mt-[4px] font-display text-[9px] text-brand-bunker/70">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          }
        />
      </div>

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
      // Sized so the badge above it and the card together occupy one screen,
      // which is what makes the whole feature land in view as you scroll to
      // it. `svh` rather than `vh`: on mobile browsers `vh` measures the
      // viewport with the toolbars hidden, so the card would overflow by the
      // height of the address bar.
      // Sized so the sticky nav, the badge and the card together come to one
      // screen — the whole feature lands in view as you scroll to it, rather
      // than the nav pushing its bottom edge off.
      //
      // The subtraction tracks the nav's own responsive height (56/64/72px at
      // the same breakpoints Nav uses) plus this section's padding, the badge
      // and its gap. `svh` rather than `vh`: on mobile browsers `vh` measures
      // the viewport with the toolbars hidden, so the card would overflow by
      // the height of the address bar.
      className="parramatta-featured group relative hidden h-[calc(100svh-152px)] w-full overflow-hidden rounded-[clamp(14px,1.4vw,22px)] sm:block sm:h-[calc(100svh-160px)] lg:h-[calc(100svh-165px)]"
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
      {/* Top and bottom haze: just under a third of the card at each edge,
          solid white where it meets the page. The middle stays clear because
          the ramp is front-loaded — past the halfway point of each band the
          white is under 20%, and the centre ~40% of the card carries none.
          The gradient itself (globals.css) is eased so that depth reads as a
          soft dissolve rather than fog — see the note there.

          `z-[15]` keeps them under the plaques at z-30, so those stay crisp
          rather than being tinted. */}
      <div className="featured-haze-top pointer-events-none absolute inset-x-0 top-0 z-[15] h-[clamp(130px,16vw,260px)]" />
      <div className="featured-haze-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[clamp(130px,16vw,260px)]" />

      {/* Beds / Baths / Cars stats — corner-anchored plaque with a scooped
          bottom-left, casting a soft shadow onto the photo. Scales from its
          anchored corner (origin-top-right) so it unfolds out of the corner
          rather than swelling from its centre. */}
      {stats.length > 0 && (
        <div
          ref={statsRef}
          className={`plaque plaque-tr origin-top-right pointer-events-none absolute right-0 top-0 z-30 flex items-center bg-white/70 px-[clamp(18px,2vw,36px)] py-[clamp(14px,1.4vw,24px)] shadow-[-14px_18px_36px_-8px_rgba(0,0,0,0.35)]${plaqueState("stats")}`}
          style={{ borderBottomLeftRadius: "clamp(32px, 3.4vw, 54px)" }}
        >
          {stats.map((stat, i) => (
            <Fragment key={stat.label}>
              {i > 0 && (
                <div
                  className="plaque-rule h-[clamp(30px,3vw,48px)] w-px bg-brand-bunker/15"
                  style={detailDelay(0.2 + (i - 0.5) * 0.09)}
                />
              )}
              <div className="plaque-mask">
                <div
                  className="plaque-line flex flex-col items-center px-[clamp(10px,1.2vw,20px)]"
                  style={detailDelay(0.2 + i * 0.09)}
                >
                  <span
                    className={
                      stat.lead
                        ? "font-display text-[clamp(30px,2.8vw,44px)] font-bold text-brand-bunker leading-none"
                        : "font-display text-[clamp(20px,1.7vw,28px)] font-medium text-brand-bunker leading-none"
                    }
                  >
                    {stat.value}
                  </span>
                  <span className="mt-[8px] font-display text-[clamp(11px,0.85vw,14px)] text-brand-bunker/70">
                    {stat.label}
                  </span>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      )}

      {/* Address plaque — mirror of the stats card in the opposite corner. */}
      <div
        ref={addressRef}
        className={`plaque plaque-bl origin-bottom-left pointer-events-none absolute left-0 bottom-0 z-30 bg-white/70 px-[clamp(20px,2.4vw,44px)] py-[clamp(16px,1.6vw,26px)] shadow-[14px_-18px_36px_-8px_rgba(0,0,0,0.35)]${plaqueState("address")}`}
        style={{ borderTopRightRadius: "clamp(32px, 3.4vw, 54px)" }}
      >
        <p className="font-display text-[clamp(18px,1.6vw,26px)] font-bold leading-[1.25] text-brand-navy">
          {addressLines.map((line, i) => (
            <span key={i} className="plaque-mask">
              <span className="plaque-line block" style={detailDelay(0.2 + i * 0.1)}>
                {line}
              </span>
            </span>
          ))}
        </p>
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
    </>
  );
}
