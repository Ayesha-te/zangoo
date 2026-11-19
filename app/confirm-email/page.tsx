import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { ConfirmEmail } from "./ConfirmEmail";

export const metadata: Metadata = {
  title: "Confirm your email | OrthoBedroom",
  description: "Confirm your email address to complete your OrthoBedroom newsletter subscription.",
  robots: { index: false, follow: false },
};

export default function ConfirmEmailPage() {
  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Confirm your email" }]} />
      <main className="simple-page confirm-page">
        <section className="wrap simple-page-inner">
          <ConfirmEmail />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
