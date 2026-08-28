import { cache } from "react";
import type { Filter } from "mongodb";
import { listings } from "./collections";
import { FILTERABLE_AMENITIES } from "@/lib/reaxml/amenities";
import type { ListingCategory, ListingDoc } from "@/lib/reaxml/schema";

/**
 * Read layer for the public site.
 *
 * Everything here returns plain, serialisable view models rather than raw
 * Mongo documents — `_id`, `Date` and nested `ObjectId` values do not cross the
 * server/client boundary cleanly, and the pages should not know the storage
 * shape.
 *
 * Queries are wrapped in React's `cache` so a page that needs the same data in
 * two places issues one round trip per request.
 */

const AGENT_ID = process.env.REAPIT_AGENT_ID ?? "BRB04";
const PLACEHOLDER_IMAGE = "/images/latest-properties.png";

/**
 * Strips agent-entered noise from display text.
 *
 * Agentbox lets agents free-type fields like headline and price view.
 * Some write in ALL CAPS or pile on exclamation marks ("JUST LISTED!!!").
 * This function cleans the output without touching the stored data.
 *
 * Rules applied in order:
 *  1. Collapse runs of punctuation: "!!!" → "!"  "?!!" → "?"
 *  2. Strip trailing exclamation marks entirely (a listing headline is not a
 *     marketing shout on a premium site).
 *  3. Convert ALL-CAPS strings to title case (leaves mixed-case alone so
 *     intentional acronyms like "NSW" or "CBD" survive).
 */
function cleanText(text: string): string {
  // 1. Collapse repeated punctuation  e.g. "!!!" → "!"
  let s = text.replace(/([!?.]){2,}/g, "$1");
  // 2. Drop trailing exclamation marks
  s = s.replace(/!+\s*$/, "").trimEnd();
  // 3. Title-case only if the whole string is uppercase (ignoring spaces/punctuation)
  const letters = s.replace(/[^a-zA-Z]/g, "");
  if (letters.length > 0 && letters === letters.toUpperCase()) {
    s = s.replace(/\S+/g, (word) =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  }
  return s.trim();
}

/**
 * Absolute origin to serve listing photos from.
 *
 * Empty in production, where nginx serves `/media/` from the same origin. In
 * local development the files only exist on the VPS, so this points at the
 * live domain — our own server, not the Agentbox CDN, so it is not hotlinking.
 */
const MEDIA_ORIGIN = process.env.NEXT_PUBLIC_MEDIA_ORIGIN ?? "";

function mediaUrl(localPath: string): string {
  return MEDIA_ORIGIN ? `${MEDIA_ORIGIN}${localPath}` : localPath;
}

/** User input goes into a Mongo `$regex`, so metacharacters must be neutered. */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Categories that belong on the sales side of the site. */
export const SALE_CATEGORIES: ListingCategory[] = [
  "residential",
  "land",
  "rural",
  "commercial",
  "commercialLand",
  "business",
  "project",
];

/** Categories that belong on the rentals side. */
export const RENTAL_CATEGORIES: ListingCategory[] = ["rental", "holidayRental"];

export type ListingCard = {
  id: string;
  slug: string;
  href: string;
  image: string;
  /**
   * Photos for the card's inline carousel, `image` first. Named `gallery`
   * rather than `images` because ListingDetail extends this type and already
   * carries an `images` of a different shape.
   */
  gallery: string[];
  address: string;
  guide: string;
  beds?: number;
  baths?: number;
  cars?: number;
  type?: string;
};

export type ListingDetail = ListingCard & {
  headline: string;
  description: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  status: string;
  category: ListingCategory;
  isRental: boolean;
  bond?: number;
  dateAvailable?: string;
  landArea?: number;
  buildingArea?: number;
  amenities: string[];
  otherFeatures: string[];
  images: { src: string; alt: string }[];
  floorplans: { src: string; alt: string }[];
  videoUrl?: string;
  lat?: number;
  lng?: number;
  agents: { name: string; email?: string; phone?: string; mobile?: string }[];
};

/**
 * Formats the price line.
 *
 * `price.display === false` is a vendor instruction not to publish the number,
 * so the agency's own `priceView` text is used instead and the figure is never
 * rendered.
 */
function formatGuide(doc: ListingDoc): string {
  const { price } = doc;
  const isRental = RENTAL_CATEGORIES.includes(doc.category);

  if (!price.display) return price.view ? cleanText(price.view) : "Contact agent";
  // The agency's own wording wins when they have written one.
  if (price.view) return cleanText(price.view);
  if (price.value === undefined) return "Contact agent";

  const amount = price.value.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });

  // Rentals are advertised as a bare weekly figure. "Guide" is sales language
  // and reads wrong on a rental, so the complete string is built here rather
  // than prefixed blindly in the card component.
  if (isRental) {
    const period = price.period === "weekly" ? "pw" : price.period === "monthly" ? "pcm" : "";
    return period ? `${amount} ${period}` : amount;
  }

  return `Guide ${amount}`;
}

