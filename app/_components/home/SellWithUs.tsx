import { Button } from "../ui/Button";
import { LineReveal } from "../ui/LineReveal";
import { TiltImage } from "../ui/TiltImage";

/**
 * Closing "Get in touch" section on the home page: a centred pill, heading,
 * paragraph and button on white, with the full-width Parramatta photo below.
 *
 * The photo (`parramatta.png`) ships with a white haze baked into its top
 * quarter, so the section paints no gradient of its own — the image is simply
 * pulled up under the button with a negative margin, and the button and the
 * tail of the paragraph sit over the part of the photo that is already white.
 * Keeping the fade in the asset (rather than a CSS gradient) is what lets the
 * haze track the photo's own tones instead of a flat white wash.
 */
export function SellWithUs() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Copy column. z-10 so it paints over the photo where the two overlap. */}
      <div className="container-page relative z-10 flex flex-col items-center text-center pt-[clamp(16px,1.6vw,28px)]">
        <span className="rounded-[8px] bg-brand-navy px-[16px] py-[7px] font-display text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
          Get in touch
        </span>
        <LineReveal
          as="h2"
          className="mt-[clamp(18px,1.8vw,32px)] font-display font-bold text-brand-bunker text-[clamp(1.4rem,2.4vw,2.5rem)] leading-[1.15]"
        >
          {"Set within the dynamic urban\nheart of Parramatta."}
        </LineReveal>
        {/* From sm up the paragraph carries the comp's own line breaks, so it
            wraps exactly as designed at every desktop size. The five lines
            are not a natural wrap at any one width — the second line needs a
            narrower measure than the third allows — so a max-width alone
            could never reproduce them. Below sm those lines are wider than
            the screen, so phones get the same text wrapping naturally. */}
        <LineReveal
          as="p"
          className="hidden sm:block mt-[clamp(14px,1.4vw,22px)] font-display text-[clamp(13px,1vw,15px)] leading-[1.6] text-brand-bunker"
        >
          {
            "The Riverwalk Residences by Blueribbon offer a curated\ncollection of sophisticated urban homes, defined by\ndesign excellence and unparalleled connection. Embrace\nthe convenience of riverside living and the pulse of a\nthriving community."
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

      {/* Photo at its natural 1920x903 aspect from sm up, with NO height cap:
          a cap makes the box shorter than the image's own shape, and
          object-cover then crops the bottom off the frame. Phones keep a
          squarer 4/3 crop, where the full wide ratio would shrink to a thin
          strip. The negative top margin tucks the white top of the photo
          under the button.

          `reveal-scale` is the site-wide scroll reveal (see globals.css and
          RevealOnScroll): the block starts transparent, slightly lowered and
          at 98.5% scale, and eases to rest over ~0.9s once it scrolls into
          view — so the photo appears smoothly rather than sitting there fully
          painted before the copy above it has finished revealing.

          It also turns in 3D towards the cursor while hovered, matching the
          same photo on the About page and the Parramatta featured card. */}
      <TiltImage
        src="/images/parramatta.png"
        alt="Blue Ribbon property brochures on a table beside a sofa"
        sizes="100vw"
        className="reveal-scale -mt-[clamp(52px,4.5vw,72px)] w-full aspect-[402/245] sm:aspect-[1920/903]"
      />
    </section>
  );
}
