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
        <div className="container-page pt-[16px] pb-[16px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
        </div>

        <section className="container-page">
          <div className="relative aspect-[1771/898] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)]">
            <Image
              src="/contact/contact-us.png"
              alt="Visit our office"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section className="container-page mt-[clamp(48px,4vw,96px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(32px,3vw,64px)] items-start">
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
              <h2 className="font-display font-bold text-brand-navy text-[clamp(1.5rem,2.1vw,2.5rem)] leading-[1.15]">
                Visit Our Office
              </h2>
              <p className="mt-[clamp(16px,1.5vw,28px)] font-display text-[13px] sm:text-[14px] font-medium leading-[1.7] text-brand-bunker">
                Our team and clients are committed to creating relationships beyond just
                the property. By delivering personalized practical solutions, with a smile,
                we cultivate a high level of trust and lifelong connections — your trusted
                advisor, available wherever and whenever you choose. From the very first
                hello to the very last, we go above and beyond to make every connection a
                memorable experience built on a personalised touch, professional intuition
                and consistent excellence in everything that we do.
              </p>
              <div className="mt-[24px] flex flex-col gap-[6px] font-display text-[13px] sm:text-[14px] font-semibold text-brand-bunker">
                <p>11/76-80 Station Street, Wentworthville, NSW 2145</p>
                <a href="mailto:sales@blueribbonre.com.au" className="font-medium hover:underline">
                  sales@blueribbonre.com.au
                </a>
                <a href="tel:1300579093" className="font-medium hover:underline">
                  1300 579 093
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="container-page mt-[clamp(48px,4vw,80px)]">
          <div className="relative aspect-[16/6] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)] bg-brand-soft-2">
            <Image
              src="/images/find-an-office.png"
              alt="Map"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section className="container-page mt-[clamp(48px,4vw,96px)] mb-[clamp(56px,5vw,96px)]">
          <h2 className="text-center font-display font-bold text-brand-bunker text-[clamp(1.5rem,2.1vw,2.5rem)] leading-[1.15]">
            Get in Touch
          </h2>
          <div className="mt-[clamp(28px,2.5vw,48px)] mx-auto w-full max-w-[680px]">
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
