import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "../ui/Button";

type Props = {
  title?: ReactNode;
  body?: string;
  buttonLabel?: string;
  buttonHref?: string;
  imageSrc?: string;
};

export function GetInTouchCTA({
  title = (
    <>
      Want to get in touch
      <br />
      with us?
    </>
  ),
  body = "We're all about offering supportive, expert advice every step of the way, making your property buying experience as seamless and enjoyable as possible.",
  buttonLabel = "Contact our Agent",
  buttonHref = "/contact",
  imageSrc = "/images/get-in.png",
}: Props) {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Navy fabric background */}
      <Image
        src="/images/bg.png"
        alt=""
        fill
        quality={90}
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Navy overlay (#001F4D @ ~12%) */}
      <div className="absolute inset-0 bg-[#001F4D1F] pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-[1920px] grid grid-cols-1 lg:grid-cols-2 lg:aspect-[1920/560] 2xl:max-h-[560px]">
        <div className="flex items-center px-[clamp(22px,4.5vw,86px)] py-[clamp(28px,2.7vw,50px)] lg:py-0">
          <div className="w-full max-w-[520px]">
            <h2 className="font-display font-bold text-white text-[clamp(2rem,3vw,3.25rem)] leading-[1.1] whitespace-nowrap">
              {title}
            </h2>
            <p className="mt-[clamp(24px,2.2vw,40px)] font-display font-normal text-white/90 text-[15px] sm:text-[17px] leading-[1.6] tracking-[0.01em]">
              {body}
            </p>
            <div className="mt-[clamp(28px,2.6vw,44px)]">
              <Button
                href={buttonHref}
                variant="outline"
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
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
