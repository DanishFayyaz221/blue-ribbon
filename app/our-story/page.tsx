import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { AboutHero } from "../_components/AboutHero";
import { AboutContent } from "../_components/AboutContent";
import { KnowUsBetter } from "../_components/KnowUsBetter";
import { FounderQuote } from "../_components/FounderQuote";

export const metadata = {
  title: "Our Story | Blue Ribbon Real Estate",
  description: "Your Home, Our Priority. Meet the Blue Ribbon Realtors team.",
};

/**
 * One set of sections at every size. The mobile comp is the desktop page
 * stacked — video hero, Know Us better, the three content rows, the founder's
 * quote — so each section carries its own phone treatment rather than the
 * page swapping in a different layout below sm, as it used to. The breadcrumb
 * is desktop-only: the phone comp runs the hero straight under the nav.
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <div className="hidden sm:block container-page pt-[16px] pb-[16px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Our Story" }]} />
        </div>
        <AboutHero />
        <KnowUsBetter />
        <AboutContent />
        <FounderQuote />
      </main>
      <Footer />
    </div>
  );
}
