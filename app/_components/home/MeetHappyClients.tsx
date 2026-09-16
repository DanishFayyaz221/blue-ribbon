"use client";

import Image from "next/image";
import { LineReveal } from "../ui/LineReveal";
import { TiltSlider } from "./TiltSlider";

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
    id: 6,
    image: "/reviews/6.png",
    quote:
      "Outstanding experience with Blue Ribbon. Can’t thank Ven and Ritu enough for their genuine care and professionalism throughout the process. Would highly recommend.",
    name: "Timothy Lambert",
    title: "Local Guide",
    rating: 5,
    avatarBg: "#EC407A",
  },
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
];

/**
 * Testimonials: centred header, then the six client cards on a tilted,
 * scroll-linked, infinitely looping row (see TiltSlider). The row's vertical
 * padding leaves room for the lean — at 8° a viewport-wide track rises and
 * falls by roughly 7vw at either end — and for the arrows at bottom right.
 */
export function MeetHappyClients() {
  return (
    <section className="w-full overflow-x-clip bg-white py-[clamp(40px,4.5vw,84px)]">
      {/* Header — pill badge, centred heading, description paragraph. */}
      <div className="container-page flex flex-col items-center text-center">
        <span className="rounded-[8px] bg-brand-navy px-[16px] py-[7px] font-display text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
          Testimonials
        </span>
        <LineReveal
          as="h2"
          className="mt-[clamp(18px,1.8vw,32px)] max-w-[720px] font-display font-bold text-brand-bunker text-[clamp(1.4rem,2.4vw,2.5rem)] leading-[1.15]"
        >
          Don’t take Our word, Ask our respectful Clients.
        </LineReveal>
        <LineReveal
          as="p"
          className="mt-[clamp(14px,1.4vw,22px)] max-w-[540px] font-display text-[clamp(13px,1vw,15px)] leading-[1.6] text-brand-bunker"
        >
          We bring genuine care, deep market expertise, and a strategy made for
          you, all focused on achieving the best possible value at every stage
          of your journey. See what our customers have to say about us.
        </LineReveal>
      </div>

      {/* The same tilted row on the phone as on desktop, per the mobile
          comp: the current card just over half the width, so its neighbours
          show either side along the lean. */}
      <TiltSlider
        ariaLabel="Client testimonials"
        slideWidth="clamp(300px, 28vw, 440px)"
        slideWidthMobile="56vw"
        gap="clamp(12px, 2.6vw, 50px)"
        autoplay={80}
        arrows={false}
        scrollLink={false}
        className="mt-[clamp(20px,2vw,36px)] pt-[clamp(24px,7vw,150px)] pb-[clamp(72px,8vw,160px)]"
        items={testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      />
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initial = testimonial.name.trim().charAt(0).toUpperCase();
  return (
    <article className="flex w-full max-w-[440px] flex-col overflow-hidden rounded-[18px] bg-brand-navy shadow-[0px_4px_4px_0px_#00000040] transition-transform duration-300 hover:-translate-y-1">
      {/* No scroll-scale-in here. That class keeps a GPU layer promoted and
          rewrites its transform on every scroll, and this wrapper sits inside
          an <article> that is itself rounded, overflow-hidden and running its
          own transform transition. Chrome leaves a stale painted layer behind
          that combination — the card's text appeared twice on the live build
          while the DOM held exactly one copy of it. The effect was barely
          visible on a photo this size anyway. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 28vw"
          className="object-cover"
        />
        <Image
          src="/reviews/ban.png"
          alt=""
          width={449}
          height={220}
          className="pointer-events-none absolute right-0 top-0 h-auto w-[42%] select-none"
          aria-hidden
        />
      </div>
      <div className="relative flex flex-col items-center px-[16px] pt-[32px] pb-[12px] text-center sm:px-[22px] sm:pt-[40px] sm:pb-[14px]">
        <div
          className="absolute -top-[28px] left-1/2 flex h-[56px] w-[56px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border-[3px] border-white font-display text-[22px] font-semibold text-white sm:-top-[36px] sm:h-[72px] sm:w-[72px] sm:border-[4px] sm:text-[30px]"
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
        <p className="font-display text-[14px] font-semibold text-white sm:text-[18px]">
          {testimonial.name}
        </p>
        <p className="mt-[2px] font-display text-[10.5px] text-white/70 sm:text-[12px]">
          {testimonial.title}
        </p>
        <div className="mt-[6px] flex items-center gap-[3px] sm:gap-[4px]">
          {Array.from({ length: 5 }).map((_, i) => {
            const filled = i + 1 <= Math.floor(testimonial.rating);
            const half = !filled && i + 0.5 < testimonial.rating;
            return (
              <span key={i} className="relative inline-block text-[13px] leading-none sm:text-[16px]" aria-hidden>
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
        <p className="mt-[6px] font-display text-[11px] leading-[1.45] text-white/85 sm:text-[12.5px] sm:leading-[1.5]">
          {testimonial.quote}
        </p>
      </div>
    </article>
  );
}
