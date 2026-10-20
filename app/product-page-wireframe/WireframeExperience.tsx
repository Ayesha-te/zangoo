"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { MattressProduct } from "@/app/data/mattressProducts";
import { formatGBP, getProductSizePricing, orthoMattressProducts } from "@/app/data/mattressProducts";
import { FirmnessBar } from "@/app/components/collections/FirmnessBar";
import { FavoriteButton } from "@/app/components/favorites/FavoriteButton";
import { CustomerReviews } from "@/app/components/reviews/CustomerReviews";
import { customerReviews } from "@/app/data/customerReviews";
import { ProductFaq } from "@/app/components/site/ProductFaq";
import { useCart } from "@/app/components/cart/CartProvider";
import { getStockState, type StockTone } from "@/app/utils/stockState";
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
];

const SIZE_IMAGE_LABEL: Record<string, string> = { single: "Single", double: "Double", king: "King" };

const RECENTLY_VIEWED_KEY = "furnitureCoRecentlyViewed";
/** Raw stored "recently viewed" JSON ("" when empty or unavailable). Strings are stable snapshots. */
function readRecentlyViewed() {
  try {
    return localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "";
  } catch {
    return "";
  }
}
function subscribeToRecentlyViewed(onChange: () => void) {
  const listener = (event: StorageEvent) => {
    if (event.key === RECENTLY_VIEWED_KEY) onChange();
  };
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
}

/**
 * Gallery indexes whose photo shows the given size, matched on the file name or alt text ("... King Morning").
 * The WooCommerce variation image for that size (if any) comes first.
 */
function sizeImageIndexes(gallery: Array<{ src: string; alt: string }>, sizeId: string, variationImage?: string) {
  const label = SIZE_IMAGE_LABEL[sizeId];
  if (!label) return [];
  const matches = gallery.flatMap((image, index) => ([image.src, image.alt].some((text) => text.includes(`${label} Morning`) || text.includes(`${label} Evening`)) ? [index] : []));
  const variationIndex = variationImage ? gallery.findIndex((image) => image.src === variationImage) : -1;
  return variationIndex >= 0 ? [variationIndex, ...matches.filter((index) => index !== variationIndex)] : matches;
}

