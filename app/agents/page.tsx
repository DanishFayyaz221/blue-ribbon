import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { LineReveal } from "../_components/ui/LineReveal";
import { AgentCard } from "../_components/agents/AgentCard";
import { TeamIntro } from "../_components/agents/TeamIntro";
import { ContactForm } from "../_components/contact/ContactForm";
import { AgentAvatar } from "../_components/agents/AgentAvatar";
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
        {/* Mobile layout */}
        <div className="sm:hidden">
          <section className="relative w-full overflow-hidden">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/our-team/hero.png"
                alt="Blue Ribbon team"
                fill
                priority
                sizes="(max-width: 639px) 100vw, 1px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-brand-navy/60" />
              <div className="absolute inset-0 flex flex-col justify-end px-[22px] pb-[24px]">
                <LineReveal
                  as="h1"
                  trigger={false}
                  className="font-display font-bold text-white text-[32px] leading-[1.05]"
                >
                  Our Team
                </LineReveal>
                <LineReveal
                  as="p"
                  trigger={false}
                  className="mt-[10px] font-display text-white/85 text-[13px] leading-[1.5] max-w-[320px]"
                >
                  Meet the dedicated professionals behind Blue Ribbon Real Estate.
                </LineReveal>
              </div>
            </div>
          </section>

          {team.length > 0 && (
            <section className="container-page py-[22px]">
              <div className="grid grid-cols-2 gap-[12px]">
                {team.map((a) => (
                  <article
                    key={a.key}
                    className="overflow-hidden rounded-[14px] bg-[#F1F2F4] p-[10px]"
                  >
                    {/* Photo, name and role link through; the tel: link below
                        stays outside so one anchor never nests in another. */}
                    <Link href={a.href} className="block">
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[10px]">
                        <AgentAvatar name={a.name} image={a.image} sizes="50vw" />
                      </div>
                      <p className="mt-[10px] text-center font-display text-[14px] font-bold text-brand-bunker">
                        {a.name}
                      </p>
                      <p className="mt-[3px] text-center font-display text-[11.5px] text-brand-bunker/65">
                        {a.role}
                      </p>
                    </Link>
                    {(a.mobile ?? a.phone) && (
                      <a
                        href={`tel:${(a.mobile ?? a.phone ?? "").replace(/\s/g, "")}`}
                        className="mt-[6px] block text-center font-display text-[11px] font-semibold text-brand-navy"
                      >
                        {a.mobile ?? a.phone}
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="w-full bg-white">
            <div className="w-full">
              <div className="relative isolate overflow-hidden px-[24px] py-[32px]">
                <Image
                  src="/images/handshake-house.png"
                  alt=""
                  fill
                  sizes="(max-width: 639px) 100vw, 1px"
                  className="absolute inset-0 z-0 object-cover"
                />
                <div className="absolute inset-0 z-10 bg-brand-navy/85" />
                <div className="relative z-20">
                  <LineReveal
                    as="h2"
                    className="font-display font-bold text-white text-[25px] leading-[1.1]"
                  >
                    {"Want to get in touch\nwith us?"}
                  </LineReveal>
                  <LineReveal
                    as="p"
                    className="mt-[16px] font-display font-light text-white text-[14px] leading-[1.5]"
                  >
                    We’re all about offering supportive, expert advice every step of the way.
                  </LineReveal>
                  <Link
                    href="/contact"
                    className="mt-[20px] inline-flex h-[44px] items-center justify-center rounded-[22px] bg-white px-[24px] font-display text-[13px] font-medium text-black transition hover:bg-white/90"
                  >
                    Contact our Agent
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:block">
          <div className="container-page pt-[16px] pb-[16px]">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Our Team" }]} />
          </div>

          <TeamIntro />

          {team.length > 0 && (
            <section className="container-page mt-[clamp(60px,11vw,160px)]">
              {/* Staircase grid, per the comp: three columns, with the second
                  and third columns stepped down. The offsets sit on the cards
                  themselves, so every row of the grid repeats the same step. */}
              <div className="mx-auto grid max-w-[1030px] grid-cols-2 gap-[clamp(16px,1.7vw,24px)] md:grid-cols-3">
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

          <section className="container-page mt-[clamp(60px,8vw,120px)] mb-[clamp(44px,4vw,76px)]">
            <LineReveal
              as="h2"
              className="text-center font-display font-bold text-brand-navy text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.15]"
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
