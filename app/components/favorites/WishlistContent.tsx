"use client";

import Link from "next/link";
import { formatGBP, getMattressProduct, getSizePricing } from "@/app/data/mattressProducts";
import { useCart } from "@/app/components/cart/CartProvider";
import { BagIcon, ProductFeatures, StockNote, TrashIcon } from "@/app/components/commerce/CommerceIcons";
import { RecommendationStrip } from "@/app/components/commerce/RecommendationStrip";
import { getFirmnessColor } from "@/app/utils/firmness";
import collectionStyles from "@/app/collections/collections.module.css";
import { FavoriteButton } from "./FavoriteButton";
import { useFavorites } from "./FavoritesProvider";

export function WishlistContent() {
  const { favorites, hydrated, removeFavorite } = useFavorites();
  const { addItem } = useCart();

  if (!hydrated) return <p aria-live="polite">Loading saved items...</p>;
  if (!favorites.length) return <div className="wishlist-empty"><p>You have not saved any pieces yet.</p></div>;

  return (
    <>
      <div className="commerce-count">{favorites.length} {favorites.length === 1 ? "item" : "items"}</div>
      <div className="commerce-list">
        {favorites.map((item) => {
          const product = getMattressProduct(item.slug);
          // Wishlist prices and adds the Double size.
          const pricing = getSizePricing(item.slug, "double");
          const price = pricing?.sale ?? Number(product?.price.replace(/[^0-9.]/g, "") || 0);
          const firmness = item.firmness || product?.firmness || "Medium to Firm";
          return <article className="commerce-item wishlist-item" key={item.slug}>
            <div className="commerce-item-media">
              <Link href={item.href} aria-label={`View ${item.name}`}><img src={item.image} alt="" /></Link>
              <span className={collectionStyles.saleBadge} style={{ backgroundColor: getFirmnessColor(firmness) }}>{firmness}</span>
              <FavoriteButton className={collectionStyles.heartBadge} activeClassName={collectionStyles.heartBadgeActive} item={item} />
            </div>
            <div className="commerce-item-copy"><h2><Link href={item.href}>{item.name}</Link></h2><p>Open Coil Spring Mattress</p><ProductFeatures turnable={product?.compareSpecs.turnable} /></div>
            <div className="commerce-item-price">
              <div className="commerce-price-row"><strong>{formatGBP(price)}</strong>{pricing ? <><del>RRP {formatGBP(pricing.regular)}</del><b>Save {formatGBP(pricing.saving)} ({pricing.percent}%)</b></> : null}</div>
              <StockNote count={product?.stockCount ?? 10} />
            </div>
            <div className="commerce-item-actions">
              <button className="btn btn-p" type="button" onClick={() => addItem({ slug: item.slug, name: item.name, image: item.image, price, size: "double", href: item.href }, 1)}><BagIcon />Add to basket</button>
              <button className="icon-button" type="button" aria-label={`Remove ${item.name} from favourites`} onClick={() => removeFavorite(item.slug)}><TrashIcon /></button>
            </div>
          </article>;
        })}
      </div>
      <RecommendationStrip exclude={favorites.map((item) => item.slug)} />
    </>
  );
}
