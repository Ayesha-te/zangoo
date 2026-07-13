import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { faqs } from "@/app/data/home";

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
          <div className="simple-faq-list">
            {faqs.map(([question, answer]) => (
              <article key={question}>
                <h2>{question}</h2>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
