"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { STORAGE_KEYS, isRecord, parseStoredList, readStorage, writeStorage } from "@/app/utils/browserStorage";

export type FavoriteItem = {
  slug: string;
  name: string;
  href: string;
  image: string;
  price: string;
  firmness?: string;
};

type FavoritesContextValue = {
  favorites: FavoriteItem[];
  hydrated: boolean;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  removeFavorite: (slug: string) => void;
};

const storageKey = STORAGE_KEYS.favorites;
const isFavoriteItem = (value: unknown): value is FavoriteItem =>
  isRecord(value) && typeof value.slug === "string" && typeof value.name === "string" && typeof value.href === "string";
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

// Favourites live in browser storage and are read with useSyncExternalStore: the server (and hydration) render
// sees null, the browser then reads storage, so the HTML matches and no effect has to copy storage into state.
// The last saved value is also kept in memory so favourites still work this visit when storage is blocked.
let savedThisVisit: string | null = null;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Another tab changed favourites: show its list.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey) return;
    savedThisVisit = null;
    onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}
const getSnapshot = () => savedThisVisit ?? readStorage(storageKey) ?? "[]";
const getServerSnapshot = () => null;

function saveFavorites(next: FavoriteItem[]) {
  savedThisVisit = JSON.stringify(next);
  writeStorage(storageKey, savedThisVisit);
  listeners.forEach((listener) => listener());
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = stored !== null;
  const favorites = useMemo(() => parseStoredList(stored, isFavoriteItem), [stored]);

  const value = useMemo<FavoritesContextValue>(() => {
    // Always start from the latest saved list, so quick repeated clicks never work from a stale copy.
    const current = () => parseStoredList(getSnapshot(), isFavoriteItem);
    return {
      favorites,
      hydrated,
      isFavorite: (slug) => favorites.some((item) => item.slug === slug),
      toggleFavorite: (item) => {
        const list = current();
        saveFavorites(list.some((favorite) => favorite.slug === item.slug) ? list.filter((favorite) => favorite.slug !== item.slug) : [...list, item]);
      },
      removeFavorite: (slug) => saveFavorites(current().filter((item) => item.slug !== slug)),
    };
  }, [favorites, hydrated]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}
