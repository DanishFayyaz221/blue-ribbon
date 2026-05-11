import Image from "next/image";
import { Button } from "../ui/Button";

export function ParramattaCTA() {
  return (
    <section className="w-full bg-brand-navy">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center px-[clamp(20px,3.9vw,75px)] py-[clamp(48px,4vw,72px)]">
          <div className="w-full max-w-[760px]">
            <h2 className="font-display font-bold text-brand-citrine text-[clamp(1.75rem,2.95vw,3.55rem)] leading-[1.1]">
              Set within the dynamic urban heart of Parramatta
            </h2>
            <p className="mt-[clamp(28px,3.5vw,72px)] font-display text-brand-citrine text-[clamp(15px,1.05vw,20px)] font-medium leading-[1.4] tracking-[0.02em]">
              The Riverwalk Residences by Blueribbon offer a curated collection of
              sophisticated urban homes, defined by design excellence and unparalleled
              connection. Embrace the convenience of riverside living and the pulse of a
              thriving community.
            </p>
            <div className="mt-[clamp(24px,2.2vw,36px)]">
              <Button href="/contact" variant="outline" size="lg">
                Contact our Agent
              </Button>
            </div>
          </div>
        </div>
        <div className="relative h-[260px] sm:h-[360px] lg:h-auto lg:min-h-[480px] overflow-hidden">
          <Image
            src="/images/dynamic.png"
            alt="Riverwalk Residences in Parramatta"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
