"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useCatalog } from "@/app/components/catalog/CatalogProvider";
import { STORAGE_KEYS, isRecord, readStorage, readStoredList, writeStorage } from "@/app/utils/browserStorage";

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  href: string;
  /** WooCommerce variation ID (needed to add the item to the WooCommerce cart). */
  variationId?: number;
  /** WooCommerce cart item key (set on items that are in the WooCommerce cart). */
  key?: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (item: Omit<CartItem, "quantity" | "key">, quantity: number) => Promise<void>;
  updateQuantity: (slug: string, size: string, quantity: number) => Promise<void>;
  removeItem: (slug: string, size: string) => Promise<void>;
  /** "woocommerce" when the basket is a WooCommerce cart; "local" when WooCommerce isn't configured. */
  mode: "woocommerce" | "local";
  /** True while a cart request is in flight. */
  pending: boolean;
  /** Last cart error (e.g. out of stock), for display. */
  error: string | null;
  clearError: () => void;
  /** WooCommerce checkout URL that carries this cart over; null when unavailable. */
  checkoutUrl: string | null;
  /** Go to WooCommerce checkout with the current cart. Returns false when that isn't available. */
  goToCheckout: () => boolean;
  /** Discount codes applied to the WooCommerce cart. */
  coupons: string[];
  /** Totals calculated by WooCommerce (null in local mode or before the cart loads). */
  totals: { subtotal: number; discount: number; total: number } | null;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: (code: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);
const LOCAL_CART_KEY = STORAGE_KEYS.cart;
// Same-origin proxy to the WooCommerce Store API (vercel.json in production, next.config.ts in dev), so the
// browser never makes a cross-site request (the store doesn't send CORS headers for this site).
const STORE_API = "/wc-store";
const CART_TOKEN_KEY = STORAGE_KEYS.cartToken;

// ── WooCommerce Store API (public, cookie-free via Cart-Token) ──
type StoreCartItem = {
  key: string;
  id: number;
  quantity: number;
  name: string;
  permalink: string;
  images: Array<{ src: string }>;
  variation: Array<{ attribute: string; value: string }>;
  prices: { price: string; currency_minor_unit: number };
};
type StoreCartTotals = { total_items: string; total_discount: string; total_price: string; currency_minor_unit: number };
type StoreCart = { items: StoreCartItem[]; coupons?: Array<{ code: string }>; totals?: StoreCartTotals };

