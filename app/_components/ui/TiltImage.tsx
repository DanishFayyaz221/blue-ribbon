"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  /** Classes for the frame that clips the photo (aspect, radius, margins). */
  className?: string;
  /** Classes for the <Image> itself, e.g. "object-cover object-center". */
  imageClassName?: string;
  priority?: boolean;
  /** Max left/right rotation in degrees. */
  tiltY?: number;
  /** Max up/down rotation in degrees. */
  tiltX?: number;
};

const PERSPECTIVE = 2000; // px
const LERP = 0.12;

/**
 * A photo that turns in 3D towards the cursor while it is hovered, and eases
 * back to flat when the pointer leaves — the same motion as the Parramatta
 * featured card's gallery.
 *
 * The frame stays put and keeps clipping; only the photo layer inside it is
 * transformed, so nothing overflows and no sibling has to move. The transform
 * is written straight to the node from a frame loop rather than through React
 * state: a re-render per pointer move would rebuild the subtree sixty times a
 * second for something the compositor can do by itself. A slight scale keeps
 * the receding edge from opening a gap against the page behind it.
 */
export function TiltImage({
  src,
  alt,
  sizes,
  className = "",
  imageClassName = "object-cover object-center",
  priority = false,
  tiltY = 4,
  tiltX = 2.5,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    rx: 0,
    ry: 0,
    s: 1,
    tx: 0,
    ty: 0,
    ts: 1,
    raf: 0,
    enabled: true,
  });

  useEffect(() => {
    const t = state.current;
    t.enabled = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => {
      if (t.raf) cancelAnimationFrame(t.raf);
      t.raf = 0;
    };
  }, []);

  const run = () => {
    const t = state.current;
    if (t.raf || !t.enabled) return;
    const step = () => {
      const el = layerRef.current;
      t.rx += (t.tx - t.rx) * LERP;
      t.ry += (t.ty - t.ry) * LERP;
      t.s += (t.ts - t.s) * LERP;
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
            : `perspective(${PERSPECTIVE}px) rotateX(${t.rx.toFixed(3)}deg) rotateY(${t.ry.toFixed(3)}deg) scale3d(${t.s.toFixed(4)}, ${t.s.toFixed(4)}, 1)`;
      }
      t.raf = settled ? 0 : requestAnimationFrame(step);
    };
    t.raf = requestAnimationFrame(step);
  };

  const target = (rx: number, ry: number, s: number) => {
    const t = state.current;
    t.tx = rx;
    t.ty = ry;
    t.ts = s;
    run();
  };

  // The scale needed so a face rotated by the maximum angle still covers the
  // frame: the far edge recedes, and with it the projected width.
  const cover = 1 + Math.max(tiltY, tiltX) / 100;

  return (
    <div
      ref={frameRef}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const frame = frameRef.current;
        if (!frame) return;
        const r = frame.getBoundingClientRect();
        // Right of centre turns the photo's right edge away (positive
        // rotateY); above centre tips its top away (positive rotateX).
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        target(-ny * 2 * tiltX, nx * 2 * tiltY, cover);
      }}
      onPointerLeave={() => target(0, 0, 1)}
      className={`relative overflow-hidden ${className}`.trim()}
    >
      <div ref={layerRef} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={imageClassName}
        />
      </div>
    </div>
  );
}
