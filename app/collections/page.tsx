import type { Metadata } from "next";
import Link from "next/link";
import { collections } from "@/app/data/home";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import styles from "./collections.module.css";

export const metadata: Metadata = {
  title: "Furniture Collections | Furniture Co.",
  description: "Browse Furniture Co. collections by room, including bedroom mattresses, living room furniture, dining pieces, and lighting.",
};

export default function CollectionsPage() {
  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Collections" }]} />
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="collections-title">
          <span>Furniture Collections</span>
          <h1 id="collections-title">Shop furniture by room.</h1>
          <details className={styles.collapsibleText}>
            <summary>
              <span className={styles.showMoreText}>Show more</span>
              <span className={styles.showLessText}>Show less</span>
            </summary>
            <p>
              Explore the main Furniture Co. categories with clear status labels. Bedroom mattresses are currently on sale,
              while other room collections are being prepared for launch.
            </p>
          </details>
        </section>

        <section className={styles.grid} aria-label="Furniture collection categories">
          {collections.map((collection) => {
            const isLive = collection.name === "Bedroom";

            return (
              <article className={styles.card} id={collection.slug} key={collection.name}>
                <div className={styles.cardTop}>
                  <span className={isLive ? styles.liveBadge : styles.badge}>{collection.badge}</span>
                  <strong>{collection.name}</strong>
                  <details className={styles.collapsibleText}>
                    <summary>
                      <span className={styles.showMoreText}>Show more</span>
                      <span className={styles.showLessText}>Show less</span>
                    </summary>
                    <p>{collection.description}</p>
                  </details>
                </div>
                <div className={styles.cardBottom}>
                  <span>{collection.count}</span>
                  <Link href={`/collections/${collection.slug}/`} aria-label={`${collection.name} collection details`}>
                    {isLive ? "Enquire Now" : "Coming Soon"}
                  </Link>
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
