import Link from "next/link";
import { PropertyCard, type PropertyCardData } from "../property/PropertyCard";

const properties: PropertyCardData[] = Array.from({ length: 4 }, () => ({
  image: "/images/latest-properties.png",
  address: "23 Dick Street, Henley",
  guide: "$8,500,000",
}));

export function LatestProperties() {
  return (
    <section className="w-full bg-white py-[clamp(56px,5vw,96px)]">
      <div className="container-page">
        <div className="flex flex-col gap-[12px] sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display font-bold text-brand-bunker text-[clamp(1.75rem,2.6vw,3.15rem)] leading-[1.1]">
            Our latest Properties
          </h2>
          <Link
            href="/buy"
            className="font-display text-[15px] lg:text-[18px] font-medium tracking-[0.02em] text-brand-bunker underline underline-offset-4 hover:text-brand-navy"
          >
            Explore more Properties
          </Link>
        </div>

        <div className="mt-[clamp(36px,3.5vw,72px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(16px,1.7vw,32px)]">
          {properties.map((p, i) => (
            <PropertyCard key={i} {...p} variant="tall" />
          ))}
        </div>
      </div>
    </section>
  );
}
