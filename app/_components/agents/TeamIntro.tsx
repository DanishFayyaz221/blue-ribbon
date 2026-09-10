import { LineReveal } from "../ui/LineReveal";

/**
 * Intro at the top of the Our Team page: a centred "Our Team" pill, the
 * heading and two paragraphs, in the same treatment as the About page's
 * "Know Us better!" band so the pages read as one system.
 */
export function TeamIntro() {
  return (
    <section className="w-full bg-white pt-[clamp(28px,3.5vw,60px)]">
      <div className="container-page flex flex-col items-center text-center">
        <span className="rounded-[8px] bg-brand-navy px-[16px] py-[7px] font-display text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
          Our Team
        </span>
        <LineReveal
          as="h1"
          className="mt-[clamp(18px,1.8vw,32px)] font-display font-bold text-brand-bunker text-[clamp(1.5rem,3.1vw,2.9rem)] leading-[1.15]"
        >
          The Blue Ribbon Difference
        </LineReveal>
        <LineReveal
          as="p"
          className="mt-[clamp(18px,2vw,34px)] max-w-[960px] font-display text-[clamp(13px,1.05vw,16px)] leading-[1.6] text-brand-bunker"
        >
          Behind every successful sale at Blue Ribbon is a team that genuinely cares
          about the people they serve. We are a group of local specialists who know
          this corner of Australia intimately, and we bring that knowledge to every
          conversation, every appraisal, and every negotiation. What unites us is a
          shared belief that great real estate is built on honesty, hard work, and
          treating each client like family.
        </LineReveal>
        <LineReveal
          as="p"
          className="mt-[clamp(16px,1.6vw,26px)] max-w-[960px] font-display text-[clamp(13px,1.05vw,16px)] leading-[1.6] text-brand-bunker"
        >
          At Blue Ribbon, we listen first, give you honest advice and stay with you
          from the first chat to the final signature. Meet the local team that makes
          the difference.
        </LineReveal>
      </div>
    </section>
  );
}
