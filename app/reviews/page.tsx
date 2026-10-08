import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { CustomerReviews } from "@/app/components/reviews/CustomerReviews";
import { customerReviews } from "@/app/data/customerReviews";
import styles from "./reviews.module.css";

export const metadata: Metadata = {
  title: "Customer Reviews | Furniture Co.",
  description: "Read verified customer reviews and share your Furniture Co. experience.",
};

export default function ReviewsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className={styles.intro} aria-labelledby="reviews-page-title">
          <div className={styles.introInner}>
            <Breadcrumbs items={[{ label: "Reviews" }]} />
            <p className={styles.eyebrow}>Real homes. Real comfort.</p>
            <h1 id="reviews-page-title">Customer reviews</h1>
            <p className={styles.lede}>
              Hear from customers who chose Furniture Co. for better sleep, thoughtful service, and pieces made for everyday living.
            </p>
          </div>
        </section>
        <CustomerReviews
          title="What our customers say"
          intro="Browse the latest verified feedback, then share your own experience with the community."
          reviews={customerReviews}
          showForm
        />
      </main>
      <SiteFooter />
    </>
  );
}
