import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { AccountExperience } from "./AccountExperience";

export const metadata: Metadata = {
  title: "Account | Furniture Co.",
};

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Account" }]} />
      <main className="simple-page account-page">
        <section className="wrap simple-page-inner">
          <span className="sec-lbl">Account</span>
          <h1>Your account.</h1>
          <p>Sign in to track orders, check out faster and keep your favourites in one place.</p>
          <AccountExperience />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
