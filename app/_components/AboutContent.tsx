import Image from "next/image";
import { Button } from "./ui/Button";

const values = [
  {
    title: "Unity",
    body: "We pride ourselves on our togetherness. Sharing knowledge and experience across the whole team in collaboration creates a unified group of individuals who share an undying passion for our clients goals.",
  },
  {
    title: "Humility",
    body: "We place the needs of others above our own and think of others before ourselves. Acknowledging excellence while humbly understanding everyone has knowledge to add to any situation is how we strive to carry ourselves with each other and our clients.",
  },
  {
    title: "Excellence",
    body: "Excellence is a quality we pride ourselves on, not only in how we carry ourselves but also in the results we strive for. As leaders of the real estate industry we aim to continue to exceed expectations and deliver excellence in everything that we do.",
  },
];

export function AboutContent() {
  return (
    <section className="w-full bg-white pb-[clamp(44px,4vw,76px)] pt-[clamp(24px,2.4vw,44px)]">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-[clamp(24px,2.7vw,56px)]">
          <div>
            <h2 className="font-display font-bold text-brand-navy text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15] tracking-[-0.01em]">
              Your Australian
              <br />
              Property Partners
            </h2>
            <p className="mt-[clamp(18px,1.45vw,25px)] font-display text-[13px] sm:text-[14px] font-normal leading-[1.7] text-brand-bunker">
              Established to redefine excellence, Blue Ribbon Real Estate has rapidly
              emerged as a premier agency and a respected industry leader across the
              Australian market.
            </p>
            <p className="mt-[14px] font-display text-[13px] sm:text-[14px] font-normal leading-[1.7] text-brand-bunker">
              Committed to raising the bar, Blue Ribbon was founded to transform the
              real estate experience through a dedication to integrity and local
              expertise. Our service focuses on more than just transactions; it is about
              supporting our clients&rsquo; lifestyles, financial growth, and long-term
              security.
            </p>
          </div>
          <div className="relative aspect-[860/440] w-full overflow-hidden rounded-[clamp(6px,0.5vw,10px)]">
            <Image
              src="/about-us-images/image 5.png"
              alt="Blue Ribbon agent meeting with clients"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-[clamp(64px,6vw,120px)] grid grid-cols-1 lg:grid-cols-2 items-center gap-[clamp(24px,2.7vw,56px)]">
          <div className="relative aspect-[860/440] w-full overflow-hidden rounded-[clamp(6px,0.5vw,10px)] lg:order-1">
            <Image
              src="/about-us-images/image 6.png"
              alt="Blue Ribbon team with happy clients"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="lg:order-2">
            <h2 className="font-display font-bold text-brand-navy text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15] tracking-[-0.01em]">
              Your Excellence
              <br />
              In Property
            </h2>
            <p className="mt-[clamp(18px,1.45vw,25px)] font-display text-[13px] sm:text-[14px] font-normal leading-[1.7] text-brand-bunker">
              Blue Ribbon is driven by a team of dynamic professionals united by a
              singular passion to secure the absolute best results for every Australian
              homeowner. Blending modern innovation with traditional integrity, our
              steadfast commitment to these core principles distinguishes us within the
              competitive retail market. By constantly evolving and refining our
              expertise, we provide an elevated standard of service designed to exceed
              your property goals.
            </p>
            <p className="mt-[14px] font-display text-[13px] sm:text-[14px] font-normal leading-[1.7] text-brand-bunker">
              Trust that your most significant investment is managed with the highest
              level of care.
            </p>
          </div>
        </div>

        <div className="mt-[clamp(38px,3.15vw,76px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,2.25vw,50px)]">
          {values.map((v) => (
            <div key={v.title}>
              <h3 className="font-display text-[15px] sm:text-[17px] font-bold text-[#000000]">
                {v.title}
              </h3>
              <p className="mt-[10px] font-display text-[12px] sm:text-[13px] font-normal leading-[1.7] text-brand-bunker">
                {v.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-[clamp(32px,2.7vw,50px)]">
          <Button href="/contact" variant="outline-dark" size="sm" className="!h-[52px] !px-[24px] !text-[15px]">
            Contact Team
          </Button>
        </div>
      </div>
    </section>
  );
}
