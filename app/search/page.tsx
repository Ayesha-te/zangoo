import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";

export const metadata: Metadata = {
  title: "Search | Furniture Co.",
};

export default function SearchPage() {
  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Search" }]} />
      <main className="simple-page">
        <section className="wrap simple-page-inner">
          <span className="sec-lbl">Search</span>
          <h1>Find furniture.</h1>
          <p>Search is being prepared for the mattress launch. Contact support for current availability.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
