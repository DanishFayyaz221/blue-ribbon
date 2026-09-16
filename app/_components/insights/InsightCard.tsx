import Image from "next/image";
import Link from "next/link";
import { ParallaxFigure } from "../ui/ParallaxFigure";
import { articleHref, type InsightArticle } from "@/lib/insights/articles";

/**
 * One article in a Market Insights grid: a tall rounded photo, the title, and
 * the read time, linking through to the article page. The photo slides into
 * place and eases out of a slight zoom as the card enters, and lifts on
 * hover — the same treatment as the team cards on the agents page.
 */
export function InsightCard({
  article,
  feature = false,
}: {
  article: InsightArticle;
  /**
   * The phone carousel's card: one article fills the screen width, so the
   * title and read time step up to the mobile comp's sizes and the photo is
   * requested at full width. From sm it is the same grid card as always.
   */
  feature?: boolean;
}) {
  return (
    <Link href={articleHref(article.slug)} className="group block w-full">
      <div className="relative aspect-[172/245] w-full overflow-hidden rounded-[14px] sm:rounded-[clamp(10px,0.9vw,14px)]">
        <ParallaxFigure
          anchor="top"
          className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        >
          <Image
            src={article.image}
            alt=""
            fill
            sizes={
              feature
                ? "(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            }
            className="object-cover"
          />
        </ParallaxFigure>
      </div>
      <h3
        className={`mt-[clamp(12px,1.1vw,18px)] font-display font-medium leading-[1.4] text-brand-bunker ${
          feature ? "text-[18px] sm:text-[clamp(12px,0.9vw,14px)]" : "text-[clamp(12px,0.9vw,14px)]"
        }`}
      >
        {article.title}
      </h3>
      <p
        className={`mt-[clamp(8px,0.8vw,14px)] font-display text-brand-bunker/70 ${
          feature ? "text-[15px] sm:text-[clamp(11px,0.78vw,12px)]" : "text-[clamp(11px,0.78vw,12px)]"
        }`}
      >
        {article.readMinutes} min read
      </p>
    </Link>
  );
}
