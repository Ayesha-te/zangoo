"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { formatGBP, getCardCopy, getProductSizePricing, type MattressProduct } from "@/app/data/mattressProducts";
import { useCart } from "@/app/components/cart/CartProvider";
import { AlertIcon, ArrowIcon, BagIcon, CheckCircleIcon, ChevronDownIcon, CloseIcon, ProductFeatures, TruckIcon } from "@/app/components/commerce/CommerceIcons";
import type { FavoriteItem } from "./FavoritesProvider";

const SIZES = [
  { id: "single", label: "Single", detail: "90 x 190cm" },
  { id: "double", label: "Double", detail: "135 x 190cm" },
  { id: "king", label: "King", detail: "150 x 200cm" },
] as const;
type SizeId = (typeof SIZES)[number]["id"];

/**
 * "Add to basket" side panel for the wishlist: the customer must pick a size (and quantity) before the item is
 * added, so the basket never gets a default size they didn't choose.
 */
export function AddToBasketDrawer({ item, product, onClose }: { item: FavoriteItem; product?: MattressProduct; onClose: () => void }) {
  const { addItem, pending, error: cartError } = useCart();
  const [size, setSize] = useState<SizeId | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeError, setShowSizeError] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const listId = useId();
  const errorId = useId();

  const priceFor = (id: SizeId) => (product ? getProductSizePricing(product, id) : null);
  const selected = size ? priceFor(size) : null;
  const fromPrice = priceFor("single")?.sale;
  const image = (size && product?.sizePricing?.[size]?.image) || item.image || product?.image;

  // Escape closes the size list first, then the panel; the page behind doesn't scroll; focus starts on Close.
  useEffect(() => {
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  function onPanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      if (listOpen) {
        setListOpen(false);
        triggerRef.current?.focus();
      } else {
        onClose();
      }
      return;
    }
    // Keep Tab inside the panel while it is open.
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex='0']")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  function choose(id: SizeId) {
    setSize(id);
    setShowSizeError(false);
    setListOpen(false);
    triggerRef.current?.focus();
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!listOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      setActiveIndex(Math.max(0, SIZES.findIndex((option) => option.id === size)));
      setListOpen(true);
      return;
    }
    if (!listOpen) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index + (event.key === "ArrowDown" ? 1 : -1) + SIZES.length) % SIZES.length);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(SIZES[activeIndex].id);
    }
  }

  async function addToBasket() {
    if (!size) {
      setShowSizeError(true);
      triggerRef.current?.focus();
      return;
    }
    try {
      await addItem(
        {
          slug: item.slug,
          name: item.name,
          image: image ?? "",
          price: selected?.sale ?? 0,
          size,
          variationId: product?.sizePricing?.[size]?.variationId,
          href: item.href,
        },
        quantity,
      );
      setAdded(true);
    } catch {
      // The basket shows its own error message (cartError).
    }
  }

  return (
    <div className="atb-backdrop" onMouseDown={onClose}>
      <div
        className="atb-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
        onKeyDown={onPanelKeyDown}
        onMouseDown={(event) => {
          event.stopPropagation();
          // A click anywhere outside the open size list closes it.
          if (listOpen && !(event.target as HTMLElement).closest(".atb-select")) setListOpen(false);
        }}
      >
        <div className="atb-head">
          <h2 id={titleId}>Add to basket</h2>
          <button ref={closeRef} type="button" className="atb-close" aria-label="Close" onClick={onClose}><CloseIcon width="26" height="26" /></button>
        </div>

        <div className="atb-product">
          {image ? <img src={image} alt="" /> : null}
          <div>
            <strong>{item.name}</strong>
            <span>{getCardCopy(item.slug).type}</span>
            <b>{selected ? formatGBP(selected.sale * quantity) : fromPrice ? <><small>From</small> {formatGBP(fromPrice)}</> : null}</b>
          </div>
        </div>

        {added ? (
          <div className="atb-added" role="status">
            <CheckCircleIcon width="22" height="22" />
            <div>
              <strong>Added to your basket</strong>
              <span>{quantity} × {item.name}, {SIZES.find((option) => option.id === size)?.label}</span>
            </div>
            <div className="atb-added-actions">
              <Link className="btn btn-p" href="/cart/">View basket</Link>
              <button className="btn btn-s" type="button" onClick={onClose}>Continue shopping</button>
            </div>
          </div>
        ) : (
          <>
            <div className="atb-field">
              <div className="atb-label">
                <span>Choose your size <i aria-hidden="true">*</i></span>
                <em>Required</em>
              </div>
              <p>Please select a size to continue.</p>
              <div className={`atb-select${listOpen ? " is-open" : ""}${showSizeError ? " has-error" : ""}`}>
                <button
                  ref={triggerRef}
                  type="button"
                  className="atb-select-trigger"
                  aria-haspopup="listbox"
                  aria-expanded={listOpen}
                  aria-controls={listId}
                  aria-invalid={showSizeError}
                  aria-describedby={showSizeError ? errorId : undefined}
                  aria-activedescendant={listOpen ? `${listId}-${SIZES[activeIndex].id}` : undefined}
                  onClick={() => {
                    setActiveIndex(Math.max(0, SIZES.findIndex((option) => option.id === size)));
                    setListOpen((open) => !open);
                  }}
                  onKeyDown={onTriggerKeyDown}
                >
                  <span>{size ? `${SIZES.find((option) => option.id === size)?.label} (${SIZES.find((option) => option.id === size)?.detail})` : "Select a size"}</span>
                  <ChevronDownIcon width="22" height="22" />
                </button>
                {listOpen ? (
                  <ul className="atb-options" role="listbox" id={listId} aria-label="Sizes">
                    {SIZES.map((option, index) => {
                      const pricing = priceFor(option.id);
                      return (
                        <li
                          key={option.id}
                          id={`${listId}-${option.id}`}
                          role="option"
                          aria-selected={size === option.id}
                          className={index === activeIndex ? "is-active" : undefined}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => choose(option.id)}
                        >
                          <span>{option.label} <small>{option.detail}</small></span>
                          {pricing ? <b>{formatGBP(pricing.sale)}</b> : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
              {showSizeError ? (
                <p className="atb-error" id={errorId} role="alert">
                  <AlertIcon width="20" height="20" />
                  <span>Please select a size to continue, <b>before adding to your basket.</b></span>
                </p>
              ) : null}
            </div>

            <div className="atb-quantity">
              <span>Quantity</span>
              <div className="atb-stepper" role="group" aria-label="Quantity">
                <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
                <output aria-live="polite">{quantity}</output>
                <button type="button" aria-label="Increase quantity" disabled={quantity >= 10} onClick={() => setQuantity((value) => Math.min(10, value + 1))}>+</button>
              </div>
            </div>

            <div className="atb-features"><ProductFeatures turnable={product?.compareSpecs.turnable} slug={item.slug} /></div>

            <p className="atb-delivery"><TruckIcon width="30" height="30" /> Free UK delivery</p>

            {cartError ? <p className="cart-error" role="alert">{cartError}</p> : null}
            <button
              type="button"
              className={`atb-submit${size ? "" : " is-waiting"}`}
              aria-disabled={!size}
              disabled={pending}
              onClick={addToBasket}
            >
              <BagIcon width="22" height="22" /> {pending ? "Adding…" : "Add selected item to basket"}
            </button>
          </>
        )}

        <Link className="atb-details" href={item.href}>View full product details <ArrowIcon /></Link>
      </div>
    </div>
  );
}
