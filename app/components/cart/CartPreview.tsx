"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { useCart } from "@/app/components/cart/CartProvider";
import { formatGBP } from "@/app/data/mattressProducts";

/** Delay before the preview closes after the pointer leaves, so moving from the icon into the popup is easy. */
const CLOSE_DELAY = 250;

/**
 * Header basket icon with a preview popup of what is in the basket: opens on hover (mouse) or keyboard focus;
 * on touch screens the first tap opens it and a second tap goes to the basket page.
 */
export function CartPreview() {
  const { items, count, totals } = useCart();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const lastPointer = useRef<string>("mouse");
  const total = totals?.total ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  // While open: a tap/click outside or Escape closes it.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const onPointerEnter = (event: ReactPointerEvent) => {
    lastPointer.current = event.pointerType;
    if (event.pointerType === "mouse") show();
  };
  const onPointerLeave = (event: ReactPointerEvent) => {
    if (event.pointerType === "mouse") hideSoon();
  };

  return (
    <div
      className="nav-cart-wrap"
      ref={wrapRef}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={show}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) hideSoon();
      }}
    >
      <Link
        href="/cart/"
        aria-label={`Cart, ${count} items`}
        className="nav-cart"
        aria-expanded={open}
        aria-controls="nav-cart-preview"
        onPointerDown={(event) => {
          lastPointer.current = event.pointerType;
        }}
        onClick={(event) => {
          // Touch: the first tap shows the preview instead of leaving the page.
          if (lastPointer.current !== "mouse" && !open) {
            event.preventDefault();
            show();
          }
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h15l-2 8H8L6 3H3m6 16a1 1 0 1 0 0 .1m9-.1a1 1 0 1 0 0 .1" /></svg>
        {count ? <span className="nav-cart-count">{count}</span> : null}
      </Link>

      {open ? (
        <div className="nav-cart-preview" id="nav-cart-preview" role="region" aria-label="Basket preview">
          <div className="ncp-head">
            <strong>Your basket</strong>
            <span>{count} {count === 1 ? "item" : "items"}</span>
          </div>
          {items.length ? (
            <>
              <ul className="ncp-items">
                {items.map((item) => (
                  <li key={`${item.slug}-${item.size}`}>
                    <Link href={item.href} onClick={() => setOpen(false)}>
                      {item.image ? <img src={item.image} alt="" /> : <span className="ncp-thumb" />}
                      <span className="ncp-copy">
                        <strong>{item.name}</strong>
                        <small>{item.size.charAt(0).toUpperCase() + item.size.slice(1)} · Qty <b className={item.quantity > 1 ? "is-multiple" : undefined}>{item.quantity}</b></small>
                      </span>
                      <span className="ncp-price">{formatGBP(item.price * item.quantity)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="ncp-total"><span>Total</span><strong>{formatGBP(total)}</strong></div>
              <div className="ncp-actions">
                <Link className="btn btn-p" href="/cart/" onClick={() => setOpen(false)}>View basket &amp; checkout</Link>
              </div>
            </>
          ) : (
            <p className="ncp-empty">Your basket is empty.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
