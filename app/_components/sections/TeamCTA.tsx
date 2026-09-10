import Image from "next/image";
import { Button } from "../ui/Button";
import { LineReveal } from "../ui/LineReveal";

/**
 * "Get in touch with our specialised team" call to action, per the appraisal
 * comp: white band, copy on the left, a square photo on the right that runs
 * flush to the viewport edge and to the bottom of the section, with only its
 * top-left corner rounded. Both columns start at the same top edge (the pill
 * lines up with the top of the photo) and the photo sets the band's height.
 *
 * From sm up the heading carries the comp's line break; phones wrap it
 * naturally and stack the photo under the copy.
 */
export function TeamCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-[clamp(40px,6.7vw,110px)]">
      <div className="grid grid-cols-1 sm:grid-cols-[52%_48%] sm:items-start">
        <div className="pl-[var(--page-px)] pr-[var(--page-px)] pb-[clamp(32px,4vw,64px)] sm:pl-[clamp(24px,10.8vw,208px)] sm:pr-[clamp(24px,5vw,80px)]">
          <span className="inline-flex rounded-[6px] bg-brand-navy px-[16px] py-[7px] font-display text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
            Our Agents
          </span>

          <LineReveal
            as="h2"
            className="hidden sm:block mt-[clamp(16px,1.4vw,22px)] font-display font-bold text-brand-bunker text-[clamp(1.6rem,2.8vw,2.5rem)] leading-[1.2]"
          >
            {"Get in touch with Our\nspecialized Team!"}
          </LineReveal>
          <LineReveal
            as="h2"
            className="sm:hidden mt-[16px] font-display font-bold text-brand-bunker text-[1.6rem] leading-[1.2]"
          >
            Get in touch with Our specialized Team!
          </LineReveal>

          <LineReveal
            as="p"
            className="mt-[clamp(14px,1.4vw,24px)] max-w-[470px] font-display text-[clamp(13px,1vw,15px)] leading-[1.6] text-brand-bunker"
          >
            Ready to make your next move? Our specialised team is here to guide
            you with honest advice and local expertise you can count on. Whether
            you are buying, selling, or simply weighing up your options, we would
            love to hear from you. Reach out today and let&rsquo;s start the
            conversation.
          </LineReveal>

          <div className="mt-[clamp(20px,2.2vw,40px)]">
            <Button href="/contact" variant="primary" size="sm">
              Contact Us
            </Button>
          </div>
        </div>

        <div className="relative aspect-square w-full max-h-[720px] overflow-hidden rounded-tl-[14px] sm:rounded-tl-[clamp(12px,1.2vw,20px)]">
          <Image
            src="/images/humility.png"
            alt="A Blue Ribbon agent presenting a property brochure to a client"
            fill
            sizes="(max-width: 640px) 100vw, 48vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
