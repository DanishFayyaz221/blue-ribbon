import Image from "next/image";

const items = [
  { label: "Advanced Search", image: "/images/latest-properties.png" },
  { label: "Meet Our Agents", image: "/images/find-an-agent.png" },
  { label: "Find Your Desire", image: "/images/find-an-office.png" },
  { label: "The BlueRibbon Difference", image: "/images/the-mcgrath-difference.png" },
];

const navLinks = [
  { label: "Buying", active: true },
  { label: "Selling", active: false },
  { label: "Renting", active: false },
];

export function BridgeToHome() {
  return (
    <section className="bg-white px-6 pt-14 pb-20 text-brand-navy">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-[40px] font-bold leading-tight tracking-tight">
            Your Bridge To Home
          </h2>
          <nav className="flex items-center gap-10 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href="#"
                className={
                  link.active
                    ? "border-b-2 border-brand-navy pb-1 text-brand-navy"
                    : "text-brand-navy/70 hover:text-brand-navy"
                }
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {items.map((item) => (
            <div key={item.label} className="space-y-3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  sizes="(min-width: 768px) 22vw, 45vw"
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-brand-navy">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
