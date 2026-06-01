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

      {/* Desktop / tablet (existing dark navy split layout) */}
      <section className="hidden lg:block w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/bg.png')" }}>
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[clamp(24px,2.5vw,48px)]">
            <div className="flex items-center py-[clamp(32px,2.8vw,48px)]">
              <div className="w-full max-w-[760px]">
                <h2 className="font-display font-bold text-brand-citrine text-[clamp(1.3rem,2vw,2.25rem)] leading-[1.1]">
                  Set within the dynamic urban heart of Parramatta
                </h2>
                <p className="mt-[clamp(24px,3.15vw,64px)] font-display text-brand-citrine text-[clamp(14px,0.95vw,18px)] font-medium leading-[1.4] tracking-[0.02em]">
                  The Riverwalk Residences by Blueribbon offer a curated collection of
                  sophisticated urban homes, defined by design excellence and unparalleled
                  connection. Embrace the convenience of riverside living and the pulse of a
                  thriving community.
                </p>
                <div className="mt-[clamp(20px,2vw,32px)]">
                  <Button href="/contact" variant="outline" size="lg">
                    Contact our Agent
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative h-[240px] sm:h-[325px] lg:h-auto lg:min-h-[520px] overflow-hidden mr-[calc(50%-50vw)]">
              <Image
                src="/images/dynamic.png"
                alt="Riverwalk Residences in Parramatta"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
