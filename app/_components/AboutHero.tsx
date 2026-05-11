export function AboutHero() {
  return (
    <section className="container-page">
      <div className="relative aspect-[1770/880] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)] bg-brand-navy-deep">
        <video
          className="h-full w-full object-cover"
          poster="/about-us-images/about hero.png"
          preload="metadata"
          controls
          playsInline
        >
          <source src="/hero-video/hero.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
