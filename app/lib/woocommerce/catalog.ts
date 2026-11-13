// Storefront entry point: WooCommerce is the source of truth for products, with the local catalogue as a
// safety net so a missing category, empty catalogue or API outage never breaks the build or the shop.
import { orthoMattressProducts, type MattressProduct } from "@/app/data/mattressProducts";
import { pocketSprungProducts } from "@/app/data/pocketSprungProducts";
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

/** WooCommerce category that holds the mattress range. */
export const WOO_MATTRESS_CATEGORY = "mattresses";

/**
 * Merge a WooCommerce product with the local editorial record of the same slug (if any): WooCommerce owns
 * commerce data (prices, variations, images, stock, specs); local content fills what WooCommerce doesn't hold
 * yet (display names, spec list, features, FAQs), so pages render exactly as before.
 */
/** "Capri20Ortho20Single20Morning-1.webp" (WordPress upload) and "/…/Capri Ortho Single Morning.webp" → same key. */
function photoKey(src: string) {
  let name = src.split("/").pop() ?? "";
  try {
    name = decodeURIComponent(name);
  } catch {
    // Keep the raw name.
  }
  return name
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/-\d+$/, "")
    .replace(/20(?=[A-Z])/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * WooCommerce photos live on the WordPress host, which is slow and drops requests when a page loads many photos at
 * once. The same files ship with the site (Vercel CDN), so serve those instead; WooCommerce still decides which
 * photos show and in what order. Photos with no local copy keep their WordPress address.
 */
function withLocalPhotos(woo: MattressProduct, local: MattressProduct): MattressProduct {
  const localSrc = new Map([local.image, ...(local.gallery ?? []).map((image) => image.src)].map((src) => [photoKey(src), src]));
  const toLocal = (src: string) => localSrc.get(photoKey(src)) ?? src;
  return {
    ...woo,
    image: toLocal(woo.image),
    gallery: woo.gallery?.map((image) => ({ ...image, src: toLocal(image.src) })),
    sizePricing: woo.sizePricing
      ? Object.fromEntries(Object.entries(woo.sizePricing).map(([size, pricing]) => [size, { ...pricing, image: pricing.image && toLocal(pricing.image) }]))
      : woo.sizePricing,
  };
}

/** Every product with local editorial content (Ortho range + pocket sprung range). */
const LOCAL_PRODUCTS = [...orthoMattressProducts, ...pocketSprungProducts];

function withLocalContent(wooProduct: MattressProduct): MattressProduct {
  const local = LOCAL_PRODUCTS.find((product) => product.slug === wooProduct.slug);
  if (!local) return wooProduct;
  const woo = withLocalPhotos(wooProduct, local);
  return {
    ...local,
    ...woo,
    name: local.name,
    shortName: local.shortName,
    description: woo.description || local.description,
    bullets: local.bullets,
    specs: woo.specs.length ? woo.specs : local.specs,
    features: woo.features.length ? woo.features : local.features,
    faqs: woo.faqs.length ? woo.faqs : local.faqs,
    bestFor: local.bestFor,
    // In WooCommerce (so it has prices): on sale, even if the local record still says "coming soon".
    comingSoon: false,
  };
}

/**
 * The store's mattress catalogue (WooCommerce, merged with local content; local catalogue as fallback).
 * Products not in WooCommerce yet ("coming soon": no prices) are left out of listings; product pages ask for them
 * with includeComingSoon so they can still be reviewed by link.
 */
export async function getStoreCatalog(options: { includeComingSoon?: boolean } = {}): Promise<CatalogResult> {
  const result = await getCatalogProducts(WOO_MATTRESS_CATEGORY, orthoMattressProducts);
  const products = result.source === "woocommerce" ? result.products.map(withLocalContent) : result.products;
  if (!options.includeComingSoon) return { ...result, products };
  const comingSoon = pocketSprungProducts.filter((local) => !products.some((product) => product.slug === local.slug));
  return { ...result, products: [...products, ...comingSoon] };
}

/** Public WooCommerce site URL for browser-side cart requests (not a secret; null when not configured). */
export function getStoreUrl() {
  return isWooConfigured() ? process.env.WOOCOMMERCE_URL!.trim().replace(/\/+$/, "") : null;
}
