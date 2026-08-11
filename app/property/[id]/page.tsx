import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "../../_components/layout/Nav";
import { Footer } from "../../_components/layout/Footer";
import { Breadcrumb } from "../../_components/ui/Breadcrumb";
import { Button } from "../../_components/ui/Button";
import { PropertyCard } from "../../_components/property/PropertyCard";
import { PhotoGallery } from "../../_components/property/PhotoGallery";
import { ShareTrigger } from "../../_components/property/ShareTrigger";
import { EnquireTrigger } from "../../_components/property/EnquireTrigger";
import type { ModalAgent } from "../../_components/property/EnquiryModal";
import { AgentAvatar } from "../../_components/agents/AgentAvatar";
import { profileFor } from "@/lib/agents/profiles";
import { amenityLabel } from "@/lib/reaxml/amenities";
import {
  getListingBySlug,
  getSimilarListings,
  type ListingDetail,
} from "@/lib/db/queries";

const HERO_FALLBACK = "/images/home.png";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListingBySlug(id);

  if (!listing) return { title: "Property not found | Blue Ribbon Real Estate" };

  return {
    title: `${listing.address} | Blue Ribbon Real Estate`,
    description: listing.headline,
    openGraph: {
      title: listing.headline,
      description: listing.description.slice(0, 200),
      images: listing.images[0] ? [listing.images[0].src] : [],
    },
  };
}

