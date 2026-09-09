import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { faqs } from "@/app/data/home";
import { FaqAccordion } from "@/app/components/site/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ | Furniture Co.",
  description: "Frequently asked questions about Furniture Co. delivery, returns, guarantee, and consultations.",
};

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "FAQ" }]} />
      <main className="simple-page">
        <section className="wrap simple-page-inner">
          <span className="sec-lbl">Help Centre</span>
          <h1>Frequently Asked Questions</h1>
          <FaqAccordion faqs={faqs} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
