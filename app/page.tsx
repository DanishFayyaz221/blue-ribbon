import { Suspense } from "react";
import { connection } from "next/server";
import { Nav } from "./_components/layout/Nav";
import { Footer } from "./_components/layout/Footer";
import { Hero } from "./_components/home/Hero";
import { BridgeToHome } from "./_components/home/BridgeToHome";
import { BestSuitedForYou } from "./_components/home/BestSuitedForYou";
import { ParramattaCTA } from "./_components/home/ParramattaCTA";
import { LatestProperties } from "./_components/home/LatestProperties";
import { MeetHappyClients } from "./_components/home/MeetHappyClients";
import { SellWithUs } from "./_components/home/SellWithUs";
import { SuburbOptions } from "./_components/property/SuburbOptions";
import { SectionBoundary } from "./_components/SectionBoundary";
import { getListings } from "@/lib/db/queries";

export default async function Home() {
  // Fetch explore-property IDs so LatestProperties can exclude them.
  // getListings is cached — BestSuitedForYou calls it with the same args and
  // hits the cache, so this costs no extra round-trip.
  await connection();
  const { items: exploreItems } = await getListings({ sort: "price-asc", perPage: 6 }).catch(() => ({ items: [] }));
  const exploreIds = exploreItems.map((p) => p.id);

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
            <LatestProperties excludeIds={exploreIds} />
          </Suspense>
        </SectionBoundary>
        <MeetHappyClients />
        <SellWithUs />
      </main>
      <Footer />
    </div>
  );
}
