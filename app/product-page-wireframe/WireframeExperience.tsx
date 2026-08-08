"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MattressProduct } from "@/app/data/mattressProducts";
import { orthoMattressProducts } from "@/app/data/mattressProducts";
import styles from "./productPageWireframe.module.css";

type WireframeExperienceProps = {
  product: MattressProduct;
  relatedProducts: MattressProduct[];
};

const benefits = [
  "Orthopaedic support",
  "Breathable fabric",
  "Pressure relief",
  "Spinal alignment",
  "Made in the UK",
];

const sizes = [
  { id: "single", label: "Single (90 x 190cm)", price: 299, compare: 349 },
  { id: "double", label: "Double (135 x 190cm)", price: 379, compare: 449 },
  { id: "king", label: "King (150 x 200cm)", price: 449, compare: 529 },
  { id: "super-king", label: "Super King (180 x 200cm)", price: 549, compare: 649 },
];

export function WireframeExperience({ product, relatedProducts }: WireframeExperienceProps) {
  const gallery = useMemo(
    () => (product.gallery?.length ? product.gallery : [{ src: product.image, alt: product.imageAlt }]),
    [product.gallery, product.image, product.imageAlt],
  );
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState("king");
  const [quantity, setQuantity] = useState(1);
  const [favourite, setFavourite] = useState(false);
  const [added, setAdded] = useState(false);
  const [compare, setCompare] = useState<Set<string>>(() => new Set([product.slug]));
  const [selectHint, setSelectHint] = useState("Select another product");

  const activeSize = sizes.find((item) => item.id === size) ?? sizes[2];
  const total = activeSize.price * quantity;
  const thumbnails = [...gallery, ...gallery].slice(0, 4);
  const comparisonItems = [
    { name: product.shortName, slug: product.slug, price: `£${activeSize.price}`, image: gallery[0] },
    {
      name: "Premium Hybrid Mattress",
      slug: "premium-hybrid-preview",
      price: "£649",
      image: { src: "/capri-ortho-mattress-product-cutout.webp", alt: "Hybrid mattress product view" },
    },
  ];

  const accordions = [
    { title: "Description", body: product.description },
    { title: "Features", body: product.features.map((feature) => feature.title).join(". ") },
    { title: "Benefits", body: product.bullets.join(". ") },
    {
      title: "Dimensions and Size Guide",
      body: "Single, Double, King and Super King sizes can be supported in this structure. The section is ready for a full size table later.",
    },
    {
      title: "Delivery and Returns",
      body: "Free UK delivery, clear support before purchase, and simple return guidance can be shown here.",
    },
  ];

  function toggleCompare(slug: string) {
    setCompare((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.kicker}>Product page wireframe preview</p>

      <section className={styles.topGrid} aria-labelledby="wireframe-title">
        <div className={styles.galleryCard}>
          <div className={styles.media}>
            <span className={styles.saleBadge}>-15%</span>
            <img src={gallery[activeImage]?.src ?? gallery[0].src} alt={gallery[activeImage]?.alt ?? gallery[0].alt} />
            <button className={styles.playButton} type="button" aria-label="Play product video">
              <span>&#9654;</span>
            </button>
            <button className={styles.view360} type="button">360&deg; View</button>
          </div>
          <div className={styles.thumbs} aria-label="Product image thumbnails">
            {thumbnails.map((image, index) => (
              <button
                className={index === activeImage ? styles.activeThumb : ""}
                type="button"
                key={`${image.src}-${index}`}
                aria-label={`View product image ${index + 1}`}
                aria-pressed={index === activeImage}
                onClick={() => setActiveImage(index)}
              >
                <img src={image.src} alt="" />
              </button>
            ))}
          </div>
        </div>

        <article className={styles.summaryCard}>
          <p className={styles.sku}>SKU: CAPRI-ORTHO-PREVIEW</p>
          <h1 id="wireframe-title">{product.name}</h1>
          <div className={styles.rating} aria-label="Rated 4.8 out of 5 from 358 reviews">
            <span>*****</span>
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
            <select value={size} onChange={(event) => setSize(event.target.value)}>
              {sizes.map((item) => (
                <option value={item.id} key={item.id}>{item.label}</option>
              ))}
            </select>
          </label>
          <div className={styles.qty}>
            <span>Quantity</span>
            <div>
              <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                -
              </button>
              <strong>{quantity}</strong>
              <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)}>
                +
              </button>
            </div>
          </div>
          <div className={styles.priceRow}>
            <strong>£{total}</strong>
            <span>£{activeSize.compare * quantity}.00</span>
            <em>You Save £{(activeSize.compare - activeSize.price) * quantity}</em>
          </div>
          <div className={styles.buyActions}>
            <button className={`${styles.addButton} ${added ? styles.addedButton : ""}`} type="button" onClick={() => setAdded(true)}>
              {added ? "Added to Basket" : "Add to Basket"}
            </button>
            <button
              className={`${styles.favoriteButton} ${favourite ? styles.favoriteActive : ""}`}
              type="button"
              aria-label="Add Capri Ortho Mattress to favourites"
              aria-pressed={favourite}
              onClick={() => setFavourite((value) => !value)}
            >
              &#9825;
            </button>
          </div>
          <button className={styles.buyButton} type="button">Buy Now</button>
          <small className={styles.stockNote}><span aria-hidden="true"></span>4 left in stock</small>
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
              <span aria-hidden="true">+</span>
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
            <span>*****</span>
            <small>358 reviews</small>
          </div>
          {["James T.", "Emma K.", "Michael L."].map((name) => (
            <article key={name}>
              <span>*****</span>
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
            <button
              className={`${styles.compareProduct} ${compare.has(item.slug) ? styles.compareActive : ""}`}
              type="button"
              key={item.name}
              aria-pressed={compare.has(item.slug)}
              onClick={() => toggleCompare(item.slug)}
            >
              <img src={item.image.src} alt={item.image.alt} />
              <strong>{item.name}</strong>
              <span>{item.price}</span>
            </button>
          ))}
          <button className={styles.selectProduct} type="button" onClick={() => setSelectHint("Product selector opened")}>{selectHint}</button>
          <ul role="list">
            {["Support & comfort", "Materials & layers", "Trial & warranty", "Delivery & returns"].map((item) => (
              <li key={item}>+ {item}</li>
            ))}
          </ul>
        </div>
        <button className={styles.compareButton} type="button">Compare Products ({compare.size})</button>
      </section>

      <ProductRail title="Related Products" products={relatedProducts} />
      <ProductRail title="Recently Viewed" products={[product, ...relatedProducts].slice(0, 5)} />
    </div>
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
            <small>{item.firmness} support</small>
            <span>{item.price.replace("From ", "").replace("\u00c2\u00a3", "\u00a3")}</span>
            <em>View Details</em>
          </Link>
        ))}
      </div>
    </section>
  );
}
