import { agentboxRequest } from "./client.js";
import { withRateLimit } from "./rate-limit.js";
import { cached } from "./cache.js";

type QueryValue = string | number | boolean | undefined | null;

export type ListParams = {
  page?: number;
  limit?: number;
  filter?: Record<string, QueryValue>;
  include?: string[];
  orderBy?: string;
  order?: "ASC" | "DESC";
  ttlMs?: number;
};

export type Pagination = { current: number; last: number; items: number };
export type ListResult<T> = { items: T[]; pagination: Pagination };

function normalizeQuery(params: ListParams): Record<string, QueryValue> {
  const q: Record<string, QueryValue> = {};
  if (params.page) q.page = params.page;
  if (params.limit) q.limit = params.limit;
  if (params.orderBy) q.orderBy = params.orderBy;
  if (params.order) q.order = params.order;
  if (params.include?.length) q.include = params.include.join(",");
  if (params.filter) {
    for (const [k, v] of Object.entries(params.filter)) {
      if (v === undefined || v === null || v === "") continue;
      q[`filter[${k}]`] = v;
    }
  }
  return q;
}

function buildCacheKey(path: string, query: Record<string, QueryValue>): string {
  const parts = Object.entries(query)
    .filter(([, v]) => v !== undefined && v !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`);
  return `${path}?${parts.join("&")}`;
}

type EnvelopeList<T> = {
  response?: Record<string, unknown> & {
    items?: string | number;
    current?: string | number;
    last?: string | number;
  };
};

type EnvelopeSingle = { response?: Record<string, unknown> };

const DEFAULT_TTL = 5 * 60 * 1000;

export async function agentboxList<T>(
  path: string,
  resourceKey: string,
  params: ListParams = {},
): Promise<ListResult<T>> {
  const query = normalizeQuery(params);
  const key = buildCacheKey(path, query);
  const ttl = params.ttlMs ?? DEFAULT_TTL;

  return cached(key, ttl, () =>
    withRateLimit(async () => {
      const raw = await agentboxRequest<EnvelopeList<T>>(path, { query });
      const resp = raw?.response ?? {};
      const items = (resp[resourceKey] as T[]) ?? [];
      return {
        items,
        pagination: {
          items: Number(resp.items ?? items.length),
          current: Number(resp.current ?? 1),
          last: Number(resp.last ?? 1),
        },
      };
    }),
  );
}

export async function agentboxGet<T>(
  path: string,
  resourceKey: string,
  params: { include?: string[]; ttlMs?: number } = {},
): Promise<T | null> {
  const query: Record<string, QueryValue> = {};
  if (params.include?.length) query.include = params.include.join(",");
  const key = buildCacheKey(path, query);
  const ttl = params.ttlMs ?? DEFAULT_TTL;

  return cached(key, ttl, () =>
    withRateLimit(async () => {
      const raw = await agentboxRequest<EnvelopeSingle>(path, { query });
      return (raw?.response?.[resourceKey] as T) ?? null;
    }),
  );
}

export async function agentboxPost<T>(
  path: string,
  resourceKey: string,
  body: unknown,
): Promise<T | null> {
  return withRateLimit(async () => {
    const raw = await agentboxRequest<EnvelopeSingle>(path, {
      method: "POST",
      body,
    });
    return (raw?.response?.[resourceKey] as T) ?? null;
  });
}
