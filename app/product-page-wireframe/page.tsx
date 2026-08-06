import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { getMattressProduct, orthoMattressProducts } from "@/app/data/mattressProducts";
import styles from "./productPageWireframe.module.css";

export const metadata: Metadata = {
  title: "Product Page Wireframe Preview | Furniture Co.",
  description: "Standalone product page wireframe preview for a mattress product layout.",
};

const product = getMattressProduct("capri-ortho-mattress") ?? orthoMattressProducts[0];

const relatedProducts = orthoMattressProducts.filter((item) => item.slug !== product.slug).slice(0, 4);
const cleanPrice = product.price.replace("From ", "").replace("Â£", "£");

const gallery = product.gallery?.length
  ? product.gallery
  : [{ src: product.image, alt: product.imageAlt }];

const benefits = [
  "Orthopaedic support",
  "Breathable fabric",
  "Pressure relief",
  "Spinal alignment",
  "Made in the UK",
];

const accordions = [
  {
    title: "Description",
    body: product.description,
  },
  {
    title: "Features",
    body: product.features.map((feature) => feature.title).join(". "),
  },
  {
    title: "Benefits",
    body: product.bullets.join(". "),
  },
  {
    title: "Dimensions and Size Guide",
    body: "Single, Double, King and Super King sizes can be supported in this structure. The section is ready for a full size table later.",
  },
  {
    title: "Delivery and Returns",
    body: "Free UK delivery, clear support before purchase, and simple return guidance can be shown here.",
  },
];

const comparisonItems = [
  { name: product.shortName, price: cleanPrice, image: gallery[0] },
  {
    name: "Premium Hybrid Mattress",
    price: "£649",
    image: { src: "/capri-ortho-mattress-product-cutout.webp", alt: "Hybrid mattress product view" },
  },
];

export default function ProductPageWireframe() {
  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <div className={styles.wrap}>
          <p className={styles.kicker}>Product page wireframe preview</p>

          <section className={styles.topGrid} aria-labelledby="wireframe-title">
            <div className={styles.galleryCard}>
              <div className={styles.media}>
                <span className={styles.saleBadge}>-15%</span>
                <img src={gallery[0].src} alt={gallery[0].alt} />
                <button className={styles.playButton} type="button" aria-label="Play product video">
                  <span>▶</span>
                </button>
                <button className={styles.view360} type="button">360° View</button>
              </div>
              <div className={styles.thumbs} aria-label="Product image thumbnails">
                {[...gallery, ...gallery].slice(0, 4).map((image, index) => (
                  <button type="button" key={`${image.src}-${index}`} aria-label={`View product image ${index + 1}`}>
                    <img src={image.src} alt="" />
                  </button>
                ))}
              </div>
            </div>

            <article className={styles.summaryCard}>
              <p className={styles.sku}>SKU: CAPRI-ORTHO-PREVIEW</p>
              <h1 id="wireframe-title">{product.name}</h1>
              <div className={styles.rating} aria-label="Rated 4.8 out of 5 from 358 reviews">
                <span>★★★★★</span>
                <strong>4.8</strong>
                <small>(358 reviews)</small>
              </div>
              <p>{product.description}</p>
              <h2>Features You Will Love</h2>
              <ul className={styles.benefits} role="list">
                {benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </article>

            <aside className={styles.buyCard} aria-label="Product purchase options">
              <label>
                Size
                <select defaultValue="king">
                  <option value="single">Single (90 x 190cm)</option>
                  <option value="double">Double (135 x 190cm)</option>
                  <option value="king">King (150 x 200cm)</option>
                  <option value="super-king">Super King (180 x 200cm)</option>
                </select>
              </label>
              <div className={styles.qty}>
                <span>Quantity</span>
                <div>
                  <button type="button" aria-label="Decrease quantity">−</button>
                  <strong>1</strong>
                  <button type="button" aria-label="Increase quantity">+</button>
                </div>
              </div>
              <div className={styles.priceRow}>
                <strong>{cleanPrice}</strong>
                <span>£879.00</span>
                <em>You Save £130</em>
              </div>
              <button className={styles.addButton} type="button">Add to Basket</button>
              <button className={styles.buyButton} type="button">Buy Now</button>
              <small>4 left in stock</small>
            </aside>
          </section>

          <section className={styles.detailGrid} aria-label="Product details">
            <div className={styles.accordionCard}>
              {accordions.map((item) => (
                <details key={item.title}>
                  <summary>{item.title}</summary>
                  <p>{item.body}</p>
                </details>
              ))}
            </div>

            <div className={styles.trustStrip} role="list">
              {["100-night sleep trial", "10-year warranty", "Free delivery", "Free returns"].map((item) => (
                <article key={item} role="listitem">
                  <span aria-hidden="true">✓</span>
                  <strong>{item}</strong>
                  <small>Clear support included</small>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.textInsert} aria-labelledby="insert-title">
            <p className={styles.kicker}>Flexible content section</p>
            <h2 id="insert-title">Space for SEO text, internal links, or buying guidance.</h2>
            <p>
              This compact section can hold extra copy between the core product details and lower-page modules without pushing the main purchase controls too far down.
            </p>
          </section>

          <section className={styles.reviews} aria-labelledby="reviews-title">
            <h2 id="reviews-title">Customer Reviews</h2>
            <div className={styles.reviewGrid}>
              <div className={styles.score}>
                <strong>4.8</strong>
                <span>★★★★★</span>
                <small>358 reviews</small>
              </div>
              {["James T.", "Emma K.", "Michael L."].map((name) => (
                <article key={name}>
                  <span>★★★★★</span>
                  <strong>{name}</strong>
                  <small>Verified buyer</small>
                  <p>Comfortable support and a simple buying process.</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.faq} aria-labelledby="faq-title">
            <h2 id="faq-title">FAQ</h2>
            <div>
              {product.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
              <Link href="/faq/">View all FAQs</Link>
            </div>
          </section>

          <section className={styles.compare} aria-labelledby="compare-title">
            <h2 id="compare-title">Compare</h2>
            <div className={styles.compareGrid}>
              {comparisonItems.map((item) => (
                <article key={item.name}>
                  <img src={item.image.src} alt={item.image.alt} />
                  <strong>{item.name}</strong>
                  <span>{item.price}</span>
                </article>
              ))}
              <button type="button">Select another product</button>
              <ul role="list">
                {["Support & comfort", "Materials & layers", "Trial & warranty", "Delivery & returns"].map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
            </div>
          </section>

          <ProductRail title="Related Products" products={relatedProducts} />
          <ProductRail title="Recently Viewed" products={[product, ...relatedProducts].slice(0, 5)} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function ProductRail({ title, products }: { title: string; products: typeof orthoMattressProducts }) {
  return (
    <section className={styles.rail} aria-labelledby={`${title.toLowerCase().replace(/\s+/g, "-")}-title`}>
      <h2 id={`${title.toLowerCase().replace(/\s+/g, "-")}-title`}>{title}</h2>
      <div>
        {products.map((item) => (
          <Link href={`/collections/bedroom/mattresses/${item.slug}/`} key={item.slug}>
            <img src={item.gallery?.[1]?.src ?? item.image} alt={item.imageAlt} />
            <strong>{item.shortName}</strong>
            <span>{item.price.replace("From ", "").replace("Â£", "£")}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
