import Image from "next/image";
import { Button } from "../ui/Button";

export function SellWithUs() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Mobile (<md): stacked image-on-top, navy text below */}
      <div className="md:hidden">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9]">
          <Image
            src="/images/handshake-house.png"
            alt="Handshake closing a property deal in front of a house"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="relative w-full">
          <Image
            src="/images/bg.png"
            alt=""
            fill
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#001F4D1F] pointer-events-none" />
          <div className="relative z-10 container-page py-[clamp(40px,9vw,64px)]">
            <h2 className="reveal font-display font-bold text-white text-[1.3rem] leading-[1.1]">
              Want to Sell with us?
            </h2>
            <p className="mt-[clamp(12px,3vw,20px)] font-display font-light text-white text-[16px] leading-[1.3]">
              We&rsquo;re always looking for the next premier property to represent
            </p>
            <p className="mt-[clamp(16px,4vw,24px)] max-w-[560px] font-display font-medium text-white/90 text-[clamp(13px,2vw,15px)] leading-[1.55] tracking-[0.02em]">
              Let&rsquo;s partner together to showcase your property to the heart of
              Western Sydney and ensure your next move is a success.
            </p>
            <div className="mt-[clamp(24px,5vw,32px)]">
              <Button href="/contact" variant="white" size="lg">
                Contact our Agent
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* md+ : 50/50 split (navy text | handshake image) */}
      <div className="relative hidden md:block w-full overflow-x-hidden">
        <Image
          src="/images/bg.png"
          alt=""
          fill
          quality={90}
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#001F4D1F] pointer-events-none" />

        {/* Image — right 50% */}
        <div className="absolute inset-y-0 right-0 w-1/2">
          <Image
            src="/images/handshake-house.png"
            alt="Handshake closing a property deal in front of a house"
            fill
            sizes="50vw"
            className="object-cover object-center"
          />
        </div>

        {/* Text — left 50% */}
        <div className="relative z-10 container-page">
          <div className="flex items-center min-h-[clamp(360px,42vw,560px)] py-[clamp(28px,3vw,48px)] pr-[clamp(16px,2vw,32px)]">
            <div className="w-[calc(50%-clamp(8px,1vw,16px))] max-w-[600px]">
              <h2 className="reveal font-display font-bold text-white text-[clamp(1.5rem,3.2vw,2.625rem)] leading-[1.1]">
                Want to Sell with us?
                <br />
                We&rsquo;re always looking for the
                <br />
                next premier property to represent
              </h2>
              <p className="mt-[clamp(12px,1.6vw,24px)] max-w-[460px] font-display text-white text-[clamp(12px,1.2vw,15px)] font-medium leading-[1.55] tracking-[0.02em]">
                Let&rsquo;s partner together to showcase your property to the heart of
                Western Sydney and ensure your next move is a success.
              </p>
              <div className="mt-[clamp(16px,1.8vw,28px)]">
                <Button href="/contact" variant="white" size="md">
                  Contact our Agent
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
