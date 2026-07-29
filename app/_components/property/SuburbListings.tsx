import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "../layout/Nav";
import { Footer } from "../layout/Footer";
import { Breadcrumb } from "../ui/Breadcrumb";
import { PropertyCard } from "./PropertyCard";
import { PropertySearchBar } from "./PropertySearchBar";
import { EmptyListings } from "./EmptyListings";
import { PagerLinks } from "../sections/PagerLinks";
import { GetInTouchCTA } from "../sections/GetInTouchCTA";
import {
  getListings,
  getSuburbsWithCounts,
  parseListingSearchParams,
  type ListingSearchParams,
} from "@/lib/db/queries";
import type { ListingCategory } from "@/lib/reaxml/schema";

type Props = {
  suburbSlugParam: string;
  searchParams: ListingSearchParams;
  categories: ListingCategory[];
  /** "/rent" or "/buy". */
  basePath: string;
  /** "for rent" / "for sale", used in headings and copy. */
  intent: string;
  label: string;
};

/**
 * A suburb landing page.
 *
 * These exist for search: "rentals in Blacktown" is how people actually look,
 * and a dedicated indexable URL per suburb ranks far better than a query
 * string that robots.txt tells crawlers to skip.
 */
export async function SuburbListings({
  suburbSlugParam,
  searchParams,
  categories,
  basePath,
  intent,
  label,
}: Props) {
  const { query, form, amenities, isFiltered } = parseListingSearchParams(searchParams);

  // Resolve the slug against suburbs that actually have stock, rather than
  // trusting the URL. An unknown suburb 404s instead of rendering an empty
  // page that search engines would index as thin content.
  const suburbs = await getSuburbsWithCounts(categories);
  const match = suburbs.find((s) => s.slug === suburbSlugParam);
  if (!match) notFound();

  const { items, total, totalPages } = await getListings({
    ...query,
    categories,
    suburb: match.name,
    perPage: 12,
  });

  const path = `${basePath}/${match.slug}`;

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <div className="container-page pt-[16px] pb-[16px] sm:pb-[24px]">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label, href: basePath },
              { label: match.name },
            ]}
          />
        </div>

        <div className="container-page">
          <h1 className="font-display font-bold text-brand-bunker text-[22px] sm:text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]">
            Properties {intent} in {match.name}
          </h1>
          <p className="mt-[6px] font-display text-[13px] sm:text-[15px] text-brand-bunker/70">
            {total} {total === 1 ? "property" : "properties"}
            {isFiltered ? " matching your search" : ` ${intent} in ${match.name}, NSW`}
          </p>

          <div className="mt-[clamp(20px,2vw,32px)]">
            <PropertySearchBar
              action={path}
              suburbs={suburbs.map((s) => s.name)}
              amenities={amenities}
              showPetFriendly={basePath === "/rent"}
              {...form}
            />
          </div>

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
                  basePath={path}
                  params={form}
                />
              </div>
            </>
          ) : (
            <div className="mt-[clamp(22px,2vw,36px)]">
              <EmptyListings
                title={`No properties match your search in ${match.name}`}
                message="Try widening the price range or removing some feature filters."
                ctaLabel={`All ${match.name} properties`}
                ctaHref={path}
              />
            </div>
          )}

          {suburbs.length > 1 && (
            <nav className="mt-[clamp(36px,3vw,56px)]" aria-label="Other suburbs">
              <h2 className="font-display text-[15px] font-semibold text-brand-bunker">
                Other areas we service
              </h2>
              <ul className="mt-[12px] flex flex-wrap gap-[10px]">
                {suburbs
                  .filter((s) => s.slug !== match.slug)
                  .map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`${basePath}/${s.slug}`}
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

        <div className="mt-[clamp(44px,4vw,76px)]">
          <GetInTouchCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
