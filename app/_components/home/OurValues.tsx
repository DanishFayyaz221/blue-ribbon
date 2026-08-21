const values = [
  {
    title: "Unity",
    body: "We pride ourselves on our togetherness. Sharing knowledge and experience across the whole team creates a unified group who share an undying passion for our clients goals.",
  },
  {
    title: "Humility",
    body: "We place the needs of others above our own. Acknowledging excellence while humbly understanding everyone has knowledge to add is how we carry ourselves.",
  },
  {
    title: "Excellence",
    body: "Excellence is a quality we pride ourselves on. As leaders of the real estate industry we aim to exceed expectations and deliver excellence in everything we do.",
  },
];

export function OurValues() {
  return (
    <section className="relative w-full overflow-hidden bg-brand-navy pt-[clamp(32px,3vw,60px)] pb-[clamp(64px,6vw,120px)]">

      <div className="relative z-10 container-page">
        <h2
          suppressHydrationWarning
          className="reveal mx-auto max-w-[960px] text-center font-display font-bold text-white text-[20px] sm:text-[clamp(1.5rem,2.4vw,2.6rem)] leading-[1.25] sm:whitespace-nowrap sm:-translate-x-[clamp(12px,2vw,40px)]"
        >
          <span className="sm:hidden">
            Through our local insight and commitment, we aim to deliver premium results that truly stand out.
          </span>
          <span className="hidden sm:inline">
            Through our local insight and commitment, we aim to
            <br />
            <span className="relative left-[clamp(30px,3.8vw,76px)]">
              deliver premium results that truly stand out.
            </span>
          </span>
        </h2>
        <p className="mx-auto mt-[clamp(18px,1.45vw,25px)] max-w-[600px] text-center font-display font-normal text-white/90 text-[13px] sm:text-[12.5px] leading-[1.6] tracking-[0.01em]">
          <span className="sm:hidden">
            Our passion for quality service, extensive market expertise, and bespoke strategy are all focused on securing the highest potential value throughout your property journey.
          </span>
          <span className="hidden sm:inline">
            Our passion for quality service, extensive market expertise,
            <br />
            and bespoke strategy are all focused on securing the highest potential
            <br />
            value throughout your property journey.
          </span>
        </p>

        <div className="mt-[clamp(28px,3.15vw,64px)] grid grid-cols-1 sm:grid-cols-3 gap-[16px] sm:gap-[clamp(20px,2.25vw,50px)]">
          {values.map((v, i) => (
            <div
              key={v.title}
              suppressHydrationWarning
              className={`reveal reveal-delay-${i + 1} hover-lift rounded-[16px] bg-white/[0.06] p-[20px] sm:p-[clamp(20px,1.8vw,32px)] transition-colors hover:bg-white/[0.09]`}
            >
              <h3 className="font-display text-[16px] sm:text-[17px] font-semibold text-white">
                {v.title}
              </h3>
              <p className="mt-[12px] sm:mt-[16px] font-display text-white/85 text-[13px] sm:text-[12.5px] leading-[1.6] tracking-[0.01em]">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}