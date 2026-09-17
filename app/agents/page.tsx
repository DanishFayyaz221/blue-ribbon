import { connection } from "next/server";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { LineReveal } from "../_components/ui/LineReveal";
import { AgentCard } from "../_components/agents/AgentCard";
import { TeamIntro } from "../_components/agents/TeamIntro";
import { ContactForm } from "../_components/contact/ContactForm";
import { MobileCarousel } from "../_components/ui/MobileCarousel";
import { getAgents } from "@/lib/db/queries";
import { profileFor } from "@/lib/agents/profiles";

export const metadata = {
  title: "Our Team | Blue Ribbon Real Estate",
  description:
    "Meet the team behind Blue Ribbon Real Estate, servicing Parramatta and Western Sydney.",
};

export default async function AgentsPage() {
  // Defer to request time: the team list comes from the live feed, so it must
  // not be frozen into the build output.
  await connection();

  const feedAgents = await getAgents();

  // Names on this page are statements about who works at the agency, so the
  // list is built strictly from agents the feed actually returns. Photos and
  // roles come from the local profile map; contact details come from Agentbox.
  // The card links to the agent's own page, not `mailto:`. The card shows a
  // listing count, and a visitor clicking that expects the listings — opening
  // a mail client instead was the one thing it could not have meant.
  const team = feedAgents.map((agent) => ({
    ...agent,
    ...profileFor(agent.email),
    href: `/agents/${agent.slug}`,
  }));

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        {/* One flow for every size: the mobile comp is this same sequence
            stacked, with the team as a one-card carousel on the phone. */}
        <div>
          <div className="container-page pt-[16px] pb-[16px]">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Our Team" }]} />
          </div>

          <TeamIntro />

          {team.length > 0 && (
            <section className="container-page mt-[28px] sm:mt-[clamp(60px,11vw,160px)]">
              {/* Phone: one agent at a time. The round arrows sit beside the
                  name and details, to the right, where the mobile comp puts
                  them, so the details block keeps that side clear. */}
              <MobileCarousel
                ariaLabel="Our team"
                className="sm:hidden"
                arrowsClassName="-mt-[92px] justify-end"
                items={team.map((a) => (
                  <AgentCard
                    key={a.key}
                    name={a.name}
                    role={a.role}
                    image={a.image}
                    email={a.email}
                    phone={a.mobile ?? a.phone}
                    listingCount={a.listingCount}
                    href={a.href}
                    aspect="aspect-[4/5]"
                    // Room for the two arrows overlaid on this block: 48px
                    // each plus the 8px gap is 104px, and the rest is breathing
                    // space. It was 176px, sized for the old 60px arrows and
                    // generous even then — on a narrow phone that reserved
                    // enough width to truncate the email mid-domain.
                    detailsClassName="pr-[116px]"
                  />
                ))}
              />

              {/* Staircase grid, per the comp: three columns, with the second
                  and third columns stepped down. The offsets sit on the cards
                  themselves, so every row of the grid repeats the same step. */}
              <div className="mx-auto hidden max-w-[1030px] grid-cols-2 gap-[clamp(16px,1.7vw,24px)] sm:grid md:grid-cols-3">
                {team.map((a, i) => (
                  <div
                    key={a.key}
                    className={
                      i % 3 === 1
                        ? "md:mt-[clamp(40px,6.4vw,92px)]"
                        : i % 3 === 2
                          ? "md:mt-[clamp(80px,12.8vw,184px)]"
                          : ""
                    }
                  >
                    <AgentCard
                      name={a.name}
                      role={a.role}
                      image={a.image}
                      email={a.email}
                      phone={a.mobile ?? a.phone}
                      listingCount={a.listingCount}
                      href={a.href}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="container-page mt-[44px] sm:mt-[clamp(60px,8vw,120px)] mb-[clamp(44px,4vw,76px)]">
            <LineReveal
              as="h2"
              className="text-center font-display font-bold text-brand-navy text-[24px] sm:text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.15]"
            >
              Get In Touch
            </LineReveal>
            <div className="mx-auto mt-[clamp(24px,2.25vw,42px)] w-full max-w-[680px]">
              <ContactForm variant="team" />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
