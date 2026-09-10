import Image from "next/image";
import { LineReveal } from "../ui/LineReveal";
import { ValuesShowcase } from "./ValuesShowcase";

/**
 * "Our values" band on the appraisal page: the navy satin backdrop the rest of
 * the site's navy sections use, a white "Get in touch" pill, a centred heading
 * and paragraph, then the values showcase (marquee and zigzag rows) on the
 * same fabric.
 *
 * From sm up the heading and paragraph carry the comp's own line breaks, so
 * they wrap exactly as designed at every desktop size — neither is a natural
 * wrap at any one width. Below sm those lines are wider than a phone screen,
 * so phones get the same copy wrapping naturally.
 */
export function OurValues() {
  return (
    <section className="relative w-full overflow-hidden bg-brand-navy pt-[clamp(32px,3vw,60px)] pb-[clamp(64px,6vw,120px)]">
      {/* Navy fabric, tinted the same way as the other satin sections so the
          white copy keeps its contrast over the lighter folds. */}
      <Image
        src="/images/bg.png"
        alt=""
        fill
        quality={90}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-[#001F4D1F]" />

      <div className="container-page relative z-10 flex flex-col items-center text-center">
        <span className="rounded-[6px] bg-white px-[16px] py-[7px] font-display text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-bunker">
          Get in touch
        </span>

        <LineReveal
          as="h2"
          className="hidden sm:block mt-[clamp(18px,1.8vw,32px)] font-display font-bold text-white text-[clamp(1.5rem,2.4vw,2.6rem)] leading-[1.25]"
        >
          {
            "Through our local insight and\ncommitment, we aim to deliver\npremium results that truly\nstand out."
          }
        </LineReveal>
        <LineReveal
          as="h2"
          className="sm:hidden mt-[18px] font-display font-bold text-white text-[20px] leading-[1.25]"
        >
          Through our local insight and commitment, we aim to deliver premium
          results that truly stand out.
        </LineReveal>

        <LineReveal
          as="p"
          className="hidden sm:block mt-[clamp(18px,1.45vw,25px)] font-display font-normal text-white/90 text-[12.5px] leading-[1.6] tracking-[0.01em]"
        >
          {
            "Our passion for quality service, extensive market expertise,\nand bespoke strategy are all focused on securing the\nhighest potential value throughout your property journey."
          }
        </LineReveal>
        <LineReveal
          as="p"
          className="sm:hidden mt-[18px] max-w-[600px] font-display font-normal text-white/90 text-[13px] leading-[1.6] tracking-[0.01em]"
        >
          Our passion for quality service, extensive market expertise, and
          bespoke strategy are all focused on securing the highest potential
          value throughout your property journey.
        </LineReveal>
      </div>

      {/* Full-bleed photo between the intro and the values showcase, as in
          the comp. Kept at its natural 1920x1182 aspect so nothing is cropped,
          capped only on very wide screens where that would outgrow a viewport. */}
      <div className="relative z-10 mt-[clamp(32px,4.5vw,72px)] aspect-[1920/1182] max-h-[1182px] w-full">
        <Image
          src="/images/frame1.png"
          alt="A Blue Ribbon agent in conversation with a client"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="relative z-10">
        <ValuesShowcase />
      </div>
    </section>
  );
}
