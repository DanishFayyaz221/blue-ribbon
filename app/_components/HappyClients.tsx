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

const testimonialImage = "/images/happy-client.png";

const baseQuote =
  "This foundation is a game-changer! It provides flawless coverage all day. I've never felt more confident in my skin.";

const testimonials: Testimonial[] = [
  { id: 1, image: testimonialImage, quote: baseQuote, name: "Jessica Miller", rating: 4 },
  { id: 2, image: testimonialImage, quote: baseQuote, name: "Jessica Miller", rating: 4 },
  { id: 3, image: testimonialImage, quote: baseQuote, name: "Jessica Miller", rating: 4 },
  { id: 4, image: testimonialImage, quote: baseQuote, name: "Jessica Miller", rating: 4 },
  { id: 5, image: testimonialImage, quote: baseQuote, name: "Jessica Miller", rating: 4 },
];

const VISIBLE = 3;

export function HappyClients() {
  const [start, setStart] = useState(0);

  const maxStart = Math.max(0, testimonials.length - VISIBLE);
  const handlePrev = () => setStart((s) => (s === 0 ? maxStart : s - 1));
  const handleNext = () => setStart((s) => (s >= maxStart ? 0 : s + 1));

  const visible = testimonials.slice(start, start + VISIBLE);

  return (
    <section className="bg-white px-6 py-16 text-brand-navy">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 font-display text-[49.333px] font-bold leading-tight tracking-tight">
          Meet Our Happy Clients
        </h2>
        <div className="relative">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="absolute -left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy transition hover:bg-brand-navy/20 md:-left-4"
          >
            <span aria-hidden>‹</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="absolute -right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy transition hover:bg-brand-navy/20 md:-right-4"
          >
            <span aria-hidden>›</span>
          </button>
          <div className="grid grid-cols-1 gap-5 px-8 md:grid-cols-3 md:px-12">
            {visible.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="overflow-hidden rounded-3xl bg-white text-brand-navy shadow-md ring-1 ring-black/5">
      <div className="relative aspect-[5/4]">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          sizes="(min-width: 768px) 30vw, 90vw"
          className="object-cover"
        />
      </div>
      <div className="space-y-3 p-5">
        <Stars rating={testimonial.rating} />
        <p className="text-sm leading-relaxed text-slate-700">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <p className="text-sm font-medium">{testimonial.name}</p>
      </div>
    </article>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-amber-500" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden>
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
