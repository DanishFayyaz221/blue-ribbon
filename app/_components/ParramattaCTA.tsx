import Image from "next/image";

export function ParramattaCTA() {
  return (
    <section className="grid w-full md:grid-cols-2">
      <div className="flex flex-col justify-center gap-6 bg-brand-navy p-10 text-white md:p-16">
        <h2 className="font-display text-[56.533px] font-bold leading-tight tracking-tight">
          Set within the dynamic urban heart of Parramatta
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-white/70">
          The Riverwalk Residences by Blueribbon offer a curated collection of
          sophisticated urban homes, defined by design excellence and
          unparalleled connection. Embrace the convenience of riverside living
          and the pulse of a thriving community.
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
          src="/images/dynamic.png"
          alt="Riverwalk Residences in Parramatta"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
