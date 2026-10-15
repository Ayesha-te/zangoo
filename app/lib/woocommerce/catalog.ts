// Storefront entry point: WooCommerce is the source of truth for products, with the local catalogue as a
// safety net so a missing category, empty catalogue or API outage never breaks the build or the shop.
import type { MattressProduct } from "@/app/data/mattressProducts";
import { getWooCategoryBySlug, getWooProductVariations, getWooProducts } from "./api";
import { isWooConfigured, WooCommerceError } from "./client";
import { mapWooProduct } from "./mapper";

export type CatalogResult = {
  products: MattressProduct[];
  source: "woocommerce" | "fallback";
  /** Why the fallback was used (empty when WooCommerce data was used). */
  reason?: string;
};

/**
 * Products for a WooCommerce category slug, mapped into the existing product-card structure.
 * Falls back to `fallback` when WooCommerce is unconfigured, unreachable, or has no products in that category.
 */
export async function getCatalogProducts(categorySlug: string, fallback: MattressProduct[]): Promise<CatalogResult> {
  const fallBackTo = (reason: string): CatalogResult => {
    console.warn(`[woocommerce] "${categorySlug}": using local catalogue (${reason})`);
    return { products: fallback, source: "fallback", reason };
  };

  if (!isWooConfigured()) return fallBackTo("WooCommerce credentials are not set");

  try {
    const category = await getWooCategoryBySlug(categorySlug);
    if (!category) return fallBackTo(`no WooCommerce category with slug "${categorySlug}"`);

    const products = await getWooProducts({ categoryId: category.id });
    if (!products.length) return fallBackTo(`WooCommerce category "${categorySlug}" has no published products`);

    const mapped = await Promise.all(
      products.map(async (product) => mapWooProduct(product, product.type === "variable" ? await getWooProductVariations(product.id) : [])),
    );
    console.info(`[woocommerce] "${categorySlug}": loaded ${mapped.length} products from WooCommerce`);
    return { products: mapped, source: "woocommerce" };
  } catch (error) {
    const reason = error instanceof WooCommerceError ? error.message : `unexpected error: ${String(error)}`;
    console.error(`[woocommerce] "${categorySlug}": request failed`, error);
    return fallBackTo(reason);
  }
}
