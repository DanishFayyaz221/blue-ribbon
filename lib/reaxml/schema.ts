import { z } from "zod";
import { parseReaxmlDate } from "./date";

/**
 * Zod schemas for a parsed REAXML listing.
 *
 * These describe the *normalised* shape stored in Mongo, not the raw XML.
 * Reconciled against a real Agentbox delivery for agency BRB04
 * (`BRB04_2026-07-29-15-00-09.xml`), so the field names here reflect what the
 * feed actually sends rather than what the published spec implies.
 */

/** REAXML root element names, one per listing category. */
export const LISTING_CATEGORIES = [
  "residential",
  "rental",
  "land",
  "rural",
  "commercial",
  "commercialLand",
  "business",
  "holidayRental",
  "project",
] as const;

export const listingCategorySchema = z.enum(LISTING_CATEGORIES);
export type ListingCategory = z.infer<typeof listingCategorySchema>;

/**
 * The `status` attribute on the root element.
 *
 * This is how the feed communicates removal. Listings are never deleted by
 * omitting a file, so treating anything other than `current` as "hide" is what
 * stops sold and leased stock living on the site forever.
 */
export const LISTING_STATUSES = [
  "current",
  "withdrawn",
  "offmarket",
  "sold",
  "leased",
  "deleted",
] as const;

export const listingStatusSchema = z.enum(LISTING_STATUSES);
export type ListingStatus = z.infer<typeof listingStatusSchema>;

/** Statuses eligible for the public site, subject to the flags below. */
export const PUBLIC_STATUSES: readonly ListingStatus[] = ["current", "sold", "leased"];

// ---------------------------------------------------------------------------
// Coercion helpers
//
// Everything arrives as a string, and empty elements (`<area/>`) surface as ""
// rather than undefined. Features use 0/1 integers for booleans, while
// attributes like display="yes" use words — so the boolean coercer accepts both.
// ---------------------------------------------------------------------------

const xmlString = z
  .unknown()
  .transform((v) => {
    if (v === null || v === undefined) return undefined;
    const s = String(v).trim();
    return s.length > 0 ? s : undefined;
  })
  .optional();

