import Image from "next/image";
import Link from "next/link";
import { Nav } from "../../_components/layout/Nav";
import { Footer } from "../../_components/layout/Footer";
import { Breadcrumb } from "../../_components/ui/Breadcrumb";
import { Button } from "../../_components/ui/Button";
import { PropertyCard, type PropertyCardData } from "../../_components/property/PropertyCard";
import { EnquireTrigger } from "../../_components/property/EnquireTrigger";

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
        <MobilePropertyView />
        
        <div className="hidden sm:block container-page pt-[16px] pb-[16px]">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Buy", href: "/buy" },
              { label: "24 Virginia Road" },
            ]}
          />
        </div>

        <div className="hidden sm:block container-page">
          <div className="relative aspect-[16/7] max-h-[560px] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)]">
            <Image
              src="/images/home.png"
              alt="Property hero"
              fill
              priority
              sizes="(max-width: 639px) 1px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="hidden sm:block container-page mt-[clamp(20px,1.8vw,32px)]">
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

        <div className="hidden sm:grid container-page mt-[clamp(28px,2.7vw,50px)] grid-cols-1 lg:grid-cols-[1fr_clamp(360px,30vw,460px)] gap-x-[clamp(24px,2.7vw,56px)] gap-y-[clamp(24px,2.25vw,42px)]">
          <div>
            <h1 className="font-display font-bold text-brand-bunker text-[clamp(1.4rem,2.1vw,2.4rem)] leading-[1.1]">
              24 Virginia Road,
              <br />
              Hamlyn Terrace
            </h1>

            <p className="mt-[clamp(18px,1.45vw,25px)] font-display font-medium text-[15px] sm:text-[clamp(15px,1.05vw,17px)] leading-[1.7] text-[#202020] max-w-[640px]">
              Enjoy modern comfort in this stunning ex-display Coral Home, thoughtfully
              designed for effortless living and entertaining. Light filled interiors and
              soaring ceilings enhance the sense of space, flowing through generous living
              areas to a well-appointed kitchen overlooking a private alfresco with
              beautifully landscaped gardens. This home delivers a relaxed lifestyle with
              quality finishes and practical design throughout.
            </p>

            <div className="mt-[clamp(18px,1.6vw,28px)]">
              <Button
                href="#more"
                variant="outline-dark"
                size="md"
                className="!h-[58px] !px-[68px] !rounded-[16px] !text-[15px] !border-[#001F4D]"
              >
                Read more
              </Button>
            </div>

            <div className="mt-[clamp(36px,3.15vw,64px)] grid grid-cols-2 gap-[clamp(14px,1.25vw,22px)] max-w-[440px]">
              {agents.map((a, i) => (
                <AgentMini key={i} {...a} />
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-[64px] lg:self-start">
            {/* Stats — 4 | 2 | 2 - with darker visible dividers */}
            <div className="flex items-stretch justify-end gap-0 pr-[clamp(24px,2.5vw,48px)] mt-[calc(-1*clamp(28px,2.7vw,50px))]">
              <div className="text-right pt-[clamp(6px,0.6vw,10px)] pb-[clamp(8px,0.8vw,14px)]">
                <div className="flex h-[clamp(40px,3.6vw,52px)] items-start justify-end">
                  <span className="-mt-[clamp(3px,0.4vw,6px)] font-display font-medium text-brand-bunker text-[clamp(40px,3.6vw,52px)] leading-none">
                    4
                  </span>
                </div>
                <div className="mt-[clamp(6px,0.6vw,10px)] font-display text-[clamp(10px,0.78vw,12px)] font-normal text-brand-bunker/70">
                  Beds
                </div>
              </div>
              <div className="w-px self-center h-[clamp(46px,3.8vw,58px)] mx-[clamp(12px,1.5vw,20px)] bg-gray-300" />
              <div className="text-right pt-[clamp(6px,0.6vw,10px)] pb-[clamp(8px,0.8vw,14px)]">
                <div className="flex h-[clamp(40px,3.6vw,52px)] items-start justify-end">
                  <span className="font-display font-medium text-brand-bunker text-[clamp(24px,2vw,28px)] leading-none">
                    2
                  </span>
                </div>
                <div className="mt-[clamp(6px,0.6vw,10px)] font-display text-[clamp(10px,0.78vw,12px)] font-normal text-brand-bunker/70">
                  Baths
                </div>
              </div>
              <div className="w-px self-center h-[clamp(46px,3.8vw,58px)] mx-[clamp(12px,1.5vw,20px)] bg-gray-300" />
              <div className="text-right pt-[clamp(6px,0.6vw,10px)] pb-[clamp(8px,0.8vw,14px)]">
                <div className="flex h-[clamp(40px,3.6vw,52px)] items-start justify-end">
                  <span className="font-display font-medium text-brand-bunker text-[clamp(24px,2vw,28px)] leading-none">
                    2
                  </span>
                </div>
                <div className="mt-[clamp(6px,0.6vw,10px)] font-display text-[clamp(10px,0.78vw,12px)] font-normal text-brand-bunker/70">
                  Cars
                </div>
              </div>
            </div>

            <div className="flex gap-[clamp(14px,1.3vw,20px)] mt-[clamp(48px,4.5vw,72px)]">
              <EnquireTrigger className="flex-1 !h-[52px] !rounded-[16px] !text-[15px]" />
              <Button
                href="#share"
                variant="outline-dark"
                size="sm"
                className="flex-1 !h-[52px] !rounded-[16px] !text-[15px]"
              >
                Share
              </Button>
            </div>

            <DetailRow label="Price" value="$1,150,000 – $1,200,000" topSpace />
            <DetailRow label="Next inspection" value="By appointment" />

            <div className="mt-[16px] pt-[4px]">
              <h3 className="font-display text-[16px] font-semibold text-[#202020]">
                Property information
              </h3>
              <dl className="mt-[8px]">
                {propertyInfo.map((d) => (
                  <div
                    key={d.label}
                    className="flex items-center justify-between py-[10px]"
                  >
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
          </aside>
        </div>

        <div className="hidden sm:block container-page mt-[clamp(44px,3.15vw,64px)]">
          <div className="relative aspect-[16/7] md:aspect-[16/6] w-full overflow-hidden bg-brand-soft-2">
            <iframe
              title="24 Virginia Road, Hamlyn Terrace"
              src="https://www.google.com/maps?q=-33.2557,151.4709&output=embed&z=12"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
            <div className="pointer-events-none absolute left-[clamp(8px,0.8vw,14px)] top-[clamp(8px,0.8vw,14px)] z-10 flex items-stretch gap-[6px] bg-white pr-[6px] shadow-[0_4px_14px_rgba(0,0,0,0.14)]">
              <button
                type="button"
                className="pointer-events-auto bg-brand-navy px-[clamp(16px,1.4vw,28px)] py-[clamp(8px,0.7vw,14px)] font-display text-[clamp(12px,0.9vw,15px)] font-medium text-white"
              >
                Map View
              </button>
              <button
                type="button"
                className="pointer-events-auto rounded-[6px] px-[clamp(16px,1.4vw,28px)] py-[clamp(8px,0.7vw,14px)] font-display text-[clamp(12px,0.9vw,15px)] font-medium text-brand-bunker hover:bg-brand-soft"
              >
                Satellite View
              </button>
              <span aria-hidden className="self-stretch w-[1px] bg-gray-300" />
              <button
                type="button"
                className="pointer-events-auto rounded-[6px] px-[clamp(16px,1.4vw,28px)] py-[clamp(8px,0.7vw,14px)] font-display text-[clamp(12px,0.9vw,15px)] font-medium text-brand-bunker hover:bg-brand-soft"
              >
                Street View
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: full-bleed navy section */}
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
            {similar.map((_, i) => (
              <Link
                key={i}
                href="/property/1"
                className="snap-start shrink-0 basis-[46%] overflow-hidden rounded-[14px] bg-white/5"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src="/images/avenue.png"
                    alt="4 Hillcrest Avenue, Tacoma"
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-[12px]">
                  <p className="font-display text-[13px] font-medium text-white">
                    4 Hillcrest Avenue, Tacoma
                  </p>
                  <p className="mt-[2px] font-display text-[12px] text-white/70">
                    Price on request
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Desktop: navy section aligned to container-page (matches heading X) */}
        <div className="hidden sm:block container-page">
          <section className="relative w-full overflow-hidden py-[clamp(24px,2.7vw,56px)] px-[clamp(20px,2vw,40px)] rounded-b-[clamp(8px,1vw,16px)]">
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
              <div className="mt-[clamp(20px,2.15vw,36px)] grid grid-cols-2 lg:grid-cols-3 gap-[clamp(14px,1.5vw,28px)]">
                {similar.map((p, i) => (
                  <PropertyCard
                    key={i}
                    {...p}
                    address="4 Hillcrest Avenue, Tacoma"
                    guide="Price on request"
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
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
      <span className="font-display text-[15px] font-semibold text-[#202020]">
        {value}
      </span>
    </div>
  );
}

function AgentMini({ name, phone, email, image }: AgentData) {
  return (
    <article className="overflow-hidden">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-brand-bunker/80">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top"
        />
      </div>
      <p className="mt-[12px] font-display text-[14px] font-semibold text-brand-bunker">{name}</p>
      <p className="mt-[2px] font-display text-[13px] font-medium text-[#202020]">{phone}</p>
      <a
        href={`mailto:${email}`}
        className="mt-[2px] inline-block font-display text-[13px] font-medium text-brand-navy underline underline-offset-4 hover:opacity-80"
      >
        Email
      </a>
    </article>
  );
}

function MobilePropertyView() {
  return (
    <div className="sm:hidden">
      <section className="container-page pt-[8px]">
        <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[14px]">
          <Image
            src="/images/home.png"
            alt="Property hero"
            fill
            priority
            sizes="(max-width: 639px) 100vw, 1px"
            className="object-cover"
          />
        </div>
      </section>

      <div className="container-page mt-[16px]">
        <div className="flex border-b border-brand-silver/50">
          <button
            type="button"
            className="relative flex-1 py-[12px] font-display text-[14px] font-semibold text-brand-navy"
          >
            All Photos
            <span className="absolute bottom-[-1px] left-1/2 h-[2px] w-[80px] -translate-x-1/2 bg-brand-navy" />
          </button>
          <button
            type="button"
            className="flex-1 py-[12px] font-display text-[14px] font-medium text-brand-bunker/60"
          >
            Floor Plan
          </button>
        </div>
      </div>

      <section className="container-page mt-[20px]">
        <h1 className="font-display font-bold text-brand-bunker text-[24px] leading-[1.2]">
          24 Virginia Road,
          <br />
          Hamlyn Terrace
        </h1>

        {/* Mobile Stats - with darker dividers */}
        <div className="mt-[20px] flex items-center justify-start gap-[clamp(16px,5vw,24px)]">
          <div className="flex items-baseline gap-[6px]">
            <span className="font-display font-medium leading-none text-brand-navy text-[44px]">
              4
            </span>
            <span className="font-display text-[13px] text-brand-bunker/70">Beds</span>
          </div>
          <div className="w-px h-8 bg-gray-400" />
          <div className="flex items-baseline gap-[6px]">
            <span className="font-display font-medium leading-none text-brand-navy text-[28px]">
              2
            </span>
            <span className="font-display text-[13px] text-brand-bunker/70">Baths</span>
          </div>
          <div className="w-px h-8 bg-gray-400" />
          <div className="flex items-baseline gap-[6px]">
            <span className="font-display font-medium leading-none text-brand-navy text-[28px]">
              2
            </span>
            <span className="font-display text-[13px] text-brand-bunker/70">Cars</span>
          </div>
        </div>

        <div className="mt-[24px] flex gap-[12px]">
          <EnquireTrigger variant="navy-pill" className="flex-1" />
          <Link
            href="#share"
            className="flex h-[48px] flex-1 items-center justify-center rounded-[24px] border border-brand-navy font-display text-[14px] font-semibold text-brand-navy transition hover:bg-brand-soft"
          >
            Share
          </Link>
        </div>

        <p className="mt-[20px] font-display text-[13px] leading-[1.6] text-brand-bunker/80">
          Enjoy modern comfort in this stunning an display Coast Home, thoughtfully
          designed for effortless living and entertaining.
        </p>
        <Link
          href="#more"
          className="mt-[14px] inline-block font-display text-[13px] font-bold text-brand-navy"
        >
          Read more
        </Link>

        <div className="mt-[24px] flex items-center justify-between border-t border-brand-silver/40 py-[14px]">
          <span className="font-display text-[13px] text-brand-bunker/70">Price</span>
          <span className="font-display text-[13px] font-semibold text-brand-bunker">
            $1,100,000 – $1,200,000
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-brand-silver/40 py-[14px]">
          <span className="font-display text-[13px] text-brand-bunker/70">Next Inspection</span>
          <span className="font-display text-[13px] font-semibold text-brand-bunker">
            By appointment
          </span>
        </div>
      </section>

      <section className="container-page mt-[20px]">
        <h2 className="font-display text-[18px] font-bold text-brand-bunker">Your Agents</h2>
        <div className="mt-[14px] grid grid-cols-2 gap-[12px]">
          {agents.map((a, i) => (
            <article
              key={i}
              className="flex flex-col items-center rounded-[14px] bg-[#F1F2F4] p-[16px] text-center"
            >
              <div className="relative h-[68px] w-[68px] overflow-hidden rounded-full bg-white">
                <Image
                  src={a.image}
                  alt={a.name}
                  fill
                  sizes="68px"
                  className="object-cover object-top"
                />
              </div>
              <p className="mt-[10px] font-display text-[14px] font-semibold text-brand-bunker">
                {a.name}
              </p>
              <p className="mt-[2px] font-display text-[11px] text-brand-bunker/70">
                0413 423 00 00
              </p>
              <a
                href={`mailto:${a.email}`}
                className="mt-[6px] font-display text-[12px] font-semibold text-brand-navy underline underline-offset-4"
              >
                Email
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page mt-[28px]">
        <div className="flex items-center gap-[8px]">
          <button
            type="button"
            className="rounded-[20px] bg-brand-navy px-[18px] py-[8px] font-display text-[12px] font-semibold text-white"
          >
            Map View
          </button>
          <button
            type="button"
            className="rounded-[20px] border border-brand-silver bg-white px-[18px] py-[8px] font-display text-[12px] font-medium text-brand-bunker"
          >
            Satellite
          </button>
          <button
            type="button"
            className="rounded-[20px] border border-brand-silver bg-white px-[18px] py-[8px] font-display text-[12px] font-medium text-brand-bunker"
          >
            Street View
          </button>
        </div>
      </section>

      <section className="container-page mt-[24px]">
        <h2 className="font-display text-[18px] font-bold text-brand-bunker">
          Property Information
        </h2>
        <dl className="mt-[12px]">
          <div className="flex items-center justify-between border-t border-brand-silver/40 py-[12px]">
            <dt className="font-display text-[13px] text-brand-bunker/70">
              Land size approx. (sqm)
            </dt>
            <dd className="font-display text-[13px] font-semibold text-brand-bunker">493</dd>
          </div>
          <div className="flex items-center justify-between border-t border-brand-silver/40 py-[12px]">
            <dt className="font-display text-[13px] text-brand-bunker/70">Council rates (pa)</dt>
            <dd className="font-display text-[13px] font-semibold text-brand-bunker">1,543</dd>
          </div>
          <div className="flex items-center justify-between border-t border-b border-brand-silver/40 py-[12px]">
            <dt className="font-display text-[13px] text-brand-bunker/70">Water rates (pa)</dt>
            <dd className="font-display text-[13px] font-semibold text-brand-bunker">1,185</dd>
          </div>
        </dl>
      </section>

      <section className="container-page mt-[20px] pb-[40px]">
        <h2 className="font-display text-[18px] font-bold text-brand-bunker">Resources</h2>
        <div className="mt-[10px] flex items-center justify-between py-[10px]">
          <span className="font-display text-[13px] text-brand-bunker/70">Home loan calculator</span>
          <Link
            href="#calculator"
            className="font-display text-[13px] font-bold text-brand-navy underline underline-offset-4"
          >
            View
          </Link>
        </div>
      </section>
    </div>
  );
}