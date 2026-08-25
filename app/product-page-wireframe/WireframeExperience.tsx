"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { MattressProduct } from "@/app/data/mattressProducts";
import { orthoMattressProducts } from "@/app/data/mattressProducts";
import { MattressCompareModal } from "@/app/components/collections/MattressCompareModal";
import { FirmnessBar } from "@/app/components/collections/FirmnessBar";
import { FavoriteButton } from "@/app/components/favorites/FavoriteButton";
import { CustomerReviews } from "@/app/components/reviews/CustomerReviews";
import styles from "./productPageWireframe.module.css";

type WireframeExperienceProps = {
  product: MattressProduct;
  relatedProducts: MattressProduct[];
  isPreview?: boolean;
};

const SIZE_TIERS = [
  { id: "single", label: "Single (90 x 190cm)", multiplier: 1 },
  { id: "double", label: "Double (135 x 190cm)", multiplier: 1.13 },
  { id: "king", label: "King (150 x 200cm)", multiplier: 1.27 },
  { id: "super-king", label: "Super King (180 x 200cm)", multiplier: 1.47 },
];

function buildSizes(product: MattressProduct) {
  const basePrice = Number(product.price.replace(/[^0-9]/g, "")) || 499;

  return SIZE_TIERS.map((tier) => {
    const price = Math.round((basePrice * tier.multiplier) / 10) * 10;
    const compare = Math.round(price / 0.85 / 10) * 10;
    return { id: tier.id, label: tier.label, price, compare };
  });
}

function getStockState(count: number) {
  if (count <= 0) {
    return { label: "Out of stock", sub: null, className: styles.stockOut, pulse: false };
  }
  if (count === 1) {
    return { label: "Last one — hurry!", sub: "Once it's gone, it's gone", className: styles.stockLast, pulse: true };
  }
  if (count <= 5) {
    return { label: `Only ${count} left in stock`, sub: "Selling fast — order soon", className: styles.stockLow, pulse: true };
  }
  return { label: `${count} in stock`, sub: null, className: styles.stockOk, pulse: false };
}

