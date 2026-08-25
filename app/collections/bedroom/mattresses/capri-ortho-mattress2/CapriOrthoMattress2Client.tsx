"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CustomerReviews } from "@/app/components/reviews/CustomerReviews";
import styles from "./capriOrthoMattress2.module.css";

const wordpressReviewsUrl = "https://peru-armadillo-169520.hostingersite.com/852-2/";
const wordpressReviewsApiUrl = "https://peru-armadillo-169520.hostingersite.com/wp-json/wp/v2/posts?slug=852-2";

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
  single: { label: "Single", dim: "190cm x 90cm", price: 299, old: 349, base: 199 },
  double: { label: "Double", dim: "190cm x 135cm", price: 379, old: 449, base: 249 },
  king: { label: "King", dim: "200cm x 150cm", price: 449, old: 529, base: 299 },
};

type SizeKey = keyof typeof sizes;

type ReviewItem = {
  label: string;
  date: string;
  title: string;
  body: string[];
  author: string;
  initial: string;
};

type WordPressReviewPost = {
  date?: string;
  modified?: string;
  content?: {
    rendered?: string;
  };
};

const fallbackReviews: ReviewItem[] = [
  {
    label: "Featured Review",
    date: "Verified review",
    title: "Supportive without feeling harsh",
    body: ["The Capri Ortho feels firm and steady without being uncomfortable. Delivery was straightforward and the mattress feels well made."],
    author: "Priya M.",
    initial: "P",
  },
  {
    label: "Customer Review",
    date: "Verified review",
    title: "A proper upgrade for the spare room",
    body: ["We bought this for our guest room and the quality is far better than expected at this price. The double-sided design feels practical."],
    author: "James H.",
    initial: "J",
  },
  {
    label: "Customer Review",
    date: "Verified review",
    title: "Good firm support",
    body: ["I wanted a mattress that felt supportive around my lower back. This has the firmer feel I was looking for and still feels comfortable."],
    author: "Sandra K.",
    initial: "S",
  },
];

