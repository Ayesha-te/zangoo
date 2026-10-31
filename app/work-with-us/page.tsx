import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { WorkWithUsForm } from "./WorkWithUsForm";

export const metadata: Metadata = {
  title: "Work with Us | OrthoBedroom",
  description: "Digital marketers: partner with OrthoBedroom, promote UK-made orthopaedic mattresses and earn with your own discount code.",
};

export default function WorkWithUsPage() {
  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Work with Us" }]} />
      <main className="simple-page">
        <section className="wrap simple-page-inner work-with-us">
          <span className="sec-lbl">Work with Us</span>
          <h1>Become an OrthoBedroom marketing partner.</h1>
          <p>
            We work with digital marketers to promote our UK-made orthopaedic mattresses. Experienced or just starting
            out, leave your details below and our team will contact you on WhatsApp.
          </p>
          <WorkWithUsForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
