import Image from "next/image";
import Link from "next/link";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { AboutHero } from "../_components/AboutHero";
import { AboutContent } from "../_components/AboutContent";

export const metadata = {
  title: "About Us | Blue Ribbon Real Estate",
  description: "Your Home, Our Priority. Meet the Blue Ribbon Realtors team.",
};

const mobileStats = [
  { value: "500+", label: "Properties Sold" },
  { value: "15+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        {/* Mobile layout */}
        <div className="sm:hidden">
          <section className="relative w-full overflow-hidden">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/about-us-images/image 5.png"
                alt="Blue Ribbon team"
                fill
                priority
                sizes="(max-width: 639px) 100vw, 1px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-brand-navy/75" />
              <div className="absolute inset-0 flex flex-col justify-center px-[24px]">
                <h1 className="font-display font-bold text-white text-[34px] leading-[1.05]">
                  About
                  <br />
                  Blue Ribbon
                </h1>
                <p className="mt-[16px] font-display text-white/85 text-[13px] leading-[1.55] max-w-[320px]">
                  With a legacy of trust and excellence, Blue Ribbon Real Estate has been
                  connecting families with their dream homes across Western Sydney.
                </p>
              </div>
            </div>
          </section>

          <section className="container-page py-[20px]">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px]">
              <Image
                src="/about-us-images/image 6.png"
                alt="Blue Ribbon team meeting"
                fill
                sizes="(max-width: 639px) 100vw, 1px"
                className="object-cover"
              />
            </div>
          </section>

          <section className="container-page pb-[24px]">
            <h2 className="font-display font-bold text-brand-bunker text-[22px] leading-[1.2]">
              Our Story
            </h2>
            <p className="mt-[14px] font-display text-[13px] leading-[1.65] text-brand-bunker/80">
              Founded with a vision to redefine real estate in Western Sydney, our team
              brings together decades of local expertise, market knowledge, and genuine
              passion for helping people find their perfect home. Every property we
              represent receives our full dedication and attention.
            </p>
          </section>

          <section className="container-page pb-[28px]">
            <div className="rounded-[14px] bg-[#F1F2F4] p-[20px]">
              <div className="grid grid-cols-3 gap-[8px]">
                {mobileStats.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="font-display text-[26px] font-bold leading-none text-brand-navy">
                      {s.value}
                    </p>
                    <p className="mt-[8px] font-display text-[11px] text-brand-bunker/70 leading-[1.3]">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full bg-white">
            <div className="w-full">
              <div className="relative isolate overflow-hidden px-[28px] py-[36px]">
                <Image
                  src="/images/handshake-house.png"
                  alt=""
                  fill
                  sizes="(max-width: 639px) 100vw, 1px"
                  className="absolute inset-0 z-0 object-cover"
                />
                <div className="absolute inset-0 z-10 bg-brand-navy/85" />
                <div className="relative z-20">
                  <h2 className="font-display font-bold text-white text-[28px] leading-[1.1]">
                    Want to get in touch
                    <br />
                    with us?
                  </h2>
                  <p className="mt-[18px] font-display font-light text-white text-[15px] leading-[1.5]">
                    We&rsquo;re all about offering supportive, expert advice every step of
                    the way.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-[24px] inline-flex h-[48px] items-center justify-center rounded-[24px] border border-white px-[28px] font-display text-[14px] font-medium text-white transition hover:bg-white/10"
                  >
                    Contact our Agent
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Desktop layout (unchanged) */}
        <div className="hidden sm:block">
          <div className="container-page pt-[16px] pb-[16px]">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
          </div>
          <AboutHero />
          <AboutContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}
