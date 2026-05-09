"use client";

import Image from "next/image";
import { useState } from "react";

type Testimonial = {
  id: number;
  image: string;
  quote: string;
  name: string;
  rating: number;
};

const baseQuote =
  "This foundation is a game-changer! It provides flawless coverage without feeling heavy, and it lasts all day. I've never felt more confident in my skin.";

const testimonials: Testimonial[] = [
  {
    id: 1,
    image: "/images/happy-client.png",
    quote: baseQuote,
    name: "Jessica Miller",
    rating: 4,
  },
  {
    id: 2,
    image: "/images/happy-client.png",
    quote: baseQuote,
    name: "Jessica Miller",
    rating: 4,
  },
  {
    id: 3,
    image: "/images/happy-client.png",
    quote: baseQuote,
    name: "Jessica Miller",
    rating: 4,
  },
  {
    id: 4,
    image: "/images/happy-client.png",
    quote: baseQuote,
    name: "Jessica Miller",
    rating: 4,
  },
  {
    id: 5,
    image: "/images/happy-client.png",
    quote: baseQuote,
    name: "Jessica Miller",
    rating: 4,
  },
];

const VISIBLE = 3;

export function HappyClients() {
  const [start, setStart] = useState(0);

  const maxStart = Math.max(0, testimonials.length - VISIBLE);
  const handlePrev = () => setStart((s) => (s === 0 ? maxStart : s - 1));
  const handleNext = () => setStart((s) => (s >= maxStart ? 0 : s + 1));

  const visible = testimonials.slice(start, start + VISIBLE);

  return (
    <section className="relative w-[1920px] bg-white pt-[64px] pb-[96px]">
      <h2 className="mx-[74.667px] w-[1770.667px] font-display text-[49.333px] font-bold leading-[53.333px] text-[#11181c]">
        Meet Our Happy Clients
      </h2>

      <div className="relative mt-[64px] flex w-[1920px] items-center justify-center">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous testimonial"
          className="absolute left-[103px] top-1/2 flex h-[46.558px] w-[46.558px] -translate-y-1/2 items-center justify-center text-brand-navy transition hover:opacity-70"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[36px] w-[36px]"
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

        <div className="flex gap-[90px]">
          {visible.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next testimonial"
          className="absolute right-[103px] top-1/2 flex h-[46.558px] w-[46.558px] -translate-y-1/2 items-center justify-center text-brand-navy transition hover:opacity-70"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[36px] w-[36px]"
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
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="h-[516px] w-[384px] overflow-hidden rounded-[22px] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="relative h-[284px] w-[348px] overflow-hidden rounded-[2px] mx-[16px] mt-[16px]">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          sizes="348px"
          className="object-cover"
        />
      </div>
      <div className="px-[32px] pt-[32px]">
        <Stars rating={testimonial.rating} />
        <p className="mt-[16px] w-[316px] font-display text-[16px] leading-[1.36] text-[#2c2c2c]">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <p className="mt-[20px] whitespace-nowrap font-display text-[20px] font-semibold text-[#2c2c2c]">
          {testimonial.name}
        </p>
      </div>
    </article>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0 text-[24px] leading-none text-amber-500"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden className={i < rating ? "" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
}
