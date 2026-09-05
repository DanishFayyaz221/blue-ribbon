import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/Button";
import { CardGallery } from "../property/CardGallery";
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
          <div className="parramatta-featured group relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden">
            <CardGallery
              images={featured.gallery.length > 0 ? featured.gallery : [featured.image]}
              alt={featured.address}
              sizes="100vw"
            />
            <span className="absolute left-[16px] top-[16px] z-30 rounded-[8px] bg-brand-navy/90 px-[12px] py-[6px] font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-white pointer-events-none">
              Featured Property
            </span>
            <span className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center opacity-0 translate-y-[10px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0 group-active:opacity-100 group-active:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
              <span className="pointer-events-auto inline-flex h-[56px] cursor-pointer items-center justify-center gap-[8px] rounded-tl-[64px] rounded-bl-none rounded-tr-[28px] rounded-br-[28px] bg-white px-[40px] pb-[4px] font-display text-[17px] font-medium text-brand-bunker shadow-[0_10px_28px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
                View Property
                <span aria-hidden className="inline-flex h-[14px] w-[14px] shrink-0">
                  <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="9 7 17 7 17 15" />
                  </svg>
                </span>
              </span>
            </span>
            <Link
              href={featured.href}
              aria-label={`View property: ${featured.address}`}
              className="absolute inset-0 z-10"
            />
          </div>
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
          <div className="parramatta-featured group absolute inset-y-0 right-0 z-20 w-1/2 overflow-hidden">
            <CardGallery
              images={featured.gallery.length > 0 ? featured.gallery : [featured.image]}
              alt={featured.address}
              sizes="50vw"
            />
            <span className="pointer-events-none absolute left-[clamp(16px,1.6vw,28px)] top-[clamp(16px,1.6vw,28px)] z-30 rounded-[8px] bg-brand-navy/90 px-[14px] py-[7px] font-display text-[clamp(11px,0.8vw,13px)] font-semibold uppercase tracking-[0.08em] text-white">
              Featured Property
            </span>
            <span className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center opacity-0 translate-y-[10px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0">
              <span className="pointer-events-auto inline-flex h-[68px] cursor-pointer items-center justify-center gap-[10px] rounded-tl-[80px] rounded-bl-none rounded-tr-[34px] rounded-br-[34px] bg-white px-[52px] pb-[6px] font-display text-[22px] font-medium text-brand-bunker shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
                View Property
                <span aria-hidden className="inline-flex h-[18px] w-[18px] shrink-0">
                  <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="9 7 17 7 17 15" />
                  </svg>
                </span>
              </span>
            </span>
            <Link
              href={featured.href}
              aria-label={`View property: ${featured.address}`}
              className="absolute inset-0 z-10"
            />
          </div>
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