/** WooCommerce messages arrive HTML-encoded (e.g. &quot;); show them as plain text. */
const decodeEntities = (text: string) =>
  text.replace(/&quot;|&#0?34;/g, '"').replace(/&#0?39;|&#8217;|&rsquo;/g, "’").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");

/** A stored basket line is only trusted when it has the fields the basket relies on. */
const isCartItem = (value: unknown): value is CartItem =>
  isRecord(value) &&
  typeof value.slug === "string" &&
  typeof value.size === "string" &&
  typeof value.name === "string" &&
  typeof value.price === "number" &&
  typeof value.quantity === "number" &&
  value.quantity > 0;

export function CartProvider({ children }: { children: ReactNode }) {
  const { storeUrl, getProduct, findByVariation } = useCatalog();
  const mode: CartContextValue["mode"] = storeUrl ? "woocommerce" : "local";
  const [items, setItems] = useState<CartItem[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartToken, setCartToken] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<string[]>([]);
  const [totals, setTotals] = useState<CartContextValue["totals"]>(null);
  const tokenRef = useRef<string | null>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  /** Map a WooCommerce cart into the site's cart items (names, images and links from the catalogue). */
  const fromStoreCart = useCallback(
    (cart: StoreCart): CartItem[] =>
      cart.items.map((item) => {
        const match = findByVariation(item.id);
        const size = (match?.size ?? item.variation[0]?.value ?? "").toLowerCase();
        const slug = match?.product.slug ?? item.permalink.split("/").filter(Boolean).pop() ?? String(item.id);
        return {
          key: item.key,
          variationId: item.id,
          slug,
          size,
          name: match?.product.shortName ?? item.name,
          image: match?.product.sizePricing?.[size]?.image ?? item.images[0]?.src ?? match?.product.image ?? "",
          price: Number(item.prices.price) / 10 ** item.prices.currency_minor_unit,
          quantity: item.quantity,
          href: `/collections/bedroom/mattresses/${slug}/`,
        };
      }),
    [findByVariation],
  );

  /** One Store API request at a time; keeps the Cart-Token current and the items in sync. */
  const storeRequest = useCallback(
    (path: string, body?: unknown) => {
      const run = async () => {
        setPending(true);
        try {
          // Trailing slash matches the site's trailingSlash setting; reads get a unique stamp so the host's
          // page cache (LiteSpeed) never serves a stale or someone else's cart.
          const url = `${STORE_API}${path}/${body === undefined ? `?_fresh=${Date.now()}` : ""}`;
          const response = await fetch(url, {
            method: body === undefined ? "GET" : "POST",
            headers: { "Content-Type": "application/json", ...(tokenRef.current ? { "Cart-Token": tokenRef.current } : {}) },
            body: body === undefined ? undefined : JSON.stringify(body),
          });
          const token = response.headers.get("Cart-Token");
          if (token && token !== tokenRef.current) {
            tokenRef.current = token;
            setCartToken(token);
            writeStorage(CART_TOKEN_KEY, token);
          }
          const data = await response.json().catch(() => null);
          if (!response.ok) throw new Error(data?.message ? decodeEntities(String(data.message).replace(/<[^>]+>/g, "")) : `Basket request failed (${response.status})`);
          const cart = data as StoreCart;
          setItems(fromStoreCart(cart));
          setCoupons((cart.coupons ?? []).map((coupon) => coupon.code));
          if (cart.totals) {
            const unit = 10 ** cart.totals.currency_minor_unit;
            setTotals({ subtotal: Number(cart.totals.total_items) / unit, discount: Number(cart.totals.total_discount) / unit, total: Number(cart.totals.total_price) / unit });
          }
          setError(null);
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "Something went wrong with your basket. Please try again.");
          throw caught;
        } finally {
          setPending(false);
        }
      };
      const next = queue.current.then(run, run);
      queue.current = next.catch(() => undefined);
      return next;
    },
    [fromStoreCart],
  );

  // Load: WooCommerce cart (moving any old browser-only basket into it), or the local basket.
  useEffect(() => {
    if (mode === "local") {
      setItems(readStoredList(LOCAL_CART_KEY, isCartItem));
      return;
    }
    tokenRef.current = readStorage(CART_TOKEN_KEY);
    setCartToken(tokenRef.current);
    const load = async () => {
      await storeRequest("/cart").catch(() => undefined);
      const legacy = readStoredList(LOCAL_CART_KEY, isCartItem);
      for (const item of legacy) {
        const variationId = item.variationId ?? getProduct(item.slug)?.sizePricing?.[item.size.toLowerCase()]?.variationId;
        if (variationId) await storeRequest("/cart/add-item", { id: variationId, quantity: item.quantity }).catch(() => undefined);
      }
      writeStorage(LOCAL_CART_KEY, null);
    };
    void load();
  }, [mode, storeRequest, getProduct]);

  // Local mode persists to browser storage.
  useEffect(() => {
    if (mode === "local") writeStorage(LOCAL_CART_KEY, JSON.stringify(items));
  }, [mode, items]);

  const value = useMemo<CartContextValue>(() => {
    const findItem = (slug: string, size: string) => items.find((item) => item.slug === slug && item.size === size);
    return {
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      mode,
      pending,
      error,
      clearError: () => setError(null),
      checkoutUrl: mode === "woocommerce" && cartToken && items.length ? `${storeUrl}/checkout/?session=${encodeURIComponent(cartToken)}` : null,
      goToCheckout: () => {
        // Reads the token ref (not state) so it works straight after an add, before React re-renders.
        if (mode !== "woocommerce" || !tokenRef.current) return false;
        window.location.assign(`${storeUrl}/checkout/?session=${encodeURIComponent(tokenRef.current)}`);
        return true;
      },
      coupons,
      totals,
      applyCoupon: async (code) => {
        const trimmed = code.trim();
        if (!trimmed) return;
        if (mode !== "woocommerce") {
          setError("Discount codes can be entered at checkout.");
          return;
        }
        await storeRequest("/cart/apply-coupon", { code: trimmed });
      },
      removeCoupon: async (code) => {
        if (mode === "woocommerce") await storeRequest("/cart/remove-coupon", { code });
      },
      addItem: async (item, quantity) => {
        const variationId = item.variationId ?? getProduct(item.slug)?.sizePricing?.[item.size.toLowerCase()]?.variationId;
        if (mode === "woocommerce" && variationId) {
          await storeRequest("/cart/add-item", { id: variationId, quantity });
          return;
        }
        setItems((current) => {
          const existing = current.find((entry) => entry.slug === item.slug && entry.size === item.size);
          return existing
            ? current.map((entry) => (entry === existing ? { ...entry, quantity: entry.quantity + quantity } : entry))
            : [...current, { ...item, quantity }];
        });
      },
      updateQuantity: async (slug, size, quantity) => {
        const item = findItem(slug, size);
        if (mode === "woocommerce" && item?.key) {
          await storeRequest("/cart/update-item", { key: item.key, quantity: Math.max(1, quantity) });
          return;
        }
        setItems((current) => current.map((entry) => (entry.slug === slug && entry.size === size ? { ...entry, quantity: Math.max(1, quantity) } : entry)));
      },
      removeItem: async (slug, size) => {
        const item = findItem(slug, size);
        if (mode === "woocommerce" && item?.key) {
          await storeRequest("/cart/remove-item", { key: item.key });
          return;
        }
        setItems((current) => current.filter((entry) => !(entry.slug === slug && entry.size === size)));
      },
    };
  }, [items, mode, pending, error, cartToken, storeUrl, storeRequest, getProduct, coupons, totals]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
