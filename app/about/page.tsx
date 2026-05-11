import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { AboutHero } from "../_components/AboutHero";
import { AboutContent } from "../_components/AboutContent";

export const metadata = {
  title: "About Us | Blue Ribbon Real Estate",
  description: "Your Home, Our Priority. Meet the Blue Ribbon Realtors team.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <div className="container-page pt-[16px] pb-[16px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
        </div>
        <AboutHero />
        <AboutContent />
      </main>
      <Footer />
    </div>
  );
}
