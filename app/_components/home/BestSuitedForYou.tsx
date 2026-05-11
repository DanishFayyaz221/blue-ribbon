import { PropertyCard, type PropertyCardData } from "../property/PropertyCard";

const properties: PropertyCardData[] = Array.from({ length: 6 }, () => ({
  image: "/images/dynamic.png",
  address: "10 Carlotta Avenue, Gordon",
  guide: "$4,500,000 - $4,900,000",
}));

export function BestSuitedForYou() {
  return (
    <section className="w-full bg-brand-soft py-[clamp(56px,5vw,96px)]">
      <div className="container-page">
        <h2 className="font-display font-bold text-brand-navy text-[clamp(1.75rem,2.6vw,3.15rem)] leading-[1.1]">
          Best Suited for You
        </h2>

        <div className="mt-[clamp(40px,3.5vw,72px)] grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(20px,1.7vw,32px)] gap-y-[clamp(28px,2.4vw,46px)]">
          {properties.map((p, i) => (
            <PropertyCard key={i} {...p} variant="wide" />
          ))}
        </div>
      </div>
    </section>
  );
}
