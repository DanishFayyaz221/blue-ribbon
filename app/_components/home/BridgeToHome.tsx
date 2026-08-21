"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const tabs = ["Buying", "Selling", "Renting"] as const;
type Tab = (typeof tabs)[number];

type Tile = { label: string; href: string; src: string };

/**
 * One set of tiles per tab. Slots are positional and mean the same thing
 * across tabs — 1 is the search entry point for that intent, 2 the people who
 * handle it, 3 the next step, 4 the brand story. Keeping them aligned is why
 * the grid below keys by index: switching tabs swaps each card's contents in
 * place rather than tearing down and rebuilding the row, so the scroll-reveal
 * state survives and the cards do not flash back to invisible.
 */
const tilesByTab: Record<Tab, readonly Tile[]> = {
  Buying: [
    { label: "Advanced Search", href: "/buy", src: "/images/latest-properties.png" },
    { label: "Meet Our Agents", href: "/agents", src: "/images/find-an-agent.png" },
    {
      label: "Find Your Desire",
      href: "/property-report-digital-appraisal",
      src: "/images/find-an-office.png",
    },
    {
      label: "The BlueRibbon Difference",
      href: "/about",
      src: "/images/the-mcgrath-difference.png",
    },
  ],
  Selling: [
    {
      label: "Free Property Appraisal",
      href: "/property-report-digital-appraisal",
      src: "/images/home.png",
    },
    { label: "Meet Our Agents", href: "/agents", src: "/images/find-an-agent.png" },
    { label: "Visit Our Office", href: "/contact", src: "/images/find-an-office.png" },
    {
      label: "The BlueRibbon Difference",
      href: "/about",
      src: "/images/the-mcgrath-difference.png",
    },
  ],
  Renting: [
    { label: "Search Rentals", href: "/rent", src: "/images/latest-properties.png" },
    { label: "Find a Property Manager", href: "/agents", src: "/images/find-an-agent.png" },
    {
      label: "Rental Appraisal",
      href: "/rental-report-digital-appraisal",
      src: "/images/home.png",
    },
    {
      label: "The BlueRibbon Difference",
      href: "/about",
      src: "/images/the-mcgrath-difference.png",
    },
  ],
};

export function BridgeToHome() {
  const [active, setActive] = useState<Tab>("Buying");
  const tiles = tilesByTab[active];

  return (
    <section className="w-full bg-white py-[clamp(36px,3.2vw,60px)]">
      <div className="container-page">
        <div className="flex flex-col gap-[20px] sm:flex-row sm:items-end sm:justify-between">
          <h2
            suppressHydrationWarning
            className="reveal font-display font-bold capitalize text-brand-mineshaft text-[clamp(1.3rem,1.8vw,2rem)] leading-[1.1]"
          >
            Your bridge to home
          </h2>
          <div className="hidden sm:flex h-[44px] sm:h-[48px] items-center gap-0 self-start sm:self-end">
            {tabs.map((tab) => {
              const isActive = active === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActive(tab)}
                  className="relative flex h-full min-w-[110px] sm:min-w-[180px] items-center justify-center px-[8px]"
                >
                  <span
                    className={`font-display text-[15px] sm:text-[18px] lg:text-[20px] font-medium tracking-[0.02em] ${
                      isActive ? "text-brand-bunker" : "text-black/70"
                    }`}
                  >
                    {tab}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-bunker" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-[clamp(20px,2.7vw,52px)] grid grid-cols-2 lg:grid-cols-4 gap-[clamp(10px,1.3vw,24px)]">
          {tiles.map((tile, i) => (
            <Link
              // Index, deliberately — see tilesByTab.
              key={i}
              href={tile.href}
              suppressHydrationWarning
              className={`group block reveal reveal-delay-${(i % 4) + 1} hover-lift`}
            >
              <div className="scroll-scale-in relative aspect-[16/10] sm:aspect-[3/4] w-full overflow-hidden rounded-[clamp(12px,1.7vw,32px)]">
                <Image
                  src={tile.src}
                  alt={tile.label}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 sm:hidden bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <p className="absolute bottom-[10px] left-[12px] right-[12px] sm:hidden font-display text-[11px] font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                  {tile.label}
                </p>
              </div>
              <p className="hidden sm:block whitespace-nowrap mt-[clamp(12px,1.1vw,22px)] font-display text-[clamp(13px,0.9vw,16px)] font-medium tracking-[0.02em] text-brand-mineshaft">
                {tile.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
