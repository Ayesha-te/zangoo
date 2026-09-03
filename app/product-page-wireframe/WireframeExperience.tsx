"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MattressProduct } from "@/app/data/mattressProducts";
import { orthoMattressProducts } from "@/app/data/mattressProducts";
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

type StockTone = "ok" | "low" | "last" | "out";

function getStockState(count: number): { label: string; sub: string | null; tone: StockTone } {
  if (count <= 0) {
    return { label: "Out of stock", sub: null, tone: "out" };
  }
  if (count === 1) {
    return { label: "Last one — hurry!", sub: "Once it's gone, it's gone", tone: "last" };
  }
  if (count <= 4) {
    return { label: `Only ${count} left in stock`, sub: "Selling fast — order soon", tone: "low" };
  }
  return { label: `${count} in stock`, sub: null, tone: "ok" };
}

const STOCK_CLASS: Record<StockTone, string> = {
  ok: "stockOk",
  low: "stockLow",
  last: "stockLast",
  out: "stockOut",
};

type CompareRow = {
  label: string;
  value: (item: MattressProduct) => string;
  display?: (item: MattressProduct) => string;
};

const COMPARE_ROWS: CompareRow[] = [
  { label: "Firmness", value: (item) => item.firmness },
  { label: "Price", value: (item) => item.price.replace("From ", "") },
  { label: "Spring type", value: (item) => item.compareSpecs.springType },
  { label: "Comfort layers", value: (item) => item.compareSpecs.comfortLayer },
  { label: "Cover", value: (item) => item.compareSpecs.cover },
  { label: "Turnable", value: (item) => (item.compareSpecs.turnable ? "Yes" : "No") },
  { label: "Weight", value: (item) => item.compareSpecs.weight },
];

