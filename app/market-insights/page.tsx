import Image from "next/image";
import { connection } from "next/server";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { LineReveal } from "../_components/ui/LineReveal";
import { InsightCard } from "../_components/insights/InsightCard";
import { MobileCarousel } from "../_components/ui/MobileCarousel";
import { YouMayAlsoLike } from "../_components/property/YouMayAlsoLike";
import { TeamCTA } from "../_components/sections/TeamCTA";
import { INSIGHT_ARTICLES } from "@/lib/insights/articles";
import { getLatestListings } from "@/lib/db/queries";

export const metadata = {
  title: "Market Insights | Blue Ribbon Real Estate",
  description:
    "Honest takes on the Western Sydney property market, practical tips for buyers and sellers, and the trends shaping local property.",
};

/**
 * Market Insights: an intro, the latest articles, an "Explore Properties"
 * strip on the navy satin, and the team call to action.
 */
export default async function MarketInsightsPage() {
  // Defer to request time so the listings strip reflects the feed rather than
  // being frozen into the build output.
  await connection();

  let latest: Awaited<ReturnType<typeof getLatestListings>> = [];
  try {
    latest = await getLatestListings(undefined, 6);
  } catch {}

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        {/* "Market Insights" at every width — the route's own name, and what
            the nav and footer call it. The mobile comp named the page by its
            heading instead, so the phone trail read "Our Latest Insights" for
            a page every other link calls something else. */}
        <div className="container-page pt-[16px] pb-[16px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Market Insights" }]} />
        </div>

        <section className="w-full bg-white pt-[clamp(28px,3.5vw,60px)]">
          <div className="container-page flex flex-col items-center text-center">
            {/* "Market Insights" at every width. The mobile comp labelled
                this pill "Our Team", which the phone layout followed — but
                this is the insights page, and a pill naming a different
                section reads as a mistake rather than as a label. */}
            <span className="rounded-[8px] bg-brand-navy px-[16px] py-[7px] font-display text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
              Market Insights
            </span>
            <LineReveal
              as="h1"
              className="mt-[16px] sm:mt-[clamp(18px,1.8vw,32px)] font-display font-bold text-brand-bunker text-[28px] sm:text-[clamp(1.5rem,3.1vw,2.9rem)] leading-[1.15]"
            >
              Our Latest Insights
            </LineReveal>
            <LineReveal
              as="p"
              className="mt-[16px] sm:mt-[clamp(18px,2vw,34px)] max-w-[1040px] font-display text-[12.5px] sm:text-[clamp(13px,1.05vw,16px)] leading-[1.6] text-brand-bunker"
            >
              Stay in the know with the latest from Blue Ribbon. Our insights bring you
              honest takes on the local market, practical tips for buyers and sellers,
              and a closer look at the trends shaping property across Western Sydney.
              Whether you&rsquo;re preparing to sell, hunting for your first home, or
              simply curious about where the market is heading, you&rsquo;ll find
              something worth reading here. Dive into our latest articles and make your
              next move with confidence.
            </LineReveal>
          </div>

          <div className="container-page mt-[clamp(32px,3.5vw,60px)] pb-[clamp(44px,5vw,90px)]">
            {/* Phone: one article at a time under the round arrows, as the
                mobile comp draws it — the same carousel as the card strips. */}
            <MobileCarousel
              ariaLabel="Latest insights"
              className="sm:hidden"
              items={INSIGHT_ARTICLES.map((article) => (
                <InsightCard key={article.slug} article={article} feature />
              ))}
            />

            <div className="hidden sm:grid grid-cols-2 gap-[clamp(12px,1.2vw,18px)] md:grid-cols-4">
              {INSIGHT_ARTICLES.map((article) => (
                <InsightCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>

        {latest.length > 0 && (
          <section className="relative w-full overflow-hidden py-[clamp(40px,4vw,80px)]">
            <Image
              src="/images/bg.png"
              alt=""
              fill
              quality={60}
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-[#001F4D1F]" />
            <div className="container-page relative z-10">
              <YouMayAlsoLike
                heading="Explore Properties"
                properties={latest}
                tone="dark"
                exploreHref="/buy"
              />
            </div>
          </section>
        )}

        <TeamCTA />
      </main>
      <Footer />
    </div>
  );
}
