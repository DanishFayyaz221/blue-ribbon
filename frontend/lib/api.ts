const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type ApiOk<T> = { ok: true } & T;
export type ApiErr = {
  ok: false;
  error: string;
  message?: string;
  upstreamStatus?: number;
  upstreamBody?: unknown;
};
export type ApiResult<T> = ApiOk<T> | ApiErr;

export type Pagination = { current: number; last: number; items: number };

export type Staff = {
  id: string;
  name: string;
  role: string;
  image: string | null;
  email: string | null;
  mobile: string | null;
  officeId: string | null;
};

export type PropertyCard = {
  id: string;
  address: string;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  guide: string;
  beds?: number;
  baths?: number;
  cars?: number;
  image: string | null;
  type: string | null;
  status: string | null;
  propertyType: string | null;
  propertyCategory: string | null;
};

export type PropertyAgent = {
  id: string;
  name: string;
  role: string;
  email: string | null;
  mobile: string | null;
};

export type PropertyInspection = {
  start: string;
  end: string | null;
  type: string | null;
};

export type PropertyDetail = PropertyCard & {
  images: string[];
  floorPlans: string[];
  inspections: PropertyInspection[];
  agents: PropertyAgent[];
  features: string[];
  headline: string | null;
  description: string | null;
  landArea: string | null;
  buildingArea: string | null;
  yearBuilt: string | null;
  authority: string | null;
  auctionDate: string | null;
  location: { lat: number; lng: number } | null;
  outgoings: {
    councilRates: number | null;
    waterRates: number | null;
    strataTotal: number | null;
  };
  lastModified: string | null;
};

export type Office = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string;
};

export type PropertyQuery = {
  type?: "Sale" | "Lease";
  status?: string;
  suburb?: string;
  propertyType?: string;
  minBedrooms?: number;
  minBathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "ASC" | "DESC";
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });
  const text = await res.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // keep as text
  }
  if (!res.ok) {
    const err = body as ApiErr;
    throw new Error(err?.message ?? `API ${path} failed with ${res.status}`);
  }
  return body as T;
}

function qs(params: Record<string, string | number | undefined | null>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  return parts.length ? `?${parts.join("&")}` : "";
}

export const api = {
  async listStaff(): Promise<{ items: Staff[]; pagination: Pagination }> {
    const r = await apiFetch<ApiOk<{ items: Staff[]; pagination: Pagination }>>("/staff");
    return { items: r.items, pagination: r.pagination };
  },
  async getStaff(id: string): Promise<Staff | null> {
    try {
      const r = await apiFetch<ApiOk<{ item: Staff }>>(`/staff/${id}`);
      return r.item;
    } catch {
      return null;
    }
  },
  async listProperties(
    q: PropertyQuery = {},
  ): Promise<{ items: PropertyCard[]; pagination: Pagination }> {
    const r = await apiFetch<ApiOk<{ items: PropertyCard[]; pagination: Pagination }>>(
      `/properties${qs(q)}`,
    );
    return { items: r.items, pagination: r.pagination };
  },
  async getProperty(id: string): Promise<PropertyDetail | null> {
    try {
      const r = await apiFetch<ApiOk<{ item: PropertyDetail }>>(`/properties/${id}`);
      return r.item;
    } catch {
      return null;
    }
  },
  async listOffices(): Promise<Office[]> {
    const r = await apiFetch<ApiOk<{ items: Office[] }>>("/offices");
    return r.items;
  },

  async submitContact(input: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<{ enquiryId: number | null }> {
    const r = await apiFetch<ApiOk<{ enquiryId: number | null }>>("/leads/contact", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { enquiryId: r.enquiryId };
  },

  async submitPropertyEnquiry(input: {
    firstName: string;
    lastName?: string;
    email: string;
    mobile?: string;
    message?: string;
    helpTopic?: string;
    listingId: string;
  }): Promise<{ enquiryId: number | null }> {
    const r = await apiFetch<ApiOk<{ enquiryId: number | null }>>("/leads/enquiry", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { enquiryId: r.enquiryId };
  },

  async submitAppraisal(input: {
    name: string;
    email: string;
    mobile?: string;
    address: string;
    intent?: string;
    reportType: "sales" | "rental";
    estimatedValue?: string;
  }): Promise<{ enquiryId: number | null }> {
    const r = await apiFetch<ApiOk<{ enquiryId: number | null }>>("/leads/appraisal", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { enquiryId: r.enquiryId };
  },
};
