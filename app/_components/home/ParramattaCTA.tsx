import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/Button";
import { getLatestListings } from "@/lib/db/queries";

export async function ParramattaCTA() {
  // Featured property shown on the mobile card. The CTA is mostly static and
  // must survive an unreachable database, so a failed query just falls back to
  // the stock photo instead of dropping the section.
  let featured = null;
  try {
    [featured = null] = await getLatestListings(undefined, 1);
  } catch {}

  return (
    <section className="relative w-full overflow-hidden">
      {/* Mobile (<md): stacked image-on-top */}
      <div className="md:hidden">
        {featured ? (
          <Link
            href={featured.href}
            className="relative block w-full aspect-[4/3] sm:aspect-[16/9]"
          >
            <Image
              src={featured.image}
              alt={featured.address}
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
            <span className="absolute left-[16px] top-[16px] rounded-[8px] bg-brand-navy/90 px-[12px] py-[6px] font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
              Featured Property
            </span>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-[16px] pb-[16px] pt-[48px]">
              <p className="font-display text-[15px] font-semibold leading-[1.3] text-white">
                {featured.address}
              </p>
              <span className="group/btn relative isolate mt-[10px] inline-flex h-[42px] items-center justify-center gap-[8px] overflow-hidden rounded-[16px] bg-white px-[22px] font-display text-[13px] font-medium text-black transition-colors duration-300 before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-brand-navy before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:bg-brand-navy hover:text-white hover:before:translate-y-0">
                <span className="relative z-10 inline-flex items-center gap-[8px]">
                  View Property
                  <span aria-hidden className="relative inline-flex h-[12px] w-[12px] shrink-0 overflow-hidden">
                    <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full transition-transform duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/btn:rotate-45" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="9 7 17 7 17 15" />
                    </svg>
                  </span>
                </span>
              </span>
            </div>
          </Link>
        ) : (
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/9]">
            <Image
              src="/images/dynamic.png"
              alt="Riverwalk Residences in Parramatta"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        )}
        <div className="relative w-full">
          <Image
            src="/images/bg.png"
            alt=""
            fill
            quality={90}
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#001F4D1F] pointer-events-none" />
          <div className="relative z-10 container-page py-[clamp(40px,9vw,64px)]">
            <h2
              suppressHydrationWarning
              className="reveal font-display font-bold text-brand-citrine text-[1.3rem] leading-[1.15]"
            >
              Set within the dynamic
              <br />
              urban heart of
              <br />
              Parramatta
            </h2>
            <p className="mt-[clamp(16px,4vw,24px)] max-w-[560px] font-display text-brand-citrine text-[clamp(14px,2.2vw,16px)] font-medium leading-[1.6] tracking-[0.02em]">
              The Riverwalk Residences by Blueribbon offer a curated collection of
              sophisticated urban homes, defined by design excellence and unparalleled
              connection. Embrace the convenience of riverside living and the pulse of a
              thriving community.
            </p>
            <div className="mt-[clamp(24px,5vw,32px)]">
              <Button href="/contact" variant="white" size="lg">
                Contact our Agent
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* md+ : 50/50 split (navy text | house image) */}
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

        {/* Featured property (falls back to the stock photo) — right 50% */}
        {featured ? (
          <Link href={featured.href} className="group absolute inset-y-0 right-0 z-20 block w-1/2 overflow-hidden">
            <Image
              src={featured.image}
              alt={featured.address}
              fill
              sizes="50vw"
              className="object-cover object-center transition duration-500 group-hover:scale-[1.02]"
            />
            <span className="absolute left-[clamp(16px,1.6vw,28px)] top-[clamp(16px,1.6vw,28px)] rounded-[8px] bg-brand-navy/90 px-[14px] py-[7px] font-display text-[clamp(11px,0.8vw,13px)] font-semibold uppercase tracking-[0.08em] text-white">
              Featured Property
            </span>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-[clamp(16px,1.8vw,32px)] pb-[clamp(16px,1.8vw,28px)] pt-[clamp(48px,5vw,80px)]">
              <p className="font-display text-[clamp(15px,1.2vw,20px)] font-semibold leading-[1.3] text-white">
                {featured.address}
              </p>
              <span className="group/btn relative isolate mt-[clamp(10px,1vw,16px)] inline-flex h-[56px] items-center justify-center gap-[8px] overflow-hidden rounded-[20px] bg-white px-7 font-display text-[15px] font-medium text-black transition-colors duration-300 before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-brand-navy before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:bg-brand-navy hover:text-white hover:before:translate-y-0">
                <span className="relative z-10 inline-flex items-center gap-[8px]">
                  View Property
                  <span aria-hidden className="relative inline-flex h-[14px] w-[14px] shrink-0 overflow-hidden">
                    <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full transition-transform duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/btn:-translate-y-full" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="9 7 17 7 17 15" />
                    </svg>
                    <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full translate-y-full transition-transform duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/btn:translate-y-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="9 7 17 7 17 15" />
                    </svg>
                  </span>
                </span>
              </span>
            </div>
          </Link>
        ) : (
          <div className="absolute inset-y-0 right-0 w-1/2">
            <Image
              src="/images/dynamic.png"
              alt="Riverwalk Residences in Parramatta"
              fill
              sizes="50vw"
              className="object-cover object-center"
            />
          </div>
        )}

        {/* Text — left 50% */}
        <div className="relative z-10 container-page">
          <div className="flex items-center min-h-[clamp(360px,42vw,560px)] py-[clamp(28px,3vw,48px)] pr-[clamp(16px,2vw,32px)]">
            <div className="w-[calc(50%-clamp(8px,1vw,16px))] max-w-[600px]">
              <h2
                suppressHydrationWarning
                className="reveal font-display font-bold text-brand-citrine text-[clamp(1.5rem,3.2vw,2.625rem)] leading-[1.1]"
              >
                Set within the dynamic
                <br />
                urban heart of
                <br />
                Parramatta
              </h2>
              <p className="mt-[clamp(12px,1.6vw,24px)] max-w-[460px] font-display text-brand-citrine text-[clamp(12px,1.2vw,15px)] font-medium leading-[1.55] tracking-[0.02em]">
                The Riverwalk Residences by Blueribbon offer a curated collection of
                sophisticated urban homes, defined by design excellence and unparalleled
                connection. Embrace the convenience of riverside living and the pulse of a
                thriving community.
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
