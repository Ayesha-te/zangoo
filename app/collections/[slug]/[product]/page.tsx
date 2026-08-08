import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  const needFilters = ["Back Pain", "Side Sleepers", "Firm Support", "Couples"];
  const feelFilters = ["Soft", "Medium", "Firm"];
  const sizeFilters = ["Single", "Double", "King", "Super King"];
  const cleanPrice = (price: string) => price.replace("From ", "").replace("\u00c2\u00a3", "\u00a3");

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
          <div className={styles.mattressLayout}>
            <aside className={styles.filterSidebar} aria-label="Mattress filters">
              <div className={styles.filterHead}>
                <strong>Filter by</strong>
                <button type="button">Clear all</button>
              </div>

              <div className={styles.filterGroup}>
                <strong>Shop by Need</strong>
                {needFilters.map((filter, index) => (
                  <label className={styles.filterOption} key={filter}>
                    <input type="checkbox" defaultChecked={index === 0} />
                    <span>{filter}</span>
                  </label>
                ))}
              </div>

              <div className={styles.filterGroup}>
                <strong>Feel</strong>
                {feelFilters.map((filter, index) => (
                  <label className={styles.filterOption} key={filter}>
                    <input type="checkbox" defaultChecked={index === 1} />
                    <span>{filter}</span>
                  </label>
                ))}
              </div>

              <div className={styles.filterGroup}>
                <strong>Size</strong>
                {sizeFilters.map((filter, index) => (
                  <label className={styles.filterOption} key={filter}>
                    <input type="checkbox" defaultChecked={index === 2} />
                    <span>{filter}</span>
                  </label>
                ))}
              </div>

              <div className={styles.helpBox}>
                <strong>Need help choosing?</strong>
                <p>Our sleep experts can help you find the right mattress.</p>
                <Link href="/contact/">Contact Us</Link>
              </div>
            </aside>

            <section className={styles.mattressResults} aria-label="Orthopaedic mattress results">
              <div className={styles.mattressToolbar}>
                <strong>{orthoMattressProducts.length} Mattresses</strong>
                <span>Made in the UK</span>
                <span>Free UK Delivery</span>
                <span>0% Finance</span>
                <span>1-Year Guarantee</span>
                <label>
                  Sort
                  <select defaultValue="best-selling">
                    <option value="best-selling">Best selling</option>
                    <option value="price-low">Price low to high</option>
                    <option value="firmness">Firmness</option>
                  </select>
                </label>
                <button type="button">Compare (0)</button>
              </div>

              <div className={styles.mattressGrid}>
                {orthoMattressProducts.map((mattress) => (
                  <article className={styles.mattressCard} key={mattress.slug}>
                    <Link
                      className={styles.mattressMainLink}
                      href={`/collections/bedroom/mattresses/${mattress.slug}/`}
                    >
                      <span className={styles.mattressImage}>
                        <img src={mattress.gallery?.[1]?.src ?? mattress.image} alt="" />
                        <span className={styles.saleBadge}>{mattress.firmness}</span>
                      </span>
                      <span className={styles.mattressInfo}>
                        <strong>{mattress.shortName}</strong>
                        <span className={styles.mattressFeel}>Open Coil Spring Mattress</span>
                        <span className={styles.mattressSpecs}>
                          <span>Double-sided</span>
                          <span>Hand-tufted</span>
                          <span>Wire edge</span>
                          <span>Approx. 26cm deep</span>
                        </span>
                        <span className={styles.mattressRating}>
                          <span aria-hidden="true">*****</span>
                          <b>4.8</b>
                          <small>(27 reviews)</small>
                        </span>
                        <span className={styles.deliveryNote}>In stock - Free delivery from Tomorrow</span>
                        <span className={styles.mattressPrice}>
                          {cleanPrice(mattress.price)}
                          <small>RRP {"\u00a3"}249.00 <b>Save {"\u00a3"}50 (15%)</b></small>
                        </span>
                        <span className={styles.mattressButton}>View Mattress <span aria-hidden="true">&rsaquo;</span></span>
                      </span>
                    </Link>
                    <button className={styles.heartButton} type="button" aria-label={`Add ${mattress.shortName} to favourites`}>
                      &#9825;
                    </button>
                    <label className={styles.compareCheck}>
                      <input type="checkbox" />
                      <span>Add to compare</span>
                    </label>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
