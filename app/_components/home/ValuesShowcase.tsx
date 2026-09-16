import Image from "next/image";
import { TextMarquee } from "../ui/TextMarquee";
import { LineReveal } from "../ui/LineReveal";
import { ParallaxFigure } from "../ui/ParallaxFigure";

const values = [
  {
    title: "Unity",
    image: "/images/unity.png",
    body: "We pride ourselves on our togetherness. Sharing knowledge and experience across the whole team in collaboration creates a unified group of individuals who share an undying passion for our clients goals.",
  },
  {
    title: "Humility",
    image: "/images/humility.png",
    body: "We place the needs of others above our own and think of others before ourselves. Acknowledging excellence while humbly understanding everyone has knowledge to add to any situation is how we strive to carry ourselves with each other and our clients.",
  },
  {
    title: "Excellence",
    image: "/images/excellence.png",
    body: "Excellence is a quality we pride ourselves on, not only in how we carry ourselves but also in the results we strive for. As leaders of the real estate industry we aim to continue to exceed expectations and deliver excellence in everything that we do.",
  },
];

/**
 * The three values as a zigzag of square photo + text block, under a
 * full-bleed "Our Values" marquee. Rendered inside the OurValues section so
 * it shares that section's navy satin rather than restarting the fabric at a
 * seam.
 *
 * Every second row shrinks to its content and is pushed towards the right of
 * the container from md up, stopping a little short of the edge, so the rows
 * alternate sides — that is what gives the comp its staircase. The text block is inset from
 * the top of its photo so the title sits a little way down the image edge
 * instead of flush with its top corner.
 */
export function ValuesShowcase() {
  return (
    <div className="mt-[clamp(32px,4.5vw,72px)]">
      <h2 className="sr-only">Our Values</h2>

      {/* Decorative marquee; the sr-only heading above carries the meaning. */}
      <TextMarquee label="Our Values" />

      <div className="container-page mt-[clamp(36px,7vw,120px)]">
        {values.map((v, i) => (
          <div
            key={v.title}
            // Phones read title and copy first, then the photo (the mobile
            // comp's order); from sm the row is photo-left, text-right.
            className={`flex flex-col-reverse gap-[20px] sm:flex-row sm:items-start sm:gap-[clamp(24px,4.5vw,66px)] ${
              i > 0 ? "mt-[40px] sm:mt-[clamp(40px,12vw,190px)]" : ""
            } ${i % 2 === 1 ? "md:ml-auto md:mr-[5%] md:w-fit" : ""}`}
          >
            {/* The photo keeps the block fade-up and drifts inside its frame
                as the row passes; the title and copy play the line-mask
                reveal instead, so the text isn't animated twice. */}
            <ParallaxFigure
              suppressHydrationWarning
              className="reveal relative aspect-square w-full shrink-0 overflow-hidden rounded-[14px] sm:w-[clamp(200px,21.7vw,330px)] sm:max-w-[330px]"
            >
              <Image
                src={v.image}
                alt={`${v.title} at Blue Ribbon Real Estate`}
                fill
                sizes="(max-width: 640px) 100vw, 22vw"
                className="object-cover"
              />
            </ParallaxFigure>
            <div className="w-full max-w-[430px] sm:pt-[clamp(16px,5vw,80px)]">
              <LineReveal
                as="h3"
                className="border-b border-white/60 pb-[10px] font-display text-[22px] font-bold text-white sm:text-[clamp(17px,1.65vw,24px)] sm:font-medium"
              >
                {v.title}
              </LineReveal>
              <LineReveal
                as="p"
                className="mt-[16px] font-display text-[13px] leading-[1.75] text-white/85 sm:text-[clamp(12px,0.95vw,14px)]"
              >
                {v.body}
              </LineReveal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
