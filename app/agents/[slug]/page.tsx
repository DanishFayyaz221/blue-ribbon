import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Nav } from "../../_components/layout/Nav";
import { Footer } from "../../_components/layout/Footer";
import { Breadcrumb } from "../../_components/ui/Breadcrumb";
import { Button } from "../../_components/ui/Button";
import { AgentAvatar } from "../../_components/agents/AgentAvatar";
import { PropertyCard } from "../../_components/property/PropertyCard";
import { GetInTouchCTA } from "../../_components/sections/GetInTouchCTA";
import { getAgents, getListingsByAgent, type FeedAgent } from "@/lib/db/queries";
import { profileFor } from "@/lib/agents/profiles";

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Resolves the URL segment against the live team list.
 *
 * Slugs are derived in `getAgents` rather than stored, so there is no lookup
 * by slug in the data layer — and there should not be one, since the list is
 * five people and already cached per request.
 */
async function findAgent(slug: string): Promise<FeedAgent | undefined> {
  return (await getAgents()).find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const agent = await findAgent(slug);

  if (!agent) return { title: "Agent not found | Blue Ribbon Real Estate" };

  const { role } = profileFor(agent.email);
  return {
    title: `${agent.name} — ${role} | Blue Ribbon Real Estate`,
    description: `Contact ${agent.name}, ${role} at Blue Ribbon Real Estate, and browse their current listings across Western Sydney.`,
    alternates: { canonical: `/agents/${agent.slug}` },
  };
}

export default async function AgentDetailPage({ params }: PageProps) {
  // Defer to request time: both the team list and the listings come from the
  // live feed, so neither may be frozen into the build output.
  await connection();

  const { slug } = await params;
  const agent = await findAgent(slug);
  if (!agent) notFound();

  const profile = profileFor(agent.email);
  const listings = await getListingsByAgent(agent.key);
  const tel = (agent.mobile ?? agent.phone ?? "").replace(/\s/g, "");

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <div className="container-page pt-[16px] pb-[8px]">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Our Team", href: "/agents" },
              { label: agent.name },
            ]}
          />
        </div>

        {/* Profile */}
        <section className="container-page mt-[clamp(12px,1.5vw,24px)]">
          <div className="grid grid-cols-1 gap-[clamp(20px,2.4vw,44px)] sm:grid-cols-[minmax(0,300px)_1fr] sm:items-start">
            <div className="relative aspect-[37/50] w-full max-w-[300px] overflow-hidden rounded-[clamp(16px,1.7vw,32px)]">
              <AgentAvatar
                name={agent.name}
                image={profile.image}
                sizes="(max-width: 640px) 100vw, 300px"
              />
            </div>

            <div>
              <h1 className="font-display font-bold text-brand-bunker text-[clamp(1.5rem,2.4vw,2.6rem)] leading-[1.1]">
                {agent.name}
              </h1>
              <p className="mt-[6px] font-display text-[clamp(14px,1vw,18px)] font-medium text-brand-navy">
                {profile.role}
              </p>

              {profile.bio && (
                <p className="mt-[clamp(14px,1.2vw,22px)] max-w-[680px] font-display text-[clamp(13px,0.95vw,16px)] leading-[1.7] text-brand-bunker/85">
                  {profile.bio}
                </p>
              )}

              <p className="mt-[clamp(14px,1.2vw,22px)] font-display text-[clamp(13px,0.9vw,15px)] text-brand-bunker/70">
                {agent.listingCount} current{" "}
                {agent.listingCount === 1 ? "listing" : "listings"}
              </p>

              <div className="mt-[clamp(16px,1.4vw,26px)] flex flex-wrap items-center gap-[12px]">
                {tel && (
                  <Button href={`tel:${tel}`} variant="primary" size="md">
                    {agent.mobile ?? agent.phone}
                  </Button>
                )}
                {agent.email && (
                  /* outline-dark, not outline: the plain outline variant is
                     white-on-dark and would vanish on this white page. */
                  <Button href={`mailto:${agent.email}`} variant="outline-dark" size="md">
                    Email {agent.name.split(/\s+/)[0]}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Their listings */}
        <section className="container-page mt-[clamp(36px,3.6vw,72px)]">
          <h2 className="font-display font-bold text-brand-bunker text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]">
            {agent.name.split(/\s+/)[0]}&rsquo;s Listings
          </h2>

          {listings.length > 0 ? (
            <div className="focus-peers mt-[clamp(22px,2vw,36px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(12px,1.3vw,24px)]">
              {listings.map((p) => (
                <PropertyCard key={p.id} {...p} variant="tall" />
              ))}
            </div>
          ) : (
            /* getAgents only counts agents who appear on a published listing,
               so this is all but unreachable — it covers the window where a
               listing is unpublished between the two queries. */
            <p className="mt-[clamp(16px,1.4vw,24px)] font-display text-[clamp(13px,0.95vw,16px)] text-brand-bunker/70">
              No published listings right now. Get in touch and{" "}
              {agent.name.split(/\s+/)[0]} will let you know what is coming up.
            </p>
          )}
        </section>

        <div className="mt-[clamp(44px,4vw,76px)]">
          <GetInTouchCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
