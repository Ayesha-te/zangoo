"use client";

import Link from "next/link";
import { useFavorites } from "./FavoritesProvider";

export function WishlistContent() {
  const { favorites, hydrated, removeFavorite } = useFavorites();

  if (!hydrated) return <p aria-live="polite">Loading saved items...</p>;
  if (!favorites.length) {
    return (
      <div className="wishlist-empty">
        <p>You have not saved any pieces yet.</p>
        <Link className="btn btn-p" href="/collections/bedroom/mattresses/">Browse mattresses</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-grid">
      {favorites.map((item) => (
        <article className="wishlist-card" key={item.slug}>
          <div className="wishlist-media">
            <img src={item.image} alt="" />
            <span className="wishlist-firmness-badge">{item.firmness || "Medium to Firm"}</span>
            <span className="wishlist-heart" aria-hidden="true">♡</span>
          </div>
          <div>
            <span className="wishlist-firmness">{item.firmness || "Medium to Firm"}</span>
            <h2>{item.name}</h2>
            <strong>{item.price.startsWith("From") ? item.price : `From ${item.price}`}</strong>
            <div className="wishlist-actions">
              <Link href={item.href}>View item</Link>
              <button type="button" onClick={() => removeFavorite(item.slug)}>Remove</button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
