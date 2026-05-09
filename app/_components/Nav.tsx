import Image from "next/image";

export function Nav() {
  return (
    <nav className="relative z-30 flex w-[1920px] items-center bg-white py-[10.667px]">
      <div className="mx-[74.667px] flex flex-1 items-center justify-between">
        <a href="#" className="block">
          <Image
            src="/logo/LOGO.png"
            alt="Blue Ribbon Real Estate"
            width={260}
            height={64}
            priority
            className="h-[64px] w-auto"
          />
        </a>
        <button
          type="button"
          aria-label="Open menu"
          className="flex h-[64px] w-[64px] items-center justify-center text-brand-navy transition hover:opacity-70"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[28px] w-[28px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="13" x2="20" y2="13" />
            <line x1="4" y1="19" x2="20" y2="19" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
