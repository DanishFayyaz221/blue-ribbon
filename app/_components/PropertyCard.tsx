import Image from "next/image";

type PropertyCardProps = {
  image: string;
  address: string;
  guide: string;
};

export function PropertyCard({ image, address, guide }: PropertyCardProps) {
  return (
    <article>
      <div className="relative aspect-[5/3] overflow-hidden rounded-3xl">
        <Image
          src={image}
          alt={address}
          fill
          sizes="(min-width: 768px) 45vw, 90vw"
          className="object-cover"
        />
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-base font-medium text-brand-navy">{address}</p>
        <p className="text-sm text-slate-500">Guide {guide}</p>
      </div>
    </article>
  );
}
