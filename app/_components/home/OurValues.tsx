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

export function OurValues() {
  return (
    <section className="relative w-full overflow-hidden pt-[clamp(32px,3vw,60px)] pb-[clamp(64px,6vw,120px)]">
      {/* Navy fabric background — ParramattaCTA jaisa */}
      <Image
        src="/images/bg.png"
        alt=""
        fill
        quality={90}
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Navy overlay (#001F4D @ ~12%) */}
      <div className="absolute inset-0 bg-[#001F4D1F] pointer-events-none" />

      <div className="relative z-10 container-page">
        <h2 className="relative -left-[clamp(12px,2vw,40px)] mx-auto max-w-[960px] text-center font-display font-bold text-white text-[clamp(1.5rem,2.4vw,2.6rem)] leading-[1.25] sm:whitespace-nowrap">
          Through our local insight and commitment, we aim to
          <br />
          <span className="relative left-[clamp(30px,3.8vw,76px)]">
            deliver premium results that truly stand out.
          </span>
        </h2>
        <p className="mx-auto mt-[clamp(18px,1.45vw,25px)] max-w-[600px] text-center font-display font-normal text-white/90 text-[11.5px] sm:text-[12.5px] leading-[1.65] tracking-[0.01em]">
          Our passion for quality service, extensive market expertise,
          <br />
          and bespoke strategy are all focused on securing the highest potential
          <br />
          value throughout your property journey.
        </p>

        <div className="mt-[clamp(36px,3.15vw,64px)] grid grid-cols-1 sm:grid-cols-3 gap-[clamp(20px,2.25vw,50px)]">
          {values.map((v) => (
            <div key={v.title}>
              <h3 className="font-display text-[15px] sm:text-[17px] font-semibold text-white">
                {v.title}
              </h3>
              {/* Title ke neeche line — image jaisa */}
              <div className="mt-[12px] h-[2px] w-full bg-white/25" />
              <p className="mt-[16px] font-display text-white/85 text-[11.5px] sm:text-[12.5px] leading-[1.65] tracking-[0.01em]">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}