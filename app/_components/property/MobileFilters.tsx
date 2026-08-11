"use client";

import Link from "next/link";
import { useState } from "react";
import type { SortKey } from "@/lib/db/queries";
import { FILTERABLE_AMENITIES, amenityLabel } from "@/lib/reaxml/amenities";

type Props = {
  /** Route the filters apply to, "/buy" or "/rent". */
  basePath: "/buy" | "/rent";
  q: string;
  min: string;
  max: string;
  beds: string;
  sort: SortKey;
  /** Amenity keys currently active. */
  features: string[];
  showPetFriendly?: boolean;
};

type Panel = "deal" | "price" | "beds" | "more";

const BED_OPTIONS = ["1", "2", "3", "4", "5"] as const;

/**
 * Mobile filter chips for the listing pages. Like the desktop
 * PropertySearchBar, every filter applies through a real GET navigation, so
 * the server keeps doing the filtering and URLs stay shareable. The chips only
 * hold one piece of client state: which panel is open.
 */
export function MobileFilters({
  basePath,
  q,
  min,
  max,
  beds,
  sort,
  features,
  showPetFriendly = false,
}: Props) {
  const [open, setOpen] = useState<Panel | null>(null);
  const toggle = (p: Panel) => setOpen((cur) => (cur === p ? null : p));

  const amenityOptions: string[] = [
    ...FILTERABLE_AMENITIES,
    ...(showPetFriendly ? ["petFriendly"] : []),
  ];

  /** Current search rebuilt with overrides; page resets on any change. */
  const href = (path: string, overrides: Partial<Record<"q" | "min" | "max" | "beds", string>> = {}) => {
    const sp = new URLSearchParams();
    const merged = { q, min, max, beds, ...overrides };
    if (merged.q) sp.set("q", merged.q);
    if (merged.min) sp.set("min", merged.min);
    if (merged.max) sp.set("max", merged.max);
    if (merged.beds) sp.set("beds", merged.beds);
    if (sort !== "recent") sp.set("sort", sort);
    for (const f of features) sp.append("feature", f);
    const qs = sp.toString();
    return qs ? `${path}?${qs}` : path;
  };

  /** Hidden fields so a panel's form submit keeps every other active filter. */
  const hidden = (skip: ("q" | "min" | "max" | "beds" | "feature")[]) => (
    <>
      {!skip.includes("q") && q && <input type="hidden" name="q" value={q} />}
      {!skip.includes("min") && min && <input type="hidden" name="min" value={min} />}
      {!skip.includes("max") && max && <input type="hidden" name="max" value={max} />}
      {!skip.includes("beds") && beds && <input type="hidden" name="beds" value={beds} />}
      {sort !== "recent" && <input type="hidden" name="sort" value={sort} />}
      {!skip.includes("feature") &&
        features.map((f) => <input key={f} type="hidden" name="feature" value={f} />)}
    </>
  );

  const chipClass = (active: boolean, expanded: boolean) =>
    `flex h-[36px] shrink-0 items-center gap-[6px] rounded-[8px] border px-[14px] font-display text-[13px] font-medium transition ${
      active || expanded
        ? "border-brand-navy bg-brand-navy text-white"
        : "border-brand-silver bg-white text-brand-bunker"
    }`;

  const chevron = (
    <svg
      viewBox="0 0 24 24"
      className="h-[14px] w-[14px]"
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

  const inputClass =
    "h-[38px] w-full rounded-[8px] border border-brand-silver bg-white px-[12px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none";
  const applyClass =
    "flex h-[38px] items-center justify-center rounded-[8px] bg-brand-navy px-[20px] font-display text-[13px] font-medium text-white transition hover:bg-brand-navy-deep";
  const optionPill = (active: boolean) =>
    `flex h-[34px] items-center justify-center rounded-[8px] border px-[14px] font-display text-[13px] font-medium ${
      active
        ? "border-brand-navy bg-brand-navy text-white"
        : "border-brand-silver bg-white text-brand-bunker"
    }`;

  return (
    <div>
      <div className="no-scrollbar flex gap-[10px] overflow-x-auto">
        <button type="button" onClick={() => toggle("deal")} aria-expanded={open === "deal"} className={chipClass(false, open === "deal")}>
          {basePath === "/buy" ? "Buy" : "Rent"}
          {chevron}
        </button>
        <button type="button" onClick={() => toggle("price")} aria-expanded={open === "price"} className={chipClass(Boolean(min || max), open === "price")}>
          Price
          {chevron}
        </button>
        <button type="button" onClick={() => toggle("beds")} aria-expanded={open === "beds"} className={chipClass(Boolean(beds), open === "beds")}>
          {beds ? `Beds ${beds}+` : "Beds"}
          {chevron}
        </button>
        <button type="button" onClick={() => toggle("more")} aria-expanded={open === "more"} className={chipClass(features.length > 0, open === "more")}>
          {features.length > 0 ? `More · ${features.length}` : "More"}
          {chevron}
        </button>
      </div>

      {open === "deal" && (
        <div className="mt-[10px] flex gap-[10px] rounded-[12px] border border-brand-silver bg-white p-[14px]">
          <Link href={href("/buy")} className={optionPill(basePath === "/buy")}>
            Buy
          </Link>
          <Link href={href("/rent")} className={optionPill(basePath === "/rent")}>
            Rent
          </Link>
        </div>
      )}

      {open === "price" && (
        <form
          action={basePath}
          method="get"
          className="mt-[10px] rounded-[12px] border border-brand-silver bg-white p-[14px]"
        >
          {hidden(["min", "max"])}
          <div className="flex items-center gap-[10px]">
            <input
              type="number"
              name="min"
              defaultValue={min}
              min="0"
              step="1"
              placeholder="Min $"
              aria-label="Minimum price"
              className={inputClass}
            />
            <span className="font-display text-[13px] text-brand-bunker/60">to</span>
            <input
              type="number"
              name="max"
              defaultValue={max}
              min="0"
              step="1"
              placeholder="Max $"
              aria-label="Maximum price"
              className={inputClass}
            />
          </div>
          <div className="mt-[12px] flex items-center justify-between">
            <Link href={href(basePath, { min: "", max: "" })} className="font-display text-[13px] font-medium text-brand-bunker/60">
              Clear
            </Link>
            <button type="submit" className={applyClass}>
              Apply
            </button>
          </div>
        </form>
      )}

      {open === "beds" && (
        <div className="no-scrollbar mt-[10px] flex gap-[8px] overflow-x-auto rounded-[12px] border border-brand-silver bg-white p-[14px]">
          <Link href={href(basePath, { beds: "" })} className={`${optionPill(!beds)} shrink-0`}>
            Any
          </Link>
          {BED_OPTIONS.map((b) => (
            <Link key={b} href={href(basePath, { beds: b })} className={`${optionPill(beds === b)} shrink-0`}>
              {b}+
            </Link>
          ))}
        </div>
      )}

      {open === "more" && (
        <form
          action={basePath}
          method="get"
          className="mt-[10px] rounded-[12px] border border-brand-silver bg-white p-[14px]"
        >
          {hidden(["feature"])}
          <div className="grid grid-cols-2 gap-x-[12px] gap-y-[10px]">
            {amenityOptions.map((key) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-[8px] font-display text-[13px] text-brand-bunker"
              >
                <input
                  type="checkbox"
                  name="feature"
                  value={key}
                  defaultChecked={features.includes(key)}
                  className="h-[15px] w-[15px] accent-[#001F4D]"
                />
                {amenityLabel(key)}
              </label>
            ))}
          </div>
          <div className="mt-[14px] flex items-center justify-between">
            <Link href={clearFeaturesHref(basePath, { q, min, max, beds, sort })} className="font-display text-[13px] font-medium text-brand-bunker/60">
              Clear
            </Link>
            <button type="submit" className={applyClass}>
              Apply
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/** The current search minus every amenity, for the "Clear" link in More. */
function clearFeaturesHref(
  basePath: string,
  f: { q: string; min: string; max: string; beds: string; sort: SortKey },
): string {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.min) sp.set("min", f.min);
  if (f.max) sp.set("max", f.max);
  if (f.beds) sp.set("beds", f.beds);
  if (f.sort !== "recent") sp.set("sort", f.sort);
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
