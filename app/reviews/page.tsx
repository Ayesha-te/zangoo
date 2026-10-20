import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { CustomerReviews } from "@/app/components/reviews/CustomerReviews";
import { customerReviews } from "@/app/data/customerReviews";
import styles from "./reviews.module.css";

export const metadata: Metadata = {
  title: "Customer Reviews | Orthobedroom",
  description: "Read verified customer reviews and share your Orthobedroom experience.",
};

export default function ReviewsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className={styles.intro} aria-labelledby="reviews-page-title">
          <div className={styles.introInner}>
            <Breadcrumbs items={[{ label: "Reviews" }]} />
            <p className={styles.eyebrow}>VERIFIED MATTRESS REVIEWS</p>
            <h1 id="reviews-page-title">Orthopaedic Mattress Customer Reviews</h1>
            <p className={styles.lede}>
              Read verified customer reviews from people who ordered our UK-made orthopaedic mattresses online, with feedback on mattress comfort, support, delivery and customer service.
            </p>
          </div>
        </section>
        <CustomerReviews
          title="Verified Mattress Reviews from Our Customers"
          intro="Browse recent verified-purchase reviews from customers who have ordered our orthopaedic mattresses, then share your own experience after your purchase."
          reviews={customerReviews}
          showForm
        />
      </main>
      <SiteFooter />
    </>
  );
}