/**
 * How many photos a card's inline carousel offers.
 *
 * Capped rather than unbounded: a results grid renders up to a dozen cards at
 * once, and a listing can carry thirty photos. Six is enough to browse from
 * the card before clicking through, without shipping hundreds of URLs in the
 * payload for images most visitors will never advance to.
 */
const CARD_GALLERY_LIMIT = 6;

/**
 * Resolves the card's photos, best first.
 *
 * Only locally downloaded files are ever used. Falling back to the Agentbox
 * CDN URL would be hotlinking, which Reapit disables the feed for.
 */
function galleryImages(doc: ListingDoc): string[] {
  const local = doc.images.filter((i) => i.localPath);
  // Agentbox marks the hero shot "m". It leads; the rest follow in feed order.
  const main = local.find((i) => i.id === "m");
  const ordered = main ? [main, ...local.filter((i) => i !== main)] : local;
  return ordered
    .slice(0, CARD_GALLERY_LIMIT)
    .map((i) => mediaUrl(i.localPath as string));
}

function toCard(doc: ListingDoc): ListingCard {
  const gallery = galleryImages(doc);
  return {
    id: doc._id,
    slug: doc.slug,
    href: `/property/${doc.slug}`,
    image: gallery[0] ?? PLACEHOLDER_IMAGE,
    gallery,
    address: doc.address.full,
    guide: formatGuide(doc),
    beds: doc.features.bedrooms,
    baths: doc.features.bathrooms,
    cars: doc.features.totalParking || undefined,
    type: doc.propertyType,
  };
}

/** Base filter. Every public query is scoped to this agency and to listings
 *  Agentbox has not flagged as hidden or off-market. */
function publicFilter(extra: Filter<ListingDoc> = {}): Filter<ListingDoc> {
  return { agentID: AGENT_ID, isPublic: true, ...extra };
}

export const SORT_OPTIONS = {
  recent: "Most Recent First",
  "price-asc": "Price (Low to High)",
  "price-desc": "Price (High to Low)",
} as const;

export type SortKey = keyof typeof SORT_OPTIONS;

export function isSortKey(value: unknown): value is SortKey {
  return typeof value === "string" && value in SORT_OPTIONS;
}

export type ListingQuery = {
  categories?: ListingCategory[];
  /** Free text matched against suburb, street and postcode. */
  q?: string;
  suburb?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  /** Amenity keys that must all be present. */
  amenities?: string[];
  sort?: SortKey;
  page?: number;
  perPage?: number;
};

/** Raw query string values as Next hands them over. */
export type ListingSearchParams = {
  q?: string;
  min?: string;
  max?: string;
  /** Minimum bedrooms, e.g. "3" for 3+. */
  beds?: string;
  sort?: string;
  page?: string;
  /** Checkbox group — one value when a single box is ticked, an array otherwise. */
  feature?: string | string[];
};

/**
 * Normalises URL query values into a typed query plus the values to echo back
 * into the form. Shared by /buy and /rent so both behave identically.
 */
