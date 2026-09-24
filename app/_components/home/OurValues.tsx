import Image from "next/image";
import { LineReveal } from "../ui/LineReveal";
import { ValuesShowcase } from "./ValuesShowcase";
import { ScrollZoomFigure } from "../ui/ScrollZoomFigure";

/**
 * "Our values" band on the appraisal page: the navy satin backdrop the rest of
 * the site's navy sections use, a navy "Get in touch" pill, a centred heading
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
        quality={60}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-[#001F4D1F]" />

      <div className="container-page relative z-10 flex flex-col items-center text-center">
        {/* One pill for both breakpoints, navy on white type like every
            other section label on the site. It used to be two — the phone
            comp labelled this band "Testimonials" on a translucent navy pill
            — and then a white pill with navy type, which was the one label
            anywhere that inverted. Phones get the same pill a step smaller. */}
        <span className="inline-flex rounded-[5px] bg-brand-navy px-[11px] py-[5px] font-display text-[8.5px] font-semibold uppercase tracking-[0.18em] text-white sm:rounded-[6px] sm:px-[16px] sm:py-[7px] sm:text-[11px] sm:tracking-[0.22em]">
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
          className="sm:hidden mt-[18px] font-display font-bold text-white text-[26px] leading-[1.25]"
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
          We bring genuine care, deep market expertise, and a strategy made for
          you, all focused on achieving the best possible value at every stage
          of your journey. See what our customers have to say about us.
        </LineReveal>
      </div>

      {/* Photo between the intro and the values showcase: full width, whole
          frame, and never taller than the screen.

          The box takes the image's own 1920x1182 shape, so at full width the
          image fills it exactly — edge to edge with nothing cropped. `max-h`
          then stops it running past the fold on a wide monitor, where that
          shape would be taller than the viewport.

          `object-cover` so the photo always reaches both side edges. It only
          has anything to trim in the capped case: on a 16:9 monitor the cap
          shortens the box below the image's shape, costing ~9% off the top
          and bottom — the subjects sit centrally, so that takes ceiling and
          floor rather than faces. On a 16:10 screen (1440x900) the cap never
          engages, the box matches the image exactly, and nothing is lost.

          `svh` rather than `vh`: on mobile browsers `vh` measures the
          viewport with the toolbars hidden, so the cap would sit lower than
          the visible area until the user scrolled.

          `svh` rather than `vh`: on mobile browsers `vh` measures the
          viewport with the toolbars hidden, so the banner would overflow by
          the height of the address bar until the user scrolled.

          It grows into place as it scrolls in (see ScrollZoomFigure). The
          frame is the thing that scales, so nothing beside it shifts —
          `origin-center` keeps the growth symmetrical on a full-bleed
          element, and the clip stops the drifting photo overhanging while the
          frame is still below full size. */}
      <ScrollZoomFigure
        zoom={1}
        // 0.9 rather than the reference default of 0.8. The growth here runs
        // over a full viewport of scroll so it can be watched, and across that
        // distance a 20% jump reads as a heavy pop; 10% is a slow, continuous
        // settle.
        from={0.9}
        className="relative z-10 mt-[clamp(32px,4.5vw,72px)] aspect-[1920/1182] max-h-[100svh] w-full origin-center overflow-hidden"
      >
        <Image
          src="/images/frame1.png"
          alt="A Blue Ribbon agent in conversation with a client"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </ScrollZoomFigure>

      <div className="relative z-10">
        <ValuesShowcase />
      </div>
    </section>
  );
}
