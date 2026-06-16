export const navLinks = [
  { label: "Shop", href: "#", active: true },
  { label: "Collections", href: "#collections" },
  { label: "Awards", href: "#awards" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const collections = [
  { name: "Living Room", count: "220 products", className: "cc-living", kind: "sofa" },
  { name: "Dining", count: "158 products", className: "cc-dining", kind: "dining" },
  { name: "Bedroom", count: "310 products", className: "cc-bedroom", kind: "bed" },
  { name: "Lighting", count: "117 products", className: "cc-lighting", kind: "lamp" },
] as const;

export const awards = [
  ["mq-gold", "trophy", "Which? Magazine", "Best Buy Retailer", "2024"],
  ["mq-blue", "palette", "Design Week", "Gold Award - Interiors", "2023"],
  ["mq-green", "leaf", "Eco Commerce Awards", "Green Retail of the Year", "2023"],
  ["mq-gold", "star", "Trustpilot", "Excellent - Top 1% UK", "2024"],
  ["mq-blue", "shield", "BSI", "ISO 9001 Certified", "2024"],
  ["mq-green", "recycle", "FSC", "Chain of Custody Certified", "2022"],
  ["mq-navy", "britain", "Made in Britain", "Certified Member", "2023"],
  ["mq-gold", "medal", "FIRA International", "Gold Award", "2024"],
  ["mq-blue", "lab", "OEKO-TEX", "Standard 100 Certified", "2024"],
  ["mq-green", "globe", "Carbon Trust", "Carbon Neutral Delivery", "2023"],
  ["mq-navy", "bolt", "RE100", "100% Renewable Energy", "2023"],
  ["mq-blue", "card", "FCA", "Authorised Finance Partner", "2022"],
] as const;

export const reviews = [
  {
    label: "Featured Review",
    title: "Completely transformed my living room",
    body: [
      "The quality exceeded my expectations. Every piece arrived perfectly packaged and the craftsmanship is outstanding.",
      "The white-glove setup service made everything effortless. Genuinely the best furniture purchase I have made.",
    ],
    author: "Sarah M.",
    initial: "S",
    photoClass: "rc-photo-a",
    photo: "living-room",
  },
  {
    label: "Latest Review",
    title: "Best furniture I have ever bought online",
    body: [
      "Sceptical about buying furniture online, but Furniture Co. changed my mind. The pieces look even better in person.",
      "Their consultant guided me through the whole selection. The bedroom set is exactly what I had been searching for.",
    ],
    author: "James R.",
    initial: "J",
    photoClass: "rc-photo-b",
    photo: "bedroom",
  },
] as const;

export const blogPosts = [
  {
    tag: "Interior Design",
    title: "How to Style a Dining Space That Wows Your Guests",
    excerpt: "Tips from award-winning designers on creating inviting atmospheres that make every meal special.",
    meta: "5 min read - Design Tips",
    className: "bc-a",
    visual: "dining-room",
  },
  {
    tag: "Trend Report",
    title: "Chair Trends 2026: What Is Dominating Modern Interiors",
    excerpt: "From boucle to burl wood - the materials shaping furniture design this year.",
    meta: "8 min read - Trends",
    className: "bc-b",
    visual: "chair-trend",
  },
  {
    tag: "Sustainability",
    title: "Create a Sustainable Living Space Without Sacrificing Style",
    excerpt: "Thoughtful swaps that reduce your environmental impact and look beautiful.",
    meta: "6 min read - Eco Living",
    className: "bc-c",
    visual: "sustainable-room",
  },
] as const;

export const faqs = [
  ["How long does furniture delivery take?", "Standard delivery takes 5-10 business days. White-glove delivery with in-home setup is available in most major UK cities within 7-14 days. You will receive tracking updates at every stage."],
  ["What materials are used in your furniture?", "We use sustainably sourced solid hardwoods, FSC-certified engineered timber, high-resilience foam cushioning, and natural textiles including linen, wool, and full-grain leather. All tested for low VOC emissions."],
  ["Do you offer a warranty on your furniture?", "Yes. All pieces come with a 10-year structural warranty and a 2-year fabric and finish warranty, covering manufacturing defects, frame integrity, and spring systems under normal residential use."],
  ["Can I return furniture if I do not like it?", "We offer a 60-day returns policy on most items in original condition. Collection is free for defective items; a return fee applies for change-of-mind returns. Custom orders are non-returnable."],
  ["Do you offer interior design consultations?", "Yes. Free 45-minute virtual consultations and in-home visits are available in London, Manchester, and Birmingham, covering space planning, material selection, and styling."],
  ["Is your furniture flat-pack or fully assembled?", "Sofas and beds arrive fully assembled. Dining tables and some bedroom pieces require light assembly with included tools and instructions. White-glove assembly is available at checkout."],
  ["Can I customise dimensions or fabrics?", "Yes. Our bespoke service offers custom sizing, 80+ fabric choices, and finish variations. Lead time is 8-12 weeks. Book a design consultation to get started."],
  ["Do you offer interest-free finance?", "We offer 0% interest-free credit on orders over £500, with 6, 12, or 24-month repayment terms via our FCA-authorised finance partner. Subject to status and credit approval."],
] as const;
