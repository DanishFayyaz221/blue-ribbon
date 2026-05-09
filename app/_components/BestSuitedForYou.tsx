import { PropertyCard } from "./PropertyCard";

const houseImage = "/images/dynamic.png";

const properties = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  image: houseImage,
  address: "10 Carlotta Avenue, Gordon",
  guide: "$4,500,000 - $4,900,000",
}));

export function BestSuitedForYou() {
  return (
    <section className="bg-brand-lavender px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 font-display text-[50.4px] font-bold leading-tight tracking-tight text-brand-navy">
          Best Suited for You
        </h2>
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
          {properties.map((p) => (
            <PropertyCard
              key={p.id}
              image={p.image}
              address={p.address}
              guide={p.guide}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
