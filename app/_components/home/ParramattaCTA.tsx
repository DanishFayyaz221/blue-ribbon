import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/Button";

export function ParramattaCTA() {
  return (
    <>
      {/* Mobile (light card) */}
      <section className="w-full bg-[#F5F5F7] py-[36px] lg:hidden">
        <div className="container-page">
          <div className="relative aspect-[16/12] w-full overflow-hidden rounded-[16px]">
            <Image
              src="/images/dynamic.png"
              alt="Riverwalk Residences in Parramatta"
              fill
              sizes="(max-width: 1023px) 100vw, 1px"
              className="object-cover"
            />
          </div>
          <h2 className="mt-[20px] font-display font-bold text-brand-bunker text-[20px] leading-[1.25]">
            Set within the dynamic
            <br />
            urban heart of Parramatta
          </h2>
          <p className="mt-[16px] font-display text-[13px] leading-[1.6] text-brand-bunker/70">
            The Riverwalk Residences by Blueribbon offer a curated collection of
            sophisticated urban homes.
          </p>
          <Link
            href="/contact"
            className="mt-[20px] inline-flex h-[44px] items-center justify-center rounded-[16px] bg-brand-navy px-[24px] font-display text-[13px] font-medium text-white transition hover:bg-brand-navy-deep"
          >
            Contact an Agent
          </Link>
        </div>
      </section>

      {/* Desktop / tablet — true 50/50 (navy bg | image) */}
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
            <div className="w-full max-w-[460px]">
              <h2 className="font-display font-bold text-brand-citrine text-[clamp(1.5rem,1.9vw,2rem)] leading-[1.15]">
                Set within the dynamic
                <br />
                urban heart of
                <br />
                Parramatta
              </h2>
              <p className="mt-[clamp(16px,1.6vw,24px)] font-display text-brand-citrine text-[clamp(13px,0.85vw,15px)] font-medium leading-[1.55] tracking-[0.02em]">
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