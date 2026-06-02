"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ModalAgent = {
  name: string;
  phone: string;
  email: string;
  image: string;
};

type EnquiryModalProps = {
  open: boolean;
  onClose: () => void;
  agents?: ModalAgent[];
};

const defaultAgents: ModalAgent[] = [
  {
    name: "Vanessa Denison-Pender",
    phone: "0488 443 174",
    email: "vanessa@blueribbonre.com.au",
    image: "/our-team/our-team.png",
  },
  {
    name: "Peter Armstrong",
    phone: "0408 975 757",
    email: "peter@blueribbonre.com.au",
    image: "/our-team/our-team.png",
  },
];

const helpOptions = ["Price Guide", "Book an inspection", "Similar Properties"] as const;

export function EnquiryModal({ open, onClose, agents = defaultAgents }: EnquiryModalProps) {
  const [mounted, setMounted] = useState(false);
  const [help, setHelp] = useState<(typeof helpOptions)[number] | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);

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

        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-[clamp(16px,2vw,28px)] overflow-y-auto p-[clamp(20px,2.4vw,32px)]">
          <div className="flex flex-row md:flex-col gap-[16px] md:gap-[20px]">
            {agents.map((a) => (
              <article key={a.name} className="w-full">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[10px] bg-brand-soft-2">
                  <Image
                    src={a.image}
                    alt={a.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 180px"
                    className="object-cover object-top"
                  />
                </div>
                <p className="mt-[10px] font-display text-[13px] font-semibold text-brand-bunker">
                  {a.name}
                </p>
                <p className="mt-[2px] font-display text-[12px] text-brand-bunker/70">
                  {a.phone}
                </p>
                <a
                  href={`mailto:${a.email}`}
                  className="mt-[4px] inline-block font-display text-[12px] font-medium text-[#39B7FF] underline underline-offset-4 hover:opacity-80"
                >
                  Email
                </a>
              </article>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onClose();
            }}
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

            <button
              type="submit"
              disabled={!agree}
              className="mt-[56px] h-[44px] rounded-[22px] bg-brand-navy px-[28px] font-display text-[13px] font-semibold text-white transition hover:bg-brand-navy-deep disabled:opacity-50"
            >
              Submit
            </button>
          </form>
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
      className="mt-[6px] h-[40px] w-full rounded-[6px] border border-brand-silver bg-white px-[12px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none"
    />
  );
}
