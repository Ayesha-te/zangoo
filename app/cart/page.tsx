"use client";

import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { RecommendationStrip } from "@/app/components/commerce/RecommendationStrip";
import { useCart } from "@/app/components/cart/CartProvider";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <>
      <SiteHeader /><Breadcrumbs items={[{ label: "Cart" }]} />
      <main className="simple-page"><section className="wrap commerce-page">
        <div className="commerce-heading"><div><span className="sec-lbl">Cart</span><h1>Your cart.</h1><p>Review your items and proceed to a secure checkout.</p></div>{items.length ? <div className="commerce-count">{items.reduce((sum, item) => sum + item.quantity, 0)} items</div> : null}</div>
        {!items.length ? <p>Your basket is currently empty.</p> : <><div className="cart-layout">
          <div className="commerce-list">{items.map((item) => <article className="commerce-item cart-item" key={`${item.slug}-${item.size}`}>
            <div className="commerce-item-image"><img src={item.image} alt="" /><span>Medium to Firm</span></div>
            <div className="commerce-item-copy"><h2>{item.name}</h2><p>Open Coil Spring Mattress</p><ul className="commerce-features"><li>↻ <span>Double-sided</span></li><li>✣ <span>Hand-tufted</span></li><li>■ <span>Wire edge</span></li><li>◇ <span>Approx. 26cm deep</span></li></ul></div>
            <div className="commerce-item-price"><strong>{"\u00a3"}{item.price}</strong><del>RRP {"\u00a3"}{item.price + 50}</del><b>Save {"\u00a3"}50 (15%)</b></div>
            <div className="cart-item-controls"><div className="cart-quantity" aria-label={`Quantity for ${item.name}`}><button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.slug, item.size, item.quantity - 1)}>−</button><strong>{item.quantity}</strong><button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.slug, item.size, item.quantity + 1)}>+</button></div><button className="icon-button" type="button" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.slug, item.size)}>⌫</button></div>
          </article>)}</div>
          <aside className="order-summary"><h2>Order summary</h2><div><span>Subtotal ({items.length} items)</span><strong>{"\u00a3"}{subtotal.toFixed(2)}</strong></div><div><span>Delivery</span><strong>Free</strong></div><hr /><div className="summary-total"><span>Total</span><strong>{"\u00a3"}{subtotal.toFixed(2)}</strong></div><button className="btn btn-p" type="button">Proceed to checkout <span aria-hidden="true">→</span></button><small>♙ Secure checkout</small><div className="payment-methods"><b>VISA</b><b>●●</b><b>Apple Pay</b><b>G Pay</b></div></aside>
        </div><div className="commerce-benefits"><span>▣ Free UK delivery</span><span>◉ 0% interest-free finance</span><span>✓ 1-year guarantee</span><span>✓ FSC certified &amp; carbon neutral</span><span>✓ Made in the UK</span></div><RecommendationStrip exclude={items.map((item) => item.slug)} /></>}
      </section></main><SiteFooter />
    </>
  );
}