export function WireframeExperience({ product, relatedProducts, isPreview = true }: WireframeExperienceProps) {
  const gallery = useMemo(
    () => (product.gallery?.length ? product.gallery : [{ src: product.image, alt: product.imageAlt }]),
    [product.gallery, product.image, product.imageAlt],
  );
  const sizes = useMemo(() => buildSizes(product), [product]);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState("king");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [comparisonSlug, setComparisonSlug] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const activeSize = sizes.find((item) => item.id === size) ?? sizes[2];
  const total = activeSize.price * quantity;
  const thumbnails = gallery.slice(0, 4);
  const comparisonProduct = relatedProducts.find((item) => item.slug === comparisonSlug) ?? null;
  const stockState = getStockState(product.stockCount);

  function chooseComparison(slug: string) {
    setComparisonSlug(slug);
    setPickerOpen(false);
  }

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

  return (
    <div className={styles.wrap}>
      {isPreview ? <p className={styles.kicker}>Product page wireframe preview</p> : null}

      <section className={styles.topGrid} aria-labelledby="wireframe-title">
        <div className={styles.leftColumn}>
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

          <div className={styles.accordionCard} aria-label="Product information">
            {accordions.map((item) => (
              <details key={item.title}>
                <summary>{item.title}</summary>
                <p>{item.body}</p>
              </details>
            ))}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <article className={styles.summaryCard}>
          <p className={styles.sku}>SKU: {product.slug.toUpperCase()}</p>
          <h1 id="wireframe-title">{product.name}</h1>
          <FirmnessBar firmness={product.firmness} />
          <Link className={styles.rating} href="#reviews" aria-label="Rated 4.8 out of 5. Read 358 reviews">
            <span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <strong>4.8</strong>
            <small>(358 reviews)</small>
          </Link>
          <p>{product.description}</p>
          <h2>Features You Will Love</h2>
          <ul className={styles.benefits} role="list">
            {product.bullets.map((benefit) => (
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
            <FavoriteButton
              className={styles.favoriteButton}
              activeClassName={styles.favoriteActive}
              item={{ slug: product.slug, name: product.shortName, href: `/collections/bedroom/mattresses/${product.slug}/`, image: gallery[0].src, price: product.price, firmness: product.firmness }}
            />
          </div>
          <button className={styles.buyButton} type="button">Buy Now</button>
          <small className={`${styles.stockNote} ${stockState.className}`}>
            <span className={stockState.pulse ? styles.stockDotPulse : undefined} aria-hidden="true" />
            {stockState.label}
            {stockState.sub ? <em>{stockState.sub}</em> : null}
          </small>
          </aside>
        </div>
      </section>

      <section className={styles.trustStrip} aria-label="Purchase benefits" role="list">
          {[["↺", "60-night sleep trial"], ["♢", "1-year guarantee"], ["▰", "Free delivery"], ["↩", "Free returns"]].map(([icon, label]) => (
            <article key={label} role="listitem">
              <span aria-hidden="true">{icon}</span>
              <strong>{label}</strong>
              <small>Clear support included</small>
            </article>
          ))}
      </section>

      <section className={styles.textInsert} aria-labelledby="insert-title">
        <p className={styles.kicker}>Free UK delivery &bull; 60-night trial &bull; WhatsApp support</p>
        <h2 id="insert-title">Why choose {product.shortName}?</h2>
        <p>
          {product.description} Message our team on WhatsApp for size and firmness guidance, or browse the full mattress range to compare support options before you buy.
        </p>
      </section>

      <CustomerReviews
        title="What Our Customers Say"
        intro={`Verified feedback from customers who chose ${product.shortName}.`}
        reviews={[
          { id: "james", name: "James T.", date: "2026-08-20", rating: 5, verified: true, comment: "Comfortable support and a simple buying process." },
          { id: "emma", name: "Emma K.", date: "2026-08-11", rating: 5, verified: true, comment: "The firmness guidance was accurate and delivery was straightforward.", media: [gallery[0].src] },
          { id: "michael", name: "Michael L.", date: "2026-07-29", rating: 4, verified: true, comment: "Good support, clean finish, and helpful service throughout." },
        ]}
      />

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
        <h2 id="compare-title">Compare This Mattress</h2>
        <p className={styles.compareHint}>Select another mattress to see the differences side by side.</p>

        <div className={styles.comparePicker}>
          <div className={`${styles.compareSlot} ${styles.compareSlotActive}`}>
            <span className={styles.compareSlotBadge}>This product</span>
            <img src={gallery[0].src} alt={gallery[0].alt} />
            <strong>{product.shortName}</strong>
            <small>{product.firmness}</small>
            <span>{product.price.replace("From ", "")}</span>
          </div>

          <span className={styles.compareVs} aria-hidden="true">VS</span>

          {comparisonProduct ? (
            <div className={styles.compareSlot}>
              <button
                type="button"
                className={styles.compareSlotRemove}
                aria-label={`Remove ${comparisonProduct.shortName} from comparison`}
                onClick={() => setComparisonSlug(null)}
              >
                &times;
              </button>
              <img src={comparisonProduct.gallery?.[0]?.src ?? comparisonProduct.image} alt={comparisonProduct.imageAlt} />
              <strong>{comparisonProduct.shortName}</strong>
              <small>{comparisonProduct.firmness}</small>
              <span>{comparisonProduct.price.replace("From ", "")}</span>
              <button type="button" className={styles.compareSlotChange} onClick={() => setPickerOpen(true)}>
                &#8635; Change
              </button>
            </div>
          ) : (
            <button type="button" className={styles.compareSlotEmpty} onClick={() => setPickerOpen(true)}>
              Select a mattress
            </button>
          )}
        </div>

        {pickerOpen ? (
          <div className={styles.comparePickerList} role="listbox" aria-label="Choose a mattress to compare">
            <p>Choose a mattress to compare:</p>
            <ul role="list">
              {relatedProducts.map((item) => (
                <li key={item.slug}>
                  <button type="button" onClick={() => chooseComparison(item.slug)}>
                    <img src={item.gallery?.[0]?.src ?? item.image} alt="" />
                    <span>
                      <strong>{item.shortName}</strong>
                      <small>{item.firmness}</small>
                    </span>
                    <em>{item.price.replace("From ", "")}</em>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className={styles.comparePickerClose} onClick={() => setPickerOpen(false)}>
              Cancel
            </button>
          </div>
        ) : null}

        <button
          className={styles.compareButton}
          type="button"
          disabled={!comparisonProduct}
          onClick={() => setModalOpen(true)}
        >
          Compare Products {comparisonProduct ? "(2)" : "(1)"}
        </button>
      </section>

      {modalOpen && comparisonProduct ? (
        <MattressCompareModal products={[product, comparisonProduct]} onClose={() => setModalOpen(false)} />
      ) : null}

      <ProductRail title="Related Products" products={relatedProducts} />
      <ProductRail title="Recently Viewed" products={[product, ...relatedProducts].slice(0, 5)} />
    </div>
  );
}

function ProductRail({ title, products }: { title: string; products: typeof orthoMattressProducts }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const titleId = `${title.toLowerCase().replace(/\s+/g, "-")}-title`;

  function scrollProducts(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.max(220, track.clientWidth * 0.78), behavior: "smooth" });
  }

  return (
    <section className={styles.rail} aria-labelledby={titleId}>
      <div className={styles.railHeader}>
        <h2 id={titleId}>{title}</h2>
        <div className={styles.railControls} aria-label={`${title} carousel controls`}>
          <button type="button" aria-label={`Previous ${title.toLowerCase()}`} onClick={() => scrollProducts(-1)}>
            &larr;
          </button>
          <button type="button" aria-label={`Next ${title.toLowerCase()}`} onClick={() => scrollProducts(1)}>
            &rarr;
          </button>
        </div>
      </div>
      <div className={styles.railTrack} ref={trackRef}>
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