export function WireframeExperience({ product, relatedProducts, isPreview = true }: WireframeExperienceProps) {
  const gallery = useMemo(
    () => (product.gallery?.length ? product.gallery : [{ src: product.image, alt: product.imageAlt }]),
    [product.gallery, product.image, product.imageAlt],
  );
  const sizes = useMemo(() => buildSizes(product), [product]);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [size, setSize] = useState("king");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(() => new Set());
  const [comparisonSlug, setComparisonSlug] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const activeSize = sizes.find((item) => item.id === size) ?? sizes[2];
  const total = activeSize.price * quantity;
  const thumbnails = gallery.slice(0, 4);
  const comparisonProduct = relatedProducts.find((item) => item.slug === comparisonSlug) ?? null;
  const stockState = getStockState(product.stockCount);
  const outOfStock = stockState.tone === "out";

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
            <button
              type="button"
              className={styles.zoomTrigger}
              onClick={() => setZoomOpen(true)}
              aria-label="Zoom into product image"
            >
              <img src={gallery[activeImage]?.src ?? gallery[0].src} alt={gallery[activeImage]?.alt ?? gallery[0].alt} />
            </button>
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

          {zoomOpen ? (
            <div className={styles.zoomOverlay} role="presentation" onClick={() => setZoomOpen(false)}>
              <button type="button" className={styles.zoomClose} aria-label="Close zoomed image" onClick={() => setZoomOpen(false)}>
                &times;
              </button>
              <img
                className={styles.zoomImage}
                src={gallery[activeImage]?.src ?? gallery[0].src}
                alt={gallery[activeImage]?.alt ?? gallery[0].alt}
                onClick={(event) => event.stopPropagation()}
              />
            </div>
          ) : null}

          <div className={styles.accordionCard} aria-label="Product information">
            {accordions.map((item, index) => {
              const isOpen = openAccordion === index;
              return (
                <div className={styles.accordionItem} key={item.title}>
                  <button
                    type="button"
                    className={styles.accordionSummary}
                    aria-expanded={isOpen}
                    onClick={() => setOpenAccordion(isOpen ? null : index)}
                  >
                    {item.title}
                  </button>
                  <div className={styles.accordionPanel} data-open={isOpen || undefined}>
                    <div className={styles.accordionPanelInner}>
                      <p>{item.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
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
            <button
              className={`${styles.addButton} ${added ? styles.addedButton : ""}`}
              type="button"
              disabled={outOfStock}
              onClick={() => setAdded(true)}
            >
              {outOfStock ? "Out of Stock" : added ? "Added to Basket" : "Add to Basket"}
            </button>
            <FavoriteButton
              className={styles.favoriteButton}
              activeClassName={styles.favoriteActive}
              item={{ slug: product.slug, name: product.shortName, href: `/collections/bedroom/mattresses/${product.slug}/`, image: gallery[0].src, price: product.price, firmness: product.firmness }}
            />
          </div>
          {outOfStock ? (
            <button className={styles.notifyButton} type="button">Notify Me When Available</button>
          ) : (
            <button className={styles.buyButton} type="button">Buy Now</button>
          )}
          <small className={`${styles.stockNote} ${styles[STOCK_CLASS[stockState.tone]]}`}>
            <span className={styles.stockDot} aria-hidden="true" />
            <span className={styles.stockLabel}>{stockState.label}</span>
            {stockState.sub ? <em>{stockState.sub}</em> : null}
          </small>
          <div className={styles.paymentMethods} aria-label="Accepted payment methods">
            <span>VISA</span>
            <span>Mastercard</span>
            <span>AMEX</span>
            <span>Maestro</span>
            <span>Klarna.</span>
            <span>Apple Pay</span>
            <span>Google Pay</span>
          </div>
          </aside>
        </div>
      </section>

      <section className="trust-bar" aria-label="Purchase benefits">
        <div className="trust-bar-in" role="list">
          <span role="listitem">🇬🇧 Made in the UK</span>
          <span role="listitem">🚚 Free UK Delivery</span>
          <span role="listitem">💳 0% Interest-Free Finance</span>
          <span role="listitem">🛡️ 1-Year Guarantee</span>
          <span role="listitem">🌱 FSC Certified &amp; Carbon Neutral</span>
        </div>
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
          { id: "emma", name: "Emma K.", date: "2026-08-11", rating: 5, verified: true, comment: "The firmness guidance was accurate and delivery was straightforward." },
          { id: "michael", name: "Michael L.", date: "2026-07-29", rating: 4, verified: true, comment: "Good support, clean finish, and helpful service throughout." },
        ]}
      />

      <section className={styles.faq} aria-labelledby="faq-title">
        <h2 id="faq-title">FAQ</h2>
        <div>
          {[...product.faqs,
            { question: "How long does delivery take?", answer: "Standard UK delivery is free, with timing confirmed before dispatch." },
            { question: "Can I use this mattress on my existing bed?", answer: "Yes. It works with supportive divan, platform, and correctly spaced slatted bases." },
            { question: "How should I care for the mattress?", answer: "Rotate it regularly and follow the turning guidance supplied with your selected model." },
            { question: "What happens if I need help after ordering?", answer: "Our support team can assist with delivery, setup, care, and product questions." },
          ].map((faq, index) => {
            const isOpen = openFaqs.has(index);
            return (
              <div className={styles.faqItem} key={faq.question}>
                <button
                  type="button"
                  className={styles.faqSummary}
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaqs((current) => {
                    const next = new Set(current);
                    if (next.has(index)) next.delete(index); else next.add(index);
                    return next;
                  })}
                >
                  {faq.question}
                </button>
                <div className={styles.faqPanel} data-open={isOpen || undefined}>
                  <div className={styles.faqPanelInner}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
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
            <div
              className={styles.compareSlot}
              role="button"
              tabIndex={0}
              aria-label={`Change the mattress compared against ${product.shortName}`}
              onClick={() => setPickerOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") setPickerOpen(true);
              }}
            >
              <button
                type="button"
                className={styles.compareSlotRemove}
                aria-label={`Remove ${comparisonProduct.shortName} from comparison`}
                onClick={(event) => {
                  event.stopPropagation();
                  setComparisonSlug(null);
                }}
              >
                &times;
              </button>
              <img src={comparisonProduct.gallery?.[0]?.src ?? comparisonProduct.image} alt={comparisonProduct.imageAlt} />
              <strong>{comparisonProduct.shortName}</strong>
              <small>{comparisonProduct.firmness}</small>
              <span>{comparisonProduct.price.replace("From ", "")}</span>
              <span className={styles.compareSlotChange}>&#8635; Change</span>
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

        {comparisonProduct ? (
          <div className={styles.compareInline}>
            <div className={styles.compareInlineRows}>
              {COMPARE_ROWS.map((row) => {
                const a = row.value(product);
                const b = row.value(comparisonProduct);
                const differs = a !== b;
                return (
                  <div className={styles.compareInlineRow} key={row.label}>
                    <span className={styles.compareInlineLabel}>{row.label}</span>
                    <span className={`${styles.compareInlineValue} ${differs ? styles.compareInlineDiffer : ""}`}>
                      {differs ? <em className={styles.compareInlineDot} aria-hidden="true" /> : null}
                      {a}
                    </span>
                    <span className={`${styles.compareInlineValue} ${differs ? styles.compareInlineDiffer : ""}`}>
                      {differs ? <em className={styles.compareInlineDot} aria-hidden="true" /> : null}
                      {b}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className={styles.compareInlineActions}>
              <a className={styles.compareInlineBuy} href="#wireframe-title">
                Buy {product.shortName}
              </a>
              <Link className={styles.compareInlineView} href={`/collections/bedroom/mattresses/${comparisonProduct.slug}/`}>
                View {comparisonProduct.shortName}
              </Link>
            </div>
          </div>
        ) : null}
      </section>

      <ProductRail title="Related Products" products={relatedProducts} />
      <ProductRail title="Recently Viewed" products={[product, ...relatedProducts].slice(0, 6)} />
    </div>
  );
}

function ProductRail({ title, products }: { title: string; products: typeof orthoMattressProducts }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const titleId = `${title.toLowerCase().replace(/\s+/g, "-")}-title`;

  useEffect(() => {
    if (products.length <= 5 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + track.clientWidth / 5, behavior: "smooth" });
    }, 4500);
    return () => window.clearInterval(timer);
  }, [products.length]);

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
          <Link
            href={`/collections/bedroom/mattresses/${item.slug}/`}
            key={item.slug}
            target="_blank"
            rel="noopener noreferrer"
          >
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
