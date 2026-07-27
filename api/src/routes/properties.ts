import { Router } from "express";
import { agentboxList, agentboxGet } from "../agentbox/helpers.js";
import { asyncHandler } from "../middleware/async-handler.js";

type RawAddress = {
  streetAddress?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  region?: string;
  hideAddress?: boolean;
};

type RawProperty = {
  id?: string;
  type?: string;
  category?: string;
  address?: RawAddress;
  location?: { lat?: string; long?: string };
  bedrooms?: string | number;
  bathrooms?: string | number;
  totalParking?: string | number;
  carSpaces?: string | number;
  garages?: string | number;
  landArea?: { value?: string | number; unit?: string };
  landSizeText?: string;
  buildingArea?: { value?: string | number; unit?: string };
  yearBuilt?: string | number;
  features?: string[];
};

type RawInspection = {
  startDate?: string;
  endDate?: string;
  type?: string;
};

type RawRelatedStaff = {
  webDisplay?: boolean;
  displayOrder?: string | number;
  role?: string; // "Listing Agent" | "Property Manager" | ...
  staffMember?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    email?: string;
    mobile?: string;
    phone?: string;
    hideMobileOnWeb?: boolean;
  };
};

type RawOutgoings = {
  councilRates?: { value?: string; period?: string };
  waterRates?: { value?: string; period?: string };
  strataTotal?: { value?: string; period?: string };
};

// Agentbox image objects use `url` for the full-size and `thumbnails: [{ url,
// size, width, height }]` for pre-generated sizes (a=480, b/c/d=800).
type RawThumbnail = { url?: string; size?: string; width?: string; height?: string };
type RawImage = { id?: string; title?: string; url?: string; thumbnails?: RawThumbnail[] };

type RawListing = {
  id: string;
  officeId?: string;
  officeName?: string;
  type?: string;
  status?: string;
  marketingStatus?: string;
  displayPrice?: string;
  displayRent?: { value?: string; period?: string };
  property?: RawProperty;
  outgoings?: RawOutgoings;
  mainHeadline?: string;
  mainDescription?: string;
  mainImage?: RawImage;
  images?: RawImage[];
  floorPlans?: RawImage[];
  inspectionDates?: RawInspection[];
  relatedStaffMembers?: RawRelatedStaff[];
  authority?: string;
  auctionDate?: string;
  webLink?: string;
  lastModified?: string;
};

function num(v: unknown): number | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function extractDisplayAddress(a?: RawAddress): string {
  if (!a) return "";
  if (a.hideAddress) return [a.suburb, a.state].filter(Boolean).join(", ");
  return [a.streetAddress, a.suburb].filter(Boolean).join(", ");
}

function extractPrice(l: RawListing): string {
  if (l.displayPrice) {
    if (l.type === "Lease" && l.displayRent?.period) {
      return `${l.displayPrice} / ${l.displayRent.period}`;
    }
    return l.displayPrice;
  }
  if (l.displayRent?.value) {
    return l.displayRent.period
      ? `${l.displayRent.value} / ${l.displayRent.period}`
      : l.displayRent.value;
  }
  return "Contact agent";
}

function pickImageUrl(img?: RawImage): string | null {
  if (!img) return null;
  // Prefer 800px thumbnail (size b/c/d) over full-size to keep cards fast.
  const preferred = img.thumbnails?.find((t) => t.size === "b" || t.size === "c");
  return preferred?.url ?? img.url ?? null;
}

function extractImages(l: RawListing): string[] {
  const urls: string[] = [];
  const main = pickImageUrl(l.mainImage);
  if (main) urls.push(main);
  if (l.images) {
    for (const img of l.images) {
      const u = pickImageUrl(img);
      if (u) urls.push(u);
    }
  }
  return Array.from(new Set(urls));
}

function mapPropertyCard(l: RawListing) {
  const p = l.property ?? {};
  const parking = num(p.totalParking) ?? num(p.carSpaces) ?? num(p.garages);
  const images = extractImages(l);
  return {
    id: l.id,
    address: extractDisplayAddress(p.address),
    suburb: p.address?.suburb ?? null,
    state: p.address?.state ?? null,
    postcode: p.address?.postcode ?? null,
    guide: extractPrice(l),
    beds: num(p.bedrooms),
    baths: num(p.bathrooms),
    cars: parking,
    image: images[0] ?? null,
    type: l.type ?? null, // "Sale" | "Lease"
    status: l.marketingStatus ?? l.status ?? null,
    propertyType: p.type ?? null, // "Residential" | "Commercial"
    propertyCategory: p.category ?? null, // "Apartment" | "House" | ...
  };
}

function extractFloorPlans(l: RawListing): string[] {
  if (!l.floorPlans) return [];
  return l.floorPlans
    .map((img) => pickImageUrl(img))
    .filter((u): u is string => !!u);
}

