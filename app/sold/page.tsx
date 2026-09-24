import Link from "next/link";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { PropertyCard } from "../_components/property/PropertyCard";
import { EmptyListings } from "../_components/property/EmptyListings";
import { ArrowInline } from "../_components/ui/ArrowInline";
import { LineReveal } from "../_components/ui/LineReveal";
import { TeamCTA } from "../_components/sections/TeamCTA";
import {
  getListings,
  parseListingSearchParams,
  searchQueryString,
  type ListingSearchParams,
} from "@/lib/db/queries";

export const metadata = {
  title: "Recently Sold Properties | Blue Ribbon Real Estate",
  description:
    "Homes Blue Ribbon Real Estate has recently sold across Western Sydney.",
};

/** Cards per "View more" step: three rows of three. */
const STEP = 9;

/**
 * Every sold listing, most recent sale first.
 *
 * Takes the same query parameters as /buy and /rent, so the hero search's
 * "Sold" option lands here with its suburb, price and bedroom filters intact.
 * `page` counts how many steps are showing rather than which page is: "View
 * more" grows the grid in place instead of replacing it, as in the comp.
 */
export default async function SoldPage({
  searchParams,
}: {
  searchParams: Promise<ListingSearchParams>;
}) {
  const { query, form, amenities, isFiltered } = parseListingSearchParams(await searchParams);
  const steps = query.page;

  const { items, total } = await getListings({
    ...query,
    sold: true,
    page: 1,
    perPage: STEP * steps,
  });

  const hasMore = total > items.length;
  const qs = searchQueryString(form, amenities);
  const moreHref = `/sold${qs ? `${qs}&` : "?"}page=${steps + 1}`;

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <div className="container-page pt-[16px] pb-[16px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Recently Sold" }]} />
        </div>

        <section className="container-page pt-[clamp(16px,2vw,36px)] text-center">
          <span className="inline-flex rounded-[8px] bg-brand-navy px-[18px] py-[8px] font-display text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.3em] text-white">
            Sold
          </span>
          <LineReveal
            as="h1"
            className="mt-[clamp(18px,1.6vw,28px)] font-display font-bold text-brand-bunker text-[clamp(1.9rem,2.8vw,3rem)] leading-[1.1]"
          >
            Just Sold Out!
          </LineReveal>
          <p className="mx-auto mt-[clamp(16px,1.6vw,28px)] max-w-[860px] font-display text-[14px] sm:text-[clamp(14px,1.05vw,17px)] leading-[1.7] text-brand-bunker/85">
            Every home we sell tells a story of trust, strategy and results. From family homes in
            Wentworthville to investment properties across Western Sydney, our recently sold
            listings reflect the care we put into every campaign, from pricing and presentation to
            negotiating the best possible outcome for our sellers. Each sale is another bridge to
            home built for the families we work with, and proof that the right local agent makes
            all the difference. Browse our recent results below, and if you&apos;re thinking about
            selling, talk to the Blue Ribbon team about what your property could achieve in
            today&apos;s market.
          </p>
        </section>

        <section
          id="results"
          className="container-page mt-[clamp(36px,3.6vw,64px)] pb-[clamp(40px,4vw,72px)] scroll-mt-[80px]"
        >
          <div className="flex items-end justify-between gap-[16px]">
            <LineReveal
              as="h2"
              className="font-display font-bold text-brand-bunker text-[22px] sm:text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]"
            >
              Recently Sold
            </LineReveal>
            <div className="flex items-center gap-[20px]">
              {isFiltered && (
                <Link
                  href="/sold"
                  className="font-display text-[13px] sm:text-[clamp(13px,0.95vw,15px)] font-semibold text-brand-navy underline underline-offset-4 hover:text-brand-navy-deep"
                >
                  Clear search
                </Link>
              )}
              <Link
                href="/property-report-digital-appraisal"
                className="group inline-flex items-center font-display text-[13px] sm:text-[clamp(13px,0.95vw,15px)] font-medium text-brand-bunker underline underline-offset-4 hover:text-brand-navy"
              >
                Sell your property
                <ArrowInline />
              </Link>
            </div>
          </div>

          {items.length > 0 ? (
            <>
              <div className="relative mt-[clamp(22px,2vw,36px)]">
                <div className="focus-peers grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(12px,1.3vw,24px)] gap-y-[clamp(24px,2.2vw,40px)]">
                  {items.map((p) => (
                    <PropertyCard
                      key={p.id}
                      {...p}
                      variant="tall"
                      addressFirst
                      aspect="aspect-[3/2] lg:aspect-[4/3]"
                    />
                  ))}
                </div>
                {/* The comp fades the last row out under "View more", as a
                    hint that the grid goes on. Only while it does. */}
                {hasMore && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[clamp(220px,24vw,400px)] bg-gradient-to-b from-white/0 via-white/70 to-white" />
                )}
              </div>

              {hasMore && (
                <div className="mt-[clamp(20px,2vw,32px)] flex justify-center">
                  {/* scroll={false}: the grid grows under the visitor rather
                      than throwing them back to the top of the page. */}
                  <Link
                    href={moreHref}
                    scroll={false}
                    className="inline-flex h-[48px] items-center justify-center rounded-full border border-brand-silver px-[36px] font-display text-[15px] font-medium text-brand-bunker transition hover:border-brand-navy hover:text-brand-navy"
                  >
                    View more
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="mt-[clamp(22px,2vw,36px)]">
              {isFiltered ? (
                <EmptyListings
                  title="No sold properties match your search"
                  message="Try a different suburb or a wider price range."
                  ctaLabel="See all sold properties"
                  ctaHref="/sold"
                />
              ) : (
                <EmptyListings
                  title="No sold properties to show yet"
                  message="Homes we sell appear here automatically once the sale is recorded in our system."
                  ctaLabel="Browse properties for sale"
                  ctaHref="/buy"
                />
              )}
            </div>
          )}
        </section>

        <TeamCTA />
      </main>
      <Footer />
    </div>
  );
}
