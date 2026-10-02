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
        <section className="wrap commerce-page">
          <div className="commerce-heading"><div><span className="sec-lbl">Wishlist</span><h1>Saved pieces.</h1><p>Your favourite furniture, all in one place.</p></div></div>
          <WishlistContent />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
