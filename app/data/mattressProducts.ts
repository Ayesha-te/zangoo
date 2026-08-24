export type MattressProduct = {
  slug: string;
  name: string;
  shortName: string;
  price: string;
  firmness: string;
  description: string;
  image: string;
  imageAlt: string;
  gallery?: Array<{ src: string; alt: string }>;
  bullets: string[];
  specs: Array<{ label: string; value: string; note: string }>;
  features: Array<{ title: string; body: string; points: string[] }>;
  faqs: Array<{ question: string; answer: string }>;
  bestFor: string[];
  stockCount: number;
  compareSpecs: {
    springType: string;
    comfortLayer: string;
    cover: string;
    turnable: boolean;
    weight: string;
  };
};

export const orthoMattressProducts: MattressProduct[] = [
  {
    slug: "restcore-ortho",
    name: "RestCore Ortho Mattress",
    shortName: "RestCore Ortho",
    price: "From £499",
    firmness: "Medium to Firm",
    description:
      "An orthopaedic mattress designed for balanced spinal alignment, everyday pressure relief, and reliable support through the night.",
    image: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1400",
    imageAlt: "Neutral bedroom with a dressed mattress and bedside lighting",
    bullets: ["7-zone support feel", "Breathable comfort layers", "Free UK delivery", "1-year guarantee"],
    specs: [
      { label: "Firmness", value: "6.5/10", note: "Medium-firm support" },
      { label: "Depth", value: "26cm", note: "Supportive profile" },
      { label: "Trial", value: "60 nights", note: "At-home comfort check" },
      { label: "Delivery", value: "Free", note: "UK mainland" },
    ],
    features: [
      {
        title: "Built for spinal alignment",
        body: "A supportive orthopaedic core helps keep your back evenly supported while the top comfort layers reduce hard pressure points.",
        points: ["Back and stomach sleeper friendly", "Stable edge-to-edge feel", "Designed for daily use"],
      },
      {
        title: "Comfort without sinking",
        body: "The medium-firm surface gives enough cushioning for comfort while resisting the sagging that can disturb posture.",
        points: ["Responsive comfort layer", "Reduced roll-together feel", "Breathable sleep surface"],
      },
    ],
    faqs: [
      { question: "Who is RestCore Ortho best for?", answer: "It suits sleepers who want a balanced medium-firm orthopaedic feel with dependable everyday support." },
      { question: "Can I ask questions before ordering?", answer: "Yes. Use the WhatsApp consultation button and we will guide sizing, firmness, and delivery details." },
    ],
    bestFor: ["Back Pain"],
    stockCount: 12,
    compareSpecs: {
      springType: "Open coil, 7-zone springs",
      comfortLayer: "Breathable foam comfort layer",
      cover: "Woven fabric cover",
      turnable: true,
      weight: "~22kg (Double)",
    },
  },
  {
    slug: "alignplus-ortho",
    name: "AlignPlus Ortho Mattress",
    shortName: "AlignPlus Ortho",
    price: "From £579",
    firmness: "Firm",
    description:
      "A firmer orthopaedic mattress for sleepers who prefer a more lifted, stable feel across the hips, shoulders, and lower back.",
    image: "https://images.pexels.com/photos/6585760/pexels-photo-6585760.jpeg?auto=compress&cs=tinysrgb&w=1400",
    imageAlt: "Bright bedroom with a neatly styled bed",
    bullets: ["Firm orthopaedic feel", "Reinforced support core", "Made for back support", "Mattress sale active"],
    specs: [
      { label: "Firmness", value: "7.5/10", note: "Firm support" },
      { label: "Depth", value: "28cm", note: "Extra support build" },
      { label: "Support", value: "Zoned", note: "Targeted pressure zones" },
      { label: "Guarantee", value: "1 year", note: "Manufacturing cover" },
    ],
    features: [
      {
        title: "Firmer posture support",
        body: "A more resistant sleep surface keeps heavier contact points lifted and helps reduce unwanted dipping.",
        points: ["Excellent for firm-mattress buyers", "Supportive lower-back feel", "Stable movement control"],
      },
      {
        title: "Everyday durability",
        body: "Built for consistent support with materials selected for regular family use and long-term comfort.",
        points: ["Durable cover finish", "Strong perimeter support", "Easy room pairing"],
      },
    ],
    faqs: [
      { question: "Is AlignPlus firmer than RestCore?", answer: "Yes. AlignPlus is designed for customers who specifically want a firmer orthopaedic feel." },
      { question: "Is this part of the mattress sale?", answer: "Yes. This product is included in the current Bedroom mattress sale launch." },
    ],
    bestFor: ["Firm Support", "Back Pain"],
    stockCount: 4,
    compareSpecs: {
      springType: "Reinforced open coil springs",
      comfortLayer: "Firm support foam layer",
      cover: "Woven fabric cover",
      turnable: true,
      weight: "~25kg (Double)",
    },
  },
  {
    slug: "ortholux-pocket",
    name: "OrthoLux Pocket Mattress",
    shortName: "OrthoLux Pocket",
    price: "From £649",
    firmness: "Medium to Firm",
    description:
      "A pocket-sprung orthopaedic mattress made for independent support, reduced partner disturbance, and a more responsive sleep feel.",
    image: "https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg?auto=compress&cs=tinysrgb&w=1400",
    imageAlt: "Comfortable bedroom with pillows and soft natural light",
    bullets: ["Pocket spring response", "Reduced motion transfer", "Supportive comfort top", "Free UK delivery"],
    specs: [
      { label: "Feel", value: "Pocket", note: "Responsive support" },
      { label: "Firmness", value: "6/10", note: "Medium-firm comfort" },
      { label: "Best for", value: "Couples", note: "Less partner movement" },
      { label: "Finance", value: "0%", note: "Interest-free options" },
    ],
    features: [
      {
        title: "Individual support response",
        body: "Pocket springs move independently, so support adapts more naturally across different sleep positions.",
        points: ["Good for couples", "Balanced pressure relief", "Responsive spring feel"],
      },
      {
        title: "Comfortable orthopaedic base",
        body: "The support system is paired with a comfortable top layer to avoid a harsh, board-like feel.",
        points: ["Gentler shoulder comfort", "Firm core stability", "Practical everyday support"],
      },
    ],
    faqs: [
      { question: "Is OrthoLux suitable for couples?", answer: "Yes. The pocket spring construction helps reduce partner movement compared with a linked spring system." },
      { question: "Does it still feel orthopaedic?", answer: "Yes. It is supportive, but with a more responsive and comfortable pocket-spring feel." },
    ],
    bestFor: ["Couples", "Side Sleepers"],
    stockCount: 8,
    compareSpecs: {
      springType: "Pocket springs",
      comfortLayer: "Responsive comfort foam",
      cover: "Soft-touch fabric cover",
      turnable: true,
      weight: "~23kg (Double)",
    },
  },
  {
    slug: "spineguard-ortho",
    name: "SpineGuard Ortho Mattress",
    shortName: "SpineGuard Ortho",
    price: "From £699",
    firmness: "Extra Firm",
    description:
      "The firmest orthopaedic option in the launch range, created for customers who want maximum lift and a highly supportive sleep surface.",
    image: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=1400",
    imageAlt: "Minimal bedroom with white bedding and calm decor",
    bullets: ["Extra-firm support", "Maximum lifted feel", "Reinforced structure", "Bedroom sale product"],
    specs: [
      { label: "Firmness", value: "8.5/10", note: "Extra-firm support" },
      { label: "Profile", value: "30cm", note: "Deep support build" },
      { label: "Edge", value: "Strong", note: "Stable sitting edge" },
      { label: "Use", value: "Daily", note: "Made for regular use" },
    ],
    features: [
      {
        title: "Maximum firm support",
        body: "SpineGuard is for sleepers who dislike sinking and prefer a very stable, lifted mattress surface.",
        points: ["Extra-firm feel", "Strong hip support", "Minimal surface dip"],
      },
      {
        title: "Clean, supportive build",
        body: "The mattress focuses on firm orthopaedic performance with practical materials and a calm bedroom look.",
        points: ["Support-first design", "Firm perimeter feel", "Simple care routine"],
      },
    ],
    faqs: [
      { question: "Is SpineGuard the firmest option?", answer: "Yes. SpineGuard is the firmest orthopaedic mattress in this initial launch set." },
      { question: "Should side sleepers choose it?", answer: "Dedicated side sleepers may prefer RestCore or OrthoLux unless they already know they like extra-firm mattresses." },
    ],
    bestFor: ["Firm Support"],
    stockCount: 1,
    compareSpecs: {
      springType: "Reinforced open coil, extra-firm",
      comfortLayer: "Firm support foam layer",
      cover: "Woven fabric cover",
      turnable: true,
      weight: "~27kg (Double)",
    },
  },
  {
    slug: "capri-ortho-mattress",
    name: "Capri Ortho Mattress",
    shortName: "Capri Ortho",
    price: "From £749",
    firmness: "Medium to Firm",
    description:
      "A firm orthopaedic mattress with a clean quilted finish, created for stable spinal support, everyday comfort, and a brighter bedroom look.",
    image: "/capri-ortho-mattress-bedroom-hero.webp",
    imageAlt: "Capri Ortho Mattress styled on a divan bed in a bright bedroom",
    gallery: [
      {
        src: "/capri-ortho-mattress-bedroom-hero.webp",
        alt: "Capri Ortho Mattress styled on a divan bed in a bright bedroom",
      },
      {
        src: "/capri-ortho-mattress-product-cutout.webp",
        alt: "Capri Ortho Mattress product view on a white background",
      },
    ],
    bullets: ["Firm orthopaedic support", "Quilted comfort surface", "Free UK delivery", "Mattress sale active"],
    specs: [
      { label: "Firmness", value: "7/10", note: "Firm support" },
      { label: "Profile", value: "28cm", note: "Deep quilted build" },
      { label: "Trial", value: "60 nights", note: "At-home comfort check" },
      { label: "Delivery", value: "Free", note: "UK mainland" },
    ],
    features: [
      {
        title: "Stable orthopaedic support",
        body: "Capri Ortho is built to keep the body evenly supported with a firmer sleep surface that helps reduce unwanted sinking.",
        points: ["Firm support feel", "Balanced shoulder and hip comfort", "Stable edge-to-edge profile"],
      },
      {
        title: "Clean quilted comfort",
        body: "The quilted finish gives the mattress a neat, breathable surface while keeping the support feel practical for everyday sleep.",
        points: ["Soft-touch quilted top", "Bright bedroom-ready styling", "Supportive comfort without a heavy sink"],
      },
    ],
    faqs: [
      { question: "Who is Capri Ortho best for?", answer: "It is best for sleepers who want a firmer orthopaedic mattress with a clean quilted finish and dependable everyday support." },
      { question: "Are these the supplied Capri images?", answer: "Yes. The Capri landing page uses the provided mattress images converted to WebP format." },
    ],
    bestFor: ["Back Pain", "Firm Support", "Turnable / Double-Sided"],
    stockCount: 4,
    compareSpecs: {
      springType: "Open coil springs",
      comfortLayer: "Quilted foam comfort layer",
      cover: "Quilted fabric cover",
      turnable: true,
      weight: "~24kg (Double)",
    },
  },
  {
    slug: "classic-ortho",
    name: "Classic Ortho Mattress",
    shortName: "Classic Ortho",
    price: "From £449",
    firmness: "Medium to Firm",
    description:
      "The entry orthopaedic mattress in the range, built for balanced everyday support with a traditional turnable construction.",
    image: "https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=1400",
    imageAlt: "Simple bedroom with a neatly made bed",
    bullets: ["Medium to firm support", "Traditional turnable build", "Free UK delivery", "1-year guarantee"],
    specs: [
      { label: "Firmness", value: "6/10", note: "Medium to firm support" },
      { label: "Depth", value: "24cm", note: "Traditional profile" },
      { label: "Trial", value: "60 nights", note: "At-home comfort check" },
      { label: "Delivery", value: "Free", note: "UK mainland" },
    ],
    features: [
      {
        title: "Everyday orthopaedic support",
        body: "A dependable open coil core keeps the sleep surface evenly supported for regular nightly use.",
        points: ["Balanced support feel", "Stable edge-to-edge build", "Designed for daily use"],
      },
      {
        title: "Traditional turnable build",
        body: "A double-sided construction lets the mattress be turned and rotated to even out everyday wear.",
        points: ["Turn and rotate for longer life", "Woven cover finish", "Simple care routine"],
      },
    ],
    faqs: [
      { question: "Who is Classic Ortho best for?", answer: "It suits sleepers who want a dependable medium to firm orthopaedic mattress at an entry price point." },
      { question: "Can I ask questions before ordering?", answer: "Yes. Use the WhatsApp consultation button and we will guide sizing, firmness, and delivery details." },
    ],
    bestFor: ["Back Pain", "Turnable / Double-Sided"],
    stockCount: 10,
    compareSpecs: {
      springType: "Open coil springs",
      comfortLayer: "Fibre comfort layer",
      cover: "Woven fabric cover",
      turnable: true,
      weight: "~21kg (Double)",
    },
  },
  {
    slug: "hampton-ortho",
    name: "Hampton Ortho Mattress",
    shortName: "Hampton Ortho",
    price: "From £599",
    firmness: "Firm",
    description:
      "A firm orthopaedic mattress with a non-turn construction, built for sleepers who want a settled, low-maintenance firm feel.",
    image: "https://images.pexels.com/photos/6316526/pexels-photo-6316526.jpeg?auto=compress&cs=tinysrgb&w=1400",
    imageAlt: "Bright bedroom with a firm mattress styled on a bed frame",
    bullets: ["Firm support feel", "Non-turn construction", "Free UK delivery", "1-year guarantee"],
    specs: [
      { label: "Firmness", value: "7.5/10", note: "Firm support" },
      { label: "Depth", value: "27cm", note: "Supportive profile" },
      { label: "Trial", value: "60 nights", note: "At-home comfort check" },
      { label: "Delivery", value: "Free", note: "UK mainland" },
    ],
    features: [
      {
        title: "Settled firm support",
        body: "A firm support core keeps heavier contact points lifted, suited to sleepers who prefer a stable, firmer feel.",
        points: ["Firm support feel", "Stable sleep surface", "Suited to stomach and back sleepers"],
      },
      {
        title: "Low-maintenance build",
        body: "A single-sided, non-turn construction removes the need to flip the mattress while keeping consistent support.",
        points: ["No need to turn", "Consistent support layer", "Practical everyday care"],
      },
    ],
    faqs: [
      { question: "Does Hampton Ortho need turning?", answer: "No. Hampton Ortho uses a non-turn construction, so it only needs occasional rotating rather than flipping." },
      { question: "Is Hampton suitable for stomach sleepers?", answer: "Yes. Its firmer, settled support feel suits stomach sleepers and back sleepers who prefer less sink." },
    ],
    bestFor: ["Firm Support", "Stomach Sleepers", "Heavy Sleepers (90kg+)"],
    stockCount: 6,
    compareSpecs: {
      springType: "Reinforced open coil springs",
      comfortLayer: "Firm support foam layer",
      cover: "Woven fabric cover",
      turnable: false,
      weight: "~24kg (Double)",
    },
  },
  {
    slug: "deluxe-ortho",
    name: "Deluxe Ortho Mattress",
    shortName: "Deluxe Ortho",
    price: "From £829",
    firmness: "Extra Firm",
    description:
      "The top-tier orthopaedic mattress in the range, built extra firm with reinforced support for heavier sleepers and maximum lift.",
    image: "https://images.pexels.com/photos/6580227/pexels-photo-6580227.jpeg?auto=compress&cs=tinysrgb&w=1400",
    imageAlt: "Well-appointed bedroom with a premium mattress styled on a bed frame",
    bullets: ["Extra-firm support", "Reinforced heavy-duty build", "Free UK delivery", "1-year guarantee"],
    specs: [
      { label: "Firmness", value: "9/10", note: "Extra-firm support" },
      { label: "Depth", value: "31cm", note: "Deep reinforced build" },
      { label: "Trial", value: "60 nights", note: "At-home comfort check" },
      { label: "Delivery", value: "Free", note: "UK mainland" },
    ],
    features: [
      {
        title: "Maximum reinforced support",
        body: "A reinforced extra-firm core is built to support heavier sleepers with minimal sink and strong edge stability.",
        points: ["Extra-firm feel", "Reinforced for heavier sleepers", "Strong edge support"],
      },
      {
        title: "Turnable, built to last",
        body: "A double-sided, turnable construction spreads everyday wear evenly across the mattress for a longer usable life.",
        points: ["Turn and rotate for longer life", "Durable reinforced cover", "Consistent firm feel both sides"],
      },
    ],
    faqs: [
      { question: "Is Deluxe Ortho suitable for heavier sleepers?", answer: "Yes. It is reinforced and extra firm, built to give heavier sleepers (90kg+) strong, lasting support." },
      { question: "Is Deluxe Ortho turnable?", answer: "Yes. It has a double-sided, turnable construction so it can be flipped and rotated to even out wear." },
    ],
    bestFor: ["Firm Support", "Stomach Sleepers", "Heavy Sleepers (90kg+)", "Turnable / Double-Sided"],
    stockCount: 3,
    compareSpecs: {
      springType: "Reinforced open coil, extra-firm",
      comfortLayer: "Firm support foam layer",
      cover: "Reinforced woven cover",
      turnable: true,
      weight: "~29kg (Double)",
    },
  },
];

export function getMattressProduct(slug: string) {
  return orthoMattressProducts.find((product) => product.slug === slug);
}
