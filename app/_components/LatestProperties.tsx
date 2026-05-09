import Image from "next/image";

const property = {
  image: "/images/latest-properties.png",
  address: "23 Dick Street, Henley",
  guide: "$8,500,000",
};

const properties = Array.from({ length: 4 }, (_, i) => ({ id: i, ...property }));

export function LatestProperties() {
  return (
    <section className="bg-white px-6 py-16 text-brand-navy">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-display text-[50.4px] font-bold leading-tight tracking-tight">
            Our latest Properties
          </h2>
          <a
            href="#"
            className="text-sm text-brand-navy underline underline-offset-4 hover:opacity-70"
          >
            Explore more Properties
          </a>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {properties.map((p) => (
            <div key={p.id}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
                <Image
                  src={p.image}
                  alt={p.address}
                  fill
                  sizes="(min-width: 768px) 22vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-base font-medium">{p.address}</p>
                <p className="text-sm text-slate-500">Guide {p.guide}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
