import { Button } from "../ui/Button";
import { LineReveal } from "../ui/LineReveal";

/**
 * Closing "Get in touch" section on the home page: a centred pill, heading,
 * paragraph and button on white. The Ven banner follows it on the page (see
 * VenBanner) — it replaced the full-width Parramatta photo that used to sit
 * below the button here, per the Nov 2026 comp.
 */
export function SellWithUs() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Bottom padding is the comp's ~63px from the button to the banner. */}
      <div className="container-page relative z-10 flex flex-col items-center text-center pt-[clamp(16px,1.6vw,28px)] pb-[clamp(40px,3.3vw,64px)]">
        <span className="rounded-[8px] bg-brand-navy px-[16px] py-[7px] font-display text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
          Get in touch
        </span>
        {/* One line from sm up — the comp's break after "urban" left a short
            second line under a nearly full first. Phones keep the break, as
            the sentence is far too long for one line there. */}
        <LineReveal
          as="h2"
          className="sm:hidden mt-[clamp(18px,1.8vw,32px)] font-display font-bold text-brand-bunker text-[clamp(1.4rem,2.4vw,2.5rem)] leading-[1.15]"
        >
          {"Set within the dynamic urban\nheart of Parramatta."}
        </LineReveal>
        <LineReveal
          as="h2"
          className="hidden sm:block mt-[clamp(18px,1.8vw,32px)] whitespace-nowrap font-display font-bold text-brand-bunker text-[clamp(1.25rem,2.05vw,2.2rem)] leading-[1.15]"
        >
          Set within the dynamic urban heart of Parramatta.
        </LineReveal>
        {/* Three lines from sm up, carried as explicit breaks. The comp set
            this in five, which under a one-line heading left the block
            looking taller than the thing it sits under; the breaks are
            explicit rather than left to a max-width because no single
            measure produces these three (the second line is longer than a
            width that would hold the first). Below sm the lines are wider
            than the screen, so phones get the same text wrapping naturally. */}
        <LineReveal
          as="p"
          className="hidden sm:block mt-[clamp(14px,1.4vw,22px)] font-display text-[clamp(13px,1vw,15px)] leading-[1.6] text-brand-bunker"
        >
          {
            "The Riverwalk Residences by Blueribbon offer a curated collection of sophisticated\nurban homes, defined by design excellence and unparalleled connection. Embrace the\nconvenience of riverside living and the pulse of a thriving community."
          }
        </LineReveal>
        <LineReveal
          as="p"
          className="sm:hidden mt-[clamp(14px,1.4vw,22px)] max-w-[540px] font-display text-[clamp(13px,1vw,15px)] leading-[1.6] text-brand-bunker"
        >
          The Riverwalk Residences by Blueribbon offer a curated collection of
          sophisticated urban homes, defined by design excellence and
          unparalleled connection. Embrace the convenience of riverside living
          and the pulse of a thriving community.
        </LineReveal>
        <div className="mt-[clamp(18px,1.8vw,30px)]">
          <Button href="/contact" variant="primary" size="sm">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
