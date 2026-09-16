import { LineReveal } from "./ui/LineReveal";
import { TiltImage } from "./ui/TiltImage";

/**
 * "Know Us better!" band on the About page, directly under the video hero:
 * a centred Testimonials pill, heading and two paragraphs of plain-spoken
 * copy about the agency, then the full-bleed Parramatta photo. Same pill,
 * heading and paragraph treatment as the home page's Testimonials header, and
 * the same photo treatment as the home page's closing section, so the two
 * pages read as one system.
 */
export function KnowUsBetter() {
  return (
    <section className="w-full bg-white pt-[32px] sm:pt-[clamp(44px,6vw,90px)]">
      <div className="container-page flex flex-col items-center text-center">
        {/* The mobile comp labels this band "Our Team"; on desktop it is
            "Our Story", the page this is. Same pill either way. */}
        <span className="rounded-[8px] bg-brand-navy px-[16px] py-[7px] font-display text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
          <span className="sm:hidden">Our Team</span>
          <span className="hidden sm:inline">Our Story</span>
        </span>
        <LineReveal
          as="h2"
          className="mt-[16px] sm:mt-[clamp(18px,1.8vw,32px)] font-display font-bold text-brand-bunker text-[28px] sm:text-[clamp(1.5rem,3.1vw,2.9rem)] leading-[1.15]"
        >
          Know Us better!
        </LineReveal>
        <LineReveal
          as="p"
          className="mt-[16px] sm:mt-[clamp(18px,2vw,34px)] max-w-[960px] font-display text-[12.5px] sm:text-[clamp(13px,1.05vw,16px)] leading-[1.6] text-brand-bunker"
        >
          At Blue Ribbon, most of our clients have only sold a home once or twice
          in their lives. Every time, it&rsquo;s the biggest cheque they&rsquo;ll
          ever sign. That&rsquo;s why we do this differently. We&rsquo;re a Pendle
          Hill agency, and we&rsquo;ve stayed local on purpose. Wentworthville,
          Toongabbie, Girraween, Greystanes, Guildford, Parramatta. We know these
          streets block by block. Which buildings hold their value, and which ones
          photograph beautifully and then sit unsold for months.
        </LineReveal>
        <LineReveal
          as="p"
          className="mt-[14px] sm:mt-[clamp(16px,1.6vw,26px)] max-w-[960px] font-display text-[12.5px] sm:text-[clamp(13px,1.05vw,16px)] leading-[1.6] text-brand-bunker"
        >
          We tell you what your property is worth, not what you want to hear. We
          pick up the phone. And we turn the parts that usually stress people out
          into something simple. That&rsquo;s the whole idea. Real people, real
          advice, real results in your corner of Western Sydney.
        </LineReveal>
      </div>

      {/* Same photo, and the same rules, as the home page's closing section:
          natural 1920x903 aspect with no height cap so nothing is cropped, a
          squarer 4/3 crop on phones, and the site's scroll reveal. Turns in 3D
          towards the cursor, like the Parramatta featured card. */}
      <TiltImage
        src="/images/parramatta.png"
        alt="Blue Ribbon property brochures on a table beside a sofa"
        sizes="100vw"
        className="reveal-scale mt-[clamp(32px,4.5vw,72px)] w-full aspect-[4/3] sm:aspect-[1920/903]"
      />
    </section>
  );
}