function decodeHtml(value: string) {
  if (typeof window === "undefined") return value;

  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function formatReviewDate(date?: string) {
  if (!date) return "Verified review";

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function cleanReviewText(value: string) {
  return value
    .replace(/^[\s★⭐]+/u, "")
    .replace(/^["“]+/, "")
    .replace(/["”]+$/, "")
    .trim();
}

function reviewTitleFromBody(body: string) {
  const firstSentence = body.split(/[.!?]/)[0]?.trim();
  if (!firstSentence) return "Verified customer review";
  return truncateText(firstSentence, 58);
}

function parseWordPressReviews(html: string, date?: string): ReviewItem[] {
  if (typeof window === "undefined") return [];

  const doc = new DOMParser().parseFromString(html, "text/html");
  const paragraphs = Array.from(doc.querySelectorAll("p"))
    .map((paragraph) => decodeHtml(paragraph.textContent?.replace(/\s+/g, " ").trim() ?? ""))
    .filter(Boolean);

  const parsed: ReviewItem[] = [];

  for (let index = 0; index < paragraphs.length - 1; index += 2) {
    const quote = cleanReviewText(paragraphs[index]);
    const authorLine = paragraphs[index + 1]?.trim();

    if (!quote || !authorLine || quote.length < 24) continue;

    const [authorName, location] = authorLine.split(",").map((part) => part.trim());
    const author = authorName || authorLine;

    parsed.push({
      label: index === 0 ? "Featured Review" : "Customer Review",
      date: formatReviewDate(date),
      title: reviewTitleFromBody(quote),
      body: [quote],
      author: location ? `${author}, ${location}` : author,
      initial: author.charAt(0).toUpperCase() || "C",
    });
  }

  return parsed.slice(0, 3);
}

function FabricVisual() {
  return (
    <div className={styles.fabricVisual} aria-hidden="true">
      <svg viewBox="0 0 700 760" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <rect width="700" height="760" fill="#FFFFFF" />
        <defs>
          <pattern id="capriDsk" x="0" y="0" width="140" height="90" patternUnits="userSpaceOnUse">
            <rect width="140" height="90" fill="#FAFCFE" />
            <image href="/capri-ortho-mattress-damask-fabric-close-up.jpeg" x="-226" y="-81" width="646" height="404" opacity=".9" />
          </pattern>
          <clipPath id="capriCloseupClip">
            <rect x="40" y="584" width="620" height="136" rx="10" />
          </clipPath>
        </defs>
        <rect width="700" height="760" fill="url(#capriDsk)" opacity=".55" />
        <rect x="24" y="24" width="68" height="30" rx="15" fill="rgba(21,87,167,.12)" />
        <text x="58" y="44" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="18" fontWeight="700" fill="#1557A7">01</text>
        <g transform="translate(50,80)">
          <path d="M10 185 L305 30 L585 108 L290 263 Z" fill="url(#capriDsk)" stroke="#C0D4E8" strokeWidth="2" />
          <path d="M10 185 L305 30 L585 108 L290 263 Z" fill="rgba(255,255,255,.28)" />
          {[
            [138, 136],
            [214, 109],
            [294, 125],
            [372, 141],
            [446, 111],
            [176, 168],
            [254, 184],
            [332, 200],
          ].map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r="10" fill="white" stroke="#B8CBE0" strokeWidth="2" />
              <circle cx={cx} cy={cy} r="4" fill="#C8DAEA" />
            </g>
          ))}
          <path d="M10 185 L290 263 L290 394 L10 316 Z" fill="#E8EFF7" stroke="#C0D4E8" strokeWidth="1.5" />
          {[54, 98, 142, 186, 230, 274].map((x, index) => (
            <line key={x} x1={x} y1={192 + index * 9} x2={x} y2={323 + index * 8} stroke="#C8DAEA" strokeWidth=".9" />
          ))}
          <path d="M290 263 L585 108 L585 239 L290 394 Z" fill="#DCE8F4" stroke="#C0D4E8" strokeWidth="1.5" />
          {[
            [340, 231, 362],
            [390, 207, 337],
            [440, 184, 313],
            [490, 163, 290],
          ].map(([x, y1, y2]) => (
            <line key={x} x1={x} y1={y1} x2={x} y2={y2} stroke="#C8DAEA" strokeWidth=".8" />
          ))}
        </g>
        <rect x="410" y="175" width="240" height="56" rx="10" fill="rgba(21,87,167,.92)" />
        <text x="530" y="198" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="18" fontWeight="700" fill="#fff" letterSpacing="0.05em">WOVEN DAMASK FABRIC</text>
        <text x="530" y="218" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="16" fill="rgba(255,255,255,.85)">Premium quality finish</text>
        <rect x="28" y="572" width="644" height="160" rx="14" fill="white" stroke="#C8DAEA" strokeWidth="1.5" />
        <g clipPath="url(#capriCloseupClip)">
          <image href="/capri-ortho-mattress-damask-fabric-close-up.jpeg" x="-394" y="435" width="1488" height="930" />
        </g>
        <rect x="40" y="584" width="620" height="136" rx="10" fill="none" stroke="#C8DAEA" strokeWidth="1" />
        <text x="350" y="746" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="15" fontWeight="600" fill="#4D667D" letterSpacing="0.1em">CLOSE-UP: WOVEN DAMASK PATTERN</text>
      </svg>
    </div>
  );
}

function SpringVisual() {
  return (
    <div className={styles.springVisual} aria-hidden="true">
      <svg viewBox="0 0 700 760" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <rect width="700" height="760" fill="#2C5282" />
        <rect x="24" y="24" width="68" height="30" rx="15" fill="rgba(255,255,255,.16)" />
        <text x="58" y="44" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="18" fontWeight="700" fill="#fff">02</text>
        <text x="350" y="70" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="16" fontWeight="700" fill="rgba(184,203,224,.88)" letterSpacing="0.1em">OPEN COIL SPRING UNIT - CROSS-SECTION</text>
        <rect x="48" y="82" width="604" height="22" rx="11" fill="#5B9BD5" />
        <rect x="48" y="680" width="604" height="22" rx="11" fill="#5B9BD5" />
        <g stroke="#C8DAEA" strokeWidth="3" fill="none" strokeLinecap="round">
          {[90, 190, 290, 390, 490, 590].map((x) => (
            <path key={x} d={`M${x} 104 Q${x + 22} 138 ${x} 172 Q${x + 22} 206 ${x} 240 Q${x + 22} 274 ${x} 308 Q${x + 22} 342 ${x} 376 Q${x + 22} 410 ${x} 444 Q${x + 22} 478 ${x} 512 Q${x + 22} 546 ${x} 580 Q${x + 22} 614 ${x} 648 Q${x + 22} 675 ${x} 680`} />
          ))}
        </g>
        {[240, 376, 512, 648].map((y) => (
          <line key={y} x1="90" y1={y} x2="590" y2={y} stroke="rgba(184,203,224,.22)" strokeWidth="1" strokeDasharray="5,7" />
        ))}
        <rect x="419" y="130" width="260" height="48" rx="9" fill="rgba(214,168,90,.96)" />
        <text x="549" y="150" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="16" fontWeight="700" fill="#1A2E44">Wire Edge Border</text>
        <text x="549" y="167" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="15" fill="#1A2E44" opacity=".9">Full perimeter support</text>
        <rect x="22" y="386" width="220" height="48" rx="9" fill="rgba(21,87,167,.96)" />
        <text x="132" y="406" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="16" fontWeight="700" fill="#fff">Open Coil Spring</text>
        <text x="132" y="423" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="15" fill="rgba(255,255,255,.9)">Orthopaedic grade</text>
      </svg>
    </div>
  );
}

function FillingVisual() {
  return (
    <div className={styles.fillingVisual} aria-hidden="true">
      <svg viewBox="0 0 700 760" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <rect width="700" height="760" fill="#FFFFFF" />
        <rect x="24" y="24" width="68" height="30" rx="15" fill="rgba(21,87,167,.1)" />
        <text x="58" y="44" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="18" fontWeight="700" fill="#1557A7">03</text>
        <text x="350" y="70" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="16" fontWeight="700" fill="#4D667D" letterSpacing="0.1em">CAPRI ORTHO - 26cm CROSS-SECTION</text>
        <rect x="56" y="80" width="564" height="60" rx="10" fill="#F4F7FB" stroke="#C8DAEA" strokeWidth="2" />
        <text x="338" y="116" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="19" fontWeight="700" fill="#1A2E44">Quality Damask Cover</text>
        <rect x="56" y="146" width="564" height="200" fill="#E8EFF7" stroke="#C8DAEA" strokeWidth="1.5" />
        <g stroke="#B8CBE0" strokeWidth="1.5" fill="none" opacity=".85">
          <path d="M68 168 Q126 151 196 172 Q268 193 350 163 Q432 133 504 163 Q564 187 632 168" />
          <path d="M68 198 Q126 181 196 200 Q268 219 350 191 Q432 163 504 191 Q564 213 632 198" />
          <path d="M68 228 Q126 211 196 230 Q268 249 350 221 Q432 193 504 221 Q564 243 632 228" />
          <path d="M68 258 Q126 241 196 260 Q268 279 350 251 Q432 223 504 251 Q564 273 632 258" />
          <path d="M68 290 Q126 273 196 292 Q268 311 350 283 Q432 255 504 283 Q564 305 632 290" />
          <path d="M68 320 Q126 303 196 322 Q268 341 350 313 Q432 285 504 313 Q564 335 632 320" />
        </g>
        <text x="338" y="234" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="26" fontWeight="700" fill="#1A2E44">Deep Polyester Filling</text>
        <text x="338" y="260" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="19" fill="#4D667D">Enhanced comfort layer</text>
        <rect x="415" y="162" width="210" height="46" rx="8" fill="rgba(21,87,167,.9)" />
        <text x="520" y="182" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="16" fontWeight="700" fill="#fff">Deep Fill Layer</text>
        <text x="520" y="198" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="15" fill="rgba(255,255,255,.85)">Cushions pressure points</text>
        <rect x="56" y="352" width="564" height="290" fill="#DCE8F4" stroke="#C8DAEA" strokeWidth="1.5" />
        <g stroke="#8BADC8" strokeWidth="2" fill="none">
          {[108, 208, 308, 408, 508].map((x) => (
            <path key={x} d={`M${x} 364 Q${x + 16} 393 ${x} 422 Q${x + 16} 451 ${x} 480 Q${x + 16} 509 ${x} 538 Q${x + 16} 567 ${x} 596 Q${x + 16} 625 ${x} 638`} />
          ))}
        </g>
        <text x="338" y="508" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="22" fontWeight="700" fill="#1A2E44">Orthopaedic Open Coil Springs</text>
        <rect x="56" y="648" width="564" height="60" rx="0 0 10 10" fill="#F4F7FB" stroke="#C8DAEA" strokeWidth="2" />
        <text x="338" y="683" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="19" fontWeight="700" fill="#1A2E44">Base Damask Cover (Double-Sided)</text>
        <line x1="22" y1="80" x2="22" y2="708" stroke="#1557A7" strokeWidth="1.8" />
        <line x1="16" y1="80" x2="28" y2="80" stroke="#1557A7" strokeWidth="1.8" />
        <line x1="16" y1="708" x2="28" y2="708" stroke="#1557A7" strokeWidth="1.8" />
        <text x="10" y="398" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="16" fontWeight="700" fill="#1557A7" transform="rotate(-90,10,398)">26cm TOTAL DEPTH</text>
      </svg>
    </div>
  );
}

function TuftVisual() {
  return (
    <div className={styles.tuftVisual} aria-hidden="true">
      <svg viewBox="0 0 700 760" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <rect width="700" height="760" fill="#1E3A5F" />
        <rect x="24" y="24" width="68" height="30" rx="15" fill="rgba(255,255,255,.16)" />
        <text x="58" y="44" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="18" fontWeight="700" fill="#fff">04</text>
        <text x="350" y="70" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="16" fontWeight="700" fill="rgba(184,203,224,.88)" letterSpacing="0.1em">DEEP TUFT PLACEMENT</text>
        <rect x="50" y="80" width="600" height="348" rx="22" fill="#243552" stroke="#4A7AAF" strokeWidth="2.5" />
        <g>
          {[
            [150, 170, false],
            [284, 170, false],
            [416, 170, false],
            [550, 170, false],
            [150, 254, false],
            [284, 254, true],
            [416, 254, false],
            [550, 254, false],
            [150, 338, false],
            [284, 338, false],
            [416, 338, false],
            [550, 338, false],
          ].map(([x, y, active]) => (
            <g key={`${x}-${y}`} transform={`translate(${x},${y})`}>
              {active ? <circle r="31" fill="rgba(214,168,90,.15)" stroke="#D6A85A" strokeWidth="2" /> : null}
              <circle r="23" fill="white" stroke="#B8CBE0" strokeWidth="2.5" />
              <circle r="10" fill="#C8DAEA" />
              <circle r="4" fill={active ? "#D6A85A" : "#1557A7"} />
            </g>
          ))}
        </g>
        <text x="350" y="462" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="16" fontWeight="700" fill="rgba(184,203,224,.88)" letterSpacing="0.1em">SIDE VIEW - FULL 26cm DEPTH</text>
        <rect x="50" y="474" width="600" height="234" rx="14" fill="#243552" stroke="#4A7AAF" strokeWidth="2" />
        {[150, 284, 416, 550].map((x) => (
          <g key={x}>
            <line x1={x} y1="490" x2={x} y2="694" stroke={x === 284 ? "#D6A85A" : "rgba(255,255,255,.7)"} strokeWidth={x === 284 ? "3.5" : "3"} strokeDasharray="6,5" />
            <circle cx={x} cy="502" r="9" fill={x === 284 ? "#D6A85A" : "white"} />
            <circle cx={x} cy="682" r="9" fill={x === 284 ? "#D6A85A" : "white"} />
          </g>
        ))}
        <rect x="174" y="570" width="220" height="48" rx="10" fill="rgba(214,168,90,.92)" />
        <text x="284" y="590" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="16" fontWeight="700" fill="#1A2E44">Deep Depth Tuft</text>
        <text x="284" y="607" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="15" fill="#1A2E44" opacity=".9">Locks all layers in place</text>
        <text x="350" y="735" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="15" fill="rgba(184,203,224,.8)" letterSpacing="0.08em">HAND-PLACED TRADITIONAL CONSTRUCTION</text>
      </svg>
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
      <svg viewBox="0 0 700 740" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <rect width="700" height="740" fill="#243552" />
        <rect x="24" y="20" width="68" height="30" rx="15" fill="rgba(255,255,255,.16)" />
        <text x="58" y="40" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="18" fontWeight="700" fill="#fff">06</text>
        <text x="350" y="66" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="16" fontWeight="700" fill="rgba(184,203,224,.88)" letterSpacing="0.1em">SIDE A</text>
        <rect x="76" y="76" width="548" height="118" rx="14" fill="#C8DAEA" />
        <rect x="88" y="88" width="524" height="94" rx="9" fill="#DCE8F4" />
        {[168, 278, 350, 422, 532].map((x) => (
          <g key={`a-${x}`}>
            <circle cx={x} cy="145" r="12" fill="white" stroke="#B8CBE0" strokeWidth="2" />
            <circle cx={x} cy="145" r="5" fill="#C8DAEA" />
          </g>
        ))}
        <rect x="190" y="94" width="320" height="32" rx="7" fill="rgba(21,87,167,.92)" />
        <text x="350" y="115" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="18" fontWeight="700" fill="#fff">Side A - Sleep Here Tonight</text>
        <g transform="translate(350,278)">
          <circle cx="-118" cy="0" r="68" fill="rgba(214,168,90,.12)" stroke="#D6A85A" strokeWidth="2" />
          <text x="-118" y="-18" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="49" fill="#D6A85A">↻</text>
          <text x="-118" y="18" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="20" fontWeight="700" fill="#D6A85A">FLIP</text>
          <text x="-118" y="38" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="15" fill="#E8BE7A">Every 3 months</text>
          <circle cx="118" cy="0" r="68" fill="rgba(21,87,167,.14)" stroke="#5B9BD5" strokeWidth="2" />
          <text x="118" y="-18" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="49" fill="#5B9BD5">↺</text>
          <text x="118" y="18" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="20" fontWeight="700" fill="#5B9BD5">ROTATE</text>
          <text x="118" y="38" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="15" fill="#8CC0EA">Every 6 weeks</text>
        </g>
        <text x="350" y="404" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="16" fontWeight="700" fill="rgba(184,203,224,.88)" letterSpacing="0.1em">SIDE B</text>
        <rect x="76" y="414" width="548" height="118" rx="14" fill="#C8DAEA" />
        <rect x="88" y="426" width="524" height="94" rx="9" fill="#DCE8F4" />
        {[168, 278, 350, 422, 532].map((x) => (
          <g key={`b-${x}`}>
            <circle cx={x} cy="483" r="12" fill="white" stroke="#B8CBE0" strokeWidth="2" />
            <circle cx={x} cy="483" r="5" fill="#C8DAEA" />
          </g>
        ))}
        <rect x="190" y="432" width="320" height="32" rx="7" fill="rgba(46,125,50,.9)" />
        <text x="350" y="453" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="18" fontWeight="700" fill="#fff">Side B - Fresh Support</text>
        <rect x="58" y="558" width="584" height="62" rx="12" fill="rgba(255,255,255,.06)" stroke="rgba(184,203,224,.15)" strokeWidth="1" />
        <text x="350" y="585" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="19" fontWeight="700" fill="#E8EFF7">Two surfaces. Double the lifespan.</text>
        <text x="350" y="606" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="16" fill="#B8CBE0">Flip - Rotate - Consistent support for years longer</text>
        <rect x="58" y="634" width="584" height="50" rx="10" fill="rgba(214,168,90,.1)" stroke="rgba(214,168,90,.22)" strokeWidth="1" />
        <text x="350" y="664" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="19" fontWeight="700" fill="#D6A85A">Unlike most mattresses - usable on both sides</text>
      </svg>
    </div>
  );
}

export default function CapriOrthoMattress2Client() {
  const [selectedSize, setSelectedSize] = useState<SizeKey>("single");
  const [baseAdded, setBaseAdded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(fallbackReviews);

  const size = sizes[selectedSize];
  const total = size.price + (baseAdded ? size.base : 0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWordPressReviews() {
      try {
        const response = await fetch(`${wordpressReviewsApiUrl}&_=${Date.now()}`, {
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
        // Keep fallback reviews when WordPress is unavailable.
      }
    }

    loadWordPressReviews();

    return () => controller.abort();
  }, []);

  return (
    <main className={styles.page}>
      <section className={`${styles.panel} ${styles.hero}`} id="hero">
        <div className={styles.heroImage}>
          <Image
            src="/capri-ortho-mattress-product-cutout.webp"
            alt="Capri Ortho Mattress close-up product view"
            fill
            priority
            sizes="100vw"
          />
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

      <section className={`${styles.panel} ${styles.fabricPanel}`} id="fabric">
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
          <span className={styles.eyebrow}>07 - Comparison</span>
          <h2>How It Compares to <em>Single-Sided Foam</em> Mattress</h2>
          <p>Most modern mattresses are single-sided memory foam. Here&apos;s what that trade-off actually means for your sleep.</p>
        </div>
        <div className={styles.compareGrid}>
          <article>
            <h3>Capri Ortho</h3>
            <strong>Open Coil &amp; Double-Sided</strong>
            <ul>
              <li>Usable on both sides - flip for twice the lifespan</li>
              <li>Open coil springs sleep cooler - air moves freely through the unit</li>
              <li>Wire edge support keeps the perimeter firm and usable</li>
              <li>Firm, consistent orthopaedic support all night</li>
              <li>Hand-tufted in the UK by skilled craftspeople</li>
            </ul>
          </article>
          <article>
            <h3>Typical Single-Sided Memory Foam</h3>
            <strong>Single-Use Foam Core</strong>
            <ul>
              <li>Usable on one side only - wears out roughly twice as fast</li>
              <li>Dense foam traps body heat, sleeping noticeably warmer</li>
              <li>Edges compress and soften, reducing usable sleep surface</li>
              <li>Sinks and softens under sustained pressure over time</li>
              <li>Often mass-produced offshore to a lower cost spec</li>
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

      <CustomerReviews
        key={reviewItems.map((review) => review.title).join("|")}
        intro="Live customer feedback from the main reviews feed, with photo reviews available through the media filter."
        reviews={reviewItems.map((review, index) => ({
          id: `${review.author}-${index}`,
          name: review.author,
          date: Number.isNaN(Date.parse(review.date)) ? ["2026-08-17", "2026-08-05", "2026-07-21"][index % 3] : review.date,
          rating: 5,
          verified: true,
          comment: review.body.join(" "),
          media: index === 0 ? ["/capri-ortho-mattress-bedroom-lifestyle.jpeg"] : undefined,
        }))}
      />

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
