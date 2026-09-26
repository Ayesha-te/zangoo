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
      <span aria-hidden="true" data-active={active ? "true" : "false"}>
        {/* viewBox y of -2 optically centres the heart: its visual weight sits in the top lobes. Measured
            in-browser: visual centre within 0.1px (outline) / 0.2px (filled) of the circle centre. */}
        <svg viewBox="0 -2 24 24" focusable="false">
          <path d="M12 20.2s-6.9-4.3-9.2-8.1C.9 9 .9 5.5 3.3 3.7c2.1-1.6 5.1-.9 6.7 1.1L12 7.3l2-2.5c1.6-2 4.6-2.7 6.7-1.1 2.4 1.8 2.4 5.3.5 8.4-2.3 3.8-9.2 8.1-9.2 8.1Z" />
        </svg>
      </span>
    </button>
  );
}
