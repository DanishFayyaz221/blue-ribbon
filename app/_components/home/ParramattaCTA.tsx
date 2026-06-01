import Image from "next/image";
import { Button } from "../ui/Button";

export function ParramattaCTA() {
  return (
    <>
      {/* Mobile / tablet (<lg) — navy text section */}
      <section className="relative w-full overflow-hidden lg:hidden">
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

        {/* Text — left aligned */}
        <div className="relative z-10 container-page py-[clamp(40px,9vw,72px)]">
          <h2 className="font-display font-bold text-brand-citrine text-[clamp(1.75rem,5.5vw,2.5rem)] leading-[1.15]">
            Set within the dynamic
            <br />
            urban heart of
            <br />
            Parramatta
          </h2>
          <p className="mt-[clamp(16px,4vw,24px)] max-w-[560px] font-display text-brand-citrine text-[clamp(14px,2vw,16px)] font-medium leading-[1.6] tracking-[0.02em]">
            The Riverwalk Residences by Blueribbon offer a curated collection of
            sophisticated urban homes, defined by design excellence and unparalleled
            connection. Embrace the convenience of riverside living and the pulse of a
            thriving community.
          </p>
          <div className="mt-[clamp(24px,5vw,32px)]">
            <Button href="/contact" variant="outline" size="lg">
              Contact our Agent
            </Button>
          </div>
        </div>
      </section>

      {/* Desktop (lg+) — true 50/50 (navy bg | image) */}
      <section className="relative hidden lg:block w-full overflow-x-hidden">
        {/* Navy fabric — poore section ka background */}
        <Image
          src="/images/bg.png"
          alt=""
          fill
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Navy overlay (#001F4D @ ~12%) — sirf fabric par, house image ke neeche */}
        <div className="absolute inset-0 bg-[#001F4D1F] pointer-events-none" />

        {/* House image — right 50%, poora fill */}
        <div className="absolute inset-y-0 right-0 w-1/2">
          <Image
            src="/images/dynamic.png"
            alt="Riverwalk Residences in Parramatta"
            fill
            sizes="50vw"
            className="object-cover object-center"
          />
        </div>

        {/* Text — left 50%, page container ke sath aligned */}
        <div className="relative z-10 container-page">
          <div className="flex items-center lg:min-h-[440px] py-[clamp(28px,2.4vw,40px)]">
            {/* 👇 max-w 460 -> 600 (bara heading fit ho) */}
            <div className="w-full max-w-[600px]">
              {/* 👇 heading size barha: 32px -> 42px range */}
              <h2 className="font-display font-bold text-brand-citrine text-[clamp(2rem,2.4vw,2.625rem)] leading-[1.1]">
                Set within the dynamic
                <br />
                urban heart of
                <br />
                Parramatta
              </h2>
              {/* 👇 paragraph ko apni max-w di taake pehle jaisa rahe */}
              <p className="mt-[clamp(16px,1.6vw,24px)] max-w-[460px] font-display text-brand-citrine text-[clamp(13px,0.85vw,15px)] font-medium leading-[1.55] tracking-[0.02em]">
                The Riverwalk Residences by Blueribbon offer a curated collection of
                sophisticated urban homes, defined by design excellence and unparalleled
                connection. Embrace the convenience of riverside living and the pulse of a
                thriving community.
              </p>
              <div className="mt-[clamp(20px,1.8vw,28px)]">
                <Button href="/contact" variant="outline" size="lg">
                  Contact our Agent
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}