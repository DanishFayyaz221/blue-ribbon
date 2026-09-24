"use client";

import { useCallback, useRef, useState } from "react";
import { PropertyCard, type PropertyCardData } from "./PropertyCard";
import { MobileCarousel } from "../ui/MobileCarousel";

/**
 * A phone listing carousel that plays itself: the card on screen cycles its
 * own first few photos, and when the last of them has had its turn the row
 * steps to the next listing — so a visitor who never touches anything still
 * sees several properties and several photos of each.
 *
 * Only the card on screen runs its timer. The others are paused and parked on
 * their first frame, so nothing counts down out of sight and each card starts
 * from the top when it comes round.
 *
 * Client-side because both halves need state: the carousel owns which card is
 * showing, and each card tells it when its own photos are done. The card
 * strips that use it are server components, so this sits between them.
 */
export function AutoplayCardCarousel({
  properties,
  ariaLabel,
  className = "mt-[20px] sm:hidden",
  variant = "tall",
  tone = "light",
  aspect = "aspect-[3/2]",
  frames = 3,
  ms = 2600,
}: {
  properties: PropertyCardData[];
  ariaLabel: string;
  className?: string;
  variant?: "wide" | "tall" | "compact";
  tone?: "light" | "dark";
  aspect?: string;
  /** Photos each card plays before the row moves on. */
  frames?: number;
  /** How long each photo is held. */
  ms?: number;
}) {
  const [active, setActive] = useState(0);
  const controls = useRef<{ next: () => void } | null>(null);

  // Stable identities: MobileCarousel keeps both in refs, and a new function
  // on every render would have it re-register the handle each time.
  const onControls = useCallback((c: { next: () => void }) => {
    controls.current = c;
  }, []);
  const onIndexChange = useCallback((i: number) => setActive(i), []);

  return (
    <MobileCarousel
      ariaLabel={ariaLabel}
      className={className}
      tone={tone}
      // Dots rather than the round arrows. These rows play themselves and
      // swipe, so the arrows were a control nobody needed to touch, sitting
      // in a block of their own under every strip; dots say where you are in
      // the same space and still step when tapped.
      dots
      onIndexChange={onIndexChange}
      controlsRef={onControls}
      items={properties.map((p, i) => (
        <PropertyCard
          key={p.href ?? i}
          {...p}
          variant={variant}
          addressFirst
          aspect={aspect}
          // `1px` from sm up, as the other phone-only strips do: this
          // carousel is `sm:hidden`, but the markup is still in the DOM
          // there, so a bare `100vw` had every desktop visitor fetching
          // full-width copies of photos they never see — which is what Next
          // warns about. Phones, where it is actually shown, keep 100vw.
          sizes="(max-width: 639px) 100vw, 1px"
          autoplayFrames={frames}
          autoplayMs={ms}
          autoplayActive={i === active}
          onAutoplayEnd={() => controls.current?.next()}
        />
      ))}
    />
  );
}
