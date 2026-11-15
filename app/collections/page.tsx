import type { Metadata } from "next";
import Link from "next/link";
import { collectionCategories, collections } from "@/app/data/home";
import { getStoreCatalog } from "@/app/lib/woocommerce/catalog";
import { CollapsibleIntro } from "@/app/components/site/CollapsibleIntro";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { getSentencePreview } from "@/app/utils/collapsibleIntro";
import styles from "./collections.module.css";

/** Number of categories on a collection's page (e.g. Bedroom: Mattresses, Beds, Bedside Tables). */
function categoryCount(slug: string) {
  return collectionCategories.find((item) => item.href === `/collections/${slug}/`)?.groups.length ?? 0;
}

export const metadata: Metadata = {
  title: "Collections | OrthoBedroom",
  description: "Browse OrthoBedroom collections by room, including bedroom mattresses, living room furniture, dining pieces, and lighting.",
};

export default async function CollectionsPage() {
  // Counts come from the live catalogue and the menu data, so they stay right as products are added.
  const { products } = await getStoreCatalog();
  const intro = `Explore our furniture collections by room. Our Bedroom collection is live with ${products.length} UK-made orthopaedic and pocket spring mattresses in single, double and king sizes, while Dining, Lighting and Living Room collections are coming soon.`;
  const introPreview = getSentencePreview(intro);

  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Collections" }]} />
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="collections-title">
          <span>FURNITURE & MATTRESS COLLECTION</span>
          <h1 id="collections-title">Shop Furniture Collections by Room</h1>
          {introPreview.shouldCollapse ? (
            <CollapsibleIntro
              text={intro}
              classes={{
                collapsibleText: styles.collapsibleText,
                collapsiblePanel: styles.collapsiblePanel,
                collapsibleButton: styles.collapsibleButton,
                collapsiblePreview: styles.collapsiblePreview,
                collapsibleFull: styles.collapsibleFull,
              }}
            />
          ) : (
            <p>{intro}</p>
          )}
        </section>

        <section className={styles.grid} aria-label="Furniture collection categories">
          {collections.map((collection) => {
            const isLive = collection.name === "Bedroom";

            return (
              <article className={styles.card} id={collection.slug} key={collection.name}>
                <div className={styles.cardTop}>
                  <span className={isLive ? styles.liveBadge : styles.badge}>{collection.badge}</span>
                  <strong>{collection.name}</strong>
                  <p>{collection.description}</p>
                </div>
                <div className={styles.cardBottom}>
                  {isLive ? <><span>{categoryCount(collection.slug)} categories</span><Link href={`/collections/${collection.slug}/`} aria-label={`${collection.name} collection details`}>Explore Bedroom</Link></> : null}
                </div>
              </article>
            );
          })}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
