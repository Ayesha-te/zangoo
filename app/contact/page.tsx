import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";

export const metadata: Metadata = {
  title: "Contact | Furniture Co.",
  description: "Contact Furniture Co. for support, secure enquiries, and showroom information.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <main className="simple-page">
        <section className="wrap simple-page-inner">
          <span className="sec-lbl">Contact Support</span>
          <h1>How can we help?</h1>
          <p>Send a secure enquiry about orders, mattress sales, showroom visits, or accessibility support.</p>
          <a className="btn btn-p" href="mailto:support@example.com">support@example.com</a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
