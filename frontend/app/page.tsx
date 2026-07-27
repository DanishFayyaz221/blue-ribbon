import { Nav } from "./_components/layout/Nav";
import { Footer } from "./_components/layout/Footer";
import { Hero } from "./_components/home/Hero";
import { BridgeToHome } from "./_components/home/BridgeToHome";
import { BestSuitedForYou } from "./_components/home/BestSuitedForYou";
import { ParramattaCTA } from "./_components/home/ParramattaCTA";
import { LatestProperties } from "./_components/home/LatestProperties";
import { HappyClients } from "./_components/home/HappyClients";
import { SellWithUs } from "./_components/home/SellWithUs";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <Hero />
        <BridgeToHome />
        <BestSuitedForYou />
        <ParramattaCTA />
        <LatestProperties />
        <HappyClients />
        <SellWithUs />
      </main>
      <Footer />
    </div>
  );
}
