"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const buyLinks = [
  { label: "Buy", href: "/buy" },
  { label: "Sell", href: "/property-report-digital-appraisal" },
  { label: "Rent", href: "/rent" },
];

const ownLinks = [
  { label: "Find a Property Manager", href: "/agents" },
  { label: "Find an Agent", href: "/agents" },
  { label: "Find an Office", href: "/contact" },
];

const aboutLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Leadership", href: "/agents" },
  { label: "Contact Us", href: "/contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav className="relative z-30 w-full bg-white overflow-visible">
        <div className="container-page flex h-[56px] sm:h-[64px] lg:h-[72px] items-center justify-between">
          <Link href="/" className="block shrink-0">
            <Image
              src="/logo/LOGO.png"
              alt="Blue Ribbon Real Estate"
              width={260}
              height={64}
              priority
              className="h-[104px] sm:h-[110px] lg:h-[132px] w-auto"
            />
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="flex h-[48px] w-[48px] lg:h-[64px] lg:w-[64px] items-center justify-center text-brand-navy transition hover:opacity-70"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[24px] w-[24px] lg:h-[28px] lg:w-[28px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="13" x2="20" y2="13" />
              <line x1="4" y1="19" x2="20" y2="19" />
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
          <div className="container-page flex h-[56px] sm:h-[64px] lg:h-[72px] items-center justify-between">
            <Link href="/" onClick={() => setOpen(false)} className="block shrink-0">
              <Image
                src="/logo/LOGO.png"
                alt="Blue Ribbon Real Estate"
                width={260}
                height={64}
                className="h-[104px] sm:h-[110px] lg:h-[132px] w-auto"
              />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-[48px] w-[48px] lg:h-[64px] lg:w-[64px] items-center justify-center text-brand-navy transition hover:opacity-70"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[24px] w-[24px] lg:h-[28px] lg:w-[28px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </button>
          </div>

          {/* Mobile drawer */}
          <div className="md:hidden container-page pt-[24px] pb-[36px]">
            <ul className="flex flex-col gap-[20px]">
              {[
                { label: "Buy", href: "/buy" },
                { label: "Sell", href: "/property-report-digital-appraisal" },
                { label: "Rent", href: "/rent" },
                { label: "Our Team", href: "/agents" },
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "Property Estimate", href: "/property-report-digital-appraisal" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-[18px] font-bold text-brand-bunker hover:text-brand-navy"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-[28px] flex items-center gap-[12px]">
              <SocialLink label="Facebook">
                <FacebookIcon />
              </SocialLink>
              <SocialLink label="YouTube">
                <YouTubeIcon />
              </SocialLink>
              <SocialLink label="TikTok">
                <TikTokIcon />
              </SocialLink>
              <SocialLink label="Instagram">
                <InstagramIcon />
              </SocialLink>
            </div>
            <Image
              src="/images/footer%20image.png"
              alt="Rate My Agent"
              width={1076}
              height={324}
              quality={100}
              sizes="180px"
              className="mt-[16px] h-auto w-[180px]"
            />
          </div>

          {/* Tablet / desktop drawer */}
          <div className="hidden md:block container-page pb-[10rem] pt-[6vw] lg:pt-[10vw]">
            <div className="grid grid-cols-1 gap-x-[56px] gap-y-[36px] lg:grid-cols-12 lg:items-start">
              <div className="flex flex-col gap-[14px] lg:col-span-2">
                {buyLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex h-[52px] w-full max-w-[200px] items-center justify-center rounded-[16px] bg-brand-navy font-display text-[15px] font-medium text-white transition hover:bg-brand-navy-deep"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="mt-[64px] flex items-center gap-[12px]">
                  <SocialLink label="Facebook">
                    <FacebookIcon />
                  </SocialLink>
                  <SocialLink label="YouTube">
                    <YouTubeIcon />
                  </SocialLink>
                  <SocialLink label="TikTok">
                    <TikTokIcon />
                  </SocialLink>
                  <SocialLink label="Instagram">
                    <InstagramIcon />
                  </SocialLink>
                </div>
                <Image
                  src="/images/footer%20image.png"
                  alt="Rate My Agent"
                  width={1076}
                  height={324}
                  quality={100}
                  sizes="180px"
                  className="mt-[16px] h-auto w-[180px]"
                />
              </div>

              <DrawerColumn
                title="Own your Australian Dream"
                links={ownLinks}
                onSelect={() => setOpen(false)}
                className="lg:col-span-5 lg:col-start-4"
              />

              <DrawerColumn
                title="About Us"
                links={aboutLinks}
                onSelect={() => setOpen(false)}
                className="lg:col-span-3 lg:col-start-10"
              />
            </div>
          </div>

          <Image
            aria-hidden
            src="/logo/241.png"
            alt=""
            width={1200}
            height={500}
            className="pointer-events-none fixed bottom-0 right-0 hidden h-auto w-[clamp(340px,42vw,720px)] md:block"
          />
        </div>
      )}
    </>
  );
}

function DrawerColumn({
  title,
  links,
  onSelect,
  className = "",
}: {
  title: string;
  links: { label: string; href: string }[];
  onSelect: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="font-display text-[20px] sm:text-[24px] lg:text-[26px] font-semibold leading-tight text-brand-bunker">
        {title}
      </h3>
      <ul className="mt-[24px] flex flex-col gap-[14px]">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              onClick={onSelect}
              className="font-display text-[15px] sm:text-[16px] font-medium text-brand-bunker transition hover:text-brand-navy"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="inline-flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:opacity-80"
    >
      {children}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5H16.7V4.65A22 22 0 0 0 14.4 4.5c-2.3 0-3.9 1.4-3.9 4v2.4H7.8V14h2.7v8h3z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[20px] w-[20px]" aria-hidden>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.81a4.85 4.85 0 0 1-1.84-.12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}
