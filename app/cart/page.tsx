"use client";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { useCart } from "@/app/components/cart/CartProvider";

export default function CartPage() {
  const { items, removeItem } = useCart();
  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <main className="simple-page">
        <section className="wrap simple-page-inner">
          <span className="sec-lbl">Cart</span>
          <h1>Your cart.</h1>
          {!items.length ? <p>Your basket is currently empty.</p> : <div className="cart-list">{items.map((item) => <article className="cart-item" key={`${item.slug}-${item.size}`}><img src={item.image} alt="" /><div><h2>{item.name}</h2><p>{item.size} · £{item.price} × {item.quantity}</p><button type="button" onClick={() => removeItem(item.slug, item.size)}>Remove</button></div></article>)}</div>}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
