"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { DragScroll } from "../ui/DragScroll";

type Testimonial = {
  id: number;
  image: string;
  quote: string;
  name: string;
  title: string;
  rating: number;
  avatarBg: string;
  avatarImage?: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    image: "/reviews/1.png",
    quote:
      "Highly recommend Blue Ribbon Real Estate. They were great in helping me purchase my property. Excellent communication, quick reply and efficient.",
    name: "Ashutosh Jagota",
    title: "Satisfied Client",
    rating: 5,
    avatarBg: "#2E7D32",
  },
  {
    id: 2,
    image: "/reviews/2.png",
    quote:
      "Ritu and Sri were extremely professional, great in communication and genuinely caring. I would highly recommend Blue Ribbon Realtors to anyone who is looking out for a property.",
    name: "Karan Tuteja",
    title: "Local Guide",
    rating: 4.5,
    avatarBg: "#8D6E63",
  },
  {
    id: 3,
    image: "/reviews/3.png",
    quote:
      "Blue ribbon is best real estate in the area. Team is very helpful. Pricing is genuine. We can trust them. Thanks to Ven, the best agent in the area. Wish you all the best.",
    name: "Mamun Khan",
    title: "Local Guide",
    rating: 5,
    avatarBg: "#5C6BC0",
  },
  {
    id: 4,
    image: "/reviews/4.png",
    quote:
      "Best real estate ever!! Fantastic experience with this real estate. They were so helpful and lovely and they got us a beautiful place to rent.",
    name: "Mish C",
    title: "Satisfied Client",
    rating: 4.5,
    avatarBg: "#EF5350",
    avatarImage: "/reviews/mishi.png",
  },
  {
    id: 5,
    image: "/reviews/5.png",
    quote:
      "Such a friendly real estate. I like them a lot. I was in search for a house since 1 month before I came to Blue Ribbon Realtors, but they gave me a house in just 3 days — the process was very fast. Happy client.",
    name: "Sama Jaswanth",
    title: "Local Guide",
    rating: 5,
    avatarBg: "#EC407A",
    avatarImage: "/reviews/55.png",
  },
  {
    id: 6,
    image: "/reviews/6.png",
    quote:
      "Outstanding experience with Blue Ribbon. Can\u2019t thank Ven and Ritu enough for their genuine care and professionalism throughout the process. Would highly recommend.",
    name: "Timothy Lambert",
    title: "Local Guide",
    rating: 5,
    avatarBg: "#EC407A",
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

      {/* Mobile: horizontal-scroll cards */}
      <DragScroll className="sm:hidden mt-[24px] no-scrollbar flex snap-x snap-mandatory gap-[16px] overflow-x-auto px-[var(--page-px)] pb-[8px]">
        {testimonials.map((t) => (
          <div key={t.id} className="snap-start shrink-0 basis-[82%]">
            <TestimonialCard testimonial={t} />
          </div>
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
  const initial = testimonial.name.trim().charAt(0).toUpperCase();
  return (
    <article className="flex w-full max-w-[440px] flex-col overflow-hidden rounded-[18px] bg-brand-navy shadow-[0px_4px_4px_0px_#00000040] transition-transform duration-300 hover:-translate-y-1">
      <div className="scroll-scale-in relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          sizes="(max-width: 768px) 90vw, 440px"
          className="object-cover"
        />
        <Image
          src="/reviews/ban.png"
          alt=""
          width={220}
          height={80}
          className="pointer-events-none absolute right-0 top-0 h-auto w-[42%] select-none"
          aria-hidden
        />
      </div>
      <div className="relative flex flex-col items-center px-[22px] pt-[40px] pb-[14px] text-center">
        <div
          className="absolute -top-[36px] left-1/2 flex h-[72px] w-[72px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border-[4px] border-white font-display text-[30px] font-semibold text-white"
          style={{ backgroundColor: testimonial.avatarBg }}
        >
          {testimonial.avatarImage ? (
            <Image
              src={testimonial.avatarImage}
              alt={testimonial.name}
              fill
              sizes="72px"
              className="object-cover"
            />
          ) : (
            initial
          )}
        </div>
        <p className="font-display text-[18px] font-semibold text-white">
          {testimonial.name}
        </p>
        <p className="mt-[2px] font-display text-[12px] text-white/70">
          {testimonial.title}
        </p>
        <div className="mt-[6px] flex items-center gap-[4px]">
          {Array.from({ length: 5 }).map((_, i) => {
            const filled = i + 1 <= Math.floor(testimonial.rating);
            const half = !filled && i + 0.5 < testimonial.rating;
            return (
              <span key={i} className="relative inline-block text-[16px] leading-none" aria-hidden>
                <span className={filled ? "text-[#F5B301]" : "text-white/25"}>★</span>
                {half && (
                  <span
                    className="absolute inset-0 overflow-hidden text-[#F5B301]"
                    style={{ width: "50%" }}
                  >
                    ★
                  </span>
                )}
              </span>
            );
          })}
        </div>
        <p className="mt-[6px] font-display text-[12.5px] leading-[1.5] text-white/85">
          {testimonial.quote} 
        </p>
      </div>
    </article>
  );
}