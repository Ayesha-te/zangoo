import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MattressCatalog } from "@/app/components/collections/MattressCatalog";
import { CollapsibleIntro } from "@/app/components/site/CollapsibleIntro";
import { ProductFaq } from "@/app/components/site/ProductFaq";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { collectionCategories } from "@/app/data/home";
import { orthoMattressProducts } from "@/app/data/mattressProducts";
import { getStoreCatalog } from "@/app/lib/woocommerce/catalog";
import { getSentencePreview } from "@/app/utils/collapsibleIntro";
import { CustomerReviews } from "@/app/components/reviews/CustomerReviews";
import { customerReviews } from "@/app/data/customerReviews";
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
  // WooCommerce is the source of truth; the local catalogue is used until the category has products.
  const catalog = isMattressRange ? await getStoreCatalog() : null;
  const intro =
    item.category.label === "Bedroom"
      ? `Shop our focused range of UK-made orthopaedic mattresses in medium-to-firm, firm and extra-firm feels. Choose from single, double and king sizes, with open coil spring support and clearly listed mattress specifications.`
      : `${item.group.label} in the ${item.category.label} collection is being prepared for launch. This category page will hold product links, availability notes, and enquiry options when the range is ready.`;
  const introPreview = getSentencePreview(intro);
  const needFilters = [
    "Back Pain",
    "Side Sleepers",
    "Orthopaedic",
    "Non-orthopaedic",
    "Turnable / Double-Sided",
    "Stomach Sleepers",
    "Heavy Sleepers (90kg+)",
  ];
  const feelFilters = ["Medium to Firm", "Firm", "Extra Firm"];
  const sizeFilters = ["Single", "Double", "King"];
  const mattressGuides = [
    {
      title: "What is an Orthopaedic Mattress?",
      text: "Learn what “orthopaedic mattress” means, how these mattresses are constructed and what to compare before choosing one.",
      href: "/blog/what-is-an-orthopaedic-mattress/",
    },
    {
      title: "How to Choose the Best Orthopaedic Mattress in the UK",
      text: "Compare firmness, spring construction, mattress size, comfort layers and care requirements before choosing an orthopaedic mattress.",
      href: "/blog/how-to-choose-the-best-orthopaedic-mattress-in-the-uk/",
    },
    {
      title: "UK Mattress Sizes — the Full Chart, and the Four Traps Nobody Warns You About",
      text: "Compare UK mattress dimensions, including single, double and king sizes, and avoid common sizing mistakes before ordering.",
      href: "/blog/uk-mattress-sizes-the-full-chart-and-the-four-traps-nobody-warns-you-about/",
    },
    {
      title: "How to Care for an Orthopaedic Mattress: Flipping, Rotating and Making It Last",
      text: "Learn when to flip or rotate your mattress, how to protect it and how correct care can help it wear more evenly over time.",
      href: "/blog/how-to-care-for-an-orthopaedic-mattress-flipping-rotating-and-making-it-last/",
    },
  ];
  const mattressFaqs = [
    ["Does an orthopaedic mattress help with back pain?", "An orthopaedic mattress may improve comfort for some sleepers, but no mattress can be guaranteed to treat or relieve back pain. Comfort depends on mattress firmness, sleeping position, body weight and personal preference. If back pain is persistent, severe or accompanied by other symptoms, seek advice from a qualified healthcare professional."],
    ["What type of mattress is best for side sleepers?", "There is no single mattress firmness that is best for every side sleeper. Side sleepers generally need enough cushioning around the shoulder and hip while still feeling adequately supported, and body weight affects how firm a mattress feels. Compare medium-to-firm, firm and extra-firm options according to your own comfort preference rather than choosing by sleeping position alone."],
    ["What is the difference between orthopaedic and normal mattress?", "The main difference is that an orthopaedic mattress is typically designed and marketed around a firmer, more supportive feel, while a “normal mattress” can describe many firmness levels and constructions. “Orthopaedic” is not one specific material or spring system. Compare firmness, springs, fillings, depth and care requirements rather than relying on the label alone."],
    ["Is an orthopaedic mattress worth it?", "An orthopaedic mattress can be worth it if you prefer a firmer, more stable sleep surface and its construction suits your comfort needs. Compare firmness, mattress size, spring construction, care requirements and price before choosing. A firmer mattress is not automatically a better mattress, so personal comfort should remain the deciding factor."],
    ["Which firmness level is right for me?", "There is no single mattress firmness that is right for everyone. Choose medium-to-firm if you want support with some cushioning, firm if you prefer a more stable surface, and extra firm if you prefer minimal sink. Body weight, sleeping position and personal comfort can all change how firm a mattress feels."],
    ["Can I buy an orthopaedic mattress online in London?", "Yes. We are an online mattress retailer based in Ilford, London, and we do not operate a walk-in showroom or physical store. You can order our UK-made orthopaedic mattresses online in single, double and king sizes, with free UK delivery, 0% interest-free finance and a 1-year guarantee. Current prices, firmness levels, specifications and stock availability are shown on each product page."],
  ] as const;

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
          <Link className={styles.categoryBackLink} href={item.category.href}>
            Back to {item.category.label}
          </Link>
          <span>{item.category.badge}</span>
          <h1 id="product-title">{item.group.label}</h1>
          {isMattressRange ? (
            <div className={styles.categoryImageBanner} aria-label="Orthopaedic mattresses category image">
              <img
                src="/category page banner.jpeg"
                alt="UK-made orthopaedic mattresses displayed on divan beds in a bright bedroom"
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
        </section>

        {isMattressRange ? (
          <MattressCatalog
            products={catalog?.products ?? orthoMattressProducts}
            needFilters={needFilters}
            feelFilters={feelFilters}
            sizeFilters={sizeFilters}
            reviews={
              <CustomerReviews
                detachForm
                intro="Sort verified feedback or view reviews that include customer photos."
                reviews={customerReviews}
              />
            }
          >
            <div className={styles.categoryGuides}>
              <div className={styles.supportHeading}>
                <div>
                  <h2>Orthopaedic Mattress Buying Guides</h2>
                  <p>Practical guides to help you understand orthopaedic mattresses, choose the right firmness and size, and care for your mattress properly.</p>
                </div>
                <Link className="shared-section-link" href="/blog/">View All Mattress Guides</Link>
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
                <div>
                  <h2>Frequently Asked Questions</h2>
                  <p>Clear answers to common questions about orthopaedic mattresses, firmness, sleeping positions, back-pain considerations and mattress care.</p>
                </div>
                <Link className="shared-section-link" href="/faq/">View all FAQs</Link>
              </div>
              <ProductFaq faqs={mattressFaqs.map(([question, answer]) => ({ question, answer }))} />
            </div>
          </MattressCatalog>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
