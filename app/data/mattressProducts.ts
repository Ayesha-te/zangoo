export type MattressProduct = {
  slug: string;
  name: string;
  shortName: string;
  price: string;
  firmness: string;
  description: string;
  image: string;
  imageAlt: string;
  bullets: string[];
  specs: Array<{ label: string; value: string; note: string }>;
  features: Array<{ title: string; body: string; points: string[] }>;
  faqs: Array<{ question: string; answer: string }>;
};

export const orthoMattressProducts: MattressProduct[] = [
  {
    slug: "restcore-ortho",
    name: "RestCore Ortho Mattress",
    shortName: "RestCore Ortho",
    price: "From GBP 499",
    firmness: "Medium-firm",
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
  },
  {
    slug: "alignplus-ortho",
    name: "AlignPlus Ortho Mattress",
    shortName: "AlignPlus Ortho",
    price: "From GBP 579",
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
  },
  {
    slug: "ortholux-pocket",
    name: "OrthoLux Pocket Mattress",
    shortName: "OrthoLux Pocket",
    price: "From GBP 649",
    firmness: "Medium-firm",
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
  },
  {
    slug: "spineguard-ortho",
    name: "SpineGuard Ortho Mattress",
    shortName: "SpineGuard Ortho",
    price: "From GBP 699",
    firmness: "Extra firm",
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
  },
];

export function getMattressProduct(slug: string) {
  return orthoMattressProducts.find((product) => product.slug === slug);
}
