"use client";

import { useState } from "react";
import { ShareModal } from "./ShareModal";

type Variant = "outline" | "outline-pill";

type Props = {
  /** Site-relative path of the listing being shared. */
  path: string;
  address: string;
  guide: string;
  image: string;
  type?: string;
  variant?: Variant;
  className?: string;
};

export function ShareTrigger({
  path,
  address,
  guide,
  image,
  type,
  variant = "outline",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  const base =
    variant === "outline-pill"
      ? "flex h-[48px] items-center justify-center rounded-[24px] border border-brand-navy font-display text-[14px] font-semibold text-brand-navy transition hover:bg-brand-soft"
      : "inline-flex items-center justify-center border border-brand-navy text-brand-navy transition hover:bg-brand-navy hover:text-white font-display font-medium h-[44px] px-6 rounded-[18px] text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${base} ${className}`}>
        Share
      </button>
      {open && (
        <ShareModal
          onClose={() => setOpen(false)}
          path={path}
          address={address}
          guide={guide}
          image={image}
          type={type}
        />
      )}
    </>
  );
}
