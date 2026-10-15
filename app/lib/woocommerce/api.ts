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
