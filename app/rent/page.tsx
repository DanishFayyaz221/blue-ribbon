import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { PropertyCard } from "../_components/property/PropertyCard";
import { EmptyListings } from "../_components/property/EmptyListings";
import { PagerLinks } from "../_components/sections/PagerLinks";
import { GetInTouchCTA } from "../_components/sections/GetInTouchCTA";
import { PropertySearchBar } from "../_components/property/PropertySearchBar";
import Link from "next/link";
import {
  RENTAL_CATEGORIES,
  SALE_CATEGORIES,
  getListings,
  getSuburbsWithCounts,
  parseListingSearchParams,
  searchQueryString,
  type ListingSearchParams,
} from "@/lib/db/queries";

export const metadata = {
  title: "Properties for Rent | Blue Ribbon Real Estate",
  description:
    "Browse rental properties across Western Sydney with Blue Ribbon Real Estate.",
};

export default async function RentPage({
  searchParams,
}: {
  searchParams: Promise<ListingSearchParams>;
}) {
  const { query, form, amenities, isFiltered } = parseListingSearchParams(await searchParams);

  const [{ items, total, totalPages }, suburbs] = await Promise.all([
    getListings({ ...query, categories: RENTAL_CATEGORIES, perPage: 12 }),
    getSuburbsWithCounts(RENTAL_CATEGORIES),
  ]);

  // Mirror of the Buy page: a rental search that finds nothing may still match
  // a property for sale, and pointing there beats a dead end.
  const saleMatches =
    items.length === 0 && isFiltered
      ? (await getListings({ ...query, categories: SALE_CATEGORIES, perPage: 1 })).total
      : 0;

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <div className="container-page pt-[16px] pb-[16px] sm:pb-[24px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Rent" }]} />
        </div>

        <div className="container-page">
          <div className="flex flex-col gap-[14px] sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display font-bold text-brand-bunker text-[22px] sm:text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]">
                Properties for Rent
              </h1>
              {total > 0 && (
                <p className="mt-[6px] font-display text-[13px] sm:text-[15px] text-brand-bunker/70">
                  {total} {total === 1 ? "property" : "properties"}
                  {isFiltered ? " matching your search" : " available"}
                </p>
              )}
            </div>
          </div>

          <div className="mt-[clamp(20px,2vw,32px)]">
            <PropertySearchBar
              action="/rent"
              suburbs={suburbs.map((s) => s.name)}
              amenities={amenities}
              showPetFriendly
              {...form}
            />
          </div>

          {suburbs.length > 0 && (
            <nav className="mt-[clamp(16px,1.4vw,24px)]" aria-label="Browse by suburb">
              <ul className="flex flex-wrap gap-[10px]">
                {suburbs.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/rent/${s.slug}`}
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

          {items.length > 0 ? (
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
                  basePath="/rent"
                  params={form}
                />
              </div>
            </>
          ) : (
            <div className="mt-[clamp(22px,2vw,36px)]">
              {isFiltered ? (
                saleMatches > 0 ? (
                  <EmptyListings
                    title="No rentals match your search"
                    message={`We do have ${saleMatches} propert${saleMatches === 1 ? "y" : "ies"} for sale matching it.`}
                    ctaLabel={`View ${saleMatches === 1 ? "it" : "them"} in Buy`}
                    ctaHref={`/buy${searchQueryString(form, amenities)}`}
                  />
                ) : (
                  <EmptyListings
                    title="No rentals match your search"
                    message="Try widening the price range or searching a different suburb."
                    ctaLabel="Clear filters"
                    ctaHref="/rent"
                  />
                )
              ) : (
                <EmptyListings
                  title="No rentals available right now"
                  message="New rental listings appear here automatically as soon as they go live in our system."
                  ctaLabel="Contact our team"
                  ctaHref="/contact"
                />
              )}
            </div>
          )}
        </div>

        <div className="mt-[clamp(44px,4vw,76px)]">
          <GetInTouchCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
