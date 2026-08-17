import { SORT_OPTIONS, type SortKey } from "@/lib/db/queries";
import { FILTERABLE_AMENITIES, amenityLabel } from "@/lib/reaxml/amenities";

type Props = {
  /** Route the form submits to, e.g. "/rent". */
  action?: string;
  /** Current values, so the form reflects the active filters after a search. */
  q?: string;
  min?: string;
  max?: string;
  sort?: SortKey;
  /** Suburbs with live stock, offered as autocomplete suggestions. */
  suburbs?: string[];
  /** Amenity keys currently ticked. */
  amenities?: string[];
  /** Rentals get a pet-friendly toggle; sales do not. */
  showPetFriendly?: boolean;
};

const FIELD =
  "h-[38px] rounded-[16px] sm:rounded-[20px] border border-[#001F4D] bg-white px-[16px] font-display text-[13px] text-brand-bunker placeholder:text-brand-bunker/40 focus:border-brand-navy focus:outline-none";

/**
 * A plain GET form rather than client-side state.
 *
 * Submitting navigates to `?q=…&min=…`, which means the server does the
 * filtering, results are shareable and crawlable URLs, and the whole thing
 * works with JavaScript disabled.
 */
export function PropertySearchBar({
  action = "/buy",
  q = "",
  min = "",
  max = "",
  sort = "recent",
  suburbs = [],
  amenities = [],
  showPetFriendly = false,
}: Props) {
  const ticked = new Set(amenities);
  const options: string[] = [
    ...FILTERABLE_AMENITIES,
    ...(showPetFriendly ? ["petFriendly"] : []),
  ];

  return (
    <form action={action} method="get" className="w-full">
      <div className="flex w-full flex-col gap-[12px] sm:flex-row sm:items-center">
      <input
        type="text"
        name="q"
        defaultValue={q}
        list="suburb-options"
        placeholder="Suburb, address or postcode"
        aria-label="Suburb, address or postcode"
        className={`${FIELD} flex-1 sm:min-w-[420px]`}
      />
      {suburbs.length > 0 && (
        <datalist id="suburb-options">
          {suburbs.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}

      <input
        type="number"
        name="min"
        defaultValue={min}
        min="0"
        step="1"
        placeholder="Min $"
        aria-label="Minimum price"
        className={`${FIELD} w-full sm:w-[170px]`}
      />
      <input
        type="number"
        name="max"
        defaultValue={max}
        min="0"
        step="1"
        placeholder="Max $"
        aria-label="Maximum price"
        className={`${FIELD} w-full sm:w-[170px]`}
      />

      <div className="relative w-full sm:w-[420px]">
        <select
          name="sort"
          defaultValue={sort}
          aria-label="Sort results"
          className={`${FIELD} w-full appearance-none pr-[36px]`}
        >
          {Object.entries(SORT_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute right-[14px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-brand-bunker"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <button
        type="submit"
        className="flex h-[38px] w-full sm:w-auto items-center justify-center gap-[8px] rounded-[16px] sm:rounded-[20px] bg-[#001F4D] px-[20px] font-display text-[13px] font-medium text-white transition hover:bg-[#001a40]"
      >
        <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
          Search
        </button>
      </div>

      {options.length > 0 && (
        <fieldset className="mt-[14px] flex flex-wrap items-center gap-x-[18px] gap-y-[8px]">
          <legend className="sr-only">Filter by features</legend>
          {options.map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-[7px] font-display text-[13px] text-brand-bunker"
            >
              <span className="relative inline-flex h-[15px] w-[15px] shrink-0 items-center justify-center">
                <input
                  type="checkbox"
                  name="feature"
                  value={key}
                  defaultChecked={ticked.has(key)}
                  className="peer h-[15px] w-[15px] appearance-none rounded-[4px] border border-[#001F4D] bg-white checked:bg-[#001F4D] focus:outline-none focus:ring-2 focus:ring-[#001F4D]/30"
                />
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute h-[10px] w-[10px] opacity-0 peer-checked:opacity-100"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {amenityLabel(key)}
            </label>
          ))}
        </fieldset>
      )}
    </form>
  );
}