export default async function PropertyViewPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListingBySlug(id);

  // A listing pulled from the site — sold, leased or hidden by the agency —
  // must 404 rather than render, so it cannot be shared or indexed.
  if (!listing) notFound();

  const similar = await getSimilarListings(
    listing.slug,
    listing.suburb,
    listing.category,
    3,
  );

  const backHref = listing.isRental ? "/rent" : "/buy";

  // The enquiry modal previously carried two hardcoded names that do not work
  // at this agency. Names shown next to an enquiry form are a claim about who
  // will answer it, so they come from the listing's own agents.
  const enquiryAgents = listing.agents.map((a) => ({
    name: a.name,
    phone: a.mobile ?? a.phone ?? "",
    email: a.email ?? "",
    image: profileFor(a.email).image,
  }));
  const backLabel = listing.isRental ? "Rent" : "Buy";

  const info: { label: string; value: string }[] = [];
  if (listing.landArea) info.push({ label: "Land size approx. (sqm)", value: String(listing.landArea) });
  if (listing.buildingArea) info.push({ label: "Building size approx. (sqm)", value: String(listing.buildingArea) });
  if (listing.bond) info.push({ label: "Bond", value: `$${listing.bond.toLocaleString("en-AU")}` });
  if (listing.dateAvailable) {
    info.push({
      label: "Available from",
      value: new Date(listing.dateAvailable).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Australia/Sydney",
      }),
    });
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <MobilePropertyView listing={listing} info={info} agents={enquiryAgents} />

        <div className="hidden sm:block container-page pt-[16px] pb-[16px]">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: backLabel, href: backHref },
              { label: listing.address },
            ]}
          />
        </div>

        <div className="hidden sm:block container-page">
          <PhotoGallery
            images={listing.images}
            address={listing.address}
            fallback={HERO_FALLBACK}
          />
        </div>

        <div className="hidden sm:grid container-page mt-[clamp(28px,2.7vw,50px)] grid-cols-1 lg:grid-cols-[1fr_clamp(360px,30vw,460px)] gap-x-[clamp(24px,2.7vw,56px)] gap-y-[clamp(24px,2.25vw,42px)]">
          <div>
            <h1 className="font-display font-bold text-brand-bunker text-[clamp(1.4rem,2.1vw,2.4rem)] leading-[1.1]">
              {listing.address}
            </h1>

            {listing.headline && (
              <p className="mt-[clamp(10px,0.9vw,16px)] font-display font-semibold text-[clamp(15px,1.1vw,19px)] leading-[1.4] text-brand-navy">
                {listing.headline}
              </p>
            )}

            <p className="mt-[clamp(18px,1.45vw,25px)] whitespace-pre-line font-display font-medium text-[15px] sm:text-[clamp(15px,1.05vw,17px)] leading-[1.7] text-[#202020] max-w-[640px]">
              {listing.description}
            </p>

            {(listing.amenities.length > 0 || listing.otherFeatures.length > 0) && (
              <div className="mt-[clamp(24px,2vw,36px)]">
                <h2 className="font-display text-[16px] font-semibold text-[#202020]">
                  Features
                </h2>
                <ul className="mt-[12px] flex flex-wrap gap-[8px] max-w-[640px]">
                  {/* Structured flags from the feed first, then the agency's
                      free-text extras. */}
                  {listing.amenities.map((a) => (
                    <li
                      key={a}
                      className="rounded-[16px] bg-brand-soft px-[14px] py-[6px] font-display text-[13px] text-brand-bunker"
                    >
                      {amenityLabel(a)}
                    </li>
                  ))}
                  {listing.otherFeatures.map((f) => (
                    <li
                      key={f}
                      className="rounded-[16px] border border-brand-silver/60 px-[14px] py-[6px] font-display text-[13px] text-brand-bunker/80"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {listing.floorplans.length > 0 && (
              <div className="mt-[clamp(28px,2.4vw,44px)]">
                <h2 className="font-display text-[16px] font-semibold text-[#202020]">
                  Floor plan
                </h2>
                <div className="mt-[12px] flex flex-col gap-[16px] max-w-[640px]">
                  {listing.floorplans.map((fp) => (
                    <a
                      key={fp.src}
                      href={fp.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block w-full overflow-hidden rounded-[12px] border border-brand-silver/60 bg-white"
                    >
                      {/* Floor plans are wide and detail-dense, so they are
                          contained rather than cropped, and open full size. */}
                      <Image
                        src={fp.src}
                        alt={fp.alt}
                        width={1200}
                        height={900}
                        sizes="(max-width: 1024px) 100vw, 640px"
                        className="h-auto w-full object-contain"
                      />
                      <span className="absolute bottom-[10px] right-[10px] rounded-[6px] bg-black/60 px-[10px] py-[4px] font-display text-[12px] text-white opacity-0 transition group-hover:opacity-100">
                        View full size
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {listing.videoUrl && (
              <div className="mt-[clamp(24px,2vw,36px)]">
                <Button
                  href={listing.videoUrl}
                  variant="outline-dark"
                  size="md"
                  className="!h-[58px] !px-[48px] !rounded-[16px] !text-[15px] !border-[#001F4D]"
                >
                  Watch video tour
                </Button>
              </div>
            )}

            {listing.agents.length > 0 && (
              <div className="mt-[clamp(36px,3.15vw,64px)] grid grid-cols-2 gap-[clamp(14px,1.25vw,22px)] max-w-[440px]">
                {listing.agents.map((a) => (
                  <AgentMini key={a.name} {...a} />
                ))}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-[64px] lg:self-start">
            <div className="flex items-stretch justify-end gap-0 pr-[clamp(24px,2.5vw,48px)] mt-[calc(-1*clamp(28px,2.7vw,50px))]">
              <Stat value={listing.beds} label="Beds" primary />
              <Divider />
              <Stat value={listing.baths} label="Baths" />
              <Divider />
              <Stat value={listing.cars} label="Cars" />
            </div>

            <div className="flex gap-[clamp(14px,1.3vw,20px)] mt-[clamp(48px,4.5vw,72px)]">
              <EnquireTrigger
                agents={enquiryAgents}
                listing={{
                  address: listing.address,
                  guide: listing.guide,
                  type: listing.type,
                  beds: listing.beds,
                  baths: listing.baths,
                  cars: listing.cars,
                }}
                className="flex-1 !h-[52px] !rounded-[16px] !text-[15px]"
              />
              <ShareTrigger
                path={`/property/${listing.slug}`}
                address={listing.address}
                guide={listing.guide}
                image={listing.image}
                type={listing.type}
                className="flex-1 !h-[52px] !rounded-[16px] !text-[15px]"
              />
            </div>

            <DetailRow label={listing.isRental ? "Rent" : "Price"} value={listing.guide} topSpace />
            {listing.type && <DetailRow label="Property type" value={listing.type} />}

            {info.length > 0 && (
              <div className="mt-[16px] pt-[4px]">
                <h3 className="font-display text-[16px] font-semibold text-[#202020]">
                  Property information
                </h3>
                <dl className="mt-[8px]">
                  {info.map((d) => (
                    <div key={d.label} className="flex items-center justify-between py-[10px]">
                      <dt className="font-display font-medium text-[15px] text-[#202020]">
                        {d.label}
                      </dt>
                      <dd className="font-display text-[15px] font-medium text-[#202020]">
                        {d.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {!listing.isRental && (
              <div className="mt-[12px] border-t border-brand-silver/40 pt-[14px]">
                <h3 className="font-display text-[16px] font-semibold text-[#202020]">
                  Resource
                </h3>
                <div className="mt-[6px] flex items-center justify-between py-[10px]">
                  <span className="font-display font-medium text-[15px] text-[#202020]">
                    Home loan calculator
                  </span>
                  <Link
                    href="#calculator"
                    className="font-display text-[15px] font-medium text-[#202020] underline underline-offset-4 hover:opacity-80"
                  >
                    View
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </div>

        {listing.lat !== undefined && listing.lng !== undefined && (
          <div className="hidden sm:block container-page mt-[clamp(44px,3.15vw,64px)]">
            <div className="relative aspect-[16/7] md:aspect-[16/6] w-full overflow-hidden bg-brand-soft-2">
              <iframe
                title={listing.address}
                src={`https://www.google.com/maps?q=${listing.lat},${listing.lng}&output=embed&z=15`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        )}

        {similar.length > 0 && (
          <div className="hidden sm:block container-page mt-[clamp(44px,4vw,76px)]">
            <section className="relative w-full overflow-hidden py-[clamp(40px,4vw,80px)] px-[clamp(24px,2.8vw,56px)] rounded-b-[clamp(8px,1vw,16px)]">
              <Image
                src="/images/bg.png"
                alt=""
                fill
                quality={90}
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[#001F4D1F] pointer-events-none" />

              <div className="relative z-10">
                <h2 className="font-display font-bold text-white text-[clamp(1.4rem,1.9vw,2.2rem)] leading-[1.1]">
                  Others also
                  <br />
                  viewed
                </h2>
                <div className="mt-[clamp(28px,3vw,56px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(16px,1.8vw,32px)]">
                  {similar.map((p) => (
                    <PropertyCard key={p.id} {...p} variant="compact" />
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Divider() {
  return <div className="w-px self-center h-[clamp(46px,3.8vw,58px)] mx-[clamp(12px,1.5vw,20px)] bg-gray-300" />;
}

function Stat({ value, label, primary = false }: { value?: number; label: string; primary?: boolean }) {
  return (
    <div className="text-right pt-[clamp(6px,0.6vw,10px)] pb-[clamp(8px,0.8vw,14px)]">
      <div className="flex h-[clamp(40px,3.6vw,52px)] items-start justify-end">
        <span
          className={`font-display font-medium text-brand-bunker leading-none ${
            primary
              ? "-mt-[clamp(3px,0.4vw,6px)] text-[clamp(40px,3.6vw,52px)]"
              : "text-[clamp(24px,2vw,28px)]"
          }`}
        >
          {value ?? "–"}
        </span>
      </div>
      <div className="mt-[clamp(6px,0.6vw,10px)] font-display text-[clamp(10px,0.78vw,12px)] font-normal text-brand-bunker/70">
        {label}
      </div>
    </div>
  );
}

function DetailRow({ label, value, topSpace = false }: { label: string; value: string; topSpace?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between border-b border-brand-silver/40 py-[14px] ${
        topSpace ? "mt-[14px]" : ""
      }`}
    >
      <span className="font-display font-medium text-[15px] text-[#202020]">{label}</span>
      <span className="font-display text-[15px] font-semibold text-[#202020]">{value}</span>
    </div>
  );
}

type AgentProps = ListingDetail["agents"][number];

function AgentMini({ name, email, mobile, phone }: AgentProps) {
  return (
    <article className="overflow-hidden">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-brand-bunker/80">
        <AgentAvatar
          name={name}
          image={profileFor(email).image}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <p className="mt-[12px] font-display text-[14px] font-semibold text-brand-bunker">{name}</p>
      {(mobile || phone) && (
        <a
          href={`tel:${(mobile ?? phone ?? "").replace(/\s/g, "")}`}
          className="mt-[2px] block font-display text-[13px] font-medium text-[#202020] hover:text-brand-navy"
        >
          {mobile ?? phone}
        </a>
      )}
      {email && (
        <a
          href={`mailto:${email}`}
          className="mt-[2px] inline-block font-display text-[13px] font-medium text-brand-navy underline underline-offset-4 hover:opacity-80"
        >
          Email
        </a>
      )}
    </article>
  );
}

function MobilePropertyView({
  listing,
  info,
  agents,
}: {
  listing: ListingDetail;
  info: { label: string; value: string }[];
  agents: ModalAgent[];
}) {
  return (
    <div className="sm:hidden">
      <section className="container-page pt-[8px]">
        <PhotoGallery
          images={listing.images}
          address={listing.address}
          variant="hero"
          fallback={HERO_FALLBACK}
        />
      </section>

      <section className="container-page mt-[20px]">
        <h1 className="font-display font-bold text-brand-bunker text-[24px] leading-[1.2]">
          {listing.address}
        </h1>

        <div className="mt-[20px] flex items-center justify-start gap-[clamp(16px,5vw,24px)]">
          <MobileStat value={listing.beds} label="Beds" size="text-[44px]" />
          <div className="w-px h-8 bg-gray-400" />
          <MobileStat value={listing.baths} label="Baths" size="text-[28px]" />
          <div className="w-px h-8 bg-gray-400" />
          <MobileStat value={listing.cars} label="Cars" size="text-[28px]" />
        </div>

        <div className="mt-[24px] flex gap-[12px]">
          <EnquireTrigger
            variant="navy-pill"
            agents={agents}
            listing={{
              address: listing.address,
              guide: listing.guide,
              type: listing.type,
              beds: listing.beds,
              baths: listing.baths,
              cars: listing.cars,
            }}
            className="flex-1"
          />
          <ShareTrigger
            path={`/property/${listing.slug}`}
            address={listing.address}
            guide={listing.guide}
            image={listing.image}
            type={listing.type}
            variant="outline-pill"
            className="flex-1"
          />
        </div>

        <p className="mt-[20px] whitespace-pre-line font-display text-[13px] leading-[1.6] text-brand-bunker/80">
          {listing.description}
        </p>

        <div className="mt-[24px] flex items-center justify-between border-t border-brand-silver/40 py-[14px]">
          <span className="font-display text-[13px] text-brand-bunker/70">
            {listing.isRental ? "Rent" : "Price"}
          </span>
          <span className="font-display text-[13px] font-semibold text-brand-bunker">
            {listing.guide}
          </span>
        </div>
      </section>

      {listing.agents.length > 0 && (
        <section className="container-page mt-[20px]">
          <h2 className="font-display text-[18px] font-bold text-brand-bunker">Your Agents</h2>
          <div className="mt-[14px] grid grid-cols-2 gap-[12px]">
            {listing.agents.map((a) => (
              <article
                key={a.name}
                className="flex flex-col items-center rounded-[14px] bg-[#F1F2F4] p-[16px] text-center"
              >
                <div className="relative h-[68px] w-[68px] overflow-hidden rounded-full bg-white">
                  <AgentAvatar name={a.name} image={profileFor(a.email).image} sizes="68px" />
                </div>
                <p className="mt-[10px] font-display text-[14px] font-semibold text-brand-bunker">
                  {a.name}
                </p>
                {(a.mobile ?? a.phone) && (
                  <p className="mt-[2px] font-display text-[11px] text-brand-bunker/70">
                    {a.mobile ?? a.phone}
                  </p>
                )}
                {a.email && (
                  <a
                    href={`mailto:${a.email}`}
                    className="mt-[6px] font-display text-[12px] font-semibold text-brand-navy underline underline-offset-4"
                  >
                    Email
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {info.length > 0 && (
        <section className="container-page mt-[28px] pb-[40px]">
          <h2 className="font-display text-[18px] font-bold text-brand-bunker">
            Property Information
          </h2>
          <dl className="mt-[12px]">
            {info.map((d) => (
              <div
                key={d.label}
                className="flex items-center justify-between border-t border-brand-silver/40 py-[12px]"
              >
                <dt className="font-display text-[13px] text-brand-bunker/70">{d.label}</dt>
                <dd className="font-display text-[13px] font-semibold text-brand-bunker">
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}

function MobileStat({ value, label, size }: { value?: number; label: string; size: string }) {
  return (
    <div className="flex items-baseline gap-[6px]">
      <span className={`font-display font-medium leading-none text-brand-navy ${size}`}>
        {value ?? "–"}
      </span>
      <span className="font-display text-[13px] text-brand-bunker/70">{label}</span>
    </div>
  );
}
