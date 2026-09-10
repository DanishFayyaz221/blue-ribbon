"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DealLink = { label: string; href: string };

/**
 * Buy/Sell/Rent pill buttons for the desktop footer. At rest they are
 * outlined only, so the footer's navy fabric shows through them; on hover a
 * white fill slides up and the label turns navy. On click the button briefly
 * takes that same white fill and springs back before navigation commits — a
 * short acknowledgment tap so the click doesn't feel ignored, without
 * stalling the route change.
 */
export function FooterDealButtons({ links }: { links: DealLink[] }) {
  const router = useRouter();
  const [pressed, setPressed] = useState<string | null>(null);

  useEffect(() => {
    for (const link of links) router.prefetch(link.href);
  }, [links, router]);

  const navigate = (href: string) => {
    if (pressed) return;
    setPressed(href);
    router.push(href);
    window.setTimeout(() => setPressed(null), 220);
  };

  return (
    <>
      {links.map((link) => {
        const active = pressed === link.href;
        return (
          <button
            key={link.label}
            type="button"
            onClick={() => navigate(link.href)}
            className={`group relative isolate flex h-[46px] w-[150px] cursor-pointer items-center justify-center overflow-hidden rounded-[10px] border border-white bg-transparent font-display text-[13px] font-medium transition-all duration-200 hover:text-brand-navy before:absolute before:-inset-px before:z-0 before:bg-white before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:translate-y-0 ${
              active
                ? "scale-[0.97] text-brand-navy before:translate-y-0"
                : "scale-100 text-white before:translate-y-full"
            }`}
          >
            <span className="relative z-10">{link.label}</span>
          </button>
        );
      })}
    </>
  );
}
