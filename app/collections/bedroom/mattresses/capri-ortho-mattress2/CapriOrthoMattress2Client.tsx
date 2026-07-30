"use client";

import { useState } from "react";
import styles from "./capriOrthoMattress2.module.css";

const wordpressReviewsUrl = "https://peru-armadillo-169520.hostingersite.com/852-2/";

const specs = [
  ["26cm", "Total Depth"],
  ["2x", "Double-Sided"],
  ["UK", "Handcrafted"],
];

const footerSpecs = [
  ["26cm", "Total Depth"],
  ["2", "Usable Sides"],
  ["UK", "Handmade"],
  ["3", "Sizes"],
];

const faqs = [
  ["Will the Capri Ortho help with my back pain?", "The orthopaedic open coil spring system with wire edge support is designed to maintain spinal alignment and provide a firmer, more stable sleep surface."],
  ["How do I care for a double-sided mattress?", "Flip every three months and rotate 180 degrees every six weeks so both usable sides wear evenly."],
  ["What mattress sizes are available?", "Single, Double, and King are available in the current landing-page selector."],
  ["Is it compatible with my existing bed frame?", "Yes. It works with slatted bases, divans, and platform beds. Slat spacing should stay close enough to support the spring unit."],
  ["How long will delivery take?", "Free standard delivery is positioned as 3-5 working days, with order details confirmed before checkout."],
  ["What is the mattress made from?", "Quality damask fabric, deep polyester comfort filling, an orthopaedic open coil spring unit, wire edge support, and traditional deep tufts."],
  ["Is the Capri Ortho suitable for all sleeping positions?", "The medium-firm orthopaedic support is suitable for back, side, and combination sleepers who prefer a stable feel."],
  ["How long should a mattress last?", "With proper care, the double-sided construction is designed to provide long-term support by distributing wear across both sides."],
];

const sizes = {
  single: { label: "Single", dim: "90 x 190cm", price: 299, old: 349, base: 199 },
  double: { label: "Double", dim: "135 x 190cm", price: 379, old: 449, base: 249 },
  king: { label: "King", dim: "150 x 200cm", price: 449, old: 529, base: 299 },
};

type SizeKey = keyof typeof sizes;

function FabricVisual() {
  return (
    <div className={styles.fabricVisual} aria-hidden="true">
      <div className={styles.fabricBlock}>
        <span>Quality damask fabric</span>
      </div>
      <div className={styles.fabricSample} />
      <small>Soft-touch woven damask surface</small>
    </div>
  );
}

function SpringVisual() {
  return (
    <div className={styles.springVisual} aria-hidden="true">
      <span className={styles.springNumber}>02</span>
      <strong>Open coil spring unit - cross-section</strong>
      <div className={styles.springRail} />
      <svg className={styles.springFrame} viewBox="0 0 620 470" role="img" aria-label="Open coil spring cross-section">
        {[70, 170, 270, 370, 470, 570].map((x) => (
          <path
            key={x}
            d={`M ${x} 0 C ${x + 20} 38 ${x + 20} 70 ${x} 105 C ${x - 18} 135 ${x - 18} 170 ${x} 205 C ${x + 20} 240 ${x + 20} 275 ${x} 310 C ${x - 18} 345 ${x - 18} 380 ${x} 415 C ${x + 12} 438 ${x + 12} 456 ${x} 470`}
          />
        ))}
        {[120, 235, 350, 465].map((y) => (
          <line key={y} x1="40" y1={y} x2="590" y2={y} />
        ))}
      </svg>
      <div className={styles.springRail} />
      <span className={styles.coilLabel}>
        <b>Open Coil Spring</b>
        <small>Orthopaedic grade</small>
      </span>
      <span className={styles.edgeLabel}>
        <b>Wire Edge Border</b>
        <small>Full perimeter support</small>
      </span>
    </div>
  );
}

function FillingVisual() {
  return (
    <div className={styles.fillingVisual} aria-hidden="true">
      <span>Quality damask cover</span>
      <span>Deep polyester filling</span>
      <span>Orthopaedic open coil springs</span>
      <span>Base damask cover</span>
    </div>
  );
}

function TuftVisual() {
  return (
    <div className={styles.tuftVisual} aria-hidden="true">
      <div>
        {Array.from({ length: 15 }).map((_, index) => <i key={index} />)}
      </div>
      <span>Deep tufts lock the mattress layers in place</span>
    </div>
  );
}

