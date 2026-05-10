import Link from "next/link";

const aboutLinks = [
  { label: "Our Story", href: "#" },
  { label: "Leadership", href: "#" },
  { label: "Contact Us", href: "#" },
];

const insightsLinks = [
  { label: "Get your Property...", href: "#" },
  { label: "Our Latest Properties", href: "#" },
  { label: "BlueRibbon Search", href: "#" },
];

const officeLinks = [
  { label: "Office Location", href: "#" },
  { label: "Find an Agent", href: "#" },
  { label: "Find an Office", href: "#" },
];

export function Footer() {
  return (
    <footer className="w-[1920px]">
      <div className="relative h-[407.667px] w-[1920px] bg-white">
        <div className="absolute left-[74.67px] top-[85.33px] flex h-[266.333px] w-[1474.667px]">
          <div className="flex w-[122px] flex-col gap-[21.33px] mr-[32px]">
            <FooterButton>Buy</FooterButton>
            <FooterButton>Sell</FooterButton>
            <FooterButton>Rent</FooterButton>
          </div>

          <div className="ml-[418px] flex gap-[32px]">
            <LinkColumn title="About Us" titleHref="/about" links={aboutLinks} />
            <LinkColumn title="Insights" links={insightsLinks} />
            <LinkColumn title="Our Office" links={officeLinks} />
          </div>
        </div>

        <div className="absolute left-[697px] top-[277.5px] w-[539px] font-display text-[15.47px] italic font-medium leading-[23px] tracking-[0.9244px] text-black">
          11/76-80 Station Street,
          <br />
          Wentworthville, NSW 2145
        </div>
        <div className="absolute left-[1001px] top-[267px] w-[316px] whitespace-nowrap font-display text-[15.47px] italic font-medium leading-[34.667px] tracking-[0.9244px] text-black">
          sales@blueribbonre.com.au
        </div>
        <div className="absolute left-[1001px] top-[300px] w-[160px] whitespace-nowrap font-display text-[15.47px] italic font-medium leading-[34.667px] tracking-[0.9244px] text-black">
          1300 579 093
        </div>

        <div className="absolute left-[1623.67px] top-[85.33px] w-[296px]">
          <div className="flex h-[32px] items-center gap-[24px]">
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
          <div className="mt-[26.67px]">
            <RateMyAgentBadge />
          </div>
        </div>
      </div>

      <div className="relative flex h-[64.667px] w-[1920px] items-center justify-between bg-black px-[74.67px] text-white">
        <p className="font-display text-[15.2px] font-medium leading-[21.333px]">
          ©2026 Blue Ribbon Real Estate. All Rights Reserved.
        </p>
        <div className="flex items-center gap-[24px]">
          <a href="#" className="font-display text-[14.533px] font-medium hover:underline">
            Terms &amp; Conditions
          </a>
          <a href="#" className="font-display text-[14.533px] font-medium hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-[51.055px] w-[122px] items-center justify-center rounded-[12px] bg-brand-navy font-display text-[13.52px] font-medium leading-[22.691px] text-white transition hover:bg-brand-navy-deep"
    >
      {children}
    </button>
  );
}

function LinkColumn({
  title,
  titleHref,
  links,
}: {
  title: string;
  titleHref?: string;
  links: { label: string; href: string }[];
}) {
  const headingClass =
    "mb-[14px] whitespace-nowrap font-display text-[20px] font-bold leading-[26.667px] tracking-[0.4267px] text-[#11181c]";
  return (
    <div className="w-[180px]">
      {titleHref ? (
        <Link href={titleHref} className={`${headingClass} block hover:underline`}>
          {title}
        </Link>
      ) : (
        <h3 className={headingClass}>{title}</h3>
      )}
      <ul className="flex flex-col gap-[10px]">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="font-display text-[14.8px] font-medium leading-[21.333px] tracking-[0.32px] text-[#11181c] hover:underline"
            >
              {link.label}
            </a>
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
      className="inline-flex h-[32px] w-[32px] items-center justify-center text-brand-navy transition hover:opacity-70"
    >
      {children}
    </a>
  );
}

function RateMyAgentBadge() {
  return (
    <div className="inline-flex h-[55px] w-[193px] items-center justify-center rounded-[6px] bg-brand-navy px-4 font-display text-[20px] font-bold tracking-tight text-white">
      <span>rate</span>
      <span className="mx-0.5 text-rose-500">my</span>
      <span>agent</span>
      <span className="ml-0.5 align-top text-[10px]">&reg;</span>
    </div>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[28px] w-[28px]"
      aria-hidden
    >
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[24px] w-[32px]"
      aria-hidden
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[28px] w-[28px]"
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.81a4.85 4.85 0 0 1-1.84-.12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[28px] w-[28px]"
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