function mapAgents(list?: RawRelatedStaff[]) {
  if (!list) return [];
  return list
    .filter((s) => s.webDisplay !== false && s.staffMember)
    .sort((a, b) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0))
    .map((s) => {
      const m = s.staffMember!;
      const name = [m.firstName, m.lastName].filter(Boolean).join(" ").trim() || "Blue Ribbon Agent";
      return {
        id: m.id ?? "",
        name,
        role: s.role ?? m.jobTitle ?? "",
        email: m.email ?? null,
        mobile: m.hideMobileOnWeb ? null : (m.mobile ?? m.phone ?? null),
      };
    });
}

function mapInspections(list?: RawInspection[]) {
  if (!list) return [];
  return list
    .filter((i) => i.startDate)
    .map((i) => ({ start: i.startDate!, end: i.endDate ?? null, type: i.type ?? null }));
}

function mapPropertyDetail(l: RawListing) {
  const p = l.property ?? {};
  const o = l.outgoings ?? {};
  const landArea = p.landArea?.value
    ? `${p.landArea.value}${p.landArea.unit ? ` ${p.landArea.unit}` : ""}`
    : p.landSizeText ?? null;
  const buildingArea = p.buildingArea?.value
    ? `${p.buildingArea.value}${p.buildingArea.unit ? ` ${p.buildingArea.unit}` : ""}`
    : null;
  return {
    ...mapPropertyCard(l),
    images: extractImages(l),
    floorPlans: extractFloorPlans(l),
    inspections: mapInspections(l.inspectionDates),
    agents: mapAgents(l.relatedStaffMembers),
    features: Array.isArray(p.features) ? p.features.filter((f) => typeof f === "string") : [],
    headline: l.mainHeadline ?? null,
    description: l.mainDescription ?? null,
    landArea,
    buildingArea,
    yearBuilt: p.yearBuilt ? String(p.yearBuilt) : null,
    authority: l.authority ?? null,
    auctionDate: l.auctionDate ?? null,
    location: p.location?.lat && p.location?.long
      ? { lat: Number(p.location.lat), lng: Number(p.location.long) }
      : null,
    outgoings: {
      councilRates: o.councilRates?.value ? Number(o.councilRates.value) : null,
      waterRates: o.waterRates?.value ? Number(o.waterRates.value) : null,
      strataTotal: o.strataTotal?.value ? Number(o.strataTotal.value) : null,
    },
    lastModified: l.lastModified ?? null,
  };
}

export const propertiesRouter = Router();

propertiesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const q = req.query;
    const filter: Record<string, string | number | undefined> = {};
    if (q.type) filter.type = String(q.type); // "Sale" | "Lease"
    if (q.status) filter.marketingStatus = String(q.status);
    // Agentbox `filter[suburb]` requires an exact known suburb name (returns
    // 400 otherwise). Free-text searches from the site's search bar go through
    // `filter[query]`, which matches listing id / address / suburb / property
    // name. Callers can still hit `filter[suburb]` explicitly by passing
    // `?exactSuburb=`.
    if (q.exactSuburb) filter.suburb = String(q.exactSuburb);
    else if (q.suburb) filter.query = String(q.suburb);
    if (q.propertyType) filter.propertyType = String(q.propertyType);
    if (q.minBedrooms) filter.minBedrooms = Number(q.minBedrooms);
    if (q.minBathrooms) filter.minBathrooms = Number(q.minBathrooms);
    if (q.minPrice) filter.minPrice = Number(q.minPrice);
    if (q.maxPrice) filter.maxPrice = Number(q.maxPrice);

    const defaultOfficeId = process.env.BLUE_RIBBON_OFFICE_ID;
    if (!q.officeId && defaultOfficeId) filter.officeId = defaultOfficeId;
    else if (q.officeId) filter.officeId = String(q.officeId);

    // Agentbox filter names differ from ours: priceFrom/priceTo (not min/max).
    if (q.minPrice) filter.priceFrom = Number(q.minPrice);
    if (q.maxPrice) filter.priceTo = Number(q.maxPrice);

    const page = q.page ? Number(q.page) : undefined;
    const limit = q.limit ? Number(q.limit) : undefined;
    const orderBy = typeof q.orderBy === "string" ? q.orderBy : undefined;
    const order = q.order === "ASC" || q.order === "DESC" ? q.order : undefined;

    const { items, pagination } = await agentboxList<RawListing>(
      "/listings",
      "listings",
      {
        page,
        limit,
        filter,
        include: ["mainImage", "mainDescription"],
        orderBy,
        order,
      },
    );
    res.json({ ok: true, items: items.map(mapPropertyCard), pagination });
  }),
);

propertiesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const item = await agentboxGet<RawListing>(`/listings/${req.params.id}`, "listing", {
      include: ["images", "floorPlans", "inspectionDates", "relatedStaffMembers"],
    });
    if (!item) {
      res.status(404).json({ ok: false, error: "not_found" });
      return;
    }
    res.json({ ok: true, item: mapPropertyDetail(item) });
  }),
);
