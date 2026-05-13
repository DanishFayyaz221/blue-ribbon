"use client";

import { useState } from "react";
import { EnquiryModal } from "./EnquiryModal";

type Variant = "primary" | "navy-pill";

type Props = {
  variant?: Variant;
  className?: string;
  label?: string;
};

export function EnquireTrigger({
  variant = "primary",
  className = "",
  label = "Enquire",
}: Props) {
  const [open, setOpen] = useState(false);

  const base =
    variant === "navy-pill"
      ? "flex h-[48px] items-center justify-center rounded-[24px] bg-brand-navy font-display text-[14px] font-semibold text-white transition hover:bg-brand-navy-deep"
      : "inline-flex h-[44px] items-center justify-center rounded-[18px] bg-brand-navy px-[24px] font-display text-[14px] font-medium text-white transition hover:bg-brand-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${base} ${className}`}>
        {label}
      </button>
      <EnquiryModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
