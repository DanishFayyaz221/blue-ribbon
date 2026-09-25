"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LineReveal } from "../ui/LineReveal";
import { MobileCarousel } from "../ui/MobileCarousel";

const tabs = ["Buying", "Selling", "Renting"] as const;
type Tab = (typeof tabs)[number];

type Tile = { label: string; href: string; src: string };

/**
 * The four service artworks. Named here because the files themselves carry
 * spaces (and one a typo) in their names — encoding those once, in one place,
 * keeps the percent-escapes out of the tile table below and means a rename
 * later is a single edit rather than three.
 */
const ADVANCED_SEARCH = "/images/advance.png";
const MEET_OUR_AGENTS = "/images/meet%20our%20agent.png";
// Still the "find your desire" file — the tile it belongs to was renamed to
// Our Latest Insights, the artwork was not.
const LATEST_INSIGHTS = "/images/find%20your%20desire.png";
const BLUERIBBON_DIFFERENCE = "/images/the%20blueribbon%20differnec.png";

/**
 * One set of tiles per tab.
 *
 * The slots deliberately do NOT line up across tabs. They used to — search,
 * then agents, then the next step, then the brand story, in that order every
 * time — and switching tabs only changed the artwork under headings that
 * stayed put, so the three tabs read as one set of cards with the pictures
 * swapped. Each tab now leads with what matters most to that intent and
 * carries the shared entries in a different position, so a switch visibly
 * rearranges the row.
 *
 * Keying the grid by index is unrelated to that and still holds: switching
 * tabs swaps each card's contents in place rather than tearing down and
 * rebuilding the row, so the scroll-reveal state survives and the cards do
 * not flash back to invisible.
 */
const tilesByTab: Record<Tab, readonly Tile[]> = {
  Buying: [
    { label: "Advanced Search", href: "/buy", src: ADVANCED_SEARCH },
    { label: "Meet Our Agents", href: "/our-team", src: MEET_OUR_AGENTS },
    {
      label: "Our Latest Insights",
      href: "/market-insights",
      src: LATEST_INSIGHTS,
    },
    {
      label: "The BlueRibbon Difference",
      href: "/our-story",
      src: BLUERIBBON_DIFFERENCE,
    },
  ],
  // Appraisal leads, the brand story sits second (a seller is deciding who to
  // trust before who to meet), and the agents move to the end.
  Selling: [
    {
      label: "Free Property Appraisal",
      href: "/property-report-digital-appraisal",
      src: "/images/home.png",
    },
    {
      label: "The BlueRibbon Difference",
      href: "/our-story",
      src: BLUERIBBON_DIFFERENCE,
    },
    { label: "Visit Our Office", href: "/contact", src: "/images/find-an-office.png" },
    { label: "Meet Our Agents", href: "/our-team", src: MEET_OUR_AGENTS },
  ],
  // The property manager leads here — that is the relationship a renter or
  // landlord is really after — with the search second and the appraisal last.
  Renting: [
    { label: "Find a Property Manager", href: "/our-team", src: MEET_OUR_AGENTS },
    { label: "Search Rentals", href: "/rent", src: "/images/latest-properties.png" },
    {
      label: "The BlueRibbon Difference",
      href: "/our-story",
      src: BLUERIBBON_DIFFERENCE,
    },
    {
      label: "Rental Appraisal",
      href: "/rental-report-digital-appraisal",
      src: "/images/home.png",
    },
  ],
};

export function BridgeToHome() {
  const [active, setActive] = useState<Tab>("Buying");
  const tiles = tilesByTab[active];

  return (
    <section className="w-full bg-white pt-[clamp(36px,3.2vw,60px)] pb-[18px] sm:pb-[clamp(36px,3.2vw,60px)]">
      <div className="container-page">
        <div className="flex flex-col items-center gap-[20px] sm:flex-row sm:items-end sm:justify-between">
          <LineReveal
            as="h2"
            className="text-center font-display font-bold capitalize text-brand-mineshaft text-[26px] sm:text-[clamp(1.3rem,1.8vw,2rem)] leading-[1.1] sm:text-left"
          >
            Our Services
          </LineReveal>
          {/* Phone: the three tabs share the width, per the mobile comp. */}
          <div className="flex h-[40px] w-full items-center gap-0 self-stretch sm:h-[48px] sm:w-auto sm:self-end">
            {tabs.map((tab) => {
              const isActive = active === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActive(tab)}
                  aria-pressed={isActive}
                  className="group relative flex h-full min-w-0 flex-1 cursor-pointer items-center justify-center px-[8px] sm:min-w-[180px] sm:flex-none"
                >
                  <span
                    className={`relative z-10 font-display text-[15px] sm:text-[18px] lg:text-[20px] tracking-[0.02em] transition-transform duration-300 ease-out group-hover:-translate-y-[2px] group-active:translate-y-0 ${
                      isActive ? "font-semibold text-brand-bunker sm:font-medium" : "font-medium text-black/70 group-hover:text-brand-bunker"
                    }`}
                  >
                    {tab}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-bunker sm:h-[3px]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Phone: one tile at a time, swiped, with dots for position. Dots
            rather than the round arrows here — the tab row above already
            gives this section a set of controls, and a second pair right
            under the tile competed with it. */}
        <MobileCarousel
          // Keyed by tab so each one opens on its first tile. Without it the
          // carousel survives the switch and keeps its scroll position, so
          // moving to Selling from the third Buying tile landed on Selling's
          // third — a different service than the one the tab promises.
          key={active}
          ariaLabel="Our services"
          dots
          className="mt-[24px] sm:hidden"
          items={tiles.map((tile, i) => (
            // Index, deliberately — see tilesByTab.
            <Link key={i} href={tile.href} className="group block tab-swap">
              {/* The carousel above is keyed by tab, so this mounts fresh on
                  every switch and the animation replays with it. No stagger —
                  the carousel shows one tile at a time, so every tile is
                  position 0 as far as the viewer is concerned. */}
              <div className="tab-swap-item">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[16px]">
                  <Image
                    src={tile.src}
                    alt={tile.label}
                    fill
                    // `1px` from sm up: this carousel is `sm:hidden`, so a
                    // desktop visitor would otherwise fetch full-width copies
                    // of tiles the grid below already renders at its own size.
                    sizes="(max-width: 639px) 100vw, 1px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-[16px] font-display text-[16px] font-medium tracking-[0.02em] text-brand-mineshaft">
                  {tile.label}
                </p>
              </div>
            </Link>
          ))}
        />

        <div className="tab-swap mt-[clamp(20px,2.7vw,52px)] hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-[clamp(10px,1.3vw,24px)]">
          {tiles.map((tile, i) => (
            <Link
              // Index, deliberately — see tilesByTab.
              key={i}
              href={tile.href}
              suppressHydrationWarning
              style={{ ["--i" as string]: i }}
              className={`group block reveal reveal-delay-${(i % 4) + 1} hover-lift`}
            >
              {/* Its own element, between the card and the media box: the
                  card owns `.reveal` (a transition on opacity/transform) and
                  the box owns `.scroll-scale-in` (a scroll-driven transform).
                  An animation on either would fight for the same property, so
                  the swap gets a layer of its own.

                  Keyed by tab — and only safe to key here. Remounting is what
                  actually replays the animation (a changed attribute alone
                  does not restart one), and this wrapper carries no reveal
                  state to lose, unlike the `.reveal` card above it. */}
              <div key={active} className="tab-swap-item">
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
