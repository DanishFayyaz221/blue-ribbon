"use client";

import { useState, type ReactNode } from "react";
import { SearchForm, SearchLink } from "./SearchTransition";
import type { SortKey } from "@/lib/db/queries";

type View = "list" | "grid";

type Props = {
  /** The listing cards, already rendered, in result order. */
  cards: ReactNode[];
  /** Cards shown before the first "Load More". */
  initial?: number;
  /** Cards revealed by each "Load More". */
  step?: number;
  /**
   * Next page of results, when the server has more than it sent. Once every
   * card here is showing, "Load More" navigates there.
   */
  nextHref?: string;
  /** Route the sort applies to. */
  basePath: "/buy" | "/rent";
  sort: SortKey;
  /** Active filters, carried across a sort change so it does not reset them. */
  params: { q?: string; min?: string; max?: string; beds?: string; features?: string[] };
};

// Listed here rather than read from the query module: this is a client
// component, and importing a value from there would drag the database
// driver into the browser bundle. A type import costs nothing.
const SORT_LABELS: Record<SortKey, string> = {
  recent: "Most Recent",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};
const SORT_KEYS = Object.keys(SORT_LABELS) as SortKey[];

/**
 * Phone results for the listing pages, per the mobile comp: a row with the
 * view and sort pickers, the cards one per row, and a "Load More" pill.
 *
 * The cards arrive rendered from the server and are revealed a few at a time
 * here, so "Load More" is instant and the page never re-requests what it
 * already has. When everything it holds is showing and the server has more,
 * the same button becomes a link to the next page.
 *
 * The sort is a plain GET form that submits itself on change, so the server
 * keeps doing the sorting and the URL stays shareable — the same contract the
 * filter chips above follow.
 */
export function MobileResults({
  cards,
  initial = 4,
  step = 4,
  nextHref,
  basePath,
  sort,
  params,
}: Props) {
  const [shown, setShown] = useState(initial);
  const [view, setView] = useState<View>("list");
  const allShown = shown >= cards.length;

  const selectClass =
    "appearance-none bg-transparent pr-[18px] font-display text-[13px] font-medium text-brand-bunker focus:outline-none";
  const chevron = (
    <svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute right-0 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-brand-bunker"
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

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="relative flex items-center">
          <span className="sr-only">View</span>
          <select
            value={view}
            onChange={(e) => setView(e.target.value as View)}
            className={selectClass}
          >
            <option value="list">List View</option>
            <option value="grid">Grid View</option>
          </select>
          {chevron}
        </label>

        <SearchForm action={basePath} className="relative flex items-center">
          {params.q && <input type="hidden" name="q" value={params.q} />}
          {params.min && <input type="hidden" name="min" value={params.min} />}
          {params.max && <input type="hidden" name="max" value={params.max} />}
          {params.beds && <input type="hidden" name="beds" value={params.beds} />}
          {params.features?.map((f) => (
            <input key={f} type="hidden" name="feature" value={f} />
          ))}
          <span className="sr-only">Sort by</span>
          <select
            name="sort"
            defaultValue={sort}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className={selectClass}
          >
            {SORT_KEYS.map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
          {chevron}
        </SearchForm>
      </div>

      <div
        className={`mt-[20px] grid gap-y-[24px] ${
          view === "grid" ? "grid-cols-2 gap-x-[12px]" : "grid-cols-1"
        }`}
      >
        {cards.slice(0, shown).map((card, i) => (
          <div key={i}>{card}</div>
        ))}
      </div>

      {(!allShown || nextHref) && (
        <div className="mt-[28px] flex justify-center">
          {allShown && nextHref ? (
            <SearchLink href={nextHref} className={loadMoreClass}>
              Load More
            </SearchLink>
          ) : (
            <button
              type="button"
              onClick={() => setShown((cur) => cur + step)}
              className={loadMoreClass}
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const loadMoreClass =
  "inline-flex h-[40px] items-center justify-center rounded-full border border-brand-navy px-[26px] font-display text-[13px] font-medium text-brand-navy transition hover:bg-brand-navy hover:text-white";
