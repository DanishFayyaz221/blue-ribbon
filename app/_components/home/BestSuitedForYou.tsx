import { connection } from "next/server";
import { PropertyCard } from "../property/PropertyCard";
import { getListings } from "@/lib/db/queries";

export async function BestSuitedForYou() {
  // Defer to request time so the section reflects the feed rather than being
  // frozen into the build output.
  await connection();

  // Sorted by price rather than recency. "Our latest Properties" further down
  // the page already sorts by modTime, and pulling both from the same order
  // would render the two sections identically.
  const { items } = await getListings({ sort: "price-asc", perPage: 6 });

  if (items.length === 0) return null;

  return (
    <section className="w-full bg-white sm:bg-brand-soft py-[clamp(36px,3.2vw,60px)]">
      <div className="container-page">
        <h2 className="font-display font-bold text-brand-navy text-[clamp(1.3rem,1.8vw,2rem)] leading-[1.1]">
          Best Suited for You
        </h2>

        <div className="mt-[clamp(28px,2.7vw,52px)] grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(10px,0.8vw,16px)] gap-y-[clamp(20px,1.8vw,32px)]">
          {items.map((p) => (
            <PropertyCard key={p.id} {...p} variant="wide" />
          ))}
        </div>
      </div>
    </section>
  );
}
