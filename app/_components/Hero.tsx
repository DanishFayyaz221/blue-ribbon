import Image from "next/image";

export function Hero() {
  return (
    <section className="relative h-[960px] w-[1920px] overflow-hidden">
      <div className="absolute inset-0 blur-[6px]">
        <Image
          src="/images/dynamic.png"
          alt=""
          fill
          priority
          sizes="1920px"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute left-0 top-[379.67px] h-[536.667px] w-[1920px]">
        <h1 className="mx-auto w-[1920px] text-center font-display text-[75.867px] font-bold leading-[85.333px] tracking-[-0.0267px] text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          Own Your <span className="text-[#2ebcef]">Australian Dream</span>
        </h1>

        <SearchBar />

        <div className="absolute left-1/2 top-[277.67px] flex h-[58px] w-[556px] -translate-x-1/2 items-center justify-center bg-white/30">
          <a
            href="#"
            className="text-center font-display text-[20.4px] font-medium leading-[32px] text-white"
          >
            Get your property estimate in just 9 seconds!
          </a>
        </div>
      </div>
    </section>
  );
}

function SearchBar() {
  return (
    <div className="absolute left-[317.33px] top-[128.67px] h-[72px] w-[1285.333px]">
      <div className="flex h-full w-full items-stretch">
        <div className="flex h-[72px] w-[1065.333px] items-center border-y border-x border-[#c3c3c3] bg-white">
          <div className="flex h-full w-[193.333px] items-center justify-center border-r border-[#c3c3c3]">
            <button
              type="button"
              className="flex items-center gap-2 font-display text-[20px] font-medium text-black"
            >
              Buy
              <svg
                viewBox="0 0 24 24"
                className="h-[20px] w-[20px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          <div className="flex h-full flex-1 items-center px-[21.33px]">
            <input
              type="text"
              placeholder="Enter suburb, postcode, region or address"
              className="w-full bg-transparent font-display text-[19.467px] font-medium tracking-[0.3733px] text-black placeholder:text-[#9ca3af] focus:outline-none"
            />
          </div>

          <div className="flex h-full w-[298.333px] items-center justify-between border-l border-[#c3c3c3] px-[21.33px]">
            <label className="flex cursor-pointer items-center gap-3">
              <span className="relative flex h-[21.333px] w-[21.333px] items-center justify-center rounded-full border-[1.333px] border-black">
                <span className="h-[10.667px] w-[10.667px] rounded-full bg-black" />
              </span>
              <span className="font-display text-[17.067px] font-medium text-black">
                Surrounding suburbs
              </span>
            </label>
            <button type="button" aria-label="Filters" className="text-black">
              <svg
                viewBox="0 0 24 21"
                className="h-[18.667px] w-[21.333px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="6" y1="11" x2="18" y2="11" />
                <line x1="9" y1="16" x2="15" y2="16" />
              </svg>
            </button>
          </div>
        </div>
        <button
          type="button"
          className="ml-0 flex h-[72px] w-[220px] items-center justify-center rounded-[24px] bg-brand-navy font-display text-[19.067px] font-medium text-white transition hover:bg-brand-navy-deep"
        >
          Search
        </button>
      </div>
    </div>
  );
}
