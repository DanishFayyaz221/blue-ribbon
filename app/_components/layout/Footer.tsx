import Image from "next/image";
import Link from "next/link";
import { FooterDealButtons } from "./FooterDealButtons";
import { RollLink } from "../ui/RollLink";
import { RATE_MY_AGENT_URL } from "./links";

/** Buy / Rent / Sell in the comp's order for the phone footer, then Sold. */
const mobileDealLinks = [
  { label: "Buy", href: "/buy" },
  { label: "Rent", href: "/rent" },
  { label: "Sell", href: "/property-report-digital-appraisal" },
  { label: "Sold", href: "/sold" },
];

const mobileAboutLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Our Team", href: "/agents" },
  { label: "Contact Us", href: "/contact" },
];

const mobileInsightsLinks = [
  { label: "Get your Property Estimate", href: "/property-report-digital-appraisal" },
  { label: "Our Latest Properties", href: "/buy" },
  { label: "BlueRibbon Search", href: "/buy" },
  { label: "Market Insights", href: "/market-insights" },
];

const buyLinks = [
  { label: "Buy", href: "/buy" },
  { label: "Sell", href: "/property-report-digital-appraisal" },
  // `/rent`, not `/buy?type=rent`: the rentals page is a route of its own,
  // and that query never filtered anything — the button simply landed on the
  // sales listings.
  { label: "Rent", href: "/rent" },
  { label: "Sold", href: "/sold" },
];

const aboutLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Our Team", href: "/agents" },
  { label: "Contact Us", href: "/contact" },
];

const insightsLinks = [
  { label: "Get your Property Estimate", href: "/property-report-digital-appraisal" },
  { label: "Our Latest Properties", href: "/buy" },
  { label: "BlueRibbon Search", href: "/buy" },
  { label: "Market Insights", href: "/market-insights" },
];

export function Footer() {
  return (
    <>
      <MobileFooter />
      <DesktopFooter />
    </>
  );
}

/**
 * Navy satin backdrop shared by both footers. `footer.png` is the designer's
 * fabric texture, painted with object-cover so it fills whatever height the
 * footer takes. The footer's own navy-deep background sits behind it as the
 * colour shown while the image is still loading (and behind the one-pixel
 * transparent column the export carries on its right edge).
 */
function FooterBackdrop() {
  return (
    <Image
      src="/images/footer.png"
      alt=""
      fill
      // 60, as on the other satin backdrops. This is a soft fabric texture
      // under white copy, where the bytes 90 costs buy nothing visible — and
      // it is a 1MB source on every page. Next flagged it as the LCP element
      // on a page whose body failed to load; it is below the fold in the
      // normal case, so `priority` would be the wrong fix.
      quality={60}
      sizes="100vw"
      className="pointer-events-none object-cover object-center"
    />
  );
}

