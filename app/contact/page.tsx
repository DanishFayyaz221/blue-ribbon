import Image from "next/image";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { ContactForm } from "../_components/contact/ContactForm";

export const metadata = {
  title: "Contact Us | Blue Ribbon Real Estate",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        {/* Mobile layout */}
        <div className="sm:hidden">
          <section className="relative w-full overflow-hidden">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/handshake-house.png"
                alt=""
                fill
                priority
                sizes="(max-width: 639px) 100vw, 1px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-brand-navy/80" />
              <div className="absolute inset-0 flex flex-col justify-center px-[22px]">
                <h1 className="font-display font-bold text-white text-[25px] leading-[1.15]">
                  Want to get in
                  <br />
                  touch with us?
                </h1>
                <p className="mt-[12px] font-display text-white/85 text-[12.5px] leading-[1.55] max-w-[320px]">
                  We&rsquo;re all about offering unparalleled service, expert advice, every
                  step of the way.
                </p>
              </div>
            </div>
          </section>

          <section className="container-page py-[22px]">
            <ContactForm variant="pill" />
          </section>

          <div className="h-[72px] bg-[#EDEFF2]" />

          <section className="container-page py-[24px]">
            <h2 className="font-display font-bold text-brand-bunker text-[20px]">Our Office</h2>
            <div className="mt-[12px] flex flex-col gap-[5px] font-display text-[12.5px] text-brand-bunker/85">
              <a
                href="https://maps.google.com/?q=Blue+Ribbon+Real+Estate,+11/76-80+Station+St,+Wentworthville+NSW+2145"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                11/76-80 Station Street, Wentworthville, NSW 2145
              </a>
              <a href="mailto:sales@blueribbonre.com.au" className="hover:underline">
                sales@blueribbonre.com.au
              </a>
              <a href="tel:1300579093" className="hover:underline">
                1300 579 093
              </a>
            </div>
            <div className="mt-[16px] flex flex-col items-center gap-[3px] text-center">
              <p className="font-display text-[16px] font-bold text-brand-navy leading-[1.2]">
                Blue Ribbon Real Estate
              </p>
              <a
                href="https://maps.google.com/?q=Blue+Ribbon+Real+Estate,+11/76-80+Station+St,+Wentworthville+NSW+2145"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-[11px] font-semibold text-blue-600 hover:underline"
              >
                Get directions ↗
              </a>
            </div>
            <div className="relative mt-[10px] overflow-hidden rounded-[12px] bg-brand-soft-2" style={{aspectRatio:"4/3"}}>
              <iframe
                src="https://maps.google.com/maps?q=Blue+Ribbon+Real+Estate,+11%2F76-80+Station+St,+Wentworthville+NSW+2145&z=16&output=embed"
                title="Blue Ribbon Real Estate office location"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </section>
        </div>

        {/* Desktop layout (unchanged) */}
        <div className="hidden sm:block container-page pt-[16px] pb-[16px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
        </div>

        <section className="hidden sm:block container-page mt-[clamp(38px,3.15vw,76px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(28px,2.7vw,56px)] items-start">
            <div className="relative aspect-[860/520] w-full overflow-hidden rounded-[clamp(6px,0.5vw,10px)]">
              <Image
                src="/contact/contact-1.png"
                alt="Office building"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-display font-bold text-brand-navy text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]">
                Visit Our Office
              </h2>
              <p className="mt-[clamp(14px,1.35vw,25px)] font-display text-[12.5px] sm:text-[13.5px] font-medium leading-[1.7] text-brand-bunker">
                Our team and clients are committed to creating relationships beyond just
                the property. By delivering personalized practical solutions, with a smile,
                we cultivate a high level of trust and lifelong connections — your trusted
                advisor, available wherever and whenever you choose. From the very first
                hello to the very last, we go above and beyond to make every connection a
                memorable experience built on a personalised touch, professional intuition
                and consistent excellence in everything that we do.
              </p>
              <div className="mt-[22px] flex flex-col gap-[5px] font-display text-[12.5px] sm:text-[13.5px] font-bold text-[#000000]">
                <a
                  href="https://maps.google.com/?q=Blue+Ribbon+Real+Estate,+11/76-80+Station+St,+Wentworthville+NSW+2145"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  11/76-80 Station Street, Wentworthville, NSW 2145
                </a>
                <a href="mailto:sales@blueribbonre.com.au" className="font-bold hover:underline">
                  sales@blueribbonre.com.au
                </a>
                <a href="tel:1300579093" className="font-bold hover:underline">
                  1300 579 093
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="hidden sm:block container-page mt-[clamp(38px,3.15vw,64px)]">
          <div className="mb-[16px] flex flex-col items-center gap-[4px] text-center">
            <p className="font-display text-[clamp(18px,1.6vw,26px)] font-bold text-brand-navy leading-[1.2]">
              Blue Ribbon Real Estate
            </p>
            <p className="font-display text-[clamp(12px,0.9vw,15px)] font-medium text-brand-bunker/70">
              11/76-80 Station Street, Wentworthville NSW 2145
            </p>
            <a
              href="https://maps.google.com/?q=Blue+Ribbon+Real+Estate,+11/76-80+Station+St,+Wentworthville+NSW+2145"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[clamp(11px,0.8vw,13px)] font-semibold text-blue-600 hover:underline"
            >
              Get directions ↗
            </a>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-[clamp(8px,1vw,16px)] bg-brand-soft-2">
            <iframe
              src="https://maps.google.com/maps?q=Blue+Ribbon+Real+Estate,+11%2F76-80+Station+St,+Wentworthville+NSW+2145&z=17&output=embed&iwloc=near"
              title="Blue Ribbon Real Estate office location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </section>

        <section className="hidden sm:block container-page mt-[clamp(38px,3.15vw,76px)] mb-[clamp(44px,4vw,76px)]">
          <h2 className="text-center font-display font-bold text-brand-bunker text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]">
            Get in Touch
          </h2>
          <div className="mt-[clamp(24px,2.25vw,42px)] mx-auto w-full max-w-[680px]">
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}