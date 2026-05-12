import Image from "next/image";
import Link from "next/link";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
import { Button } from "../_components/ui/Button";
import { AgentCard, type AgentCardData } from "../_components/agents/AgentCard";

const agents: AgentCardData[] = Array.from({ length: 5 }, () => ({
  name: "Alex Smith",
  role: "Co-Founder | Chief Executive Officer",
  image: "/our-team/our-team.png",
}));

type MobileAgent = { name: string; role: string };
const mobileAgents: MobileAgent[] = [
  { name: "Vern KAN", role: "Principal / Director" },
  { name: "Sarah Chen", role: "Senior Agent" },
  { name: "James Patel", role: "Property Manager" },
  { name: "Lisa Wong", role: "Sales Agent" },
];

export default function AgentsPage() {
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
              <div className="absolute inset-0 flex flex-col justify-end px-[24px] pb-[28px]">
                <h1 className="font-display font-bold text-white text-[36px] leading-[1.05]">
                  Our Team
                </h1>
                <p className="mt-[12px] font-display text-white/85 text-[14px] leading-[1.5] max-w-[320px]">
                  Meet the dedicated professionals behind Blue Ribbon Real Estate.
                </p>
              </div>
            </div>
          </section>

          <section className="container-page py-[24px]">
            <div className="grid grid-cols-2 gap-[14px]">
              {mobileAgents.map((a, i) => (
                <article
                  key={i}
                  className="overflow-hidden rounded-[14px] bg-[#F1F2F4] p-[12px]"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[10px]">
                    <Image
                      src="/our-team/our-team.png"
                      alt={a.name}
                      fill
                      sizes="50vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <p className="mt-[12px] text-center font-display text-[15px] font-bold text-brand-bunker">
                    {a.name}
                  </p>
                  <p className="mt-[4px] text-center font-display text-[12px] text-brand-bunker/65">
                    {a.role}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="w-full bg-white">
            <div className="w-full">
              <div className="relative isolate overflow-hidden px-[28px] py-[36px]">
                <Image
                  src="/images/handshake-house.png"
                  alt=""
                  fill
                  sizes="(max-width: 639px) 100vw, 1px"
                  className="absolute inset-0 z-0 object-cover"
                />
                <div className="absolute inset-0 z-10 bg-brand-navy/85" />
                <div className="relative z-20">
                  <h2 className="font-display font-bold text-white text-[28px] leading-[1.1]">
                    Want to get in touch
                    <br />
                    with us?
                  </h2>
                  <p className="mt-[18px] font-display font-light text-white text-[15px] leading-[1.5]">
                    We&rsquo;re all about offering supportive, expert advice every step of
                    the way.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-[24px] inline-flex h-[48px] items-center justify-center rounded-[24px] border border-white px-[28px] font-display text-[14px] font-medium text-white transition hover:bg-white/10"
                  >
                    Contact our Agent
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Desktop layout (unchanged) */}
        <div className="hidden sm:block">
          <div className="container-page pt-[16px] pb-[16px]">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Our Team" }]} />
          </div>

          <section className="container-page">
            <div className="relative aspect-[1771/898] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)] bg-brand-soft">
              <Image
                src="/our-team/hero.png"
                alt="Blue Ribbon team"
                fill
                priority
                sizes="(max-width: 639px) 1px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-[clamp(20px,3vw,48px)] flex items-center justify-center">
              </div>
            </div>
          </section>

          <section className="container-page mt-[clamp(48px,4vw,80px)]">
            <h2 className="font-display font-bold text-brand-bunker text-[clamp(1.5rem,2.1vw,2.5rem)] leading-[1.15]">
              Meet our Team
            </h2>
            <div className="mt-[clamp(32px,2.5vw,48px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,1.8vw,32px)]">
              {agents.map((a, i) => (
                <AgentCard key={i} {...a} />
              ))}
            </div>
          </section>

          <section className="w-full mt-[clamp(56px,5vw,96px)] bg-brand-navy">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="flex items-center px-[clamp(24px,14vw,280px)] py-[clamp(48px,4vw,72px)]">
                <div className="w-full max-w-[360px]">
                  <h2 className="font-display font-medium text-white text-[clamp(1.4rem,1.7vw,2rem)] leading-[1.1]">
                    Ready to start?
                  </h2>
                  <p className="mt-[clamp(8px,0.7vw,14px)] font-display font-light text-white text-[clamp(1.4rem,1.7vw,2rem)] leading-[1.15]">
                    Connect with a Blueribbon specialist in Parramatta
                  </p>
                  <p className="mt-[clamp(20px,1.6vw,32px)] font-display text-white/90 text-[12px] sm:text-[13px] font-normal leading-[1.5] tracking-[0.02em]">
                    We provide the local expertise and supportive advice needed to navigate
                    the Western Sydney market with confidence. From your first inquiry to the
                    final signature, we ensure your property journey is seamless, transparent,
                    and rewarding.
                  </p>
                  <div className="mt-[clamp(24px,1.8vw,36px)]">
                    <Button href="/contact" variant="outline" size="md">
                      Contact our Agent
                    </Button>
                  </div>
                </div>
              </div>
              <div className="relative h-[260px] sm:h-[360px] lg:h-auto lg:min-h-[420px] overflow-hidden">
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
