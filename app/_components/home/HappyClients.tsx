"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { DragScroll } from "../ui/DragScroll";

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
    image: "/reviews/1.png",
    quote:
      "Exceptional service from start to finish. The team went above and beyond to find our dream home.",
    name: "Sarah M.",
    rating: 5,
  },
  {
    id: 2,
    image: "/reviews/2.png",
    quote:
      "Exceptional service from start to finish. The team made the entire buying process smooth and easy.",
    name: "James K.",
    rating: 4,
  },
  {
    id: 3,
    image: "/reviews/3.png",
    quote:
      "Their local knowledge is unmatched. We sold above expectation and felt supported the whole way.",
    name: "Priya R.",
    rating: 5,
  },
  {
    id: 4,
    image: "/reviews/4.png",
    quote:
      "Honest, friendly, and incredibly professional. I cannot recommend Blue Ribbon highly enough.",
    name: "Daniel T.",
    rating: 5,
  },
  {
    id: 5,
    image: "/reviews/5.png",
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
        <h2 className="reveal font-display font-bold text-brand-bunker text-[clamp(1.05rem,1.8vw,2rem)] leading-[1.1]">
          Meet Our Happy Clients
        </h2>
      </div>

      {/* Mobile: horizontal-scroll image-only cards */}
      <DragScroll className="sm:hidden mt-[24px] no-scrollbar flex snap-x snap-mandatory gap-[16px] overflow-x-auto px-[var(--page-px)] pb-[8px]">
        {testimonials.map((t) => (
          <article
            key={t.id}
            className="snap-start shrink-0 basis-[78%] overflow-hidden rounded-[20px] bg-white shadow-[0px_4px_4px_0px_#00000040]"
          >
            <div className="relative aspect-252/320 w-full">
              <Image
                src={t.image}
                alt={t.name}
                fill
                sizes="78vw"
                className="object-cover"
              />
            </div>
          </article>
        ))}
      </DragScroll>

      {/* Tablet / desktop: slider carousel with images */}
      <div className="hidden sm:block container-page mt-[clamp(32px,3.15vw,58px)]">
        <div className="relative px-[clamp(8px,1.2vw,20px)]">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 z-10 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#251F20] shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition hover:bg-white"
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

          {/* px -> mx: 4th card peek nahi karega */}
          <div className="overflow-hidden mx-[clamp(56px,5vw,80px)] py-[28px]">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(${translatePct}%)` }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex shrink-0 justify-center px-[clamp(8px,0.9vw,16px)]"
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
            className="absolute right-0 top-1/2 z-10 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#251F20] shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition hover:bg-white"
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
    <article className="flex w-full max-w-[440px] flex-col overflow-hidden rounded-[18px] bg-white shadow-[0px_4px_4px_0px_#00000040] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px]">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          sizes="(max-width: 768px) 90vw, 440px"
          className="object-cover"
        />
      </div>
    </article>
  );
}