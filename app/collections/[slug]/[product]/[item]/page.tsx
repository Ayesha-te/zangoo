import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { getMattressProduct, orthoMattressProducts } from "@/app/data/mattressProducts";

type ProductLandingPageProps = {
  params: Promise<{ slug: string; product: string; item: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return orthoMattressProducts.map((mattress) => ({
    slug: "bedroom",
    product: "mattresses",
    item: mattress.slug,
  }));
}

export async function generateMetadata({ params }: ProductLandingPageProps): Promise<Metadata> {
  const { item: itemSlug } = await params;
  const item = getMattressProduct(itemSlug);

  return {
    title: item ? `${item.name} | Orthopaedic Mattress Sale | Furniture Co.` : "Orthopaedic Mattress | Furniture Co.",
    description: item?.description,
  };
}

export default async function ProductLandingPage({ params }: ProductLandingPageProps) {
  const { slug, product, item: itemSlug } = await params;
  const item = getMattressProduct(itemSlug);

  if (slug !== "bedroom" || product !== "mattresses" || !item) notFound();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.description,
    image: item.image,
    brand: { "@type": "Brand", name: "Furniture Co." },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "5000" },
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: item.price.replace(/[^0-9]/g, "") || "499",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <SiteHeader />
      <Breadcrumbs
        items={[
          { label: "Collections", href: "/collections/" },
          { label: "Bedroom", href: "/collections/bedroom/" },
          { label: "Mattresses", href: "/collections/bedroom/mattresses/" },
          { label: item.shortName },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <main className="mattress-landing">
        <section className="mattress-landing-hero">
          <div className="mattress-copy">
            <span className="mattress-sale-pill">
              Mattress Sale
            </span>
            <h1 className="mattress-title">
              {item.name}
            </h1>
            <p className="mattress-description">{item.description}</p>
            <div className="mattress-rating">
              <span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              <strong>5 star verified reviews</strong>
            </div>
            <ul className="mattress-bullets" role="list">
              {item.bullets.map((bullet) => (
                <li key={bullet}>
                  <span aria-hidden="true">&#10003;</span>
                  {bullet}
                </li>
              ))}
            </ul>
            <div className="mattress-actions">
              <a
                className="mattress-primary"
                href="https://wa.me/447830376489"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask About This Mattress
              </a>
              <Link
                className="mattress-secondary"
                href="/collections/bedroom/mattresses/"
              >
                View Mattress Range
              </Link>
            </div>
          </div>
          <div className="mattress-media">
            <div className="mattress-photo-card">
              <div className="mattress-photo">
                <img src={item.image} alt={item.imageAlt} />
                <div className="mattress-firmness">
                  {item.firmness}
                </div>
                <div className="mattress-price-card">
                  <span>Sale price</span>
                  <strong>{item.price}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mattress-spec-section">
          <div className="mattress-spec-grid">
            {item.specs.map((spec) => (
              <div className="mattress-spec" key={spec.label}>
                <span>{spec.label}</span>
                <strong>{spec.value}</strong>
                <small>{spec.note}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="mattress-feature-grid">
          {item.features.map((feature) => (
            <article className="mattress-feature" key={feature.title}>
              <span>Orthopaedic design</span>
              <h2>{feature.title}</h2>
              <p>{feature.body}</p>
              <ul role="list">
                {feature.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mattress-faq-section">
          <div className="mattress-faq-inner">
            <span>Common questions</span>
            <h2>Before you choose {item.shortName}</h2>
            <div>
              {item.faqs.map((faq) => (
                <article key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
