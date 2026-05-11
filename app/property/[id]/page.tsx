import Image from "next/image";
import Link from "next/link";
import { Nav } from "../../_components/layout/Nav";
import { Footer } from "../../_components/layout/Footer";
import { Breadcrumb } from "../../_components/ui/Breadcrumb";
import { Button } from "../../_components/ui/Button";
import { PropertyCard, type PropertyCardData } from "../../_components/property/PropertyCard";

type AgentData = {
  name: string;
  phone: string;
  email: string;
  image: string;
};

const agents: AgentData[] = [
  {
    name: "Ven KAN",
    phone: "04 18 43 60 80",
    email: "ven@blueribbonre.com.au",
    image: "/our-team/our-team.png",
  },
  {
    name: "Ven KAN",
    phone: "04 18 43 60 80",
    email: "ven@blueribbonre.com.au",
    image: "/our-team/our-team.png",
  },
];

const similar: PropertyCardData[] = Array.from({ length: 3 }, () => ({
  image: "/images/avenue.png",
  address: "8 Brook Avenue, Toronto",
  guide: "$1,200,000",
}));

const propertyInfo = [
  { label: "Land size approx. (sqm)", value: "480" },
  { label: "Council rates (pa)", value: "1,543" },
  { label: "Water rates (pa)", value: "1,185" },
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
              src="/images/home.png"
              alt="Property hero"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="container-page mt-[clamp(20px,1.8vw,32px)]">
          <div className="flex items-center justify-between border-b border-brand-silver/40 pb-[16px]">
            <div className="flex flex-1 items-center justify-center gap-[clamp(24px,3vw,56px)]">
              <button
                type="button"
                className="font-display text-[14px] sm:text-[15px] font-medium text-brand-bunker hover:text-brand-navy"
              >
                All Photos
              </button>
              <button
                type="button"
                className="font-display text-[14px] sm:text-[15px] font-medium text-brand-bunker/70 hover:text-brand-navy"
              >
                Floor Plan
              </button>
            </div>
            <span className="font-display text-[13px] text-brand-bunker/70">1 of 10</span>
          </div>
        </div>

        <div className="container-page mt-[clamp(32px,3vw,56px)] grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-x-[clamp(28px,3vw,64px)] gap-y-[clamp(28px,2.5vw,48px)]">
          <div>
            <h1 className="font-display font-bold text-brand-bunker text-[clamp(1.75rem,2.6vw,3rem)] leading-[1.1]">
              24 Virginia Road,
              <br />
              Hamlyn Terrace
            </h1>

            <p className="mt-[clamp(20px,1.6vw,28px)] font-display text-[14px] sm:text-[15px] leading-[1.7] text-brand-bunker/80 max-w-[640px]">
              Enjoy modern comfort in this stunning ex-display Coral Home, thoughtfully
              designed for effortless living and entertaining. Light filled interiors and
              soaring ceilings enhance the sense of space, flowing through generous living
              areas to a well-appointed kitchen overlooking a private alfresco with
              beautifully landscaped gardens. This home delivers a relaxed lifestyle with
              quality finishes and practical design throughout.
            </p>

            <div className="mt-[clamp(20px,1.8vw,32px)]">
              <Button href="#more" variant="outline-dark" size="sm">
                Read more
              </Button>
            </div>

            <div className="mt-[clamp(40px,3.5vw,72px)] grid grid-cols-1 sm:grid-cols-2 gap-[clamp(16px,1.4vw,24px)]">
              {agents.map((a, i) => (
                <AgentMini key={i} {...a} />
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-[24px] lg:self-start">
            <div className="flex items-center justify-around pb-[20px]">
              <Stat number="4" label="Beds" />
              <Stat number="2" label="Baths" />
              <Stat number="2" label="Cars" />
            </div>

            <div className="flex gap-[10px]">
              <Button href="#enquire" variant="primary" size="sm" className="flex-1">
                Enquire
              </Button>
              <Button href="#share" variant="outline-dark" size="sm" className="flex-1">
                Share
              </Button>
            </div>

            <DetailRow label="Price" value="$1,150,000 – $1,200,000" topSpace />
            <DetailRow label="Next inspection" value="By appointment" />

            <div className="mt-[16px] pt-[4px]">
              <h3 className="font-display text-[13px] font-semibold text-brand-bunker">
                Property information
              </h3>
              <dl className="mt-[8px]">
                {propertyInfo.map((d) => (
                  <div
                    key={d.label}
                    className="flex items-center justify-between py-[8px]"
                  >
                    <dt className="font-display text-[12px] text-brand-bunker/70">
                      {d.label}
                    </dt>
                    <dd className="font-display text-[12px] font-medium text-brand-bunker">
                      {d.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-[12px] border-t border-brand-silver/40 pt-[14px]">
              <h3 className="font-display text-[13px] font-semibold text-brand-bunker">
                Resource
              </h3>
              <div className="mt-[6px] flex items-center justify-between py-[8px]">
                <span className="font-display text-[12px] text-brand-bunker/70">
                  Home loan calculator
                </span>
                <Link
                  href="#calculator"
                  className="font-display text-[12px] font-medium text-brand-navy underline underline-offset-4 hover:opacity-80"
                >
                  View
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <div className="container-page mt-[clamp(56px,4vw,80px)]">
          <div className="relative aspect-[16/6] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)] bg-brand-soft-2">
            <Image src="/images/find-an-office.png" alt="Map" fill sizes="100vw" className="object-cover" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-navy px-[16px] py-[8px] font-display text-[13px] font-medium text-white">
              24 Virginia Road
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

function Stat({ number, label, padded = false }: { number: string; label: string; padded?: boolean }) {
  return (
    <div className={`flex flex-col items-center ${padded ? "pl-[12px]" : ""}`}>
      <span className="font-display text-[26px] font-bold leading-none text-brand-bunker">
        {number}
      </span>
      <span className="mt-[6px] font-display text-[11px] font-normal text-brand-bunker/70">
        {label}
      </span>
    </div>
  );
}

function DetailRow({ label, value, topSpace = false }: { label: string; value: string; topSpace?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between border-b border-brand-silver/40 py-[12px] ${
        topSpace ? "mt-[14px]" : ""
      }`}
    >
      <span className="font-display text-[12px] text-brand-bunker/70">{label}</span>
      <span className="font-display text-[12px] font-semibold text-brand-bunker">
        {value}
      </span>
    </div>
  );
}

function AgentMini({ name, phone, email, image }: AgentData) {
  return (
    <article className="overflow-hidden">
      <div className="relative aspect-[9/10] w-full overflow-hidden rounded-[12px] bg-brand-bunker/80">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top"
        />
      </div>
      <p className="mt-[12px] font-display text-[14px] font-semibold text-brand-bunker">{name}</p>
      <p className="mt-[2px] font-display text-[13px] text-brand-bunker/80">{phone}</p>
      <a
        href={`mailto:${email}`}
        className="mt-[2px] inline-block font-display text-[13px] font-medium text-brand-navy underline underline-offset-4 hover:opacity-80"
      >
        Email
      </a>
    </article>
  );
}
