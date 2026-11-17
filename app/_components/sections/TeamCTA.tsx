import { Button } from "../ui/Button";
import { LineReveal } from "../ui/LineReveal";

/**
 * "Get in touch with our specialised team" call to action: white band, the
 * pill, heading, copy and button in one centred column.
 *
 * The photo that used to sit flush to the right edge is gone, so the two-
 * column grid went with it — a single column with a measure of its own reads
 * the same at every width, and the phone layout (which already centred
 * everything) and the desktop one are now the same thing.
 */
export function TeamCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-[clamp(40px,6.7vw,110px)] pb-[clamp(40px,5vw,80px)]">
      <div className="container-page flex flex-col items-center text-center">
        <span className="inline-flex rounded-[6px] bg-brand-navy px-[16px] py-[7px] font-display text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
          Our Agents
        </span>

        {/* One line at every size: short enough now that the hard break the
            longer heading needed would only strand a word. */}
        <LineReveal
          as="h2"
          className="mt-[16px] font-display font-bold text-brand-bunker text-[26px] leading-[1.2] sm:mt-[clamp(16px,1.4vw,22px)] sm:text-[clamp(1.6rem,2.8vw,2.5rem)]"
        >
          Let&rsquo;s talk about your next move
        </LineReveal>

        <LineReveal
          as="p"
          className="mt-[24px] max-w-[620px] font-display text-[clamp(13px,1vw,15px)] leading-[1.6] text-brand-bunker sm:mt-[clamp(14px,1.4vw,24px)]"
        >
          Ready to make your next move? Our specialised team is here to guide
          you with honest advice and local expertise you can count on. Whether
          you are buying, selling, or simply weighing up your options, we would
          love to hear from you. Reach out today and let&rsquo;s start the
          conversation.
        </LineReveal>

        <div className="mt-[24px] sm:mt-[clamp(20px,2.2vw,40px)]">
          <Button href="/contact" variant="primary" size="sm">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
