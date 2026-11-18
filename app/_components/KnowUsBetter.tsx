import { LineReveal } from "./ui/LineReveal";
import { TiltImage } from "./ui/TiltImage";

/**
 * "About BlueRibbon" band on the Our Story page, directly under the video
 * hero: a centred pill, heading and two paragraphs about the agency, then the
 * full-bleed Parramatta photo. Same pill,
 * heading and paragraph treatment as the home page's Testimonials header, and
 * the same photo treatment as the home page's closing section, so the two
 * pages read as one system.
 */
export function KnowUsBetter() {
  return (
    <section className="w-full bg-white pt-[32px] sm:pt-[clamp(44px,6vw,90px)]">
      <div className="container-page flex flex-col items-center text-center">
        <span className="rounded-[8px] bg-brand-navy px-[16px] py-[7px] font-display text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
          About BlueRibbon
        </span>
        <LineReveal
          as="h2"
          className="mt-[16px] sm:mt-[clamp(18px,1.8vw,32px)] font-display font-bold text-brand-bunker text-[28px] sm:text-[clamp(1.5rem,3.1vw,2.9rem)] leading-[1.15]"
        >
          Confident Marketing. Personal Service.
        </LineReveal>
        <LineReveal
          as="p"
          className="mt-[16px] sm:mt-[clamp(18px,2vw,34px)] max-w-[960px] font-display text-[12.5px] sm:text-[clamp(13px,1.05vw,16px)] leading-[1.6] text-brand-bunker"
        >
          BlueRibbon Real Estate brings local knowledge, thoughtful advice and
          distinctive property marketing to buyers, sellers and landlords across
          Western Sydney. Led by Managing Director Ven Kan, our team combines
          sales and property management experience with a clear focus on your
          goals.
        </LineReveal>
        <LineReveal
          as="p"
          className="mt-[14px] sm:mt-[clamp(16px,1.6vw,26px)] max-w-[960px] font-display text-[12.5px] sm:text-[clamp(13px,1.05vw,16px)] leading-[1.6] text-brand-bunker"
        >
          BlueRibbon has achieved $50 million in property sales across the
          agency. Our approach remains personal: understand your plans, recommend
          a clear strategy and keep you informed from the first conversation
          through to the next step.
        </LineReveal>
      </div>

      {/* Same photo, and the same rules, as the home page's closing section:
          a squarer 4/3 crop on phones, and the site's scroll reveal. Turns in
          3D towards the cursor, like the Parramatta featured card.

          Wider than the file's own 1920x903 so the band is shorter — at its
          natural ratio it ran most of a screen on a wide monitor. The crop
          comes off the top and bottom, which is sofa and table edge. */}
      <TiltImage
        src="/images/parramatta.png"
        alt="BlueRibbon property brochures on a table beside a sofa"
        sizes="100vw"
        className="reveal-scale mt-[clamp(32px,4.5vw,72px)] w-full aspect-[4/3] sm:aspect-[1920/760]"
      />
    </section>
  );
}
