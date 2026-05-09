import Image from "next/image";

const tiles = [
  { label: "Advanced Search", src: "/images/dynamic.png" },
  { label: "Meet Our Agents", src: "/images/find-an-agent.png" },
  { label: "Find Your Desire", src: "/images/find-an-office.png" },
  { label: "The BlueRibbon Difference", src: "/images/the-mcgrath-difference.png" },
] as const;

const tabs = ["Buying", "Selling", "Renting"] as const;

export function BridgeToHome() {
  return (
    <section className="relative h-[824.333px] w-[1920px] bg-white">
      <div className="relative mx-[74.667px] h-full w-[1770.667px]">
        <h2 className="absolute left-0 top-[26px] whitespace-nowrap font-display text-[48.533px] font-bold capitalize leading-[53.333px] text-[#202020]">
          Your bridge to home
        </h2>

        <div className="absolute right-0 top-[34.67px] flex h-[48px] w-[656px] items-center">
          {tabs.map((tab, i) => {
            const active = i === 0;
            return (
              <button
                key={tab}
                type="button"
                className="relative flex h-[42.667px] flex-1 items-center justify-center"
              >
                <span
                  className={`font-display text-[20px] font-medium leading-[26.667px] tracking-[0.4267px] ${
                    active ? "text-[#11181c]" : "text-black"
                  }`}
                >
                  {tab}
                </span>
                {active ? (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.667px] bg-[#11181c] shadow-[0px_1.333px_0px_0px_rgba(0,0,0,0.05)]" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="absolute left-0 top-[176px] flex w-[1770.667px] gap-[32px]">
          {tiles.map((tile) => (
            <a key={tile.label} href="#" className="block w-[418.667px]">
              <div className="relative h-[575.667px] w-[418.667px] overflow-hidden rounded-[32px]">
                <Image
                  src={tile.src}
                  alt={tile.label}
                  fill
                  sizes="418px"
                  className="object-cover"
                />
              </div>
              <p className="mt-[21.33px] whitespace-nowrap font-display text-[22.267px] font-medium leading-[29.333px] tracking-[0.48px] text-[#202020]">
                {tile.label}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
