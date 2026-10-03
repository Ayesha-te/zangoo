import Link from "next/link";
import { orthoMattressProducts } from "@/app/data/mattressProducts";
import { HeartIcon } from "./CommerceIcons";

const recommendedSlugs = ["classic-ortho", "hampton-ortho", "deluxe-ortho", "capri-ortho-mattress"];

export function RecommendationStrip({ exclude = [] }: { exclude?: string[] }) {
  const products = recommendedSlugs
    .map((slug) => orthoMattressProducts.find((product) => product.slug === slug))
    .filter((product): product is (typeof orthoMattressProducts)[number] => Boolean(product))
    .filter((product) => !exclude.includes(product.slug));

  return (
    <section className="recommendations" aria-labelledby="recommendations-title">
      <div className="recommendations-heading"><h2 id="recommendations-title">You might also like</h2><Link href="/collections/bedroom/mattresses/">View all</Link></div>
      <div className="recommendations-grid">
        {products.map((product) => <Link className="recommendation-card" href={`/collections/bedroom/mattresses/${product.slug}/`} key={product.slug}><div className="recommendation-media"><img src={product.image} alt="" /><span aria-hidden="true"><HeartIcon /></span></div><strong>{product.shortName}</strong><small>{product.price}</small></Link>)}
      </div>
    </section>
  );
}
