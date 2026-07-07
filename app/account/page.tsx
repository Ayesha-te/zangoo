import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";

export const metadata: Metadata = {
  title: "Account | Furniture Co.",
};

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Account" }]} />
      <main className="simple-page">
        <section className="wrap simple-page-inner">
          <span className="sec-lbl">Account</span>
          <h1>Your account.</h1>
          <p>Customer accounts are coming soon. Contact support for order and enquiry help.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
