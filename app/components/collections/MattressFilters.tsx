"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../../collections/collections.module.css";

type MattressFiltersProps = {
  needFilters: string[];
  feelFilters: string[];
  sizeFilters: string[];
  selectedNeed: string[];
  selectedFeel: string[];
  selectedSize: string[];
  onToggleNeed: (filter: string) => void;
  onToggleFeel: (filter: string) => void;
  onToggleSize: (filter: string) => void;
  onClearAll: () => void;
};

export function MattressFilters({
  needFilters,
  feelFilters,
  sizeFilters,
  selectedNeed,
  selectedFeel,
  selectedSize,
  onToggleNeed,
  onToggleFeel,
  onToggleSize,
  onClearAll,
}: MattressFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSelection = selectedNeed.length > 0 || selectedFeel.length > 0 || selectedSize.length > 0;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button type="button" className={styles.filterTrigger} onClick={() => setIsOpen(true)}>
        <span aria-hidden="true">&#9776;</span>
        Filter
      </button>

      <aside
        className={isOpen ? `${styles.filterSidebar} ${styles.filterSidebarOpen}` : styles.filterSidebar}
        aria-label="Mattress filters"
      >
        <div className={styles.filterHead}>
          <strong>Filter by</strong>
          <div className={styles.filterHeadActions}>
            <button type="button" onClick={onClearAll}>
              Clear all
            </button>
            <button
              type="button"
              className={styles.filterCloseBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close filters"
            >
              &times;
            </button>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <strong>Shop by Need</strong>
          {needFilters.map((filter) => (
            <label className={styles.filterOption} key={filter}>
              <input
                type="checkbox"
                checked={selectedNeed.includes(filter)}
                onChange={() => onToggleNeed(filter)}
              />
              <span>{filter}</span>
            </label>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <strong>Feel</strong>
          {feelFilters.map((filter) => (
            <label className={styles.filterOption} key={filter}>
              <input
                type="checkbox"
                checked={selectedFeel.includes(filter)}
                onChange={() => onToggleFeel(filter)}
              />
              <span>{filter}</span>
            </label>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <strong>Size</strong>
          {sizeFilters.map((filter) => (
            <label className={styles.filterOption} key={filter}>
              <input
                type="checkbox"
                checked={selectedSize.includes(filter)}
                onChange={() => onToggleSize(filter)}
              />
              <span>{filter}</span>
            </label>
          ))}
        </div>

        <div className={styles.helpBox}>
          <strong>Need help choosing?</strong>
          <p>Our sleep experts can help you find the right mattress.</p>
          <Link href="/contact/">Contact Us</Link>
        </div>

        {hasSelection ? (
          <button type="button" className={styles.filterApplyBtn} onClick={() => setIsOpen(false)}>
            Apply Filters
          </button>
        ) : null}
      </aside>
    </>
  );
}
