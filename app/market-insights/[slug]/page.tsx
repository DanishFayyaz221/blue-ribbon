import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Nav } from "../../_components/layout/Nav";
import { Footer } from "../../_components/layout/Footer";
import { Breadcrumb } from "../../_components/ui/Breadcrumb";
import { Button } from "../../_components/ui/Button";
import { ArrowInline } from "../../_components/ui/ArrowInline";
import { LineReveal } from "../../_components/ui/LineReveal";
import { ExpandableDescription } from "../../_components/property/ExpandableDescription";
import { ShareTrigger } from "../../_components/property/ShareTrigger";
import { YouMayAlsoLike } from "../../_components/property/YouMayAlsoLike";
import { ContactForm } from "../../_components/contact/ContactForm";
import { InsightCard } from "../../_components/insights/InsightCard";
import { INSIGHT_ARTICLES, articleHref, getArticle } from "@/lib/insights/articles";
import { getLatestListings } from "@/lib/db/queries";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const article = getArticle((await params).slug);
  if (!article) return { title: "Market Insights | Blue Ribbon Real Estate" };
  return {
    title: `${article.title} | Blue Ribbon Real Estate`,
    description: article.subtitle,
  };
}

/**
 * One Market Insights article: banner, title, expandable body beside a photo,
 * tags, contact and share actions, then more articles, a listings strip on
 * the navy satin, and the enquiry form.
 */
export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  // Defer to request time so the listings strip reflects the feed.
  await connection();
  let latest: Awaited<ReturnType<typeof getLatestListings>> = [];
  try {
    latest = await getLatestListings(undefined, 6);
  } catch {}

  const others = INSIGHT_ARTICLES.filter((a) => a.slug !== article.slug);

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <div className="container-page pt-[16px] pb-[16px]">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Market Insights", href: "/market-insights" },
              { label: article.shortTitle },
            ]}
          />
        </div>

        <article className="container-page">
          {/* Wide banner at the proportions of the comp. */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[clamp(10px,1vw,16px)] sm:aspect-[755/320]">
            <Image
              src={article.heroImage}
              alt=""
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          </div>

          <LineReveal
            as="h1"
            className="mt-[clamp(24px,2.6vw,40px)] max-w-[980px] font-display font-normal text-brand-bunker text-[clamp(1.4rem,2.3vw,2.2rem)] leading-[1.2]"
          >
            {article.title}
          </LineReveal>

          <div className="mt-[clamp(20px,2.2vw,36px)] grid grid-cols-1 gap-x-[clamp(24px,5vw,80px)] gap-y-[28px] lg:grid-cols-[1fr_clamp(300px,34vw,430px)]">
            <div>
              <LineReveal
                as="p"
                className="font-display text-[clamp(14px,1.05vw,16px)] font-semibold leading-[1.4] text-brand-navy"
              >
                {article.subtitle}
              </LineReveal>

              <ExpandableDescription
                text={article.body}
                className="mt-[clamp(12px,1.1vw,18px)] max-w-[880px] font-display text-[14px] leading-[1.7] text-brand-bunker sm:text-[clamp(14px,1vw,16px)]"
              />

              {article.tags.length > 0 && (
                <div className="mt-[clamp(24px,2.4vw,40px)]">
                  <h2 className="font-display text-[clamp(13px,0.95vw,15px)] font-semibold text-brand-bunker">
                    Tags
                  </h2>
                  <ul className="mt-[12px] flex max-w-[880px] flex-wrap gap-[8px]">
                    {article.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-[16px] bg-brand-soft px-[14px] py-[6px] font-display text-[13px] text-brand-bunker"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-[clamp(28px,2.8vw,48px)] flex flex-wrap items-center gap-[14px]">
                <Button href="/contact" variant="primary" size="sm">
                  Contact an Agent
                </Button>
                <ShareTrigger
                  path={articleHref(article.slug)}
                  address={article.title}
                  guide={article.subtitle}
                  image={article.heroImage}
                  type="Article"
                />
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[clamp(10px,1vw,16px)] lg:aspect-[320/275]">
              <Image
                src={article.sideImage}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                className="object-cover"
              />
            </div>
          </div>
        </article>

        {others.length > 0 && (
          <section className="container-page mt-[clamp(48px,5vw,90px)]">
            <div className="flex flex-col gap-[10px] sm:flex-row sm:items-end sm:justify-between">
              <LineReveal
                as="h2"
                className="font-display font-bold text-brand-bunker text-[clamp(1.05rem,1.8vw,2rem)] leading-[1.1]"
              >
                More Articles
              </LineReveal>
              <Link
                href="/market-insights"
                className="group inline-flex items-center gap-[6px] self-end sm:self-auto font-display text-[13px] sm:text-[15px] lg:text-[18px] font-medium tracking-[0.02em] text-brand-bunker/70 sm:text-brand-bunker hover:text-brand-navy"
              >
                Read more
                <ArrowInline />
              </Link>
            </div>
            <div className="mt-[clamp(24px,2.7vw,44px)] grid grid-cols-2 gap-[clamp(12px,1.2vw,18px)] md:grid-cols-4">
              {others.map((a) => (
                <InsightCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}

        {latest.length > 0 && (
          <section className="relative mt-[clamp(48px,5vw,90px)] w-full overflow-hidden py-[clamp(40px,4vw,80px)]">
            <Image
              src="/images/bg.png"
              alt=""
              fill
              quality={90}
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-[#001F4D1F]" />
            <div className="container-page relative z-10">
              <YouMayAlsoLike properties={latest} tone="dark" exploreHref="/buy" />
            </div>
          </section>
        )}

        <section className="container-page mt-[clamp(48px,6vw,100px)] mb-[clamp(44px,4vw,76px)]">
          <LineReveal
            as="h2"
            className="text-center font-display font-bold text-brand-navy text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.15]"
          >
            Get In Touch
          </LineReveal>
          <div className="mx-auto mt-[clamp(24px,2.25vw,42px)] w-full max-w-[680px]">
            <ContactForm variant="team" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
