import Image from "next/image";
import { Button } from "../ui/Button";

type Props = {
  title?: string;
  body?: string;
  buttonLabel?: string;
  buttonHref?: string;
  imageSrc?: string;
};

export function GetInTouchCTA({
  title = "Want to get in touch with us?",
  body = "We're all about offering supportive, expert advice every step of the way, making your property buying experience as seamless and enjoyable as possible.",
  buttonLabel = "Contact our Agent",
  buttonHref = "/contact",
  imageSrc = "/images/get-in.png",
}: Props) {
  return (
    <section className="w-full bg-brand-navy">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:aspect-[1920/720]">
        <div className="flex items-center px-[clamp(24px,5vw,96px)] py-[clamp(36px,3.5vw,64px)] lg:py-0">
          <div className="w-full max-w-[380px]">
            <h2 className="font-display font-bold text-white text-[clamp(1.75rem,2.6vw,3rem)] leading-[1.1]">
              {title}
            </h2>
            <p className="mt-[clamp(20px,1.6vw,28px)] font-display font-normal text-white/90 text-[12px] sm:text-[13px] leading-[1.55] tracking-[0.01em]">
              {body}
            </p>
            <div className="mt-[clamp(24px,1.8vw,36px)]">
              <Button href={buttonHref} variant="outline" size="md">
                {buttonLabel}
              </Button>
            </div>
          </div>
        </div>
        <div className="relative h-[260px] sm:h-[360px] lg:h-full overflow-hidden">
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
