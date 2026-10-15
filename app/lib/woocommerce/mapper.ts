// Maps WooCommerce products into the storefront's existing product structure (MattressProduct),
// so product cards and pages render WooCommerce data without any UI changes.
import { formatGBP, type MattressProduct } from "@/app/data/mattressProducts";
import { UNTRACKED_STOCK } from "@/app/utils/stockState";
import type { WooAttribute, WooProduct, WooVariation } from "./types";

const FALLBACK_IMAGE = "/category page banner.jpeg";
const DEFAULT_FIRMNESS = "Medium to Firm";

const toNumber = (value: string | undefined) => {
  const number = Number.parseFloat(value ?? "");
  return Number.isFinite(number) ? number : null;
};

/** WooCommerce descriptions are HTML; cards and meta tags need plain text. */
export function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;|&#038;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&quot;|&#8220;|&#8221;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

const attributeValue = (attributes: WooAttribute[], name: RegExp) => {
  const attribute = attributes.find((item) => name.test(item.name));
  return attribute?.option ?? attribute?.options?.[0];
};

/** Sale/regular price of a product or variation; sale falls back to the active price. */
function priceOf(item: Pick<WooProduct, "price" | "regular_price" | "sale_price">) {
  const regular = toNumber(item.regular_price) ?? toNumber(item.price);
  const sale = toNumber(item.sale_price) ?? toNumber(item.price) ?? regular;
  if (regular === null || sale === null) return null;
  return { regular: Math.max(regular, sale), sale };
}

function stockCount(item: Pick<WooProduct, "stock_status" | "stock_quantity">) {
  if (item.stock_status === "outofstock") return 0;
  // No quantity when WooCommerce stock management is off: show plain "In stock".
  return item.stock_quantity ?? UNTRACKED_STOCK;
}

export function mapWooProduct(product: WooProduct, variations: WooVariation[] = []): MattressProduct {
  const description = stripHtml(product.short_description || product.description);

  // Per-size pricing from variations that carry a "Size" attribute (e.g. Single / Double / King).
  const sizePricing: NonNullable<MattressProduct["sizePricing"]> = {};
  for (const variation of variations) {
    const size = attributeValue(variation.attributes, /size/i);
    const price = priceOf(variation);
    if (!size || !price) continue;
    sizePricing[size.toLowerCase()] = { ...price, variationId: variation.id, image: variation.image?.src };
  }

  // Card price = cheapest purchasable option.
  const options = [...variations.map(priceOf), priceOf(product)].filter((price): price is { regular: number; sale: number } => Boolean(price) && price!.sale > 0);
  const pricing = options.sort((a, b) => a.sale - b.sale)[0];

  const gallery = [
    ...product.images.map((image) => ({ src: image.src, alt: image.alt || product.name })),
    ...variations.flatMap((variation) => (variation.image ? [{ src: variation.image.src, alt: variation.image.alt || product.name }] : [])),
  ].filter((image, index, all) => all.findIndex((other) => other.src === image.src) === index);
  const image = gallery[0] ?? { src: FALLBACK_IMAGE, alt: product.name };

  return {
    slug: product.slug,
    name: product.name,
    shortName: product.name,
    price: pricing ? `${variations.length ? "From " : ""}${formatGBP(pricing.sale)}` : "Price on request",
    firmness: attributeValue(product.attributes, /firm/i) ?? DEFAULT_FIRMNESS,
    description,
    image: image.src,
    imageAlt: image.alt,
    gallery,
    bullets: product.tags.map((tag) => tag.name),
    specs: [],
    features: [],
    faqs: [],
    bestFor: product.categories.map((category) => category.name),
    stockCount: variations.length ? Math.max(0, ...variations.map(stockCount)) : stockCount(product),
    compareSpecs: {
      springType: attributeValue(product.attributes, /spring/i) ?? "—",
      comfortLayer: attributeValue(product.attributes, /comfort/i) ?? "—",
      cover: attributeValue(product.attributes, /cover|fabric/i) ?? "—",
      turnable: /yes|true|double/i.test(attributeValue(product.attributes, /turn|sided/i) ?? ""),
      weight: attributeValue(product.attributes, /weight/i) ?? "—",
    },
    source: "woocommerce",
    wooId: product.id,
    pricing,
    sizePricing: Object.keys(sizePricing).length ? sizePricing : undefined,
  };
}
