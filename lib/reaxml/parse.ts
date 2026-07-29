import { XMLParser } from "fast-xml-parser";
import {
  LISTING_CATEGORIES,
  LISTING_STATUSES,
  PUBLIC_STATUSES,
  type Listing,
  type ListingCategory,
  type ListingStatus,
  type Media,
  listingSchema,
} from "./schema";
import { parseReaxmlDate } from "./date";

/** Elements that may legitimately appear once but must still be arrays. */
const ALWAYS_ARRAY = new Set<string>([
  ...LISTING_CATEGORIES,
  "listingAgent",
  "telephone",
  "img",
  "floorplan",
  "extraFields",
  "externalLink",
  "inspection",
]);

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  // Keep everything as strings. Auto-parsing turns postcode "0800" into 800
  // and mangles ids like "1P0271".
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
  isArray: (name) => ALWAYS_ARRAY.has(name),
});

/** `<features>` children that are counts rather than 0/1 amenity flags. */
const FEATURE_COUNTS = [
  "bedrooms",
  "bathrooms",
  "ensuite",
  "toilets",
  "livingAreas",
  "garages",
  "carports",
  "openSpaces",
] as const;

type XmlNode = Record<string, unknown>;

function text(node: unknown): string | undefined {
  if (node === null || node === undefined) return undefined;
  if (typeof node === "object") {
    const value = (node as XmlNode)["#text"];
    return value === undefined ? undefined : String(value).trim() || undefined;
  }
  const s = String(node).trim();
  return s.length > 0 ? s : undefined;
}

function attr(node: unknown, name: string): string | undefined {
  if (!node || typeof node !== "object") return undefined;
  const value = (node as XmlNode)[`@_${name}`];
  return value === undefined ? undefined : String(value).trim() || undefined;
}

