import Image from "next/image";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { PropertySearchBar } from "../_components/property/PropertySearchBar";
import { PropertyCard, type PropertyCardData } from "../_components/property/PropertyCard";
import { Pagination } from "../_components/sections/Pagination";
import { GetInTouchCTA } from "../_components/sections/GetInTouchCTA";

const featured: PropertyCardData[] = Array.from({ length: 12 }, () => ({
  image: "/images/latest-properties.png",
  address: "10 Carlotta Avenue, Gordon",
  guide: "$4,500,000 - $4,900,000",
}));

const latest: PropertyCardData[] = Array.from({ length: 4 }, () => ({
  image: "/images/latest-properties.png",
  address: "23 Dick Street, Henley",
  guide: "$8,500,000",
}));

export default function BuyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <div className="container-page pt-[16px] pb-[24px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Buy" }]} />
        </div>

        <section className="relative w-full overflow-hidden">
          <div className="relative aspect-[1920/990] min-h-[460px] w-full">
            <Image
              src="/contact/contact-us.png"
              alt="Featured property"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </section>

        <div className="container-page mt-[clamp(40px,4vw,80px)]">
          <PropertySearchBar />
        </div>

        <div className="container-page mt-[clamp(36px,3.5vw,64px)]">
          <div className="flex flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-display font-bold text-brand-bunker text-[clamp(1.5rem,2.1vw,2.5rem)] leading-[1.15]">
              Buy Your Dream
            </h1>
            <div className="flex items-center gap-[6px] rounded-full border border-brand-silver p-[4px]">
              <button
                type="button"
                className="rounded-full bg-brand-navy px-[18px] py-[8px] font-display text-[13px] font-medium text-white"
              >
                List
              </button>
              <button
                type="button"
                className="rounded-full px-[18px] py-[8px] font-display text-[13px] font-medium text-brand-bunker"
              >
                Map
              </button>
            </div>
          </div>

          <div className="mt-[clamp(28px,2.5vw,48px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(16px,1.7vw,32px)]">
            {featured.map((p, i) => (
              <PropertyCard key={i} {...p} variant="tall" />
            ))}
          </div>

          <div className="mt-[clamp(40px,3vw,56px)]">
            <Pagination total={5} />
          </div>
        </div>

        <div className="container-page mt-[clamp(56px,5vw,96px)]">
          <div className="flex items-end justify-between">
            <h2 className="font-display font-bold text-brand-bunker text-[clamp(1.5rem,2.1vw,2.5rem)] leading-[1.15]">
              Our latest Properties
            </h2>
          </div>
          <div className="mt-[clamp(28px,2.5vw,48px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(16px,1.7vw,32px)]">
            {latest.map((p, i) => (
              <PropertyCard key={i} {...p} variant="tall" />
            ))}
          </div>
        </div>

        <div className="mt-[clamp(56px,5vw,96px)]">
          <GetInTouchCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
