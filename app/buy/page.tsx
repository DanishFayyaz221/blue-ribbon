import Image from "next/image";
import Link from "next/link";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { MobileFilters } from "../_components/property/MobileFilters";
import { PropertySearchBar } from "../_components/property/PropertySearchBar";
import { PropertyCard } from "../_components/property/PropertyCard";
import { EmptyListings } from "../_components/property/EmptyListings";
import { PagerLinks } from "../_components/sections/PagerLinks";
import { GetInTouchCTA } from "../_components/sections/GetInTouchCTA";
import {
  RENTAL_CATEGORIES,
  SALE_CATEGORIES,
  getLatestListings,
  getListings,
  getSuburbsWithCounts,
  parseListingSearchParams,
  searchQueryString,
  type ListingSearchParams,
} from "@/lib/db/queries";

export const metadata = {
  title: "Properties for Sale | Blue Ribbon Real Estate",
  description:
    "Browse homes for sale across Western Sydney with Blue Ribbon Real Estate.",
};

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<ListingSearchParams>;
}) {
  const { query, form, amenities, isFiltered } = parseListingSearchParams(await searchParams);

  const [results, latest, suburbs] = await Promise.all([
    getListings({ ...query, categories: SALE_CATEGORIES, perPage: 12 }),
    getLatestListings(undefined, 4),
    getSuburbsWithCounts(SALE_CATEGORIES),
  ]);

  const { items, totalPages } = results;
  const hasResults = items.length > 0;

  // A sale search that finds nothing may still match a rental — and this page
  // shows rentals further down under "Our latest Properties". Saying nothing
  // reads as a contradiction: the visitor is told there is no match while the
  // matching listing sits on screen. So count the other side and offer it.
  const rentalMatches =
    !hasResults && isFiltered
      ? (await getListings({ ...query, categories: RENTAL_CATEGORIES, perPage: 1 })).total
      : 0;

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <div className="container-page pt-[16px] pb-[16px] sm:pb-[24px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Buy" }]} />
        </div>

        {/* Mobile filter chips */}
        <div className="sm:hidden container-page bg-[#F1F2F4] py-[12px]">
          <MobileFilters basePath="/buy" {...form} features={amenities} />
        </div>

        {/* Desktop hero image */}
        <section className="hidden sm:block container-page">
          <div className="relative aspect-[16/7] max-h-[560px] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)]">
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
          <PropertySearchBar
            action="/buy"
            suburbs={suburbs.map((s) => s.name)}
            amenities={amenities}
            {...form}
          />

          {suburbs.length > 0 && (
            <nav className="mt-[clamp(16px,1.4vw,24px)]" aria-label="Browse by suburb">
              <ul className="flex flex-wrap gap-[10px]">
                {suburbs.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/buy/${s.slug}`}
                      className="inline-flex items-center gap-[6px] rounded-[16px] border border-brand-silver/70 px-[14px] py-[6px] font-display text-[13px] text-brand-bunker transition hover:border-brand-navy hover:text-brand-navy"
                    >
                      {s.name}
                      <span className="text-brand-bunker/50">{s.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* Mobile: Buy Your Dream + cards */}
        <div className="sm:hidden container-page mt-[18px]">
          <div className="flex items-end justify-between">
            <h1 className="font-display font-bold text-brand-bunker text-[22px] leading-[1.15]">
              Buy Your Dream
            </h1>
            <Link
              href="/property-report-digital-appraisal"
              className="font-display text-[13px] font-medium text-brand-bunker hover:text-brand-navy"
            >
              Sell yours →
            </Link>
          </div>

          {hasResults ? (
            <div className="mt-[18px] grid grid-cols-2 gap-x-[12px] gap-y-[20px]">
              {items.map((p) => (
                <Link
                  key={p.id}
                  href={p.href}
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
                      {p.guide}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-[18px]">
              <NoSalesStock
                filtered={isFiltered}
                rentalMatches={rentalMatches}
                rentHref={`/rent${searchQueryString(form, amenities)}`}
              />
            </div>
          )}
        </div>

        {/* Desktop: heading + grid */}
        <div className="hidden sm:block container-page mt-[clamp(32px,3.15vw,58px)]">
          <div className="flex flex-col gap-[14px] sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-display font-bold text-brand-bunker text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]">
              Buy Your Dream
            </h1>
            <Link
              href="/property-report-digital-appraisal"
              className="font-display text-[clamp(13px,0.95vw,15px)] font-medium text-brand-bunker underline underline-offset-4 hover:text-brand-navy"
            >
              Sell your property
            </Link>
          </div>

          {hasResults ? (
            <>
              <div className="mt-[clamp(22px,2vw,36px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(12px,1.3vw,24px)]">
                {items.map((p) => (
                  <PropertyCard key={p.id} {...p} variant="tall" />
                ))}
              </div>

              <div className="mt-[clamp(36px,2.7vw,50px)]">
                <PagerLinks
                  page={query.page}
                  totalPages={totalPages}
                  basePath="/buy"
                  params={form}
                />
              </div>
            </>
          ) : (
            <div className="mt-[clamp(22px,2vw,36px)]">
              <NoSalesStock
                filtered={isFiltered}
                rentalMatches={rentalMatches}
                rentHref={`/rent${searchQueryString(form, amenities)}`}
              />
            </div>
          )}
        </div>

        {/* Mobile: Our latest Properties (horizontal scroll) */}
        {latest.length > 0 && (
          <div className="sm:hidden mt-[28px]">
            <div className="container-page">
              <h2 className="font-display font-bold text-brand-bunker text-[18px] leading-[1.15]">
                Our latest Properties
              </h2>
            </div>
            <div className="no-scrollbar mt-[16px] flex snap-x snap-mandatory gap-[14px] overflow-x-auto px-[var(--page-px)] pb-[8px]">
              {latest.map((p) => (
                <div key={p.id} className="snap-start shrink-0 basis-[60%]">
                  <PropertyCard {...p} variant="wide" />
                </div>
              ))}
            </div>
          </div>
        )}

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
                  className="mt-[20px] inline-flex h-[44px] items-center justify-center rounded-[22px] bg-white px-[24px] font-display text-[13px] font-medium text-black transition hover:bg-white/90"
                >
                  Contact our Agent
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop: Our latest Properties (grid) */}
        {latest.length > 0 && (
          <div className="hidden sm:block container-page mt-[clamp(44px,4vw,76px)]">
            <div className="flex items-end justify-between">
              <h2 className="font-display font-bold text-brand-bunker text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]">
                Our latest Properties
              </h2>
              <Link
                href="/rent"
                className="font-display text-[clamp(13px,0.95vw,15px)] font-medium text-brand-bunker underline underline-offset-4 hover:text-brand-navy"
              >
                Explore more Properties
              </Link>
            </div>
            <div className="mt-[clamp(22px,2vw,36px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(12px,1.3vw,24px)]">
              {latest.map((p) => (
                <PropertyCard key={p.id} {...p} variant="tall" />
              ))}
            </div>
          </div>
        )}

        <div className="hidden sm:block mt-[clamp(44px,4vw,76px)]">
          <GetInTouchCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function NoSalesStock({
  filtered,
  rentalMatches = 0,
  rentHref = "/rent",
}: {
  filtered: boolean;
  rentalMatches?: number;
  rentHref?: string;
}) {
  // A filtered search returning nothing is a different situation from having
  // no sale stock at all, and saying so avoids implying the agency sells
  // nothing when the visitor has simply searched too narrowly.
  if (filtered) {
    // The same search matched on the rental side. Send them there rather than
    // leaving them to wonder why the listing appears further down the page.
    if (rentalMatches > 0) {
      const plural = rentalMatches === 1 ? "" : "s";
      return (
        <EmptyListings
          title="Nothing for sale matches your search"
          message={`We do have ${rentalMatches} rental${plural} matching it.`}
          ctaLabel={`View ${rentalMatches === 1 ? "it" : "them"} in Rent`}
          ctaHref={rentHref}
        />
      );
    }

    return (
      <EmptyListings
        title="No properties match your search"
        message="Try widening the price range or searching a different suburb."
        ctaLabel="Clear filters"
        ctaHref="/buy"
      />
    );
  }

  return (
    <EmptyListings
      title="No properties for sale listed right now"
      message="Our current listings are all rentals. New sale listings appear here automatically as soon as they go live in our system."
      ctaLabel="View rentals"
      ctaHref="/rent"
    />
  );
}
