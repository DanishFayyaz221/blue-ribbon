import Image from "next/image";
import { Button } from "../ui/Button";
import { LineReveal } from "../ui/LineReveal";
import { ScrollZoomFigure } from "../ui/ScrollZoomFigure";

/**
 * "Get in touch with our specialised team" call to action, per the appraisal
 * comp: white band, copy on the left, a square photo on the right that runs
 * flush to the viewport edge and to the bottom of the section, with only its
 * top-left corner rounded. Both columns start at the same top edge (the pill
 * lines up with the top of the photo) and the photo sets the band's height.
 *
 * From sm up the heading carries the comp's line break; phones wrap it
 * naturally and stack the photo under the copy.
 */
export function TeamCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-[clamp(40px,6.7vw,110px)]">
      {/* Phone (the mobile comp): everything centred, and the photo sits
          between the heading and the copy. Below sm the copy column
          dissolves into the grid (`contents`) so `order` can slot the photo
          in after the heading; from sm it is a block again and the grid is
          the comp's two columns. `order` and `justify-self` only act on grid
          items, so none of them touch the desktop layout. */}
      <div className="grid grid-cols-1 px-[var(--page-px)] sm:grid-cols-[52%_48%] sm:items-start sm:px-0">
        <div className="contents sm:block sm:pl-[clamp(24px,10.8vw,208px)] sm:pr-[clamp(24px,5vw,80px)] sm:pb-[clamp(32px,4vw,64px)]">
          <span className="order-1 inline-flex justify-self-center rounded-[6px] bg-brand-navy px-[16px] py-[7px] font-display text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
            Our Agents
          </span>

          <LineReveal
            as="h2"
            className="hidden sm:block mt-[clamp(16px,1.4vw,22px)] font-display font-bold text-brand-bunker text-[clamp(1.6rem,2.8vw,2.5rem)] leading-[1.2]"
          >
            {"Get in touch with Our\nspecialized Team!"}
          </LineReveal>
          <LineReveal
            as="h2"
            className="order-2 sm:hidden mt-[16px] text-center font-display font-bold text-brand-bunker text-[26px] leading-[1.2]"
          >
            Get in touch with Our specialized Team!
          </LineReveal>

          <LineReveal
            as="p"
            className="order-4 mx-auto mt-[24px] max-w-[470px] text-center font-display text-[clamp(13px,1vw,15px)] leading-[1.6] text-brand-bunker sm:mx-0 sm:mt-[clamp(14px,1.4vw,24px)] sm:text-left"
          >
            Ready to make your next move? Our specialised team is here to guide
            you with honest advice and local expertise you can count on. Whether
            you are buying, selling, or simply weighing up your options, we would
            love to hear from you. Reach out today and let&rsquo;s start the
            conversation.
          </LineReveal>

          {/* Last in the phone stack, so it carries the gap to the footer that
              the column's own bottom padding gives the desktop. */}
          <div className="order-5 mt-[24px] mb-[40px] justify-self-center sm:mt-[clamp(20px,2.2vw,40px)] sm:mb-0">
            <Button href="/contact" variant="primary" size="sm">
              Contact Us
            </Button>
          </div>
        </div>

        {/* `scaleInner`: this photo is flush to the right and bottom edges
            and carries a rounded top-left corner, so the frame has to stay
            exactly where it is. Growing the frame would pull it off those
            edges and show the page behind; growing the image inside it keeps
            the block anchored and clips the overspill. */}
        <ScrollZoomFigure
          zoom={1}
          from={0.92}
          scaleInner
          // Phone: third in the stack and bled to the screen edges past the
          // grid's padding; from sm, the comp's right-hand column.
          className="order-3 relative -mx-[var(--page-px)] mt-[24px] aspect-square w-auto max-h-[720px] overflow-hidden rounded-tl-[14px] sm:order-none sm:mx-0 sm:mt-0 sm:w-full sm:rounded-tl-[clamp(12px,1.2vw,20px)]"
        >
          <Image
            src="/images/humility.png"
            alt="A Blue Ribbon agent presenting a property brochure to a client"
            fill
            sizes="(max-width: 640px) 100vw, 48vw"
            className="object-cover"
          />
        </ScrollZoomFigure>
      </div>
    </section>
  );
}