function num(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const n = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function truthy(value: string | undefined): boolean {
  if (!value) return false;
  const s = value.toLowerCase();
  return s === "1" || s === "yes" || s === "true";
}

function array<T = unknown>(value: unknown): T[] {
  if (value === undefined || value === null) return [];
  return (Array.isArray(value) ? value : [value]) as T[];
}

function slugify(parts: (string | undefined)[]): string {
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** `<extraFields name="geoLat" value="-33.78"/>` → `{ geoLat: "-33.78" }`. */
function extraFieldMap(node: XmlNode): Record<string, string> {
  const out: Record<string, string> = {};
  for (const field of array<XmlNode>(node.extraFields)) {
    const name = attr(field, "name");
    const value = attr(field, "value") ?? text(field);
    if (name && value !== undefined) out[name] = value;
  }
  return out;
}

function parseMedia(nodes: unknown): Media[] {
  const out: Media[] = [];

  for (const node of array<XmlNode>(nodes)) {
    const sourceUrl = attr(node, "url");
    const id = attr(node, "id");

    // Agentbox pads every listing out to a fixed number of slots with empty
    // `<img id="z"/>` placeholders. Without this skip they would flood the
    // media download queue with rows that can never succeed.
    if (!sourceUrl || !id) continue;

    out.push({
      id,
      recordId: attr(node, "recordId"),
      title: attr(node, "title"),
      format: attr(node, "format"),
      sourceUrl,
      modTime: parseReaxmlDate(attr(node, "modTime")),
      localPath: null,
      sha256: null,
      attempts: 0,
      lastError: null,
    });
  }

  return out;
}

function parseAgents(node: XmlNode) {
  return array<XmlNode>(node.listingAgent)
    .map((agent) => {
      const name = text(agent.name);
      // Slots 3 and 4 arrive as bare `<listingAgent id="3"/>`.
      if (!name) return null;

      const phones = array<XmlNode>(agent.telephone);
      const byType = (type: string) =>
        text(phones.find((p) => attr(p, "type")?.toLowerCase() === type.toLowerCase()));

      return {
        id: attr(agent, "id"),
        name,
        email: text(agent.email),
        mobile: byType("mobile"),
        phone: byType("BH"),
      };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);
}

function parseFeatures(node: XmlNode) {
  const raw = (node.features ?? {}) as XmlNode;
  const counts = Object.fromEntries(
    FEATURE_COUNTS.map((key) => [key, num(text(raw[key]))]),
  ) as Record<(typeof FEATURE_COUNTS)[number], number | undefined>;

  // Anything left that is set to 1 is an amenity. Discovering these
  // dynamically means a flag Agentbox adds later shows up without a code
  // change.
  const skip = new Set<string>([...FEATURE_COUNTS, "otherFeatures"]);
  const amenities = Object.keys(raw)
    .filter((key) => !skip.has(key) && !key.startsWith("@_") && truthy(text(raw[key])))
    .sort();

  const other = (text(raw.otherFeatures) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    ...counts,
    totalParking:
      (counts.garages ?? 0) + (counts.carports ?? 0) + (counts.openSpaces ?? 0),
    amenities,
    other,
  };
}

function parseArea(node: unknown) {
  const value = num(text(node));
  if (value === undefined) return null;
  return { value, unit: attr(node, "unit") };
}

function parseAddress(node: XmlNode, extras: Record<string, string>) {
  const raw = (node.address ?? {}) as XmlNode;
  const display = truthy(attr(raw, "display") ?? "yes");
  const suburb = text(raw.suburb);
  const streetNumber = text(raw.streetNumber);
  const street = text(raw.street);
  const state = text(raw.state);
  const postcode = text(raw.postcode);

  // When the agency has hidden the street address, the full form must not
  // reconstruct it — that flag reflects a vendor instruction.
  const full = display
    ? [extras.streetAddress ?? [streetNumber, street].filter(Boolean).join(" "), suburb, state, postcode]
        .filter(Boolean)
        .join(", ")
    : [suburb, state, postcode].filter(Boolean).join(", ");

  return {
    display,
    suburbDisplay: truthy(attr(raw.suburb, "display") ?? "yes"),
    subNumber: text(raw.subNumber),
    lotNumber: text(raw.lotNumber),
    streetNumber,
    street,
    suburb,
    state,
    postcode,
    country: text(raw.country),
    full,
  };
}

function parsePrice(node: XmlNode) {
  // Rentals use <rent period="weekly">, sales use <price>.
  const source = node.rent ?? node.price;
  return {
    display: truthy(attr(source, "display") ?? "yes"),
    value: num(text(source)),
    view: text(node.priceView),
    period: attr(source, "period"),
  };
}

function parseLocation(extras: Record<string, string>) {
  const lat = Number(extras.geoLat);
  const lng = Number(extras.geoLong);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat === 0 && lng === 0) return null;
  // GeoJSON is [longitude, latitude].
  return { type: "Point" as const, coordinates: [lng, lat] as [number, number] };
}

export type ParseResult = {
  listings: Listing[];
  /** Listings belonging to another agency, or that failed validation. */
  skipped: { uniqueID?: string; reason: string }[];
};

/**
 * Parses one REAXML file into normalised listings.
 *
 * @param xml         Raw file contents.
 * @param sourceFile  Filename, recorded for provenance.
 * @param agentID     Only listings for this agency are returned. The feed is
 *                    multi-tenant and will carry other agencies' files.
 */
export function parseFeed(xml: string, sourceFile: string, agentID: string): ParseResult {
  const doc = parser.parse(xml) as XmlNode;

  // `<propertyList>` carries `username` and `password` attributes in plaintext.
  // Only its child elements are read; the element itself is never persisted.
  const propertyList = (doc.propertyList ?? {}) as XmlNode;

  const listings: Listing[] = [];
  const skipped: ParseResult["skipped"] = [];
  const ingestedAt = new Date();

  for (const category of LISTING_CATEGORIES) {
    for (const node of array<XmlNode>(propertyList[category])) {
      const uniqueID = text(node.uniqueID);
      const listingAgentID = text(node.agentID);

      if (!uniqueID) {
        skipped.push({ reason: "missing uniqueID" });
        continue;
      }

      if (listingAgentID !== agentID) {
        skipped.push({ uniqueID, reason: `other agency: ${listingAgentID}` });
        continue;
      }

      const modTime = parseReaxmlDate(attr(node, "modTime"));
      if (!modTime) {
        skipped.push({ uniqueID, reason: "unparseable modTime" });
        continue;
      }

      const statusAttr = (attr(node, "status") ?? "current").toLowerCase();
      const status = (
        LISTING_STATUSES.includes(statusAttr as ListingStatus) ? statusAttr : "withdrawn"
      ) as ListingStatus;

      const extras = extraFieldMap(node);
      const address = parseAddress(node, extras);
      const objects = (node.objects ?? {}) as XmlNode;

      const candidate = {
        category: category as ListingCategory,
        status,
        agentID,
        uniqueID,
        modTime,

        headline: text(node.headline),
        description: text(node.description),

        address,
        location: parseLocation(extras),
        region: extras.regionName,

        price: parsePrice(node),
        soldDetails: node.soldDetails
          ? {
              display: truthy(attr((node.soldDetails as XmlNode).price, "display")),
              price: num(text((node.soldDetails as XmlNode).price)),
              date: parseReaxmlDate(text((node.soldDetails as XmlNode).date)),
            }
          : null,
        bond: num(text(node.bond)),
        dateAvailable: parseReaxmlDate(text(node.dateAvailable)),
        allowances: Object.entries((node.allowances ?? {}) as XmlNode)
          .filter(([, v]) => truthy(text(v)))
          .map(([k]) => k)
          .sort(),

        propertyType: attr(node.category, "name"),
        features: parseFeatures(node),
        landArea: parseArea((node.landDetails as XmlNode)?.area),
        buildingArea: parseArea((node.buildingDetails as XmlNode)?.area),

        images: parseMedia(objects.img),
        floorplans: parseMedia(objects.floorplan),
        videoUrl: attr(node.videoLink, "href"),
        externalUrl: attr(array<XmlNode>(node.externalLink)[0], "href"),

        agents: parseAgents(node),
        inspections: [],

        exclusivity: attr(node.exclusivity, "value"),

        // Status alone is not enough — Agentbox also gates visibility through
        // these two extraFields, and either one set must suppress publication.
        isPublic:
          PUBLIC_STATUSES.includes(status) &&
          !truthy(extras.hiddenListing) &&
          !truthy(extras.OffMarketListing),

        slug: slugify([
          address.display ? address.streetNumber : undefined,
          address.display ? address.street : undefined,
          address.suburb,
          uniqueID,
        ]),

        raw: extras,

        sourceFile,
        ingestedAt,
      };

      const result = listingSchema.safeParse(candidate);
      if (result.success) {
        listings.push(result.data);
      } else {
        skipped.push({ uniqueID, reason: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") });
      }
    }
  }

  return { listings, skipped };
}
