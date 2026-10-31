import { orthoMattressProducts } from "./mattressProducts";

export const navLinks = [
  { label: "Shop", href: "#", active: true },
  { label: "Collections", href: "/collections/" },
  { label: "Blogs", href: "#blog" },
  { label: "FAQs", href: "#faq" },
  { label: "Reviews", href: "/reviews/" },
  { label: "Contact", href: "#contact" },
];

export const collections = [
  { name: "Bedroom", slug: "bedroom", count: "310 products", className: "cc-bedroom", kind: "bed", badge: "Mattress Sale", description: "Shop UK-made orthopaedic mattresses now, with beds, bedside tables and more bedroom furniture planned for future collections." },
  { name: "Dining", slug: "dining", count: "158 products", className: "cc-dining", kind: "dining", badge: "Coming Soon", description: "Dining furniture is coming soon, including tables, chairs, benches and practical dining-room storage." },
  { name: "Lighting", slug: "lighting", count: "117 products", className: "cc-lighting", kind: "lamp", badge: "Coming Soon", description: "Our lighting collection is coming soon, with floor lamps, pendants, table lamps and lighting for modern interiors." },
  { name: "Living Room", slug: "living-room", count: "220 products", className: "cc-living", kind: "sofa", badge: "Coming Soon", description: "Our Living Room collection is coming soon, with sofas, lounge chairs, media units and furniture for comfortable everyday living." },
] as const;

export const collectionCategories = [
  {
    label: "Bedroom",
    href: "/collections/bedroom/",
    badge: "Mattress Sale",
    groups: [
      {
        label: "Mattresses",
        href: "/collections/bedroom/mattresses/",
        products: orthoMattressProducts.map((product) => ({
          label: product.shortName,
          href: `/collections/bedroom/mattresses/${product.slug}/`,
        })),
      },
      { label: "Beds", href: "/collections/bedroom/beds/" },
      { label: "Bedside Tables", href: "/collections/bedroom/bedside-tables/" },
    ],
  },
  {
    label: "Dining",
    href: "/collections/dining/",
    badge: "Coming Soon",
    groups: [
      { label: "Benches", href: "/collections/dining/benches/" },
      { label: "Dining Chairs", href: "/collections/dining/chairs/" },
      { label: "Dining Tables", href: "/collections/dining/tables/" },
    ],
  },
  {
    label: "Lighting",
    href: "/collections/lighting/",
    badge: "Coming Soon",
    groups: [
      { label: "Floor Lamps", href: "/collections/lighting/floor-lamps/" },
      { label: "Pendant Lights", href: "/collections/lighting/pendants/" },
      { label: "Table Lamps", href: "/collections/lighting/table-lamps/" },
    ],
  },
  {
    label: "Living Room",
    href: "/collections/living-room/",
    badge: "Coming Soon",
    groups: [
      { label: "Lounge Chairs", href: "/collections/living-room/lounge-chairs/" },
      { label: "Media Units", href: "/collections/living-room/media-units/" },
      { label: "Sofas", href: "/collections/living-room/sofas/" },
    ],
  },
] as const;

export const collectionMenu = collections.map((collection) => ({
  label: collection.name,
  href: `/collections/${collection.slug}/`,
  badge: collection.badge,
  description: collection.description,
}));

export const footerMainLinks = [
  { label: "Shop", href: "/" },
  { label: "Collections", href: "/collections/" },
  { label: "Blog", href: "/blog/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contact", href: "/contact/" },
  { label: "About Us", href: "/about/" },
  { label: "Work with Us", href: "/work-with-us/" },
] as const;

export const footerSocialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "Pinterest", href: "https://www.pinterest.com/" },
  { label: "Facebook", href: "https://www.facebook.com/" },
] as const;

export const awards = [
  ["mq-blue", "shield", "UKAS Management Systems", "ISO 9001 Quality Management", "Certified", "/ukas-iso-9001-quality-management-certification.jpeg"],
  ["mq-green", "leaf", "ISO Supplier", "ISO 14001 Environmental Management", "Certified"],
  ["mq-navy", "shield", "ISO Supplier", "ISO 27001 Information Security", "Certified"],
  ["mq-gold", "medal", "ISO Supplier", "ISO 45001 Health & Safety", "Certified"],
  ["mq-green", "globe", "The Green Organisation", "Green Organisation Award", "Member", "/green-organisation-award-member-certification.jpeg", "https://thegreenorganisation.info/"],
] as const;

