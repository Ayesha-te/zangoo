"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { orthoMattressProducts, type MattressProduct } from "@/app/data/mattressProducts";

type CatalogContextValue = {
  /** Store products (WooCommerce at build time, or the local catalogue as fallback). */
  products: MattressProduct[];
  /** Public WooCommerce URL for browser-side cart requests; null when WooCommerce isn't configured. */
  storeUrl: string | null;
  getProduct: (slug: string) => MattressProduct | undefined;
  /** The product + size that a WooCommerce variation ID belongs to. */
  findByVariation: (variationId: number) => { product: MattressProduct; size: string } | undefined;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ products, storeUrl, children }: { products: MattressProduct[]; storeUrl: string | null; children: ReactNode }) {
  const value = useMemo<CatalogContextValue>(
    () => ({
      products,
      storeUrl,
      getProduct: (slug) => products.find((product) => product.slug === slug),
      findByVariation: (variationId) => {
        for (const product of products) {
          const size = Object.entries(product.sizePricing ?? {}).find(([, pricing]) => pricing.variationId === variationId)?.[0];
          if (size) return { product, size };
        }
        return undefined;
      },
    }),
    [products, storeUrl],
  );
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

/** Store catalogue for client components. Falls back to the local catalogue outside the provider. */
export function useCatalog(): CatalogContextValue {
  const context = useContext(CatalogContext);
  if (context) return context;
  return {
    products: orthoMattressProducts,
    storeUrl: null,
    getProduct: (slug) => orthoMattressProducts.find((product) => product.slug === slug),
    findByVariation: () => undefined,
  };
}
