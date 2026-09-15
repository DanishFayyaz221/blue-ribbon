import { Nav } from "../layout/Nav";
import { Footer } from "../layout/Footer";
import { Breadcrumb } from "../ui/Breadcrumb";
import { LineReveal } from "../ui/LineReveal";

export type LegalSection = {
  heading: string;
  /** Paragraphs shown before the bullet list, if there is one. */
  paragraphs?: string[];
  bullets?: string[];
  /** Paragraphs shown after the bullet list. */
  after?: string[];
};

type Props = {
  /** Pill above the title, e.g. "Legal". */
  label: string;
  title: string;
  intro: string;
  /** Spelled out, e.g. "15 September 2026". */
  updated: string;
  sections: LegalSection[];
};

/**
 * Shared layout for the legal pages (Terms & Conditions, Privacy Policy):
 * the same centred pill, title and intro as Market Insights, then the
 * numbered sections in a reading-width column. Every heading, paragraph and
 * bullet plays the site's line-mask reveal as it scrolls in, so the document
 * reads as part of the site rather than a pasted-in wall of text.
 *
 * Content is plain strings on purpose: LineReveal splits and re-masks text
 * itself and takes only a string child.
 */
export function LegalDocument({ label, title, intro, updated, sections }: Props) {
  const body =
    "font-display text-[clamp(13px,1.05vw,16px)] leading-[1.7] text-brand-bunker";

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <div className="container-page pt-[16px] pb-[16px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: title }]} />
        </div>

        <section className="w-full bg-white pt-[clamp(28px,3.5vw,60px)] pb-[clamp(44px,5vw,90px)]">
          <div className="container-page flex flex-col items-center text-center">
            <span className="rounded-[8px] bg-brand-navy px-[16px] py-[7px] font-display text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
              {label}
            </span>
            <LineReveal
              as="h1"
              className="mt-[clamp(18px,1.8vw,32px)] font-display font-bold text-brand-bunker text-[clamp(1.5rem,3.1vw,2.9rem)] leading-[1.15]"
            >
              {title}
            </LineReveal>
            <LineReveal
              as="p"
              className="mt-[clamp(18px,2vw,34px)] max-w-[880px] font-display text-[clamp(13px,1.05vw,16px)] leading-[1.6] text-brand-bunker"
            >
              {intro}
            </LineReveal>
            <LineReveal
              as="p"
              className="mt-[clamp(12px,1.2vw,20px)] font-display text-[clamp(12px,0.9vw,14px)] font-medium text-brand-bunker/60"
            >
              {`Last updated ${updated}`}
            </LineReveal>
          </div>

          <div className="container-page">
            <div className="mx-auto mt-[clamp(32px,3.5vw,60px)] w-full max-w-[880px]">
              {sections.map((section, i) => (
                <section
                  key={section.heading}
                  className={i === 0 ? "" : "mt-[clamp(28px,3vw,48px)]"}
                >
                  <LineReveal
                    as="h2"
                    className="font-display text-[clamp(1.05rem,1.5vw,1.5rem)] font-bold leading-[1.25] text-brand-navy"
                  >
                    {`${i + 1}. ${section.heading}`}
                  </LineReveal>

                  {section.paragraphs?.map((text, j) => (
                    <LineReveal key={j} as="p" className={`mt-[clamp(10px,1vw,16px)] ${body}`}>
                      {text}
                    </LineReveal>
                  ))}

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-[clamp(10px,1vw,16px)] list-disc space-y-[8px] pl-[22px] marker:text-brand-navy">
                      {section.bullets.map((text, j) => (
                        <LineReveal key={j} as="li" className={body}>
                          {text}
                        </LineReveal>
                      ))}
                    </ul>
                  )}

                  {section.after?.map((text, j) => (
                    <LineReveal key={j} as="p" className={`mt-[clamp(10px,1vw,16px)] ${body}`}>
                      {text}
                    </LineReveal>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
