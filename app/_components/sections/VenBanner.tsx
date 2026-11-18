import Image from "next/image";
import { Button } from "../ui/Button";
import { LineReveal } from "../ui/LineReveal";

/**
 * "Your next move, Ven's full attention!" — the full-width banner of Ven at
 * his desk, from the Figma comp (Frame 12, Nov 2026). It sits directly above
 * the footer on the home, Our Story, Buy and Market Insights pages.
 *
 * From sm up it is the comp: the photo at the frame's 1924x984 shape, with the
 * logo, heading, phone and button over the navy wall on the left. Every size
 * and gap is the comp's 1920 value as a share of the viewport width, capped at
 * that value, so the block keeps its proportions — and stays clear of Ven —
 * at every width. `ven-banner.jpg` is already cropped to that frame, so
 * `object-top` shows exactly what the comp shows.
 *
 * Phones have no comp. The copy cannot sit over a photo that is ~200px tall
 * there, so it stacks on a panel the colour of the wall, with the photo below
 * cropped towards Ven.
 */
export function VenBanner({ className = "" }: { className?: string }) {
  return (
    <section
      className={`relative w-full overflow-hidden bg-[#39435a] sm:aspect-[1924/984] sm:max-h-[984px] ${className}`}
    >
      <div className="relative z-10 px-[24px] pt-[44px] pb-[32px] sm:absolute sm:left-[7.23%] sm:top-[16.16%] sm:p-0">
        <Image
          src="/logo/blueribbon-white-horizontal.png"
          alt="BlueRibbon Real Estate"
          width={925}
          height={160}
          sizes="(max-width: 639px) 200px, 24vw"
          className="h-auto w-[200px] sm:w-[min(24.1vw,463px)]"
        />
        <LineReveal
          as="h2"
          className="mt-[24px] font-display font-semibold text-white text-[clamp(26px,8.2vw,34px)] leading-[1.05] sm:mt-[min(2.5vw,48px)] sm:text-[min(4.806vw,92px)] sm:leading-[0.9875]"
        >
          {"Your next move,\nVen’s full attention!"}
        </LineReveal>
        <a
          href="tel:0404090404"
          suppressHydrationWarning
          className="reveal reveal-delay-1 mt-[14px] block w-fit font-display font-medium text-white text-[22px] leading-[1.2] hover:underline underline-offset-4 sm:mt-[min(1.85vw,36px)] sm:text-[min(2.68vw,51.5px)]"
        >
          04 04 09 04 04
        </a>
        <div
          suppressHydrationWarning
          className="reveal reveal-delay-2 mt-[24px] sm:mt-[min(4.6vw,88px)]"
        >
          <Button href="/our-team/ven-kan" variant="primary" size="xl">
            Talk to Ven
          </Button>
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full sm:absolute sm:inset-0 sm:aspect-auto">
        <Image
          src="/images/ven-banner.jpg"
          alt="Ven Kan, Managing Director of BlueRibbon Real Estate, at his desk"
          fill
          sizes="100vw"
          className="object-cover object-[80%_15%] sm:object-top"
        />
        {/* Phones: fades the photo's top edge into the panel above it, so
            the two navies meet without a seam. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[28%] bg-gradient-to-b from-[#39435a] to-transparent sm:hidden" />
      </div>
    </section>
  );
}
