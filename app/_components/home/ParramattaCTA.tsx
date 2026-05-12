import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/Button";

export function ParramattaCTA() {
  return (
    <>
      {/* Mobile (light card) */}
      <section className="w-full bg-[#F5F5F7] py-[40px] lg:hidden">
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
          <h2 className="mt-[24px] font-display font-bold text-brand-bunker text-[22px] leading-[1.25]">
            Set within the dynamic
            <br />
            urban heart of Parramatta
          </h2>
          <p className="mt-[18px] font-display text-[14px] leading-[1.6] text-brand-bunker/70">
            The Riverwalk Residences by Blueribbon offer a curated collection of
            sophisticated urban homes.
          </p>
          <Link
            href="/contact"
            className="mt-[24px] inline-flex h-[48px] items-center justify-center rounded-[16px] bg-brand-navy px-[28px] font-display text-[14px] font-medium text-white transition hover:bg-brand-navy-deep"
          >
            Contact an Agent
          </Link>
        </div>
      </section>

      {/* Desktop / tablet (existing dark navy split layout) */}
      <section className="hidden lg:block w-full bg-brand-navy">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center px-[clamp(20px,3.9vw,75px)] py-[clamp(48px,4vw,72px)]">
            <div className="w-full max-w-[760px]">
              <h2 className="font-display font-bold text-brand-citrine text-[clamp(1.75rem,2.95vw,3.55rem)] leading-[1.1]">
                Set within the dynamic urban heart of Parramatta
              </h2>
              <p className="mt-[clamp(28px,3.5vw,72px)] font-display text-brand-citrine text-[clamp(15px,1.05vw,20px)] font-medium leading-[1.4] tracking-[0.02em]">
                The Riverwalk Residences by Blueribbon offer a curated collection of
                sophisticated urban homes, defined by design excellence and unparalleled
                connection. Embrace the convenience of riverside living and the pulse of a
                thriving community.
              </p>
              <div className="mt-[clamp(24px,2.2vw,36px)]">
                <Button href="/contact" variant="outline" size="lg">
                  Contact our Agent
                </Button>
              </div>
            </div>
          </div>
          <div className="relative h-[260px] sm:h-[360px] lg:h-auto lg:min-h-[480px] overflow-hidden">
            <Image
              src="/images/dynamic.png"
              alt="Riverwalk Residences in Parramatta"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
