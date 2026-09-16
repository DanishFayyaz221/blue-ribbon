import Image from "next/image";
import { Button } from "../ui/Button";
import { LineReveal } from "../ui/LineReveal";
import { TeamCTA } from "./TeamCTA";

type Props = {
  title?: string;
  body?: string;
  buttonLabel?: string;
  buttonHref?: string;
  imageSrc?: string;
};

export function GetInTouchCTA({
  title = "Want to get in touch\nwith us?",
  body = "We're all about offering supportive, expert advice every step of the way, making your property buying experience as seamless and enjoyable as possible.",
  buttonLabel = "Contact our Agent",
  buttonHref = "/contact",
  imageSrc = "/images/get-in.png",
}: Props) {
  return (
    <>
      {/* Phone: the mobile comp closes these pages on the "Our Agents" call
          to action, the same block the appraisal and Buy pages end on, not
          on this navy panel. From sm the navy panel is the comp's own. */}
      <div className="sm:hidden">
        <TeamCTA />
      </div>

    <section className="relative hidden w-full overflow-hidden sm:block">
      {/* Navy fabric background. 1px on phones: the panel is hidden there,
          but a display:none image is still fetched. */}
      <Image
        src="/images/bg.png"
        alt=""
        fill
        quality={90}
        sizes="(max-width: 639px) 1px, (min-width: 1280px) 1280px, 100vw"
        className="object-cover object-center"
      />
      {/* Navy overlay (#001F4D @ ~12%) */}
      <div className="absolute inset-0 bg-[#001F4D1F] pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-[1920px] grid grid-cols-1 lg:grid-cols-2 lg:aspect-[1920/560] 2xl:max-h-[560px]">
        <div className="flex items-center px-[clamp(22px,4.5vw,86px)] py-[clamp(28px,2.7vw,50px)] lg:py-0">
          <div className="w-full max-w-[520px]">
            <LineReveal
              as="h2"
              className="font-display font-bold text-white text-[clamp(2rem,3vw,3.25rem)] leading-[1.1] whitespace-nowrap"
            >
              {title}
            </LineReveal>
            <LineReveal
              as="p"
              className="mt-[clamp(24px,2.2vw,40px)] font-display font-normal text-white/90 text-[15px] sm:text-[17px] leading-[1.6] tracking-[0.01em]"
            >
              {body}
            </LineReveal>
            <div className="mt-[clamp(28px,2.6vw,44px)]">
              <Button
                href={buttonHref}
                variant="white"
                size="md"
                className="px-[clamp(20px,1.6vw,32px)]"
              >
                {buttonLabel}
              </Button>
            </div>
          </div>
        </div>
        <div className="relative h-[240px] sm:h-[325px] lg:h-full overflow-hidden">
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="(max-width: 639px) 1px, (max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
    </>
  );
}
