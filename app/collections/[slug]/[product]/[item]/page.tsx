import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { getMattressProduct, orthoMattressProducts } from "@/app/data/mattressProducts";
import "./productLanding.module.css";

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

const reviews = [
  {
    initial: "M",
    name: "Margaret T.",
    condition: "Had chronic lower back pain for 3 years",
    text:
      "After years of waking up stiff, the support felt different within the first week. I wake up more settled and my lower back feels properly supported.",
  },
  {
    initial: "D",
    name: "David R.",
    condition: "Recovering from disc discomfort",
    text:
      "The mattress feels supportive without being harsh. The consultation helped me choose the right firmness and the delivery was straightforward.",
  },
  {
    initial: "S",
    name: "Sarah K.",
    condition: "Couples use with different sleep needs",
    text:
      "My partner moves a lot and I sleep warm. This gives us a steadier, cooler sleep surface and the difference is easy to notice.",
  },
];

const certifications = [
  ["ISO 9001", "Quality Management"],
  ["ISO 14001", "Environmental Management"],
  ["ISO 27001", "Information Security"],
  ["ISO 45001", "Health & Safety"],
  ["Green Organisation", "Sustainability Award"],
  ["Made in the UK", "Supplier standards"],
];

const comparisonRows = [
  ["7-zone support", "Basic open coil", "Partial zoning", "Full support profile"],
  ["Comfort layer", "Thin foam", "Standard comfort", "Adaptive pressure relief"],
  ["Motion control", "High transfer", "Moderate transfer", "Reduced partner disturbance"],
  ["Delivery", "Paid option", "Limited", "Free UK delivery"],
  ["Guarantee", "Basic cover", "Short cover", "1-year guarantee"],
];

const painPoints = [
  ["Lower back support", "Targeted support helps reduce the dipped feeling that can strain the lower back."],
  ["Pressure points", "Comfort layers cushion shoulders and hips while keeping the body supported."],
  ["Restless sleep", "A stable sleep surface helps reduce constant repositioning through the night."],
  ["Partner movement", "Support construction is chosen to limit disruption from movement."],
  ["Warm sleep", "Breathable materials help the sleep surface feel more balanced."],
  ["Daily durability", "Built for regular family use with practical support and comfort."],
];

