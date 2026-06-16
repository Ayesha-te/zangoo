"use client";

import { FormEvent, useEffect, useState } from "react";
import { awards, blogPosts, collections, faqs, navLinks, reviews } from "@/app/data/home";
import {
  AwardIcon,
  BlogVisual,
  ChairMedalVisual,
  CollectionIcon,
  FeaturedChairIcon,
  MapPinIcon,
  ReviewVisual,
  SofaIllustration,
} from "./Illustrations";

const primaryButtonClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-[#1557A7] bg-[#1557A7] px-6 py-2.5 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:border-[#0F4690] hover:bg-[#0F4690] focus-visible:-translate-y-0.5 focus-visible:border-[#0F4690] focus-visible:bg-[#0F4690]";
const secondaryButtonClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-[#1A2E44] bg-transparent px-6 py-2.5 text-[15px] font-semibold text-[#1A2E44] transition hover:-translate-y-0.5 hover:bg-[#1A2E44] hover:text-white focus-visible:-translate-y-0.5 focus-visible:bg-[#1A2E44] focus-visible:text-white";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header>
      <nav className={`nav${scrolled ? " up" : ""}`} aria-label="Main navigation">
        <div className="nav-in">
          <a href="/" className="nav-logo" aria-label="Furniture Co. home">
            Furniture Co.
          </a>
          <ul className="nav-links" role="list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={link.active ? "act" : undefined} aria-current={link.active ? "page" : undefined}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="nav-cta inline-flex min-h-11 shrink-0 items-center rounded-lg border border-[#1557A7] px-4 py-2 text-sm font-semibold text-[#1557A7] transition hover:bg-[#1557A7] hover:text-white">
            Book Consultation
          </a>
          <button
            className="hbg"
            aria-expanded={menuOpen}
            aria-controls="mob"
            aria-label="Toggle menu"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      <div className={`mob-menu${menuOpen ? " open" : ""}`} id="mob" hidden={!menuOpen} aria-label="Mobile navigation">
        <ul className="mob-links" role="list">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={link.active ? "act" : undefined}
                aria-current={link.active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" className={`${primaryButtonClasses} mob-cta`} onClick={() => setMenuOpen(false)}>
          Book Free Consultation
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="h1">
      <div className="hero-txt">
        <span className="hero-eye">Award-Winning &bull; Sustainably Crafted</span>
        <h1 id="h1">
          Timeless Furniture
          <br />
          Designed For <em>Modern Living</em>
        </h1>
        <p className="hero-sub">
          Sustainably crafted pieces that balance comfort, durability, and contemporary design - furniture built to grow with your life.
        </p>
        <div className="hero-stars" role="img" aria-label="Rated 4.9 out of 5 by over 15,000 homeowners">
          <span className="stars" aria-hidden="true">
            &#9733;&#9733;&#9733;&#9733;&#9733;
          </span>
          <span className="rating-text">4.9 &bull; 15,000+ verified reviews</span>
        </div>
        <div className="hero-btns">
          <a href="#collections" className={`btn btn-p ${primaryButtonClasses}`}>
            Shop Collection
          </a>
          <a href="#contact" className={`btn btn-s ${secondaryButtonClasses}`}>
            Free Consultation
          </a>
        </div>
      </div>
      <div className="hero-vis" role="img" aria-label="Modern living room with a pale blue sofa, wooden coffee table and floor lamp">
        <div className="hero-sofa">
          <SofaIllustration />
        </div>
        <div className="hero-badge" aria-hidden="true">
          <i><AwardIcon kind="trophy" /></i>
          <div>
            <strong>Which? Best Buy 2024</strong>
            <s>Award-winning retailer</s>
          </div>
        </div>
        <div className="hero-trust" aria-hidden="true">
          FSC Certified &bull; Carbon Neutral
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll</span>
        <svg viewBox="0 0 24 24">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}

function Collections() {
  return (
    <section className="collections" id="collections" aria-labelledby="coll-h">
      <div className="wrap">
        <div className="coll-wrap">
          <a href="#" className="feat-card rv" aria-label="Shop Nordic Lounge Chair, Best Seller">
            <div className="feat-thumb" aria-hidden="true">
              <FeaturedChairIcon />
            </div>
            <div className="feat-info">
              <span className="feat-tag">Best Seller</span>
              <p className="feat-name">Nordic Lounge Chair</p>
              <p className="feat-sub">Explore trending styles</p>
              <span className={`btn btn-p btn-sm ${primaryButtonClasses}`} aria-hidden="true">
                Open Store
              </span>
            </div>
          </a>
          <div>
            <div className="sec-hdr">
              <div>
                <span className="sec-lbl sec-lbl-lt">Browse by Room</span>
                <h2 className="h2lt rv" id="coll-h">
                  Explore Our Collections
                </h2>
              </div>
              <a href="#" className="sec-lnk sec-lnk-lt rv" aria-label="View all collections">
                View All
              </a>
            </div>
            <div className="coll-grid" role="list">
              {collections.map((collection, index) => (
                <a
                  href="#"
                  className="cc rv"
                  role="listitem"
                  aria-label={`${collection.name}, ${collection.count}`}
                  style={{ transitionDelay: `${index * 0.08}s` }}
                  key={collection.name}
                >
                  <div className={`cc-thumb ${collection.className}`} aria-hidden="true">
                    <CollectionIcon kind={collection.kind} />
                  </div>
                  <div className="cc-info">
                    <p className="cc-name">{collection.name}</p>
                    <p className="cc-count">{collection.count}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="stats" aria-labelledby="stats-h">
      <div className="wrap">
        <div className="sec-hdr">
          <div>
            <span className="sec-lbl">Proof in Numbers</span>
            <h2 className="h2dk rv" id="stats-h">
              What Our Customers Say
            </h2>
          </div>
        </div>
        <div className="stats-grid">
          <div className="sc rv">
            <p className="sc-num" aria-label="15,000 plus orders delivered">
              15,000+
            </p>
            <h3 className="sc-lbl">Orders Delivered</h3>
            <p className="sc-desc">Quality craftsmanship and a genuine commitment to your home.</p>
            <ul className="sc-badges" role="list">
              <li className="sc-badge"><span className="sc-dot" aria-hidden="true" />Satisfaction guaranteed</li>
              <li className="sc-badge"><span className="sc-dot" aria-hidden="true" />Sustainably sourced materials</li>
              <li className="sc-badge"><span className="sc-dot" aria-hidden="true" />10-year structural warranty</li>
            </ul>
          </div>
          <div className="sc sc-vis rv" style={{ transitionDelay: ".1s" }}>
            <div className="sc-vis-img" aria-hidden="true"><ChairMedalVisual /></div>
            <div className="sc-vis-body">
              <p className="sc-vis-lbl">Customer Satisfaction</p>
              <p className="sc-vis-num" aria-label="98 percent">98%</p>
              <p className="sc-vis-sub">From 15,000+ orders delivered.</p>
            </div>
          </div>
          <div className="sc rv" style={{ transitionDelay: ".2s" }}>
            <p className="sc-num" aria-label="4.9 out of 5 stars">4.9&#9733;</p>
            <h3 className="sc-lbl">Average Rating</h3>
            <p className="sc-desc">Exceptional attention to detail in every piece we make.</p>
            <ul className="sc-badges" role="list">
              <li className="sc-badge"><span className="sc-dot" aria-hidden="true" />Eco-friendly manufacturing</li>
              <li className="sc-badge"><span className="sc-dot" aria-hidden="true" />10-year warranty</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Awards() {
  const marqueeAwards = [...awards, ...awards];

  return (
    <section className="awards" id="awards" aria-labelledby="awards-h">
      <div className="wrap">
        <div className="awards-intro rv">
          <span className="sec-lbl">Recognition &amp; Trust</span>
          <h2 id="awards-h" className="h2dk">Awards &amp; Certifications</h2>
          <p>Independently recognised for design, sustainability, and customer experience - so you can buy with complete confidence.</p>
        </div>
      </div>
      <div className="marquee-outer" aria-label="Awards and certifications" role="region">
        <div className="marquee-track" aria-hidden="true">
          {marqueeAwards.map(([className, icon, org, name, year], index) => (
            <div className={`mq-card ${className}`} key={`${name}-${index}`}>
              <span className="mq-icon"><AwardIcon kind={icon} /></span>
              <div className="mq-body">
                <span className="mq-org">{org}</span>
                <span className="mq-name">{name}</span>
                <span className="mq-year">{year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="wrap">
        <ul className="awards-sr-list sr" role="list">
          {awards.map(([, , org, name, year]) => (
            <li key={name}>{`${org} ${name} ${year}`}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="why" aria-labelledby="why-h">
      <div className="wrap">
        <div className="sec-hdr">
          <div>
            <span className="sec-lbl">Customer Stories</span>
            <h2 className="h2dk rv" id="why-h">Why Choose Us</h2>
          </div>
        </div>
        <div className="why-grid">
          {reviews.map((review, index) => (
            <article className="rc rv" style={{ transitionDelay: `${index * 0.1}s` }} key={review.title}>
              <div>
                <span className="rc-lbl">{review.label}</span>
                <h3 className="rc-title">{review.title}</h3>
                <span className="rc-stars" role="img" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                {review.body.map((paragraph) => (
                  <p className="rc-txt" key={paragraph}>{paragraph}</p>
                ))}
                <div className="rc-auth">
                  <div className="avatar" aria-hidden="true">{review.initial}</div>
                  <div>
                    <span className="auth-name">{review.author}</span>
                    <span className="auth-vfy">&#10003; Verified Homeowner</span>
                  </div>
                </div>
              </div>
              <div className={`rc-photo ${review.photoClass}`} role="img" aria-label="Customer room" aria-hidden="true">
                <ReviewVisual kind={review.photo} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Blog() {
  return (
    <section className="blog" aria-labelledby="blog-h">
      <div className="wrap">
        <div className="sec-hdr rv">
          <div>
            <span className="sec-lbl sec-lbl-lt">Ideas &amp; Inspiration</span>
            <h2 className="h2lt" id="blog-h">From Our Blog</h2>
          </div>
          <a href="#" className="sec-lnk sec-lnk-lt" aria-label="View all blog articles">View All</a>
        </div>
        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <article className="bc rv" style={{ transitionDelay: `${index * 0.1}s` }} key={post.title}>
              <div className={`bc-thumb ${post.className}`} aria-hidden="true" role="img" aria-label={post.title}>
                <BlogVisual kind={post.visual} />
              </div>
              <div className="bc-body">
                <span className="bc-tag">{post.tag}</span>
                <h3 className="bc-head">{post.title}</h3>
                <p className="bc-exc">{post.excerpt}</p>
                <p className="bc-meta">{post.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const columns = [
    faqs.filter((_, index) => index % 2 === 0),
    faqs.filter((_, index) => index % 2 === 1),
  ];

  return (
    <section className="faq" id="faq" aria-labelledby="faq-h">
      <div className="wrap">
        <div className="faq-intro rv">
          <span className="sec-lbl">Common Questions</span>
          <h2 id="faq-h" className="h2dk">Frequently Asked Questions</h2>
          <p>Everything you need to know before you buy - answered clearly and honestly.</p>
        </div>
        <div className="faq-grid" role="list">
          {columns.map((column, columnIndex) => (
            <div className="faq-col" key={columnIndex}>
              {column.map(([question, answer]) => {
                const index = faqs.findIndex(([faqQuestion]) => faqQuestion === question);
                const isOpen = activeIndex === index;
                const answerId = `faq-answer-${index}`;

                return (
                  <div className="fi rv" role="listitem" style={{ transitionDelay: `${index * 0.06}s` }} key={question}>
                    <button
                      className="fi-btn"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      type="button"
                      onClick={() => setActiveIndex(isOpen ? null : index)}
                    >
                      <span className="fi-q">{question}</span>
                      <span className="fi-icon" aria-hidden="true">+</span>
                    </button>
                    <div className="fi-body" id={answerId} aria-hidden={!isOpen}>
                      <p className="fi-a">{answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());

    if (!valid) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSubscribed(true);
  }

  return (
    <section className="bottom" id="contact" aria-labelledby="nl-h">
      <div className="wrap">
        <div className="bot-grid">
          <div className="nl rv">
            <span className="nl-tag">Stay in the Loop</span>
            <h3 id="nl-h">New arrivals, ideas &amp; exclusive offers</h3>
            <form className="nl-form" onSubmit={onSubmit} noValidate aria-label="Newsletter sign-up">
              <div className="fg">
                <label htmlFor="nl-email">Email address <span aria-hidden="true" className="req">*</span></label>
                <input
                  type="email"
                  id="nl-email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-describedby="nl-err"
                  aria-invalid={error ? "true" : "false"}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <span className={`f-err${error ? " show" : ""}`} id="nl-err" role="alert" aria-live="polite">
                  {error}
                </span>
              </div>
              <div className="fg">
                <label htmlFor="nl-name">First name</label>
                <input
                  type="text"
                  id="nl-name"
                  name="fname"
                  placeholder="Your first name"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </div>
              <button type="submit" className={`btn btn-p ${primaryButtonClasses}${subscribed ? " subscribed" : ""}`} disabled={subscribed}>
                {subscribed ? "Subscribed! Thank you." : "Subscribe - It Is Free"}
              </button>
            </form>
            <ul className="nl-list" aria-label="Newsletter topics">
              <li>Customer stories &amp; inspiration</li>
              <li>Design trends &amp; guides</li>
              <li>Furniture care advice</li>
              <li>Exclusive subscriber discounts</li>
            </ul>
          </div>
          <address className="map-card rv map-address">
            <div className="map-vis" aria-hidden="true">
              <div className="map-grid" />
              <div className="map-pin"><MapPinIcon /></div>
            </div>
            <div className="map-info">
              <p className="map-name">Furniture Co. Showroom</p>
              <p className="map-addr">
                14 Design Quarter
                <br />
                Shoreditch, London E1 6RF
                <br />
                United Kingdom
              </p>
              <p className="map-hrs">Open Mon-Sat &bull; 10am-7pm</p>
              <a
                href="https://maps.google.com"
                className={`btn btn-s directions-btn ${secondaryButtonClasses}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get directions to our London showroom, opens Google Maps"
              >
                Get Directions
              </a>
            </div>
          </address>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer role="contentinfo">
      <div className="foot-in">
        <a href="/" className="foot-logo" aria-label="Furniture Co. home">Furniture Co.</a>
        <nav aria-label="Footer navigation">
          <ul className="foot-links" role="list">
            <li><a href="#">Customer Programme</a></li>
            <li><a href="#">Delivery Info</a></li>
            <li><a href="#">Order Tracking</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Accessibility</a></li>
          </ul>
        </nav>
        <p className="foot-copy"><small>&copy; 2026 Furniture Co. All rights reserved.</small></p>
      </div>
    </footer>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      className={`btt${visible ? " show" : ""}`}
      aria-label="Back to top of page"
      hidden={!visible}
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

function useRevealOnScroll() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const items = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    let ready = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!ready) {
            ready = true;
            items.forEach((item) => {
              const rect = item.getBoundingClientRect();
              const inView = rect.top < window.innerHeight && rect.bottom > 0;
              item.classList.toggle("anim", !inView);
              item.classList.toggle("in", inView);
            });
          }

          if (entry.isIntersecting) {
            entry.target.classList.remove("anim");
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

export function HomePage() {
  useRevealOnScroll();

  return (
    <>
      <a href="#main" className="skip">Skip to main content</a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Collections />
        <Stats />
        <Awards />
        <Reviews />
        <Blog />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
