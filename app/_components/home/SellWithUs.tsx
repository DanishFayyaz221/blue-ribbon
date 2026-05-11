import Image from "next/image";
import { Button } from "../ui/Button";

export function SellWithUs() {
  return (
    <section className="w-full bg-brand-navy">
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
  );
}
