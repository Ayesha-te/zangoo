// WooCommerce read endpoints used by the storefront. Read-only: nothing here modifies the shop.
import { wooGet, wooGetAll } from "./client";
import type { WooCategory, WooProduct, WooVariation } from "./types";

/** Published products, optionally limited to one category ID. */
export function getWooProducts(options: { categoryId?: number } = {}) {
  return wooGetAll<WooProduct>("/products", { status: "publish", category: options.categoryId, orderby: "menu_order", order: "asc" });
}

export function getWooProductBySlug(slug: string) {
  return wooGet<WooProduct[]>("/products", { slug, status: "publish", per_page: 1 }).then((products) => products[0] ?? null);
}

export function getWooCategories() {
  return wooGetAll<WooCategory>("/products/categories", { hide_empty: false });
}

export async function getWooCategoryBySlug(slug: string) {
  const categories = await wooGet<WooCategory[]>("/products/categories", { slug, per_page: 1 });
  return categories[0] ?? null;
}

/** All variations (e.g. Single / Double / King) of a variable product. */
export function getWooProductVariations(productId: number) {
  return wooGetAll<WooVariation>(`/products/${productId}/variations`, { status: "publish" });
}

/**
 * Stripe settings the browser needs for the checkout page: only the PUBLISHABLE key (public by design) and the
 * mode. The gateway settings also hold secret keys; they are read here on the server at build time and never
 * passed on.
 */
export async function getStripeCheckoutConfig(): Promise<{ publishableKey: string; testMode: boolean } | null> {
  try {
    const gateway = await wooGet<{ enabled: boolean; settings: Record<string, { value: unknown }> }>("/payment_gateways/stripe");
    if (!gateway.enabled) return null;
    const testMode = gateway.settings.testmode?.value === "yes";
    const key = gateway.settings[testMode ? "test_publishable_key" : "publishable_key"]?.value;
    return typeof key === "string" && /^pk_(live|test)_/.test(key) ? { publishableKey: key, testMode } : null;
  } catch {
    return null;
  }
}
