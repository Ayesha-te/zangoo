import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MattressCatalog } from "@/app/components/collections/MattressCatalog";
import { CollapsibleIntro } from "@/app/components/site/CollapsibleIntro";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { collectionCategories } from "@/app/data/home";
import { orthoMattressProducts } from "@/app/data/mattressProducts";
import { getSentencePreview } from "@/app/utils/collapsibleIntro";
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
  const intro =
    item.category.label === "Bedroom"
      ? `${item.group.label} sale products are available for enquiry now. Use this category page to compare the available product landing pages, review support details, and choose the mattress you want to ask about before opening a consultation.`
      : `${item.group.label} in the ${item.category.label} collection is being prepared for launch. This category page will hold product links, availability notes, and enquiry options when the range is ready.`;
  const introPreview = getSentencePreview(intro);
  const needFilters = [
    "Back Pain",
    "Side Sleepers",
    "Firm Support",
    "Couples",
    "Turnable / Double-Sided",
    "Stomach Sleepers",
    "Heavy Sleepers (90kg+)",
  ];
  const feelFilters = ["Medium to Firm", "Firm", "Extra Firm"];
  const sizeFilters = ["Single", "Double", "King", "Super King"];
  const mattressGuides = [
    {
      title: "What is an Orthopaedic Mattress?",
      text: "Learn how supportive mattress construction can reduce pressure points and help keep the back aligned.",
      href: "/blog/firm-mattress-for-back-pain-does-it-really-help/",
    },
    {
      title: "How to Choose the Right Mattress",
      text: "Compare firmness, sleeping position, and mattress build before choosing a product.",
      href: "/blog/",
    },
    {
      title: "Mattress Sizes Guide",
      text: "Check common UK sizes and choose the best fit for your room and bed frame.",
      href: "/collections/bedroom/mattresses/",
    },
    {
      title: "Care & Maintenance",
      text: "Simple guidance for keeping your mattress fresh, supportive, and lasting longer.",
      href: "/blog/",
    },
  ];
  const mattressFaqs = [
    "Does an orthopaedic mattress help with back pain?",
    "What type of mattress is best for side sleepers?",
    "What is the difference between orthopaedic and normal mattress?",
    "Is an orthopaedic mattress worth it?",
    "Which firmness level is right for me?",
    "How do I care for my orthopaedic mattress?",
  ];

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
          {isMattressRange ? (
            <div className={styles.categoryImageBanner} aria-label="Orthopaedic mattresses category image">
              <img
                src="/capri-ortho-mattress-bedroom-hero.webp"
                alt="Orthopaedic mattress styled in a bright bedroom"
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
            <Link className={styles.secondaryLink} href={item.category.href}>
              <span aria-hidden="true">&larr;</span>
              Back to {item.category.label}
            </Link>
          </div>
        </section>

        {isMattressRange ? (
          <MattressCatalog
            products={orthoMattressProducts}
            needFilters={needFilters}
            feelFilters={feelFilters}
            sizeFilters={sizeFilters}
          >
            <div className={styles.categoryGuides}>
              <div className={styles.supportHeading}>
                <h2>Related Guides &amp; Resources</h2>
                <Link href="/blog/">View all guides &rarr;</Link>
              </div>
              <div className={styles.guideGrid}>
                {mattressGuides.map((guide) => (
                  <Link href={guide.href} className={styles.guideCard} key={guide.title}>
                    <span aria-hidden="true">✦</span>
                    <strong>{guide.title}</strong>
                    <small>{guide.text}</small>
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.categoryFaqs}>
              <div className={styles.supportHeading}>
                <h2>Frequently Asked Questions</h2>
                <Link href="/faq/">View all FAQs &rarr;</Link>
              </div>
              <div className={styles.categoryFaqGrid}>
                {mattressFaqs.map((question) => (
                  <details className={styles.categoryFaqItem} key={question}>
                    <summary>{question}<span aria-hidden="true">+</span></summary>
                    <p>Our team can confirm the best option for your body type, sleep position, and delivery needs before you order.</p>
                  </details>
                ))}
              </div>
            </div>

            <div className={styles.categoryReviews}>
              <div className={styles.supportHeading}>
                <h2>What Our Customers Say</h2>
                <Link href="/#reviews">View all reviews &rarr;</Link>
              </div>
              <div className={styles.reviewMiniGrid}>
                {["Great support and really comfortable. Woke up without back pain.", "Excellent quality and very well made. You can feel the difference.", "Fast delivery and brilliant customer service. Highly recommend Zaango."].map((review, index) => (
                  <article className={styles.reviewMiniCard} key={review}>
                    <span aria-hidden="true">★★★★★</span>
                    <p>&ldquo;{review}&rdquo;</p>
                    <small>{["James, Manchester", "Sarah, Leeds", "David, Birmingham"][index]}</small>
                  </article>
                ))}
              </div>
            </div>
          </MattressCatalog>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
