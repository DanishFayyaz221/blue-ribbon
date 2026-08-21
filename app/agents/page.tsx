import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { Button } from "../_components/ui/Button";
import { AgentCard } from "../_components/agents/AgentCard";
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
                <h1 className="font-display font-bold text-white text-[32px] leading-[1.05]">
                  Our Team
                </h1>
                <p className="mt-[10px] font-display text-white/85 text-[13px] leading-[1.5] max-w-[320px]">
                  Meet the dedicated professionals behind Blue Ribbon Real Estate.
                </p>
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
                  <h2 className="font-display font-bold text-white text-[25px] leading-[1.1]">
                    Want to get in touch
                    <br />
                    with us?
                  </h2>
                  <p className="mt-[16px] font-display font-light text-white text-[14px] leading-[1.5]">
                    We&rsquo;re all about offering supportive, expert advice every step of
                    the way.
                  </p>
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

          <section className="container-page">
            <div className="relative aspect-[1771/780] max-h-[560px] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)] bg-brand-soft">
              <Image
                src="/our-team/hero.png"
                alt="Blue Ribbon team"
                fill
                priority
                sizes="(max-width: 639px) 1px, 100vw"
                className="object-cover"
              />
            </div>
          </section>

          {team.length > 0 && (
            <section className="container-page mt-[clamp(38px,3.15vw,64px)]">
              <h2 className="font-display font-bold text-brand-bunker text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]">
                Meet our Team
              </h2>
              <div className="mt-[clamp(28px,2.25vw,42px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(18px,1.6vw,28px)]">
                {team.map((a) => (
                  <AgentCard
                    key={a.key}
                    name={a.name}
                    role={a.role}
                    image={a.image}
                    email={a.email}
                    phone={a.mobile ?? a.phone}
                    listingCount={a.listingCount}
                    href={a.href}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="relative w-full mt-[clamp(44px,4vw,76px)] overflow-hidden">
            <Image
              src="/images/bg.png"
              alt=""
              fill
              quality={90}
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#001F4D1F] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
              <div className="flex items-center px-[clamp(22px,9vw,180px)] py-[clamp(38px,3.15vw,56px)]">
                <div className="w-full max-w-[520px]">
                  <h2 className="font-display font-semibold text-white text-[clamp(1.9rem,2.6vw,3rem)] leading-[1.05]">
                    Ready to start?
                  </h2>
                  <p className="mt-[clamp(12px,1vw,18px)] font-display font-[300] text-white text-[clamp(1.9rem,3vw,3.25rem)] leading-[1.07]">
                    Connect with a Blueribbon specialist in Parramatta
                  </p>
                  <p className="mt-[clamp(20px,1.6vw,30px)] font-display text-white/90 text-[13px] sm:text-[15px] font-normal leading-[1.55] tracking-[0.02em]">
                    We provide the local expertise and supportive advice needed to navigate
                    the Western Sydney market with confidence. From your first inquiry to the
                    final signature, we ensure your property journey is seamless, transparent,
                    and rewarding.
                  </p>
                  <div className="mt-[clamp(20px,1.6vw,32px)]">
                    <Button href="/contact" variant="white" size="md">
                      Contact our Agent
                    </Button>
                  </div>
                </div>
              </div>
              <div className="relative h-[240px] sm:h-[325px] lg:h-auto lg:min-h-[380px] overflow-hidden">
                <Image
                  src="/our-team/team-s.png"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
