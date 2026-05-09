import Image from "next/image";

export function SellWithUs() {
  return (
    <section className="relative flex h-[644px] w-[1920px] bg-brand-navy">
      <div className="relative h-full w-[960px]">
        <div className="absolute left-[149.75px] top-[64px] w-[810.667px]">
          <h2 className="whitespace-nowrap font-display text-[59.733px] font-bold leading-[64px] text-white">
            Want to Sell with us?
          </h2>
          <p className="mt-[12px] w-[740px] font-display text-[58.267px] font-light leading-[64px] text-white">
            We&rsquo;re always looking for the next premier property to represent
          </p>
          <p className="mt-[80px] w-[648px] font-display text-[19.333px] font-medium leading-[26.667px] tracking-[0.4267px] text-white">
            Let&rsquo;s partner together to showcase your property to the heart
            of Western Sydney and ensure your next move is a success.
          </p>
          <a
            href="#contact"
            className="mt-[36px] flex h-[72px] w-[220px] items-center justify-center rounded-[24px] border border-white font-display text-[19.067px] font-medium text-white transition hover:bg-white/10"
          >
            Contact our Agent
          </a>
        </div>
      </div>
      <div className="relative h-full w-[960px] overflow-hidden">
        <Image
          src="/images/handshake-house.png"
          alt="Handshake closing a property deal in front of a house"
          fill
          sizes="960px"
          className="object-cover"
        />
      </div>
    </section>
  );
}
