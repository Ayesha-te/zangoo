import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollapsibleIntro } from "@/app/components/site/CollapsibleIntro";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { collectionCategories, collections } from "@/app/data/home";
import { orthoMattressProducts } from "@/app/data/mattressProducts";
import { getSentencePreview } from "@/app/utils/collapsibleIntro";
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
    title: collection ? `${collection.name} Collection | OrthoBedroom` : "Collection | OrthoBedroom",
    description: collection?.description,
  };
}

export default async function CollectionDetailPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = collections.find((item) => item.slug === slug);

  if (!collection) notFound();

  const isLive = collection.name === "Bedroom";
  const isBedroom = collection.slug === "bedroom";
  const category = collectionCategories.find((item) => item.href === `/collections/${collection.slug}/`);
  const intro = `Shop our bedroom collection online, starting with four UK-made orthopaedic mattresses in medium-to-firm, firm and extra-firm feels. Choose from single, double and king sizes with free UK delivery, while additional bedroom collections including beds and bedside tables are coming soon.`;
  const introPreview = getSentencePreview(intro);

  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Collections", href: "/collections/" }, { label: collection.name }]} />
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="collection-title">
          <Link className={`${styles.categoryBackLink} ${styles.categoryForwardLink}`} href="/collections/">
            View All Collections
          </Link>
          <span>{collection.badge}</span>
          <h1 id="collection-title">{collection.name}</h1>
          {isBedroom ? (
            <div className={styles.categoryImageBanner} aria-label="Bedroom collection image">
              <img
                src="/bedroom category banner.webp"
                alt="Bedroom collection with mattresses and bedroom furniture"
              />
            </div>
          ) : null}
          {introPreview.shouldCollapse ? (
            <CollapsibleIntro
              text={intro}
              classes={{
                collapsibleText: styles.collapsibleText,
                collapsiblePanel: styles.collapsiblePanel,
                collapsibleButton: styles.collapsibleButton,
              }}
            />
          ) : (
            <p>{intro}</p>
          )}
          <div className={styles.detailActions}>
            <Link className={styles.primaryLink} href="/contact/">
              {isLive ? "Enquire About Mattress Sale" : "Join Launch List"}
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
                    {isMattresses ? (
                      <>
                        <Link className={styles.liveBadge} href={group.href}>Mattress Sale</Link>
                        <strong><Link className={styles.titleLink} href={group.href}>{group.label}</Link></strong>
                      </>
                    ) : (
                      <>
                        <span className={styles.badge}>Coming Soon</span>
                        <strong>{group.label}</strong>
                      </>
                    )}
                    <p>
                      {isMattresses
                        ? "Shop four UK-made orthopaedic mattresses in medium-to-firm, firm and extra-firm feels, available in single, double and king sizes."
                        : `${group.label} products are being prepared for launch.`}
                    </p>
                  </div>
                  {isMattresses ? <div className={styles.cardBottom}><span>{orthoMattressProducts.length} products live</span><Link href={group.href} aria-label={`View ${group.label} in ${collection.name}`}>Explore Mattresses</Link></div> : null}
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