function MobileFooter() {
  return (
    <footer className="relative lg:hidden w-full overflow-hidden bg-brand-navy-deep text-white">
      <FooterBackdrop />
      <div className="relative z-10 container-page pt-[36px] pb-[20px]">
        {/* Buy / Rent / Sell / Sold: equal outlined pills across the width. */}
        <div className="flex items-center gap-[12px]">
          {mobileDealLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex h-[40px] flex-1 items-center justify-center rounded-[10px] border border-white font-display text-[12px] font-medium text-white transition hover:bg-white hover:text-brand-navy"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-[36px] grid grid-cols-[auto_1fr] gap-x-[36px] gap-y-[28px]">
          <MobileLinkColumn title="About Us" links={mobileAboutLinks} />
          <MobileLinkColumn title="Insights" links={mobileInsightsLinks} />
        </div>

        {/* The same character roll as the desktop footer and the Contact
            page's "Visit Our Office" links. A phone has no hover to drive
            it, so `autoplayOnScroll` plays it once as each link reaches the
            viewport. */}
        <div className="mt-[36px] flex flex-col items-start gap-[4px] font-display text-[14px] italic font-medium leading-[22px] tracking-[0.04em] text-white/85">
          <RollLink
            href="https://maps.google.com/?q=Blue+Ribbon+Real+Estate,+11/76-80+Station+St,+Wentworthville+NSW+2145"
            target="_blank"
            rel="noopener noreferrer"
            lines
            autoplayOnScroll
            className="roll-link-white"
          >
            {"11/76-80 Station Street,\nWentworthville, NSW 2145"}
          </RollLink>
          <RollLink
            href="mailto:sales@blueribbonre.com.au"
            autoplayOnScroll
            className="roll-link-white mt-[14px]"
          >
            sales@blueribbonre.com.au
          </RollLink>
          <RollLink href="tel:1300579093" autoplayOnScroll className="roll-link-white">
            1300 579 093
          </RollLink>
        </div>

        <div className="mt-[32px] flex items-center justify-between gap-[16px]">
          <div className="flex items-center gap-[10px]">
            <SocialLink label="Facebook" href="https://www.facebook.com/blueribbonrealestateagents/">
              <FacebookIcon />
            </SocialLink>
            <SocialLink label="YouTube" href="https://youtube.com/@blueribbonrealestate">
              <YouTubeIcon />
            </SocialLink>
            <SocialLink label="TikTok" href="https://www.tiktok.com/@blueribbonrealestate">
              <TikTokIcon />
            </SocialLink>
            <SocialLink
              label="Instagram"
              href="https://www.instagram.com/blueribbonrealestateagents"
            >
              <InstagramIcon />
            </SocialLink>
          </div>
          {/* The badge is Rate My Agent's, so it goes to our profile there,
              not to our own team page. A plain <a>, not next/link: the target
              is off-site, and it opens in a new tab like the social links. */}
          <a
            href={RATE_MY_AGENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Blue Ribbon Real Estate on Rate My Agent"
            className="block shrink-0 transition hover:opacity-80"
          >
            <Image
              src="/images/rate-my-agent-dark.png"
              alt="Rate My Agent"
              width={1076}
              height={324}
              quality={100}
              sizes="140px"
              className="h-auto w-[140px]"
            />
          </a>
        </div>

        <p className="mt-[32px] text-center font-display text-[11.5px] text-white/85">
          ©2026 Blue Ribbon Real Estate. All Rights Reserved.
        </p>
        <div className="mt-[8px] flex items-center justify-center gap-[8px] font-display text-[10.5px] text-white/70">
          <Link href="/terms" className="hover:underline">
            Terms &amp; Conditions
          </Link>
          <span aria-hidden>•</span>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

function MobileLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-display text-[15px] font-bold text-white">{title}</h3>
      <ul className="mt-[12px] flex flex-col gap-[10px]">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="font-display text-[13px] text-white/90 hover:text-white hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DesktopFooter() {
  return (
    <footer className="relative hidden lg:block w-full overflow-hidden bg-brand-navy-deep text-white">
      <FooterBackdrop />
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-[var(--page-px)] pt-[clamp(38px,4.35vw,76px)] pb-[clamp(28px,2.4vw,44px)] xl:max-w-none">
        {/* Top row: buttons | About | Insights | social+logo */}
        <div className="grid gap-x-[clamp(18px,2.15vw,36px)] grid-cols-[auto_1fr_auto_auto_auto_1fr_auto]">
          <div className="col-start-1 flex flex-col gap-[12px]">
            <FooterDealButtons links={buyLinks} />
          </div>

          {/* The two link columns sit closer to each other than to anything
              else in the row. `gap-x` is a property of the whole grid, so it
              cannot be narrowed for one pair; pulling this column's right
              edge in by the difference does it locally and leaves the gaps
              either side of the pair alone. */}
          <LinkColumn
            title="About Us"
            links={aboutLinks}
            className="col-start-3 -mr-[clamp(6px,0.95vw,16px)]"
          />
          <LinkColumn title="Insights" links={insightsLinks} className="col-start-4" />

          <div className="col-start-7 flex flex-col gap-[20px] justify-self-end">
            <div className="flex items-center gap-[14px]">
              <SocialLink label="Facebook" href="https://www.facebook.com/blueribbonrealestateagents/">
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
            <a
              href={RATE_MY_AGENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Blue Ribbon Real Estate on Rate My Agent"
              className="block transition hover:opacity-80"
            >
              {/* Transparent cut of the Rate My Agent badge: the original
                  (still used in the nav drawer) carries an opaque white slab
                  that read as a white block on the navy fabric. */}
              <Image
                src="/images/rate-my-agent-dark.png"
                alt="Rate My Agent"
                width={1076}
                height={324}
                quality={100}
                sizes="180px"
                className="h-auto w-[180px]"
              />
            </a>
          </div>

          {/* Address row. In the SAME grid as the columns above, not a second
              one below it: two grids size their `auto` tracks from their own
              content, so column 3 was as wide as "About Us" in one and as
              wide as the street address in the other, and the two
              `col-start-3` cells landed at different x. Sharing the grid is
              what actually aligns them; `row-start-2` puts these cells on
              their own line and the top margin restores the gap the separate
              block used to provide. */}
          {/* The same roll-on-hover links as the contact page's Visit Our
              Office block, with the hairline in white for the navy ground. */}
          {/* Same negative right margin as the About Us column above, so the
              email/phone cell starts where Insights does. */}
          <div className="col-start-3 row-start-2 -mr-[clamp(6px,0.95vw,16px)] mt-[clamp(44px,4.5vw,72px)] font-display text-[14px] italic font-medium leading-[22px] tracking-[0.04em] text-white/85">
            <RollLink
              href="https://maps.google.com/?q=Blue+Ribbon+Real+Estate,+11/76-80+Station+St,+Wentworthville+NSW+2145"
              target="_blank"
              rel="noopener noreferrer"
              lines
              className="roll-link-white"
            >
              {"11/76-80 Station Street,\nWentworthville, NSW 2145"}
            </RollLink>
          </div>
          <div className="col-start-4 col-span-2 row-start-2 mt-[clamp(44px,4.5vw,72px)] font-display text-[14px] italic font-medium leading-[22px] tracking-[0.04em] text-white/85">
            <p className="whitespace-nowrap">
              <RollLink href="mailto:sales@blueribbonre.com.au" className="roll-link-white">
                sales@blueribbonre.com.au
              </RollLink>
            </p>
            <p>
              <RollLink href="tel:1300579093" className="roll-link-white">
                1300 579 093
              </RollLink>
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-black text-white">
        <div className="mx-auto w-full max-w-[1280px] px-[var(--page-px)] flex flex-col gap-[6px] py-[14px] text-center sm:flex-row sm:items-center sm:justify-between sm:text-left xl:max-w-none">
          <p className="font-display text-[13px] sm:text-[15px] font-medium leading-[1.4]">
            ©2026 Blue Ribbon Real Estate. All Rights Reserved.
          </p>
          <div className="flex items-center justify-center gap-[20px]">
            <Link href="/terms" className="font-display text-[13px] sm:text-[14px] font-medium hover:underline">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="font-display text-[13px] sm:text-[14px] font-medium hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function LinkColumn({
  title,
  titleHref,
  links,
  className = "",
}: {
  title: string;
  titleHref?: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  const headingClass =
    "mb-[14px] font-display text-[18px] sm:text-[20px] font-bold leading-tight text-white";
  return (
    <div className={className}>
      {titleHref ? (
        <Link href={titleHref} className={`${headingClass} block`}>
          {title}
        </Link>
      ) : (
        <h3 className={headingClass}>{title}</h3>
      )}
      <ul className="flex flex-col gap-[8px]">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="font-display text-[13px] sm:text-[14px] font-medium tracking-[0.02em] text-white/80 hover:text-white hover:underline"
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
      className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white bg-transparent text-white transition hover:bg-white hover:text-brand-navy"
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
