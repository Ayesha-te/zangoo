// Server-side WooCommerce REST API client.
//
// Credentials come from WOOCOMMERCE_URL / WOOCOMMERCE_CONSUMER_KEY / WOOCOMMERCE_CONSUMER_SECRET.
// They have no NEXT_PUBLIC_ prefix, so Next.js never inlines them into browser bundles. The site is a
// static export: these requests run during `next build` (and `next dev`), never in the visitor's browser.

if (typeof window !== "undefined") {
  throw new Error("The WooCommerce client is server-only and must not be imported into client components.");
}

const API_PATH = "/wp-json/wc/v3";
const REQUEST_TIMEOUT_MS = 15_000;
// The host's LiteSpeed cache serves stale REST responses (e.g. edited products). A stamp that is fixed per
// build / dev-server run bypasses it, so every build gets current WooCommerce data while requests within one
// build still share Next's fetch cache.
const FRESHNESS_STAMP = Date.now().toString(36);

export class WooCommerceError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "WooCommerceError";
  }
}

type WooConfig = { baseUrl: string; authHeader: string };

/** Returns the API config, or null when the credentials are not set (callers fall back to local data). */
export function getWooConfig(): WooConfig | null {
  const url = process.env.WOOCOMMERCE_URL?.trim();
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY?.trim();
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET?.trim();
  if (!url || !key || !secret) return null;

  return {
    baseUrl: url.replace(/\/+$/, "") + API_PATH,
    // HTTPS + Basic auth is WooCommerce's supported method for server-to-server requests.
    authHeader: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`,
  };
}

export function isWooConfigured() {
  return getWooConfig() !== null;
}

type QueryValue = string | number | boolean | undefined;

type WooResponse<T> = { data: T; totalPages: number; total: number };

async function request<T>(path: string, query: Record<string, QueryValue> = {}): Promise<WooResponse<T>> {
  const config = getWooConfig();
  if (!config) throw new WooCommerceError("WooCommerce credentials are not configured", undefined, "not_configured");

  const url = new URL(config.baseUrl + path);
  for (const [name, value] of Object.entries(query)) {
    if (value !== undefined) url.searchParams.set(name, String(value));
  }
  url.searchParams.set("_fresh", FRESHNESS_STAMP);

  let response: Response;
  try {
    response = await fetch(url, {
      // Static export: responses must be cacheable at build time (same approach as the WordPress blog).
      cache: "force-cache",
      headers: { Authorization: config.authHeader, Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const reason = error instanceof Error && error.name === "TimeoutError" ? `timed out after ${REQUEST_TIMEOUT_MS}ms` : String(error);
    throw new WooCommerceError(`WooCommerce request to ${path} failed: ${reason}`, undefined, "network_error");
  }

  if (!response.ok) {
    // WooCommerce errors look like { code, message, data: { status } }. Never echo the request URL/headers.
    const body = (await response.json().catch(() => null)) as { code?: string; message?: string } | null;
    throw new WooCommerceError(
      `WooCommerce ${path} returned ${response.status}${body?.message ? `: ${body.message}` : ""}`,
      response.status,
      body?.code,
    );
  }

  return {
    data: (await response.json()) as T,
    totalPages: Number(response.headers.get("x-wp-totalpages") ?? 1) || 1,
    total: Number(response.headers.get("x-wp-total") ?? 0) || 0,
  };
}

/** GET a single resource or one page of a collection. */
export async function wooGet<T>(path: string, query: Record<string, QueryValue> = {}): Promise<T> {
  return (await request<T>(path, query)).data;
}

/** GET every page of a collection (WooCommerce caps per_page at 100). */
export async function wooGetAll<T>(path: string, query: Record<string, QueryValue> = {}, maxPages = 20): Promise<T[]> {
  const first = await request<T[]>(path, { ...query, per_page: 100, page: 1 });
  const items = [...first.data];
  for (let page = 2; page <= Math.min(first.totalPages, maxPages); page += 1) {
    items.push(...(await request<T[]>(path, { ...query, per_page: 100, page })).data);
  }
  return items;
}
