import Image from "next/image";

export function ParramattaCTA() {
  return (
    <section className="relative flex h-[580px] w-[1920px] bg-brand-navy">
      <div className="relative h-full w-[960px]">
        <div className="absolute left-[74.67px] top-[64px] w-[810.667px]">
          <h2 className="w-[689px] font-display text-[56.533px] font-bold leading-[64px] text-[#fbf8e2]">
            Set within the dynamic urban heart of Parramatta
          </h2>
          <p className="mt-[80px] w-[758px] font-display text-[20px] font-medium leading-[26.667px] tracking-[0.4267px] text-[#fbf8e2]">
            The Riverwalk Residences by Blueribbon offer a curated collection of
            sophisticated urban homes, defined by design excellence and
            unparalleled connection. Embrace the convenience of riverside
            living and the pulse of a thriving community.
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
          src="/images/dynamic.png"
          alt="Riverwalk Residences in Parramatta"
          fill
          sizes="960px"
          className="object-cover"
        />
      </div>
    </section>
  );
}
