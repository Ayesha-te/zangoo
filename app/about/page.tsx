import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About Us | Furniture Co.",
  description: "Learn about Furniture Co.'s sustainable materials, design process, warranty standards, and customer-first furniture service.",
};

export default function AboutPage() {
  const proofPoints = [
    ["15,000+", "Orders delivered"],
    ["4.9/5", "Average customer rating"],
    ["10 years", "Structural warranty"],
  ];

  const values = [
    {
      number: "01",
      title: "Made To Last",
      copy: "Every frame, fabric, and finish is selected for real daily use, backed by our 10-year structural warranty.",
    },
    {
      number: "02",
      title: "Sustainable By Default",
      copy: "We prioritise FSC-certified timber, low-VOC finishes, efficient logistics, and carbon-conscious delivery.",
    },
    {
      number: "03",
      title: "Guided Selection",
      copy: "Our consultants help customers choose scale, fabric, layout, and finish details before placing an order.",
    },
  ];

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="about-title">
          <div className={styles.copy}>
            <span className={styles.kicker}>About Furniture Co.</span>
            <h1 id="about-title" className={styles.title}>
              Furniture designed with craft, comfort, and responsibility.
            </h1>
            <p className={styles.lede}>
              We build timeless furniture for modern homes, using responsibly sourced materials, durable construction,
              and a consultation-led buying experience that keeps the process clear from first idea to delivery.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryButton} href="/contact/">
                Contact Support
              </Link>
              <Link className={styles.secondaryButton} href="/collections/">
                View Collections
              </Link>
            </div>
          </div>

          <div className={styles.proof}>
            <div className={styles.visualFrame}>
              <div className={styles.visual}>Crafted</div>
            </div>
            <div className={styles.statList} aria-label="Furniture Co. highlights">
              {proofPoints.map(([value, label]) => (
                <div className={styles.stat} key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.valuesSection} aria-label="Company values">
          <div className={styles.valuesGrid}>
            {values.map((item) => (
              <article className={styles.valueCard} key={item.title}>
                <span>{item.number}</span>
                <h2>{item.title}</h2>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
