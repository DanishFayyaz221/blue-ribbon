import Image from "next/image";
import { Nav } from "../../_components/layout/Nav";
import { Footer } from "../../_components/layout/Footer";
import { Breadcrumb } from "../../_components/ui/Breadcrumb";
import { Button } from "../../_components/ui/Button";
import { AgentCard, type AgentCardData } from "../../_components/agents/AgentCard";
import { PropertyCard, type PropertyCardData } from "../../_components/property/PropertyCard";

const agents: AgentCardData[] = [
  {
    name: "Alex Smith",
    role: "Co-Founder | Chief Executive Officer",
    image: "/about-us-images/image 5.png",
  },
  {
    name: "Alex Smith",
    role: "Co-Founder | Chief Executive Officer",
    image: "/about-us-images/image 5.png",
  },
];

const similar: PropertyCardData[] = Array.from({ length: 3 }, () => ({
  image: "/images/latest-properties.png",
  address: "8 Brook Avenue, Toronto",
  guide: "$1,200,000",
}));

const details: { label: string; value: string }[] = [
  { label: "Property Information", value: "" },
  { label: "Land Size (approx.)", value: "545m²" },
  { label: "Price", value: "$2,650,000 - $2,915,000" },
  { label: "Council Rates", value: "$430 / quarter" },
  { label: "Water Rates", value: "$190 / quarter" },
  { label: "Strata Levies", value: "—" },
  { label: "Internal area (Indicative)", value: "245m²" },
];

export default function PropertyViewPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <div className="container-page pt-[16px] pb-[16px]">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Buy", href: "/buy" },
              { label: "24 Virginia Road" },
            ]}
          />
        </div>

        <div className="container-page">
          <div className="relative aspect-[16/8] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)]">
            <Image
              src="/images/dynamic.png"
              alt="Property hero"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="container-page mt-[clamp(36px,3.5vw,64px)] grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-[clamp(24px,3vw,56px)]">
          <div>
            <h1 className="font-display font-bold text-brand-bunker text-[clamp(1.75rem,2.6vw,3rem)] leading-[1.1]">
              24 Virginia Road,
              <br />
              Hamlyn Terrace
            </h1>
            <p className="mt-[16px] font-display text-[14px] sm:text-[15px] leading-[1.7] text-brand-bunker/80 max-w-[640px]">
              Step inside this stunning Hamlyn Terrace home, designed to delight in
              every way. Functionality and finesse abound throughout, from the
              striking facade and lush gardens to the elegant interiors curated for
              modern Australian living.
            </p>

            <div className="mt-[clamp(24px,2vw,40px)] grid grid-cols-2 sm:grid-cols-4 gap-[16px]">
              <Spec label="Beds" value="4" />
              <Spec label="Baths" value="2" />
              <Spec label="Cars" value="2" />
              <Spec label="Type" value="House" />
            </div>

            <div className="mt-[clamp(24px,2vw,40px)] flex flex-wrap gap-[12px]">
              <Button href="#enquire" variant="primary" size="md">Enquire</Button>
              <Button href="#share" variant="outline-dark" size="md">Share</Button>
            </div>

            <div className="mt-[clamp(32px,2.5vw,48px)]">
              <h2 className="font-display text-[18px] sm:text-[20px] font-semibold text-brand-bunker">
                Meet our Agents
              </h2>
              <div className="mt-[16px] grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                {agents.map((a, i) => (
                  <AgentCard key={i} {...a} />
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-[24px] lg:self-start">
            <div className="rounded-[12px] bg-brand-soft-2 p-[clamp(20px,2vw,32px)]">
              <h2 className="font-display text-[18px] font-semibold text-brand-bunker">
                Property Details
              </h2>
              <dl className="mt-[16px] divide-y divide-brand-silver/60">
                {details.slice(1).map((d) => (
                  <div key={d.label} className="flex items-center justify-between py-[10px]">
                    <dt className="font-display text-[13px] text-brand-bunker/70">{d.label}</dt>
                    <dd className="font-display text-[13px] font-medium text-brand-bunker">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>

        <div className="container-page mt-[clamp(56px,4vw,80px)]">
          <div className="relative aspect-[16/6] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)] bg-brand-soft-2">
            <Image src="/images/find-an-office.png" alt="Map" fill sizes="100vw" className="object-cover" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-navy px-[16px] py-[8px] font-display text-[13px] font-medium text-white">
              📍 24 Virginia Road
            </div>
          </div>
        </div>

        <section className="w-full mt-[clamp(56px,5vw,96px)] bg-brand-navy py-[clamp(40px,3.5vw,72px)]">
          <div className="container-page">
            <h2 className="font-display font-bold text-white text-[clamp(1.5rem,2.1vw,2.5rem)] leading-[1.15]">
              Others also viewed
            </h2>
            <div className="mt-[clamp(24px,2.4vw,40px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(16px,1.7vw,32px)]">
              {similar.map((p, i) => (
                <PropertyCard key={i} {...p} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start gap-[4px] rounded-[8px] bg-brand-soft-2 px-[16px] py-[12px]">
      <span className="font-display text-[11px] uppercase tracking-[0.08em] text-brand-bunker/60">
        {label}
      </span>
      <span className="font-display text-[20px] font-semibold text-brand-bunker">
        {value}
      </span>
    </div>
  );
}
