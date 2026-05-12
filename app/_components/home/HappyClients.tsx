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
  const handlePrev = () => setStart((s) => (s <= 0 ? maxStart : s - 1));
  const handleNext = () => setStart((s) => (s >= maxStart ? 0 : s + 1));

  const slideWidthPct = 100 / visible;
  const translatePct = -(safeStart * slideWidthPct);

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
            className="absolute left-[clamp(8px,1.5vw,40px)] top-1/2 z-10 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition hover:bg-white hover:opacity-100 hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[24px] w-[24px] lg:h-[28px] lg:w-[28px]"
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

          <div className="overflow-hidden px-[clamp(56px,6vw,100px)]">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(${translatePct}%)` }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex shrink-0 justify-center px-[clamp(10px,1.6vw,32px)]"
                  style={{ width: `${slideWidthPct}%` }}
                >
                  <TestimonialCard testimonial={t} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="absolute right-[clamp(8px,1.5vw,40px)] top-1/2 z-10 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition hover:bg-white hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[24px] w-[24px] lg:h-[28px] lg:w-[28px]"
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

        <div className="mt-[clamp(24px,2vw,40px)] flex items-center justify-center gap-[8px]">
          {Array.from({ length: maxStart + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStart(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === safeStart}
              className={`h-[8px] rounded-full transition-all duration-300 ${
                i === safeStart ? "w-[24px] bg-brand-navy" : "w-[8px] bg-brand-silver hover:bg-brand-navy/50"
              }`}
            />
          ))}
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