export function parseListingSearchParams(sp: ListingSearchParams) {
  const toNumber = (v?: string) => {
    const n = Number(v);
    return v !== undefined && v !== "" && Number.isFinite(n) && n >= 0 ? n : undefined;
  };

  const sort: SortKey = isSortKey(sp.sort) ? sp.sort : "recent";

  // Only accept amenity keys we actually offer, so a hand-crafted URL cannot
  // inject arbitrary field names into the query.
  const allowed = new Set<string>([...FILTERABLE_AMENITIES, "petFriendly"]);
  const amenities = (Array.isArray(sp.feature) ? sp.feature : sp.feature ? [sp.feature] : [])
    .filter((f) => allowed.has(f));

  return {
    query: {
      q: sp.q?.trim() || undefined,
      minPrice: toNumber(sp.min),
      maxPrice: toNumber(sp.max),
      minBeds: toNumber(sp.beds),
      amenities: amenities.length ? amenities : undefined,
      sort,
      page: Math.max(1, Number(sp.page) || 1),
    },
    /** Echoed into the search form and the pagination links. */
    form: {
      q: sp.q ?? "",
      min: sp.min ?? "",
      max: sp.max ?? "",
      beds: sp.beds ?? "",
      sort,
    },
    /** Ticked amenity boxes, for re-checking the form after a search. */
    amenities,
    /** Whether the visitor has actually filtered anything. */
    isFiltered: Boolean(sp.q?.trim() || sp.min || sp.max || sp.beds || amenities.length),
  };
}

/**
 * Rebuilds the active search as a query string, so the same search can be
 * offered on the other side of the site. /buy and /rent accept identical
 * parameters, so the search survives the hop intact.
 */
