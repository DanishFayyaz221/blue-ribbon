import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { ContactForm } from "../_components/contact/ContactForm";
import { ContactIntro } from "../_components/contact/ContactIntro";
import { VisitOurOffice } from "../_components/contact/VisitOurOffice";
import { LineReveal } from "../_components/ui/LineReveal";

export const metadata = {
  title: "Contact Us | Blue Ribbon Real Estate",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        {/* One flow for every size: the mobile comp is this same sequence
            stacked — hero and quote, map, Visit Our Office, the form. */}
        {/* Tighter below than the other pages' breadcrumbs: the hero photo
            follows immediately here, and a full 16px under the trail left it
            floating clear of the page above it. */}
        <div className="container-page pt-[16px] pb-[8px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
        </div>

        {/* Office-tower hero with the marquee, then the hospitality quote. */}
        <ContactIntro />

        <section className="container-page mt-[clamp(38px,3.15vw,64px)]">
          {/* Phone: the map alone, edge to edge; the name and directions
              above it are the desktop comp's. */}
          <div className="mb-[16px] hidden flex-col items-center gap-[4px] text-center sm:flex">
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
          <div className="relative -mx-[var(--page-px)] aspect-[5/6] overflow-hidden bg-brand-soft-2 sm:mx-0 sm:aspect-video sm:w-full sm:rounded-[clamp(8px,1vw,16px)]">
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

        {/* "Visit Our Office", directly above the enquiry form, per the comp. */}
        <VisitOurOffice />

        <section className="container-page mt-[clamp(38px,3.15vw,76px)] mb-[clamp(44px,4vw,76px)]">
          <LineReveal
            as="h2"
            className="text-center font-display font-bold text-brand-navy text-[clamp(1.5rem,3.1vw,2.9rem)] leading-[1.15]"
          >
            Get in Touch
          </LineReveal>
          <div className="mt-[clamp(24px,2.25vw,42px)] mx-auto w-full max-w-[680px]">
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}