function buildSizes(product: MattressProduct) {
  const basePrice = Number(product.price.replace(/[^0-9]/g, "")) || 499;

  return SIZE_TIERS.map((tier) => {
    // WooCommerce variation prices (or the local size table); others keep the old estimate.
    const pricing = getProductSizePricing(product, tier.id);
    if (pricing) return { id: tier.id, label: tier.label, price: pricing.sale, compare: pricing.regular };
    const price = Math.round((basePrice * tier.multiplier) / 10) * 10;
    const compare = Math.round(price / 0.85 / 10) * 10;
    return { id: tier.id, label: tier.label, price, compare };
  });
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
    // Main photo first, then the gallery. WooCommerce galleries already include the main photo, so drop repeats.
    () =>
      [{ src: product.image, alt: product.imageAlt }, ...(product.gallery ?? [])].filter(
        (image, index, all) => all.findIndex((other) => other.src === image.src) === index,
      ),
    [product.gallery, product.image, product.imageAlt],
  );
  const sizes = useMemo(() => buildSizes(product), [product]);
  const [size, setSize] = useState("king");
  // Open on the main product photo (first gallery image).
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { items, addItem, error: cartError, goToCheckout } = useCart();
  const router = useRouter();
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [comparisonSlug, setComparisonSlug] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  // Recently viewed comes from browser storage. useSyncExternalStore renders the server value (null) during
  // hydration and the stored value right after, so server and browser HTML match (no React #418).
  const storedRecent = useSyncExternalStore(subscribeToRecentlyViewed, readRecentlyViewed, () => null);
  const recentSlugs = useMemo(() => {
    let previous: string[] = [];
    try {
      previous = storedRecent ? (JSON.parse(storedRecent) as string[]) : [];
    } catch {
      previous = [];
    }
    return [product.slug, ...previous.filter((slug) => slug !== product.slug)].slice(0, 4);
  }, [storedRecent, product.slug]);
  useEffect(() => {
    // Only save once storage has been read (null = not read yet), so history is never overwritten.
    if (storedRecent === null) return;
    try {
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentSlugs));
    } catch {
      // Storage unavailable: the rail still works for this page view.
    }
  }, [storedRecent, recentSlugs]);

  const activeSize = sizes.find((item) => item.id === size) ?? sizes[2];
  const total = activeSize.price * quantity;
  // Keep the product image first and show size-specific photos after it.
  const sizeIndexes = sizeImageIndexes(gallery, size, product.sizePricing?.[size]?.image);
  const allSizeIndexes = new Set([
    ...sizeImageIndexes(gallery, "single", product.sizePricing?.single?.image),
    ...sizeImageIndexes(gallery, "double", product.sizePricing?.double?.image),
    ...sizeImageIndexes(gallery, "king", product.sizePricing?.king?.image),
  ]);
  const sizeIndependentIndexes = gallery
    .map((_, index) => index)
    .filter((index) => index !== 0 && !allSizeIndexes.has(index));
  const thumbnailIndexes = [
    0,
    ...sizeIndependentIndexes,
    ...sizeIndexes,
    ...gallery
      .map((_, index) => index)
      .filter((index) => index !== 0 && !sizeIndependentIndexes.includes(index) && !sizeIndexes.includes(index)),
  ];
  // Photo saved to the basket / favourites: the selected size's main photo.
  const sizeImage = gallery[sizeIndexes[0] ?? 0] ?? gallery[0];

  function changeImage(direction: -1 | 1) {
    setActiveImage((current) => {
      const currentPosition = thumbnailIndexes.indexOf(current);
      const nextPosition = (currentPosition + direction + thumbnailIndexes.length) % thumbnailIndexes.length;
      return thumbnailIndexes[nextPosition];
    });
  }

  function chooseSize(nextSize: string) {
    setSize(nextSize);
    const nextSizeIndexes = sizeImageIndexes(gallery, nextSize, product.sizePricing?.[nextSize]?.image);
    if (nextSizeIndexes[0] !== undefined) setActiveImage(nextSizeIndexes[0]);
  }
  const comparisonProduct = relatedProducts.find((item) => item.slug === comparisonSlug) ?? null;
  const stockState = getStockState(product.stockCount);
  const outOfStock = stockState.tone === "out";
  // "Added" refers to the selected size, so other sizes can still be added.
  const added = items.some((item) => item.slug === product.slug && item.size === size);


  function chooseComparison(slug: string) {
    setComparisonSlug(slug);
    setPickerOpen(false);
  }

  const accordionContent = product.accordionContent ?? {
    features: product.features.map((feature) => `${feature.title}: ${feature.body}`).join(" "),
    benefits: product.bullets.join(". "),
    dimensions: "Single, Double, and King sizes are available. Please check the product specifications before ordering.",
    deliveryReturns: "Please review the current delivery, guarantee and returns guidance before ordering.",
  };

  const accordions = [
    { title: "Description", body: product.description },
    { title: "Features", body: accordionContent.features },
    { title: "Benefits", body: accordionContent.benefits },
    { title: "Dimensions and Size Guide", body: accordionContent.dimensions },
    { title: "Delivery, Guarantee & Returns", body: accordionContent.deliveryReturns },
  ];

  const faqItems = [...product.faqs];

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
            {gallery.length > 1 ? (
              <>
                <button
                  type="button"
                  className={`${styles.galleryArrow} ${styles.galleryArrowPrevious}`}
                  onClick={() => changeImage(-1)}
                  aria-label="View previous product image"
                >
                  &#8592;
                </button>
                <button
                  type="button"
                  className={`${styles.galleryArrow} ${styles.galleryArrowNext}`}
                  onClick={() => changeImage(1)}
                  aria-label="View next product image"
                >
                  &#8594;
                </button>
              </>
            ) : null}
            <button className={styles.view360} type="button">360&deg; View</button>
          </div>
          <div className={styles.thumbs} aria-label="Product image thumbnails">
            {thumbnailIndexes.map((index) => (
              <button
                className={index === activeImage ? styles.activeThumb : ""}
                type="button"
                key={`${gallery[index].src}-${index}`}
                aria-label={`View product image ${index + 1}`}
                aria-pressed={index === activeImage}
                onClick={() => setActiveImage(index)}
              >
                <img src={gallery[index].src} alt="" />
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
                      <p style={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
                        {item.body.split(/(<strong>.*?<\/strong>)/g).map((part, index) =>
                          part.startsWith("<strong>") && part.endsWith("</strong>") ? (
                            <strong key={index}>
                              {part.slice(8, -9)}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
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
          <p>{product.heroDescription ?? product.description}</p>
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
            <select value={size} onChange={(event) => chooseSize(event.target.value)}>
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
            <strong>{formatGBP(total)}</strong>
            <span>{formatGBP(activeSize.compare * quantity)}</span>
            <em>You Save {formatGBP((activeSize.compare - activeSize.price) * quantity)}</em>
          </div>
          <div className={styles.buyActions}>
            <button
              className={`${styles.addButton} ${added ? styles.addedButton : ""}`}
              type="button"
              disabled={outOfStock || added || adding}
              onClick={async () => {
                setAdding(true);
                try {
                  await addItem({ slug: product.slug, name: product.shortName, image: sizeImage.src, price: activeSize.price, size, variationId: product.sizePricing?.[size]?.variationId, href: `/collections/bedroom/mattresses/${product.slug}/` }, quantity);
                } catch {
                  // The cart error is shown below the button.
                } finally {
                  setAdding(false);
                }
              }}
            >
              {outOfStock ? "Out of Stock" : adding ? "Adding..." : added ? "Added to Basket" : "Add to Basket"}
            </button>
            <FavoriteButton
              className={styles.favoriteButton}
              activeClassName={styles.favoriteActive}
              item={{ slug: product.slug, name: product.shortName, href: `/collections/bedroom/mattresses/${product.slug}/`, image: sizeImage.src, price: product.price, firmness: product.firmness }}
            />
          </div>
          {cartError ? <p className={styles.cartError} role="alert">{cartError}</p> : null}
          {outOfStock ? (
            <button className={styles.notifyButton} type="button">Notify Me When Available</button>
          ) : (
            <button
              className={styles.buyButton}
              type="button"
              disabled={adding}
              onClick={async () => {
                setAdding(true);
                try {
                  if (!added) await addItem({ slug: product.slug, name: product.shortName, image: sizeImage.src, price: activeSize.price, size, variationId: product.sizePricing?.[size]?.variationId, href: `/collections/bedroom/mattresses/${product.slug}/` }, quantity);
                  // WooCommerce checkout when connected; otherwise the basket page.
                  if (!goToCheckout()) router.push("/cart/");
                } catch {
                  setAdding(false);
                }
              }}
            >
              Buy Now
            </button>
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

      <section className={styles.textInsert} aria-labelledby="insert-title">
        <p className={styles.kicker}>Free UK delivery &bull; 60-night trial &bull; WhatsApp support</p>
        <h2 id="insert-title">Why choose {product.shortName}?</h2>
        {(product.whyChoose?.length ? product.whyChoose : [product.description]).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <CustomerReviews
        title="What Our Customers Say"
        intro={`Verified feedback from customers who chose ${product.shortName}.`}
        reviews={customerReviews}
      />

      <section className={styles.faq} aria-labelledby="faq-title">
        <div className={styles.faqHeader}>
          <h2 id="faq-title">Frequently Asked Questions</h2>
          <p>Helpful answers about comfort, delivery, support, and caring for your mattress.</p>
          <Link className={styles.faqHeaderLink} href="/faq/"><span style={{ textTransform: "none" }}>View all FAQs</span></Link>
        </div>
        <ProductFaq faqs={faqItems} />
      </section>

      {/* Compare section retained for future re-enable; intentionally hidden for launch. */}
      {false && <section className={styles.compare} aria-labelledby="compare-title">
        <h2 id="compare-title">Compare This Mattress</h2>
        <p className={styles.compareHint}>Select another mattress to see the differences side by side.</p>

        <div className={styles.comparePicker}>
          <div className={`${styles.compareSlot} ${styles.compareSlotActive}`}>
            <span className={styles.compareSlotBadge}>This product</span>
            <img src={sizeImage.src} alt={sizeImage.alt} />
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
                aria-label={`Remove ${comparisonProduct?.shortName ?? "selected mattress"} from comparison`}
                onClick={(event) => {
                  event.stopPropagation();
                  setComparisonSlug(null);
                }}
              >
                &times;
              </button>
              <img src={comparisonProduct!.gallery?.[0]?.src ?? comparisonProduct!.image} alt={comparisonProduct!.imageAlt} />
              <strong>{comparisonProduct!.shortName}</strong>
              <small>{comparisonProduct!.firmness}</small>
              <span>{comparisonProduct!.price.replace("From ", "")}</span>
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
                const b = row.value(comparisonProduct!);
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
              <Link className={styles.compareInlineView} href={`/collections/bedroom/mattresses/${comparisonProduct!.slug}/`}>
                View {comparisonProduct!.shortName}
              </Link>
            </div>
          </div>
        ) : null}
      </section>}

      <ProductRail title="Related Products" products={relatedProducts} />
      <ProductRail title="Recently Viewed" products={recentSlugs.map((slug) => [product, ...relatedProducts].find((item) => item.slug === slug)).filter((item): item is MattressProduct => Boolean(item))} />
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
            {/* Keep rails consistent with catalogue cards by using the canonical product image. */}
            <img src={item.image} alt={item.imageAlt} />
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
