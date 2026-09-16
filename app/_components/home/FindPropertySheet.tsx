"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Breadcrumb } from "../ui/Breadcrumb";

/**
 * The amenity chips of the mobile comp that exist as feed flags. The comp
 * also lists "Close to transport", "Exhaust" and "Lift installed", which the
 * feed has no flag for — a chip that filters nothing would only mislead, so
 * those three are left out.
 */
const AMENITY_CHIPS = [
  { key: "airConditioning", label: "Air conditioning" },
  { key: "alarmSystem", label: "Alarm system" },
  { key: "balcony", label: "Balcony" },
  { key: "dishwasher", label: "Dishwasher" },
  { key: "floorboards", label: "Floorboards" },
  { key: "fullyFenced", label: "Fully fenced" },
  { key: "outdoorEnt", label: "Outdoor entertaining" },
  { key: "secureParking", label: "Secure parking" },
] as const;

const WANT_TO = ["Buy", "Rent", "PG"] as const;
export type WantTo = (typeof WANT_TO)[number];

/** `beds` is a minimum on the listing pages, so "More" reads as four and up. */
const BEDROOMS = [
  { label: "1 Rk", beds: "1" },
  { label: "1 BHK", beds: "1" },
  { label: "2 BHK", beds: "2" },
  { label: "3 BHK", beds: "3" },
  { label: "More", beds: "4" },
] as const;

const SALE_BUDGET = [250000, 500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000];
/** Rentals are advertised per week, and that is what /rent compares against. */
const RENT_BUDGET = [300, 400, 500, 600, 800, 1000, 1500, 2000];

function money(n: number, rent: boolean): string {
  if (rent) return `$${n.toLocaleString("en-AU")} pw`;
  return n >= 1_000_000 ? `$${(n / 1_000_000).toLocaleString("en-AU")}M` : `$${n / 1000}k`;
}

type Props = {
  onClose: () => void;
  /** Where the hero's own picker stood when the sheet opened. */
  initialWantTo?: WantTo;
};

/**
 * The phone's "Find Property" sheet, per the mobile comp: opened from the
 * hero's search pill, it covers the page with an address field, amenity
 * chips, the residential/commercial and buy/rent pickers, property type,
 * bedrooms, city and budget, and ends on Reset / Search.
 *
 * Search hands off to the listing pages, which own the filtering: it builds
 * the same query string the desktop search bar and the listing pages' own
 * filters use (`q`, `min`, `max`, `beds`, `feature`) and navigates to /buy or
 * /rent. "PG" has no counterpart in this market and goes to rentals. Two
 * controls have nothing to filter on yet — the listing query has no
 * residential/commercial or house/unit dimension — so they are drawn as the
 * comp has them but do not change the results.
 *
 * Mounted only while open, so every field starts fresh each time and the
 * body scroll lock is simply the component's lifetime.
 */
