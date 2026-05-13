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
    <section className="w-full bg-white sm:bg-brand-soft py-[clamp(50px,4.5vw,86px)]">
      <div className="container-page">
        <h2 className="font-display font-bold text-brand-navy text-[clamp(1.575rem,2.35vw,2.85rem)] leading-[1.1]">
          Best Suited for You
        </h2>

        <div className="mt-[clamp(36px,3.15vw,64px)] grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(18px,1.5vw,28px)] gap-y-[clamp(24px,2.15vw,40px)]">
          {properties.map((p, i) => (
            <PropertyCard key={i} {...p} variant="wide" />
          ))}
        </div>
      </div>
    </section>
  );
}