export function searchQueryString(
  form: { q: string; min: string; max: string; beds?: string; sort: SortKey },
  amenities: string[] = [],
): string {
  const sp = new URLSearchParams();
  if (form.q) sp.set("q", form.q);
  if (form.min) sp.set("min", form.min);
  if (form.max) sp.set("max", form.max);
  if (form.beds) sp.set("beds", form.beds);
  // "recent" is the default, so leaving it out keeps the link readable.
  if (form.sort !== "recent") sp.set("sort", form.sort);
  for (const a of amenities) sp.append("feature", a);

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

/** "Seven Hills" -> "seven-hills", for suburb landing page URLs. */
export function suburbSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Suburbs with live stock, as `{ name, slug, count }`. */
export const getSuburbsWithCounts = cache(
  async (categories?: ListingCategory[]): Promise<{ name: string; slug: string; count: number }[]> => {
    const col = await listings();
    const match = publicFilter();
    if (categories?.length) match.category = { $in: categories };

    const rows = await col
      .aggregate<{ _id: string; count: number }>([
        { $match: match },
        { $group: { _id: "$address.suburb", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    return rows
      .filter((r) => Boolean(r._id))
      .map((r) => ({ name: r._id, slug: suburbSlug(r._id), count: r.count }));
  },
);

export type ListingPage = {
  items: ListingCard[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export const getListings = cache(async (query: ListingQuery = {}): Promise<ListingPage> => {
  const {
    categories,
    q,
    suburb,
    minPrice,
    maxPrice,
    minBeds,
    amenities,
    sort = "recent",
    page = 1,
    perPage = 12,
  } = query;

  const filter = publicFilter();

  // Conditions that each need their own `$or`. A document can only carry one
  // `$or` key, and both the text search and the pet-friendly lookup want one,
  // so they are combined under `$and` instead of overwriting each other.
  const and: Filter<ListingDoc>[] = [];

  if (categories?.length) filter.category = { $in: categories };
  if (suburb) filter["address.suburb"] = { $regex: `^${escapeRegex(suburb)}$`, $options: "i" };
  if (minBeds) filter["features.bedrooms"] = { $gte: minBeds };

  if (amenities?.length) {
    // `petFriendly` is an allowance rather than a feature flag, so it cannot go
    // through the same $all as the rest.
    const features = amenities.filter((a) => a !== "petFriendly");

    if (features.length) filter["features.amenities"] = { $all: features };

    if (amenities.includes("petFriendly")) {
      // REAXML can carry pet permission two ways: as its own `<allowances>`
      // element, or as a flag inside `<features>` alongside the amenities. This
      // agency's feed uses the second, leaving `allowances` empty on every
      // document — so matching only `allowances` could never return anything.
      // Accepting either keeps the filter correct whichever way the feed sends.
      and.push({
        $or: [{ allowances: "petFriendly" }, { "features.amenities": "petFriendly" }],
      });
    }
  }

  if (q?.trim()) {
    // Matched against the address fields rather than the text index, so that
    // "Blacktown" does not also return every listing whose description merely
    // mentions Blacktown.
    const rx = { $regex: escapeRegex(q.trim()), $options: "i" };
    and.push({
      $or: [
        { "address.suburb": rx },
        { "address.street": rx },
        { "address.postcode": rx },
        { "address.full": rx },
      ],
    });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter["price.value"] = {
      ...(minPrice !== undefined ? { $gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
    };
    // A listing with a hidden price has no comparable number, so it cannot
    // honestly satisfy a price range.
    filter["price.display"] = true;
  }

  if (and.length) filter.$and = and;

  const col = await listings();
  const safePage = Math.max(1, page);

  // Listings with a hidden price sort last on a price sort rather than
  // masquerading as the cheapest.
  const order: Record<string, 1 | -1> =
    sort === "price-asc"
      ? { "price.value": 1, modTime: -1 }
      : sort === "price-desc"
        ? { "price.value": -1, modTime: -1 }
        : { modTime: -1 };

  const [docs, total] = await Promise.all([
    col
      .find(filter)
      .sort(order)
      .skip((safePage - 1) * perPage)
      .limit(perPage)
      .toArray(),
    col.countDocuments(filter),
  ]);

  return {
    items: docs.map(toCard),
    total,
    page: safePage,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
});

/** A constraint the fallback had to give up on to find anything to show. */
export type RelaxedConstraint = "amenities" | "beds" | "price" | "location";

/** Named for the result, not the component that renders it — see
 *  `app/_components/property/FallbackListings.tsx`. */
export type FallbackResult = {
  items: ListingCard[];
  /** Which of the visitor's constraints were given up, widest-kept first. */
  relaxed: RelaxedConstraint[];
  /** True when even dropping every filter found nothing — the category is bare. */
  exhausted: boolean;
};

/**
 * Reports only the constraints the visitor actually set.
 *
 * A rung that drops the price range is meaningless to someone who never
 * entered one, and saying "we ignored your price range" when they left it blank
 * reads as a bug. So the ladder's intent is filtered down to what was really
 * there before it reaches the copy.
 */
function constraintsActuallySet(
  query: ListingQuery,
  candidates: RelaxedConstraint[],
): RelaxedConstraint[] {
  const wasSet: Record<RelaxedConstraint, boolean> = {
    amenities: Boolean(query.amenities?.length),
    beds: Boolean(query.minBeds),
    price: query.minPrice !== undefined || query.maxPrice !== undefined,
    location: Boolean(query.q?.trim() || query.suburb),
  };
  return candidates.filter((c) => wasSet[c]);
}

/**
 * Finds the closest thing to a search that matched nothing.
 *
 * Constraints are given up one at a time, weakest intent first, and the first
 * rung that returns anything wins. The order is deliberate: feature filters are
 * wishes, a bedroom count is a need, a budget is a hard limit, and a named
 * suburb is usually the whole point — so location is surrendered last.
 *
 * Category is never relaxed. A visitor browsing sales is not helped by being
 * shown rentals, however well they match.
 *
 * Rungs that would not loosen anything the visitor set are skipped rather than
 * queried, so a bare "no such suburb" search costs one round trip, not four.
 */
export const getListingsWithFallback = cache(
  async (query: ListingQuery, limit = 4): Promise<FallbackResult> => {
    const base: ListingQuery = { ...query, page: 1, perPage: limit };

    const ladder: { relaxed: RelaxedConstraint[]; query: ListingQuery }[] = [
      {
        relaxed: ["amenities"],
        query: { ...base, amenities: undefined },
      },
      {
        relaxed: ["amenities", "beds"],
        query: { ...base, amenities: undefined, minBeds: undefined },
      },
      {
        relaxed: ["amenities", "beds", "price"],
        query: {
          ...base,
          amenities: undefined,
          minBeds: undefined,
          minPrice: undefined,
          maxPrice: undefined,
        },
      },
      {
        relaxed: ["amenities", "beds", "price", "location"],
        query: {
          ...base,
          amenities: undefined,
          minBeds: undefined,
          minPrice: undefined,
          maxPrice: undefined,
          q: undefined,
          suburb: undefined,
        },
      },
    ];

    const tried = new Set<string>();

    for (const rung of ladder) {
      const relaxed = constraintsActuallySet(query, rung.relaxed);

      // Nothing of the visitor's would actually be given up here, so this rung
      // is just the search that already failed.
      if (relaxed.length === 0) continue;

      const signature = relaxed.join("+");
      if (tried.has(signature)) continue;
      tried.add(signature);

      const { items } = await getListings(rung.query);
      if (items.length > 0) return { items, relaxed, exhausted: false };
    }

    return { items: [], relaxed: [], exhausted: true };
  },
);

export const getLatestListings = cache(
  async (categories?: ListingCategory[], limit = 4, excludeIds: string[] = []): Promise<ListingCard[]> => {
    const col = await listings();
    const filter = publicFilter();
    if (categories?.length) filter.category = { $in: categories };
    if (excludeIds.length) (filter as Record<string, unknown>)["_id"] = { $nin: excludeIds };

    const docs = await col.find(filter).sort({ modTime: -1 }).limit(limit).toArray();
    return docs.map(toCard);
  },
);

export const getListingBySlug = cache(async (slug: string): Promise<ListingDetail | null> => {
  const col = await listings();

  // Accept the uniqueID too, so older links and anything Agentbox-side that
  // references the raw id still resolve rather than 404.
  const doc = await col.findOne(publicFilter({ $or: [{ slug }, { _id: slug }] }));
  if (!doc) return null;

  const alt = doc.address.full;

  return {
    ...toCard(doc),
    headline: cleanText(doc.headline ?? doc.address.full),
    description: cleanText(doc.description ?? ""),
    suburb: doc.address.suburb,
    state: doc.address.state,
    postcode: doc.address.postcode,
    status: doc.status,
    category: doc.category,
    isRental: RENTAL_CATEGORIES.includes(doc.category),
    bond: doc.bond,
    dateAvailable: doc.dateAvailable?.toISOString(),
    landArea: doc.landArea?.value,
    buildingArea: doc.buildingArea?.value,
    amenities: doc.features.amenities,
    otherFeatures: doc.features.other,
    images: doc.images
      .filter((i) => i.localPath)
      .map((i) => ({ src: mediaUrl(i.localPath as string), alt })),
    floorplans: doc.floorplans
      .filter((i) => i.localPath)
      .map((i) => ({ src: mediaUrl(i.localPath as string), alt: `${alt} floor plan` })),
    videoUrl: doc.videoUrl,
    lat: doc.location?.coordinates[1],
    lng: doc.location?.coordinates[0],
    agents: doc.agents.map((a) => ({
      name: a.name,
      email: a.email,
      phone: a.phone,
      mobile: a.mobile,
    })),
  };
});

/** Same suburb first, then anything else in the same category. */
export const getSimilarListings = cache(
  async (slug: string, suburb: string | undefined, category: ListingCategory, limit = 3) => {
    const col = await listings();
    const docs = await col
      .find(publicFilter({ category, slug: { $ne: slug } }))
      .sort({ modTime: -1 })
      .limit(limit * 3)
      .toArray();

    const ranked = docs.sort((a, b) => {
      const aMatch = a.address.suburb === suburb ? 0 : 1;
      const bMatch = b.address.suburb === suburb ? 0 : 1;
      return aMatch - bMatch;
    });

    return ranked.slice(0, limit).map(toCard);
  },
);

/** Distinct suburbs with live stock, for filter dropdowns. */
export const getSuburbs = cache(async (categories?: ListingCategory[]): Promise<string[]> => {
  const col = await listings();
  const filter = publicFilter();
  if (categories?.length) filter.category = { $in: categories };

  const values = await col.distinct("address.suburb", filter);
  return values.filter((v): v is string => Boolean(v)).sort();
});

export type FeedAgent = {
  /** Lowercased email where present, else the name. Stable across deliveries. */
  key: string;
  /** URL segment for /agents/[slug]. Unique across the returned list. */
  slug: string;
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  /** How many published listings this agent appears on. */
  listingCount: number;
};

/**
 * Distinct agents across all published listings.
 *
 * The feed carries contact details but no photo, role or biography, so this is
 * only half of what a team page needs — see `lib/agents/profiles.ts` for the
 * locally-maintained half.
 */
export const getAgents = cache(async (): Promise<FeedAgent[]> => {
  const col = await listings();

  const rows = await col
    .aggregate<{
      _id: string;
      name: string;
      email?: string;
      phone?: string;
      mobile?: string;
      listingCount: number;
    }>([
      { $match: publicFilter() },
      { $unwind: "$agents" },
      {
        $group: {
          // Group on email so the same person listed under slightly different
          // name spellings collapses into one card.
          _id: {
            $toLower: { $ifNull: ["$agents.email", "$agents.name"] },
          },
          name: { $first: "$agents.name" },
          email: { $first: "$agents.email" },
          phone: { $first: "$agents.phone" },
          mobile: { $first: "$agents.mobile" },
          listingCount: { $sum: 1 },
        },
      },
      { $sort: { listingCount: -1, name: 1 } },
    ])
    .toArray();

  // Slugs are counted before they are assigned so a shared name disambiguates
  // both entries rather than whichever happened to sort second. Order here
  // depends on listingCount, which moves — a slug that flipped between two
  // people as listings changed would break their links.
  const nameCounts = new Map<string, number>();
  for (const r of rows) {
    const base = agentSlug(r.name);
    nameCounts.set(base, (nameCounts.get(base) ?? 0) + 1);
  }

  return rows.map((r) => {
    const base = agentSlug(r.name);
    return {
      key: r._id,
      slug:
        (nameCounts.get(base) ?? 0) > 1
          ? `${base}-${agentSlug(r._id.split("@")[0])}`
          : base,
      name: r.name,
      email: r.email,
      phone: r.phone,
      mobile: r.mobile,
      listingCount: r.listingCount,
    };
  });
});

/** Lowercase, hyphenated, ASCII-only. Falls back to "agent" for a name that
 *  reduces to nothing (e.g. one written entirely in a non-Latin script). */
function agentSlug(value: string): string {
  return (
    value
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "agent"
  );
}

/**
 * Published listings this agent appears on, newest first.
 *
 * Matched on the same key `getAgents` groups by — the lowercased email, or the
 * name when the feed carries no email for them. Case-insensitive because the
 * feed is inconsistent about capitalising addresses.
 */
export const getListingsByAgent = cache(async (key: string): Promise<ListingCard[]> => {
  const col = await listings();
  const exact = { $regex: `^${escapeRegex(key)}$`, $options: "i" };

  const docs = await col
    .find(
      publicFilter({
        $or: [{ "agents.email": exact }, { "agents.name": exact }],
      }),
    )
    .sort({ modTime: -1 })
    .toArray();

  return docs.map(toCard);
});

/** All slugs, for `generateStaticParams` and the sitemap. */
export const getAllListingSlugs = cache(async (): Promise<string[]> => {
  const col = await listings();
  const docs = await col.find(publicFilter(), { projection: { slug: 1 } }).toArray();
  return docs.map((d) => d.slug);
});
