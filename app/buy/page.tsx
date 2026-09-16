import Link from "next/link";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { MobileFilters } from "../_components/property/MobileFilters";
import { MobileResults } from "../_components/property/MobileResults";
import { PropertySearchBar } from "../_components/property/PropertySearchBar";
import { PropertyCard } from "../_components/property/PropertyCard";
import { EmptyListings } from "../_components/property/EmptyListings";
import { ScrollToResults } from "../_components/property/ScrollToResults";
import {
  ResultsRegion,
  SearchLink,
  SearchTransitionProvider,
} from "../_components/property/SearchTransition";
import { ArrowInline } from "../_components/ui/ArrowInline";
import { LineReveal } from "../_components/ui/LineReveal";
import { FallbackListings } from "../_components/property/FallbackListings";
import { PagerLinks } from "../_components/sections/PagerLinks";
import { TeamCTA } from "../_components/sections/TeamCTA";
import { ParramattaCTA } from "../_components/home/ParramattaCTA";
import { YouMayAlsoLike } from "../_components/property/YouMayAlsoLike";
import {
  SALE_CATEGORIES,
  getLatestListings,
  getListings,
  getListingsWithFallback,
  getSuburbsWithCounts,
  parseListingSearchParams,
  type FallbackResult,
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
    // Scoped to sales: this page is for buyers, so "You may also like" should
    // not be quietly padded out with rentals. Six fills two rows of three.
    getLatestListings(SALE_CATEGORIES, 6),
    getSuburbsWithCounts(SALE_CATEGORIES),
  ]);

  const { items, totalPages } = results;
  const hasResults = items.length > 0;

  // Nothing matched, so find the nearest sale stock rather than ending on a
  // dead end. Deliberately never crosses into rentals.
  const fallback =
    !hasResults && isFiltered
      ? await getListingsWithFallback({ ...query, categories: SALE_CATEGORIES }, 4)
      : null;

  const searchKey = JSON.stringify({ ...form, page: query.page });

  return (
    <div className="min-h-screen bg-white">
      {isFiltered && <ScrollToResults key={searchKey} />}
      <Nav />
      <main>
        {/* Searches, filters and paging update in place inside this provider:
            no page reload, the scroll stays put, and only the results area
            below changes — dimmed while the new results are on their way. */}
        <SearchTransitionProvider>
        <div className="container-page pt-[16px] pb-[16px] sm:pb-[24px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Buy" }]} />
        </div>

        {/* Mobile filter chips */}
        <div className="sm:hidden container-page bg-[#F1F2F4] py-[12px]">
          <MobileFilters basePath="/buy" {...form} features={amenities} />
        </div>

        {/* Desktop search bar */}
        <div className="hidden sm:block container-page mt-0">
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

        <ResultsRegion>
        {/* Mobile: Buy Your Dream + cards */}
        <div className="sm:hidden container-page mt-[18px]">
          <div className="flex items-end justify-between">
            <LineReveal as="h1" className="font-display font-bold text-brand-bunker text-[22px] leading-[1.15]">
              Buy Your Dream
            </LineReveal>
            <Link
              href="/property-report-digital-appraisal"
              className="font-display text-[13px] font-medium text-brand-bunker hover:text-brand-navy"
            >
              Sell yours →
            </Link>
          </div>

          {hasResults ? (
            <div className="mt-[18px]">
              <MobileResults
                basePath="/buy"
                sort={form.sort}
                params={{ q: form.q, min: form.min, max: form.max, beds: form.beds, features: amenities }}
                nextHref={query.page < totalPages ? nextPageHref("/buy", form, query.page + 1) : undefined}
                cards={items.map((p) => (
                  <PropertyCard
                    key={p.id}
                    {...p}
                    variant="tall"
                    addressFirst
                    aspect="aspect-[3/2]"
                    sizes="(max-width: 639px) 100vw, 1px"
                  />
                ))}
              />
            </div>
          ) : (
            <div className="mt-[18px]">
              <NoSalesStock filtered={isFiltered} fallback={fallback} q={form.q} />
            </div>
          )}
        </div>

        {/* Desktop: heading + grid */}
        <div id="results" className="hidden sm:block container-page mt-[clamp(32px,3.15vw,58px)] scroll-mt-[80px]">
          <div className="flex flex-col gap-[14px] sm:flex-row sm:items-center sm:justify-between">
            <LineReveal as="h1" className="font-display font-bold text-brand-bunker text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]">
              Buy Your Dream
            </LineReveal>
            <div className="flex items-center gap-[20px]">
              {isFiltered && (
                <SearchLink
                  href="/buy"
                  className="font-display text-[clamp(13px,0.95vw,15px)] font-semibold text-brand-navy underline underline-offset-4 hover:text-brand-navy-deep"
                >
                  Clear filters
                </SearchLink>
              )}
              <Link
                href="/property-report-digital-appraisal"
                className="group inline-flex items-center font-display text-[clamp(13px,0.95vw,15px)] font-medium text-brand-bunker underline underline-offset-4 hover:text-brand-navy"
              >
                Sell your property
                <ArrowInline />
              </Link>
            </div>
          </div>

          {hasResults ? (
            <>
              <div className="focus-peers mt-[clamp(22px,2vw,36px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(12px,1.3vw,24px)]">
                {items.map((p) => (
                  <PropertyCard key={p.id} {...p} variant="tall" addressFirst />
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
              <NoSalesStock filtered={isFiltered} fallback={fallback} q={form.q} />
            </div>
          )}
        </div>
        </ResultsRegion>

        {/* Closing sequence, per the comp: the featured property card (the same
            one the home page shows), then "You may also like", then the team
            CTA. The card strip stays hidden while the fallback is showing —
            both pull from the same small pool and would repeat the same cards. */}
        <div className="mt-[clamp(28px,3vw,56px)]">
          <ParramattaCTA />
        </div>
        {hasResults && latest.length > 0 && (
          <YouMayAlsoLike properties={latest} exploreHref="/buy" phoneTone="dark" />
        )}
        <TeamCTA />
        </SearchTransitionProvider>
      </main>
      <Footer />
    </div>
  );
}

/** The results URL for page `page` with the current filters kept. */
function nextPageHref(
  basePath: string,
  form: { q: string; min: string; max: string; beds?: string; sort: string },
  page: number,
): string {
  const sp = new URLSearchParams();
  if (form.q) sp.set("q", form.q);
  if (form.min) sp.set("min", form.min);
  if (form.max) sp.set("max", form.max);
  if (form.beds) sp.set("beds", form.beds);
  if (form.sort !== "recent") sp.set("sort", form.sort);
  sp.set("page", String(page));
  return `${basePath}?${sp.toString()}`;
}

function NoSalesStock({
  filtered,
  fallback,
  q,
}: {
  filtered: boolean;
  fallback: FallbackResult | null;
  q?: string;
}) {
  // A filtered search returning nothing is a different situation from having
  // no sale stock at all, and saying so avoids implying the agency sells
  // nothing when the visitor has simply searched too narrowly.
  if (filtered) {
    // There is nearer sale stock to offer, so show it instead of stopping at
    // "nothing found".
    if (fallback && fallback.items.length > 0) {
      return (
        <FallbackListings
          items={fallback.items}
          relaxed={fallback.relaxed}
          q={q}
          noun="properties"
          clearHref="/buy"
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