const xmlNumber = z
  .unknown()
  .transform((v) => {
    if (v === null || v === undefined || v === "") return undefined;
    const n = Number(String(v).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  })
  .optional();

const xmlBool = z.unknown().transform((v) => {
  if (v === null || v === undefined || v === "") return false;
  const s = String(v).trim().toLowerCase();
  return s === "1" || s === "yes" || s === "true";
});

const xmlDate = z
  .unknown()
  .transform((v) => (v instanceof Date ? v : parseReaxmlDate(v as string)))
  .nullable();

// ---------------------------------------------------------------------------
// Sub-documents
// ---------------------------------------------------------------------------

export const addressSchema = z.object({
  /** `display="no"` hides the street address; only the suburb may be shown. */
  display: xmlBool,
  /** Suburbs carry an independent display flag. */
  suburbDisplay: xmlBool,
  subNumber: xmlString,
  lotNumber: xmlString,
  streetNumber: xmlString,
  street: xmlString,
  suburb: xmlString,
  state: xmlString,
  postcode: xmlString,
  country: xmlString,
  /** Prebuilt from streetNumber + street, honouring `display`. */
  full: z.string(),
});

export type Address = z.infer<typeof addressSchema>;

/**
 * GeoJSON point for the `2dsphere` index.
 *
 * Agentbox supplies coordinates via `<extraFields name="geoLat"/"geoLong">`,
 * so no geocoding step is needed.
 */
export const geoPointSchema = z.object({
  type: z.literal("Point"),
  /** GeoJSON is [longitude, latitude]. Reversing these silently relocates
   *  every Sydney listing into the Pacific. */
  coordinates: z.tuple([z.number(), z.number()]),
});

export const mediaSchema = z.object({
  /** REAXML ids: "m" is the main image, then "a", "b", "c"... */
  id: z.string(),
  /** Agentbox's own media id. Stable across URL changes. */
  recordId: xmlString,
  title: xmlString,
  format: xmlString,
  /** Where the feed says the file lives — on agentboxcdn.com.au. Never
   *  rendered directly: hotlinking gets the feed disabled until resolved. */
  sourceUrl: z.string().url(),
  /** Drives re-download. If this moves, the image changed. */
  modTime: xmlDate,
  /** Public path once fetched, e.g. "/media/1P0271/m.jpg". Null until the
   *  media worker has run. Rendering falls back to nothing rather than to
   *  `sourceUrl` — hotlinking is what gets the feed disabled. */
  localPath: z.string().nullable().default(null),
  sha256: z.string().nullable().default(null),
  /** Download attempts, so a permanently broken URL stops being retried. */
  attempts: z.number().default(0),
  lastError: z.string().nullable().default(null),
});

export type Media = z.infer<typeof mediaSchema>;

export const listingAgentSchema = z.object({
  id: xmlString,
  name: z.string(),
  email: xmlString,
  mobile: xmlString,
  phone: xmlString,
});

export const inspectionSchema = z.object({
  start: xmlDate,
  end: xmlDate,
});

/**
 * Numeric counts drive search filters and are modelled explicitly. The dozens
 * of 0/1 amenity flags are collapsed into `amenities` — a list of the ones
 * actually present, which indexes and renders far better than 40 boolean
 * columns that are almost always false.
 */
export const featuresSchema = z.object({
  bedrooms: xmlNumber,
  bathrooms: xmlNumber,
  ensuite: xmlNumber,
  toilets: xmlNumber,
  livingAreas: xmlNumber,
  garages: xmlNumber,
  carports: xmlNumber,
  openSpaces: xmlNumber,
  /** garages + carports + openSpaces, precomputed so "2+ parking" is a single
   *  indexed range query instead of an aggregation. */
  totalParking: z.number().default(0),
  /** Names of the 0/1 flags that were set, e.g. ["airConditioning", "shed"]. */
  amenities: z.array(z.string()).default([]),
  /** Free text from `<otherFeatures>`, split on commas. */
  other: z.array(z.string()).default([]),
});

export const areaSchema = z.object({
  value: xmlNumber,
  unit: xmlString,
});

export const priceSchema = z.object({
  /** `display="no"` means the agency does not want the number published.
   *  Render `view` instead — publishing it anyway breaches both the feed terms
   *  and the vendor's instructions. */
  display: xmlBool,
  value: xmlNumber,
  /** Agency-authored text, e.g. "$400 pw" or "Offers over $1.2m". */
  view: xmlString,
  /** Rentals: "weekly", "monthly". Absent for sales. */
  period: xmlString,
});

export const soldDetailsSchema = z.object({
  display: xmlBool,
  price: xmlNumber,
  date: xmlDate,
});

// ---------------------------------------------------------------------------
// Listing
// ---------------------------------------------------------------------------

export const listingSchema = z.object({
  category: listingCategorySchema,
  status: listingStatusSchema,

  /** Agency identifier. This feed is multi-tenant by design, so every read
   *  path must filter on it. Blue Ribbon is BRB04. */
  agentID: z.string(),
  /** Stable per-listing id from Agentbox, e.g. "1P0271". Our upsert key. */
  uniqueID: z.string(),

  /** Root `modTime`. Guards against an out-of-order file overwriting newer
   *  data — a real hazard when files arrive in ten-minute batches. */
  modTime: z.date(),

  headline: xmlString,
  description: xmlString,

  address: addressSchema,
  location: geoPointSchema.nullable().default(null),
  /** From `<extraFields name="regionName">`, e.g. "Western Sydney". */
  region: xmlString,

  /** Sale price or rent, normalised into one shape. */
  price: priceSchema,
  soldDetails: soldDetailsSchema.nullable().default(null),
  /** Rentals only. */
  bond: xmlNumber,
  dateAvailable: xmlDate,
  /** Rentals only: furnished / petFriendly / smokers. */
  allowances: z.array(z.string()).default([]),

  /** From `<category name="House"/>`. */
  propertyType: xmlString,
  features: featuresSchema,
  landArea: areaSchema.nullable().default(null),
  buildingArea: areaSchema.nullable().default(null),

  images: z.array(mediaSchema).default([]),
  floorplans: z.array(mediaSchema).default([]),
  videoUrl: xmlString,
  externalUrl: xmlString,

  agents: z.array(listingAgentSchema).default([]),
  inspections: z.array(inspectionSchema).default([]),

  /** `<exclusivity value="exclusive"/>`. */
  exclusivity: xmlString,

  /**
   * Resolved visibility. `status` alone is not enough: Agentbox also sends
   * `hiddenListing` and `OffMarketListing` in extraFields, and a listing with
   * either set must not be published even while status is "current".
   */
  isPublic: z.boolean(),

  /** URL slug, derived at ingest and stored so links stay stable even if the
   *  address is later corrected in Agentbox. */
  slug: z.string(),

  /**
   * Everything not modelled above, exactly as parsed.
   *
   * Note: `<propertyList>` carries `username` and `password` attributes in
   * plaintext in every delivered file. The parser strips them before they
   * reach here — never widen this to include the propertyList element.
   */
  raw: z.record(z.string(), z.unknown()).default({}),

  sourceFile: z.string(),
  ingestedAt: z.date(),
});

export type Listing = z.infer<typeof listingSchema>;
export type ListingDoc = Listing & { _id: string };
