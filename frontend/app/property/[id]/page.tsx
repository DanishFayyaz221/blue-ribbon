import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "../../_components/layout/Nav";
import { Footer } from "../../_components/layout/Footer";
import { Breadcrumb } from "../../_components/ui/Breadcrumb";
import { Button } from "../../_components/ui/Button";
import { PropertyCard, type PropertyCardData } from "../../_components/property/PropertyCard";
import { PropertyImage } from "../../_components/property/PropertyImage";
import { PropertyGallery } from "../../_components/property/PropertyGallery";
import { EnquireTrigger } from "../../_components/property/EnquireTrigger";
import {
  api,
  type PropertyCard as ApiProperty,
  type PropertyDetail,
  type PropertyAgent,
} from "@/lib/api";

const IMAGE_PLACEHOLDER = "/images/home.png";
const SIMILAR_PLACEHOLDER = "/images/avenue.png";

function splitAddress(address: string): [string, string] {
  const idx = address.indexOf(",");
  if (idx === -1) return [address, ""];
  return [address.slice(0, idx).trim(), address.slice(idx + 1).trim()];
}

function toSimilarCard(p: ApiProperty): PropertyCardData & { id: string } {
  return {
    id: p.id,
    href: `/property/${p.id}`,
    image: p.image ?? SIMILAR_PLACEHOLDER,
    address: p.address || "Address on request",
    guide: p.guide,
  };
}

