"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  /** Sizing of the video at rest — this is the flex item in the caption row,
   *  e.g. "w-full sm:w-[clamp(200px,24vw,360px)] sm:shrink-0". */
  className?: string;
  /** Viewport heights of scrolling over which the video grows to full width. */
  grow?: number;
  /** `grow` on phones, where a full viewport-height of scrolling for one
   *  effect is a long way to drag a thumb. Falls back to `grow`. */
  growPhone?: number;
  /** Seconds the growth takes to catch up with the scroll position.
   *  Tracking the wheel rigidly lands every notch as a visible step; a short
   *  lag runs the steps together into one continuous motion. The growth is
   *  still a function of scroll position — it just arrives a beat later. */
  lag?: number;
  /** Viewport heights the full-width video stays pinned before it releases.
   *  0 = release the moment it reaches full width and scroll on with the page. */
  hold?: number;
  /** Corner radius of the resting video, px. Eases to 0 at full width. */
  radius?: number;
  /** Cap on the full-width video's visible height, as a fraction of the
   *  viewport height. A 16:9 box at full width is taller than most viewports,
   *  so without this the page would be nothing but video for a whole screen of
   *  scrolling after release; the excess is clipped top and bottom instead. */
  maxHeight?: number;
};

/**
 * A small inline video that pins to the centre of the viewport as it scrolls
 * up, then grows with the scroll until it spans the full viewport width and,
 * the moment it does, releases and scrolls away with the page (an optional
 * `hold` keeps it pinned a little longer first).
 *
 * Layout does none of the growing. The sticky cell keeps its small box in the
 * flow, and this tall track (its containing block) supplies the scroll room;
 * the visible box inside is only ever translated and scaled from a frame loop
 * that reads the cell's untransformed rect, so every frame is a compositor
 * update and the page never reflows. Wheel back up and it shrinks again — the
 * motion is a pure function of scroll position, so it stays in step with the
 * page's smooth scrolling.
 */
