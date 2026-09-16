"use client";

import { useState } from "react";
import {
  EnquiryModal,
  type EnquiryListing,
  type HelpOption,
  type ModalAgent,
} from "./EnquiryModal";

/**
 * `primary` and `navy-pill` are filled navy, and a white fill slides up on
 * hover — the mirror of the outlined Share beside them. `link` is underlined
 * text with no box — the "Contact Agent" that stands in for the price of a
 * listing with none published. It carries no size, weight or colour of its
 * own so the caller can match it to the row it sits in.
 */
type Variant = "primary" | "navy-pill" | "link";

type Props = {
  variant?: Variant;
  className?: string;
  label?: string;
  /** The listing's agents, from the feed. */
  agents?: ModalAgent[];
  /** The listing the enquiry is about, echoed into the notification email. */
  listing?: EnquiryListing;
  /** A "How can we help?" chip to open with already selected. */
  initialHelp?: HelpOption;
};

export function EnquireTrigger({
  variant = "primary",
  className = "",
  label = "Enquire",
  agents,
  listing,
  initialHelp,
}: Props) {
  const [open, setOpen] = useState(false);

  const base =
    variant === "link"
      ? "cursor-pointer font-display underline underline-offset-4 transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky"
      : variant === "navy-pill"
        ? "group relative isolate flex h-[48px] items-center justify-center overflow-hidden rounded-[24px] border border-brand-navy bg-brand-navy font-display text-[14px] font-semibold text-white transition-colors duration-300 hover:text-brand-navy before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-white before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:translate-y-0"
        : "group relative isolate inline-flex h-[42px] items-center justify-center overflow-hidden rounded-full border border-brand-navy bg-brand-navy px-[24px] font-display text-[14px] font-medium text-white transition-colors duration-300 hover:text-brand-navy before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-white before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${base} ${className}`}>
        {variant === "link" ? label : <span className="relative z-10">{label}</span>}
      </button>
      <EnquiryModal
        open={open}
        onClose={() => setOpen(false)}
        agents={agents}
        listing={listing}
        initialHelp={initialHelp}
      />
    </>
  );
}