function formatInspection(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default async function PropertyViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await api.getProperty(id);
  if (!property) notFound();

  const [addressLine1, addressLine2] = splitAddress(property.address);
  const { items: similar } = await api.listProperties({ limit: 4 });
  const similarCards = similar
    .filter((p) => p.id !== property.id)
    .slice(0, 3)
    .map(toSimilarCard);

  const propertyInfo: Array<{ label: string; value: string }> = [];
  if (property.landArea) propertyInfo.push({ label: "Land size approx.", value: property.landArea });
  if (property.buildingArea) propertyInfo.push({ label: "Building area", value: property.buildingArea });
  if (property.yearBuilt) propertyInfo.push({ label: "Year built", value: property.yearBuilt });
  if (property.outgoings.councilRates)
    propertyInfo.push({ label: "Council rates (pa)", value: `$${property.outgoings.councilRates.toLocaleString()}` });
  if (property.outgoings.waterRates)
    propertyInfo.push({ label: "Water rates (pa)", value: `$${property.outgoings.waterRates.toLocaleString()}` });
  if (property.outgoings.strataTotal)
    propertyInfo.push({ label: "Strata (per quarter)", value: `$${property.outgoings.strataTotal.toLocaleString()}` });

  const mapSrc = property.location
    ? `https://www.google.com/maps?q=${property.location.lat},${property.location.lng}&output=embed&z=15`
    : `https://www.google.com/maps?q=${encodeURIComponent(property.address)}&output=embed&z=13`;

  const nextInspection = property.inspections[0]
    ? formatInspection(property.inspections[0].start)
    : "By appointment";

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <MobilePropertyView property={property} />

        <div className="hidden sm:block container-page pt-[16px] pb-[16px]">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Buy", href: "/buy" },
              { label: addressLine1 || property.address },
            ]}
          />
        </div>

        {/* Desktop gallery */}
        <div className="hidden sm:block container-page">
          <PropertyGallery
            images={property.images}
            floorPlans={property.floorPlans}
            fallback={IMAGE_PLACEHOLDER}
            alt={property.address}
          />
        </div>

        <div className="hidden sm:grid container-page mt-[clamp(28px,2.7vw,50px)] grid-cols-1 lg:grid-cols-[1fr_clamp(360px,30vw,460px)] gap-x-[clamp(24px,2.7vw,56px)] gap-y-[clamp(24px,2.25vw,42px)]">
          <div>
            <h1 className="font-display font-bold text-brand-bunker text-[clamp(1.4rem,2.1vw,2.4rem)] leading-[1.1]">
              {addressLine1}
              {addressLine2 && (
                <>
                  ,<br />
                  {addressLine2}
                </>
              )}
            </h1>

            {property.description && (
              <p className="mt-[clamp(18px,1.45vw,25px)] font-display font-medium text-[15px] sm:text-[clamp(15px,1.05vw,17px)] leading-[1.7] text-[#202020] max-w-[640px] whitespace-pre-line">
                {property.description}
              </p>
            )}

            {property.features.length > 0 && (
              <div className="mt-[clamp(24px,2vw,36px)]">
                <h2 className="font-display text-[18px] font-semibold text-brand-bunker">Features</h2>
                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 max-w-[640px]">
                  {property.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-display text-[14px] text-brand-bunker">
                      <span className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-brand-navy" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Agents */}
            {property.agents.length > 0 && (
              <div className="mt-[clamp(36px,3.15vw,64px)]">
                <h2 className="font-display text-[18px] font-semibold text-brand-bunker">Your agents</h2>
                <div className="mt-4 grid grid-cols-2 gap-[clamp(14px,1.25vw,22px)] max-w-[500px]">
                  {property.agents.map((a) => (
                    <AgentMini key={a.id || a.name} agent={a} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-[64px] lg:self-start">
            <StatsRow property={property} />

            <div className="flex gap-[clamp(14px,1.3vw,20px)] mt-[clamp(24px,2vw,32px)]">
              <EnquireTrigger listingId={property.id} className="flex-1 !h-[52px] !rounded-[16px] !text-[15px]" />
              <Button
                href="#share"
                variant="outline-dark"
                size="sm"
                className="flex-1 !h-[52px] !rounded-[16px] !text-[15px]"
              >
                Share
              </Button>
            </div>

            <DetailRow label="Price" value={property.guide} topSpace />
            <DetailRow label="Next inspection" value={nextInspection} />
            {property.authority && <DetailRow label="Authority" value={property.authority} />}
            {property.auctionDate && (
              <DetailRow label="Auction" value={formatInspection(property.auctionDate)} />
            )}

            {property.inspections.length > 0 && (
              <div className="mt-4 pt-1">
                <h3 className="font-display text-[16px] font-semibold text-[#202020]">Open for inspection</h3>
                <ul className="mt-2">
                  {property.inspections.map((i) => (
                    <li key={i.start} className="flex items-center justify-between border-b border-brand-silver/40 py-2 font-display text-[14px]">
                      <span className="text-brand-bunker">{formatInspection(i.start)}</span>
                      {i.end && (
                        <span className="text-brand-bunker/60">→ {formatInspection(i.end)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {propertyInfo.length > 0 && (
              <div className="mt-4 pt-1">
                <h3 className="font-display text-[16px] font-semibold text-[#202020]">Property information</h3>
                <dl className="mt-2">
                  {propertyInfo.map((d) => (
                    <div key={d.label} className="flex items-center justify-between py-[10px]">
                      <dt className="font-display font-medium text-[15px] text-[#202020]">{d.label}</dt>
                      <dd className="font-display text-[15px] font-medium text-[#202020]">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </aside>
        </div>

        <div className="hidden sm:block container-page mt-[clamp(44px,3.15vw,64px)]">
          <div className="relative aspect-[16/7] md:aspect-[16/6] w-full overflow-hidden bg-brand-soft-2">
            <iframe
              title={property.address}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>

        {/* Similar */}
        {similarCards.length > 0 && (
          <>
            <section className="sm:hidden relative w-full overflow-hidden py-[clamp(24px,2.7vw,56px)]">
              <Image
                src="/images/bg.png"
                alt=""
                fill
                quality={90}
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[#001F4D1F] pointer-events-none" />
              <div className="relative z-10 container-page">
                <h2 className="font-display font-bold text-white text-[22px] leading-[1.1]">
                  Others also viewed
                </h2>
              </div>
              <div className="relative z-10 mt-[20px] no-scrollbar flex snap-x snap-mandatory gap-[14px] overflow-x-auto px-[var(--page-px)] pb-[8px]">
                {similarCards.map((p) => (
                  <Link
                    key={p.id}
                    href={p.href!}
                    className="snap-start shrink-0 basis-[46%] overflow-hidden rounded-[14px] bg-white/5"
                  >
                    <div className="relative aspect-[3/2] w-full overflow-hidden">
                      <PropertyImage src={p.image} fallback={SIMILAR_PLACEHOLDER} alt={p.address} fill sizes="50vw" className="object-cover" />
                    </div>
                    <div className="p-[12px]">
                      <p className="font-display text-[13px] font-medium text-white">{p.address}</p>
                      <p className="mt-[2px] font-display text-[12px] text-white/70">{p.guide}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <div className="hidden sm:block container-page">
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
                    {similarCards.map((p) => (
                      <PropertyCard key={p.id} {...p} variant="compact" />
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function StatsRow({ property }: { property: PropertyDetail }) {
  const items: Array<{ value: number; label: string; big?: boolean }> = [];
  if (property.beds != null) items.push({ value: property.beds, label: "Beds", big: true });
  if (property.baths != null) items.push({ value: property.baths, label: "Baths" });
  if (property.cars != null) items.push({ value: property.cars, label: "Cars" });

  if (items.length === 0) return null;

  return (
    <div className="flex items-stretch justify-end gap-0 pr-[clamp(24px,2.5vw,48px)] mt-[calc(-1*clamp(28px,2.7vw,50px))]">
      {items.map((item, i) => (
        <Fragment key={item.label}>
          <div className="text-right pt-[clamp(6px,0.6vw,10px)] pb-[clamp(8px,0.8vw,14px)]">
            <div className="flex h-[clamp(40px,3.6vw,52px)] items-start justify-end">
              <span className={`font-display font-medium text-brand-bunker leading-none ${item.big ? "text-[clamp(40px,3.6vw,52px)] -mt-[clamp(3px,0.4vw,6px)]" : "text-[clamp(24px,2vw,28px)]"}`}>
                {item.value}
              </span>
            </div>
            <div className="mt-[clamp(6px,0.6vw,10px)] font-display text-[clamp(10px,0.78vw,12px)] font-normal text-brand-bunker/70">
              {item.label}
            </div>
          </div>
          {i < items.length - 1 && (
            <div className="w-px self-center h-[clamp(46px,3.8vw,58px)] mx-[clamp(12px,1.5vw,20px)] bg-gray-300" />
          )}
        </Fragment>
      ))}
    </div>
  );
}

function DetailRow({ label, value, topSpace = false }: { label: string; value: string; topSpace?: boolean }) {
  return (
    <div className={`flex items-center justify-between border-b border-brand-silver/40 py-[14px] ${topSpace ? "mt-[14px]" : ""}`}>
      <span className="font-display font-medium text-[15px] text-[#202020]">{label}</span>
      <span className="font-display text-[15px] font-semibold text-[#202020] text-right">{value}</span>
    </div>
  );
}

function AgentMini({ agent }: { agent: PropertyAgent }) {
  return (
    <article>
      <p className="font-display text-[14px] font-semibold text-brand-bunker">{agent.name}</p>
      {agent.role && (
        <p className="mt-[2px] font-display text-[12px] font-medium text-brand-bunker/70">{agent.role}</p>
      )}
      {agent.mobile && (
        <p className="mt-[2px] font-display text-[13px] font-medium text-[#202020]">{agent.mobile}</p>
      )}
      {agent.email && (
        <a
          href={`mailto:${agent.email}`}
          className="mt-[2px] inline-block font-display text-[13px] font-medium text-brand-navy underline underline-offset-4 hover:opacity-80"
        >
          Email
        </a>
      )}
    </article>
  );
}

function MobilePropertyView({ property }: { property: PropertyDetail }) {
  const [addressLine1, addressLine2] = splitAddress(property.address);
  return (
    <div className="sm:hidden">
      <section className="container-page pt-[8px]">
        <PropertyGallery
          images={property.images}
          floorPlans={property.floorPlans}
          fallback={IMAGE_PLACEHOLDER}
          alt={property.address}
        />
      </section>

      <section className="container-page mt-[20px]">
        <h1 className="font-display font-bold text-brand-bunker text-[24px] leading-[1.2]">
          {addressLine1}
          {addressLine2 && (
            <>
              ,<br />
              {addressLine2}
            </>
          )}
        </h1>

        <div className="mt-[20px] flex items-center justify-start gap-[clamp(16px,5vw,24px)]">
          {property.beds != null && (
            <>
              <div className="flex items-baseline gap-[6px]">
                <span className="font-display font-medium leading-none text-brand-navy text-[44px]">{property.beds}</span>
                <span className="font-display text-[13px] text-brand-bunker/70">Beds</span>
              </div>
              <div className="w-px h-8 bg-gray-400" />
            </>
          )}
          {property.baths != null && (
            <>
              <div className="flex items-baseline gap-[6px]">
                <span className="font-display font-medium leading-none text-brand-navy text-[28px]">{property.baths}</span>
                <span className="font-display text-[13px] text-brand-bunker/70">Baths</span>
              </div>
              <div className="w-px h-8 bg-gray-400" />
            </>
          )}
          {property.cars != null && (
            <div className="flex items-baseline gap-[6px]">
              <span className="font-display font-medium leading-none text-brand-navy text-[28px]">{property.cars}</span>
              <span className="font-display text-[13px] text-brand-bunker/70">Cars</span>
            </div>
          )}
        </div>

        <div className="mt-[24px] flex gap-[12px]">
          <EnquireTrigger listingId={property.id} variant="navy-pill" className="flex-1" />
          <Link
            href="#share"
            className="flex h-[48px] flex-1 items-center justify-center rounded-[24px] border border-brand-navy font-display text-[14px] font-semibold text-brand-navy transition hover:bg-brand-soft"
          >
            Share
          </Link>
        </div>

        {property.description && (
          <p className="mt-[20px] font-display text-[13px] leading-[1.6] text-brand-bunker/80 whitespace-pre-line">
            {property.description}
          </p>
        )}

        {property.features.length > 0 && (
          <div className="mt-[20px]">
            <h2 className="font-display text-[15px] font-bold text-brand-bunker">Features</h2>
            <ul className="mt-2 space-y-1">
              {property.features.map((f) => (
                <li key={f} className="flex items-start gap-2 font-display text-[13px] text-brand-bunker/85">
                  <span className="mt-[6px] h-[5px] w-[5px] shrink-0 rounded-full bg-brand-navy" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {property.agents.length > 0 && (
          <div className="mt-[24px]">
            <h2 className="font-display text-[15px] font-bold text-brand-bunker">Your agents</h2>
            <div className="mt-2 space-y-3">
              {property.agents.map((a) => (
                <div key={a.id || a.name} className="rounded-[10px] bg-brand-soft p-3">
                  <p className="font-display text-[14px] font-semibold text-brand-bunker">{a.name}</p>
                  {a.role && <p className="font-display text-[12px] text-brand-bunker/70">{a.role}</p>}
                  {a.mobile && <p className="font-display text-[13px] text-brand-bunker mt-1">{a.mobile}</p>}
                  {a.email && (
                    <a href={`mailto:${a.email}`} className="font-display text-[12px] font-medium text-brand-navy underline">
                      Email
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
