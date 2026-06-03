"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "../_components/layout/Nav";
import { Footer } from "../_components/layout/Footer";
import { Breadcrumb } from "../_components/ui/Breadcrumb";
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

// Mapping used in BOTH mobile and desktop result step so labels match the image
const intentOptions = [
  { label: "Buy a property", intent: "I'm thinking of buying" },
  { label: "Sell my property", intent: "I'm thinking of selling" },
  { label: "Buy and sell", intent: "I'm thinking of selling and buying" },
  { label: "Do a bit of research", intent: "I'm just doing research" },
] as const;

export default function AppraisalPage() {
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState("");
  const [reportType, setReportType] = useState<"sales" | "rental">("sales");
  const [mobileReportType, setMobileReportType] = useState<"residential" | "rental" | "commercial">("residential");
  const [intent, setIntent] = useState<(typeof intents)[number] | null>(null);
  const [agree, setAgree] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        {step === "address" && (
          <>
            {/* Mobile hero */}
            <div className="sm:hidden">
              <div className="container-page pt-[12px] pb-[16px]">
                <Breadcrumb
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Buy", href: "/buy" },
                    { label: "Property Estimate" },
                  ]}
                />
              </div>
              <section className="w-full">
                <div className="relative overflow-hidden">
                    <Image
                      src="/images/property-hero.png"
                      alt=""
                      fill
                      priority
                      sizes="(max-width: 639px) 100vw, 1px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-brand-navy/55" />
                    <div className="relative flex min-h-[100vw] flex-col px-[20px] pt-[clamp(40px,12vw,60px)] pb-[32px]">
                      <h1 className="text-center font-display font-bold text-white text-[28px] leading-[1.1] tracking-[-0.01em]">
                        Get Your Property
                        <br />
                        Estimate in just
                        <br />
                        <span className="text-brand-sky">9 Seconds!</span>
                      </h1>
                      <p className="mx-auto mt-[16px] max-w-[320px] text-center font-display text-white/85 text-[12.5px] font-medium leading-[1.5]">
                        Search the address below for a Digital Property Report that
                        highlights market value including recent sales, rental history and
                        more.
                      </p>

                      <div className="mt-[20px]">
                        <div className="flex items-center justify-center gap-[8px]">
                          {(["residential", "rental", "commercial"] as const).map((opt) => {
                            const active = mobileReportType === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setMobileReportType(opt)}
                                className={`h-[34px] rounded-full px-[14px] font-display text-[12px] font-medium transition ${
                                  active
                                    ? "bg-brand-sky text-white"
                                    : "border border-white/70 text-white hover:bg-white/10"
                                }`}
                              >
                                {opt === "residential"
                                  ? "Residential"
                                  : opt === "rental"
                                  ? "Rental"
                                  : "Commercial"}
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-[16px] flex h-[48px] w-full items-stretch overflow-hidden rounded-[12px] bg-white py-[6px] pl-[16px] pr-[6px]">
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Start typing in the street address..."
                            className="flex-1 bg-transparent pr-[12px] font-display text-[13px] font-medium text-black placeholder:text-brand-graychat focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setStep("details")}
                            className="flex w-[96px] items-center justify-center rounded-[8px] bg-brand-navy font-display text-[14px] font-medium text-white transition hover:bg-brand-navy-deep"
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                </div>
              </section>
            </div>

            {/* Desktop hero (unchanged) */}
            <section className="hidden sm:block relative w-full overflow-hidden">
              <div className="relative aspect-[1771/800] w-full">
                <Image
                  src="/images/property-hero.png"
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 639px) 1px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-0 flex flex-col pt-[clamp(32px,4vw,76px)] pb-[clamp(110px,12vw,190px)]">
                  <div className="container-page w-full">
                    <h1 className="text-center font-display font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] text-[clamp(1.4rem,2.5vw,2.95rem)] leading-[1.1] tracking-[-0.01em]">
                      Get Your Property Estimate in just{" "}
                      <span className="text-brand-sky">9 Seconds!</span>
                    </h1>
                    <p className="mx-auto mt-[clamp(10px,0.9vw,16px)] max-w-[760px] text-center font-display text-white text-[clamp(12px,0.85vw,15px)] font-medium leading-[1.5] tracking-[0.01em]">
                      Looking to buy or sell a property? Search the address below for a
                      Digital Property Report that highlights the market value including
                      recent sales, rental history, suburb report and more.
                    </p>
                  </div>

                  <div className="container-page relative mt-auto w-full">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-1/2 h-[calc(100%+clamp(24px,3vw,40px))] w-full max-w-[1080px] -translate-x-1/2 -translate-y-1/2 bg-black/25 blur-[1px]"
                    />
                    <div className="relative">
                      <div className="flex flex-wrap items-center justify-center gap-x-[clamp(20px,2vw,40px)] gap-y-[10px]">
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

                      <div className="mx-auto mt-[clamp(14px,1.2vw,24px)] flex w-full max-w-[1024px] flex-col gap-[12px] sm:flex-row sm:items-stretch sm:gap-0">
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
              </div>
            </section>

            <OurValues />

            <section className="hidden sm:block w-full bg-brand-soft py-[clamp(38px,3.15vw,64px)]">
              <div className="container-page">
                <h2 className="font-display font-bold text-brand-navy text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]">
                  Best Suited for You
                </h2>
                <div className="mt-[clamp(24px,2.25vw,42px)] grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(18px,1.5vw,28px)] gap-y-[clamp(24px,2.15vw,40px)]">
                  {samples.map((p, i) => (
                    <PropertyCard key={i} {...p} variant="wide" />
                  ))}
                </div>
              </div>
            </section>

            <section className="relative w-full overflow-hidden py-[clamp(22px,2.1vw,40px)]">
              {/* Navy fabric background */}
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

              <div className="relative z-10 container-page flex flex-col items-start gap-[14px] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display font-bold text-white text-[clamp(18px,1.6vw,28px)] leading-[1.2]">
                    Get Your Property Estimate in just 9 seconds!
                  </h2>
                  <p className="mt-[5px] font-display text-white/85 text-[11.5px] sm:text-[12.5px] font-normal">
                    Connect with your local Agent now
                  </p>
                </div>
                <a
                  href="/contact"
                  className="font-display text-white text-[13px] sm:text-[14px] font-medium underline underline-offset-4 hover:opacity-80"
                >
                  Get in touch
                </a>
              </div>
            </section>

            <section className="hidden sm:block container-page py-[clamp(38px,3.15vw,64px)]">
              <div className="flex flex-col gap-[10px] sm:flex-row sm:items-end sm:justify-between">
                <h2 className="font-display font-bold text-brand-bunker text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]">
                  Our latest Properties
                </h2>
                <Link
                  href="/buy"
                  className="font-display text-[14px] lg:text-[16px] font-medium tracking-[0.02em] text-brand-bunker underline underline-offset-4 hover:text-brand-navy"
                >
                  Explore more Properties
                </Link>
              </div>
              <div className="mt-[clamp(24px,2.25vw,42px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(14px,1.5vw,28px)]">
                {latest.map((p, i) => (
                  <PropertyCard key={i} {...p} variant="tall" />
                ))}
              </div>
            </section>

            <section className="sm:hidden w-full bg-white">
              <div className="w-full">
                <div className="relative isolate overflow-hidden px-[24px] py-[32px]">
                  <Image
                    src="/images/handshake-house.png"
                    alt=""
                    fill
                    sizes="(max-width: 639px) 100vw, 1px"
                    className="absolute inset-0 z-0 object-cover"
                  />
                  <div className="absolute inset-0 z-10 bg-brand-navy/85" />
                  <div className="relative z-20">
                    <h2 className="font-display font-bold text-white text-[25px] leading-[1.1]">
                      Want to get in touch
                      <br />
                      with us?
                    </h2>
                    <p className="mt-[16px] font-display font-light text-white text-[14px] leading-[1.4]">
                      We&rsquo;re all about offering supportive, expert advice every step of
                      the way, making your property buying experience as seamless and
                      enjoyable as possible.
                    </p>
                    <Link
                      href="/contact"
                      className="mt-[20px] inline-flex h-[44px] items-center justify-center rounded-[22px] border border-white px-[24px] font-display text-[13px] font-medium text-white transition hover:bg-white/10"
                    >
                      Contact our Agent
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <div className="hidden sm:block">
              <GetInTouchCTA />
            </div>
          </>
        )}

        {step === "details" && <DetailsStep onContinue={() => setStep("result")} />}

        {step === "result" && (
          <>
            {/* Mobile result */}
            <div className="sm:hidden">
              <div className="container-page pt-[12px] pb-[16px]">
                <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Buy", href: "/buy" }]} />
              </div>
              <section className="w-full bg-brand-navy">
                <div className="px-[24px] py-[36px]">
                  <h1 className="text-center font-display font-bold text-white text-[22px] leading-[1.25]">
                    Parade/43 Hopetoun Avenue,
                    <br />
                    Vaucluse 2030
                  </h1>
                  <p className="mt-[10px] text-center font-display text-[13px] font-medium text-white/85">
                    5 Bed | 5 Bath | 4 Car | House
                  </p>
                  <div className="mt-[24px] rounded-[12px] bg-white/10 px-[20px] py-[22px] text-center">
                    <p className="font-display text-[11px] uppercase tracking-[0.1em] text-white/75">
                      Estimated Property Value
                    </p>
                    <p className="mt-[8px] whitespace-nowrap font-display text-[28px] font-bold text-brand-sky">
                      $8.57M &mdash; $10.9M
                    </p>
                  </div>
                </div>
              </section>

              <section className="container-page py-[24px]">
                <div className="rounded-[16px] border border-brand-silver/60 bg-white p-[20px]">
                  <h2 className="mt-[30px] text-center font-display font-light text-[#000000] text-[27px]">
                    One last question!
                  </h2>
                  <p className="mt-[18px] text-center font-display text-[13px] text-brand-bunker/70">
                    What are you looking to do?
                  </p>
                  <div className="mt-[18px] flex flex-col gap-[10px]">
                    {intentOptions.map((opt) => {
                      const active = intent === opt.intent;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => setIntent(opt.intent)}
                          className={`h-[38px] rounded-[12px] px-[16px] font-display text-[14px] font-medium transition ${
                            active
                              ? "bg-[#39B7FF] text-white"
                              : "border border-[#3D3D3D] bg-white text-brand-bunker hover:bg-brand-soft"
                          }`}
                        >
                          {opt.label}
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
                      I agree that the information provided on this Website can be used by
                      Blue Ribbon Real Estate to contact me.
                    </span>
                  </label>
                  <label className="mt-[8px] flex items-start gap-[10px]">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-[3px] h-[14px] w-[14px] rounded"
                    />
                    <span className="font-display text-[11px] leading-[1.5] text-brand-bunker/70">
                      I have read and understood the Terms of Use and Privacy Policy.
                    </span>
                  </label>
                  <button
                    type="button"
                    disabled={!intent || !agree || !agreeTerms}
                    className="mt-[18px] mb-[32px] h-[48px] w-full rounded-[10px] bg-brand-bunker font-display text-[12px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-black disabled:opacity-50"
                  >
                    View the Full Property Report
                  </button>
                </div>
              </section>

              <section className="w-full bg-white">
                <div className="w-full">
                  <div className="relative isolate overflow-hidden px-[28px] py-[36px]">
                    <Image
                      src="/images/handshake-house.png"
                      alt=""
                      fill
                      sizes="(max-width: 639px) 100vw, 1px"
                      className="absolute inset-0 z-0 object-cover"
                    />
                    <div className="absolute inset-0 z-10 bg-brand-navy/85" />
                    <div className="relative z-20">
                      <h2 className="font-display font-bold text-white text-[28px] leading-[1.1]">
                        Want to get in touch
                        <br />
                        with us?
                      </h2>
                      <p className="mt-[18px] font-display font-light text-white text-[15px] leading-[1.5]">
                        We&rsquo;re all about offering supportive, expert advice every
                        step of the way.
                      </p>
                      <Link
                        href="/contact"
                        className="mt-[24px] inline-flex h-[48px] items-center justify-center rounded-[24px] border border-white px-[28px] font-display text-[14px] font-medium text-white transition hover:bg-white/10"
                      >
                        Contact our Agent
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Desktop result — PIXEL-PERFECT MATCH TO REFERENCE IMAGE */}
            <div className="hidden sm:block">
              <div className="container-page pt-[24px] pb-[8px]">
                <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Buy", href: "/buy" }]} />
              </div>

              <section className="container-page pt-[clamp(32px,3.15vw,64px)] pb-[clamp(48px,4vw,80px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
                  {/* LEFT COLUMN — Address + Property value range */}
                  <div className="flex flex-col items-center pt-[clamp(32px,4vw,64px)] lg:pr-[clamp(8px,1vw,16px)]">
                    <h1 className="text-center font-display font-bold text-brand-bunker text-[clamp(1.4rem,1.95vw,2rem)] leading-[1.2] tracking-[-0.01em]">
                      Parade/43 Hopetoun Avenue,
                      <br />
                      Vaucluse 2030
                    </h1>
                    <p className="mt-[clamp(10px,0.9vw,16px)] text-center font-display text-[clamp(12px,0.9vw,14px)] font-medium text-brand-bunker/70">
                      5 Bed&nbsp;&nbsp;|&nbsp;&nbsp;5 Bath&nbsp;&nbsp;|&nbsp;&nbsp;4 Car&nbsp;&nbsp;|&nbsp;&nbsp;House
                    </p>

                    {/* Property value range */}
                    <div className="mt-[clamp(50px,5.4vw,90px)] w-full max-w-[560px] bg-[#e8e8e8] p-[clamp(24px,2.4vw,40px)] shadow-[16px_24px_50px_-12px_rgba(0,0,0,0.18)]">
                      <p className="text-center font-display text-[clamp(13px,1vw,16px)] font-bold uppercase tracking-[0.14em] text-[#828282]">
                        ESTIMATED PROPERTY VALUE
                      </p>

                      <div className="relative mt-[clamp(24px,2.35vw,40px)]">
                      <div className="flex items-center justify-center gap-[clamp(14px,1.8vw,32px)] blur-[10px] select-none pointer-events-none">
                        <span className="font-display text-[clamp(18px,1.7vw,25px)] font-bold text-brand-bunker/35">
                          $8.57M
                        </span>

                        <div className="flex flex-col items-center">
                          <div className="rounded-full bg-brand-sky px-[clamp(20px,2vw,28px)] py-[clamp(9px,0.9vw,12px)] shadow-[0_6px_20px_rgba(56,178,224,0.35)]">
                            <span className="font-display text-[clamp(18px,1.7vw,25px)] font-bold leading-none text-white">
                              $9.7M
                            </span>
                          </div>
                          <div className="mt-[10px] flex flex-col items-center">
                            <svg
                              viewBox="0 0 12 8"
                              className="h-[6px] w-[10px] text-brand-bunker"
                              fill="currentColor"
                              aria-hidden
                            >
                              <path d="M6 8L0 0H12L6 8Z" />
                            </svg>
                            <span className="mt-[4px] font-display text-[10px] font-bold uppercase tracking-[0.12em] text-brand-bunker">
                              EST. VALUE
                            </span>
                          </div>
                        </div>

                        <span className="font-display text-[clamp(18px,1.7vw,25px)] font-bold text-brand-bunker/35">
                          $10.9M
                        </span>
                      </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN — "One last question!" card */}
                  <aside className="w-full max-w-[clamp(350px,29vw,420px)] justify-self-start lg:ml-[clamp(8px,1vw,16px)] rounded-[clamp(18px,1.6vw,26px)] bg-white p-[clamp(22px,2.1vw,32px)] shadow-[16px_24px_50px_-12px_rgba(0,0,0,0.18)]">
                    <h2 className="mt-[clamp(18px,2vw,30px)] text-center font-display font-light text-[#000000] text-[clamp(20px,1.8vw,28px)] leading-[1.2]">
                      One last question!
                    </h2>
                    <p className="mt-[clamp(18px,1.6vw,24px)] text-center font-display text-[clamp(11.5px,0.85vw,13px)] text-brand-bunker/70">
                      What are you looking to do?
                    </p>

                    <div className="mt-[clamp(18px,1.6vw,25px)] flex flex-col gap-[clamp(9px,0.8vw,12px)]">
                      {intentOptions.map((opt) => {
                        const active = intent === opt.intent;
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => setIntent(opt.intent)}
                            className={`relative flex h-[clamp(34px,2.7vw,42px)] w-full items-center justify-center rounded-full px-[20px] font-display text-[clamp(12px,0.95vw,14px)] font-medium transition ${
                              active
                                ? "bg-[#39B7FF] text-white shadow-[0_4px_14px_rgba(56,178,224,0.35)]"
                                : "border border-[#3D3D3D] bg-white text-brand-bunker hover:border-[#3D3D3D] hover:bg-brand-soft"
                            }`}
                          >
                            {active && (
                              <svg
                                viewBox="0 0 20 20"
                                className="mr-[8px] h-[16px] w-[16px] shrink-0"
                                fill="currentColor"
                                aria-hidden
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* First consent */}
                    <label className="mt-[clamp(18px,1.6vw,24px)] flex items-start gap-[10px]">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-[3px] h-[14px] w-[14px] accent-[#000000]"
                      />
                      <span className="font-display text-[clamp(9.5px,0.72vw,11px)] leading-[1.5] text-brand-bunker/75">
                        I agree that the information I&rsquo;ve provided on this Website can be used by Blue Ribbon Real Estate{" "}
                        <Link href="/privacy" className="underline underline-offset-2 hover:text-brand-navy">
                          Privacy Policy
                        </Link>{" "}
                        to contact me about the property market, promotional campaigns and for other marketing purposes.
                      </span>
                    </label>

                    {/* Terms section */}
                    <hr className="mt-[clamp(14px,1.2vw,18px)] border-t border-brand-silver/60" />
                    <p className="mt-[clamp(14px,1.2vw,18px)] font-display text-[clamp(11px,0.85vw,13px)] font-medium text-brand-bunker">
                      Terms and conditions
                    </p>

                    <label className="mt-[clamp(6px,0.6vw,10px)] flex items-start gap-[10px]">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-[3px] h-[14px] w-[14px] accent-[#000000]"
                      />
                      <span className="font-display text-[clamp(8.5px,0.62vw,9.5px)] leading-[1.45] text-brand-bunker/75">
                        I have read and understood the{" "}
                        <Link href="/terms" className="underline underline-offset-2 hover:text-brand-navy">
                          Terms of Use
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline underline-offset-2 hover:text-brand-navy">
                          Privacy Policy
                        </Link>{" "}
                        in respect of the Reports and Cotality Data accessed on this Website.
                      </span>
                    </label>

                    <button
                      type="button"
                      disabled={!intent || !agree || !agreeTerms}
                      className="mt-[clamp(16px,1.6vw,24px)] mb-[clamp(8px,1vw,14px)] h-[clamp(42px,3.2vw,48px)] w-full rounded-full bg-[#001F4D] font-display text-[clamp(11px,0.9vw,13px)] font-bold uppercase tracking-[0.1em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      VIEW THE FULL PROPERTY REPORT
                    </button>
                  </aside>
                </div>
              </section>

              <GetInTouchCTA />
            </div>
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
  tone?: "sky" | "navy";
};

const suburbStats: StatItem[] = [
  { label: "MEDIAN VALUE\n(12 MONTHS)", value: "$9.74M", date: "in February 2026", icon: "growth", tone: "sky" },
  { label: "ANNUAL CHANGE IN MEDIAN VALUE\n(5 YEARS)", value: "51.5%", date: "in February 2026", icon: "house-circle", tone: "sky" },
  { label: "PROPERTIES SOLD\n(12 MONTHS)", value: "116", date: "in December 2025", icon: "house-bar", tone: "sky" },
  { label: "MEDIAN DAYS ON MARKET\n(12 MONTHS)", value: "41", date: "in December 2025", icon: "calendar", tone: "navy" },
  { label: "MEDIAN ASKING RENT\n(12 MONTHS)", value: "$2200", date: "in February 2026", icon: "house-tag", tone: "navy" },
  { label: "AVG. HOLD PERIOD\n(12 MONTHS)", value: "11.9 yrs", date: "in December 2025", icon: "hourglass", tone: "navy" },
];

function DetailsStep({ onContinue }: { onContinue: () => void }) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  return (
    <>
      {/* Mobile layout */}
      <div className="sm:hidden">
        <div className="container-page pt-[16px] pb-[16px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Buy", href: "/buy" }]} />
        </div>
        <section className="container-page pb-[36px]">
          <h2 className="text-center font-display font-bold text-brand-bunker text-[23px] leading-[1.15]">
            Vaucluse Stats
          </h2>
          <div className="mt-[22px] grid grid-cols-2 gap-[12px]">
            {suburbStats.map((s) => (
              <div
                key={s.label}
                className="rounded-[12px] bg-[#F1F2F4] px-[12px] py-[18px] text-center"
              >
                <p className="whitespace-pre-line font-display text-[9.5px] font-medium uppercase tracking-[0.06em] text-brand-bunker/70 leading-[1.3]">
                  {s.label}
                </p>
                <p
                  className={`mt-[8px] font-display text-[27px] font-bold ${
                    s.tone === "navy" ? "text-brand-navy" : "text-brand-sky"
                  }`}
                >
                  {s.value}
                </p>
                <p className="mt-[5px] font-display text-[10.5px] text-brand-bunker/60">
                  {s.date}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-[22px] text-center">
            <a
              href="#disclaimer"
              className="font-display text-[13px] font-bold text-brand-bunker hover:text-brand-navy"
            >
              Disclaimer
            </a>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onContinue();
            }}
            className="mt-[28px] rounded-[20px] bg-white p-[22px] pt-[44px] shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          >
            <h2 className="text-center font-display font-light text-brand-bunker text-[20px]">
              Hey there!
            </h2>
            <p className="mt-[8px] text-center font-display text-[12.5px] text-brand-bunker/70 leading-[1.5]">
              Please tell us who you are to receive your FREE in-depth Digital Property
              Report instantly.
            </p>
            <input
              type="text"
              required
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              placeholder="First name *"
              className="mt-[18px] h-[42px] w-full rounded-[22px] bg-[#F2F2F2] px-[16px] text-center font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:outline-none focus:ring-2 focus:ring-brand-navy/40"
            />
            <input
              type="text"
              required
              value={last}
              onChange={(e) => setLast(e.target.value)}
              placeholder="Last name *"
              className="mt-[8px] h-[42px] w-full rounded-[22px] bg-[#F2F2F2] px-[16px] text-center font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:outline-none focus:ring-2 focus:ring-brand-navy/40"
            />
            <button
              type="submit"
              className="mt-[12px] h-[42px] w-full rounded-[22px] bg-brand-navy font-display text-[12.5px] font-semibold tracking-[0.05em] text-white transition hover:bg-brand-navy-deep"
            >
              NEXT
            </button>
          </form>
        </section>

        <section className="w-full bg-white">
          <div className="w-full">
            <div className="relative isolate overflow-hidden px-[24px] py-[32px]">
              <Image
                src="/images/handshake-house.png"
                alt=""
                fill
                sizes="(max-width: 639px) 100vw, 1px"
                className="absolute inset-0 z-0 object-cover"
              />
              <div className="absolute inset-0 z-10 bg-brand-navy/85" />
              <div className="relative z-20">
                <h2 className="font-display font-bold text-white text-[25px] leading-[1.1]">
                  Want to get in touch
                  <br />
                  with us?
                </h2>
                <p className="mt-[16px] font-display font-light text-white text-[14px] leading-[1.5]">
                  We&rsquo;re all about offering supportive, expert advice every step of
                  the way.
                </p>
                <Link
                  href="/contact"
                  className="mt-[20px] inline-flex h-[44px] items-center justify-center rounded-[22px] border border-white px-[24px] font-display text-[13px] font-medium text-white transition hover:bg-white/10"
                >
                  Contact our Agent
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Desktop layout (unchanged) */}
      <section className="hidden sm:block container-page py-[clamp(32px,3.15vw,64px)]">
        <div className="flex flex-col items-stretch gap-[22px] lg:flex-row lg:items-center lg:justify-center lg:gap-0">
          <div className="mx-auto w-full max-w-[640px] lg:mx-0 lg:flex-shrink-0 lg:pl-[clamp(108px,8vw,160px)]">
            <h2 className="text-center font-display font-bold text-brand-bunker text-[clamp(1.2rem,1.45vw,1.6rem)] leading-[1.15]">
              Vaucluse Stats
            </h2>
            <div className="mt-[clamp(24px,2.25vw,42px)] grid grid-cols-2 sm:grid-cols-3 gap-y-[clamp(24px,2.15vw,36px)] gap-x-[clamp(14px,1.4vw,25px)]">
              {suburbStats.map((s) => (
                <div key={s.label} className="flex flex-col items-center text-center">
                  <StatIcon name={s.icon} />
                  <p className="mt-[8px] whitespace-pre-line font-display text-[9.5px] sm:text-[10.5px] font-medium uppercase tracking-[0.06em] text-brand-bunker/70 leading-[1.3]">
                    {s.label}
                  </p>
                  <p className="mt-[8px] font-display text-[clamp(21px,1.7vw,27px)] font-light text-brand-sky">
                    {s.value}
                  </p>
                  <p className="mt-[3px] font-display text-[9.5px] sm:text-[10.5px] text-brand-bunker/60">
                    {s.date}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-[clamp(20px,1.8vw,36px)] text-center">
              <a
                href="#disclaimer"
                className="font-display text-[12.5px] font-medium text-brand-bunker underline underline-offset-4 hover:text-brand-navy"
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
            className="relative right-[clamp(10px,2vw,36px)] mx-auto w-full max-w-[420px] rounded-[26px] bg-white p-[clamp(24px,2.15vw,36px)] pt-[clamp(40px,3.4vw,60px)] shadow-[16px_24px_50px_-12px_rgba(0,0,0,0.18)]"
          >
            <h2 className="text-center font-display font-light text-brand-bunker text-[clamp(1.2rem,1.45vw,1.6rem)] leading-[1.15]">
              Hey there!
            </h2>
            <p className="mt-[clamp(8px,0.8vw,14px)] text-center font-display text-[12.5px] sm:text-[13.5px] text-brand-bunker/70 leading-[1.5]">
              Please tell us who you are to receive your FREE in-depth Digital Property Report
              instantly.
            </p>
            <input
              type="text"
              required
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              placeholder="First name *"
              className="mt-[clamp(18px,1.45vw,25px)] h-[44px] w-full rounded-[22px] bg-[#F2F2F2] px-[18px] text-center font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:outline-none focus:ring-2 focus:ring-brand-navy/40"
            />
            <input
              type="text"
              required
              value={last}
              onChange={(e) => setLast(e.target.value)}
              placeholder="Last name *"
              className="mt-[10px] h-[44px] w-full rounded-[22px] bg-[#F2F2F2] px-[18px] text-center font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:outline-none focus:ring-2 focus:ring-brand-navy/40"
            />
            <button
              type="submit"
              className="mt-[clamp(14px,1.25vw,22px)] h-[44px] w-full rounded-[22px] bg-brand-navy font-display text-[13px] font-semibold tracking-[0.05em] text-white transition hover:bg-brand-navy-deep"
            >
              NEXT
            </button>
          </form>
        </div>
      </section>

      <div className="hidden sm:block mt-[clamp(44px,4vw,76px)]">
        <GetInTouchCTA />
      </div>
    </>
  );
}

function StatIcon({ name }: { name: StatItem["icon"] }) {
  const common = "h-[36px] w-[36px] text-brand-bunker";
  switch (name) {
    case "growth":
      return (
        <svg viewBox="0 0 60 60" className={common} fill="currentColor" aria-hidden>
          <path d="M60 58H0V60H60V58ZM57.895 8.55399L53.895 0.553994C53.8364 0.436336 53.7552 0.331379 53.6561 0.245123C53.5569 0.158867 53.4417 0.0930055 53.3171 0.0513045C53.1924 0.00960344 53.0608 -0.007119 52.9297 0.00209348C52.7986 0.011306 52.6706 0.0462726 52.553 0.104994L44.553 4.10499C44.4355 4.16369 44.3307 4.24497 44.2445 4.34418C44.1584 4.44339 44.0927 4.55859 44.0511 4.68321C44.0095 4.80783 43.9928 4.93942 44.0021 5.07047C44.0113 5.20152 44.0463 5.32946 44.105 5.44699C44.1637 5.56453 44.245 5.66935 44.3442 5.75547C44.4434 5.84159 44.5586 5.90733 44.6832 5.94893C44.8078 5.99053 44.9394 6.00718 45.0705 5.99793C45.2015 5.98867 45.3295 5.95369 45.447 5.89499L51.241 3.00099L49.66 7.51499C46.2577 17.2042 40.132 25.706 32.0179 32.0002C23.9038 38.2944 14.1459 42.1138 3.915 43L4.085 45C14.7015 44.0807 24.827 40.1171 33.2464 33.5851C41.6659 27.053 48.0213 18.23 51.55 8.17499L53.164 3.56299L56.106 9.44799C56.2246 9.68536 56.4325 9.86592 56.6842 9.94993C56.9359 10.0339 57.2106 10.0145 57.448 9.89599C57.6854 9.77744 57.8659 9.56945 57.9499 9.31778C58.034 9.0661 58.0136 8.79136 57.895 8.55399ZM12 48H5C4.73478 48 4.48043 48.1053 4.29289 48.2929C4.10536 48.4804 4 48.7348 4 49V55C4 55.2652 4.10536 55.5196 4.29289 55.7071C4.48043 55.8946 4.73478 56 5 56H12C12.2652 56 12.5196 55.8946 12.7071 55.7071C12.8946 55.5196 13 55.2652 13 55V49C13 48.7348 12.8946 48.4804 12.7071 48.2929C12.5196 48.1053 12.2652 48 12 48ZM11 54H6V50H11V54ZM23 45H16C15.7348 45 15.4804 45.1053 15.2929 45.2929C15.1054 45.4804 15 45.7348 15 46V55C15 55.2652 15.1054 55.5196 15.2929 55.7071C15.4804 55.8946 15.7348 56 16 56H23C23.2652 56 23.5196 55.8946 23.7071 55.7071C23.8946 55.5196 24 55.2652 24 55V46C24 45.7348 23.8946 45.4804 23.7071 45.2929C23.5196 45.1053 23.2652 45 23 45ZM22 54H17V47H22V54ZM34 40H27C26.7348 40 26.4804 40.1053 26.2929 40.2929C26.1054 40.4804 26 40.7348 26 41V55C26 55.2652 26.1054 55.5196 26.2929 55.7071C26.4804 55.8946 26.7348 56 27 56H34C34.2652 56 34.5196 55.8946 34.7071 55.7071C34.8946 55.5196 35 55.2652 35 55V41C35 40.7348 34.8946 40.4804 34.7071 40.2929C34.5196 40.1053 34.2652 40 34 40ZM33 54H28V42H33V54Z" />
          <path d="M45 33H38C37.7348 33 37.4804 33.1054 37.2929 33.2929C37.1054 33.4804 37 33.7348 37 34V55C37 55.2652 37.1054 55.5196 37.2929 55.7071C37.4804 55.8946 37.7348 56 38 56H45C45.2652 56 45.5196 55.8946 45.7071 55.7071C45.8946 55.5196 46 55.2652 46 55V34C46 33.7348 45.8946 33.4804 45.7071 33.2929C45.5196 33.1054 45.2652 33 45 33ZM44 54H39V35H44V54ZM56 19H49C48.7348 19 48.4804 19.1054 48.2929 19.2929C48.1054 19.4804 48 19.7348 48 20V55C48 55.2652 48.1054 55.5196 48.2929 55.7071C48.4804 55.8946 48.7348 56 49 56H56C56.2652 56 56.5196 55.8946 56.7071 55.7071C56.8946 55.5196 57 55.2652 57 55V20C57 19.7348 56.8946 19.4804 56.7071 19.2929C56.5196 19.1054 56.2652 19 56 19ZM55 54H50V21H55V54Z" />
        </svg>
      );
    case "house-circle":
      return (
        <svg viewBox="0 0 60 60" className={common} fill="currentColor" aria-hidden>
          <path d="M55.3132 52.5H51.5632V22.91L52.1892 23.268C52.5214 23.4569 52.8885 23.5762 53.2682 23.6187C53.6479 23.6613 54.0323 23.6262 54.398 23.5155C54.7638 23.4048 55.1032 23.221 55.3956 22.9751C55.688 22.7291 55.9274 22.4263 56.0992 22.085L56.2962 21.694C56.6175 21.0504 56.68 20.3082 56.4707 19.6199C56.2614 18.9317 55.7964 18.3498 55.1712 17.994L51.5632 15.929V7.32701C52.1878 7.10653 52.7143 6.67219 53.0495 6.10086C53.3846 5.52952 53.5069 4.85803 53.3946 4.20523C53.2823 3.55243 52.9426 2.96041 52.4358 2.53394C51.929 2.10747 51.2876 1.87406 50.6252 1.87501H43.1252C42.4636 1.87341 41.8227 2.10564 41.3157 2.53068C40.8087 2.95573 40.4682 3.54626 40.3543 4.19799C40.2404 4.84972 40.3605 5.52073 40.6933 6.09253C41.0261 6.66433 41.5502 7.10014 42.1732 7.32301V10.563L31.3952 4.40701C30.9699 4.16551 30.4892 4.03855 30.0002 4.03855C29.5111 4.03855 29.0305 4.16551 28.6052 4.40701L4.82519 17.993C4.20036 18.3497 3.736 18.9322 3.52766 19.6209C3.31932 20.3095 3.38285 21.0518 3.70519 21.695L3.90019 22.084C4.07131 22.4261 4.31038 22.7296 4.60279 22.9761C4.8952 23.2226 5.23481 23.4069 5.60086 23.5178C5.96691 23.6286 6.35172 23.6636 6.73176 23.6206C7.1118 23.5777 7.47909 23.4577 7.81119 23.268L8.43819 22.911V52.5H4.68819C3.95145 52.5139 3.24958 52.8163 2.73347 53.3423C2.21736 53.8682 1.92822 54.5756 1.92822 55.3125C1.92822 56.0494 2.21736 56.7568 2.73347 57.2828C3.24958 57.8087 3.95145 58.1111 4.68819 58.125H55.3122C55.686 58.1321 56.0575 58.0645 56.4049 57.9263C56.7523 57.7882 57.0686 57.5821 57.3355 57.3203C57.6023 57.0584 57.8143 56.746 57.959 56.4012C58.1037 56.0565 58.1782 55.6864 58.1782 55.3125C58.1782 54.9386 58.1037 54.5685 57.959 54.2238C57.8143 53.879 57.6023 53.5666 57.3355 53.3048C57.0686 53.0429 56.7523 52.8368 56.4049 52.6987C56.0575 52.5605 55.687 52.493 55.3132 52.5ZM43.1242 3.75001H50.6242C50.8675 3.75796 51.0982 3.86021 51.2676 4.03516C51.4369 4.21011 51.5316 4.44404 51.5316 4.68751C51.5316 4.93098 51.4369 5.16491 51.2676 5.33986C51.0982 5.51481 50.8675 5.61706 50.6242 5.62501H43.1242C42.8808 5.61706 42.6501 5.51481 42.4808 5.33986C42.3115 5.16491 42.2168 4.93098 42.2168 4.68751C42.2168 4.44404 42.3115 4.21011 42.4808 4.03516C42.6501 3.86021 42.8808 3.75796 43.1242 3.75001ZM44.0472 7.50001H49.6872V14.857L44.0472 11.635V7.50001ZM6.88119 21.64C6.77037 21.7033 6.64782 21.7432 6.52102 21.7576C6.39423 21.7719 6.26585 21.7602 6.14372 21.7232C6.0216 21.6862 5.90829 21.6248 5.81071 21.5426C5.71313 21.4603 5.63333 21.3591 5.57619 21.245L5.38119 20.855C5.2741 20.6405 5.25329 20.3932 5.32305 20.1638C5.3928 19.9344 5.54782 19.7405 5.75619 19.622L29.5312 6.03401C29.6728 5.95316 29.8331 5.91064 29.9962 5.91064C30.1593 5.91064 30.3195 5.95316 30.4612 6.03401L54.2412 19.627C54.4491 19.7457 54.6038 19.9394 54.6735 20.1685C54.7432 20.3975 54.7227 20.6446 54.6162 20.859L54.4192 21.251C54.3331 21.4227 54.1965 21.5639 54.0277 21.6557C53.8589 21.7474 53.6661 21.7852 53.4752 21.764C53.3484 21.7496 53.2259 21.7094 53.1152 21.646L31.3952 9.22601C30.9701 8.98403 30.4893 8.8568 30.0002 8.8568C29.511 8.8568 29.0303 8.98403 28.6052 9.22601L6.88119 21.64ZM10.3122 21.844L29.5322 10.854C29.6738 10.7732 29.8341 10.7306 29.9972 10.7306C30.1603 10.7306 30.3205 10.7732 30.4622 10.854L49.6882 21.844V52.5H10.3122V21.844ZM55.3122 56.25H4.68819C4.43955 56.25 4.20109 56.1512 4.02527 55.9754C3.84946 55.7996 3.75069 55.5611 3.75069 55.3125C3.75069 55.0639 3.84946 54.8254 4.02527 54.6496C4.20109 54.4738 4.43955 54.375 4.68819 54.375H55.3122C55.5555 54.383 55.7862 54.4852 55.9556 54.6602C56.1249 54.8351 56.2196 55.069 56.2196 55.3125C56.2196 55.556 56.1249 55.7899 55.9556 55.9649C55.7862 56.1398 55.5555 56.2421 55.3122 56.25Z" />
          <path d="M45.938 33.633C45.9382 30.4807 45.0036 27.3992 43.2525 24.7781C41.5013 22.1569 39.0122 20.114 36.0999 18.9075C33.1877 17.701 29.983 17.3853 26.8913 18.0001C23.7995 18.615 20.9596 20.1329 18.7305 22.3618C16.5014 24.5907 14.9834 27.4306 14.3683 30.5223C13.7533 33.614 14.0689 36.8186 15.2751 39.731C16.4814 42.6433 18.5242 45.1326 21.1452 46.8839C23.7662 48.6352 26.8477 49.57 30 49.57C34.2255 49.5655 38.2766 47.885 41.2646 44.8973C44.2525 41.9095 45.9333 37.8585 45.938 33.633ZM30 47.695C27.2186 47.695 24.4996 46.8702 22.1869 45.3249C19.8743 43.7796 18.0718 41.5832 17.0074 39.0135C15.943 36.4437 15.6646 33.6161 16.2073 30.8881C16.75 28.1601 18.0895 25.6543 20.0563 23.6876C22.0232 21.7209 24.5291 20.3816 27.2571 19.8391C29.9851 19.2966 32.8127 19.5752 35.3824 20.6398C37.952 21.7043 40.1483 23.507 41.6935 25.8198C43.2386 28.1325 44.0632 30.8516 44.063 33.633C44.0588 37.3614 42.5758 40.9358 39.9393 43.572C37.3029 46.2083 33.7284 47.691 30 47.695Z" />
          <path d="M20.714 41.587L37.947 24.353L39.273 25.679L22.04 42.912L20.714 41.587ZM25.313 32.695C26.556 32.695 27.7482 32.2012 28.6272 31.3222C29.5062 30.4432 30 29.2511 30 28.008C30 26.7649 29.5062 25.5728 28.6272 24.6938C27.7482 23.8148 26.556 23.321 25.313 23.321C24.0699 23.321 22.8778 23.8148 21.9988 24.6938C21.1198 25.5728 20.626 26.7649 20.626 28.008C20.626 29.2511 21.1198 30.4432 21.9988 31.3222C22.8778 32.2012 24.0699 32.695 25.313 32.695ZM25.313 25.195C25.6868 25.1879 26.0582 25.2555 26.4056 25.3937C26.753 25.5318 27.0694 25.7379 27.3363 25.9997C27.6031 26.2616 27.8151 26.574 27.9598 26.9188C28.1045 27.2635 28.179 27.6336 28.179 28.0075C28.179 28.3814 28.1045 28.7515 27.9598 29.0962C27.8151 29.4409 27.6031 29.7534 27.3363 30.0152C27.0694 30.2771 26.753 30.4831 26.4056 30.6213C26.0582 30.7595 25.6868 30.827 25.313 30.82C24.5762 30.8061 23.8744 30.5037 23.3583 29.9777C22.8421 29.4518 22.553 28.7444 22.553 28.0075C22.553 27.2706 22.8421 26.5632 23.3583 26.0372C23.8744 25.5113 24.5762 25.2089 25.313 25.195ZM35.625 33.633C34.3819 33.633 33.1898 34.1268 32.3108 35.0058C31.4318 35.8848 30.938 37.0769 30.938 38.32C30.938 39.5631 31.4318 40.7552 32.3108 41.6342C33.1898 42.5132 34.3819 43.007 35.625 43.007C36.868 43.007 38.0602 42.5132 38.9392 41.6342C39.8182 40.7552 40.312 39.5631 40.312 38.32C40.312 37.0769 39.8182 35.8848 38.9392 35.0058C38.0602 34.1268 36.868 33.633 35.625 33.633ZM35.625 41.133C34.8792 41.133 34.1639 40.8367 33.6366 40.3094C33.1092 39.782 32.813 39.0668 32.813 38.321C32.813 37.5752 33.1092 36.86 33.6366 36.3326C34.1639 35.8052 34.8792 35.509 35.625 35.509C36.3708 35.509 37.086 35.8052 37.6134 36.3326C38.1407 36.86 38.437 37.5752 38.437 38.321C38.437 39.0668 38.1407 39.782 37.6134 40.3094C37.086 40.8367 36.3708 41.133 35.625 41.133Z" />
        </svg>
      );
    case "house-bar":
      return (
        <svg viewBox="0 0 60 60" className={common} fill="currentColor" aria-hidden>
          <path d="M54.9999 50V31C56.0265 31.0012 57.0286 30.6864 57.87 30.0983C58.7114 29.5102 59.3515 28.6774 59.7032 27.713C60.0549 26.7485 60.1012 25.6992 59.8358 24.7076C59.5705 23.7159 59.0063 22.8299 58.2199 22.17L33.2199 1.17C32.3143 0.420403 31.1755 0.0102539 29.9999 0.0102539C28.8243 0.0102539 27.6856 0.420403 26.7799 1.17L1.77994 22.17C0.993594 22.8299 0.429427 23.7159 0.164071 24.7076C-0.101285 25.6992 -0.0549686 26.7485 0.296729 27.713C0.648427 28.6774 1.28846 29.5102 2.12989 30.0983C2.97133 30.6864 3.97338 31.0012 4.99994 31V50C3.62957 50.1251 2.35587 50.7593 1.43022 51.7775C0.504581 52.7957 -0.00575454 54.1239 -5.7579e-05 55.5V59C-5.7579e-05 59.2652 0.105299 59.5196 0.292836 59.7071C0.480372 59.8946 0.734726 60 0.999942 60H58.9999C59.2652 60 59.5195 59.8946 59.7071 59.7071C59.8946 59.5196 59.9999 59.2652 59.9999 59V55.5C60.0056 54.1239 59.4953 52.7957 58.5697 51.7775C57.644 50.7593 56.3703 50.1251 54.9999 50ZM2.69994 27.93C2.44618 27.6281 2.25444 27.2791 2.13568 26.903C2.01693 26.527 1.97349 26.1312 2.00785 25.7383C2.04222 25.3454 2.15372 24.9631 2.33596 24.6134C2.5182 24.2636 2.76762 23.9533 3.06994 23.7L28.0699 2.7C28.5966 2.22258 29.2897 1.97118 29.9999 2C30.7321 1.98785 31.4435 2.24394 31.9999 2.72L56.9999 23.72C57.3023 23.9733 57.5517 24.2836 57.7339 24.6334C57.9162 24.9831 58.0277 25.3654 58.062 25.7583C58.0964 26.1512 58.053 26.547 57.9342 26.923C57.8154 27.2991 57.6237 27.6481 57.3699 27.95C56.8457 28.5405 56.1152 28.9078 55.3286 28.9766C54.5419 29.0455 53.7588 28.8105 53.1399 28.32L30.6399 9.46C30.4603 9.31033 30.2338 9.22837 29.9999 9.22837C29.7661 9.22837 29.5396 9.31033 29.3599 9.46L6.92994 28.3C6.3111 28.7905 5.52797 29.0255 4.74132 28.9566C3.95468 28.8878 3.22423 28.5205 2.69994 27.93ZM17.9999 58H1.99994V55.5C1.99994 55.0404 2.09047 54.5852 2.26636 54.1606C2.44226 53.736 2.70006 53.3501 3.02507 53.0251C3.35007 52.7001 3.73591 52.4423 4.16055 52.2664C4.58519 52.0905 5.04032 52 5.49994 52C5.95957 52 6.41469 52.0905 6.83933 52.2664C7.26397 52.4423 7.64981 52.7001 7.97482 53.0251C8.29982 53.3501 8.55763 53.736 8.73352 54.1606C8.90941 54.5852 8.99994 55.0404 8.99994 55.5C8.99994 55.7652 9.1053 56.0196 9.29284 56.2071C9.48037 56.3946 9.73473 56.5 9.99994 56.5C10.2652 56.5 10.5195 56.3946 10.707 56.2071C10.8946 56.0196 10.9999 55.7652 10.9999 55.5V52.5C10.9999 52.0404 11.0905 51.5852 11.2664 51.1606C11.4423 50.736 11.7001 50.3501 12.0251 50.0251C12.3501 49.7001 12.7359 49.4423 13.1606 49.2664C13.5852 49.0905 14.0403 49 14.4999 49C14.9596 49 15.4147 49.0905 15.8393 49.2664C16.264 49.4423 16.6498 49.7001 16.9748 50.0251C17.2998 50.3501 17.5576 50.736 17.7335 51.1606C17.9094 51.5852 17.9999 52.0404 17.9999 52.5V58ZM39.9999 52.5V58H19.9999V52.5C19.9993 51.141 19.4955 49.8303 18.5858 48.8208C17.676 47.8112 16.4247 47.1742 15.0731 47.0326C13.7215 46.8909 12.3653 47.2547 11.266 48.0538C10.1668 48.8529 9.40228 50.0306 9.11994 51.36C8.50518 50.8317 7.78124 50.4458 6.99994 50.23V30.56C7.99994 30.12 6.14994 31.56 29.9999 11.56C53.8599 31.56 51.9999 30.15 52.9999 30.56V50.23C52.2239 50.4463 51.504 50.8285 50.8899 51.35C50.5976 50.0275 49.8285 48.859 48.7293 48.0676C47.6302 47.2763 46.2781 46.9174 44.9312 47.0597C43.5842 47.2019 42.3369 47.8352 41.4273 48.8387C40.5177 49.8423 40.0096 51.1456 39.9999 52.5ZM57.9999 58H41.9999V52.5C41.9934 52.0404 42.0774 51.584 42.2472 51.1568C42.4171 50.7296 42.6693 50.3401 42.9897 50.0105C43.3101 49.6808 43.6922 49.4175 44.1144 49.2356C44.5365 49.0536 44.9903 48.9566 45.4499 48.95C45.9096 48.9434 46.366 49.0275 46.7931 49.1973C47.2203 49.3671 47.6098 49.6194 47.9395 49.9398C48.2691 50.2601 48.5324 50.6423 48.7144 51.0644C48.8963 51.4865 48.9934 51.9404 48.9999 52.4V55.5C48.9999 55.7652 49.1053 56.0196 49.2928 56.2071C49.4804 56.3946 49.7347 56.5 49.9999 56.5C50.2652 56.5 50.5195 56.3946 50.7071 56.2071C50.8946 56.0196 50.9999 55.7652 50.9999 55.5C50.9999 55.0404 51.0905 54.5852 51.2664 54.1606C51.4423 53.736 51.7001 53.3501 52.0251 53.0251C52.3501 52.7001 52.7359 52.4423 53.1605 52.2664C53.5852 52.0905 54.0403 52 54.4999 52C54.9596 52 55.4147 52.0905 55.8393 52.2664C56.264 52.4423 56.6498 52.7001 56.9748 53.0251C57.2998 53.3501 57.5576 53.736 57.7335 54.1606C57.9094 54.5852 57.9999 55.0404 57.9999 55.5V58Z" />
          <path d="M48 41V31C48 29.9391 47.5786 28.9217 46.8284 28.1716C46.0783 27.4214 45.0609 27 44 27H16C14.9391 27 13.9217 27.4214 13.1716 28.1716C12.4214 28.9217 12 29.9391 12 31V41C12 42.0609 12.4214 43.0783 13.1716 43.8284C13.9217 44.5786 14.9391 45 16 45H44C45.0609 45 46.0783 44.5786 46.8284 43.8284C47.5786 43.0783 48 42.0609 48 41ZM46 41C46 41.5304 45.7893 42.0391 45.4142 42.4142C45.0391 42.7893 44.5304 43 44 43H16C15.4696 43 14.9609 42.7893 14.5858 42.4142C14.2107 42.0391 14 41.5304 14 41V31C14 30.4696 14.2107 29.9609 14.5858 29.5858C14.9609 29.2107 15.4696 29 16 29H44C44.5304 29 45.0391 29.2107 45.4142 29.5858C45.7893 29.9609 46 30.4696 46 31V41Z" />
          <path d="M18.5 33C19.3 33 20 33.47 20 34C20 34.2652 20.1054 34.5196 20.2929 34.7071C20.4804 34.8947 20.7348 35 21 35C22.95 35 22 31 18.5 31C17.6399 30.9418 16.7913 31.2235 16.1367 31.7845C15.4822 32.3456 15.074 33.1411 15 34C15.074 34.8589 15.4822 35.6544 16.1367 36.2155C16.7913 36.7765 17.6399 37.0582 18.5 37C19.3 37 20 37.47 20 38C20 38.53 19.3 39 18.5 39C17.7 39 17 38.53 17 38C17 37.7348 16.8946 37.4804 16.7071 37.2929C16.5196 37.1054 16.2652 37 16 37C14.05 37 15 41 18.5 41C19.3601 41.0582 20.2087 40.7765 20.8633 40.2155C21.5178 39.6544 21.926 38.8589 22 38C21.926 37.1411 21.5178 36.3456 20.8633 35.7845C20.2087 35.2235 19.3601 34.9418 18.5 35C17.7 35 17 34.53 17 34C17 33.47 17.7 33 18.5 33ZM36 39H33V32C33 31.7348 32.8946 31.4804 32.7071 31.2929C32.5196 31.1054 32.2652 31 32 31C31.7348 31 31.4804 31.1054 31.2929 31.2929C31.1054 31.4804 31 31.7348 31 32V40C31 40.2652 31.1054 40.5196 31.2929 40.7071C31.4804 40.8947 31.7348 41 32 41H36C36.2652 41 36.5196 40.8947 36.7071 40.7071C36.8946 40.5196 37 40.2652 37 40C37 39.7348 36.8946 39.4804 36.7071 39.2929C36.5196 39.1054 36.2652 39 36 39ZM41 31H39C38.7348 31 38.4804 31.1054 38.2929 31.2929C38.1054 31.4804 38 31.7348 38 32V40C38 40.2652 38.1054 40.5196 38.2929 40.7071C38.4804 40.8947 38.7348 41 39 41H41C42.0609 41 43.0783 40.5786 43.8284 39.8284C44.5786 39.0783 45 38.0609 45 37V35C45 33.9391 44.5786 32.9217 43.8284 32.1716C43.0783 31.4214 42.0609 31 41 31ZM43 37C43 37.5304 42.7893 38.0391 42.4142 38.4142C42.0391 38.7893 41.5304 39 41 39H40V33H41C41.5304 33 42.0391 33.2107 42.4142 33.5858C42.7893 33.9609 43 34.4696 43 35V37ZM27 31H26C25.2044 31 24.4413 31.3161 23.8787 31.8787C23.3161 32.4413 23 33.2044 23 34V38C23 38.7957 23.3161 39.5587 23.8787 40.1213C24.4413 40.6839 25.2044 41 26 41H27C27.7956 41 28.5587 40.6839 29.1213 40.1213C29.6839 39.5587 30 38.7957 30 38V34C30 33.2044 29.6839 32.4413 29.1213 31.8787C28.5587 31.3161 27.7956 31 27 31ZM28 38C28 38.2652 27.8946 38.5196 27.7071 38.7071C27.5196 38.8947 27.2652 39 27 39H26C25.7348 39 25.4804 38.8947 25.2929 38.7071C25.1054 38.5196 25 38.2652 25 38V34C25 33.7348 25.1054 33.4804 25.2929 33.2929C25.4804 33.1054 25.7348 33 26 33H27C27.2652 33 27.5196 33.1054 27.7071 33.2929C27.8946 33.4804 28 33.7348 28 34V38Z" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 60 60" className={common} fill="currentColor" aria-hidden>
          <path d="M54.46 8.606H53.466V4.766C53.465 3.76752 53.0678 2.81024 52.3618 2.10421C51.6558 1.39817 50.6985 1.00106 49.7 1C48.7014 1.00106 47.7439 1.39831 47.0379 2.10456C46.3318 2.81081 45.9348 3.76835 45.934 4.767V8.607H43.506V4.767C43.5052 3.76817 43.1081 2.81048 42.4018 2.10421C41.6955 1.39793 40.7378 1.00079 39.739 1C38.7404 1.00106 37.7829 1.39831 37.0769 2.10456C36.3708 2.81081 35.9738 3.76835 35.973 4.767V8.607H33.545V4.767C33.5442 3.76817 33.1471 2.81048 32.4408 2.10421C31.7345 1.39793 30.7768 1.00079 29.778 1C28.7794 1.00106 27.8219 1.39831 27.1159 2.10456C26.4098 2.81081 26.0128 3.76835 26.012 4.767V8.607H23.584V4.767C23.5832 3.76817 23.1861 2.81048 22.4798 2.10421C21.7735 1.39793 20.8158 1.00079 19.817 1C18.8184 1.00106 17.8609 1.39831 17.1549 2.10456C16.4488 2.81081 16.0518 3.76835 16.051 4.767V8.607H13.623V4.767C13.6222 3.76817 13.2251 2.81048 12.5188 2.10421C11.8125 1.39793 10.8548 1.00079 9.85601 1C8.85736 1.00106 7.89993 1.39831 7.19386 2.10456C6.4878 2.81081 6.09081 3.76835 6.09001 4.767V8.607H5.09601C4.27557 8.60806 3.48901 8.93431 2.90868 9.51426C2.32836 10.0942 2.0016 10.8806 2.00001 11.701V29.474C2.00758 29.695 2.10072 29.9045 2.25976 30.0582C2.41881 30.2119 2.63134 30.2978 2.85251 30.2978C3.07369 30.2978 3.28621 30.2119 3.44526 30.0582C3.60431 29.9045 3.69744 29.695 3.70501 29.474V20.717H42.767C42.9932 20.717 43.2102 20.6271 43.3702 20.4672C43.5301 20.3072 43.62 20.0902 43.62 19.864C43.62 19.6378 43.5301 19.4208 43.3702 19.2608C43.2102 19.1009 42.9932 19.011 42.767 19.011H3.70501V11.701C3.70501 10.935 4.32901 10.311 5.09601 10.311H6.09001V10.794C6.09107 11.7925 6.48818 12.7498 7.19422 13.4558C7.90025 14.1618 8.85753 14.5589 9.85601 14.56C10.8547 14.5592 11.8122 14.1622 12.5185 13.4561C13.2247 12.7501 13.622 11.7927 13.623 10.794V10.311H16.051V10.794C16.0521 11.7927 16.4493 12.7501 17.1556 13.4561C17.8618 14.1622 18.8194 14.5592 19.818 14.56C20.8165 14.5589 21.7738 14.1618 22.4798 13.4558C23.1858 12.7498 23.583 11.7925 23.584 10.794V10.311H26.012V10.794C26.0131 11.7925 26.4102 12.7498 27.1162 13.4558C27.8222 14.1618 28.7795 14.5589 29.778 14.56C30.7767 14.5592 31.7342 14.1622 32.4405 13.4561C33.1467 12.7501 33.544 11.7927 33.545 10.794V10.311H35.973V10.794C35.9741 11.7925 36.3712 12.7498 37.0772 13.4558C37.7832 14.1618 38.7405 14.5589 39.739 14.56C40.7377 14.5592 41.6952 14.1622 42.4015 13.4561C43.1077 12.7501 43.505 11.7927 43.506 10.794V10.311H45.934V10.794C45.9351 11.7925 46.3322 12.7498 47.0382 13.4558C47.7442 14.1618 48.7015 14.5589 49.7 14.56C50.6985 14.5589 51.6558 14.1618 52.3618 13.4558C53.0678 12.7498 53.465 11.7925 53.466 10.794V10.311H54.46C55.227 10.311 55.851 10.935 55.851 11.701V19.011H46.178C45.9518 19.011 45.7348 19.1009 45.5748 19.2608C45.4149 19.4208 45.325 19.6378 45.325 19.864C45.325 20.0902 45.4149 20.3072 45.5748 20.4672C45.7348 20.6271 45.9518 20.717 46.178 20.717H55.851V55.625C55.8507 56.0674 55.675 56.4916 55.3622 56.8045C55.0495 57.1174 54.6254 57.2935 54.183 57.294H5.37301C4.93062 57.2935 4.50651 57.1174 4.19379 56.8045C3.88106 56.4916 3.70528 56.0674 3.70501 55.625V32.885C3.70893 32.7706 3.68978 32.6566 3.6487 32.5497C3.60763 32.4429 3.54546 32.3454 3.46591 32.2631C3.38636 32.1807 3.29106 32.1153 3.18567 32.0706C3.08029 32.0258 2.96699 32.0028 2.85251 32.0028C2.73804 32.0028 2.62473 32.0258 2.51935 32.0706C2.41397 32.1153 2.31866 32.1807 2.23911 32.2631C2.15956 32.3454 2.0974 32.4429 2.05632 32.5497C2.01524 32.6566 1.99609 32.7706 2.00001 32.885V55.625C2.00054 56.5198 2.35615 57.3778 2.98876 58.0105C3.62136 58.6433 4.47924 58.9992 5.37401 59H54.183C55.0774 58.9989 55.9349 58.6431 56.5673 58.0105C57.1996 57.378 57.5552 56.5204 57.556 55.626V11.702C57.555 10.8812 57.2284 10.0943 56.648 9.51397C56.0677 8.93358 55.2808 8.60706 54.46 8.606ZM11.917 10.795C11.9165 11.3413 11.6993 11.865 11.3131 12.2514C10.9269 12.6378 10.4033 12.8552 9.85701 12.856C9.31039 12.8557 8.78622 12.6385 8.3996 12.2521C8.01299 11.8657 7.79554 11.3416 7.79501 10.795V4.767C7.79501 3.63 8.72001 2.705 9.85601 2.705C10.993 2.705 11.917 3.63 11.917 4.767V10.795ZM21.878 10.795C21.8775 11.3413 21.6603 11.865 21.2741 12.2514C20.8879 12.6378 20.3643 12.8552 19.818 12.856C19.2715 12.8555 18.7475 12.6382 18.3609 12.2518C17.9743 11.8655 17.7568 11.3415 17.756 10.795V4.767C17.756 3.63 18.681 2.705 19.817 2.705C20.954 2.705 21.878 3.63 21.878 4.767V10.795ZM31.839 10.795C31.8382 11.3412 31.621 11.8648 31.2348 12.2511C30.8487 12.6374 30.3252 12.8549 29.779 12.856C29.2325 12.8555 28.7085 12.6382 28.3219 12.2518C27.9353 11.8655 27.7178 11.3415 27.717 10.795V4.767C27.717 3.63 28.642 2.705 29.778 2.705C30.915 2.705 31.839 3.63 31.839 4.767V10.795ZM41.8 10.795C41.7995 11.3413 41.5823 11.865 41.1961 12.2514C40.8099 12.6378 40.2863 12.8552 39.74 12.856C39.1934 12.8557 38.6692 12.6385 38.2826 12.2521C37.896 11.8657 37.6785 11.3416 37.678 10.795V4.767C37.678 3.63 38.603 2.705 39.74 2.705C40.876 2.705 41.8 3.63 41.8 4.767V10.795ZM51.761 10.795C51.7605 11.3413 51.5433 11.865 51.1571 12.2514C50.7709 12.6378 50.2473 12.8552 49.701 12.856C49.1544 12.8557 48.6302 12.6385 48.2436 12.2521C47.857 11.8657 47.6395 11.3416 47.639 10.795V4.767C47.639 3.63 48.563 2.705 49.7 2.705C50.837 2.705 51.761 3.63 51.761 4.767V10.795Z" />
          <path d="M29.7782 49.946C36.2902 49.946 41.5882 44.648 41.5882 38.136C41.5882 31.624 36.2902 26.326 29.7782 26.326C23.2662 26.326 17.9682 31.624 17.9682 38.136C17.9682 44.648 23.2662 49.946 29.7782 49.946ZM29.7782 28.032C35.3502 28.032 39.8832 32.564 39.8832 38.136C39.8832 43.708 35.3502 48.241 29.7782 48.241C24.2072 48.241 19.6742 43.708 19.6742 38.136C19.6742 32.564 24.2072 28.032 29.7782 28.032Z" />
          <path d="M27.7652 42.491C27.9252 42.681 28.1572 42.791 28.4052 42.796H28.4182C28.5379 42.7961 28.6564 42.7709 28.7658 42.7221C28.8752 42.6734 28.9731 42.6021 29.0532 42.513L35.7842 35.01C35.9329 34.8412 36.009 34.6206 35.9958 34.396C35.9826 34.1714 35.8813 33.9611 35.7138 33.8109C35.5463 33.6607 35.3263 33.5828 35.1016 33.594C34.8769 33.6053 34.6658 33.7048 34.5142 33.871L28.4392 40.643L26.8282 38.723C26.6795 38.5608 26.4739 38.4623 26.2544 38.448C26.0348 38.4337 25.8182 38.5046 25.6497 38.646C25.4812 38.7875 25.3737 38.9885 25.3498 39.2072C25.3259 39.4259 25.3872 39.6454 25.5212 39.82L27.7652 42.491Z" />
        </svg>
      );
    case "house-tag":
      return (
        <svg viewBox="0 0 60 60" className={common} fill="currentColor" aria-hidden>
          <path d="M57.687 26.726H41.084V24.74C41.0832 23.8985 40.7486 23.0916 40.1535 22.4965C39.5584 21.9015 38.7516 21.5668 37.91 21.566C37.0684 21.5668 36.2616 21.9015 35.6665 22.4965C35.0714 23.0916 34.7368 23.8985 34.736 24.74V26.726H18.133C17.5198 26.7268 16.9319 26.9707 16.4983 27.4043C16.0647 27.8379 15.8208 28.4258 15.82 29.039V44.147C15.8205 44.7603 16.0644 45.3483 16.498 45.782C16.9317 46.2156 17.5197 46.4595 18.133 46.46H20.933V52.76H8.865V22.218L29.056 8.787L49.248 22.22V27.237C49.248 27.4646 49.3384 27.6828 49.4993 27.8437C49.6602 28.0046 49.8784 28.095 50.106 28.095C50.3336 28.095 50.5518 28.0046 50.7127 27.8437C50.8736 27.6828 50.964 27.4646 50.964 27.237V23.362L53.566 25.092C54.0457 25.412 54.6094 25.5828 55.186 25.5828C55.7626 25.5828 56.3263 25.412 56.806 25.092C57.2079 24.8254 57.5376 24.4634 57.7655 24.0383C57.9934 23.6132 58.1124 23.1383 58.112 22.656C58.1124 22.1739 57.9934 21.6993 57.7657 21.2744C57.538 20.8495 57.2086 20.4876 56.807 20.221L29.887 2.312C29.641 2.1478 29.3518 2.06017 29.056 2.06017C28.7602 2.06017 28.471 2.1478 28.225 2.312L12.605 12.702C12.5111 12.7644 12.4304 12.8448 12.3676 12.9384C12.3047 13.032 12.2609 13.1371 12.2387 13.2477C12.2165 13.3582 12.2162 13.472 12.238 13.5827C12.2597 13.6933 12.3031 13.7986 12.3655 13.8925C12.4279 13.9864 12.5083 14.0671 12.6019 14.1299C12.6955 14.1928 12.8006 14.2366 12.9111 14.2588C13.0217 14.2811 13.1355 14.2813 13.2462 14.2595C13.3568 14.2378 13.4621 14.1944 13.556 14.132L29.056 3.822L55.856 21.649C56.199 21.877 56.396 22.244 56.396 22.655C56.396 23.067 56.199 23.434 55.856 23.662C55.449 23.932 54.924 23.932 54.516 23.662L29.888 7.278C29.642 7.1138 29.3528 7.02617 29.057 7.02617C28.7612 7.02617 28.472 7.1138 28.226 7.278L3.595 23.662C3.188 23.932 2.663 23.932 2.256 23.662C2.08888 23.553 1.95183 23.4038 1.85747 23.228C1.76311 23.0522 1.71446 22.8555 1.716 22.656C1.716 22.244 1.913 21.877 2.256 21.649L14.975 13.219C15.0689 13.1566 15.1496 13.0764 15.2125 12.9828C15.2753 12.8892 15.3192 12.7842 15.3415 12.6737C15.3637 12.5632 15.364 12.4494 15.3424 12.3388C15.3207 12.2282 15.2774 12.1229 15.215 12.029C15.1526 11.9351 15.0724 11.8544 14.9788 11.7915C14.8852 11.7287 14.7802 11.6848 14.6697 11.6625C14.5592 11.6403 14.4454 11.64 14.3348 11.6617C14.2242 11.6834 14.1189 11.7266 14.025 11.789L1.305 20.219C0.903245 20.4857 0.573797 20.8478 0.346078 21.2728C0.11836 21.6979 -0.000538007 22.1728 1.83009e-06 22.655C1.83009e-06 23.637 0.488002 24.548 1.305 25.091C1.78482 25.4111 2.3487 25.5819 2.9255 25.5819C3.5023 25.5819 4.06618 25.4111 4.546 25.091L7.148 23.361V52.759H3.858C3.17133 52.7598 2.51302 53.0329 2.02747 53.5185C1.54193 54.004 1.2688 54.6623 1.268 55.349C1.2688 56.0357 1.54193 56.694 2.02747 57.1795C2.51302 57.6651 3.17133 57.9382 3.858 57.939H54.254C54.9407 57.9382 55.599 57.6651 56.0845 57.1795C56.5701 56.694 56.8432 56.0357 56.844 55.349C56.8432 54.6623 56.5701 54.004 56.0845 53.5185C55.599 53.0329 54.9407 52.7598 54.254 52.759H50.964V45.95C50.964 45.7225 50.8736 45.5042 50.7127 45.3433C50.5518 45.1824 50.3336 45.092 50.106 45.092C49.8784 45.092 49.6602 45.1824 49.4993 45.3433C49.3384 45.5042 49.248 45.7225 49.248 45.95V52.76H41.084V46.46H57.687C58.3003 46.4595 58.8883 46.2156 59.322 45.782C59.7556 45.3483 59.9995 44.7603 60 44.147V29.04C59.9992 28.4268 59.7553 27.8389 59.3217 27.4053C58.8881 26.9717 58.3002 26.7268 57.687 26.726ZM36.453 24.74C36.453 23.937 37.107 23.283 37.91 23.283C38.713 23.283 39.367 23.936 39.367 24.74V26.726H36.453V24.74ZM34.736 56.222H3.858C3.6337 56.2113 3.42213 56.1146 3.26718 55.9521C3.11224 55.7895 3.0258 55.5736 3.0258 55.349C3.0258 55.1244 3.11224 54.9085 3.26718 54.746C3.42213 54.5834 3.6337 54.4867 3.858 54.476H34.736V56.222ZM34.736 52.759H22.65V46.46H34.736V52.759ZM39.366 56.222H36.453V46.46H39.367L39.366 56.222ZM54.254 54.476C54.4783 54.4867 54.6899 54.5834 54.8448 54.746C54.9998 54.9085 55.0862 55.1244 55.0862 55.349C55.0862 55.5736 54.9998 55.7895 54.8448 55.9521C54.6899 56.1146 54.4783 56.2113 54.254 56.222H41.084V54.476H54.254ZM57.687 44.743H18.133C17.975 44.7427 17.8236 44.6799 17.7119 44.5681C17.6001 44.4564 17.5373 44.305 17.537 44.147V29.04C17.537 28.712 17.804 28.444 18.133 28.444H57.687C58.016 28.444 58.283 28.711 58.283 29.04V44.148C58.2827 44.306 58.2199 44.4574 58.1081 44.5691C57.9964 44.6809 57.845 44.7427 57.687 44.743Z" />
          <path d="M29.0559 12.566C27.6221 12.5676 26.2475 13.1379 25.2337 14.1517C24.2198 15.1656 23.6495 16.5402 23.6479 17.974C23.6495 19.4078 24.2198 20.7824 25.2337 21.7963C26.2475 22.8101 27.6221 23.3804 29.0559 23.382C30.4898 23.3804 31.8644 22.8101 32.8782 21.7963C33.8921 20.7824 34.4624 19.4078 34.4639 17.974C34.4624 16.5402 33.8921 15.1656 32.8782 14.1517C31.8644 13.1379 30.4898 12.5676 29.0559 12.566ZM28.1979 21.563C27.535 21.4031 26.929 21.0631 26.4469 20.5807C25.9649 20.0983 25.6254 19.4921 25.4659 18.829H28.1979V21.563ZM28.1979 17.113H25.4679C25.6281 16.4512 25.9677 15.8464 26.4493 15.3651C26.931 14.8838 27.536 14.5447 28.1979 14.385V17.112V17.113ZM29.9149 14.385C30.5767 14.5446 31.1817 14.8836 31.6633 15.3647C32.145 15.8458 32.4846 16.4504 32.6449 17.112H29.9149V14.385ZM29.9149 21.563V18.83H32.6459C32.4867 19.493 32.1474 20.0992 31.6655 20.5816C31.1836 21.064 30.5778 21.403 29.9149 21.563ZM29.9879 40.153L28.3579 37.13C29.2909 36.844 29.9879 36.073 29.9879 34.642C29.9879 32.665 28.6689 32.043 27.0399 32.043H24.5769C24.5099 32.0407 24.443 32.0519 24.3803 32.0757C24.3176 32.0996 24.2603 32.1357 24.2117 32.182C24.1631 32.2282 24.1242 32.2837 24.0973 32.3452C24.0704 32.4067 24.056 32.4729 24.0549 32.54V40.625C24.0549 40.961 24.4649 41.135 24.8629 41.135C25.2729 41.135 25.6719 40.961 25.6719 40.625V37.38H26.7159L28.4829 40.813C28.6069 41.062 28.8189 41.199 29.0429 41.199C29.5149 41.199 30.0499 40.763 30.0499 40.353C30.051 40.2814 30.0293 40.2114 29.9879 40.153ZM27.0399 36.11H25.6719V33.46H27.0399C27.8479 33.46 28.3699 33.81 28.3699 34.792C28.3699 35.775 27.8479 36.11 27.0399 36.11ZM36.5299 39.717H33.0099V37.217H34.9C35.2479 37.217 35.4099 36.881 35.4099 36.595C35.4099 36.26 35.2229 35.948 34.9 35.948H33.0099V33.461H36.5299C36.8529 33.461 37.0399 33.125 37.0399 32.739C37.0399 32.404 36.8779 32.043 36.5299 32.043H32.0999C31.7399 32.043 31.3909 32.217 31.3909 32.553V40.625C31.3909 40.961 31.74 41.135 32.101 41.135H36.5279C36.8769 41.135 37.0379 40.775 37.0379 40.439C37.0379 40.053 36.8519 39.717 36.5279 39.717H36.5299ZM43.4569 32.043C43.0469 32.043 42.6479 32.193 42.6479 32.54V37.54L40.2479 32.901C39.8619 32.167 39.6259 32.043 39.0409 32.043C38.6309 32.043 38.233 32.205 38.233 32.553V40.625C38.233 40.961 38.6309 41.135 39.0409 41.135C39.4389 41.135 39.8499 40.961 39.8499 40.625V35.625L42.5239 40.625C42.7359 41.011 43.0709 41.135 43.4569 41.135C43.8549 41.135 44.2659 40.961 44.2659 40.625V32.541C44.2659 32.192 43.8559 32.043 43.4569 32.043ZM51.1799 32.043H45.9199C45.5709 32.043 45.4099 32.416 45.4099 32.764C45.4099 33.162 45.5959 33.498 45.9199 33.498H47.7479V40.625C47.7479 40.961 48.1459 41.135 48.5559 41.135C48.9539 41.135 49.365 40.961 49.365 40.625V33.498H51.1809C51.5039 33.498 51.691 33.15 51.691 32.764C51.691 32.416 51.5279 32.043 51.1799 32.043Z" />
        </svg>
      );
    case "hourglass":
      return (
        <svg viewBox="0 0 60 60" className={common} fill="currentColor" aria-hidden>
          <path d="M39.583 10.058V6.25C40.6879 6.24921 41.7473 5.80993 42.5286 5.02864C43.3099 4.24734 43.7492 3.18791 43.75 2.083V1.042C43.75 0.466 43.284 0 42.708 0H7.292C6.716 0 6.25 0.466 6.25 1.042V2.083C6.25079 3.18791 6.69007 4.24734 7.47136 5.02864C8.25266 5.80993 9.31209 6.24921 10.417 6.25V10.058C10.4182 11.956 10.8179 13.8326 11.5901 15.5664C12.3624 17.3001 13.49 18.8525 14.9 20.123L20.318 25L14.9 29.877C13.4898 31.1476 12.3622 32.7001 11.5899 34.4341C10.8177 36.1681 10.4181 38.0448 10.417 39.943V43.75C9.31209 43.7508 8.25266 44.1901 7.47136 44.9714C6.69007 45.7527 6.25079 46.8121 6.25 47.917V48.958C6.25 49.534 6.716 50 7.292 50H42.708C43.284 50 43.75 49.534 43.75 48.958V47.917C43.7492 46.8121 43.3099 45.7527 42.5286 44.9714C41.7473 44.1901 40.6879 43.7508 39.583 43.75V39.942C39.5818 38.044 39.1821 36.1674 38.4099 34.4336C37.6376 32.6999 36.51 31.1475 35.1 29.877L29.682 25L35.1 20.123C36.5101 18.8525 37.6377 17.3002 38.41 15.5664C39.1822 13.8326 39.5818 11.956 39.583 10.058ZM8.333 2.083H41.667C41.6665 2.63555 41.4467 3.16531 41.056 3.55603C40.6653 3.94674 40.1355 4.16647 39.583 4.167H10.417C9.86445 4.16647 9.33469 3.94674 8.94397 3.55603C8.55326 3.16531 8.33353 2.63555 8.333 2.083ZM41.667 47.917H8.333C8.333 46.768 9.268 45.833 10.417 45.833H39.583C40.732 45.833 41.667 46.768 41.667 47.917ZM17.707 43.75L25 34.028L32.292 43.75H17.707ZM33.707 18.575L27.428 24.225C27.319 24.3225 27.2318 24.442 27.1721 24.5755C27.1124 24.7091 27.0815 24.8537 27.0815 25C27.0815 25.1463 27.1124 25.2909 27.1721 25.4245C27.2318 25.558 27.319 25.6775 27.428 25.775L33.707 31.425C34.9 32.5002 35.8541 33.8138 36.5075 35.2809C37.1609 36.748 37.499 38.336 37.5 39.942V43.75H34.895L25.833 31.667C25.44 31.142 24.56 31.142 24.167 31.667L15.105 43.75H12.5V39.942C12.5 36.699 13.882 33.595 16.293 31.425L22.572 25.774C22.6807 25.6765 22.7676 25.5571 22.8271 25.4238C22.8866 25.2904 22.9174 25.146 22.9174 25C22.9174 24.854 22.8866 24.7096 22.8271 24.5762C22.7676 24.4429 22.6807 24.3235 22.572 24.226L16.293 18.575C15.1 17.4998 14.1459 16.1862 13.4925 14.7191C12.8391 13.252 12.501 11.664 12.5 10.058V6.25H37.5V10.058C37.5 13.301 36.118 16.405 33.707 18.575Z" />
          <path d="M32.18 14.583H17.82C17.6182 14.583 17.4208 14.6415 17.2516 14.7516C17.0825 14.8616 16.9489 15.0183 16.8672 15.2028C16.7854 15.3873 16.759 15.5915 16.7911 15.7907C16.8232 15.9899 16.9124 16.1755 17.048 16.325L17.211 16.515C17.361 16.693 17.511 16.87 17.685 17.025L24.301 23.016C24.4919 23.1906 24.7413 23.2873 25 23.2873C25.2587 23.2873 25.508 23.1906 25.699 23.016L32.313 17.026C32.4835 16.8678 32.6423 16.6973 32.788 16.516L32.951 16.325C33.0874 16.1759 33.1774 15.9903 33.21 15.7909C33.2426 15.5915 33.2165 15.3869 33.1347 15.2021C33.0529 15.0173 32.919 14.8603 32.7495 14.7504C32.5799 14.6405 32.382 14.5823 32.18 14.583ZM25 20.838L20.393 16.667H29.606L25 20.838Z" />
        </svg>
      );
  }
}
