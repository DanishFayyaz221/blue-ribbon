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
            <form className="flex flex-col gap-[10px]">
              <input
                type="text"
                placeholder="Full Name"
                className="h-[44px] w-full rounded-[22px] bg-[#F1F2F4] px-[18px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="h-[44px] w-full rounded-[22px] bg-[#F1F2F4] px-[18px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="h-[44px] w-full rounded-[22px] bg-[#F1F2F4] px-[18px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full resize-none rounded-[18px] bg-[#F1F2F4] px-[18px] py-[12px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/50 focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
              />
              <button
                type="submit"
                className="mt-[4px] h-[44px] w-full rounded-[22px] bg-brand-navy font-display text-[13px] font-semibold text-white transition hover:bg-brand-navy-deep"
              >
                Send Message
              </button>
            </form>
          </section>

          <div className="h-[72px] bg-[#EDEFF2]" />

          <section className="container-page py-[24px]">
            <h2 className="font-display font-bold text-brand-bunker text-[20px]">Our Office</h2>
            <div className="mt-[12px] flex flex-col gap-[5px] font-display text-[12.5px] text-brand-bunker/85">
              <p>11/76-80 Station Street</p>
              <p>Wentworthville, NSW 2145</p>
              <a href="mailto:sales@blueribbonre.com.au" className="hover:underline">
                sales@blueribbonre.com.au
              </a>
              <a href="tel:1300579093" className="hover:underline">
                1300 579 093
              </a>
            </div>
          </section>
        </div>

        {/* Desktop layout (unchanged) */}
        <div className="hidden sm:block container-page pt-[16px] pb-[16px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
        </div>

        <section className="hidden sm:block container-page">
          <div className="relative aspect-[1771/780] max-h-[560px] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)]">
            <Image
              src="/contact/contact-us.png"
              alt="Visit our office"
              fill
              priority
              sizes="(max-width: 639px) 1px, 100vw"
              className="object-cover"
            />
          </div>
        </section>

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
                <p>11/76-80 Station Street, Wentworthville, NSW 2145</p>
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
          <div className="relative aspect-[16/6] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)] bg-brand-soft-2">
            <iframe
              src="https://www.google.com/maps?q=11%2F76-80+Station+Street%2C+Wentworthville+NSW+2145&z=16&output=embed"
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