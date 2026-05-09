import Image from "next/image";

type PropertyCardProps = {
  image: string;
  address: string;
  guide: string;
  variant?: "wide" | "tall";
};

export function PropertyCard({
  image,
  address,
  guide,
  variant = "wide",
}: PropertyCardProps) {
  if (variant === "tall") {
    return (
      <a href="#" className="block h-[730.667px] w-[418.667px]">
        <div className="relative h-[575.667px] w-[418.667px] overflow-hidden rounded-[32px]">
          <Image
            src={image}
            alt={address}
            fill
            sizes="418px"
            className="object-cover"
          />
        </div>
        <div className="mt-[42.33px] font-display">
          <p className="whitespace-nowrap text-[22.267px] font-medium leading-[37.333px] text-brand-navy">
            {address}
          </p>
          <p className="text-[18px] leading-[26.667px] text-black">
            Guide {guide}
          </p>
        </div>
      </a>
    );
  }

  return (
    <a
      href="#"
      className="block h-[563.667px] w-[869.333px] overflow-hidden rounded-[32px]"
    >
      <div className="relative h-[434.667px] w-[869.333px] overflow-hidden rounded-[32px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <Image
          src={image}
          alt={address}
          fill
          sizes="869px"
          className="object-cover"
        />
      </div>
      <div className="px-0 pt-[40px] font-display">
        <p className="whitespace-nowrap text-[22.267px] font-medium leading-[37.333px] text-brand-navy">
          {address}
        </p>
        <p className="text-[18px] leading-[26.667px] text-black">
          Guide {guide}
        </p>
      </div>
    </a>
  );
}
