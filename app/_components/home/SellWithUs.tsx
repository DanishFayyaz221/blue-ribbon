import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/Button";

export function SellWithUs() {
  return (
    <>
      {/* Mobile: single card with image background + dark overlay */}
      <section className="lg:hidden w-full bg-white">
        <div className="w-full">
          <div className="relative isolate overflow-hidden px-[28px] py-[36px]">
            <Image
              src="/images/handshake-house.png"
              alt=""
              fill
              sizes="100vw"
              className="absolute inset-0 z-0 object-cover"
            />
            <div className="absolute inset-0 z-10 bg-brand-navy/85" />
            <div className="relative z-20">
              <h2 className="font-display font-bold text-white text-[28px] leading-[1.1]">
                Want to Sell
                <br />
                with us?
              </h2>
              <p className="mt-[18px] font-display font-light text-white text-[18px] leading-[1.3]">
                We&rsquo;re always looking for the next premier property to represent
              </p>
              <p className="mt-[24px] font-display font-medium text-white/85 text-[13px] leading-[1.55]">
                Let&rsquo;s partner together to showcase your property to the heart of
                Western Sydney.
              </p>
              <Link
                href="/contact"
                className="mt-[28px] inline-flex h-[48px] items-center justify-center rounded-[24px] border border-white px-[28px] font-display text-[14px] font-medium text-white transition hover:bg-white/10"
              >
                Contact our Agent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tablet / desktop: original split layout */}
      <section className="hidden lg:block w-full bg-brand-navy">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center px-[clamp(20px,3.9vw,75px)] py-[clamp(48px,4vw,72px)]">
            <div className="w-full max-w-[760px]">
              <h2 className="font-display font-bold text-white text-[clamp(2rem,3.1vw,3.75rem)] leading-[1.07]">
                Want to Sell with us?
              </h2>
              <p className="mt-[12px] font-display font-light text-white text-[clamp(1.5rem,3vw,3.65rem)] leading-[1.07]">
                We&rsquo;re always looking for the next premier property to represent
              </p>
              <p className="mt-[clamp(28px,3.5vw,72px)] font-display font-medium text-white text-[clamp(15px,1.05vw,20px)] leading-[1.4] tracking-[0.02em]">
                Let&rsquo;s partner together to showcase your property to the heart of
                Western Sydney and ensure your next move is a success.
              </p>
              <div className="mt-[clamp(24px,2.2vw,36px)]">
                <Button href="/contact" variant="outline" size="lg">
                  Contact our Agent
                </Button>
              </div>
            </div>
          </div>
          <div className="relative h-[260px] sm:h-[360px] lg:h-auto lg:min-h-[560px] overflow-hidden">
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
