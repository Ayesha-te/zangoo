import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { collections } from "@/app/data/home";
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

  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Collections", href: "/collections/" }, { label: collection.name }]} />
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="collection-title">
          <span>{collection.badge}</span>
          <h1 id="collection-title">{collection.name}</h1>
          <p>{collection.description}</p>
          <div className={styles.detailActions}>
            <Link className={styles.primaryLink} href="/contact/">
              {isLive ? "Enquire About Mattress Sale" : "Join Launch List"}
            </Link>
            <Link className={styles.secondaryLink} href="/collections/">
              View All Collections
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
