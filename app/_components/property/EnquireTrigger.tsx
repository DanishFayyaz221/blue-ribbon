"use client";

import { useState } from "react";
import { EnquiryModal, type EnquiryListing, type ModalAgent } from "./EnquiryModal";

type Variant = "primary" | "navy-pill";

type Props = {
  variant?: Variant;
  className?: string;
  label?: string;
  /** The listing's agents, from the feed. */
  agents?: ModalAgent[];
  /** The listing the enquiry is about, echoed into the notification email. */
  listing?: EnquiryListing;
};

export function EnquireTrigger({
  variant = "primary",
  className = "",
  label = "Enquire",
  agents,
  listing,
}: Props) {
  const [open, setOpen] = useState(false);

  const base =
    variant === "navy-pill"
      ? "group relative isolate flex h-[48px] items-center justify-center overflow-hidden rounded-[24px] border border-brand-navy bg-white font-display text-[14px] font-semibold text-brand-navy transition-colors duration-300 hover:text-white before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-brand-navy before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:translate-y-0"
      : "group relative isolate inline-flex h-[42px] items-center justify-center overflow-hidden rounded-full border border-brand-navy bg-white px-[24px] font-display text-[14px] font-medium text-brand-navy transition-colors duration-300 hover:text-white before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-brand-navy before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${base} ${className}`}>
        <span className="relative z-10">{label}</span>
      </button>
      <EnquiryModal open={open} onClose={() => setOpen(false)} agents={agents} listing={listing} />
    </>
  );
}
