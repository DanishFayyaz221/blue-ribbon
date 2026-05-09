import Image from "next/image";

export function SellWithUs() {
  return (
    <section className="grid w-full md:grid-cols-2">
      <div className="flex flex-col justify-center gap-5 bg-brand-navy p-10 text-white md:px-16 md:py-24">
        <h2 className="font-display text-[28px] font-bold leading-tight tracking-tight">
          Want to Sell with us?
        </h2>
        <p className="font-display text-[40px] font-normal leading-[1.15] tracking-tight">
          We&apos;re always looking for the next premier property to represent
        </p>
        <p className="max-w-md text-sm leading-relaxed text-white/70">
          Let&apos;s partner together to showcase your property to the heart of
          Western Sydney and ensure your next move is a success.
        </p>
        <a
          href="#contact"
          className="inline-flex w-fit items-center rounded-full border border-white/40 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Contact our Agent
        </a>
      </div>
      <div className="relative aspect-[4/3] md:aspect-auto">
        <Image
          src="/images/handshake-house.png"
          alt="Handshake closing a property deal in front of a house"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
