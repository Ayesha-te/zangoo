"use client";

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
  const [isMobile, setIsMobile] = useState(false);
  const [draftNeed, setDraftNeed] = useState(selectedNeed);
  const [draftFeel, setDraftFeel] = useState(selectedFeel);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 1024px)");
    const update = () => setIsMobile(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => { if (!isOpen) { setDraftNeed(selectedNeed); setDraftFeel(selectedFeel); } }, [isOpen, selectedNeed, selectedFeel]);
  const hasSelection = (isMobile ? draftNeed.length > 0 || draftFeel.length > 0 : selectedNeed.length > 0 || selectedFeel.length > 0) || selectedSize.length > 0;
  const shownNeed = isMobile ? draftNeed : selectedNeed;
  const shownFeel = isMobile ? draftFeel : selectedFeel;

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
        {isMobile && (draftNeed.length || draftFeel.length) ? <div className={styles.activeFilterChips}>{[...draftNeed, ...draftFeel].map((filter) => <button type="button" key={filter} onClick={() => { setDraftNeed((v) => v.filter((x) => x !== filter)); setDraftFeel((v) => v.filter((x) => x !== filter)); }} aria-label={`Remove ${filter}`}>{filter} <span>×</span></button>)}</div> : null}

        <div className={styles.filterGroup}>
          <strong>Mattress Type</strong>
          {needFilters.map((filter) => (
            <label className={styles.filterOption} key={filter}>
              <input
                type="checkbox"
              checked={shownNeed.includes(filter)}
                onChange={() => isMobile ? setDraftNeed((v) => v.includes(filter) ? v.filter((x) => x !== filter) : [...v, filter]) : onToggleNeed(filter)}
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
              checked={shownFeel.includes(filter)}
              onChange={() => isMobile ? setDraftFeel((v) => v.includes(filter) ? v.filter((x) => x !== filter) : [...v, filter]) : onToggleFeel(filter)}
              />
              <span>{filter}</span>
            </label>
          ))}
        </div>

        <div className={`${styles.filterGroup} ${styles.sizeFilterGroup}`}>
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
          <a href="mailto:sales@zaango.co.uk?subject=Help%20choosing%20a%20mattress">Contact Us</a>
        </div>

        {hasSelection ? (
            <button type="button" className={styles.filterApplyBtn} onClick={() => { if (isMobile) { onClearAll(); draftNeed.forEach(onToggleNeed); draftFeel.forEach(onToggleFeel); } setIsOpen(false); }}>
            Apply Filters
          </button>
        ) : null}
      </aside>
    </>
  );
}
