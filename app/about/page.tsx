import { Nav } from "../_components/Nav";
import { AboutHero } from "../_components/AboutHero";
import { AboutContent } from "../_components/AboutContent";
import { Footer } from "../_components/Footer";

export const metadata = {
  title: "About Us | Blue Ribbon Real Estate",
  description: "Your Home, Our Priority. Meet the Blue Ribbon Realtors team.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-[1920px] bg-white">
      <Nav />
      <main>
        <AboutHero />
        <AboutContent />
      </main>
      <Footer />
    </div>
  );
}
