"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowInline } from "../ui/ArrowInline";

/**
 * How long the close animation runs before the drawer unmounts or the route
 * changes. The longest of the exits: the phone drawer slides out in 400ms,
 * the desktop sheet wipes up in 480ms (globals.css). Navigating any earlier
 * swaps the page in under a half-closed menu.
 */
const DRAWER_CLOSE_MS = 480;
/** The phone's side drawer slides out in 400ms (`animate-drawer-out`), not
 *  the 480ms the desktop sheet's wipe takes — the sheet's animation is inside
 *  a `min-width: 768px` block and never runs on a phone. Waiting the desktop
 *  figure there held the navigation back for 80ms after the drawer had
 *  already gone. */
const PHONE_DRAWER_CLOSE_MS = 400;

const buyLinks = [
  { label: "Buy", href: "/buy" },
  { label: "Sell", href: "/property-report-digital-appraisal" },
  { label: "Rent", href: "/rent" },
];

const ownLinks = [
  { label: "Get your property estimate within 9 seconds", href: "/property-report-digital-appraisal" },
  { label: "Contact Your Agent", href: "/agents" },
  { label: "Visit Us", href: "/contact" },
];

const aboutLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Leadership", href: "/agents" },
  { label: "Contact", href: "/contact" },
];

/** Every route the drawer can reach, deduped — warmed when it opens. */
const MENU_ROUTES = Array.from(
  new Set([...buyLinks, ...ownLinks, ...aboutLinks].map((l) => l.href)),
);

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  // The drawer's open/closing flags are keyed to the pathname they were set
  // on, so they read as false the moment a new route renders — the drawer
  // stays up (covering the loading interim) until then, and no effect is
  // needed to reset it. `setOpen`/`setClosing` keep the boolean shape the
  // handlers below already use.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const [closingAt, setClosingAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const closing = closingAt === pathname;
  const setOpen = (v: boolean) => {
    setOpenedAt(v ? pathname : null);
    if (!v) setClosingAt(null);
  };
  const setClosing = (v: boolean) => setClosingAt(v ? pathname : null);

  /** Play the exit animation, THEN navigate. Otherwise Next swaps the page in
      before the drawer has slid out and the transition reads as a hard cut. */
  const closeAndNavigate = (href: string) => {
    if (closing) return;
    // Already here: `router.push` to the current route is a no-op, and since
    // `open`/`closing` are keyed to the pathname, nothing would ever clear
    // them — the sheet would finish its exit animation and hang there. Just
    // close it instead.
    if (href === pathname) {
      closeSmoothly();
      return;
    }
    setClosing(true);
    // Warm the route while the exit animation plays, instead of leaving the
    // network idle for its whole length and only then asking for the page.
    // Most of these routes are server-rendered, so that was dead time bolted
    // onto a fetch that had not started. `push` still waits for the exit, so
    // the drawer is not cut off mid-wipe — but by then the payload is usually
    // already in Next's cache and the page lands immediately.
    router.prefetch(href);
    window.setTimeout(() => {
      router.push(href);
    }, exitMs());
  };

  /** How long this viewport's drawer actually takes to leave. Read per call,
   *  not at mount, so rotating or resizing cannot leave it on the wrong one. */
  const exitMs = () =>
    window.matchMedia("(min-width: 768px)").matches
      ? DRAWER_CLOSE_MS
      : PHONE_DRAWER_CLOSE_MS;

  // Warm every route in the drawer as soon as it opens. The visitor spends a
  // second or two reading the menu before choosing, and on a phone that is
  // otherwise idle network time; by the time they tap, the payload is usually
  // already cached and the exit animation is all that is left to wait for.
  // Six routes, fetched once per opening — App Router dedupes repeats.
  useEffect(() => {
    if (!open) return;
    for (const href of MENU_ROUTES) router.prefetch(href);
  }, [open, router]);

  /** Play the exit animation, then unmount — for the close button, the
      backdrop, Escape and the logo when already on home. Unmounting straight
      away would cut the menu off mid-frame. */
  const closeSmoothly = () => {
    if (!open || closing) return;
    setClosing(true);
    window.setTimeout(() => setOpen(false), exitMs());
  };
  // Escape's listener is registered once; the ref hands it the current
  // closure without re-registering on every render. Updated in an effect,
  // not during render, as the compiler's ref rule requires.
  const closeRef = useRef(closeSmoothly);
  useEffect(() => {
    closeRef.current = closeSmoothly;
  });

  useEffect(() => {
    if (open) {
      // Lock the ROOT, and only the root. The root carries its own overflow
      // setting (overflow-x: clip, globals.css), so the body's overflow never
      // reaches the viewport — a body-only lock left the page scrollbar
      // showing. Worse, overflow: hidden on the body makes the body a scroll
      // container of its own, and the sticky nav then sticks to that instead
      // of the viewport: on a scrolled page it leapt back to the top of the
      // document the moment the sheet opened, and dropped down again on
      // close. With the root locked the viewport stays the scroll container,
      // the nav stays put, and scrollbar-gutter keeps the width steady.
      const root = document.documentElement;
      const prev = root.style.overflow;
      root.style.overflow = "hidden";
      return () => {
        root.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    // Registered once; closeRef carries the current closure (see above).
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav className="nav-shrink sticky top-0 z-40 w-full bg-white overflow-visible">
        <div className="container-page flex h-[56px] sm:h-[64px] lg:h-[72px] items-center justify-between gap-[16px]">
          <Link href="/" className="block shrink-0">
            {/* The file's real pixels. They are what the browser reserves
                space from before the image decodes: with the old 260x64 it
                assumed a 4.06 aspect and, against a fixed height and w-auto,
                laid the logo out 423px wide — wider than a phone, so the page
                could be scrolled sideways until the image landed. */}
            <Image
              src="/logo/LOGO.png"
              alt="Blue Ribbon Real Estate"
              width={1232}
              height={821}
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
        <div
          // Phone: dimmed backdrop that fades. md and up: `menu-sheet` turns
          // this same element into the white sheet that wipes down/up — see
          // globals.css, which also overrides the animate-* classes there.
          data-lenis-prevent
          className={`menu-sheet ${closing ? "is-closing animate-drawer-overlay-out" : "is-opening animate-drawer-overlay"} md:animate-none no-scrollbar fixed inset-0 z-50 flex md:block bg-black/50 backdrop-blur-[2px] md:bg-white md:backdrop-blur-0 md:overflow-y-auto`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSmoothly();
          }}
        >
          <div className={`${closing ? "animate-drawer-out" : "animate-drawer-in"} md:animate-none relative flex h-full w-[86%] max-w-[360px] flex-col overflow-y-auto bg-white md:h-auto md:max-w-none md:w-full md:overflow-visible md:shadow-none`}>
          <div className="container-page flex h-[56px] sm:h-[64px] lg:h-[72px] items-center justify-between">
            <button
              type="button"
              onClick={() => {
                // Already on home — just close the drawer.
                if (pathname === "/") {
                  closeSmoothly();
                  return;
                }
                closeAndNavigate("/");
              }}
              aria-label="Go to home"
              className="block shrink-0 cursor-pointer"
            >
              <Image
                src="/logo/LOGO.png"
                alt="Blue Ribbon Real Estate"
                width={1232}
                height={821}
                className="h-[104px] sm:h-[110px] lg:h-[132px] w-auto"
              />
            </button>
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeSmoothly}
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
          <div className="md:hidden container-page pt-[24px] pb-[36px] flex flex-1 flex-col">
            <ul className="flex flex-col gap-[20px]">
              {[
                { label: "Buy", href: "/buy" },
                { label: "Sell", href: "/property-report-digital-appraisal" },
                { label: "Rent", href: "/rent" },
                { label: "Our Team", href: "/agents" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Property Estimate", href: "/property-report-digital-appraisal" },
              ].map((link, i) => {
                const active = isActive(pathname, link.href);
                // Full contrast on the current page too, matching the desktop
                // pills — a faded entry read as disabled rather than as a
                // "you are here" marker. `aria-current` still carries the
                // state, and closeAndNavigate short-circuits to a plain close
                // when the href is the route already showing.
                return (
                  <li
                    key={link.label}
                    className="drawer-item"
                    style={{ ["--i" as string]: i }}
                  >
                    <button
                      type="button"
                      aria-current={active ? "page" : undefined}
                      onClick={() => closeAndNavigate(link.href)}
                      className="font-display text-[18px] font-bold text-brand-bunker transition-colors hover:text-brand-navy text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div
              className="drawer-item mt-auto pt-[32px]"
              style={{ ["--i" as string]: 8 }}
            >
              <div className="flex items-center gap-[12px]">
                <SocialLink label="Facebook" href="#">
                  <FacebookIcon />
                </SocialLink>
                <SocialLink
                  label="YouTube"
                  href="https://youtube.com/@blueribbonrealestate"
                >
                  <YouTubeIcon />
                </SocialLink>
                <SocialLink
                  label="TikTok"
                  href="https://www.tiktok.com/@blueribbonrealestate"
                >
                  <TikTokIcon />
                </SocialLink>
                <SocialLink
                  label="Instagram"
                  href="https://www.instagram.com/blueribbonrealestateagents"
                >
                  <InstagramIcon />
                </SocialLink>
              </div>
              <button
                type="button"
                onClick={() => closeAndNavigate("/agents")}
                aria-label="Meet our team"
                className="mt-[16px] block cursor-pointer transition hover:opacity-80"
              >
                <Image
                  src="/images/footer%20image.png"
                  alt="Rate My Agent"
                  width={1076}
                  height={324}
                  quality={100}
                  sizes="180px"
                  className="h-auto w-[180px]"
                />
              </button>
            </div>
          </div>

          {/* Tablet / desktop drawer */}
          <div className="hidden md:block container-page pb-[304px] pt-[6vw] lg:pt-[10vw]">
            {/* `menu-grid`: each direct child is one column of the sheet's
                staggered entrance, in DOM order. */}
            <div className="menu-grid grid grid-cols-1 gap-x-[56px] gap-y-[36px] lg:grid-cols-12 lg:items-start">
              <div className="flex flex-col gap-[14px] lg:col-span-2">
                {buyLinks.map((link) => {
                  const active = isActive(pathname, link.href);
                  // No dimmed variant for the current page. These three pills
                  // are the sheet's primary calls to action, and fading the
                  // one you are standing on read as a disabled control rather
                  // than a "you are here" marker. It keeps full contrast and
                  // stays clickable; `aria-current` still carries the state
                  // for assistive tech, and closeAndNavigate on the current
                  // route simply shuts the sheet.
                  return (
                    <button
                      key={link.label}
                      type="button"
                      aria-current={active ? "page" : undefined}
                      onClick={() => closeAndNavigate(link.href)}
                      className="group relative isolate flex h-[52px] w-full max-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-[16px] border border-brand-navy bg-white font-display text-[15px] font-medium text-brand-navy transition-colors duration-300 hover:text-white before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-brand-navy before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:translate-y-0"
                    >
                      <span className="relative z-10">{link.label}</span>
                    </button>
                  );
                })}

                <div className="mt-[64px] flex items-center gap-[12px]">
                  <SocialLink label="Facebook" href="#">
                    <FacebookIcon />
                  </SocialLink>
                  <SocialLink
                    label="YouTube"
                    href="https://youtube.com/@blueribbonrealestate"
                  >
                    <YouTubeIcon />
                  </SocialLink>
                  <SocialLink
                    label="TikTok"
                    href="https://www.tiktok.com/@blueribbonrealestate"
                  >
                    <TikTokIcon />
                  </SocialLink>
                  <SocialLink
                    label="Instagram"
                    href="https://www.instagram.com/blueribbonrealestateagents"
                  >
                    <InstagramIcon />
                  </SocialLink>
                </div>
                <button
                  type="button"
                  onClick={() => closeAndNavigate("/agents")}
                  aria-label="Meet our team"
                  className="mt-[16px] block cursor-pointer transition hover:opacity-80"
                >
                  <Image
                    src="/images/footer%20image.png"
                    alt="Rate My Agent"
                    width={1076}
                    height={324}
                    quality={100}
                    sizes="180px"
                    className="h-auto w-[180px]"
                  />
                </button>
              </div>

              <DrawerColumn
                title="Own your Australian Dream"
                links={ownLinks}
                pathname={pathname}
                onNavigate={closeAndNavigate}
                className="lg:col-span-5 lg:col-start-4"
              />

              <DrawerColumn
                title="About Us"
                links={aboutLinks}
                pathname={pathname}
                onNavigate={closeAndNavigate}
                className="lg:col-span-3 lg:col-start-10"
              />
            </div>
          </div>

          <Image
            aria-hidden
            src="/logo/241.png"
            alt=""
            width={979}
            height={744}
            className="menu-ribbon pointer-events-none fixed bottom-0 right-0 hidden h-auto w-[clamp(340px,42vw,720px)] md:block"
          />
          </div>
        </div>
      )}
    </>
  );
}

function DrawerColumn({
  title,
  links,
  pathname,
  onNavigate,
  className = "",
}: {
  title: string;
  links: { label: string; href: string }[];
  /** Passed in so the column can highlight the link that matches the current
   *  route. Nav owns the pathname; DrawerColumn only reads it. */
  pathname: string;
  onNavigate: (href: string) => void;
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
            <button
              type="button"
              onClick={() => onNavigate(link.href)}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className="group inline-flex items-center font-display text-[15px] sm:text-[16px] font-medium text-brand-bunker transition hover:text-brand-navy text-left"
            >
              {link.label}
              <ArrowInline />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Returns true when a drawer link's href matches the current route. Root ("/")
 * demands an exact match — every path starts with "/", so a prefix check
 * against it would light up every link at once.
 */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SocialLink({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
