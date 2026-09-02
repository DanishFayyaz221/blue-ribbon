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
      ? "group relative isolate flex h-[48px] items-center justify-center overflow-hidden rounded-[24px] border border-brand-navy bg-white font-display text-[14px] font-semibold text-brand-navy transition-colors duration-300 hover:text-white before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-brand-navy before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:translate-y-0"
      : "group relative isolate inline-flex h-[44px] items-center justify-center overflow-hidden rounded-[18px] border border-brand-navy bg-white px-6 font-display text-sm font-medium text-brand-navy transition-colors duration-300 hover:text-white before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-brand-navy before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${base} ${className}`}>
        <span className="relative z-10">Share</span>
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