export const reviews = [
  {
    label: "Featured Review",
    date: "March 18, 2026",
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
    date: "May 2, 2026",
    title: "Best furniture I have ever bought online",
    body: [
      "Sceptical about buying furniture online, but OrthoBedroom changed my mind. The pieces look even better in person.",
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
    slug: "style-dining-space-guests",
    tag: "Interior Design",
    title: "How to Style a Dining Space That Wows Your Guests",
    excerpt: "Tips from award-winning designers on creating inviting atmospheres that make every meal special.",
    meta: "5 min read - Design Tips",
    className: "bc-a",
    visual: "dining-room",
  },
  {
    slug: "chair-trends-2026-modern-interiors",
    tag: "Trend Report",
    title: "Chair Trends 2026: What Is Dominating Modern Interiors",
    excerpt: "From boucle to burl wood - the materials shaping furniture design this year.",
    meta: "8 min read - Trends",
    className: "bc-b",
    visual: "chair-trend",
  },
  {
    slug: "sustainable-living-space-style",
    tag: "Sustainability",
    title: "Create a Sustainable Living Space Without Sacrificing Style",
    excerpt: "Thoughtful swaps that reduce your environmental impact and look beautiful.",
    meta: "6 min read - Eco Living",
    className: "bc-c",
    visual: "sustainable-room",
  },
] as const;

export const faqs = [
  ["What is an orthopaedic mattress?", "An orthopaedic mattress is designed to provide a firmer, more supportive sleep surface rather than to act as a medical treatment. The term can describe different mattress constructions, including spring and foam-based designs. Our launch range uses supportive spring systems and covers medium-to-firm, firm and extra-firm comfort levels."],
  ["What is the difference between an orthopaedic mattress and a normal mattress?", "The main difference is usually the emphasis on firmness and support rather than one specific mattress construction. A standard mattress can be soft, medium or firm, while mattresses described as orthopaedic commonly offer a firmer feel. Compare the actual spring system, fillings, firmness and care instructions instead of relying on the word “orthopaedic” alone."],
  ["How firm should an orthopaedic mattress be?", "There is no single firmness that suits everyone. Medium-to-firm offers support with more cushioning, firm creates a more stable sleep surface, and extra firm provides the least sink and the most solid feel. Your body weight, sleeping position and personal comfort preference should all influence the firmness you choose."],
  ["Can an orthopaedic mattress help with back pain?", "A mattress cannot be guaranteed to treat or cure back pain. Some sleepers may feel more comfortable on a supportive mattress, while a surface that is too firm or too soft can also feel uncomfortable. If back pain is persistent, severe or accompanied by other symptoms, seek advice from a qualified healthcare professional rather than relying on a mattress as treatment."],
  ["What is an open coil spring mattress?", "An open coil mattress uses rows of interconnected springs that work together as one spring unit. This creates a familiar, supportive mattress feel and is commonly used in firm and orthopaedic designs. Our launch mattresses combine spring support with different comfort materials, including polyester, coir or memory foam depending on the model."],
  ["What is the difference between open coil and pocket sprung mattresses?", "Open coil mattresses use connected springs that respond together, while pocket sprung mattresses place individual springs in separate fabric pockets so they can move more independently. Neither construction is automatically better for everyone; firmness, fillings, edge support, budget and personal comfort should be compared alongside the spring type."],
  ["Should I choose a single-sided or double-sided mattress?", "Choose according to how much mattress maintenance you are comfortable with. A double-sided mattress is designed to be flipped and rotated regularly, helping both sleeping surfaces wear more evenly. A single-sided mattress is not flipped and normally only needs rotating according to the manufacturer’s care instructions. Always follow the instructions for your specific model."],
  ["Where are you based, and do you deliver mattresses across the UK?", "Our business address is 70 Ilford Lane, Ilford, London IG1 2LA, United Kingdom. We sell mattresses online and offer free London delivery. Our range is available in single, double and king sizes, with 0% interest-free finance and a 1-year guarantee."],
] as const;
