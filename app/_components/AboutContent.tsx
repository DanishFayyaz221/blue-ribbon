import Image from "next/image";
import { LineReveal } from "./ui/LineReveal";
import { ParallaxFigure } from "./ui/ParallaxFigure";

const rows = [
  {
    title: "Your Australian\nProperty Partners",
    image: "/images/australian.png",
    body: "Established to redefine excellence, Blue Ribbon Real Estate has rapidly emerged as a premier agency and a respected industry leader across the Australian market. Committed to raising the bar, Blue Ribbon was founded to transform the real estate experience through a dedication to integrity and local expertise. Our service focuses on more than just transactions; it is about supporting our clients\u2019 lifestyles, financial growth, and long-term security.",
  },
  {
    title: "Building Excellence\nIn Property",
    image: "/images/building.png",
    body: "Blue Ribbon is driven by a team of dynamic professionals united by a singular passion to secure the absolute best results for every Australian homeowner. Blending modern innovation with traditional integrity, our steadfast commitment to these core principles distinguishes us within the competitive retail market. By constantly evolving and refining our expertise, we provide an elevated standard of service designed to exceed your property goals.",
  },
  {
    title: "A Standard\nBeyond Expectation",
    image: "/images/beyond.png",
    body: "At Blue Ribbon, excellence is never left to chance. Every appraisal, every campaign, and every negotiation is guided by a simple belief that our clients deserve more than the ordinary. Our team blends sharp market insight with a genuine commitment to doing right by the people we serve. We take the time to understand what matters most to you, then build a strategy designed to protect it and grow it. From the first conversation to the moment the deal is done, we hold ourselves to a higher mark, because your trust is something we intend to earn every single day.",
  },
];

/**
 * About page body: three rows of square photo + text block in a staircase, on
 * white. Rows one and three sit at the left margin; row two is pushed right by
 * about a quarter of the container. Each title carries the comp's own two-line
 * break, and a thin rule under it spans the text block.
 *
 * Light-theme sibling of the appraisal page's ValuesShowcase — kept separate
 * because the proportions differ (smaller photos, wider copy, tighter rows).
 *
 * Each photo drifts inside its frame as the row passes (see ParallaxFigure).
 * The frame keeps its own entry reveal; the drift runs on a layer inside it,
 * so the two transforms compose rather than fight.
 */
export function AboutContent() {
  return (
    <section className="w-full bg-white pt-[clamp(24px,2.4vw,44px)] pb-[clamp(44px,4vw,76px)]">
      <div className="container-page">
        {rows.map((r, i) => (
          <div
            key={r.title}
            className={`flex flex-col gap-[20px] sm:flex-row sm:items-start sm:gap-[clamp(28px,5.1vw,74px)] ${
              i > 0 ? "mt-[40px] sm:mt-[clamp(40px,6.5vw,94px)]" : ""
            } ${i % 2 === 1 ? "md:ml-[27%]" : ""}`}
          >
            <ParallaxFigure
              suppressHydrationWarning
              className="reveal-scale relative aspect-square w-full shrink-0 overflow-hidden rounded-[10px] sm:w-[clamp(200px,23vw,440px)] sm:max-w-[440px]"
            >
              <Image
                src={r.image}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 23vw"
                className="object-cover"
              />
            </ParallaxFigure>
            <div className="w-full sm:w-[clamp(280px,31vw,600px)] sm:pt-[clamp(0px,3vw,48px)]">
              <LineReveal
                as="h2"
                className="border-b border-brand-bunker/70 pb-[14px] font-display text-[24px] font-bold leading-[1.15] text-brand-bunker sm:text-[clamp(17px,1.5vw,22px)]"
              >
                {r.title}
              </LineReveal>
              <LineReveal
                as="p"
                className="mt-[16px] font-display text-[13px] leading-[1.7] text-brand-bunker sm:text-[clamp(12px,0.9vw,14px)]"
              >
                {r.body}
              </LineReveal>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
