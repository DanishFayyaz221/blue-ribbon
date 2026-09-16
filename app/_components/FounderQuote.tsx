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
            {/* The mobile comp runs the quote straight into the banner, with
                no attribution. */}
            <figcaption
              suppressHydrationWarning
              className="reveal hidden sm:block mt-[clamp(24px,3.7vw,54px)] font-display text-[clamp(12px,1vw,15px)] font-semibold leading-[1.4] text-brand-silver"
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
        // Phone: a square crop, as the mobile comp draws it — object-cover
        // trims the sides and keeps the asset's white top edge.
        className="relative mt-[40px] aspect-square max-h-[984px] w-full origin-center overflow-hidden sm:mt-[clamp(12px,1.4vw,20px)] sm:aspect-[1920/984]"
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
