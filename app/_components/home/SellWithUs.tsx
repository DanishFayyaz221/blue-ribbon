import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/Button";

export function SellWithUs() {
  return (
    <>
      {/* Mobile: single card with image background + dark overlay */}
      <section className="lg:hidden w-full bg-white">
        <div className="w-full">
          <div className="relative isolate overflow-hidden px-[24px] py-[32px]">
            <Image
              src="/images/handshake-house.png"
              alt=""
              fill
              sizes="(max-width: 1023px) 100vw, 1px"
              className="absolute inset-0 z-0 object-cover"
            />
            <div className="absolute inset-0 z-10 bg-brand-navy/85" />
            <div className="relative z-20">
              <h2 className="font-display font-bold text-white text-[25px] leading-[1.1]">
                Want to Sell
                <br />
                with us?
              </h2>
              <p className="mt-[16px] font-display font-light text-white text-[16px] leading-[1.3]">
                We&rsquo;re always looking for the next premier property to represent
              </p>
              <p className="mt-[20px] font-display font-medium text-white/85 text-[12px] leading-[1.55]">
                Let&rsquo;s partner together to showcase your property to the heart of
                Western Sydney.
              </p>
              <Link
                href="/contact"
                className="mt-[24px] inline-flex h-[44px] items-center justify-center rounded-[22px] border border-white px-[24px] font-display text-[13px] font-medium text-white transition hover:bg-white/10"
              >
                Contact our Agent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tablet / desktop: original split layout */}
      <section className="hidden lg:block relative isolate w-full overflow-hidden">
        <Image
          src="/images/bg.png"
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center px-[clamp(18px,3.5vw,68px)] py-[clamp(32px,2.8vw,48px)]">
            <div className="w-full max-w-[760px]">
              <h2 className="font-display font-bold text-white text-[clamp(1.5rem,2.1vw,2.5rem)] leading-[1.07]">
                Want to Sell with us?
              </h2>
              <p className="mt-[10px] font-display font-light text-white text-[clamp(1.1rem,2vw,2.4rem)] leading-[1.07]">
                We&rsquo;re always looking for the next premier property to represent
              </p>
              <p className="mt-[clamp(24px,3.15vw,64px)] font-display font-medium text-white text-[clamp(14px,0.95vw,18px)] leading-[1.4] tracking-[0.02em]">
                Let&rsquo;s partner together to showcase your property to the heart of
                Western Sydney and ensure your next move is a success.
              </p>
              <div className="mt-[clamp(20px,2vw,32px)]">
                <Button href="/contact" variant="outline" size="lg">
                  Contact our Agent
                </Button>
              </div>
            </div>
          </div>
          <div className="relative h-[240px] sm:h-[325px] lg:h-auto lg:min-h-[420px] overflow-hidden">
            <Image
              src="/images/handshake-house.png"
              alt="Handshake closing a property deal in front of a house"
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
