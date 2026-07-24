import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { collectionCategories } from "@/app/data/home";
import { orthoMattressProducts } from "@/app/data/mattressProducts";
import styles from "../../collections.module.css";

type ProductPageProps = {
  params: Promise<{ slug: string; product: string }>;
};

function allProducts() {
  return collectionCategories.flatMap((category) =>
    category.groups.map((group) => ({
      category,
      group,
      slug: category.href.split("/").filter(Boolean).at(-1) ?? "",
      product: group.href.split("/").filter(Boolean).at(-1) ?? "",
    })),
  );
}

export function generateStaticParams() {
  return allProducts().map((item) => ({
    slug: item.slug,
    product: item.product,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, product } = await params;
  const item = allProducts().find((entry) => entry.slug === slug && entry.product === product);

  return {
    title: item ? `${item.group.label} | Furniture Co.` : "Furniture Collection | Furniture Co.",
    description: item ? `Browse ${item.group.label} in the ${item.category.label} collection.` : undefined,
  };
}

export default async function CollectionProductPage({ params }: ProductPageProps) {
  const { slug, product } = await params;
  const item = allProducts().find((entry) => entry.slug === slug && entry.product === product);

  if (!item) notFound();

  const isMattressRange = slug === "bedroom" && product === "mattresses";

  return (
    <>
      <SiteHeader />
      <Breadcrumbs
        items={[
          { label: "Collections", href: "/collections/" },
          { label: item.category.label, href: item.category.href },
          { label: item.group.label },
        ]}
      />
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="product-title">
          <span>{item.category.badge}</span>
          <h1 id="product-title">{item.group.label}</h1>
          <p>
            {item.category.label === "Bedroom"
              ? "Mattress sale products are available for enquiry now."
              : "This category is coming soon. Join the launch list for updates."}
          </p>
          <div className={styles.detailActions}>
            <Link className={styles.secondaryLink} href={item.category.href}>
              <span aria-hidden="true">←</span>
              Back to {item.category.label}
            </Link>
          </div>
        </section>
        {isMattressRange ? (
          <section className={styles.mattressGrid} aria-label="Orthopaedic mattress landing pages">
            {orthoMattressProducts.map((mattress) => (
              <Link
                className={styles.mattressCard}
                href={`/collections/bedroom/mattresses/${mattress.slug}/`}
                key={mattress.slug}
              >
                <span className={styles.mattressImage}>
                  <img src={mattress.image} alt="" />
                  <span className={styles.saleBadge}>Mattress Sale</span>
                </span>
                <span className={styles.mattressInfo}>
                  <strong>{mattress.shortName}</strong>
                  <span className={styles.mattressFeel}>{mattress.firmness} orthopaedic support</span>
                  <span className={styles.mattressPrice}>{mattress.price}</span>
                </span>
              </Link>
            ))}
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
