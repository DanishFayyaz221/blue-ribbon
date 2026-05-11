"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Stars } from "../ui/Stars";

type Testimonial = {
  id: number;
  image: string;
  quote: string;
  name: string;
  rating: number;
};

const baseQuote =
  "This foundation is a game-changer! It provides flawless coverage without feeling heavy, and it lasts all day. I've never felt more confident in my skin.";

const testimonials: Testimonial[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  image: "/images/happy-client.png",
  quote: baseQuote,
  name: "Jessica Miller",
  rating: 4,
}));

export function HappyClients() {
  const [visible, setVisible] = useState(3);
  const [start, setStart] = useState(0);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setVisible(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const maxStart = Math.max(0, testimonials.length - visible);
  const safeStart = Math.min(start, maxStart);
  const handlePrev = () => setStart((s) => (s === 0 ? maxStart : s - 1));
  const handleNext = () => setStart((s) => (s >= maxStart ? 0 : s + 1));
  const items = testimonials.slice(safeStart, safeStart + visible);

  return (
    <section className="w-full bg-white py-[clamp(56px,5vw,96px)]">
      <div className="container-page">
        <h2 className="font-display font-bold text-brand-bunker text-[clamp(1.75rem,2.6vw,3.15rem)] leading-[1.1]">
          Meet Our Happy Clients
        </h2>
      </div>

      <div className="relative mt-[clamp(36px,3.5vw,64px)]">
        <div className="container-page relative">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="absolute left-[clamp(8px,3vw,60px)] top-1/2 z-10 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center text-brand-navy transition hover:opacity-70"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[32px] w-[32px] lg:h-[36px] lg:w-[36px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex justify-center gap-[clamp(20px,3.5vw,90px)] px-[clamp(48px,5vw,90px)]">
            {items.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="absolute right-[clamp(8px,3vw,60px)] top-1/2 z-10 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center text-brand-navy transition hover:opacity-70"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[32px] w-[32px] lg:h-[36px] lg:w-[36px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex w-full max-w-[384px] flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.18)]">
      <div className="relative m-[16px] aspect-[348/284] overflow-hidden rounded-[2px]">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          sizes="(max-width: 768px) 90vw, 348px"
          className="object-cover"
        />
      </div>
      <div className="px-[clamp(20px,1.7vw,32px)] pt-[20px] pb-[clamp(20px,1.7vw,32px)]">
        <Stars rating={testimonial.rating} size={22} />
        <p className="mt-[14px] font-display text-[14px] leading-[1.4] text-[#2c2c2c]">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <p className="mt-[16px] font-display text-[18px] font-semibold text-[#2c2c2c]">
          {testimonial.name}
        </p>
      </div>
    </article>
  );
}
