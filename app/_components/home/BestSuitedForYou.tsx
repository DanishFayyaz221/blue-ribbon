import { PropertyCard, type PropertyCardData } from "../property/PropertyCard";

const properties: PropertyCardData[] = Array.from({ length: 6 }, () => ({
  image: "/images/dynamic.png",
  address: "10 Carlotta Avenue, Gordon",
  guide: "$4,500,000 - $4,900,000",
  beds: 4,
  baths: 2,
  cars: 2,
}));

export function BestSuitedForYou() {
  return (
    <section className="w-full bg-white sm:bg-brand-soft py-[clamp(36px,3.2vw,60px)]">
      <div className="container-page">
        <h2 className="font-display font-bold text-brand-navy text-[clamp(1.3rem,1.8vw,2rem)] leading-[1.1]">
          Best Suited for You
        </h2>

        <div className="mt-[clamp(28px,2.7vw,52px)] grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(16px,1.3vw,24px)] gap-y-[clamp(20px,1.8vw,32px)]">
          {properties.map((p, i) => (
            <PropertyCard key={i} {...p} variant="wide" />
          ))}
        </div>
      </div>
    </section>
  );
}
