import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";

export const metadata: Metadata = {
  title: "Cart | Furniture Co.",
};

export default function CartPage() {
  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <main className="simple-page">
        <section className="wrap simple-page-inner">
          <span className="sec-lbl">Cart</span>
          <h1>Your cart.</h1>
          <p>The cart is ready for the upcoming ecommerce flow. Mattress sale enquiries are handled through contact support for now.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
