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
    <section className="w-full bg-brand-navy py-[clamp(56px,5vw,96px)]">
      <div className="container-page">
        <h2 className="mx-auto max-w-[900px] text-center font-display font-bold text-white text-[clamp(1.4rem,1.9vw,2.2rem)] leading-[1.25]">
          <span className="block">Through our local insight and commitment, we aim to</span>
          <span className="block">deliver premium results that truly stand out.</span>
        </h2>
        <p className="mx-auto mt-[clamp(20px,1.6vw,28px)] max-w-[520px] text-center font-display font-normal text-white/90 text-[12px] sm:text-[13px] leading-[1.65] tracking-[0.01em]">
          Our passion for quality service, extensive market expertise, and bespoke strategy
          are all focused on securing the highest potential value throughout your property
          journey.
        </p>

        <div className="mt-[clamp(40px,3.5vw,72px)] grid grid-cols-1 sm:grid-cols-3 gap-[clamp(24px,2.5vw,56px)]">
          {values.map((v) => (
            <div key={v.title}>
              <h3 className="font-display text-[16px] sm:text-[18px] font-semibold text-white">
                {v.title}
              </h3>
              <p className="mt-[12px] font-display text-white/85 text-[12px] sm:text-[13px] leading-[1.65] tracking-[0.01em]">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}