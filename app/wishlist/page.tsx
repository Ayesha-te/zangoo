import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";

export const metadata: Metadata = {
  title: "Wishlist | Furniture Co.",
};

export default function WishlistPage() {
  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <main className="simple-page">
        <section className="wrap simple-page-inner">
          <span className="sec-lbl">Wishlist</span>
          <h1>Saved pieces.</h1>
          <p>Wishlist functionality is coming soon with the full shop experience.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
