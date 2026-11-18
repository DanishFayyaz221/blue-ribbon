import { LineReveal } from "./ui/LineReveal";
import { VenBanner } from "./sections/VenBanner";

const QUOTE =
  "Good property service brings the right elements together: local knowledge, a clear strategy, considered marketing and people who follow through. At BlueRibbon, we give the presentation and the client experience the same care. From the first conversation to your next move, our focus is on helping you make informed decisions with confidence.";

/**
 * Closing block of the About page: the founder's quote, then the Ven banner
 * that runs straight into the footer. The banner replaced the full-bleed
 * handshake photo (`banner2.png`) that used to close the page, per the
 * Nov 2026 comp.
 *
 * The quote is set in a neutral grotesque rather than Poppins, as the comp is,
 * with the first line indented so the opening quotation mark hangs inside the
 * measure. It plays the site's line-mask reveal (LineReveal); the indent is
 * inherited by the line masks, so globals.css zeroes it on every mask after
 * the first. The caption keeps the plain fade-up.
 */
export function FounderQuote() {
  return (
    <>
      <section className="w-full bg-white pt-[clamp(48px,7vw,135px)]">
        <div className="container-page">
          <figure className="mx-auto w-full sm:w-[85%]">
            {/* Phone (the mobile comp): larger than the desktop clamp gives a
                narrow screen, justified, and indented like the desktop.
                `max-sm:text-justify` is also the hook globals.css uses to
                stretch every line but the last on phones only. */}
            <LineReveal
              as="blockquote"
              className="font-[Helvetica_Neue,Helvetica,Arial,sans-serif] text-[24px] sm:text-[clamp(20px,2.45vw,36px)] leading-[1.28] text-brand-bunker indent-[2.7em] max-sm:text-justify"
            >
              {QUOTE}
            </LineReveal>
            {/* Shown at every width. The mobile comp ran the quote straight
                into the banner with no attribution, but an unattributed quote
                reads as copy rather than as something the founder said —
                the line that gives it its weight. Phones get a slightly
                smaller size and a tighter gap above. */}
            <figcaption
              suppressHydrationWarning
              className="reveal block mt-[24px] font-display text-[14px] font-semibold leading-[1.4] text-brand-silver sm:mt-[clamp(24px,3.7vw,54px)] sm:text-[clamp(12px,1vw,15px)]"
            >
              Ven Kan
              <br />
              {/* "BlueRibbon" as one word, as the logo sets it, carrying the
                  registered mark. The mark is a superscript so it reads as a
                  mark rather than as part of the name. */}
              Managing Director, BlueRibbon Real Estate
              <sup className="text-[0.6em] align-super">®</sup>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* The comp leaves ~120px between the quote block and the banner. */}
      <VenBanner className="mt-[48px] sm:mt-[clamp(48px,6.25vw,120px)]" />
    </>
  );
}
