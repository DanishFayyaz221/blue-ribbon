import { PropertyCard } from "./PropertyCard";
import type { ListingCard, RelaxedConstraint } from "@/lib/db/queries";

type Props = {
  /** The closest stock we could find, already relaxed by the query layer. */
  items: ListingCard[];
  /** Which of the visitor's constraints had to be given up to find them. */
  relaxed: RelaxedConstraint[];
  /** What the visitor typed, quoted back so the message is recognisably theirs. */
  q?: string;
  /** Plural noun matching the page's own language — "properties", "rentals". */
  noun: string;
  /** Where the "start over" link goes, i.e. the unfiltered listing page. */
  clearHref: string;
};

const LABELS: Record<RelaxedConstraint, string> = {
  amenities: "feature filters",
  beds: "bedroom minimum",
  price: "price range",
  location: "location",
};

/** "a", "a and b", "a, b and c" — the list appears mid-sentence. */
function joinWords(words: string[]): string {
  if (words.length <= 1) return words[0] ?? "";
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

/**
 * Explains the gap between what was asked for and what is being shown.
 *
 * Saying this out loud is the point. Silently substituting different results
 * for the ones someone filtered to reads as a broken filter, not a helpful
 * suggestion — the visitor set a budget and is now looking at something outside
 * it, and only the sentence tells them which of their criteria gave way.
 */
function describe(relaxed: RelaxedConstraint[], q: string | undefined, noun: string) {
  const quoted = q?.trim() ? `“${q.trim()}”` : undefined;

  // Location was surrendered, so nothing we hold sits where they asked. Naming
  // the other dropped filters here would be noise: the area is the reason.
  if (relaxed.includes("location")) {
    return {
      title: quoted ? `No ${noun} match ${quoted}` : `No ${noun} match your search`,
      message: `We have nothing listed there at the moment. Here are our newest ${noun} instead.`,
    };
  }

  const given = joinWords(relaxed.map((r) => LABELS[r]));

  return {
    title: quoted ? `No exact matches for ${quoted}` : `No exact matches for your search`,
    message: given
      ? `These are the closest we have — they match everything except your ${given}.`
      : `Here are the closest ${noun} we have.`,
  };
}

/**
 * The zero-result state for a listing page.
 *
 * Rather than ending at "nothing found", this keeps the visitor moving by
 * showing the nearest stock we do hold. Results never cross between sale and
 * rental: someone browsing to buy is not served by being handed rentals,
 * however well they match on price.
 */
export function FallbackListings({ items, relaxed, q, noun, clearHref }: Props) {
  const { title, message } = describe(relaxed, q, noun);

  return (
    <div>
      <div className="flex items-start gap-[16px] rounded-[20px] border border-brand-navy/15 bg-gradient-to-br from-brand-soft/50 to-white px-[22px] py-[22px] shadow-[0_2px_8px_rgba(0,31,77,0.04)] sm:px-[30px] sm:py-[28px]">
        <div
          aria-hidden
          className="mt-[2px] flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[clamp(15px,1.3vw,20px)] font-semibold text-brand-bunker">
            {title}
          </h3>
          <p className="mt-[6px] max-w-[560px] font-display text-[clamp(13px,0.95vw,15px)] leading-[1.6] text-brand-bunker/70">
            {message}
          </p>
        </div>
      </div>


      {items.length > 0 && (
        <div className="mt-[clamp(26px,2.4vw,42px)]">
          <h2 className="font-display font-bold text-brand-bunker text-[18px] sm:text-[clamp(1.15rem,1.5vw,1.75rem)] leading-[1.15]">
            You might also like
          </h2>
          <div className="mt-[clamp(18px,2vw,32px)] grid grid-cols-2 gap-x-[12px] gap-y-[20px] lg:grid-cols-4 lg:gap-[clamp(12px,1.3vw,24px)]">
            {items.map((p) => (
              <PropertyCard key={p.id} {...p} variant="tall" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
