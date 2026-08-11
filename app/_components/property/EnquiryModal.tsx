"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AgentAvatar } from "../agents/AgentAvatar";
import { STUDIO_EMAIL, sendAdminNotification, sendVisitorAutoReply } from "@/lib/email/send";

export type ModalAgent = {
  name: string;
  phone: string;
  email: string;
  /** Absent for agents with no headshot on file — initials are shown instead. */
  image?: string;
};

/** The listing the enquiry is about, echoed into the notification email. */
export type EnquiryListing = {
  address: string;
  guide?: string;
  type?: string;
  beds?: number;
  baths?: number;
  cars?: number;
};

type EnquiryModalProps = {
  open: boolean;
  onClose: () => void;
  /**
   * The listing's own agents, from the feed. Empty means the enquiry is not
   * tied to a listing — the form still works, the agent column is simply
   * omitted rather than filled with names that are not real.
   */
  agents?: ModalAgent[];
  /** Absent when the enquiry is not about a specific listing. */
  listing?: EnquiryListing;
};

const helpOptions = ["Price Guide", "Book an inspection", "Similar Properties"] as const;

export function EnquiryModal({ open, onClose, agents = [], listing }: EnquiryModalProps) {
  const [mounted, setMounted] = useState(false);
  const [help, setHelp] = useState<(typeof helpOptions)[number] | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const fullName = `${firstName} ${lastName}`.trim();

    // The notify template only renders variables it references, and it may
    // not reference the phone or listing_* ones. Folding those into the
    // message body guarantees they reach the inbox regardless of how the
    // template is set up.
    const facts = [
      listing?.beds != null ? `${listing.beds} bed` : null,
      listing?.baths != null ? `${listing.baths} bath` : null,
      listing?.cars != null ? `${listing.cars} car` : null,
    ].filter(Boolean);
    const detailsBlock = [
      "",
      "----------------------------",
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${mobile}`,
      help ? `Visitor wants: ${help}` : null,
      ...(listing
        ? [
          "",
          "Property enquired about:",
          `Address: ${listing.address}`,
          listing.guide ? `Price: ${listing.guide}` : null,
          listing.type ? `Type: ${listing.type}` : null,
          facts.length ? `Features: ${facts.join(", ")}` : null,
          `Link: ${window.location.href}`,
          agents.length ? `Agent(s): ${agents.map((a) => a.name).join(", ")}` : null,
        ]
        : []),
    ]
      .filter((line) => line !== null)
      .join("\n");

    try {
      await sendAdminNotification({
        form_type: listing ? "Property enquiry" : "General enquiry",
        help_with: help ?? undefined,
        name: fullName,
        from_name: fullName,
        first_name: firstName,
        last_name: lastName,
        email,
        from_email: email,
        reply_to: email,
        phone: mobile,
        mobile,
        message: `${message}${detailsBlock}`,
        listing_address: listing?.address,
        listing_price: listing?.guide,
        listing_type: listing?.type,
        listing_beds: listing?.beds != null ? String(listing.beds) : undefined,
        listing_baths: listing?.baths != null ? String(listing.baths) : undefined,
        listing_cars: listing?.cars != null ? String(listing.cars) : undefined,
        listing_url: window.location.href,
        agent_name: agents.map((a) => a.name).join(", ") || undefined,
      });
      // Fire-and-forget: the enquiry is already in, see sendVisitorAutoReply.
      void sendVisitorAutoReply({
        name: fullName,
        to_name: fullName,
        email,
        to_email: email,
        listing_address: listing?.address,
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] sm:p-[24px]"
    >
      <button
        type="button"
        aria-label="Close enquiry"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative z-10 flex w-full max-w-[760px] max-h-[calc(100vh-32px)] flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between border-b border-brand-silver/40 px-[clamp(20px,2.4vw,32px)] py-[16px]">
          <h2
            id="enquiry-modal-title"
            className="font-display text-[clamp(20px,2vw,26px)] font-bold text-brand-navy"
          >
            Enquiry
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-[36px] w-[36px] items-center justify-center text-brand-bunker transition hover:opacity-70"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>

        <div
          className={`grid grid-cols-1 gap-[clamp(16px,2vw,28px)] overflow-y-auto p-[clamp(20px,2.4vw,32px)] ${
            agents.length > 0 ? "md:grid-cols-[180px_1fr]" : ""
          }`}
        >
          {agents.length > 0 && (
            <div className="flex flex-row md:flex-col gap-[16px] md:gap-[20px]">
              {agents.map((a) => (
                <article key={a.name} className="w-full">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[10px] bg-brand-soft-2">
                    <AgentAvatar
                      name={a.name}
                      image={a.image}
                      sizes="(max-width: 768px) 50vw, 180px"
                    />
                  </div>
                  <p className="mt-[10px] font-display text-[13px] font-semibold text-brand-bunker">
                    {a.name}
                  </p>
                  {a.phone && (
                    <p className="mt-[2px] font-display text-[12px] text-brand-bunker/70">
                      {a.phone}
                    </p>
                  )}
                  {a.email && (
                    <a
                      href={`mailto:${a.email}`}
                      className="mt-[4px] inline-block font-display text-[12px] font-medium text-[#39B7FF] underline underline-offset-4 hover:opacity-80"
                    >
                      Email
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}

          {status === "sent" ? (
            <div className="flex flex-col items-start justify-center rounded-[10px] bg-[#F1F0ED] p-[clamp(20px,2.4vw,32px)]">
              <p className="font-display text-[18px] font-bold text-brand-navy">
                Enquiry sent ✓
              </p>
              <p className="mt-[10px] font-display text-[13px] leading-[1.6] text-brand-bunker/80">
                Thanks{firstName ? `, ${firstName}` : ""} — your enquiry
                {listing ? ` about ${listing.address}` : ""} is on its way. We&rsquo;ll
                be in touch soon.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-[20px] h-[44px] rounded-[22px] bg-brand-navy px-[28px] font-display text-[13px] font-semibold text-white transition hover:bg-brand-navy-deep"
              >
                Close
              </button>
            </div>
          ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-[10px] bg-[#F1F0ED] p-[clamp(16px,2vw,24px)]"
          >
            <Field label="How can we help?" required>
              <div className="mt-[10px] flex flex-wrap gap-[8px]">
                {helpOptions.map((opt) => {
                  const active = help === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setHelp(opt)}
                      className={`rounded-[6px] border px-[12px] py-[8px] font-display text-[12px] font-medium transition ${
                        active
                          ? "border-brand-navy bg-brand-navy text-white"
                          : "border-brand-silver bg-white text-brand-bunker hover:border-brand-navy"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="First Name" required>
              <Input value={firstName} onChange={setFirstName} placeholder="Enter first name" />
            </Field>
            <Field label="Last Name" required>
              <Input value={lastName} onChange={setLastName} placeholder="Enter last name" />
            </Field>
            <Field label="Email" required>
              <Input type="email" value={email} onChange={setEmail} placeholder="Enter email" />
            </Field>
            <Field label="Mobile" required>
              <Input type="tel" value={mobile} onChange={setMobile} placeholder="Enter mobile" />
            </Field>
            <Field label="Tell us more" required>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter a description..."
                rows={4}
                required
                className="mt-[6px] w-full resize-none rounded-[6px] border border-brand-silver bg-white px-[12px] py-[10px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none"
              />
            </Field>

            <label className="mt-[14px] flex items-start gap-[8px]">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-[2px] h-[14px] w-[14px]"
              />
              <span className="font-display text-[11px] leading-[1.5] text-brand-bunker/70">
                I agree to the Terms and Conditions and Privacy Policy
              </span>
            </label>

            {status === "error" && (
              <p className="mt-[14px] font-display text-[12px] leading-[1.5] text-red-600">
                Sorry, your enquiry could not be sent. Please try again
                {STUDIO_EMAIL ? (
                  <>
                    {" "}or email us directly at{" "}
                    <a href={`mailto:${STUDIO_EMAIL}`} className="font-semibold underline">
                      {STUDIO_EMAIL}
                    </a>
                  </>
                ) : null}
                .
              </p>
            )}

            <button
              type="submit"
              disabled={!agree || status === "sending"}
              className="mt-[56px] h-[44px] rounded-[22px] bg-brand-navy px-[28px] font-display text-[13px] font-semibold text-white transition hover:bg-brand-navy-deep disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Submit"}
            </button>
          </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-[12px] first:mt-0">
      <span className="font-display text-[10px] font-medium text-brand-bunker">
        {label}
        {required && <span className="text-brand-bunker">*</span>}
      </span>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      className="mt-[6px] h-[40px] w-full rounded-[6px] border border-brand-silver bg-white px-[12px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none"
    />
  );
}