export function FindPropertySheet({ onClose, initialWantTo = "Buy" }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [segment, setSegment] = useState<"Residential" | "Commercial">("Residential");
  const [wantTo, setWantTo] = useState<WantTo>(initialWantTo);
  const [propertyType, setPropertyType] = useState<"flats" | "houses">("flats");
  const [bedLabel, setBedLabel] = useState("");
  const [city, setCity] = useState("");
  const beds = BEDROOMS.find((b) => b.label === bedLabel)?.beds ?? "";
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  // The suburbs with stock, read once from the page's streamed <datalist>
  // (SuburbOptions renders it beside the hero). A lazy initialiser rather
  // than an effect: the sheet only ever mounts on the client, after a tap,
  // so the DOM is there to read. The list feeds a native <select> — the
  // browser's own datalist popup is unstyled and sits wherever it likes
  // over the keyboard, which is what the City field used to show.
  const [suburbs] = useState<string[]>(() =>
    Array.from(document.querySelectorAll<HTMLOptionElement>("#hero-suburbs option"))
      .map((o) => o.value)
      .filter(Boolean),
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const rent = wantTo !== "Buy";
  const budget = rent ? RENT_BUDGET : SALE_BUDGET;

  // Address suggestions: suburbs matching what has been typed, the ones
  // that start with it first, drawn as a list of our own under the field
  // (a styled stand-in for the browser's datalist popup). Hidden again once
  // the field loses focus or the typed text is exactly a suburb.
  const [addressFocused, setAddressFocused] = useState(false);
  const needle = q.trim().toLowerCase();
  const suggestions =
    needle.length === 0
      ? []
      : suburbs
          .filter((s) => s.toLowerCase().includes(needle))
          .sort((a, b) => {
            const aStarts = a.toLowerCase().startsWith(needle) ? 0 : 1;
            const bStarts = b.toLowerCase().startsWith(needle) ? 0 : 1;
            return aStarts - bStarts || a.localeCompare(b);
          })
          .slice(0, 6);
  const showSuggestions =
    addressFocused &&
    suggestions.length > 0 &&
    !(suggestions.length === 1 && suggestions[0].toLowerCase() === needle);

  const toggleAmenity = (key: string) =>
    setAmenities((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]));

  const reset = () => {
    setQ("");
    setAmenities([]);
    setSegment("Residential");
    setWantTo("Buy");
    setPropertyType("flats");
    setBedLabel("");
    setCity("");
    setMin("");
    setMax("");
  };

  const search = () => {
    const sp = new URLSearchParams();
    // The listing pages match one place string; the address wins, the city
    // stands in when only it was filled.
    const where = q.trim() || city.trim();
    if (where) sp.set("q", where);
    if (min) sp.set("min", min);
    if (max) sp.set("max", max);
    if (beds) sp.set("beds", beds);
    for (const a of amenities) sp.append("feature", a);
    const qs = sp.toString();
    router.push(`${rent ? "/rent" : "/buy"}${qs ? `?${qs}` : ""}`);
  };

  const heading = "font-display text-[14px] font-semibold text-brand-bunker";
  const subheading = "font-display text-[13px] font-medium text-brand-bunker/70";
  const field =
    "h-[44px] w-full rounded-[10px] border border-brand-silver bg-white px-[14px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/45 focus:border-brand-navy focus:outline-none";
  const radioPill = (active: boolean) =>
    `inline-flex h-[32px] items-center gap-[8px] rounded-full border px-[12px] font-display text-[12px] font-medium transition ${
      active ? "border-brand-navy text-brand-navy" : "border-brand-silver text-brand-bunker/60"
    }`;
  const dot = (active: boolean) => (
    <span
      className={`flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full border ${
        active ? "border-brand-navy" : "border-brand-silver"
      }`}
    >
      {active && <span className="h-[7px] w-[7px] rounded-full bg-brand-navy" />}
    </span>
  );
  const chevron = (
    <svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute right-[14px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-brand-bunker/60"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );

  // Portalled to <body>: the trigger sits inside the hero, whose fade-up
  // wrapper keeps a transform once its animation has settled, and a
  // transformed ancestor becomes the containing block for `fixed` — the sheet
  // would open inside the hero's box and be clipped by it.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Find property"
      className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-white sm:hidden"
    >
      {/* Same header as the nav drawer, so the sheet reads as part of the site chrome. */}
      <div className="container-page flex h-[56px] shrink-0 items-center justify-between">
        <Link href="/" className="block shrink-0" onClick={onClose}>
          <Image
            src="/logo/LOGO.png"
            alt="Blue Ribbon Real Estate"
            width={1232}
            height={821}
            className="h-[104px] w-auto"
          />
        </Link>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex h-[48px] w-[48px] items-center justify-center text-brand-bunker transition hover:opacity-70"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[22px] w-[22px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>
      </div>

      {/* data-lenis-prevent: the site's smooth scroller takes every wheel
          event and drives the page with it — which is locked behind the
          sheet, so nothing moved. The attribute tells Lenis to leave this
          box's own scrolling to the browser. */}
      <div
        data-lenis-prevent
        className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain [touch-action:pan-y]"
      >
        <div className="container-page pt-[4px] pb-[12px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Find Property" }]} />
        </div>

        <div className="container-page pb-[32px]">
          {/* Address. z-10 so the suggestion list paints over the chips. */}
          <div className="relative z-10">
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-[14px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-brand-bunker/60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setAddressFocused(true)}
              onBlur={() => setAddressFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  search();
                }
              }}
              autoFocus
              autoComplete="off"
              enterKeyHint="search"
              role="combobox"
              aria-expanded={showSuggestions}
              aria-controls="find-property-suggestions"
              aria-autocomplete="list"
              aria-label="Suburb, postcode, region or address"
              placeholder="Type an address..."
              className={`${field} pl-[40px] pr-[44px]`}
            />
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute right-[14px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-brand-bunker"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="17" x2="20" y2="17" />
              <circle cx="9" cy="7" r="2" fill="white" />
              <circle cx="15" cy="17" r="2" fill="white" />
            </svg>

            {showSuggestions && (
              <ul
                id="find-property-suggestions"
                role="listbox"
                className="absolute left-0 right-0 top-full mt-[6px] overflow-hidden rounded-[10px] border border-brand-silver bg-white shadow-[0_16px_36px_-14px_rgba(0,31,77,0.3)]"
              >
                {suggestions.map((s) => (
                  <li key={s} role="option" aria-selected={false}>
                    <button
                      type="button"
                      // mousedown, so the pick lands before the field's blur
                      // closes the list.
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setQ(s);
                        setAddressFocused(false);
                      }}
                      className="flex h-[42px] w-full items-center px-[16px] text-left font-display text-[13px] font-medium text-brand-bunker transition hover:bg-brand-soft active:bg-brand-soft"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Amenities */}
          <p className={`${heading} mt-[24px] w-fit border-b-2 border-brand-bunker pb-[4px]`}>Type</p>
          <div className="mt-[14px] flex flex-wrap gap-[8px]">
            {AMENITY_CHIPS.map((a) => {
              const active = amenities.includes(a.key);
              return (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => toggleAmenity(a.key)}
                  aria-pressed={active}
                  className={`h-[30px] rounded-[8px] px-[12px] font-display text-[12px] font-medium transition ${
                    active ? "bg-brand-navy text-white" : "bg-brand-soft text-brand-bunker"
                  }`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>

          {/* Residential / Commercial */}
          <p className={`${heading} mt-[24px] underline underline-offset-4`}>
            Property You are looking for?
          </p>
          <div className="mt-[12px] flex flex-wrap gap-[10px]">
            {(["Residential", "Commercial"] as const).map((s) => {
              const active = segment === s;
              return (
                <button key={s} type="button" onClick={() => setSegment(s)} aria-pressed={active} className={radioPill(active)}>
                  {dot(active)}
                  {s}
                </button>
              );
            })}
          </div>

          {/* Buy / Rent / PG */}
          <p className={`${subheading} mt-[24px]`}>Want to</p>
          <div className="mt-[12px] flex flex-wrap gap-[10px]">
            {WANT_TO.map((w) => {
              const active = wantTo === w;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => {
                    setWantTo(w);
                    // The budget steps change between sale and weekly rent.
                    setMin("");
                    setMax("");
                  }}
                  aria-pressed={active}
                  className={radioPill(active)}
                >
                  {dot(active)}
                  {w}
                </button>
              );
            })}
          </div>

          {/* Property type */}
          <p className={`${subheading} mt-[24px]`}>Property Type</p>
          <div className="mt-[12px] flex gap-[10px]">
            {(
              [
                { key: "flats", label: "Flats/Apartments" },
                { key: "houses", label: "Houses/Villas" },
              ] as const
            ).map((t) => {
              const active = propertyType === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setPropertyType(t.key)}
                  aria-pressed={active}
                  className={`flex h-[56px] min-w-[96px] flex-col items-center justify-center gap-[6px] rounded-[10px] border px-[12px] font-display text-[11px] font-medium transition ${
                    active
                      ? "border-brand-navy text-brand-navy"
                      : "border-brand-silver text-brand-bunker/55"
                  }`}
                >
                  {t.key === "flats" ? (
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="4" y="3" width="16" height="18" rx="1" />
                      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M3 11l9-7 9 7" />
                      <path d="M5 10v10h14V10" />
                      <path d="M10 20v-5h4v5" />
                    </svg>
                  )}
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Bedrooms */}
          <p className={`${subheading} mt-[24px]`}>Bedrooms</p>
          <div className="mt-[12px] flex flex-wrap gap-[8px]">
            {BEDROOMS.map((b) => {
              // Tracked by label, not value: "1 Rk" and "1 BHK" both mean one
              // bedroom to the listing pages, but only the tapped chip lights.
              const selected = bedLabel === b.label;
              return (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => setBedLabel((cur) => (cur === b.label ? "" : b.label))}
                  aria-pressed={selected}
                  className={`inline-flex h-[32px] items-center gap-[6px] rounded-[8px] border px-[12px] font-display text-[12px] font-medium transition ${
                    selected ? "border-brand-navy text-brand-navy" : "border-brand-silver text-brand-bunker/60"
                  }`}
                >
                  {b.label}
                  {b.label === "More" && (
                    <svg viewBox="0 0 24 24" className="h-[12px] w-[12px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 11l4 4 4-4" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* City */}
          <p className={`${subheading} mt-[24px]`}>City</p>
          {suburbs.length > 0 ? (
            // A native select: the phone shows its own picker, which is the
            // one control here guaranteed to fit every screen and keyboard.
            <label className="relative mt-[12px] block">
              <span className="sr-only">City</span>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`${field} appearance-none pr-[36px] ${city ? "" : "text-brand-bunker/45"}`}
              >
                <option value="">Enter your city</option>
                {suburbs.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {chevron}
            </label>
          ) : (
            // Before the suburb list has streamed in, a plain field.
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="City"
              placeholder="Enter your city"
              className={`${field} mt-[12px]`}
            />
          )}

          {/* Budget */}
          <p className={`${subheading} mt-[24px] inline-flex items-center gap-[6px]`}>
            Budget
            <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 8h.01" />
            </svg>
          </p>
          <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
            {(
              [
                { label: "$ Min", value: min, set: setMin },
                { label: "$ Max", value: max, set: setMax },
              ] as const
            ).map((s) => (
              <label key={s.label} className="relative block">
                <span className="sr-only">{s.label === "$ Min" ? "Minimum price" : "Maximum price"}</span>
                <select
                  value={s.value}
                  onChange={(e) => s.set(e.target.value)}
                  className={`${field} appearance-none pr-[36px] ${s.value ? "" : "text-brand-bunker/45"}`}
                >
                  <option value="">{s.label}</option>
                  {budget.map((n) => (
                    <option key={n} value={n}>
                      {money(n, rent)}
                    </option>
                  ))}
                </select>
                {chevron}
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-[32px] flex items-center justify-between gap-[12px]">
            <button
              type="button"
              onClick={reset}
              className="flex h-[36px] items-center justify-center rounded-[8px] border border-brand-navy px-[16px] font-display text-[12px] font-medium text-brand-navy transition hover:bg-brand-soft"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={search}
              className="inline-flex h-[36px] items-center justify-center gap-[8px] rounded-[8px] bg-brand-navy px-[24px] font-display text-[12px] font-medium text-white transition hover:bg-brand-navy-deep"
            >
              Search
              <svg viewBox="0 0 24 24" className="h-[12px] w-[12px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
