"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
  /** Site-relative path of the listing, e.g. "/property/19-nile-avenue-…". */
  path: string;
  address: string;
  /** Formatted price line, e.g. "$400 pw". */
  guide: string;
  image: string;
  type?: string;
};

type Target = {
  key: string;
  label: string;
  /** Built from the encoded url and text once they are known. */
  href: (url: string, text: string) => string;
  icon: React.ReactNode;
  /** Brand colour for the icon chip. */
  tint: string;
};

const TARGETS: Target[] = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: (url, text) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    tint: "bg-[#25D366]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.7-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5 0a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2a.4.4 0 0 0 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3A2.8 2.8 0 0 0 7 8.6a4.8 4.8 0 0 0 1 2.6 11 11 0 0 0 4.2 3.7c1.6.6 1.9.5 2.3.5a2.4 2.4 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c-.1-.1-.2-.2-.4-.2Z" />
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "Facebook",
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    tint: "bg-[#1877F2]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
        <path d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.62H6.61v3.56h3.07V22h3.68v-9.12h3.06l.46-3.56h-3.52V7.05c0-1.03.28-1.73 1.76-1.73Z" />
      </svg>
    ),
  },
  {
    key: "x",
    label: "X",
    href: (url, text) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    tint: "bg-black",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="currentColor" aria-hidden>
        <path d="M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.2 22H2l7.6-8.7L1.6 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 3.8H5.5L17.7 20Z" />
      </svg>
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    tint: "bg-[#0A66C2]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.8-2.1c4 0 4.75 2.6 4.75 6V21h-4v-5.6c0-1.35 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21H9V9Z" />
      </svg>
    ),
  },
  {
    key: "email",
    label: "Email",
    href: (url, text) =>
      `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
    tint: "bg-brand-navy",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 7 8.5 6 8.5-6" />
      </svg>
    ),
  },
];

export function ShareModal({ onClose, path, address, guide, image, type }: Props) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  // Built from the live origin rather than a configured domain, so the link is
  // correct in dev, on a preview host and in production without extra config.
  const url = typeof window === "undefined" ? path : `${window.location.origin}${path}`;
  const text = `${address} — ${guide}`;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard access can be refused (insecure origin, permissions policy).
      // Selecting the text still lets the visitor copy it by hand.
      urlRef.current?.select();
      return;
    }
    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  }

  // Safe to read during render: this component only ever mounts after a click,
  // so there is no server pass to disagree with.
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const dialog = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
    >
      <button
        type="button"
        aria-label="Close share dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <div className="relative z-10 w-full sm:max-w-[460px] overflow-hidden rounded-t-[20px] sm:rounded-[16px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between border-b border-brand-silver/40 px-[20px] py-[16px]">
          <h2 id="share-modal-title" className="font-display text-[17px] font-bold text-brand-navy">
            Share this property
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-brand-bunker transition hover:bg-brand-soft"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[16px] w-[16px]"
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

        <div className="px-[20px] py-[18px]">
          <div className="flex items-center gap-[12px] rounded-[12px] bg-brand-soft/50 p-[10px]">
            <div className="relative h-[56px] w-[76px] shrink-0 overflow-hidden rounded-[8px] bg-brand-soft-2">
              <Image src={image} alt="" fill sizes="76px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-[14px] font-semibold text-brand-bunker">
                {address}
              </p>
              <p className="mt-[2px] font-display text-[13px] text-brand-bunker/70">
                {guide}
                {type ? ` · ${type}` : ""}
              </p>
            </div>
          </div>

          <div className="mt-[18px] flex items-stretch gap-[8px]">
            <input
              ref={urlRef}
              readOnly
              value={url}
              aria-label="Listing link"
              onFocus={(e) => e.currentTarget.select()}
              className="h-[44px] min-w-0 flex-1 rounded-[10px] border border-brand-silver bg-white px-[12px] font-display text-[13px] text-brand-bunker/80 focus:border-brand-navy focus:outline-none"
            />
            <button
              type="button"
              onClick={copy}
              className={`flex h-[44px] shrink-0 items-center gap-[7px] rounded-[10px] px-[16px] font-display text-[13px] font-semibold transition ${
                copied
                  ? "bg-[#1B8A4B] text-white"
                  : "bg-brand-navy text-white hover:bg-brand-navy-deep"
              }`}
            >
              {copied ? <TickIcon /> : <LinkIcon />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="mt-[20px] grid grid-cols-5 gap-[8px]">
            {TARGETS.map((t) => (
              <a
                key={t.key}
                href={t.href(url, text)}
                target={t.key === "email" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-[7px] rounded-[10px] py-[10px] transition hover:bg-brand-soft"
              >
                <span
                  className={`flex h-[38px] w-[38px] items-center justify-center rounded-full text-white ${t.tint}`}
                >
                  {t.icon}
                </span>
                <span className="font-display text-[11px] font-medium text-brand-bunker/75">
                  {t.label}
                </span>
              </a>
            ))}
          </div>

          {canNativeShare && (
            <button
              type="button"
              onClick={() => {
                // Errors here are almost always the visitor dismissing the
                // sheet, which is not a failure worth surfacing.
                navigator.share({ title: address, text, url }).catch(() => {});
              }}
              className="mt-[16px] flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[10px] border border-brand-navy font-display text-[14px] font-semibold text-brand-navy transition hover:bg-brand-soft"
            >
              <ShareIcon />
              More sharing options
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </svg>
  );
}

function TickIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[16px] w-[16px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}
