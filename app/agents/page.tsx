import Image from "next/image";
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

export default function AgentsPage() {
  console.log(" 🚀 AgentsPage rendered");
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
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
              sizes="100vw"
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
      </main>
      <Footer />
    </div>
  );
}
