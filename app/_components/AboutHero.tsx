export function AboutHero() {
  return (
    <section className="w-[1920px] bg-white">
      <nav
        aria-label="Breadcrumb"
        className="px-[74.667px] pt-[18px] pb-[14px] font-display text-[14.4px] font-medium leading-[21.333px]"
      >
        <a href="/" className="text-black/70 hover:underline">
          Home
        </a>
        <span className="mx-[8px] text-black/40">›</span>
        <span className="text-black">About Us</span>
      </nav>

      <div className="mx-[74.667px] pb-[48px]">
        <div className="relative h-[880px] w-[1770.667px] overflow-hidden rounded-[12px] bg-brand-navy-deep">
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
      </div>
    </section>
  );
}
