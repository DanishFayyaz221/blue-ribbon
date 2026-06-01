import Image from "next/image";
import Link from "next/link";

const mobileAboutLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Leadership", href: "/agents" },
  { label: "Contact Us", href: "/contact" },
];

const mobileInsightsLinks = [
  { label: "Sell your Property", href: "/appraisal" },
  { label: "Market Updates", href: "/buy" },
  { label: "Newsletter", href: "#newsletter" },
];

const mobileOfficeLinks = [
  { label: "Office Location", href: "/contact" },
  { label: "Meet an Agent", href: "/agents" },
  { label: "Find an Office", href: "/contact" },
];

const buyLinks = [
  { label: "Buy", href: "/buy" },
  { label: "Sell", href: "/appraisal" },
  { label: "Rent", href: "/buy?type=rent" },
];

const aboutLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Leadership", href: "/agents" },
  { label: "Contact Us", href: "/contact" },
];

const insightsLinks = [
  { label: "Get your Property...", href: "/appraisal" },
  { label: "Our Latest Properties", href: "/buy" },
  { label: "BlueRibbon Search", href: "/buy" },
];

const officeLinks = [
  { label: "Office Location", href: "/contact" },
  { label: "Find an Agent", href: "/agents" },
  { label: "Find an Office", href: "/contact" },
];

export function Footer() {
  return (
    <>
      <MobileFooter />
      <DesktopFooter />
    </>
  );
}

function MobileFooter() {
  return (
    <footer className="lg:hidden w-full bg-[#0a0a0a] text-white">
      <div className="container-page pt-[28px] pb-[24px]">
        <Image
          src="/logo/mobile%20footer.png"
          alt="Blue Ribbon Real Estate"
          width={1122}
          height={193}
          quality={100}
          priority
          sizes="200px"
          className="h-[32px] w-auto"
        />

        <div className="mt-[28px] flex flex-col gap-[24px]">
          <MobileLinkColumn title="About Us" links={mobileAboutLinks} />
          <MobileLinkColumn title="Insights" links={mobileInsightsLinks} />
          <MobileLinkColumn title="Our Office" links={mobileOfficeLinks} />
        </div>

        <Link
          href="#refer"
          className="mt-[28px] inline-flex h-[42px] items-center justify-center rounded-[20px] bg-brand-navy px-[22px] font-display text-[13px] font-medium text-white transition hover:bg-brand-navy-deep"
        >
          Refer a Friend
        </Link>

        <p className="mt-[24px] font-display text-[11.5px] text-white/60">
          © 2026 Blue Ribbon Real Estate. All Rights Reserved.
        </p>
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
              className="font-display text-[14px] font-medium text-white/70 hover:text-white"
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
    <footer className="hidden lg:block w-full bg-white">
      <div className="container-page pt-[clamp(38px,4.35vw,76px)] pb-[clamp(28px,2.4vw,44px)]">
        <div className="grid gap-x-[clamp(18px,2.15vw,36px)] gap-y-[36px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-[170px_1fr_1fr_1fr_auto]">
          <div className="flex flex-col gap-[14px] sm:order-1">
            {buyLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex h-[44px] w-full max-w-[160px] items-center justify-center rounded-[10px] bg-brand-navy font-display text-[13px] font-medium text-white transition hover:bg-brand-navy-deep"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <LinkColumn title="About Us" titleHref="/about" links={aboutLinks} className="sm:order-2" />
          <LinkColumn title="Insights" links={insightsLinks} className="sm:order-3" />
          <div className="sm:order-4">
            <LinkColumn title="Our Office" links={officeLinks} />
            <div className="mt-[16px] flex flex-col gap-[2px] font-display text-[14px] italic font-medium leading-[22px] tracking-[0.04em] text-brand-bunker">
              <p>11/76-80 Station Street,</p>
              <p>Wentworthville, NSW 2145</p>
              <p className="not-italic mt-[8px]">
                <a href="mailto:sales@blueribbonre.com.au" className="hover:underline italic">
                  sales@blueribbonre.com.au
                </a>
              </p>
              <p className="italic">
                <a href="tel:1300579093" className="hover:underline">
                  1300 579 093
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-[20px] sm:order-5 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-[14px]">
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
              className="h-auto w-[180px]"
            />
          </div>
        </div>
      </div>

      <div className="bg-black text-white">
        <div className="container-page flex flex-col gap-[6px] py-[14px] text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="font-display text-[13px] sm:text-[15px] font-medium leading-[1.4]">
            ©2026 Blue Ribbon Real Estate. All Rights Reserved.
          </p>
          <div className="flex items-center justify-center gap-[20px]">
            <Link href="#" className="font-display text-[13px] sm:text-[14px] font-medium hover:underline">
              Terms &amp; Conditions
            </Link>
            <Link href="#" className="font-display text-[13px] sm:text-[14px] font-medium hover:underline">
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
    "mb-[14px] font-display text-[18px] sm:text-[20px] font-bold leading-tight text-brand-bunker";
  return (
    <div className={className}>
      {titleHref ? (
        <Link href={titleHref} className={`${headingClass} block hover:underline`}>
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
              className="font-display text-[13px] sm:text-[14px] font-medium tracking-[0.02em] text-brand-bunker hover:underline"
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
      className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-full bg-black text-white transition hover:opacity-80"
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
