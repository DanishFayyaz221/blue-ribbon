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

const testimonials: Testimonial[] = [
  {
    id: 1,
    image: "/images/happy-client.png",
    quote:
      "Exceptional service from start to finish. The team went above and beyond to find our dream home.",
    name: "Sarah M.",
    rating: 5,
  },
  {
    id: 2,
    image: "/images/happy-client.png",
    quote:
      "Exceptional service from start to finish. The team made the entire buying process smooth and easy.",
    name: "James K.",
    rating: 4,
  },
  {
    id: 3,
    image: "/images/happy-client.png",
    quote:
      "Their local knowledge is unmatched. We sold above expectation and felt supported the whole way.",
    name: "Priya R.",
    rating: 5,
  },
  {
    id: 4,
    image: "/images/happy-client.png",
    quote:
      "Honest, friendly, and incredibly professional. I cannot recommend Blue Ribbon highly enough.",
    name: "Daniel T.",
    rating: 5,
  },
  {
    id: 5,
    image: "/images/happy-client.png",
    quote:
      "From appraisal to settlement they kept us informed at every step. A truly stress-free experience.",
    name: "Olivia C.",
    rating: 4,
  },
];

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
    <section className="w-full bg-white py-[clamp(28px,3.2vw,60px)]">
      <div className="container-page">
        <h2 className="font-display font-bold text-brand-bunker text-[clamp(1.05rem,1.8vw,2rem)] leading-[1.1]">
          Meet Our Happy Clients
        </h2>
      </div>

      {/* Mobile: horizontal-scroll plain cards (no image) */}
      <div className="sm:hidden mt-[24px] no-scrollbar flex snap-x snap-mandatory gap-[16px] overflow-x-auto px-[var(--page-px)] pb-[8px]">
        {testimonials.map((t) => (
          <article
            key={t.id}
            className="snap-start shrink-0 basis-[78%] rounded-[20px] bg-[#F5F5F7] p-[24px]"
          >
            <Stars rating={t.rating} size={20} />
            <p className="mt-[18px] font-display text-[15px] leading-[1.55] text-brand-bunker">
              &ldquo;{t.quote}&rdquo;
            </p>
            <p className="mt-[20px] font-display text-[15px] font-bold text-brand-navy">
              {t.name}
            </p>
          </article>
        ))}
      </div>

      {/* Tablet / desktop: slider carousel with images */}
      <div className="hidden sm:block container-page mt-[clamp(32px,3.15vw,58px)]">
        <div className="relative px-[clamp(20px,3vw,64px)]">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="absolute left-[clamp(8px,1.5vw,32px)] top-1/2 z-10 flex h-[46px] w-[46px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#251F20] shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition hover:bg-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[20px] w-[20px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="overflow-hidden px-[clamp(40px,4vw,72px)]">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(${translatePct}%)` }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex shrink-0 justify-center px-[clamp(2px,0.3vw,6px)]"
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
            className="absolute right-[clamp(8px,1.5vw,32px)] top-1/2 z-10 flex h-[46px] w-[46px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#251F20] shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition hover:bg-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[20px] w-[20px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
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
    <article className="flex w-full max-w-[340px] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
      <div className="relative mx-[14px] mt-[14px] aspect-[252/200] overflow-hidden rounded-[6px]">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          sizes="(max-width: 768px) 90vw, 252px"
          className="object-cover"
        />
      </div>
      <div className="px-[18px] pt-[14px] pb-[20px]">
        <Stars rating={testimonial.rating} size={14} />
        <p className="mt-[10px] font-display text-[11px] leading-[1.5] text-brand-bunker/85">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <p className="mt-[14px] font-display text-[14px] font-semibold text-brand-bunker">
          {testimonial.name}
        </p>
      </div>
    </article>
  );
}
