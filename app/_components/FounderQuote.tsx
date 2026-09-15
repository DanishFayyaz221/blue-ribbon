import Image from "next/image";
import { LineReveal } from "./ui/LineReveal";
import { ScrollZoomFigure } from "./ui/ScrollZoomFigure";

const QUOTE =
  "“When I started Blue Ribbon, I wanted to build the kind of agency I’d want my own family to walk into. Most people only sell a home once or twice in their lives, and every time it’s the biggest cheque they’ll ever sign. So we made a simple promise. We’ll tell you what your property is really worth, not what you want to hear. We’ll pick up the phone every time. Because to us, you were never just a listing. You’re a family trusting us with one of the biggest moments of your life.”";

/**
 * Closing block of the About page: the founder's quote, then the full-bleed
 * handshake banner that runs straight into the footer.
 *
 * The quote is set in a neutral grotesque rather than Poppins, as the comp is,
 * with the first line indented so the opening quotation mark hangs inside the
 * measure. It plays the site's line-mask reveal (LineReveal); the indent is
 * inherited by the line masks, so globals.css zeroes it on every mask after
 * the first. The caption keeps the plain fade-up. The banner asset carries its
 * own white haze across the top, so the quote's white ground dissolves into
 * the photo without a CSS gradient here. The banner grows into place as it
 * scrolls up, the same treatment as the appraisal page's banners.
 */
export function FounderQuote() {
  return (
    <>
      <section className="w-full bg-white pt-[clamp(48px,7vw,135px)]">
        <div className="container-page">
          <figure className="mx-auto w-full sm:w-[85%]">
            <LineReveal
              as="blockquote"
              className="font-[Helvetica_Neue,Helvetica,Arial,sans-serif] text-[clamp(20px,2.45vw,36px)] leading-[1.28] text-brand-bunker sm:indent-[2.7em]"
            >
              {QUOTE}
            </LineReveal>
            <figcaption
              suppressHydrationWarning
              className="reveal mt-[clamp(24px,3.7vw,54px)] font-display text-[clamp(12px,1vw,15px)] font-semibold leading-[1.4] text-brand-silver"
            >
              Ven Kan
              <br />
              Managing Director, BlueRibbon Real Estate
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Full-bleed banner at its natural 1920x984 aspect, capped only on very
          wide screens. Its white top edge is part of the asset. Scales from
          90% to full as it rises, settling as its top reaches the top of the
          screen — see ScrollZoomFigure. */}
      <ScrollZoomFigure
        zoom={1}
        from={0.9}
        className="relative mt-[clamp(12px,1.4vw,20px)] aspect-[1920/984] max-h-[984px] w-full origin-center overflow-hidden"
      >
        <Image
          src="/images/banner2.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </ScrollZoomFigure>
    </>
  );
}
