"use client";

import Link from "next/link";
import { getMattressProduct } from "@/app/data/mattressProducts";
import { useCart } from "@/app/components/cart/CartProvider";
import { BagIcon, HeartIcon, ProductFeatures, TrashIcon } from "@/app/components/commerce/CommerceIcons";
import { RecommendationStrip } from "@/app/components/commerce/RecommendationStrip";
import { useFavorites } from "./FavoritesProvider";

export function WishlistContent() {
  const { favorites, hydrated, removeFavorite } = useFavorites();
  const { addItem } = useCart();

  if (!hydrated) return <p aria-live="polite">Loading saved items...</p>;
  if (!favorites.length) return <div className="wishlist-empty"><p>You have not saved any pieces yet.</p><Link className="btn btn-p" href="/collections/bedroom/mattresses/">Browse mattresses</Link></div>;

  return (
    <>
      <div className="commerce-count">{favorites.length} {favorites.length === 1 ? "item" : "items"}</div>
      <div className="commerce-list">
        {favorites.map((item) => {
          const product = getMattressProduct(item.slug);
          const price = Number(product?.price.match(/\d+/)?.[0] || 0);
          const stock = product?.stockCount ?? 10;
          const lowStock = stock < 5;
          return <article className="commerce-item wishlist-item" key={item.slug}>
            <div className="commerce-item-media">
              <Link href={item.href} aria-label={`View ${item.name}`}><img src={item.image} alt="" /></Link>
              <span className="commerce-badge">{item.firmness || product?.firmness || "Medium to Firm"}</span>
              <span className="commerce-size">Double</span>
              <button className="commerce-heart" type="button" aria-label={`Remove ${item.name} from favourites`} onClick={() => removeFavorite(item.slug)}><HeartIcon /></button>
            </div>
            <div className="commerce-item-copy"><h2><Link href={item.href}>{item.name}</Link></h2><p>Open Coil Spring Mattress</p><ProductFeatures /></div>
            <div className="commerce-item-price">
              <div className="commerce-price-row"><strong>{"£"}{price}</strong><del>RRP {"£"}{(price + 50).toFixed(2)}</del><b>Save {"£"}50 (15%)</b></div>
              <p className={lowStock ? "stock low" : "stock"}><i aria-hidden="true" />{lowStock ? `Only ${stock} left in stock` : `${stock} in stock`}</p>
              {lowStock ? <small className="stock-note">Selling fast — order soon</small> : null}
            </div>
            <div className="commerce-item-actions">
              <button className="btn btn-p" type="button" onClick={() => addItem({ slug: item.slug, name: item.name, image: item.image, price, size: "Double", href: item.href }, 1)}><BagIcon />Add to basket</button>
              <button className="icon-button" type="button" aria-label={`Remove ${item.name} from favourites`} onClick={() => removeFavorite(item.slug)}><TrashIcon /></button>
            </div>
          </article>;
        })}
      </div>
      <RecommendationStrip exclude={favorites.map((item) => item.slug)} />
    </>
  );
}
