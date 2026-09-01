"use client";

import type { FavoriteItem } from "./FavoritesProvider";
import { useFavorites } from "./FavoritesProvider";

type FavoriteButtonProps = {
  item: FavoriteItem;
  className?: string;
  activeClassName?: string;
};

export function FavoriteButton({ item, className, activeClassName }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(item.slug);

  return (
    <button
      type="button"
      className={[className, active ? activeClassName : ""].filter(Boolean).join(" ")}
      aria-label={`${active ? "Remove" : "Add"} ${item.name} ${active ? "from" : "to"} favourites`}
      aria-pressed={active}
      onClick={() => toggleFavorite(item)}
    >
      <span aria-hidden="true">{active ? "\u2665" : "\u2661"}</span>
    </button>
  );
}
