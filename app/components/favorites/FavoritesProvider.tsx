"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

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

const storageKey = "furnitureCoFavorites";
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setFavorites(JSON.parse(saved) as FavoriteItem[]);
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  const value = useMemo<FavoritesContextValue>(() => ({
    favorites,
    hydrated,
    isFavorite: (slug) => favorites.some((item) => item.slug === slug),
    toggleFavorite: (item) => {
      setFavorites((current) =>
        current.some((favorite) => favorite.slug === item.slug)
          ? current.filter((favorite) => favorite.slug !== item.slug)
          : [...current, item],
      );
    },
    removeFavorite: (slug) => setFavorites((current) => current.filter((item) => item.slug !== slug)),
  }), [favorites, hydrated]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}
