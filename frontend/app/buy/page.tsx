import Image from "next/image";
import Link from "next/link";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { PropertySearchBar } from "../_components/property/PropertySearchBar";
import { PropertyCard, type PropertyCardData } from "../_components/property/PropertyCard";
import { PropertyImage } from "../_components/property/PropertyImage";
import { Pagination } from "../_components/sections/Pagination";
import { GetInTouchCTA } from "../_components/sections/GetInTouchCTA";
import { api, type PropertyCard as ApiProperty } from "@/lib/api";

const PLACEHOLDER = "/images/latest-properties.png";

function toCard(p: ApiProperty): PropertyCardData & { id: string } {
  return {
    id: p.id,
    href: `/property/${p.id}`,
    image: p.image ?? PLACEHOLDER,
    address: p.address || "Address on request",
    guide: p.guide,
    beds: p.beds,
    baths: p.baths,
    cars: p.cars,
  };
}

const mobileFilters = ["Buy", "Price", "Beds", "More"] as const;

const PAGE_SIZE = 16;

const SORT_LABEL: Record<string, "Most Recent First" | "Price (Low to High)" | "Price (High to Low)"> = {
  "lastModified|DESC": "Most Recent First",
  "searchPrice|ASC": "Price (Low to High)",
  "searchPrice|DESC": "Price (High to Low)",
};

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<{
    suburb?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    orderBy?: string;
    order?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const suburb = params.suburb;
  const type = params.type === "Lease" || params.type === "Sale" ? params.type : undefined;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const orderBy = params.orderBy;
  const order = params.order === "ASC" || params.order === "DESC" ? params.order : undefined;
  const page = params.page ? Math.max(1, Number(params.page)) : 1;

  const sortKey = orderBy && order ? `${orderBy}|${order}` : "";
  const initialSort = SORT_LABEL[sortKey] ?? "Most Recent First";

  let items: Awaited<ReturnType<typeof api.listProperties>>["items"] = [];
  let pagination = { current: 1, last: 1, items: 0 };
  let searchError: string | null = null;
  try {
    const result = await api.listProperties({
      limit: PAGE_SIZE,
      suburb,
      type,
      minPrice,
      maxPrice,
      orderBy,
      order,
      page,
    });
    items = result.items;
    pagination = result.pagination;
  } catch (err) {
    searchError = err instanceof Error ? err.message : "Search failed";
  }

  const buildHref = (targetPage: number) => {
    const p = new URLSearchParams();
    if (suburb) p.set("suburb", suburb);
    if (type) p.set("type", type);
    if (minPrice) p.set("minPrice", String(minPrice));
    if (maxPrice) p.set("maxPrice", String(maxPrice));
    if (orderBy) p.set("orderBy", orderBy);
    if (order) p.set("order", order);
    if (targetPage > 1) p.set("page", String(targetPage));
    const qs = p.toString();
    return `/buy${qs ? `?${qs}` : ""}`;
  };
  const featured = items.slice(0, 12).map(toCard);
  const latest = items.slice(0, 4).map(toCard);
  const mobileFeatured = items.slice(0, 6).map(toCard);

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
            initialSuburb={suburb ?? ""}
            initialMinPrice={minPrice ? String(minPrice) : ""}
            initialMaxPrice={maxPrice ? String(maxPrice) : ""}
            initialSort={initialSort}
          />
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
          <div className="mt-[18px] grid grid-cols-2 gap-x-[12px] gap-y-[20px]">
            {mobileFeatured.map((p) => (
              <Link
                key={p.id}
                href={p.href!}
                className="group block overflow-hidden rounded-[14px] border border-brand-silver/60 bg-white"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <PropertyImage
                    src={p.image}
                    fallback={PLACEHOLDER}
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

        {/* Desktop: grid + pagination */}
        <div className="hidden sm:block container-page mt-[clamp(32px,3.15vw,58px)]">
          <div className="flex flex-col gap-[14px] sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-display font-bold text-brand-bunker text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]">
              {suburb ? `Results for "${suburb}"` : "Buy Your Dream"}
            </h1>
            <Link
              href="/property-report-digital-appraisal"
              className="font-display text-[clamp(13px,0.95vw,15px)] font-medium text-brand-bunker underline underline-offset-4 hover:text-brand-navy"
            >
              Sell your property
            </Link>
          </div>

          {featured.length === 0 ? (
            <p className="mt-8 font-display text-brand-bunker/70">
              {searchError
                ? "Search didn't match any properties. Try different criteria."
                : suburb
                  ? `No properties found for "${suburb}". Try a different search.`
                  : "No properties available right now. Please check back soon."}
            </p>
          ) : (
            <div className="mt-[clamp(22px,2vw,36px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(12px,1.3vw,24px)]">
              {featured.map((p) => (
                <PropertyCard key={p.id} {...p} variant="tall" />
              ))}
            </div>
          )}

          <div className="mt-[clamp(36px,2.7vw,50px)]">
            <Pagination current={pagination.current} total={pagination.last} hrefFor={buildHref} />
          </div>
        </div>

        {/* Mobile: latest */}
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

        {/* Mobile: get in touch CTA */}
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

        {/* Desktop: latest grid */}
        <div className="hidden sm:block container-page mt-[clamp(44px,4vw,76px)]">
          <div className="flex items-end justify-between">
            <h2 className="font-display font-bold text-brand-bunker text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]">
              Our latest Properties
            </h2>
            <Link
              href="/buy"
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

        <div className="hidden sm:block mt-[clamp(44px,4vw,76px)]">
          <GetInTouchCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
