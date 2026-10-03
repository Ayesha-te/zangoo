"use client";

import Link from "next/link";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { RecommendationStrip } from "@/app/components/commerce/RecommendationStrip";
import { ArrowIcon, CheckCircleIcon, LockIcon, ProductFeatures, TrashIcon } from "@/app/components/commerce/CommerceIcons";
import { useCart } from "@/app/components/cart/CartProvider";
import { getMattressProduct } from "@/app/data/mattressProducts";
import { getFirmnessColor } from "@/app/utils/firmness";
import collectionStyles from "@/app/collections/collections.module.css";

const benefits = ["Free UK delivery", "0% interest-free finance", "1-year guarantee", "FSC certified & carbon neutral", "Made in the UK"];

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <>
      <SiteHeader /><Breadcrumbs items={[{ label: "Cart" }]} />
      <main className="simple-page"><section className="wrap commerce-page">
        <div className="commerce-heading"><div><span className="sec-lbl">Cart</span><h1>Your cart.</h1><p>Review your items and proceed to a secure checkout.</p></div></div>
        {!items.length ? <div className="wishlist-empty"><p>Your basket is currently empty.</p></div> : <>
          <div className="commerce-count">{count} {count === 1 ? "item" : "items"}</div>
          <div className="cart-layout">
            <div className="commerce-list">{items.map((item) => {
              const product = getMattressProduct(item.slug);
              const firmness = product?.firmness || "Medium to Firm";
              return <article className="commerce-item cart-item" key={`${item.slug}-${item.size}`}>
                <div className="commerce-item-media">
                  <Link href={item.href} aria-label={`View ${item.name}`}><img src={item.image} alt="" /></Link>
                  <span className={collectionStyles.saleBadge} style={{ backgroundColor: getFirmnessColor(firmness) }}>{firmness}</span>
                </div>
                <div className="commerce-item-copy"><h2><Link href={item.href}>{item.name}</Link></h2><p>Open Coil Spring Mattress</p><ProductFeatures turnable={product?.compareSpecs.turnable} /></div>
                <div className="commerce-item-price"><div className="commerce-price-row"><strong>{"£"}{item.price}</strong><del>RRP {"£"}{item.price + 50}</del><b>Save {"£"}50 (15%)</b></div></div>
                <div className="cart-item-controls">
                  <div className="cart-quantity" aria-label={`Quantity for ${item.name}`}><button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.slug, item.size, item.quantity - 1)}>-</button><strong>{item.quantity}</strong><button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.slug, item.size, item.quantity + 1)}>+</button></div>
                  <button className="icon-button" type="button" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.slug, item.size)}><TrashIcon /></button>
                </div>
              </article>;
            })}</div>
            <aside className="cart-aside">
              <div className="order-summary">
                <h2>Order summary</h2>
                <div><span>Subtotal ({count} {count === 1 ? "item" : "items"})</span><strong>{"£"}{subtotal.toFixed(2)}</strong></div>
                <div><span>Delivery</span><strong>Free</strong></div>
                <hr />
                <div className="summary-total"><span>Total</span><strong>{"£"}{subtotal.toFixed(2)}</strong></div>
                <button className="btn btn-p" type="button">Proceed to checkout <ArrowIcon /></button>
                <small><LockIcon width="14" height="14" /> Secure checkout</small>
                <div className="payment-methods"><b>VISA</b><b>Mastercard</b><b>Apple Pay</b><b>G Pay</b></div>
              </div>
              <ul className="commerce-benefits">{benefits.map((benefit) => <li key={benefit}><CheckCircleIcon />{benefit}</li>)}</ul>
              <div className="cart-help"><h3>Need help with your order?</h3><p>Our team is here to help.</p><Link className="btn btn-s" href="/contact/">Contact us</Link></div>
            </aside>
          </div>
          <RecommendationStrip exclude={items.map((item) => item.slug)} />
        </>}
      </section></main><SiteFooter />
    </>
  );
}
