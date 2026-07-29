"use client";

import { useState } from "react";
import { EnquiryModal, type ModalAgent } from "./EnquiryModal";

type Variant = "primary" | "navy-pill";

type Props = {
  variant?: Variant;
  className?: string;
  label?: string;
  /** The listing's agents, from the feed. */
  agents?: ModalAgent[];
};

export function EnquireTrigger({
  variant = "primary",
  className = "",
  label = "Enquire",
  agents,
}: Props) {
  const [open, setOpen] = useState(false);

  const base =
    variant === "navy-pill"
      ? "flex h-[48px] items-center justify-center rounded-[24px] bg-brand-navy font-display text-[14px] font-semibold text-white transition hover:bg-brand-navy-deep"
      : "inline-flex h-[42px] items-center justify-center rounded-full bg-brand-navy px-[24px] font-display text-[14px] font-medium text-white transition hover:bg-brand-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${base} ${className}`}>
        {label}
      </button>
      <EnquiryModal open={open} onClose={() => setOpen(false)} agents={agents} />
    </>
  );
}
