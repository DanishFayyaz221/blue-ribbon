const BASE_URL = process.env.AGENTBOX_BASE_URL ?? "https://api.agentboxcrm.com.au";
const API_KEY = process.env.AGENTBOX_API_KEY;
const CLIENT_ID = process.env.AGENTBOX_CLIENT_ID;

if (!API_KEY || !CLIENT_ID) {
  throw new Error(
    "Missing AGENTBOX_API_KEY or AGENTBOX_CLIENT_ID in environment. See .env.example.",
  );
}

export class AgentboxError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown,
  ) {
    super(message);
    this.name = "AgentboxError";
  }
}

type QueryValue = string | number | boolean | undefined | null;

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(path.startsWith("/") ? path : `/${path}`, BASE_URL);
  url.searchParams.set("version", "2");
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function agentboxRequest<T = unknown>(
  path: string,
  init: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    query?: Record<string, QueryValue>;
    body?: unknown;
  } = {},
): Promise<T> {
  const url = buildUrl(path, init.query);
  const res = await fetch(url, {
    method: init.method ?? "GET",
    headers: {
      "X-Client-ID": CLIENT_ID as string,
      "X-API-Key": API_KEY as string,
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  let parsed: unknown = text;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    // Non-JSON response (e.g. HTML error page from the edge)
  }

  if (!res.ok) {
    throw new AgentboxError(
      `Agentbox ${init.method ?? "GET"} ${path} failed with ${res.status}`,
      res.status,
      parsed,
    );
  }

  return parsed as T;
}
