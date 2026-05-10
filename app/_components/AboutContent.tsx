import Image from "next/image";

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
    <section className="w-[1920px] bg-white pb-[96px] pt-[40px]">
      <div className="mx-[74.667px] w-[1770.667px]">
        <div className="flex items-start justify-between gap-[64px]">
          <div className="w-[760px] pt-[24px]">
            <h2 className="font-display text-[40px] font-bold leading-[48px] tracking-[-0.5px] text-brand-navy">
              Your Australian
              <br />
              Property Partners
            </h2>
            <p className="mt-[28px] font-display text-[14.5px] font-medium leading-[26px] text-[#11181c]">
              Established to redefine excellence, Blue Ribbon Real Estate has
              rapidly emerged as a premier agency and a respected industry
              leader across the Australian market.
            </p>
            <p className="mt-[20px] font-display text-[14.5px] font-medium leading-[26px] text-[#11181c]">
              Committed to raising the bar, Blue Ribbon was founded to transform
              the real estate experience through a dedication to integrity and
              local expertise. Our service focuses on more than just
              transactions; it is about supporting our clients&apos; lifestyles,
              financial growth, and long-term security.
            </p>
          </div>
          <div className="relative h-[440px] w-[860px] overflow-hidden rounded-[8px]">
            <Image
              src="/about-us-images/image 5.png"
              alt="Blue Ribbon agent meeting with clients"
              fill
              sizes="860px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-[96px] flex items-start justify-between gap-[64px]">
          <div className="relative h-[440px] w-[860px] overflow-hidden rounded-[8px]">
            <Image
              src="/about-us-images/image 6.png"
              alt="Blue Ribbon team with happy clients"
              fill
              sizes="860px"
              className="object-cover"
            />
          </div>
          <div className="w-[760px] pt-[24px]">
            <h2 className="font-display text-[40px] font-bold leading-[48px] tracking-[-0.5px] text-brand-navy">
              Your Excellence
              <br />
              In Property
            </h2>
            <p className="mt-[28px] font-display text-[14.5px] font-medium leading-[26px] text-[#11181c]">
              Blue Ribbon is driven by a team of dynamic professionals united by
              a singular passion to secure the absolute best results for every
              Australian homeowner. Blending modern innovation with traditional
              integrity, our steadfast commitment to these core principles
              distinguishes us within the competitive retail market. By
              constantly evolving and refining our expertise, we provide an
              elevated standard of service designed to exceed your property
              goals.
            </p>
            <p className="mt-[20px] font-display text-[14.5px] font-medium leading-[26px] text-[#11181c]">
              Trust that your most significant investment is managed with the
              highest level of care.
            </p>
          </div>
        </div>

        <div className="mt-[96px] grid grid-cols-3 gap-[56px]">
          {values.map((v) => (
            <div key={v.title}>
              <h3 className="font-display text-[17px] font-bold leading-[24px] text-brand-navy">
                {v.title}
              </h3>
              <p className="mt-[16px] font-display text-[13.5px] font-medium leading-[22px] text-[#11181c]">
                {v.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-[56px]">
          <a
            href="#"
            className="inline-flex h-[44px] items-center justify-center rounded-[28px] border border-brand-navy px-[28px] font-display text-[13.5px] font-medium text-brand-navy transition hover:bg-brand-navy hover:text-white"
          >
            Contact Team
          </a>
        </div>
      </div>
    </section>
  );
}
