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

  if (!price.display) return price.view ?? "Contact agent";
  // The agency's own wording wins when they have written one.
  if (price.view) return price.view;
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
 * Resolves the display image.
 *
 * Only locally downloaded files are ever used. Falling back to the Agentbox
 * CDN URL would be hotlinking, which Reapit disables the feed for.
 */
function primaryImage(doc: ListingDoc): string {
  const main = doc.images.find((i) => i.id === "m" && i.localPath);
  const chosen = main?.localPath ?? doc.images.find((i) => i.localPath)?.localPath;
  return chosen ? mediaUrl(chosen) : PLACEHOLDER_IMAGE;
}

function toCard(doc: ListingDoc): ListingCard {
  return {
    id: doc._id,
    slug: doc.slug,
    href: `/property/${doc.slug}`,
    image: primaryImage(doc),
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
      amenities: amenities.length ? amenities : undefined,
      sort,
      page: Math.max(1, Number(sp.page) || 1),
    },
    /** Echoed into the search form and the pagination links. */
    form: {
      q: sp.q ?? "",
      min: sp.min ?? "",
      max: sp.max ?? "",
      sort,
    },
    /** Ticked amenity boxes, for re-checking the form after a search. */
    amenities,
    /** Whether the visitor has actually filtered anything. */
    isFiltered: Boolean(sp.q?.trim() || sp.min || sp.max || amenities.length),
  };
}

/**
 * Rebuilds the active search as a query string, so the same search can be
 * offered on the other side of the site. /buy and /rent accept identical
 * parameters, so the search survives the hop intact.
 */
export function searchQueryString(
  form: { q: string; min: string; max: string; sort: SortKey },
  amenities: string[] = [],
): string {
  const sp = new URLSearchParams();
  if (form.q) sp.set("q", form.q);
  if (form.min) sp.set("min", form.min);
  if (form.max) sp.set("max", form.max);
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
  if (categories?.length) filter.category = { $in: categories };
  if (suburb) filter["address.suburb"] = { $regex: `^${escapeRegex(suburb)}$`, $options: "i" };
  if (minBeds) filter["features.bedrooms"] = { $gte: minBeds };

  if (amenities?.length) {
    // `petFriendly` is an allowance rather than a feature flag, so it lives in
    // a different array and cannot go through the same $all.
    const features = amenities.filter((a) => a !== "petFriendly");
    const wantsPets = amenities.includes("petFriendly");

    if (features.length) filter["features.amenities"] = { $all: features };
    if (wantsPets) filter.allowances = "petFriendly";
  }

  if (q?.trim()) {
    // Matched against the address fields rather than the text index, so that
    // "Blacktown" does not also return every listing whose description merely
    // mentions Blacktown.
    const rx = { $regex: escapeRegex(q.trim()), $options: "i" };
    filter.$or = [
      { "address.suburb": rx },
      { "address.street": rx },
      { "address.postcode": rx },
      { "address.full": rx },
    ];
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

export const getLatestListings = cache(
  async (categories?: ListingCategory[], limit = 4): Promise<ListingCard[]> => {
    const col = await listings();
    const filter = publicFilter();
    if (categories?.length) filter.category = { $in: categories };

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
    headline: doc.headline ?? doc.address.full,
    description: doc.description ?? "",
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

  return rows.map((r) => ({
    key: r._id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    mobile: r.mobile,
    listingCount: r.listingCount,
  }));
});

/** All slugs, for `generateStaticParams` and the sitemap. */
export const getAllListingSlugs = cache(async (): Promise<string[]> => {
  const col = await listings();
  const docs = await col.find(publicFilter(), { projection: { slug: 1 } }).toArray();
  return docs.map((d) => d.slug);
});
