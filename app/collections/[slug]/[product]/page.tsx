import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { collectionCategories } from "@/app/data/home";
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
            <Link className={styles.primaryLink} href="/contact/">
              Contact Support
            </Link>
            <Link className={styles.secondaryLink} href={item.category.href}>
              Back to {item.category.label}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
