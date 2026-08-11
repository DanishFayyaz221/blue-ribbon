import { Suspense } from "react";
import { Nav } from "./_components/layout/Nav";
import { Footer } from "./_components/layout/Footer";
import { Hero } from "./_components/home/Hero";
import { BridgeToHome } from "./_components/home/BridgeToHome";
import { BestSuitedForYou } from "./_components/home/BestSuitedForYou";
import { ParramattaCTA } from "./_components/home/ParramattaCTA";
import { LatestProperties } from "./_components/home/LatestProperties";
import { HappyClients } from "./_components/home/HappyClients";
import { SellWithUs } from "./_components/home/SellWithUs";
import { SuburbOptions } from "./_components/property/SuburbOptions";
import { SectionBoundary } from "./_components/SectionBoundary";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <Hero />
        {/* The hero's autocomplete values. Kept outside the hero and streamed
            so the search box paints immediately rather than waiting on Mongo.
            The search box still works without its suggestions. */}
        <SectionBoundary>
          <Suspense fallback={null}>
            <SuburbOptions id="hero-suburbs" />
          </Suspense>
        </SectionBoundary>
        <BridgeToHome />
        {/* Streamed: the static parts of the page ship immediately, while the
            listing-backed sections wait on the database. Separate boundaries so
            a slow query in one does not hold up the other.
            Each is also wrapped in a SectionBoundary, because Suspense covers a
            pending query but not a failed one — the home page must survive an
            unreachable database, since most of what is on it needs no data. */}
        <SectionBoundary>
          <Suspense fallback={null}>
            <BestSuitedForYou />
          </Suspense>
        </SectionBoundary>
        <SectionBoundary>
          <Suspense fallback={null}>
            <ParramattaCTA />
          </Suspense>
        </SectionBoundary>
        <SectionBoundary>
          <Suspense fallback={null}>
            <LatestProperties />
          </Suspense>
        </SectionBoundary>
        <HappyClients />
        <SellWithUs />
      </main>
      <Footer />
    </div>
  );
}
