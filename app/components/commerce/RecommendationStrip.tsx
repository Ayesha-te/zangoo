"use client";

import Link from "next/link";
import { orthoMattressProducts } from "@/app/data/mattressProducts";
import { FavoriteButton } from "@/app/components/favorites/FavoriteButton";
import { useFavorites } from "@/app/components/favorites/FavoritesProvider";
import collectionStyles from "@/app/collections/collections.module.css";

const recommendedSlugs = ["classic-ortho", "hampton-ortho", "deluxe-ortho", "capri-ortho-mattress"];
const cleanPrice = (price: string) => price.replace("From ", "").replace("Â£", "£");

export function RecommendationStrip({ exclude = [] }: { exclude?: string[] }) {
  // Never recommend something the shopper has already saved to favourites.
  const { favorites } = useFavorites();
  const hidden = new Set([...exclude, ...favorites.map((item) => item.slug)]);
  const products = recommendedSlugs
    .map((slug) => orthoMattressProducts.find((product) => product.slug === slug))
    .filter((product): product is (typeof orthoMattressProducts)[number] => Boolean(product))
    .filter((product) => !hidden.has(product.slug));

  if (!products.length) return null;

  return (
    <section className="recommendations" aria-labelledby="recommendations-title">
      <div className="recommendations-heading"><h2 id="recommendations-title">You might also like</h2><Link className="shared-section-link" href="/collections/bedroom/mattresses/">View all</Link></div>
      <div className="recommendations-grid">
        {products.map((product) => {
          const href = `/collections/bedroom/mattresses/${product.slug}/`;
          return <div className="recommendation-card" key={product.slug}>
            <Link className="recommendation-link" href={href}><div className="recommendation-media"><img src={product.image} alt="" /></div><strong>{product.shortName}</strong><small>{product.price}</small></Link>
            <FavoriteButton className={collectionStyles.heartBadge} activeClassName={collectionStyles.heartBadgeActive} item={{ slug: product.slug, name: product.shortName, href, image: product.image, price: cleanPrice(product.price), firmness: product.firmness }} />
          </div>;
        })}
      </div>
    </section>
  );
}
