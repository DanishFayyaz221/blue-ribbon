import Link from "next/link";
import { PropertyCard, type PropertyCardData } from "../property/PropertyCard";
import { api, type PropertyCard as ApiProperty } from "@/lib/api";

const PLACEHOLDER = "/images/dynamic.png";

function toCard(p: ApiProperty): PropertyCardData & { id: string } {
  return {
    id: p.id,
    href: `/property/${p.id}`,
    image: p.image ?? PLACEHOLDER,
    address: p.address || "Address on request",
    guide: p.guide,
    beds: p.beds,
    baths: p.baths,
    cars: p.cars,
  };
}

export async function BestSuitedForYou() {
  const { items } = await api.listProperties({ limit: 6 });
  const properties = items.map(toCard);

  return (
    <section className="w-full bg-white sm:bg-brand-soft py-[clamp(36px,3.2vw,60px)]">
      <div className="container-page">
        <div className="flex flex-col gap-[10px] sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display font-bold text-brand-navy text-[clamp(1.3rem,1.8vw,2rem)] leading-[1.1]">
            Best Suited for You
          </h2>
          <Link
            href="/buy"
            className="inline-flex items-center gap-[6px] self-end sm:self-auto font-display text-[13px] sm:text-[15px] lg:text-[18px] font-medium tracking-[0.02em] text-brand-navy/80 sm:text-brand-navy sm:underline sm:underline-offset-4 hover:text-brand-navy-deep"
          >
            <span className="sm:hidden">See all</span>
            <span className="hidden sm:inline">Explore more Properties</span>
            <span aria-hidden className="sm:hidden">→</span>
          </Link>
        </div>

        <div className="mt-[clamp(28px,2.7vw,52px)] grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(10px,0.8vw,16px)] gap-y-[clamp(20px,1.8vw,32px)]">
          {properties.map((p) => (
            <PropertyCard key={p.id} {...p} variant="wide" />
          ))}
        </div>
      </div>
    </section>
  );
}
