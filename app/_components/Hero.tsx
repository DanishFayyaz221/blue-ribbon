import Image from "next/image";

export function Hero() {
  return (
    <section className="relative h-[640px] w-full overflow-hidden bg-black">
      {/*
        Background video — replace the <source src> with your own video file
        (e.g. place your video at public/videos/hero.mp4).
        The poster image is shown until the video starts.
      */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-video/hero.mp4" type="video/mp4" />
      </video>

      {/* Image fallback (covers when video is unavailable / loading) */}
      <Image
        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />

      <div className="absolute inset-0 bg-black/30" />

      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-24 w-px border-l border-dotted border-white/50"
      />

      <header className="relative z-20 flex h-14 items-center justify-between bg-white px-6 sm:px-10">
        <Logo />
        <button
          type="button"
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center text-brand-navy transition hover:opacity-70"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
      </header>

      <div className="relative z-10 flex h-[calc(100%-56px)] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-[42px] font-bold leading-tight tracking-tight text-white sm:text-[44px]">
          Own Your <span className="text-sky-400">Australian Dream</span>
        </h1>

        <SearchBar />
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 w-full max-w-3xl -translate-x-1/2 px-6">
        <button
          type="button"
          className="block w-full bg-white/20 py-3 text-center text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/30"
        >
          Get your property estimate in just 9 seconds!
        </button>
      </div>
    </section>
  );
}

function Logo() {
  return (
    <Image
      src="/logo/LOGO.png"
      alt="Blue Ribbon Real Estate"
      width={200}
      height={58}
      priority
      className="relative h-20 w-auto shrink-0 sm:h-24"
    />
  );
}

function SearchBar() {
  return (
    <div className="mt-8 flex w-full max-w-3xl flex-col items-stretch gap-2 rounded-2xl bg-white p-1.5 shadow-2xl sm:flex-row sm:items-center sm:rounded-full">
      <button
        type="button"
        className="flex items-center justify-between gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-brand-navy hover:bg-slate-50 sm:justify-start"
      >
        Buy
        <Chevron />
      </button>
      <span className="hidden h-6 w-px bg-slate-200 sm:block" />
      <input
        type="text"
        placeholder="Enter suburb, postcode, region or address"
        className="flex-1 bg-transparent px-4 py-2.5 text-sm text-brand-navy placeholder:text-slate-400 focus:outline-none"
      />
      <span className="hidden h-6 w-px bg-slate-200 sm:block" />
      <button
        type="button"
        className="flex items-center justify-between gap-2 rounded-full px-4 py-2.5 text-sm text-brand-navy hover:bg-slate-50 sm:justify-start"
      >
        <span className="flex h-4 w-4 items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-brand-navy" />
        </span>
        Surrounding suburbs
        <ChevronUpDown />
      </button>
      <button
        type="button"
        className="rounded-full bg-brand-navy px-7 py-2.5 text-sm font-medium text-white transition hover:bg-brand-navy-deep"
      >
        Search
      </button>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ChevronUpDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 opacity-60"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 9l4-4 4 4" />
      <path d="M16 15l-4 4-4-4" />
    </svg>
  );
}