function MattressIllustration() {
  return (
    <svg viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="450" cy="328" rx="420" ry="16" fill="rgba(0,0,0,.22)" />
      <rect x="60" y="60" width="780" height="120" rx="20" fill="#243552" />
      <rect x="80" y="76" width="740" height="88" rx="14" fill="#1E3A5F" />
      <rect x="100" y="88" width="200" height="64" rx="8" fill="rgba(184,203,224,.08)" />
      <rect x="316" y="88" width="268" height="64" rx="8" fill="rgba(184,203,224,.08)" />
      <rect x="600" y="88" width="200" height="64" rx="8" fill="rgba(184,203,224,.08)" />
      <rect x="60" y="168" width="780" height="130" rx="12" fill="#B8CBE0" />
      <rect x="60" y="168" width="780" height="30" rx="12" fill="#dce8f4" />
      <rect x="60" y="196" width="780" height="90" fill="#C8DAEA" />
      <rect x="60" y="274" width="780" height="24" rx="0 0 12 12" fill="#B0C4D8" />
      {[150, 230, 310, 390, 450, 510, 590, 670, 750].map((x) => (
        <line key={x} x1={x} y1="210" x2={x} y2="260" stroke="#1A2E44" strokeWidth="1" opacity=".25" />
      ))}
      <rect x="60" y="168" width="780" height="130" rx="12" fill="none" stroke="#9CBFDF" strokeWidth="2" />
      <rect x="90" y="100" width="260" height="72" rx="16" fill="#E8EFF7" />
      <rect x="102" y="110" width="236" height="52" rx="12" fill="#F4F7FB" />
      <rect x="550" y="100" width="260" height="72" rx="16" fill="#E8EFF7" />
      <rect x="562" y="110" width="236" height="52" rx="12" fill="#F4F7FB" />
      <rect x="60" y="148" width="780" height="60" rx="12" fill="#E8EFF7" />
      <rect x="75" y="155" width="750" height="46" rx="8" fill="#F4F7FB" />
      <rect x="340" y="200" width="220" height="28" rx="6" fill="rgba(21,87,167,.65)" />
      <text x="450" y="218" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="11" fontWeight="700" fill="#fff" letterSpacing="0.06em">
        7-ZONE POCKET SPRING SYSTEM
      </text>
      <rect x="80" y="292" width="16" height="32" rx="5" fill="#6a8aaa" />
      <rect x="804" y="292" width="16" height="32" rx="5" fill="#6a8aaa" />
      <rect x="260" y="292" width="14" height="32" rx="5" fill="#6a8aaa" />
      <rect x="626" y="292" width="14" height="32" rx="5" fill="#6a8aaa" />
    </svg>
  );
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
        <section className="lp-hero" aria-labelledby="product-title">
          <div className="lp-trust-card" aria-hidden="true">
            <span>&#127942;</span>
            <div>
              <strong>ISO supplier</strong>
              <small>Quality assured</small>
            </div>
          </div>

          <div className="lp-badges" role="list" aria-label="Mattress benefits">
            <span role="listitem">&#127942; Mattress sale</span>
            <span role="listitem">&#127807; FSC certified</span>
            <span role="listitem">&#9672; 60-night trial</span>
          </div>

          <h1 id="product-title">
            Sleep <em>Deeper.</em>
            <br />
            Wake Supported.
          </h1>
          <p className="lp-hero-copy">
            {item.name} is engineered for spinal alignment, pressure relief, and reliable restorative sleep.
          </p>

          <div className="lp-stars" role="img" aria-label="Five star verified reviews">
            <span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <strong>5 star verified reviews</strong>
          </div>

          <div className="lp-actions">
            <a className="lp-btn lp-btn-primary" href="https://wa.me/447830376489" target="_blank" rel="noopener noreferrer">
              Ask About This Mattress
            </a>
            <a className="lp-btn lp-btn-light" href="#features">
              See How It Works
            </a>
          </div>

          <div className="lp-bed">
            <MattressIllustration />
          </div>
        </section>

        <section className="lp-features" id="features" aria-labelledby="features-title">
          <div className="lp-section-head lp-section-head-dark">
            <span>How it works</span>
            <h2 id="features-title">Engineered layer by layer for restorative sleep</h2>
          </div>

          <div className="lp-feature-row">
            <div className="lp-feature-visual lp-zone-visual">
              <div className="lp-zone-map" aria-hidden="true">
                {["Head", "Shoulder", "Back", "Lumbar", "Hip", "Thigh", "Leg"].map((zone) => (
                  <span key={zone}>{zone}</span>
                ))}
              </div>
            </div>
            <div className="lp-feature-copy">
              <span>Layer 1 - Foundation</span>
              <h2>7-zone orthopaedic support</h2>
              <p>{item.features[0]?.body}</p>
              <ul role="list">
                {item.features[0]?.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
          </div>

          <div className="lp-feature-row lp-feature-row-flip">
            <div className="lp-feature-visual lp-layer-visual">
              <div className="lp-layer-stack" aria-hidden="true">
                <span>Breathable cover</span>
                <span>Comfort layer</span>
                <span>Support core</span>
                <span>Stable base</span>
              </div>
            </div>
            <div className="lp-feature-copy">
              <span>Layer 2 - Comfort</span>
              <h2>Comfort without sinking</h2>
              <p>{item.features[1]?.body}</p>
              <ul role="list">
                {item.features[1]?.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="lp-specs" aria-label={`${item.shortName} specifications`}>
          <div className="lp-spec-grid">
            {item.specs.map((spec) => (
              <div className="lp-spec" key={spec.label}>
                <strong>{spec.value}</strong>
                <span>{spec.label}</span>
                <small>{spec.note}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-trust" id="trust" aria-labelledby="trust-title">
          <div className="lp-section-head">
            <span>Built for real sleep</span>
            <h2 id="trust-title">Backed by practical sleep engineering</h2>
            <p>{item.description}</p>
          </div>
          <div className="lp-trust-grid">
            {item.bullets.map((bullet) => (
              <article key={bullet}>
                <span aria-hidden="true">&#10003;</span>
                <h3>{bullet}</h3>
                <p>Designed to make the buying decision clear, comfortable, and easy to discuss before ordering.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="lp-why lp-why-compare" id="why" aria-labelledby="why-title">
          <div className="lp-section-head">
            <span>Why {item.shortName}</span>
            <h2 id="why-title">How this mattress compares</h2>
            <p>See how {item.shortName} performs against common mattress options on the details that affect nightly comfort.</p>
          </div>
          <div className="lp-compare-wrap">
            <table className="lp-compare-table" aria-label={`${item.shortName} mattress comparison`}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Budget mattress</th>
                  <th>Standard ortho</th>
                  <th>{item.shortName}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([feature, budget, standard, current]) => (
                  <tr key={feature}>
                    <td>{feature}</td>
                    <td>{budget}</td>
                    <td>{standard}</td>
                    <td>{current}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lp-why lp-why-pain" aria-labelledby="pain-title">
          <div className="lp-section-head lp-section-head-dark">
            <span>Designed for real problems</span>
            <h2 id="pain-title">Built to solve everyday sleep issues</h2>
            <p>Every part of the mattress is selected around support, pressure relief, and easier sleep decisions.</p>
          </div>
          <div className="lp-pain-grid">
            {painPoints.map(([title, body]) => (
              <article key={title}>
                <span aria-hidden="true">&#10003;</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="lp-why lp-why-value" aria-labelledby="value-title">
          <div className="lp-section-head">
            <span>Everything included</span>
            <h2 id="value-title">No hidden costs. Clear support.</h2>
            <p>Each mattress page gives customers the key buying information before they open a consultation.</p>
          </div>
          <div className="lp-value-grid">
            <article>
              <span aria-hidden="true">&#128666;</span>
              <h3>Free UK delivery</h3>
              <p>Delivery guidance is included before the sale is confirmed.</p>
              <strong>Free</strong>
            </article>
            <article>
              <span aria-hidden="true">&#128336;</span>
              <h3>60-night check</h3>
              <p>Time to understand the support and comfort profile at home.</p>
              <strong>60 nights</strong>
            </article>
            <article>
              <span aria-hidden="true">&#128737;</span>
              <h3>1-year guarantee</h3>
              <p>Manufacturing cover and clear support for the launch range.</p>
              <strong>1 year</strong>
            </article>
            <article>
              <span aria-hidden="true">&#128179;</span>
              <h3>0% finance</h3>
              <p>Interest-free finance options can be discussed before ordering.</p>
              <strong>Available</strong>
            </article>
          </div>
        </section>

        <section className="lp-reviews" id="reviews" aria-labelledby="reviews-title">
          <div className="lp-section-head">
            <span>Real sleepers, real results</span>
            <h2 id="reviews-title">What customers say</h2>
          </div>
          <div className="lp-review-grid">
            {reviews.map((review) => (
              <article key={review.name}>
                <span className="lp-review-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                <p>&ldquo;{review.text}&rdquo;</p>
                <div>
                  <strong>{review.initial}</strong>
                  <span>
                    <b>{review.name}</b>
                    <small>&#10003; Verified purchase</small>
                    <em>{review.condition}</em>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="lp-certs" aria-labelledby="certs-title">
          <div className="lp-section-head lp-section-head-dark">
            <span>Accreditations & certifications</span>
            <h2 id="certs-title">Trusted by independent standards</h2>
          </div>
          <div className="lp-marquee" aria-label="Certification list">
            <div>
              {[...certifications, ...certifications].map(([name, note], index) => (
                <article key={`${name}-${index}`}>
                  <span aria-hidden="true">{name === "Green Organisation" ? "GO" : "ISO"}</span>
                  <strong>{name}</strong>
                  <small>{note}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-faq" id="faq" aria-labelledby="faq-title">
          <div className="lp-section-head">
            <span>Your questions, answered</span>
            <h2 id="faq-title">Everything you need to know</h2>
            <p>Helpful answers about {item.shortName} before you commit.</p>
          </div>
          <div className="lp-faq-grid">
            {item.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
            <details>
              <summary>What sizes are available?</summary>
              <p>Single, Double, King and Super King options can be discussed through WhatsApp before ordering.</p>
            </details>
            <details>
              <summary>Can I get help choosing firmness?</summary>
              <p>Yes. Message us and we will guide you based on sleep position, comfort preference, and support needs.</p>
            </details>
          </div>
        </section>

        <section className="lp-cta" id="order" aria-labelledby="order-title">
          <div>
            <h2 id="order-title">Ready to ask about {item.shortName}?</h2>
            <p>Get direct guidance on sizes, firmness, delivery, and the current mattress sale.</p>
            <a className="lp-btn lp-btn-white" href="https://wa.me/447830376489" target="_blank" rel="noopener noreferrer">
              Open WhatsApp Consultation
            </a>
            <Link className="lp-btn lp-btn-light" href="/collections/bedroom/mattresses/">
              View Mattress Range
            </Link>
            <p className="lp-cta-note">Free UK delivery - 1-year guarantee - 0% finance available</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
