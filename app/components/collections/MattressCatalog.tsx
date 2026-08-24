"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { MattressProduct } from "@/app/data/mattressProducts";
import { getFirmnessRank } from "@/app/utils/firmness";
import { FirmnessBar } from "./FirmnessBar";
import { MattressFilters } from "./MattressFilters";
import { MattressCompareModal } from "./MattressCompareModal";
import styles from "../../collections/collections.module.css";

type MattressCatalogProps = {
  products: MattressProduct[];
  needFilters: string[];
  feelFilters: string[];
  sizeFilters: string[];
  children?: ReactNode;
};

const cleanPrice = (price: string) => price.replace("From ", "").replace("Â£", "£");
const priceNumber = (price: string) => Number(price.replace(/[^0-9]/g, "")) || 0;

type SortOption = "best-selling" | "price-low" | "firmness";

export function MattressCatalog({ products, needFilters, feelFilters, sizeFilters, children }: MattressCatalogProps) {
  const [selectedNeed, setSelectedNeed] = useState<string[]>([]);
  const [selectedFeel, setSelectedFeel] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("best-selling");
  const [compareSelection, setCompareSelection] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const toggle = (list: string[], setList: (value: string[]) => void, filter: string) => {
    setList(list.includes(filter) ? list.filter((entry) => entry !== filter) : [...list, filter]);
  };

  const clearAll = () => {
    setSelectedNeed([]);
    setSelectedFeel([]);
    setSelectedSize([]);
  };

  const filteredProducts = useMemo(() => {
    const matches = products.filter((product) => {
      const needMatch = selectedNeed.length === 0 || selectedNeed.some((filter) => product.bestFor.includes(filter));
      const feelMatch = selectedFeel.length === 0 || selectedFeel.includes(product.firmness);
      return needMatch && feelMatch;
    });

    const sorted = [...matches];
    if (sortBy === "price-low") {
      sorted.sort((a, b) => priceNumber(a.price) - priceNumber(b.price));
    } else if (sortBy === "firmness") {
      sorted.sort((a, b) => getFirmnessRank(a.firmness) - getFirmnessRank(b.firmness));
    }
    return sorted;
  }, [products, selectedNeed, selectedFeel, sortBy]);

  function toggleCompare(slug: string) {
    setCompareSelection((current) => {
      if (current.includes(slug)) return current.filter((entry) => entry !== slug);
      if (current.length >= 2) return current;
      return [...current, slug];
    });
  }

  const compareProducts = compareSelection
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is MattressProduct => Boolean(product));
  const canCompare = compareProducts.length === 2;

  return (
    <div className={styles.mattressLayout}>
      <MattressFilters
        needFilters={needFilters}
        feelFilters={feelFilters}
        sizeFilters={sizeFilters}
        selectedNeed={selectedNeed}
        selectedFeel={selectedFeel}
        selectedSize={selectedSize}
        onToggleNeed={(filter) => toggle(selectedNeed, setSelectedNeed, filter)}
        onToggleFeel={(filter) => toggle(selectedFeel, setSelectedFeel, filter)}
        onToggleSize={(filter) => toggle(selectedSize, setSelectedSize, filter)}
        onClearAll={clearAll}
      />

      <section className={styles.mattressResults} aria-label="Orthopaedic mattress results">
        <p className={styles.mattressCount}>
          <strong>{filteredProducts.length} Mattresses</strong>
        </p>

        <section className="trust-bar" aria-label="Mattress category trust benefits">
          <div className="trust-bar-in" role="list">
            <span role="listitem">🇬🇧 Made in the UK</span>
            <span role="listitem">🚚 Free UK Delivery</span>
            <span role="listitem">💳 0% Finance</span>
            <span role="listitem">🛡️ 1-Year Guarantee</span>
          </div>
        </section>

        <div className={styles.mattressToolbar}>
          <div className={styles.mattressToolbarActions}>
            <label>
              Sort by:
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}>
                <option value="best-selling">Best selling</option>
                <option value="price-low">Price low to high</option>
                <option value="firmness">Firmness</option>
              </select>
            </label>
            <button type="button" disabled={!canCompare} onClick={() => setModalOpen(true)}>
              Compare ({compareSelection.length})
            </button>
          </div>
        </div>

        <div className={styles.mattressGrid}>
          {filteredProducts.map((mattress) => (
            <article className={styles.mattressCard} key={mattress.slug}>
              <div className={styles.mattressCardBody}>
                <span className={styles.mattressImage}>
                  <img src={mattress.gallery?.[1]?.src ?? mattress.image} alt="" />
                  <span className={styles.saleBadge}>{mattress.firmness}</span>
                  <button
                    type="button"
                    className={styles.heartBadge}
                    aria-label={`Add ${mattress.shortName} to favourites`}
                  >
                    <span aria-hidden="true">&#9825;</span>
                  </button>
                </span>
                <span className={styles.mattressInfo}>
                  <strong>{mattress.shortName}</strong>
                  <FirmnessBar firmness={mattress.firmness} />
                  <span className={styles.mattressFeel}>Open Coil Spring Mattress</span>
                  <span className={styles.mattressSpecs}>
                    <span><span aria-hidden="true">↻</span>Double-sided</span>
                    <span><span aria-hidden="true">✣</span>Hand-tufted</span>
                    <span><span aria-hidden="true">▧</span>Wire edge</span>
                    <span><span aria-hidden="true">◇</span>Approx. 26cm deep</span>
                  </span>
                  <Link
                    className={styles.mattressRating}
                    href={`/collections/bedroom/mattresses/${mattress.slug}/#reviews`}
                    aria-label={`Read ${mattress.shortName} reviews`}
                  >
                    <span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                    <b>4.8</b>
                    <small>({mattress.slug === "capri-ortho-mattress" ? "358" : "27"} reviews)</small>
                  </Link>
                  <span className={styles.deliveryNote}>In stock - Free delivery from Tomorrow</span>
                  <span className={styles.mattressPrice}>
                    {cleanPrice(mattress.price)}
                    <small><s>RRP £249.00</s> <b>Save £50 (15%)</b></small>
                  </span>
                  <Link
                    className={styles.mattressButton}
                    href={`/collections/bedroom/mattresses/${mattress.slug}/`}
                  >
                    View Mattress <span aria-hidden="true">&rsaquo;</span>
                  </Link>
                </span>
              </div>
              <label className={styles.compareCheck}>
                <input
                  type="checkbox"
                  checked={compareSelection.includes(mattress.slug)}
                  disabled={!compareSelection.includes(mattress.slug) && compareSelection.length >= 2}
                  onChange={() => toggleCompare(mattress.slug)}
                  aria-label={`Add ${mattress.shortName} to compare`}
                />
                <span>Add to compare</span>
              </label>
            </article>
          ))}
          {filteredProducts.length === 0 ? (
            <p role="status">No mattresses match the selected filters. Try clearing a filter to see more results.</p>
          ) : null}
        </div>

        <section className={styles.categorySupportGrid} aria-label="Mattress category support">
          <div className={styles.categoryCompare}>
            <strong>Not sure which one is right for you?</strong>
            <p>Compare key support, comfort, delivery, and warranty details side by side.</p>
            <button type="button" disabled={!canCompare} onClick={() => setModalOpen(true)}>
              {canCompare ? "Compare Mattresses" : "Select 2 mattresses above to compare"}
            </button>
          </div>

          {children}
        </section>
      </section>

      {modalOpen && compareProducts.length === 2 ? (
        <MattressCompareModal
          products={[compareProducts[0], compareProducts[1]]}
          onClose={() => setModalOpen(false)}
        />
      ) : null}
    </div>
  );
}
