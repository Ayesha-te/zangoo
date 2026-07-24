import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { collectionCategories, collections } from "@/app/data/home";
import { orthoMattressProducts } from "@/app/data/mattressProducts";
import styles from "../collections.module.css";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return collections.map((collection) => ({
    slug: collection.slug,
  }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = collections.find((item) => item.slug === slug);

  return {
    title: collection ? `${collection.name} Collection | Furniture Co.` : "Collection | Furniture Co.",
    description: collection?.description,
  };
}

export default async function CollectionDetailPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = collections.find((item) => item.slug === slug);

  if (!collection) notFound();

  const isLive = collection.name === "Bedroom";
  const category = collectionCategories.find((item) => item.href === `/collections/${collection.slug}/`);
  const shouldCollapseIntro = collection.description.length > 140;

  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Collections", href: "/collections/" }, { label: collection.name }]} />
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="collection-title">
          <span>{collection.badge}</span>
          <h1 id="collection-title">{collection.name}</h1>
          {shouldCollapseIntro ? (
            <details className={styles.collapsibleText}>
              <summary>
                <span className={styles.showMoreText}>Show more</span>
                <span className={styles.showLessText}>Show less</span>
              </summary>
              <p>{collection.description}</p>
            </details>
          ) : (
            <p>{collection.description}</p>
          )}
          <div className={styles.detailActions}>
            <Link className={styles.primaryLink} href="/contact/">
              {isLive ? "Enquire About Mattress Sale" : "Join Launch List"}
            </Link>
            <Link className={styles.secondaryLink} href="/collections/">
              View All Collections
            </Link>
          </div>
        </section>

        {category ? (
          <section className={styles.grid} aria-label={`${collection.name} subcategories`}>
            {category.groups.map((group) => {
              const isMattresses = group.href === "/collections/bedroom/mattresses/";

              return (
                <article className={styles.card} key={group.label}>
                  <div className={styles.cardTop}>
                    <span className={isMattresses ? styles.liveBadge : styles.badge}>
                      {isMattresses ? "Mattress Sale" : "Coming Soon"}
                    </span>
                    <strong>{group.label}</strong>
                    <p>
                      {isMattresses
                        ? "Orthopaedic mattress sale products are available now with individual landing pages."
                        : `${group.label} products are being prepared for launch.`}
                    </p>
                  </div>
                  <div className={styles.cardBottom}>
                    <span>{isMattresses ? `${orthoMattressProducts.length} products live` : "Launching soon"}</span>
                    <Link href={group.href} aria-label={`View ${group.label} in ${collection.name}`}>
                      {isMattresses ? "View Mattresses" : "View Category"}
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        ) : null}

      </main>
      <SiteFooter />
    </>
  );
}
