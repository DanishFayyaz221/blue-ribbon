import Image from "next/image";
import Link from "next/link";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { PropertySearchBar } from "../_components/property/PropertySearchBar";
import { PropertyCard, type PropertyCardData } from "../_components/property/PropertyCard";
import { Pagination } from "../_components/sections/Pagination";
import { GetInTouchCTA } from "../_components/sections/GetInTouchCTA";

const featured: PropertyCardData[] = Array.from({ length: 12 }, () => ({
  image: "/images/latest-properties.png",
  address: "10 Carlotta Avenue, Gordon",
  guide: "$4,500,000 - $4,900,000",
}));

const mobileFeatured: PropertyCardData[] = [
  { image: "/images/latest-properties.png", address: "15 Brick Street, Hurley", guide: "$975,000" },
  { image: "/images/latest-properties.png", address: "33 Dick Hill Rd, Hurley", guide: "$675,000" },
  { image: "/images/latest-properties.png", address: "22 Brick Street, Hurley", guide: "$575,000" },
  { image: "/images/latest-properties.png", address: "33 Oaks Street, Hurley", guide: "$575,000" },
  { image: "/images/latest-properties.png", address: "15 Brick Street, Hurley", guide: "$975,000" },
  { image: "/images/latest-properties.png", address: "22 Oaks Street, Hurley", guide: "$675,000" },
];

const latest: PropertyCardData[] = Array.from({ length: 4 }, () => ({
  image: "/images/latest-properties.png",
  address: "23 Dick Street, Henley",
  guide: "$8,500,000",
}));

const mobileFilters = ["Buy", "Price", "Beds", "More"] as const;

export default function BuyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <div className="container-page pt-[16px] pb-[16px] sm:pb-[24px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Buy" }]} />
        </div>

        {/* Mobile filter chips */}
        <div className="sm:hidden container-page bg-[#F1F2F4] py-[12px]">
          <div className="no-scrollbar flex gap-[10px] overflow-x-auto">
            {mobileFilters.map((label) => (
              <button
                key={label}
                type="button"
                className="flex h-[36px] shrink-0 items-center gap-[6px] rounded-[8px] border border-brand-silver bg-white px-[14px] font-display text-[13px] font-medium text-brand-bunker"
              >
                {label}
                <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop hero image */}
        <section className="hidden sm:block relative w-full overflow-hidden">
          <div className="relative aspect-[1920/990] min-h-[460px] w-full">
            <Image
              src="/contact/contact-us.png"
              alt="Featured property"
              fill
              priority
              sizes="(max-width: 639px) 1px, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* Desktop search bar */}
        <div className="hidden sm:block container-page mt-[clamp(36px,3.6vw,72px)]">
          <PropertySearchBar />
        </div>

        {/* Mobile: Buy Your Dream + cards */}
        <div className="sm:hidden container-page mt-[18px]">
          <div className="flex items-end justify-between">
            <h1 className="font-display font-bold text-brand-bunker text-[22px] leading-[1.15]">
              Buy Your Dream
            </h1>
            <Link
              href="/appraisal"
              className="font-display text-[13px] font-medium text-brand-bunker hover:text-brand-navy"
            >
              Sell yours →
            </Link>
          </div>
          <div className="mt-[18px] grid grid-cols-2 gap-x-[12px] gap-y-[20px]">
            {mobileFeatured.map((p, i) => (
              <Link
                key={i}
                href="/property/1"
                className="group block overflow-hidden rounded-[14px] border border-brand-silver/60 bg-white"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.address}
                    fill
                    sizes="(max-width: 639px) 50vw, 1px"
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-[12px]">
                  <p className="font-display text-[13px] font-semibold leading-[1.3] text-brand-bunker">
                    {p.address}
                  </p>
                  <p className="mt-[2px] font-display text-[12px] text-brand-bunker/60">
                    Guide {p.guide}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop: list/map toggle + grid */}
        <div className="hidden sm:block container-page mt-[clamp(32px,3.15vw,58px)]">
          <div className="flex flex-col gap-[14px] sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-display font-bold text-brand-bunker text-[clamp(1.35rem,1.9vw,2.25rem)] leading-[1.15]">
              Buy Your Dream
            </h1>
            <div className="flex items-center gap-[6px] rounded-full border border-brand-silver p-[4px]">
              <button
                type="button"
                className="rounded-full bg-brand-navy px-[18px] py-[8px] font-display text-[13px] font-medium text-white"
              >
                List
              </button>
              <button
                type="button"
                className="rounded-full px-[18px] py-[8px] font-display text-[13px] font-medium text-brand-bunker"
              >
                Map
              </button>
            </div>
          </div>

          <div className="mt-[clamp(24px,2.25vw,42px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(14px,1.5vw,28px)]">
            {featured.map((p, i) => (
              <PropertyCard key={i} {...p} variant="tall" />
            ))}
          </div>

          <div className="mt-[clamp(36px,2.7vw,50px)]">
            <Pagination total={5} />
          </div>
        </div>

        {/* Mobile: Our latest Properties (horizontal scroll) */}
        <div className="sm:hidden mt-[28px]">
          <div className="container-page">
            <h2 className="font-display font-bold text-brand-bunker text-[18px] leading-[1.15]">
              Our latest Properties
            </h2>
          </div>
          <div className="no-scrollbar mt-[16px] flex snap-x snap-mandatory gap-[14px] overflow-x-auto px-[var(--page-px)] pb-[8px]">
            {latest.map((p, i) => (
              <div key={i} className="snap-start shrink-0 basis-[60%]">
                <PropertyCard {...p} variant="wide" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Want to get in touch CTA */}
        <section className="sm:hidden w-full bg-white mt-[28px]">
          <div className="w-full">
            <div className="relative isolate overflow-hidden px-[24px] py-[32px]">
              <Image
                src="/images/handshake-house.png"
                alt=""
                fill
                sizes="(max-width: 639px) 100vw, 1px"
                className="absolute inset-0 z-0 object-cover"
              />
              <div className="absolute inset-0 z-10 bg-brand-navy/85" />
              <div className="relative z-20">
                <h2 className="font-display font-bold text-white text-[25px] leading-[1.1]">
                  Want to get in touch
                  <br />
                  with us?
                </h2>
                <p className="mt-[16px] font-display font-light text-white text-[14px] leading-[1.5]">
                  We&rsquo;re all about offering supportive, expert advice every step of
                  the way.
                </p>
                <Link
                  href="/contact"
                  className="mt-[20px] inline-flex h-[44px] items-center justify-center rounded-[22px] border border-white px-[24px] font-display text-[13px] font-medium text-white transition hover:bg-white/10"
                >
                  Contact our Agent
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop: Our latest Properties (grid) */}
        <div className="hidden sm:block container-page mt-[clamp(50px,4.5vw,86px)]">
          <div className="flex items-end justify-between">
            <h2 className="font-display font-bold text-brand-bunker text-[clamp(1.35rem,1.9vw,2.25rem)] leading-[1.15]">
              Our latest Properties
            </h2>
          </div>
          <div className="mt-[clamp(24px,2.25vw,42px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(14px,1.5vw,28px)]">
            {latest.map((p, i) => (
              <PropertyCard key={i} {...p} variant="tall" />
            ))}
          </div>
        </div>

        <div className="hidden sm:block mt-[clamp(50px,4.5vw,86px)]">
          <GetInTouchCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
