// Subset of the WooCommerce REST API v3 response shapes that the storefront uses.
// https://woocommerce.github.io/woocommerce-rest-api-docs/

export type WooImage = {
  id: number;
  src: string;
  name: string;
  alt: string;
};

export type WooCategoryRef = {
  id: number;
  name: string;
  slug: string;
};

export type WooAttribute = {
  id: number;
  name: string;
  /** Present on products: every option the attribute offers. */
  options?: string[];
  /** Present on variations: the option this variation uses. */
  option?: string;
  variation?: boolean;
  visible?: boolean;
};

export type WooStockStatus = "instock" | "outofstock" | "onbackorder";

export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: "simple" | "variable" | "grouped" | "external";
  status: string;
  description: string;
  short_description: string;
  sku: string;
  /** Prices are decimal strings; empty string when not set. */
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: WooStockStatus;
  stock_quantity: number | null;
  categories: WooCategoryRef[];
  tags: WooCategoryRef[];
  images: WooImage[];
  attributes: WooAttribute[];
  /** Variation IDs (variable products only). */
  variations: number[];
};

export type WooVariation = {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: WooStockStatus;
  stock_quantity: number | null;
  image: WooImage | null;
  attributes: WooAttribute[];
};

export type WooCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  count: number;
  image: WooImage | null;
};