export function ScrollGrowVideo({
  src,
  className = "",
  grow = 1,
  growPhone = 0.55,
  hold = 0,
  lag = 0.18,
  radius = 10,
  maxHeight = 0.86,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const cell = cellRef.current;
    const box = boxRef.current;
    const video = videoRef.current;
    if (!track || !cell || !box || !video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let alive = true;
    let pinTop = 0;
    let growPx = 1;
    let lastKey = "";
    let playing = false;
    let started = false;

    // The film starts the first time the box reaches full width and keeps
    // running from then on — scrolling back and shrinking it doesn't stop it.
    // Only scrolling it fully off screen pauses it (resumed when it returns).
    // It is muted, so the browser allows play() without a user gesture.
    const setPlaying = (on: boolean) => {
      if (on === playing) return;
      playing = on;
      if (on) video.play().catch(() => {});
      else video.pause();
    };

    // Pin the small box at the viewport's vertical centre; make the track tall
    // enough for the grow + hold distance plus the box's own height (a sticky
    // element travels its container's content height minus its own). The
    // full-width video is far taller than that small layout box and hangs
    // below it by half the difference once released, so that overhang goes on
    // as padding — outside the sticky range, since sticky is bounded by the
    // content box — and whatever follows starts at the video's bottom edge
    // instead of sliding up hidden behind it.
    // Height the full-width video shows on screen: its scaled 16:9 height,
    // capped at `maxHeight` of the viewport (the rest is clipped away).
    const fullVisibleH = (vw: number, vh: number, w: number, h: number) =>
      Math.min(w > 0 ? (vw * h) / w : h, vh * maxHeight);

    const layout = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = box.offsetWidth;
      const h = box.offsetHeight;
      // Phones get a shorter run. A full viewport-height of scrolling is a
      // couple of thumb swipes for one effect, and the complaint was that the
      // section took too much scrolling to get through. Read per layout, so
      // rotating the phone picks up the right one.
      const g = vw < 640 ? growPhone : grow;
      pinTop = Math.max(0, Math.round((vh - h) / 2));
      cell.style.top = `${pinTop}px`;
      growPx = Math.max(1, vh * g);
      const overhang = Math.max(0, Math.round((fullVisibleH(vw, vh, w, h) - h) / 2));
      track.style.paddingBottom = `${overhang}px`;
      // border-box sizing: min-height includes that padding.
      track.style.minHeight = `${Math.round(vh * (g + hold) + h + overhang)}px`;
    };

    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Eased progress currently on screen. Seeded from the first frame's
    // target so a page that loads already scrolled past the video does not
    // play the growth on arrival.
    let shown: number | null = null;
    let lastTime = 0;

    const frame = (now: number) => {
      if (!alive) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Progress is how far the track's top has scrolled past the pin line —
      // 0 until the cell sticks, 1 once `grow` viewport-heights have gone by.
      const t = track.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (pinTop - t.top) / growPx));
      const target = ease(p);
      // Exponential approach to the target: frame-rate independent, and it
      // can only ever close the gap, never overshoot. Frame gaps are capped
      // so a tab returning from the background does not jump.
      const dt = lastTime ? Math.min(0.1, (now - lastTime) / 1000) : 0;
      lastTime = now;
      if (shown === null || lag <= 0) {
        shown = target;
      } else {
        shown += (target - shown) * (1 - Math.exp(-dt / lag));
        if (Math.abs(target - shown) < 0.0005) shown = target;
      }
      const e = shown;
      // The cell is never transformed, so its rect is the true resting box.
      const r = cell.getBoundingClientRect();
      if (r.width > 0) {
        const s = 1 + (vw / r.width - 1) * e;
        const tx = (vw / 2 - (r.left + r.width / 2)) * e;
        // No vertical translate: the box scales about its own centre, and the
        // sticky pin already puts the cell's centre on the viewport's centre
        // for the whole grow. Chasing the live viewport centre here instead
        // would keep the full-size video nailed to the screen after the cell
        // releases — the page would scroll on underneath it, and the video
        // would never move up.
        // Visible height eases from the resting height to the capped full
        // height; anything the uniform scale adds beyond that is clipped top
        // and bottom. clip-path is in the box's own (pre-transform) pixels,
        // so the on-screen amount is divided back out by the scale.
        const visH = r.height + (fullVisibleH(vw, vh, r.width, r.height) - r.height) * e;
        const inset = Math.max(0, (r.height - visH / s) / 2);
        // Radius is scaled with the box too, so divide it back out to keep
        // the corners reading as `radius` px on screen while they ease square.
        const rad = (radius * (1 - e)) / s;
        const key = `${tx.toFixed(2)}|${s.toFixed(4)}|${inset.toFixed(2)}`;
        if (key !== lastKey) {
          lastKey = key;
          box.style.transform = `translate3d(${tx}px, 0, 0) scale(${s})`;
          box.style.clipPath = `inset(${inset}px 0 round ${rad}px)`;
        }
        // Full width reached once? From then on play whenever any of the
        // (transformed) box is in the viewport — the rect includes the scale.
        if (p >= 1) started = true;
        if (started) {
          const b = box.getBoundingClientRect();
          setPlaying(b.bottom > 0 && b.top < vh);
        }
      }
      requestAnimationFrame(frame);
    };

    layout();
    // Once more after first paint — the clamp()ed width settles with layout.
    const settle = requestAnimationFrame(layout);
    window.addEventListener("resize", layout);
    requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(settle);
      window.removeEventListener("resize", layout);
      video.pause();
    };
  }, [grow, growPhone, hold, lag, radius, maxHeight]);

  return (
    <div
      ref={trackRef}
      // The JS-set height and pin, written out in CSS so they hold before
      // hydration (no jump in what follows) and for reduced-motion visitors,
      // where the effect returns early and these are the final values. Same
      // arithmetic as layout(): the box is 9/16 of the caller's
      // clamp(200px, 24vw, 360px), i.e. clamp(112.5px, 13.5vw, 202.5px) tall,
      // the growth is 100vh, and the overhang is half the difference between
      // the capped full-width height (min(56.25vw, 86vh)) and the box. On the
      // phone the box is 42% of the content width (about 23vw tall), so the
      // pin is 50vh minus half that and the overhang about 16vw — and the
      // growth there is 55vh, matching `growPhone`.
      className={`min-h-[calc(55vh+40vw)] sm:min-h-[calc(100vh+clamp(56.25px,6.75vw,101.25px)+min(28.125vw,43vh))] ${className}`.trim()}
    >
      <div
        ref={cellRef}
        className="sticky top-[calc(50vh-12vw)] z-20 w-full sm:top-[calc(50vh-clamp(56.25px,6.75vw,101.25px))]"
      >
        <div
          ref={boxRef}
          className="relative aspect-video w-full overflow-hidden rounded-[10px] bg-brand-navy-deep"
          style={{
            // `clip-path` in will-change as well as transform: Safari repaints
            // a clip change on the CPU, and that repaint tore against the
            // playing video underneath — the flicker seen while scrolling
            // this on an iPhone. Declaring both keeps the box on its own
            // layer, so the repaint stays inside it. (The transform itself is
            // written by the frame loop, so it cannot be seeded here.)
            willChange: "transform, clip-path",
            transformOrigin: "50% 50%",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Still until full width — no autoplay attribute; the frame loop
              calls play()/pause(). preload="auto" so the browser decodes and
              shows the first frame as the poster meanwhile. */}
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={src}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            // Its own compositor layer. iOS composites video separately from
            // the page, and a clipped, scaled ancestor changing every frame
            // left the two out of step — the video showed through a frame
            // behind its own box while scrolling. Pinning it to a layer that
            // moves with the box keeps them together.
            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
          />
        </div>
      </div>
    </div>
  );
}
