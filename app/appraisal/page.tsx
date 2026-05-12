"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { GetInTouchCTA } from "../_components/sections/GetInTouchCTA";
import { OurValues } from "../_components/home/OurValues";
import { PropertyCard, type PropertyCardData } from "../_components/property/PropertyCard";

type Step = "address" | "details" | "result";

const samples: PropertyCardData[] = Array.from({ length: 6 }, () => ({
  image: "/images/dynamic.png",
  address: "10 Carlotta Avenue, Gordon",
  guide: "$4,500,000 - $4,900,000",
}));

const latest: PropertyCardData[] = Array.from({ length: 4 }, () => ({
  image: "/images/latest-properties.png",
  address: "23 Dick Street, Henley",
  guide: "$8,500,000",
}));

const intents = [
  "I'm thinking of selling",
  "I'm thinking of buying",
  "I'm thinking of selling and buying",
  "I'm just doing research",
] as const;

export default function AppraisalPage() {
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState("");
  const [reportType, setReportType] = useState<"sales" | "rental">("sales");
  const [intent, setIntent] = useState<(typeof intents)[number] | null>(null);
  const [agree, setAgree] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        {step === "address" && (
          <>
            <section className="relative w-full overflow-hidden">
              <div className="relative aspect-[1771/800] w-full">
                <Image
                  src="/images/property-hero.png"
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container-page w-full">
                    <h1 className="text-center font-display font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] text-[clamp(1.75rem,3.1vw,3.75rem)] leading-[1.1] tracking-[-0.01em]">
                      Get Your Property Estimate in just{" "}
                      <span className="text-brand-sky">9 Seconds!</span>
                    </h1>
                    <p className="mx-auto mt-[clamp(12px,1vw,18px)] max-w-[760px] text-center font-display text-white text-[clamp(13px,0.95vw,17px)] font-medium leading-[1.5] tracking-[0.01em]">
                      Looking to buy or sell a property? Search the address below for a
                      Digital Property Report that highlights the market value including
                      recent sales, rental history, suburb report and more.
                    </p>

                    <div className="mt-[clamp(20px,1.8vw,32px)] flex flex-wrap items-center justify-center gap-x-[clamp(20px,2vw,40px)] gap-y-[10px]">
                      {(["sales", "rental"] as const).map((opt) => {
                        const active = reportType === opt;
                        return (
                          <label key={opt} className="flex cursor-pointer items-center gap-[10px]">
                            <input
                              type="radio"
                              name="reportType"
                              checked={active}
                              onChange={() => setReportType(opt)}
                              className="sr-only"
                            />
                            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px] border-white">
                              {active && <span className="h-[9px] w-[9px] rounded-full bg-brand-sky" />}
                            </span>
                            <span className="font-display text-[13px] sm:text-[14px] font-medium text-white">
                              I&rsquo;m interested in a {opt === "sales" ? "Sales" : "Rental"} report
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="mx-auto mt-[clamp(28px,2.4vw,48px)] flex w-full max-w-[1024px] flex-col gap-[12px] sm:flex-row sm:items-stretch sm:gap-0">
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Start typing to find your address"
                        className="h-[56px] sm:h-[64px] flex-1 bg-white px-[20px] font-display text-[15px] sm:text-[16px] font-medium text-black placeholder:text-brand-graychat focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setStep("details")}
                        className="flex h-[56px] sm:h-[64px] w-full sm:w-[180px] items-center justify-center rounded-[12px] sm:rounded-none bg-brand-navy font-display text-[15px] sm:text-[16px] font-medium text-white transition hover:bg-brand-navy-deep"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <OurValues />

            <section className="w-full bg-brand-soft py-[clamp(48px,4vw,80px)]">
              <div className="container-page">
                <h2 className="font-display font-bold text-brand-navy text-[clamp(1.5rem,2.1vw,2.5rem)] leading-[1.15]">
                  Best Suited for You
                </h2>
                <div className="mt-[clamp(28px,2.5vw,48px)] grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(20px,1.7vw,32px)] gap-y-[clamp(28px,2.4vw,46px)]">
                  {samples.map((p, i) => (
                    <PropertyCard key={i} {...p} variant="wide" />
                  ))}
                </div>
              </div>
            </section>

            <section className="w-full bg-brand-navy py-[clamp(28px,2.6vw,52px)]">
              <div className="container-page flex flex-col items-start gap-[16px] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display font-bold text-white text-[clamp(20px,1.8vw,32px)] leading-[1.2]">
                    Get Your Property Estimate in just 9 seconds!
                  </h2>
                  <p className="mt-[6px] font-display text-white/85 text-[12px] sm:text-[13px] font-normal">
                    Connect with your local Agent now
                  </p>
                </div>
                <a
                  href="/contact"
                  className="font-display text-white text-[14px] sm:text-[15px] font-medium underline underline-offset-4 hover:opacity-80"
                >
                  Get in touch
                </a>
              </div>
            </section>

            <section className="container-page py-[clamp(48px,4vw,80px)]">
              <div className="flex flex-col gap-[12px] sm:flex-row sm:items-end sm:justify-between">
                <h2 className="font-display font-bold text-brand-bunker text-[clamp(1.5rem,2.1vw,2.5rem)] leading-[1.15]">
                  Our latest Properties
                </h2>
                <Link
                  href="/buy"
                  className="font-display text-[15px] lg:text-[18px] font-medium tracking-[0.02em] text-brand-bunker underline underline-offset-4 hover:text-brand-navy"
                >
                  Explore more Properties
                </Link>
              </div>
              <div className="mt-[clamp(28px,2.5vw,48px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(16px,1.7vw,32px)]">
                {latest.map((p, i) => (
                  <PropertyCard key={i} {...p} variant="tall" />
                ))}
              </div>
            </section>

            <GetInTouchCTA />
          </>
        )}

        {step === "details" && <DetailsStep onContinue={() => setStep("result")} />}

        {step === "result" && (
          <>
            <section className="container-page py-[clamp(40px,4vw,80px)]">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,420px)] gap-[clamp(32px,3vw,64px)] items-start">
                <div>
                  <h1 className="font-display font-bold text-brand-bunker text-[clamp(1.5rem,2vw,2.25rem)] leading-[1.2]">
                    Parade / 43 Hopetoun Avenue,
                    <br />
                    Vaucluse 2030
                  </h1>
                  <p className="mt-[12px] font-display text-[13px] sm:text-[14px] font-medium text-brand-bunker/70">
                    3 Bed | 2 Bath | 1 Car | House
                  </p>
                  <div className="relative mt-[clamp(28px,2.5vw,48px)] aspect-[16/8] w-full overflow-hidden rounded-[12px] bg-brand-soft-2">
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="text-center">
                        <p className="font-display text-[11px] uppercase tracking-[0.12em] text-brand-bunker/60">
                          Estimated Property Value
                        </p>
                        <p className="mt-[8px] font-display text-[clamp(20px,2vw,28px)] font-bold text-brand-bunker">
                          $1.4M{" "}
                          <span className="text-brand-sky">$1.55M</span>{" "}
                          $1.6M
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <aside className="rounded-[12px] bg-brand-soft-2 p-[clamp(20px,2vw,32px)]">
                  <h2 className="text-center font-display text-[18px] sm:text-[20px] font-semibold text-brand-bunker">
                    One last question!
                  </h2>
                  <p className="mt-[8px] text-center font-display text-[13px] text-brand-bunker/70">
                    What are you looking to do?
                  </p>
                  <div className="mt-[16px] flex flex-col gap-[10px]">
                    {intents.map((label) => {
                      const active = intent === label;
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setIntent(label)}
                          className={`h-[44px] rounded-[12px] px-[16px] font-display text-[13px] font-medium transition ${
                            active
                              ? "bg-brand-sky text-white"
                              : "bg-white text-brand-bunker hover:bg-brand-soft"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  <label className="mt-[14px] flex items-start gap-[10px]">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="mt-[3px] h-[14px] w-[14px] rounded"
                    />
                    <span className="font-display text-[11px] leading-[1.5] text-brand-bunker/70">
                      I agree to the Terms &amp; Conditions and consent to be contacted about
                      property and market updates relevant to my interest.
                    </span>
                  </label>
                  <button
                    type="button"
                    disabled={!intent || !agree}
                    className="mt-[16px] h-[48px] w-full rounded-[12px] bg-brand-navy font-display text-[13px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-brand-navy-deep disabled:opacity-50"
                  >
                    View the Full Property Report
                  </button>
                </aside>
              </div>
            </section>
            <GetInTouchCTA />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

type StatItem = {
  label: string;
  value: string;
  date: string;
  icon: "growth" | "house-circle" | "house-bar" | "calendar" | "house-tag" | "hourglass";
};

const suburbStats: StatItem[] = [
  { label: "MEDIAN VALUE\n(12 MONTHS)", value: "$9.74M", date: "in February 2025", icon: "growth" },
  { label: "ANNUAL CHANGE IN MEDIAN VALUE\n(5 YEARS)", value: "51.5%", date: "in February 2025", icon: "house-circle" },
  { label: "PROPERTIES SOLD\n(12 MONTHS)", value: "116", date: "in December 2025", icon: "house-bar" },
  { label: "MEDIAN DAYS ON MARKET\n(12 MONTHS)", value: "41", date: "in December 2025", icon: "calendar" },
  { label: "MEDIAN ASKING RENT\n(12 MONTHS)", value: "$2200", date: "in February 2025", icon: "house-tag" },
  { label: "AVG. HOLD PERIOD\n(12 MONTHS)", value: "11.9 yrs", date: "in December 2025", icon: "hourglass" },
];

function DetailsStep({ onContinue }: { onContinue: () => void }) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  return (
    <section className="container-page py-[clamp(40px,4vw,80px)]">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-[clamp(28px,3vw,64px)] items-start">
        <div className="mx-auto w-full max-w-[640px] lg:mx-0">
          <h2 className="text-center font-display font-bold text-brand-bunker text-[clamp(1.5rem,1.8vw,2rem)] leading-[1.15]">
            Vaucluse Stats
          </h2>
          <div className="mt-[clamp(28px,2.5vw,48px)] grid grid-cols-2 sm:grid-cols-3 gap-y-[clamp(28px,2.4vw,40px)] gap-x-[clamp(16px,1.6vw,28px)]">
            {suburbStats.map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center">
                <StatIcon name={s.icon} />
                <p className="mt-[10px] whitespace-pre-line font-display text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.06em] text-brand-bunker/70 leading-[1.3]">
                  {s.label}
                </p>
                <p className="mt-[10px] font-display text-[clamp(20px,1.6vw,26px)] font-bold text-brand-sky">
                  {s.value}
                </p>
                <p className="mt-[4px] font-display text-[10px] sm:text-[11px] text-brand-bunker/60">
                  {s.date}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-[clamp(24px,2vw,40px)] text-center">
            <a
              href="#disclaimer"
              className="font-display text-[13px] font-medium text-brand-bunker underline underline-offset-4 hover:text-brand-navy"
            >
              Disclaimer
            </a>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onContinue();
          }}
          className="mx-auto w-full max-w-[440px] rounded-[28px] bg-white p-[clamp(28px,2.4vw,40px)] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-center font-display font-bold text-brand-bunker text-[clamp(1.5rem,1.8vw,2rem)] leading-[1.15]">
            Hey there!
          </h2>
          <p className="mt-[clamp(10px,0.9vw,16px)] text-center font-display text-[13px] sm:text-[14px] text-brand-bunker/70 leading-[1.5]">
            Please tell us who you are to receive your FREE in-depth Digital Property Report
            instantly.
          </p>
          <input
            type="text"
            required
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            placeholder="First name *"
            className="mt-[clamp(20px,1.6vw,28px)] h-[48px] w-full rounded-[24px] bg-brand-soft-2 px-[20px] font-display text-[14px] text-brand-bunker placeholder:text-brand-bunker/40 focus:outline-none focus:ring-2 focus:ring-brand-navy/40"
          />
          <input
            type="text"
            required
            value={last}
            onChange={(e) => setLast(e.target.value)}
            placeholder="Last name *"
            className="mt-[12px] h-[48px] w-full rounded-[24px] bg-brand-soft-2 px-[20px] font-display text-[14px] text-brand-bunker placeholder:text-brand-bunker/40 focus:outline-none focus:ring-2 focus:ring-brand-navy/40"
          />
          <button
            type="submit"
            className="mt-[clamp(16px,1.4vw,24px)] h-[48px] w-full rounded-[24px] bg-brand-navy font-display text-[14px] font-semibold tracking-[0.05em] text-white transition hover:bg-brand-navy-deep"
          >
            NEXT
          </button>
        </form>
      </div>
    </section>
  );
}

function StatIcon({ name }: { name: StatItem["icon"] }) {
  const common = "h-[40px] w-[40px] text-brand-bunker";
  switch (name) {
    case "growth":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-7" />
          <path d="M19 5v5h-5" />
        </svg>
      );
    case "house-circle":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
          <circle cx="17" cy="6" r="3" />
          <path d="M15 5l1.5 1.5L19 4" />
        </svg>
      );
    case "house-bar":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
          <path d="M8 17v-3M12 17v-5M16 17v-2" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v4M16 3v4" />
        </svg>
      );
    case "house-tag":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
          <path d="M9 14h6M9 17h4" />
        </svg>
      );
    case "hourglass":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 2h12M6 22h12" />
          <path d="M7 2v4c0 3 5 4 5 6s-5 3-5 6v4M17 2v4c0 3-5 4-5 6s5 3 5 6v4" />
        </svg>
      );
  }
}
