"use client";

import { useRef, useState } from "react";

export function AboutHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const handleClick = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <section className="container-page">
      <div className="relative aspect-[1770/620] min-h-[clamp(420px,42vw,720px)] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)] bg-brand-navy-deep">
        <video
          ref={videoRef}
          className="h-full w-full object-cover cursor-pointer"
          poster="/about-us-images/about hero.png"
          preload="metadata"
          playsInline
          controls={started}
          onClick={handleClick}
          onPlay={() => setStarted(true)}
        >
          <source src="/hero-video/hero.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
