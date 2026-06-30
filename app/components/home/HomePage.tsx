"use client";

import { ChangeEvent, FormEvent, type RefObject, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { awards, blogPosts, collections, faqs, reviews } from "@/app/data/home";
import { primaryButtonClasses, secondaryButtonClasses } from "@/app/components/site/buttonClasses";
import { SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
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

type HomepageBlogPost = {
  id: number | string;
  title: string;
  excerpt: string;
  meta: string;
  href: string;
  tag: string;
  className: string;
  visual: "dining-room" | "chair-trend" | "sustainable-room";
  imageUrl?: string;
  imageAlt?: string;
};

type HomepageReview = {
  label: string;
  date: string;
  title: string;
  body: string[];
  author: string;
  initial: string;
  photoClass: string;
  photo: "living-room" | "bedroom";
};

type WordPressRendered = {
  rendered?: string;
};

type WordPressMedia = {
  alt_text?: string;
  source_url?: string;
  media_details?: {
    sizes?: Record<string, { source_url?: string }>;
  };
};

type WordPressTerm = {
  name?: string;
  slug?: string;
};

type WordPressPost = {
  id: number;
  slug?: string;
  date?: string;
  link?: string;
  title?: WordPressRendered;
  excerpt?: WordPressRendered;
  _embedded?: {
    "wp:featuredmedia"?: WordPressMedia[];
    "wp:term"?: WordPressTerm[][];
  };
};

type WordPressReviewPost = {
  date?: string;
  modified?: string;
  content?: WordPressRendered;
};

type NewsletterErrors = {
  email?: string;
  firstName?: string;
  form?: string;
};

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}$/i;
const namePattern = /^[A-Za-z][A-Za-z' -]{0,39}$/;

function normalizeSpaces(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function hasValidEmailParts(email: string) {
  const [localPart, domainPart] = email.split("@");

  if (!localPart || !domainPart || localPart.length > 64 || domainPart.length > 253) {
    return false;
  }

  if (localPart.startsWith(".") || localPart.endsWith(".") || localPart.includes("..")) {
    return false;
  }

  const domainLabels = domainPart.split(".");
  if (domainLabels.length < 2 || domainLabels.some((label) => !label)) {
    return false;
  }

  return domainLabels.every((label) => {
    return !label.startsWith("-") && !label.endsWith("-") && /^[a-z0-9-]+$/i.test(label);
  });
}

function validateNewsletter(emailValue: string, firstNameValue: string, websiteValue: string): NewsletterErrors {
  const email = emailValue.trim().toLowerCase();
  const firstName = normalizeSpaces(firstNameValue);
  const errors: NewsletterErrors = {};

  if (websiteValue.trim()) {
    errors.form = "We could not process this request. Please try again.";
  }

  if (!email) {
    errors.email = "Email address is required.";
  } else if (email.length > 80) {
    errors.email = "Email address must be 80 characters or fewer.";
  } else if (!emailPattern.test(email) || !hasValidEmailParts(email)) {
    errors.email = "Enter a valid email address, for example name@example.com.";
  }

  if (firstName && !namePattern.test(firstName)) {
    errors.firstName = "Use letters, spaces, apostrophes, or hyphens only. Max 40 characters.";
  }

  return errors;
}

function decodeHtml(value: string) {
  if (typeof window === "undefined") return value;

  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function stripHtml(value: string) {
  if (typeof window === "undefined") return value;

  const doc = new DOMParser().parseFromString(value, "text/html");
  return decodeHtml(doc.body.textContent?.replace(/\s+/g, " ").trim() ?? "");
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function formatPostMeta(date?: string, tag?: string) {
  const fallback = tag ? `Latest - ${tag}` : "Latest";
  if (!date) return fallback;

  return `${new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))}${tag ? ` - ${tag}` : ""}`;
}

function formatReviewDate(date?: string) {
  if (!date) return "Verified review";

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function reviewTitleFromBody(body: string) {
  const firstSentence = body.split(/[.!?]/)[0]?.trim();
  if (!firstSentence) return "Verified customer review";
  return truncateText(firstSentence, 58);
}

function cleanReviewText(value: string) {
  return value
    .replace(/^[\s⭐★]+/u, "")
    .replace(/^["“]+/, "")
    .replace(/["”]+$/, "")
    .trim();
}

function parseWordPressReviews(html: string, date?: string): HomepageReview[] {
  if (typeof window === "undefined") return [];

  const doc = new DOMParser().parseFromString(html, "text/html");
  const paragraphs = Array.from(doc.querySelectorAll("p"))
    .map((paragraph) => decodeHtml(paragraph.textContent?.replace(/\s+/g, " ").trim() ?? ""))
    .filter(Boolean);

  const parsed: HomepageReview[] = [];

  for (let index = 0; index < paragraphs.length - 1; index += 2) {
    const quote = cleanReviewText(paragraphs[index]);
    const authorLine = paragraphs[index + 1]?.trim();

    if (!quote || !authorLine || quote.length < 24) continue;

    const [authorName, location] = authorLine.split(",").map((part) => part.trim());
    const author = authorName || authorLine;
    const locationLabel = location ? `, ${location}` : "";

    parsed.push({
      label: index === 0 ? "Featured Review" : "Customer Review",
      date: formatReviewDate(date),
      title: reviewTitleFromBody(quote),
      body: [quote],
      author: `${author}${locationLabel}`,
      initial: author.charAt(0).toUpperCase() || "C",
      photoClass: index % 2 === 0 ? "rc-photo-a" : "rc-photo-b",
      photo: index % 2 === 0 ? "living-room" : "bedroom",
    });
  }

  return parsed;
}

function getFeaturedImage(media?: WordPressMedia) {
  return (
    media?.media_details?.sizes?.medium_large?.source_url ??
    media?.media_details?.sizes?.medium?.source_url ??
    media?.source_url
  );
}

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function scrollCarousel(ref: RefObject<HTMLElement | null>, direction: -1 | 1) {
  const element = ref.current;
  if (!element) return;

  element.scrollBy({
    left: direction * element.clientWidth * 0.86,
    behavior: "smooth",
  });
}

function mapWordPressPost(post: WordPressPost, index: number): HomepageBlogPost {
  const tag = post._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "Blog";
  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  return {
    id: post.id,
    title: decodeHtml(stripHtml(post.title?.rendered ?? "Untitled post")),
    excerpt: truncateText(stripHtml(post.excerpt?.rendered ?? ""), 145),
    meta: formatPostMeta(post.date, tag),
    href: post.slug ? `/blog/${encodeURIComponent(post.slug)}/` : "/blog/",
    tag,
    className: blogPosts[index]?.className ?? "bc-a",
    visual: blogPosts[index]?.visual ?? "dining-room",
    imageUrl: getFeaturedImage(media),
    imageAlt: media?.alt_text || stripHtml(post.title?.rendered ?? "Blog post image"),
  };
}

function isReviewCategoryPost(post: WordPressPost) {
  return Boolean(
    post._embedded?.["wp:term"]?.some((termGroup) =>
      termGroup.some((term) => {
        const name = term.name?.toLowerCase();
        const slug = term.slug?.toLowerCase();
        return name === "reviews" || slug === "reviews";
      }),
    ),
  );
}

function Hero() {
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!bookingOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBookingOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [bookingOpen]);

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
          <button className={`btn btn-s ${secondaryButtonClasses}`} type="button" onClick={() => setBookingOpen(true)}>
            Free Consultation
          </button>
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
      {bookingOpen ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setBookingOpen(false)}>
          <form
            className="booking-modal"
            aria-labelledby="booking-title"
            onSubmit={(event) => {
              event.preventDefault();
              setBookingOpen(false);
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" aria-label="Close consultation booking" onClick={() => setBookingOpen(false)}>
              x
            </button>
            <span className="modal-kicker">Free Consultation</span>
            <h3 id="booking-title">Choose a date and time</h3>
            <div className="booking-grid">
              <label>
                Date
                <input type="date" name="consultation-date" min={todayInputValue()} required />
              </label>
              <label>
                Time
                <select name="consultation-time" defaultValue="10:00" required>
                  <option value="10:00">10:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                </select>
              </label>
            </div>
            <label className="booking-field">
              Email address
              <input type="email" name="consultation-email" placeholder="you@example.com" required />
            </label>
            <button className={`btn btn-p ${primaryButtonClasses}`} type="submit">
              Confirm Time
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}

function Collections() {
  return (
    <section className="collections" id="collections" aria-labelledby="coll-h">
      <div className="wrap">
        <div className="coll-wrap">
          <a href="#contact" className="feat-card rv" aria-label="Ask about Nordic Lounge Chair, Best Seller">
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
              <a href="#collections" className="sec-lnk sec-lnk-lt rv" aria-label="View all collections">
                View All
              </a>
            </div>
            <div className="coll-grid" role="list">
              {collections.map((collection, index) => (
                <a
                  href="#contact"
                  className="cc rv"
                  role="listitem"
                  aria-label={`${collection.name}, ${collection.count}`}
                  style={{ transitionDelay: `${index * 0.08}s` }}
                  key={collection.name}
                >
                  <div className={`cc-thumb ${collection.className}`} aria-hidden="true">
                    <span className={`cc-badge${collection.name === "Bedroom" ? " cc-badge-live" : ""}`}>
                      {collection.badge}
                    </span>
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
    <section className="stats" id="stats" aria-labelledby="stats-h">
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
      <div className="wrap">
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
  const sliderRef = useRef<HTMLDivElement>(null);
  const [reviewItems, setReviewItems] = useState<HomepageReview[]>(reviews.map((review) => ({ ...review })));

  useEffect(() => {
    const controller = new AbortController();
    const reviewsUrl = new URL("https://peru-armadillo-169520.hostingersite.com/wp-json/wp/v2/posts");
    reviewsUrl.searchParams.set("slug", "852-2");
    reviewsUrl.searchParams.set("_", String(Date.now()));

    async function loadWordPressReviews() {
      try {
        const response = await fetch(reviewsUrl.toString(), {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = (await response.json()) as WordPressReviewPost[];
        const post = data[0];
        const nextReviews = post?.content?.rendered
          ? parseWordPressReviews(post.content.rendered, post.modified ?? post.date)
          : [];

        if (nextReviews.length) {
          setReviewItems(nextReviews);
        }
      } catch {
        // Keep the local fallback reviews when WordPress is unavailable.
      }
    }

    loadWordPressReviews();

    return () => controller.abort();
  }, []);

  return (
    <section className="why" id="reviews" aria-labelledby="why-h">
      <div className="wrap">
        <div className="sec-hdr">
          <div>
            <span className="sec-lbl">Customer Stories</span>
            <h2 className="h2dk rv" id="why-h">Why Choose Us</h2>
          </div>
          <div className="carousel-actions" aria-label="Review carousel controls">
            <button type="button" aria-label="Previous review" onClick={() => scrollCarousel(sliderRef, -1)}>
              &larr;
            </button>
            <button type="button" aria-label="Next review" onClick={() => scrollCarousel(sliderRef, 1)}>
              &rarr;
            </button>
          </div>
        </div>
        <div className="why-grid carousel-track" ref={sliderRef}>
          {reviewItems.map((review, index) => (
            <article className="rc rv" style={{ transitionDelay: `${index * 0.1}s` }} key={review.title}>
              <div>
                <span className="rc-lbl">{review.label}</span>
                <span className="rc-date">{review.date}</span>
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
  const sliderRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<HomepageBlogPost[]>(
    [...blogPosts, ...blogPosts].map((post) => ({
      id: post.title,
      title: post.title,
      excerpt: post.excerpt,
      meta: post.meta,
      href: `/blog/${post.slug}/`,
      tag: post.tag,
      className: post.className,
      visual: post.visual,
    })).slice(0, 6).map((post, index) => ({ ...post, id: `${post.id}-${index}` })),
  );

  useEffect(() => {
    const controller = new AbortController();
    const postsUrl = new URL("https://peru-armadillo-169520.hostingersite.com/wp-json/wp/v2/posts");
    postsUrl.searchParams.set("per_page", "6");
    postsUrl.searchParams.set("_embed", "1");
    postsUrl.searchParams.set("categories_exclude", "31");
    postsUrl.searchParams.set("orderby", "date");
    postsUrl.searchParams.set("order", "desc");
    postsUrl.searchParams.set("_", String(Date.now()));

    async function loadWordPressPosts() {
      try {
        const response = await fetch(postsUrl.toString(), {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = (await response.json()) as WordPressPost[];
        if (!Array.isArray(data) || data.length === 0) return;

        const blogOnlyPosts = data.filter((post) => !isReviewCategoryPost(post)).slice(0, 6);
        if (!blogOnlyPosts.length) return;

        setPosts(blogOnlyPosts.map(mapWordPressPost));
      } catch {
        // Keep the local fallback cards when the WordPress host rejects a browser request.
      }
    }

    loadWordPressPosts();

    return () => controller.abort();
  }, []);

  return (
    <section className="blog" id="blog" aria-labelledby="blog-h">
      <div className="wrap">
        <div className="sec-hdr rv">
          <div>
            <span className="sec-lbl sec-lbl-lt">Ideas &amp; Inspiration</span>
            <h2 className="h2lt" id="blog-h">From Our Blog</h2>
          </div>
          <div className="blog-head-actions">
            <div className="carousel-actions carousel-actions-lt" aria-label="Blog carousel controls">
              <button type="button" aria-label="Previous blog post" onClick={() => scrollCarousel(sliderRef, -1)}>
                &larr;
              </button>
              <button type="button" aria-label="Next blog post" onClick={() => scrollCarousel(sliderRef, 1)}>
                &rarr;
              </button>
            </div>
            <Link href="/blog/" className="sec-lnk sec-lnk-lt" aria-label="View all blog articles">View All</Link>
          </div>
        </div>
        <div className="blog-grid carousel-track" ref={sliderRef}>
          {posts.map((post, index) => (
            <Link
              className="bc rv"
              href={post.href}
              style={{ transitionDelay: `${index * 0.1}s` }}
              key={post.id}
              aria-label={`Read blog post: ${post.title}`}
            >
              <div
                className={`bc-thumb ${post.className}${post.imageUrl ? " bc-thumb-photo" : ""}`}
                role="img"
                aria-label={post.imageAlt ?? post.title}
                style={post.imageUrl ? { backgroundImage: `url(${post.imageUrl})` } : undefined}
              >
                {!post.imageUrl ? (
                  <BlogVisual kind={post.visual} />
                ) : null}
              </div>
              <div className="bc-body">
                <span className="bc-tag">{post.tag}</span>
                <h3 className="bc-head">{post.title}</h3>
                <p className="bc-exc">{post.excerpt}</p>
                <p className="bc-meta">{post.meta}</p>
              </div>
            </Link>
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
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<NewsletterErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!showSuccess) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSuccess(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showSuccess]);

  function onEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value.slice(0, 80));
    setErrors((current) => ({ ...current, email: undefined, form: undefined }));
  }

  function onFirstNameChange(event: ChangeEvent<HTMLInputElement>) {
    setFirstName(event.target.value.slice(0, 40));
    setErrors((current) => ({ ...current, firstName: undefined, form: undefined }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateNewsletter(email, firstName, website);

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    setEmail("");
    setFirstName("");
    setWebsite("");
    setErrors({});
    setShowSuccess(true);
  }

  return (
    <section className="bottom" id="contact" aria-labelledby="nl-h">
      <div className="wrap">
        <div className="bot-grid">
          <div className="nl rv">
            <span className="nl-tag">Stay in the Loop</span>
            <h3 id="nl-h">New arrivals, ideas &amp; exclusive offers</h3>
            <form className="nl-form" onSubmit={onSubmit} noValidate aria-label="Newsletter sign-up">
              {errors.form ? (
                <p className="form-alert" role="alert">
                  {errors.form}
                </p>
              ) : null}
              <div className="fg">
                <label htmlFor="nl-email">Email address <span aria-hidden="true" className="req">*</span></label>
                <input
                  type="email"
                  id="nl-email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                  maxLength={80}
                  pattern="[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,24}"
                  required
                  aria-required="true"
                  aria-describedby="nl-err"
                  aria-invalid={errors.email ? "true" : "false"}
                  value={email}
                  onChange={onEmailChange}
                  onBlur={() => setEmail((value) => value.trim().toLowerCase())}
                />
                <span className={`f-err${errors.email ? " show" : ""}`} id="nl-err" role="alert" aria-live="polite">
                  {errors.email}
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
                  maxLength={40}
                  pattern="[A-Za-z][A-Za-z' -]{0,39}"
                  aria-describedby="nl-name-err"
                  aria-invalid={errors.firstName ? "true" : "false"}
                  value={firstName}
                  onChange={onFirstNameChange}
                  onBlur={() => setFirstName((value) => normalizeSpaces(value))}
                />
                <span className={`f-err${errors.firstName ? " show" : ""}`} id="nl-name-err" role="alert" aria-live="polite">
                  {errors.firstName}
                </span>
              </div>
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="nl-website">Website</label>
                <input
                  type="text"
                  id="nl-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </div>
              <button type="submit" className={`btn btn-p ${primaryButtonClasses}`}>
                Subscribe - It Is Free
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
              <div className="map-hours-table" aria-label="Opening times">
                <div className="map-hours-row">
                  <span>Monday-Friday</span>
                  <strong>10am-7pm</strong>
                </div>
                <div className="map-hours-row">
                  <span>Saturday</span>
                  <strong>10am-6pm</strong>
                </div>
                <div className="map-hours-row">
                  <span>Sunday</span>
                  <strong>By appointment</strong>
                </div>
              </div>
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
      {showSuccess ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowSuccess(false)}>
          <div
            className="success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscribe-success-title"
            aria-describedby="subscribe-success-copy"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" aria-label="Close subscription confirmation" onClick={() => setShowSuccess(false)}>
              x
            </button>
            <span className="modal-kicker">Subscribed</span>
            <h3 id="subscribe-success-title">Thank you for subscribing.</h3>
            <p id="subscribe-success-copy">
              Your form has been cleared. New arrivals, design ideas, and exclusive offers will be sent to your inbox.
            </p>
            <button className={`btn btn-p ${primaryButtonClasses}`} type="button" onClick={() => setShowSuccess(false)}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </section>
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
      <SiteHeader />
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
      <SiteFooter />
      <BackToTop />
    </>
  );
}
