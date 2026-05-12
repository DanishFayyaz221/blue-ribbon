"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const buyLinks = [
  { label: "Buy", href: "/buy" },
  { label: "Sell", href: "/appraisal" },
  { label: "Rent", href: "/buy?type=rent" },
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
              className="h-[40px] sm:h-[80px] lg:h-[100px] w-auto"
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
                className="h-[40px] sm:h-[80px] lg:h-[100px] w-auto"
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
          <div className="md:hidden container-page pt-[28px] pb-[40px]">
            <ul className="flex flex-col gap-[24px]">
              {[
                { label: "Buy", href: "/buy" },
                { label: "Sell", href: "/appraisal" },
                { label: "Rent", href: "/buy?type=rent" },
                { label: "Our Team", href: "/agents" },
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "Property Estimate", href: "/appraisal" },
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
          </div>

          {/* Tablet / desktop drawer */}
          <div className="hidden md:block container-page pb-[10rem] pt-[6vw] lg:pt-[10vw]">
            <div className="grid grid-cols-1 gap-x-[64px] gap-y-[40px] lg:grid-cols-12 lg:items-start">
              <div className="flex flex-col gap-[16px] lg:col-span-2">
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
