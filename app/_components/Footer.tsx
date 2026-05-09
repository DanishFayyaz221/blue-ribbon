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
    <footer>
      <div className="bg-white px-6 pt-14 pb-10 text-brand-navy">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[auto_1fr_auto] lg:gap-16">
            <div className="flex flex-col gap-4">
              <FooterButton>Buy</FooterButton>
              <FooterButton>Sell</FooterButton>
              <FooterButton>Rent</FooterButton>
            </div>

            <div>
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
                <LinkColumn title="About Us" links={aboutLinks} />
                <LinkColumn title="Insights" links={insightsLinks} />
                <LinkColumn title="Our Office" links={officeLinks} />
              </div>

              <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10">
                <p className="text-sm italic leading-relaxed">
                  11/76-80 Station Street,
                  <br />
                  Wentworthville, NSW 2145
                </p>
                <div className="space-y-1 text-sm italic">
                  <p>sales@blueribbonre.com.au</p>
                  <p>1300 579 093</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-5 lg:items-end">
              <div className="flex items-center gap-4 text-brand-navy">
                <SocialLink label="Facebook" href="#">
                  <FacebookIcon />
                </SocialLink>
                <SocialLink label="YouTube" href="#">
                  <YouTubeIcon />
                </SocialLink>
                <SocialLink label="TikTok" href="#">
                  <TikTokIcon />
                </SocialLink>
                <SocialLink label="Instagram" href="#">
                  <InstagramIcon />
                </SocialLink>
              </div>
              <RateMyAgentBadge />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-navy px-6 py-3 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>&copy;2026 Blue Ribbon Real Estate. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:underline">
              Terms &amp; Conditions
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-lg bg-brand-navy px-12 py-2.5 text-sm font-medium text-white transition hover:bg-brand-navy-deep"
    >
      {children}
    </button>
  );
}

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-5 text-base font-bold">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="text-sm hover:underline">
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
  href,
  children,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-7 w-7 items-center justify-center transition hover:opacity-70"
    >
      {children}
    </a>
  );
}

function RateMyAgentBadge() {
  return (
    <div className="inline-flex items-center rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white">
      <span>rate</span>
      <span className="text-rose-500">my</span>
      <span>agent</span>
      <span className="ml-0.5 text-[8px] align-top">&reg;</span>
    </div>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-7 w-7"
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
      className="h-7 w-7"
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
      className="h-7 w-7"
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
      className="h-7 w-7"
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}
