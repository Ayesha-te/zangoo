import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { SearchExperience } from "@/app/components/search/SearchExperience";

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
          <p>Search our available furniture by name, firmness, or keyword.</p>
          <SearchExperience />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
