import Image from "next/image";
import { TextMarquee } from "../ui/TextMarquee";
import { LineReveal } from "../ui/LineReveal";
import { ScrollGrowVideo } from "./ScrollGrowVideo";

const QUOTE =
  "“Step through our doors and you’ll feel the difference straight away. A warm welcome, a genuine conversation, and the kind of care that turns strangers into neighbours. At Blue Ribbon, hospitality isn’t a gesture, it’s who we are. Come sit with us, share your story, and let us make you feel right at home.”";

/**
 * Top of the Contact page from sm up: the office-tower photo full-bleed with
 * the "Our Values" marquee running across its middle, then a justified
 * hospitality quote set in the same grotesque as the About page's founder
 * quote, its first line indented so the opening mark hangs inside the measure,
 * with the team attribution and the Our Story film beneath it.
 * The quote plays the line-mask reveal; globals.css keeps the justification
 * per line (`.lr.text-justify`) and the indent on the first line only.
 */
export function ContactIntro() {
  return (
    <>
      {/* The hero keeps the photo's own 923x615 proportions and no height cap,
          so the whole frame is always visible — a wider box would have to crop
          the towers top and bottom to fill itself. */}
      <section className="relative mt-[clamp(8px,1vw,16px)] aspect-[923/615] w-full overflow-hidden bg-brand-navy-deep">
        <Image
          src="/contact/contact-1.png"
          alt="The office towers around Blue Ribbon Real Estate"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover"
        />
        <h2 className="sr-only">Our Values</h2>
        <TextMarquee label="Our Values" className="absolute inset-x-0 top-1/2 -translate-y-1/2" />
      </section>

      {/* overflow-x: clip (not hidden — hidden would make this the sticky
          video's scroll container) guards against a sub-pixel of the full-width
          video poking past the viewport edge. */}
      <section className="w-full overflow-x-clip bg-white pt-[clamp(32px,5.6vw,80px)] pb-[clamp(16px,2vw,32px)]">
        <div className="container-page">
          <figure className="mx-auto w-full sm:w-[74%]">
            <LineReveal
              as="blockquote"
              className="text-justify font-[Helvetica_Neue,Helvetica,Arial,sans-serif] text-[clamp(20px,2.45vw,36px)] leading-[1.28] text-brand-bunker sm:indent-[2.7em]"
            >
              {QUOTE}
            </LineReveal>

            {/* Attribution on the left, the Our Story film on the right — the
                same ambient autoplay as the About page hero. Muted is not a
                style choice: browsers refuse to autoplay video with sound. */}
            <div className="mt-[clamp(20px,2.5vw,36px)] flex flex-col gap-[20px] sm:flex-row sm:items-start sm:justify-between">
              <figcaption className="font-display text-[clamp(12px,1vw,15px)] font-semibold leading-[1.4] text-brand-silver">
                Team, BlueRibbon Real Estate
              </figcaption>
              {/* Pins at the viewport centre and grows with the scroll to the
                  full viewport width, then releases — see ScrollGrowVideo. */}
              <ScrollGrowVideo
                src="/hero-video/hero.mp4"
                className="w-full sm:w-[clamp(200px,24vw,360px)] sm:shrink-0"
              />
            </div>
          </figure>
        </div>
      </section>
    </>
  );
}
