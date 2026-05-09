import { Hero } from "./_components/Hero";
import { BridgeToHome } from "./_components/BridgeToHome";
import { BestSuitedForYou } from "./_components/BestSuitedForYou";
import { ParramattaCTA } from "./_components/ParramattaCTA";
import { LatestProperties } from "./_components/LatestProperties";
import { HappyClients } from "./_components/HappyClients";
import { SellWithUs } from "./_components/SellWithUs";
import { Footer } from "./_components/Footer";

export default function Home() {
  return (
    <>
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
    </>
  );
}