function UkVisual() {
  return (
    <div className={styles.ukVisual} aria-hidden="true">
      <div className={styles.ukFlag}>
        <i />
        <b />
        <span />
      </div>
      <strong>Made in the United Kingdom</strong>
      <small>Hand-built by skilled UK craftspeople</small>
    </div>
  );
}

function DoubleSideVisual() {
  return (
    <div className={styles.doubleVisual} aria-hidden="true">
      <div className={styles.sideCard}>
        <span>Side A</span>
        <b>Sleep surface</b>
      </div>
      <div className={styles.rotatePills}>
        <span>Flip every 3 months</span>
        <span>Rotate every 6 weeks</span>
      </div>
      <div className={styles.sideCard}>
        <span>Side B</span>
        <b>Usable support</b>
      </div>
    </div>
  );
}

export default function CapriOrthoMattress2Client() {
  const [selectedSize, setSelectedSize] = useState<SizeKey>("single");
  const [baseAdded, setBaseAdded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const size = sizes[selectedSize];
  const total = size.price + (baseAdded ? size.base : 0);

  return (
    <main className={styles.page}>
      <section className={`${styles.panel} ${styles.hero}`} id="hero">
        <div className={styles.heroImage}>
          <img src="/capri-ortho-product.webp" alt="Capri Ortho Mattress close-up product view" />
        </div>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>UK-handcrafted orthopaedic mattress</span>
          <h1>Capri <em>Ortho</em></h1>
          <p>
            Wake up without the ache. Medium-firm orthopaedic support, quality damask fabric,
            and traditional craftsmanship built to last in Britain.
          </p>
          <div className={styles.statRow} role="list">
            {specs.map(([value, label]) => (
              <div role="listitem" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p className={styles.price}>From <strong>£299</strong> + Free UK delivery</p>
          <div className={styles.actions}>
            <a className={styles.primaryBtn} href="#order">Order Now</a>
            <a className={styles.darkBtn} href="#fabric">Discover How</a>
          </div>
        </div>
        <div className={styles.heroBadges} aria-hidden="true">
          <span>Open Coil Springs</span>
          <span>Medium Firm</span>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.lightPanel}`} id="fabric">
        <div className={styles.visualCol}><FabricVisual /></div>
        <div className={styles.copyCol}>
          <span className={styles.eyebrow}>01 - Fabric</span>
          <h2>Quality <em>Damask</em> Fabric</h2>
          <p>A quality woven damask finish, soft to the touch, refined in look, and built to last.</p>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.darkPanel}`} id="spring">
        <div className={styles.copyCol}>
          <span className={styles.eyebrow}>02 - Support</span>
          <h2>Orthopaedic Open Coil <em>Spring System</em></h2>
          <p>Open coil springs with full wire edge support deliver firm, consistent support to the very edge.</p>
        </div>
        <div className={styles.visualCol}><SpringVisual /></div>
      </section>

      <section className={`${styles.panel} ${styles.lightPanel}`} id="filling">
        <div className={styles.visualCol}><FillingVisual /></div>
        <div className={styles.copyCol}>
          <span className={styles.eyebrow}>03 - Comfort</span>
          <h2>Deep <em>Polyester</em> Filling</h2>
          <p>Deep polyester filling cushions shoulders, hips, and knees while the springs hold firm beneath.</p>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.bluePanel}`} id="tufts">
        <div className={styles.copyCol}>
          <span className={styles.eyebrow}>04 - Structure</span>
          <h2>Deep <em>Tufts</em> for Lasting Support</h2>
          <p>Hand-placed through the full 26cm depth, locking every layer so filling never shifts.</p>
        </div>
        <div className={styles.visualCol}><TuftVisual /></div>
      </section>

      <section className={`${styles.panel} ${styles.lightPanel}`} id="craft">
        <div className={styles.visualCol}><UkVisual /></div>
        <div className={styles.copyCol}>
          <span className={styles.eyebrow}>05 - Heritage</span>
          <h2>Expertly Crafted in the <em>UK</em></h2>
          <p>Hand-built in the UK by craftspeople with decades of mattress-making expertise.</p>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.darkPanel}`} id="double-sided">
        <div className={styles.copyCol}>
          <span className={styles.eyebrow}>06 - Longevity</span>
          <h2><em>Double-Sided</em> for Twice the Life</h2>
          <p>Fully finished on both sides. Flip and rotate to double the mattress lifespan.</p>
        </div>
        <div className={styles.visualCol}><DoubleSideVisual /></div>
      </section>

      <section className={`${styles.panel} ${styles.comparePanel}`} id="compare">
        <div className={styles.sectionHead}>
          <h2>How It Compares to <em>Single-Sided Foam</em> Mattress</h2>
          <p>Most modern mattresses are single-sided memory foam. Here is what trade-off actually means for your sleep.</p>
        </div>
        <div className={styles.compareGrid}>
          <article>
            <h3>Capri Ortho</h3>
            <strong>Open Coil + Double-Sided</strong>
            <ul>
              <li>Usable on both sides</li>
              <li>Open coil spring edge support</li>
              <li>Firm orthopaedic feel</li>
              <li>Hand-tufted UK construction</li>
            </ul>
          </article>
          <article>
            <h3>Typical single-sided foam</h3>
            <strong>Single-use foam core</strong>
            <ul>
              <li>One usable sleep surface</li>
              <li>Can trap heat</li>
              <li>Edges may compress over time</li>
              <li>Cannot be flipped for wear balance</li>
            </ul>
          </article>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.specPanel}`} id="specification">
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>08 - Specification</span>
          <h2>Approx. <em>26cm</em> Mattress Depth</h2>
          <p>26cm of construction gives every layer room to perform.</p>
        </div>
        <div className={styles.specStrip} role="list">
          {footerSpecs.map(([value, label]) => (
            <div role="listitem" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <a className={styles.darkBtn} href="#order">Order Capri Ortho</a>
          <a className={styles.primaryBtn} href={wordpressReviewsUrl} target="_blank" rel="noopener noreferrer">Read Reviews</a>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.reviewsPanel}`} id="reviews">
        <div className={styles.reviewLinkCard}>
          <span className={styles.eyebrow}>Real customers, real results</span>
          <h2>What Our Customers Say</h2>
          <p>The review section on this landing page now links to the main WordPress reviews, as requested.</p>
          <a className={styles.primaryBtn} href={wordpressReviewsUrl} target="_blank" rel="noopener noreferrer">Open Main WordPress Reviews</a>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.faqPanel}`} id="faq">
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Your questions answered</span>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know before you buy, no jargon, just honest answers.</p>
        </div>
        <div className={styles.faqGrid}>
          {faqs.map(([question, answer], index) => {
            const open = openFaq === index;
            return (
              <article className={styles.faqItem} key={question}>
                <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : index)}>
                  <span>{question}</span>
                  <b aria-hidden="true">+</b>
                </button>
                <div className={styles.faqBody} aria-hidden={!open}>
                  <p>{answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={`${styles.panel} ${styles.orderPanel}`} id="order">
        <div className={styles.orderInner}>
          <span className={styles.eyebrow}>Choose your Capri Ortho</span>
          <h2>Choose Your <em>Size</em></h2>
          <p>Free delivery on all sizes. 30-day returns. Every mattress hand-built in the UK.</p>
          <div className={styles.sizeGrid} role="group" aria-label="Choose mattress size">
            {(Object.entries(sizes) as Array<[SizeKey, typeof sizes[SizeKey]]>).map(([key, option]) => (
              <button
                type="button"
                key={key}
                className={selectedSize === key ? styles.selectedSize : ""}
                onClick={() => setSelectedSize(key)}
              >
                <span>{option.label}</span>
                <small>{option.dim}</small>
                <strong>£{option.price}</strong>
                <em>£{option.old}</em>
              </button>
            ))}
          </div>
          <label className={styles.addon}>
            <input type="checkbox" checked={baseAdded} onChange={(event) => setBaseAdded(event.target.checked)} />
            <span>
              <b>Add a Matching Divan Base</b>
              <small>Solid platform base in matching fabric, same size as your mattress.</small>
            </span>
            <strong>+ £{size.base}</strong>
          </label>
          <div className={styles.summary} aria-live="polite">
            <span>Your order: Capri Ortho {size.label}{baseAdded ? " + Divan Base" : ""}</span>
            <strong>£{total}</strong>
          </div>
          <div className={styles.actions}>
            <button className={styles.goldBtn} type="button">Add to Basket</button>
            <a className={styles.secondaryBtn} href="tel:+441234567890">Call to Order</a>
          </div>
        </div>
      </section>
    </main>
  );
}
