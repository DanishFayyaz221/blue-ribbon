import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowInline } from "../ui/ArrowInline";
import { PropertyCard } from "../property/PropertyCard";
import { LineReveal } from "../ui/LineReveal";
import { AutoplayCardCarousel } from "../property/AutoplayCardCarousel";
import { getSoldListings } from "@/lib/db/queries";

/**
 * `tone="dark"` is the home page's version: it took over the slot (and the
 * navy satin band) of the "More Properties" strip, so it borrows that strip's
 * look — white heading and link, and the compact cards made for the dark
 * ground, whose copy is white. The default light tone is unchanged and is
 * what the Buy page shows.
 */
export async function RecentlySold({ tone = "light" }: { tone?: "light" | "dark" } = {}) {
  // Request time, as the other listing sections: sold stock comes from the feed.
  await connection();

  const items = await getSoldListings(6);

  if (items.length === 0) return null;

  const dark = tone === "dark";

  return (
    // `id`: the sold listing page's breadcrumb links back here.
    <section
      id="recently-sold"
      className={`w-full scroll-mt-[80px] ${
        dark
          ? "relative overflow-hidden py-[clamp(40px,4vw,80px)]"
          : "bg-white py-[clamp(36px,3.2vw,60px)]"
      }`}
    >
      {dark && (
        <>
          {/* The same full-bleed satin photo and #001F4D wash as the "More
              Properties" strip this replaced. */}
          <Image
            src="/images/bg.png"
            alt=""
            fill
            quality={60}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 bg-[#001F4D1F]" />
        </>
      )}
      <div className={`container-page ${dark ? "relative z-10" : ""}`}>
        <div className="flex items-end justify-between gap-[16px]">
          <LineReveal
            as="h2"
            className={`font-display font-bold text-[26px] sm:text-[clamp(1.3rem,1.8vw,2rem)] leading-[1.1] ${
              dark ? "text-white" : "text-brand-navy"
            }`}
          >
            Recently Sold
          </LineReveal>
          <Link
            href="/sold"
            className={`group mb-[4px] inline-flex shrink-0 items-center gap-[6px] font-display text-[12px] sm:text-[15px] font-medium tracking-[0.02em] underline underline-offset-4 ${
              dark ? "text-white/85 hover:text-white" : "text-brand-bunker hover:text-brand-navy"
            }`}
          >
            See more
            <ArrowInline />
          </Link>
        </div>

        {/* Phone: one card at a time, as in Explore Properties. */}
        {dark ? (
          <AutoplayCardCarousel
            properties={items}
            ariaLabel="Recently sold"
            tone="dark"
            variant="compact"
          />
        ) : (
          <AutoplayCardCarousel properties={items} ariaLabel="Recently sold" />
        )}

        {dark ? (
          // The "More Properties" grid and compact card, as on this band before.
          <div className="focus-peers hidden sm:grid mt-[clamp(24px,2.7vw,52px)] grid-cols-2 md:grid-cols-3 gap-[clamp(12px,1.3vw,24px)]">
            {items.map((p, i) => (
              <div
                key={p.id}
                suppressHydrationWarning
                className={`reveal reveal-delay-${(i % 3) + 1} hover-lift flex`}
              >
                <PropertyCard
                  {...p}
                  variant="compact"
                  addressFirst
                  parallax
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        ) : (
          /* The same card and grid as Explore Properties — the ribbon is the
             only difference, carried in on each item's `sold` flag. */
          <div className="focus-peers mt-[clamp(28px,2.7vw,52px)] hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-x-[clamp(10px,0.8vw,16px)] gap-y-[clamp(16px,1.8vw,32px)]">
            {items.map((p, i) => (
              <div
                key={p.id}
                suppressHydrationWarning
                className={`reveal reveal-delay-${(i % 3) + 1} hover-lift`}
              >
                <PropertyCard
                  {...p}
                  variant="wide"
                  dense
                  addressFirst
                  aspect="aspect-[3/2] sm:aspect-[15/8]"
                  sizes="(max-width: 767px) 48vw, (max-width: 1023px) 47vw, 30vw"
                  parallax
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
