import { PropertyCard } from "./PropertyCard";

const properties = [
  {
    image: "/images/latest-properties.png",
    address: "10 Carlotta Avenue, Gordon",
    guide: "$4,500,000 - $4,900,000",
  },
  {
    image: "/images/latest-properties.png",
    address: "10 Carlotta Avenue, Gordon",
    guide: "$4,500,000 - $4,900,000",
  },
  {
    image: "/images/latest-properties.png",
    address: "10 Carlotta Avenue, Gordon",
    guide: "$4,500,000 - $4,900,000",
  },
  {
    image: "/images/latest-properties.png",
    address: "10 Carlotta Avenue, Gordon",
    guide: "$4,500,000 - $4,900,000",
  },
  {
    image: "/images/latest-properties.png",
    address: "10 Carlotta Avenue, Gordon",
    guide: "$4,500,000 - $4,900,000",
  },
  {
    image: "/images/latest-properties.png",
    address: "10 Carlotta Avenue, Gordon",
    guide: "$4,500,000 - $4,900,000",
  },
];

export function BestSuitedForYou() {
  return (
    <section className="relative h-[2051px] w-[1920px] bg-[#e2eeff]">
      <div className="relative mx-[74.667px] h-full w-[1770.667px]">
        <h2 className="absolute left-0 top-[80.5px] whitespace-nowrap font-display text-[49.733px] font-bold leading-[53.333px] text-brand-navy">
          Best Suited for You
        </h2>

        <div className="absolute left-0 top-[235px] grid w-[1770.667px] grid-cols-2 gap-x-[32px] gap-y-[31px]">
          {properties.map((p, i) => (
            <PropertyCard
              key={i}
              image={p.image}
              address={p.address}
              guide={p.guide}
              variant="wide"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
