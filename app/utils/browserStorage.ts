// Browser storage for the site, in one place: key names, safe read/write, and the one-time move of the old
// "Furniture Co." keys (furnitureCo*, furniture-co-*) to the OrthoBedroom names. Every access is wrapped because
// storage can be missing or throw (private mode, blocked site data, full quota).

export const STORAGE_KEYS = {
  cart: "orthoBedroomCart",
  cartToken: "orthoBedroomCartToken",
  favorites: "orthoBedroomFavorites",
  reviews: "orthoBedroomCustomerReviews",
  recentlyViewed: "orthoBedroomRecentlyViewed",
  pendingSection: "orthoBedroomPendingSection",
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
type Area = "local" | "session";

// Old key → new key. "list" values must be a JSON array to be carried over; anything else is dropped as corrupt.
const LEGACY_KEYS: Array<{ area: Area; from: string; to: StorageKey; kind: "list" | "text" }> = [
  { area: "local", from: "furnitureCoCart", to: STORAGE_KEYS.cart, kind: "list" },
  { area: "local", from: "furnitureCoCartToken", to: STORAGE_KEYS.cartToken, kind: "text" },
  { area: "local", from: "furnitureCoFavorites", to: STORAGE_KEYS.favorites, kind: "list" },
  { area: "local", from: "furniture-co-customer-reviews", to: STORAGE_KEYS.reviews, kind: "list" },
  { area: "local", from: "furnitureCoRecentlyViewed", to: STORAGE_KEYS.recentlyViewed, kind: "list" },
  { area: "session", from: "furnitureCoPendingSection", to: STORAGE_KEYS.pendingSection, kind: "text" },
];

function storageArea(area: Area): Storage | null {
  try {
    return area === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function parseList(raw: string | null): unknown[] | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

let migrated = false;

/** Moves old-named keys to the new names once per page load. A new key that already has a value is never overwritten. */
function migrateLegacyKeys() {
  if (migrated || typeof window === "undefined") return;
  migrated = true;
  for (const { area, from, to, kind } of LEGACY_KEYS) {
    const storage = storageArea(area);
    if (!storage) continue;
    try {
      const old = storage.getItem(from);
      if (old === null) continue;
      const usable = kind === "list" ? parseList(old) !== null : old.trim() !== "";
      if (usable && storage.getItem(to) === null) storage.setItem(to, old);
      storage.removeItem(from);
    } catch {
      // Storage refused (e.g. full): leave the old key; the site just starts without it.
    }
  }
}

export function readStorage(key: StorageKey, area: Area = "local"): string | null {
  migrateLegacyKeys();
  try {
    return storageArea(area)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

/** Saves a value, or removes the key when value is null. Fails silently: the page keeps working without storage. */
export function writeStorage(key: StorageKey, value: string | null, area: Area = "local") {
  migrateLegacyKeys();
  try {
    const storage = storageArea(area);
    if (value === null) storage?.removeItem(key);
    else storage?.setItem(key, value);
  } catch {
    // Storage unavailable or full.
  }
}

/**
 * Reads a stored JSON list, keeping only entries that pass isItem. Corrupt data (bad JSON, not a list) is removed
 * and an empty list returned, so a damaged value can never break the page.
 */
export function readStoredList<T>(key: StorageKey, isItem: (value: unknown) => value is T): T[] {
  const raw = readStorage(key);
  if (raw === null) return [];
  const list = parseList(raw);
  if (!list) {
    writeStorage(key, null);
    return [];
  }
  return list.filter(isItem);
}

/** Same check as readStoredList for a raw value already read, without touching storage (safe during render). */
export function parseStoredList<T>(raw: string | null, isItem: (value: unknown) => value is T): T[] {
  return (parseList(raw) ?? []).filter(isItem);
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
