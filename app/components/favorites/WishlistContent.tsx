"use client";

import Link from "next/link";
import { getMattressProduct } from "@/app/data/mattressProducts";
import { useCart } from "@/app/components/cart/CartProvider";
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
          return <article className="commerce-item wishlist-item" key={item.slug}>
            <div className="commerce-item-image"><img src={item.image} alt="" /><span>{item.firmness || "Medium to Firm"}</span></div>
            <div className="commerce-item-copy"><h2>{item.name}</h2><p>Open Coil Spring Mattress</p><ul className="commerce-features"><li>↻ <span>Double-sided</span></li><li>✣ <span>Hand-tufted</span></li><li>■ <span>Wire edge</span></li><li>◇ <span>Approx. 26cm deep</span></li></ul></div>
            <div className="commerce-item-price"><strong>{item.price.replace("From ", "")}</strong><del>RRP {"\u00a3"}{price + 50}</del><b>Save {"\u00a3"}50 (15%)</b><span className={product && product.stockCount < 5 ? "stock low" : "stock"}>● {product && product.stockCount < 5 ? `Only ${product.stockCount} left in stock` : `${product?.stockCount || 10} in stock`}</span></div>
            <div className="commerce-item-actions"><button className="btn btn-p" type="button" onClick={() => addItem({ slug: item.slug, name: item.name, image: item.image, price, size: "Double", href: item.href }, 1)}>Add to basket</button><button className="icon-button" type="button" aria-label={`Remove ${item.name} from favourites`} onClick={() => removeFavorite(item.slug)}>⌫</button></div>
          </article>;
        })}
      </div>
      <RecommendationStrip exclude={favorites.map((item) => item.slug)} />
    </>
  );
}
