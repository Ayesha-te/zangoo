import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { WishlistContent } from "@/app/components/favorites/WishlistContent";

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
          <WishlistContent />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
