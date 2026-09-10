import { LineReveal } from "../ui/LineReveal";

/**
 * "Visit Our Office" band on the Contact page, directly above the enquiry
 * form: a centred Testimonials pill, heading, two paragraphs, then the
 * office's address, email and phone as bold underlined links. Same pill,
 * heading and paragraph treatment as the About page's "Know Us better!" band
 * so the two read as one system.
 */
export function VisitOurOffice() {
  const linkClass = "underline underline-offset-[3px] transition hover:text-brand-navy";
  return (
    <section className="w-full bg-white pt-[clamp(44px,6vw,90px)]">
      <div className="container-page flex flex-col items-center text-center">
        <span className="rounded-[8px] bg-brand-navy px-[16px] py-[7px] font-display text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
          Testimonials
        </span>
        <LineReveal
          as="h2"
          className="mt-[clamp(18px,1.8vw,32px)] font-display font-bold text-brand-bunker text-[clamp(1.5rem,3.1vw,2.9rem)] leading-[1.15]"
        >
          Visit Our Office
        </LineReveal>
        <LineReveal
          as="p"
          className="mt-[clamp(18px,2vw,34px)] max-w-[960px] font-display text-[clamp(13px,1.05vw,16px)] leading-[1.6] text-brand-bunker"
        >
          At Blue Ribbon, Our doors are open to a community of vibrant, dedicated
          experts who are focused on delivering premium outcomes and tailored
          property advice for every visitor. Combining a welcoming atmosphere with
          professional standards, our office serves as a hub where local market
          knowledge meets world-class service. By visiting our team in person, you
          will gain access to a higher level of property insight and a personalized
          experience built to enhance your real estate journey.
        </LineReveal>
        <LineReveal
          as="p"
          className="mt-[clamp(16px,1.6vw,26px)] max-w-[960px] font-display text-[clamp(13px,1.05vw,16px)] leading-[1.6] text-brand-bunker"
        >
          Step inside and discover why your property future is secure in our
          professional hands.
        </LineReveal>
        <address className="mt-[clamp(24px,3.6vw,52px)] flex flex-col items-center gap-[8px] font-display text-[clamp(13px,1.05vw,16px)] font-bold not-italic leading-[1.4] text-brand-bunker">
          <a
            href="https://maps.google.com/?q=Blue+Ribbon+Real+Estate,+11/76-80+Station+St,+Wentworthville+NSW+2145"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            11/76-80 Station Street, Wentworthville, NSW 2145
          </a>
          <a href="mailto:sales@blueribbonre.com.au" className={linkClass}>
            sales@blueribbonre.com.au
          </a>
          <a href="tel:1300579093" className={linkClass}>
            1300 579 093
          </a>
        </address>
      </div>
    </section>
  );
}
