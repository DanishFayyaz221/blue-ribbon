export function AboutHero() {
  return (
    <section className="container-page">
      <div className="relative aspect-[1770/620] min-h-[clamp(420px,42vw,720px)] w-full overflow-hidden rounded-[clamp(8px,1vw,16px)] bg-brand-navy-deep">
        {/* Ambient autoplay, matching the home and contact heroes. Muted is not
            a style choice: browsers refuse to autoplay a video with sound.
            No poster — the supplied one has a YouTube play button burned into
            the artwork, which would flash a fake control before playback and
            again on any stall. The navy container shows through instead. */}
        <video
          className="h-full w-full object-cover"
          src="/hero-video/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
      </div>
    </section>
  );
}
