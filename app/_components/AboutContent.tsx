import Image from "next/image";
import { LineReveal } from "./ui/LineReveal";
import { ParallaxFigure } from "./ui/ParallaxFigure";

const rows = [
  {
    title: "Local Leadership.\nShared Commitment.",
    // Ven Kan, the Managing Director — the same portrait the team page uses,
    // in place of the stock photo that opened this page.
    image: "/our-team/5.png",
    // Named, unlike the stock photos below: this is a real person, so the
    // alt text has to say who, not sit empty as decoration would.
    alt: "Ven Kan, Managing Director of BlueRibbon Real Estate",
    // A tall portrait in a square frame: centred, the cover crop took the top
    // of his head off. Anchored to the top instead, as the team cards do —
    // the headshots have only a few percent of room above the hair, and what
    // is lost from the bottom is jacket.
    position: "object-top",
    body: "Managing Director Ven Kan leads a team committed to clear communication, strong property presentation and attentive client service. We work together across sales, rentals and property management, drawing on local knowledge to help you understand your options. To discuss your property plans, contact Ven on 04 04 09 04 04.",
  },
  {
    title: "Marketing That\nMakes an Impact.",
    image: "/images/building.png",
    body: "A strong campaign gives people a reason to take a closer look. We bring photography, video, brochures, signboards and digital content together in a consistent presentation. Each element should highlight the property’s strongest features, provide useful information and make the next step clear. The aim is considered, memorable marketing shaped around the property and its audience.",
  },
  {
    title: "A Clear Plan\nfor Your Property.",
    image: "/images/beyond.png",
    body: "Every property move starts with different priorities. We take the time to understand yours, explain the choices and discuss a plan that suits your circumstances. Whether you are buying, selling, leasing or managing an investment, our team keeps the conversation focused on your property, your timing and what comes next.",
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
                alt={r.alt ?? ""}
                fill
                sizes="(max-width: 640px) 100vw, 23vw"
                className={`object-cover ${r.position ?? ""}`}
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
