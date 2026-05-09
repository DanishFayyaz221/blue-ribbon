import { PropertyCard } from "./PropertyCard";

const properties = Array.from({ length: 4 }, () => ({
  image: "/images/latest-properties.png",
  address: "23 Dick Street, Henley",
  guide: "$8,500,000",
}));

export function LatestProperties() {
  return (
    <section className="relative h-[965.667px] w-[1920px] bg-white">
      <div className="relative mx-[74.667px] h-full w-[1770.667px]">
        <h2 className="absolute left-0 top-[80.5px] whitespace-nowrap font-display text-[50.4px] font-bold leading-[53.333px] text-[#11181c]">
          Our latest Properties
        </h2>
        <a
          href="#"
          className="absolute right-0 top-[100.5px] font-display text-[19.867px] font-medium leading-[26.667px] tracking-[0.4267px] text-[#11181c] underline underline-offset-4"
        >
          Explore more Properties
        </a>

        <div className="absolute left-0 top-[235px] flex w-[1770.667px] gap-[32px]">
          {properties.map((p, i) => (
            <PropertyCard
              key={i}
              image={p.image}
              address={p.address}
              guide={p.guide}
              variant="tall"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
