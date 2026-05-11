"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const tiles = [
  { label: "Advanced Search", href: "/buy", src: "/images/latest-properties.png" },
  { label: "Meet Our Agents", href: "/agents", src: "/images/find-an-agent.png" },
  { label: "Find Your Desire", href: "/buy", src: "/images/find-an-office.png" },
  {
    label: "The BlueRibbon Difference",
    href: "/about",
    src: "/images/the-mcgrath-difference.png",
  },
] as const;

const tabs = ["Buying", "Selling", "Renting"] as const;

export function BridgeToHome() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Buying");

  return (
    <section className="w-full bg-white py-[clamp(56px,5vw,96px)]">
      <div className="container-page">
        <div className="flex flex-col gap-[24px] sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display font-bold capitalize text-brand-mineshaft text-[clamp(1.75rem,2.6vw,3.15rem)] leading-[1.1]">
            Your bridge to home
          </h2>
          <div className="flex h-[44px] sm:h-[48px] items-center gap-0 self-start sm:self-end">
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

        <div className="mt-[clamp(40px,3.5vw,72px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(16px,1.7vw,32px)]">
          {tiles.map((tile) => (
            <Link key={tile.label} href={tile.href} className="group block">
              <div className="relative aspect-[418/575] w-full overflow-hidden rounded-[clamp(20px,1.7vw,32px)]">
                <Image
                  src={tile.src}
                  alt={tile.label}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-[clamp(12px,1.1vw,22px)] font-display text-[clamp(16px,1.16vw,22px)] font-medium tracking-[0.02em] text-brand-mineshaft">
                {tile.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
