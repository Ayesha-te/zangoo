import type { MattressProduct } from "./mattressProducts";

// Pocket sprung range (Air Flow 2000, Ella 3000, Harmony 1000, Mirage 2000, Newby 1000). Wording from the client's
// "Website Content Replacement Guide" PDFs (13/11/2026), mapped onto the Capri Ortho page sections.
// Left out until confirmed, as the guides instruct: 60-night sleep trial, BS 7177 statements and unconfirmed
// warranty terms (Ella, Harmony, Mirage, Newby 1000). Sizes: Single, Double, King (client price table, 13/11/2026).
// Each is "coming soon" until its WooCommerce product (with prices) exists.

const IMG = "/Pocket Sprung Product Images";
const photos = (name: string, alts: [string, string, string]) => ({
  image: `${IMG}/${name} Main.webp`,
  imageAlt: alts[0],
  gallery: [
    { src: `${IMG}/${name} Morning.webp`, alt: alts[1] },
    { src: `${IMG}/${name} Evening.webp`, alt: alts[2] },
  ],
});

const MATTRESS_ONLY = "Mattress only. Divan base, headboard and accessories are not included.";
const DELIVERY = `• <strong>Delivery Information</strong> - Free delivery on all orders. Estimated delivery dates will be confirmed during checkout.`;
const RETURNS = `• <strong>Returns & Cancellations</strong> - Please review our Returns Policy before purchasing for information about cancellations, return eligibility and any applicable return or collection charges.`;
const SIZE_NOTE = `<strong>Please note:</strong> Please check the selected mattress dimensions against your existing bed frame before ordering. Measurements are approximate, and small manufacturing tolerances may apply.`;

export const pocketSprungProducts: MattressProduct[] = [
  {
    slug: "air-flow-2000-pocket-spring-mattress",
    layout: "pocket",
    quickFacts: ["Up to 2,000 Pocket Springs", "Memory Foam & Pillow Top", "28cm Depth", "Firmness: Medium to Firm"],
    love: [
      { icon: "springs", label: "Support System", title: "Pocket Springs", text: "Up to 2,000 individually wrapped springs respond independently to pressure and movement." },
      { icon: "pillow", label: "Comfort Fillings", title: "Memory Foam & Pillow Top", text: "Pressure-responsive memory foam and a plush pillow top add cushioning above the springs." },
      { icon: "firmness", label: "Firmness", title: "Medium to Firm", text: "A supportive feel complemented by cushioning from the upper comfort layers." },
    ],
    name: "Air Flow 2000 Pocket Spring Mattress",
    shortName: "Air Flow 2000",
    price: "Price coming soon",
    firmness: "Medium to Firm",
    comingSoon: true,
    copy: {
      seoTitle: "2000 Pocket Spring Mattress | Air Flow 2000 Pillow Top",
      metaDescription: "Shop the Air Flow 2000 pocket sprung mattress with up to 2,000 pocket springs, memory foam and a plush pillow top. Single, Double and King sizes.",
      insertKicker: "UK made • 1-year warranty",
      whyChooseTitle: "Why Choose the Air Flow 2000 Mattress?",
      featuresHeading: "Features You’ll Love",
      faqIntro: "Helpful answers about pocket spring support, memory foam comfort, mattress sizes and caring for your Air Flow 2000.",
      deliveryTitle: "Delivery, Warranty & Returns",
      notice: MATTRESS_ONLY,
    },
    heroDescription:
      "The Air Flow 2000 is a UK-made, medium-to-firm pocket sprung mattress combining up to 2,000 individually pocketed springs with a deep memory foam comfort layer and a plush pillow top. Designed to balance responsive support with surface cushioning, it features a quilted knitted fabric finish and a practical single-sided construction. Approximately 28cm deep, this 2000 pocket sprung mattress is available in Single, Double and King sizes.",
    description:
      "The Air Flow 2000 is a medium-to-firm pocket sprung mattress designed to combine responsive support with cushioned comfort. Featuring up to 2,000 individually pocketed springs, a deep memory foam layer and a plush pillow top, it offers a supportive feel with additional surface cushioning. Finished in quilted knitted fabric, this UK-made, single-sided mattress measures approximately 28cm in depth and is available in Single, Double and King sizes.",
    bullets: ["Medium-to-firm support", "Up to 2,000 pocket springs", "Deep memory foam comfort layer", "Plush pillow top cushioning"],
    accordionContent: {
      features: `• <strong>Medium-to-firm support</strong> - A supportive mattress feel complemented by cushioning from the upper comfort layers.
        • <strong>Up to 2,000 pocket springs</strong> - Individually wrapped springs designed to respond independently to pressure and movement.
        • <strong>Deep memory foam comfort layer</strong> - Pressure-responsive foam adds cushioning above the pocket spring support system.
        • <strong>Plush pillow top</strong> - An additional cushioned upper layer provides a softer surface feel.
        • <strong>Quilted knitted fabric</strong> - A soft-touch quilted finish designed to complement the mattress comfort layers.
        • <strong>Single-sided construction</strong> - Designed for use with the designated sleeping surface facing upwards.
        • <strong>Approximately 28cm depth</strong> - A generously cushioned mattress profile combining spring support with comfort layers.
        • <strong>UK-made construction</strong> - Crafted in the United Kingdom.
        • <strong>Three UK mattress sizes</strong> - Available in Single (3ft), Double (4ft 6in) and King (5ft).
        • <strong>Mattress-only product</strong> - Divan base, headboard and other bedroom accessories are not included.`,
      benefits: `• <strong>Supportive comfort with added cushioning</strong> - The Air Flow 2000 combines a medium-to-firm feel with memory foam and a plush pillow top, making it an option for sleepers who prefer underlying support without an entirely firm sleeping surface.
        • <strong>Responsive pocket spring support</strong> - Individually pocketed springs respond to pressure across the mattress and can help limit movement transfer between sleeping partners.
        • <strong>Layered memory foam and pillow top comfort</strong> - The memory foam adds pressure-responsive cushioning, while the pillow top provides an extra layer of softness at the sleeping surface.
        • <strong>Practical single-sided design</strong> - The mattress is designed to be used with its designated sleeping surface facing upwards, without the need to flip it over.
        • <strong>Medium-to-firm feel for individual preferences</strong> - A supportive option for those who prefer a firmer underlying feel with added cushioning. Comfort can vary depending on body weight, sleeping position and personal preference.
        • <strong>UK-made quality</strong> - Crafted in the UK with a quilted knitted fabric finish, combining traditional mattress construction with memory foam comfort.`,
      dimensions: `The Air Flow 2000 is available in three standard UK mattress sizes:

        • <strong>Single (3ft)</strong> - Standard UK reference size: 90 × 190cm
        • <strong>Double (4ft 6in)</strong> - Standard UK reference size: 135 × 190cm
        • <strong>King Size (5ft)</strong> - Standard UK reference size: 150 × 200cm
        • <strong>Mattress Depth</strong> - Approximately 28cm

        <strong>Please note:</strong> These are standard UK mattress dimensions and should be checked against the final manufacturer specifications. Please measure your existing bed frame before ordering. Mattress dimensions are approximate and manufacturing tolerances may apply.

        <strong>Product Type:</strong> Mattress Only · <strong>Available Firmness:</strong> Medium to Firm`,
      deliveryReturns: `${DELIVERY}

        • <strong>1-Year Warranty</strong> - The Air Flow 2000 mattress is supplied with a one-year warranty, subject to the applicable warranty terms. Your statutory consumer rights remain unaffected.

        ${RETURNS}`,
    },
    whyChoose: [
      "The Air Flow 2000 is designed for sleepers seeking a balance of responsive support and cushioned comfort. Its individually pocketed spring system provides adaptable support, while the deep memory foam layer and plush pillow top add softness at the sleeping surface. With a medium-to-firm feel, this mattress offers a supportive foundation complemented by additional comfort layers. Finished in quilted knitted fabric and crafted in the UK, it features a practical single-sided design and an approximate depth of 28cm. Available in Single, Double and King sizes, the Air Flow 2000 is a versatile option for anyone looking for a pocket sprung mattress with the added comfort of memory foam and a pillow top. Supplied with a one-year warranty, subject to the applicable terms.",
    ],
    faqs: [
      { question: "How firm is the Air Flow 2000 mattress?", answer: "The Air Flow 2000 is rated medium to firm. Its pocket spring system provides responsive underlying support, while the memory foam and plush pillow top add cushioning at the surface. The overall feel may vary depending on body weight, sleeping position and personal preference." },
      { question: "Is a 2000 pocket spring mattress good?", answer: "A 2000 pocket sprung mattress can be a good option for sleepers looking for responsive support. Pocket springs respond independently to pressure, while comfort layers influence the overall mattress feel. However, spring count alone does not determine mattress quality or suitability. Firmness, materials, construction and individual preferences are also important." },
      { question: "Is the Air Flow 2000 suitable for side sleepers?", answer: "The Air Flow 2000 combines medium-to-firm support with a cushioned memory foam layer and plush pillow top. Some side sleepers may appreciate this balance, although those who prefer a particularly soft mattress may find the underlying feel firmer than expected. Suitability depends on body weight and personal comfort preferences." },
      { question: "What is a pocket spring pillow top mattress?", answer: "A pocket sprung pillow top mattress combines individually wrapped pocket springs with an additional cushioned layer at the sleeping surface. The springs respond independently to pressure, while the pillow top adds surface comfort. The Air Flow 2000 also includes a deep memory foam layer to complement its pocket spring construction." },
      { question: "Should I flip or rotate the Air Flow 2000 mattress?", answer: "The Air Flow 2000 is a single-sided mattress and should not be flipped over. Keep the designated sleeping surface facing upwards and follow the manufacturer’s care instructions for any recommended rotation schedule." },
      { question: "Does the Air Flow 2000 include the divan base or headboard?", answer: "No. The Air Flow 2000 is sold as a mattress only. The divan base, headboard, bedding and other bedroom accessories shown in the product imagery are not included." },
    ],
    ...photos("Air Flow 2000", ["Air Flow 2000 pocket sprung pillow top mattress", "Air Flow 2000 mattress on a divan in a bright bedroom", "Air Flow 2000 mattress in an evening bedroom setting"]),
    specs: [
      { label: "Firmness", value: "Medium to Firm", note: "Pillow top comfort" },
      { label: "Profile", value: "28cm", note: "Approximate depth" },
      { label: "Springs", value: "Up to 2,000", note: "Pocket springs" },
      { label: "Delivery", value: "Free", note: "All orders" },
    ],
    features: [
      { title: "Responsive pocket spring support", body: "Up to 2,000 individually pocketed springs respond independently to pressure and movement.", points: ["Up to 2,000 pocket springs", "Medium-to-firm support", "Single-sided construction"] },
      { title: "Memory foam and pillow top comfort", body: "A deep memory foam layer and a plush pillow top add cushioning at the sleeping surface.", points: ["Deep memory foam layer", "Plush pillow top", "Quilted knitted fabric"] },
    ],
    bestFor: ["Pocket Spring", "Side Sleepers"],
    stockCount: 1000,
    compareSpecs: { springType: "Up to 2,000 pocket springs", comfortLayer: "Memory foam & pillow top", cover: "Quilted knitted fabric", turnable: false, weight: "To be confirmed" },
  },
  {
    slug: "ella-3000-pocket-spring-mattress",
    layout: "pocket",
    quickFacts: ["Up to 3,000 Pocket Springs", "Cooling Gel & Memory Foam", "31cm Depth", "Firmness: Firm to Extra Firm"],
    love: [
      { icon: "springs", label: "Support System", title: "Pocket Springs", text: "Up to 3,000 individually pocketed springs respond independently to pressure and movement." },
      { icon: "cooling", label: "Comfort Fillings", title: "Cooling Gel & Memory Foam", text: "Four foam layers, including cooling gel and memory foam, add comfort above the springs." },
      { icon: "firmness", label: "Firmness", title: "Firm to Extra Firm", text: "Designed for sleepers who prefer a noticeably firmer mattress surface." },
    ],
    name: "Ella 3000 Pocket Spring Mattress",
    shortName: "Ella 3000",
    price: "Price coming soon",
    firmness: "Firm to Extra Firm",
    comingSoon: true,
    copy: {
      seoTitle: "3000 Pocket Spring Mattress | Ella 3000 Firm Gel Foam",
      metaDescription: "Discover the Ella 3000 pocket sprung mattress with up to 3,000 springs, cooling gel, memory foam and firm-to-extra-firm support. UK handcrafted.",
      insertKicker: "UK handcrafted • Firm-to-extra-firm support • Cooling gel & memory foam",
      whyChooseTitle: "Why Choose the Ella 3000 Mattress?",
      featuresHeading: "Features You’ll Love",
      faqIntro: "Helpful answers about the Ella 3000’s firmness, pocket springs, cooling gel, foam layers and mattress care.",
      deliveryTitle: "Delivery, Warranty & Returns",
    },
    heroDescription:
      "The Ella 3000 is a UK-handcrafted, firm-to-extra-firm pocket sprung mattress combining up to 3,000 individually pocketed springs with four foam layers, including cooling gel and memory foam. Designed with a foam-encapsulated perimeter for edge-to-edge stability, it offers a supportive feel with layered cushioning. Finished in luxurious quilted knitted fabric, this single-sided mattress has an approximate depth of 31cm.",
    description:
      "The Ella 3000 is a firm-to-extra-firm pocket sprung mattress designed for sleepers who prefer a more supportive feel. Featuring up to 3,000 individually pocketed springs, four foam layers including cooling gel and memory foam, and a foam-encapsulated perimeter, it combines responsive support with layered cushioning. The mattress is finished in quilted knitted fabric and handcrafted in the UK. Its single-sided construction and approximate 31cm depth complete the design.",
    bullets: ["Firm-to-extra-firm support", "Up to 3,000 pocket springs", "Foam-encapsulated edge support", "Four foam layers including cooling gel and memory foam"],
    accordionContent: {
      features: `• <strong>Firm-to-extra-firm feel</strong> - Designed for sleepers who prefer a noticeably firmer mattress surface.
        • <strong>Up to 3,000 pocket springs</strong> - Individually pocketed springs designed to respond independently to pressure and movement.
        • <strong>Foam-encapsulated perimeter</strong> - Foam reinforcement around the spring system is designed to provide stability towards the mattress edges.
        • <strong>Four foam layers</strong> - Multiple comfort layers, including cooling gel and memory foam, complement the pocket spring support system.
        • <strong>Quilted knitted fabric</strong> - A soft-touch quilted finish designed for comfort and breathability.
        • <strong>Cooling gel foam</strong> - A cooling gel comfort material incorporated into the mattress construction.
        • <strong>Single-sided construction</strong> - Designed to be used with its designated sleeping surface facing upwards.
        • <strong>Approximately 31cm depth</strong> - A deep mattress profile combining its spring support system with multiple foam layers.
        • <strong>Handcrafted in the UK</strong> - Manufactured in the United Kingdom with attention to mattress construction and finishing.`,
      benefits: `• <strong>Firm-to-extra-firm comfort</strong> - The Ella 3000 is designed for sleepers who prefer a firmer underlying feel rather than a deeply soft sleeping surface.
        • <strong>Responsive pocket spring support</strong> - Individually pocketed springs allow different areas of the mattress to respond to pressure, helping to limit movement transfer.
        • <strong>Layered foam cushioning</strong> - Four foam layers, including memory foam and cooling gel, add comfort above the pocket spring support system.
        • <strong>Foam-encapsulated edge stability</strong> - A reinforced foam perimeter is designed to support the outer structure of the mattress.
        • <strong>A firmer choice to consider</strong> - The firm-to-extra-firm rating may suit people who prefer less surface softness. The perceived firmness will vary with body weight, sleeping position and individual comfort preferences.
        • <strong>Practical single-sided design</strong> - The designated sleeping surface remains facing upwards, removing the need to flip the mattress over.`,
      dimensions: `• <strong>Mattress Depth</strong> - Approximately 31cm

        • <strong>Single (3ft)</strong> - 90 × 190cm
        • <strong>Double (4ft 6in)</strong> - 135 × 190cm
        • <strong>King Size (5ft)</strong> - 150 × 200cm

        ${SIZE_NOTE}`,
      deliveryReturns: `${DELIVERY}

        ${RETURNS}`,
    },
    whyChoose: [
      "The Ella 3000 brings together a firm-to-extra-firm feel, individually pocketed spring support and four foam comfort layers in a UK-handcrafted mattress. Its construction includes cooling gel and memory foam, offering additional cushioning above the pocket spring system. A foam-encapsulated perimeter is designed for edge-to-edge stability, while the quilted knitted fabric provides a comfortable finish. At approximately 31cm deep, the Ella 3000 has a substantial layered construction and a practical single-sided design. It is an option worth considering for sleepers who prefer a firmer mattress feel with the added comfort of foam layers. As firmness preferences vary, choosing the right mattress should also take account of body weight, sleeping position and personal comfort.",
    ],
    faqs: [
      { question: "Is the Ella 3000 a firm mattress?", answer: "Yes. The Ella 3000 is rated firm to extra firm, making it an option for sleepers who prefer a more supportive feel with less surface softness. Its foam layers add cushioning, but individual perceptions of firmness may vary." },
      { question: "Is a 3000 pocket spring mattress good?", answer: "A 3000 pocket sprung mattress can be a good choice for those seeking responsive spring support. However, overall mattress comfort depends on much more than spring count, including firmness, comfort layers, construction and individual preferences. The Ella 3000 combines pocket springs with a firm-to-extra-firm feel and multiple foam layers." },
      { question: "Do more pocket springs make a mattress firmer?", answer: "Not necessarily. Spring count alone does not determine mattress firmness. The spring design, tension, comfort materials and overall construction all influence how a mattress feels. The Ella 3000 has a manufacturer-specified firm-to-extra-firm rating." },
      { question: "What is foam encapsulation in a pocket spring mattress?", answer: "Foam encapsulation uses foam reinforcement around the pocket spring unit to help stabilise the mattress perimeter. The Ella 3000 uses a foam-encapsulated design intended to provide edge-to-edge stability." },
      { question: "Should I flip the Ella 3000 mattress?", answer: "No. The Ella 3000 has a single-sided construction and should be used with its designated sleeping surface facing upwards. Follow the manufacturer’s care instructions for any recommended rotation schedule." },
      { question: "Does the Ella 3000 contain cooling gel and memory foam?", answer: "Yes. The Ella 3000 features four foam layers, including cooling gel and memory foam. These form part of the comfort system above its pocket springs. The presence of cooling gel does not guarantee a particular sleeping temperature for every person." },
    ],
    ...photos("Ella 3000", ["Ella 3000 pocket sprung mattress with navy border", "Ella 3000 mattress on a divan in a bright bedroom", "Ella 3000 mattress in an evening bedroom setting"]),
    specs: [
      { label: "Firmness", value: "Firm to Extra Firm", note: "Supportive feel" },
      { label: "Profile", value: "31cm", note: "Approximate depth" },
      { label: "Springs", value: "Up to 3,000", note: "Pocket springs" },
      { label: "Delivery", value: "Free", note: "All orders" },
    ],
    features: [
      { title: "Firm pocket spring support", body: "Up to 3,000 pocket springs and a foam-encapsulated perimeter for edge-to-edge stability.", points: ["Up to 3,000 pocket springs", "Firm-to-extra-firm feel", "Foam-encapsulated edges"] },
      { title: "Cooling gel and memory foam", body: "Four foam layers, including cooling gel and memory foam, add cushioning above the springs.", points: ["Four foam layers", "Cooling gel foam", "Quilted knitted fabric"] },
    ],
    bestFor: ["Pocket Spring", "Heavy Sleepers (90kg+)", "Stomach Sleepers"],
    stockCount: 1000,
    compareSpecs: { springType: "Up to 3,000 pocket springs", comfortLayer: "4 foam layers incl. cooling gel & memory foam", cover: "Quilted knitted fabric", turnable: false, weight: "To be confirmed" },
  },
  {
    slug: "harmony-1000-pocket-spring-mattress",
    layout: "pocket",
    quickFacts: ["Up to 1,000 Pocket Springs", "Generous Memory Foam", "31cm Depth", "Firmness: Medium to Firm"],
    love: [
      { icon: "springs", label: "Support System", title: "Pocket Springs", text: "Up to 1,000 individually pocketed springs respond independently to pressure and movement." },
      { icon: "foam", label: "Comfort Fillings", title: "Memory Foam", text: "A generous memory foam layer adds cushioning above the pocket spring support system." },
      { icon: "firmness", label: "Firmness", title: "Medium to Firm", text: "Noticeable underlying support with cushioning at the surface." },
    ],
    name: "Harmony 1000 Pocket Spring Mattress",
    shortName: "Harmony 1000",
    price: "Price coming soon",
    firmness: "Medium to Firm",
    comingSoon: true,
    copy: {
      seoTitle: "1000 Pocket Spring Mattress | Harmony Memory Foam",
      metaDescription: "Discover the Harmony 1000 pocket sprung mattress with memory foam, medium-to-firm support and foam-encapsulated sides. UK handcrafted, approx. 31cm deep.",
      insertKicker: "UK handcrafted • Memory foam comfort • 31cm deep",
      whyChooseTitle: "Why Choose the Harmony 1000 Mattress?",
      featuresHeading: "Features You’ll Love",
      faqIntro: "Helpful answers about Harmony’s pocket springs, memory foam comfort, medium-to-firm feel and mattress care.",
      deliveryTitle: "Delivery, Warranty & Returns",
    },
    heroDescription:
      "The Harmony 1000 is a UK-handcrafted, medium-to-firm pocket sprung mattress combining up to 1,000 individually pocketed springs with a generous memory foam comfort layer. Designed to offer responsive support with additional cushioning, it features foam-encapsulated sides for edge stability and a deep-tufted, knitted fabric finish. This single-sided mattress has an approximate depth of 31cm, bringing together traditional pocket spring construction and memory foam comfort.",
    description:
      "The Harmony 1000 pocket sprung mattress combines responsive spring support with the cushioning comfort of memory foam. Featuring up to 1,000 individually pocketed springs, foam-encapsulated sides and a generous memory foam layer, it provides a medium-to-firm feel with additional surface comfort. Finished in knitted fabric with a deep-tufted design, this UK-handcrafted, single-sided mattress measures approximately 31cm in depth.",
    bullets: ["Medium-to-firm support", "Up to 1,000 pocket springs", "Generous memory foam comfort layer", "Foam-encapsulated edge support"],
    accordionContent: {
      features: `• <strong>Medium-to-firm feel</strong> - A balanced comfort rating for sleepers who prefer noticeable underlying support with cushioning at the surface.
        • <strong>Up to 1,000 pocket springs</strong> - Individually pocketed springs designed to respond independently to pressure and movement.
        • <strong>Foam-encapsulated sides</strong> - Foam reinforcement around the pocket spring unit helps provide stability towards the mattress edges.
        • <strong>Generous memory foam layer</strong> - Pressure-responsive foam provides additional cushioning above the pocket spring support system.
        • <strong>Luxurious knitted fabric</strong> - A soft-touch knitted surface finish designed for everyday comfort.
        • <strong>Deep-tufted finish</strong> - Traditional tufting helps secure the mattress fillings and maintain the structure of its comfort layers.
        • <strong>Single-sided construction</strong> - Designed to be used with its designated sleeping surface facing upwards.
        • <strong>Approximately 31cm depth</strong> - A deep mattress profile combining pocket spring support with memory foam cushioning.
        • <strong>Handcrafted in the UK</strong> - Manufactured and finished in the United Kingdom.`,
      benefits: `• <strong>Balanced medium-to-firm comfort</strong> - Harmony is designed for sleepers who prefer supportive underlying construction with the added cushioning of memory foam.
        • <strong>Responsive pocket spring support</strong> - Individually wrapped springs respond to pressure across the mattress, helping to limit movement transfer between sleeping partners.
        • <strong>Memory foam surface cushioning</strong> - A generous memory foam layer responds to body pressure, adding a more cushioned feel above the spring system.
        • <strong>Reinforced edge stability</strong> - Foam-encapsulated sides help stabilise the mattress perimeter and support its outer construction.
        • <strong>Comfort tailored to personal preference</strong> - The medium-to-firm feel may appeal to sleepers seeking a balance of support and cushioning. Individual comfort depends on body weight, sleeping position and personal preference.
        • <strong>Practical single-sided construction</strong> - The designated sleeping surface remains facing upwards, so the mattress does not need to be flipped.`,
      dimensions: `• <strong>Mattress Depth</strong> - Approximately 31cm

        • <strong>Single (3ft)</strong> - 90 × 190cm
        • <strong>Double (4ft 6in)</strong> - 135 × 190cm
        • <strong>King Size (5ft)</strong> - 150 × 200cm

        ${SIZE_NOTE} Due to the mattress depth, please also check that your fitted sheets have a suitable pocket depth.

        <strong>Product Type:</strong> Pocket Spring Memory Foam Mattress · <strong>Firmness:</strong> Medium to Firm · <strong>Construction:</strong> Single-Sided`,
      deliveryReturns: `${DELIVERY}

        ${RETURNS}`,
    },
    whyChoose: [
      "The Harmony 1000 combines individually pocketed spring support with generous memory foam cushioning in a medium-to-firm mattress designed for everyday comfort. Its pocket springs respond independently to pressure, while the memory foam provides an additional comfort layer above the support system. Foam-encapsulated sides reinforce the mattress perimeter, and traditional deep tufting helps maintain the construction of its comfort layers. Finished in luxurious knitted fabric and handcrafted in the UK, Harmony has a substantial profile of approximately 31cm. Its single-sided construction provides a practical sleeping surface without the need for flipping. Whether you are considering a traditional pocket sprung mattress or prefer the added cushioning of memory foam, Harmony brings these features together in one supportive design. Your ideal comfort level will depend on personal preference, body weight and sleeping position.",
    ],
    faqs: [
      { question: "How firm is the Harmony 1000 mattress?", answer: "Harmony has a medium-to-firm comfort rating. Its pocket spring system provides underlying support, while the generous memory foam layer adds cushioning. The mattress may feel different depending on body weight, sleeping position and personal preference." },
      { question: "Is a 1000 pocket spring mattress any good?", answer: "A 1000 pocket sprung mattress can be a good option for sleepers seeking responsive support. Pocket springs react independently to pressure, while the comfort layers influence the overall feel. Spring count alone does not determine quality or comfort. Harmony combines up to 1,000 pocket springs with memory foam and a medium-to-firm rating." },
      { question: "What does 1000 pocket spring mean?", answer: "A 1000 pocket sprung mattress is designed around a support system containing approximately 1,000 individually pocketed springs, depending on the manufacturer’s specification. Each spring sits in its own fabric pocket and can respond independently to pressure. Harmony is specified as having up to 1,000 pocket springs; the exact number for each mattress size has not been confirmed." },
      { question: "Does the Harmony 1000 mattress contain memory foam?", answer: "Yes. Harmony includes a generous memory foam comfort layer above its pocket spring support system. Memory foam responds to body pressure and provides additional cushioning, complementing the mattress’s medium-to-firm feel." },
      { question: "Should I flip or rotate the Harmony mattress?", answer: "Harmony is a single-sided mattress and should not be flipped over. Keep the designated sleeping surface facing upwards and follow the manufacturer’s care guidance for any recommended rotation schedule." },
      { question: "What are foam-encapsulated sides on a mattress?", answer: "Foam-encapsulated sides use foam reinforcement around the perimeter of the pocket spring unit. This helps stabilise the mattress edges and support its outer structure. Harmony features foam-encapsulated sides as part of its construction." },
    ],
    ...photos("Harmony 1000", ["Harmony 1000 pocket sprung memory foam mattress", "Harmony 1000 mattress on a divan in a bright bedroom", "Harmony 1000 mattress in an evening bedroom setting"]),
    specs: [
      { label: "Firmness", value: "Medium to Firm", note: "Balanced feel" },
      { label: "Profile", value: "31cm", note: "Approximate depth" },
      { label: "Springs", value: "Up to 1,000", note: "Pocket springs" },
      { label: "Delivery", value: "Free", note: "All orders" },
    ],
    features: [
      { title: "Pocket spring support", body: "Up to 1,000 pocket springs with foam-encapsulated sides for edge stability.", points: ["Up to 1,000 pocket springs", "Medium-to-firm feel", "Foam-encapsulated sides"] },
      { title: "Generous memory foam", body: "A generous memory foam layer adds cushioning above the springs, with a deep-tufted knitted finish.", points: ["Memory foam comfort layer", "Deep-tufted finish", "Luxurious knitted fabric"] },
    ],
    bestFor: ["Pocket Spring", "Side Sleepers"],
    stockCount: 1000,
    compareSpecs: { springType: "Up to 1,000 pocket springs", comfortLayer: "Generous memory foam layer", cover: "Knitted fabric, deep-tufted", turnable: false, weight: "To be confirmed" },
  },
  {
    slug: "mirage-firm-2000-pocket-spring-mattress",
    layout: "pocket",
    quickFacts: ["Up to 2,000 Pocket Springs", "Memory Foam & Deep Support Foam", "31cm Depth", "Firmness: Firm"],
    love: [
      { icon: "springs", label: "Support System", title: "Pocket Springs", text: "Up to 2,000 individually pocketed springs respond independently across the sleeping surface." },
      { icon: "foam", label: "Comfort Fillings", title: "Three Foam Layers", text: "Memory foam and deep support foam add cushioning above the pocket spring system." },
      { icon: "firmness", label: "Firmness", title: "Firm", text: "For sleepers who prefer a supportive mattress with a firmer underlying feel." },
    ],
    name: "Mirage Firm 2000 Pocket Spring Mattress",
    shortName: "Mirage 2000",
    price: "Price coming soon",
    firmness: "Firm",
    comingSoon: true,
    copy: {
      seoTitle: "Firm 2000 Pocket Spring Mattress | Mirage Memory Foam",
      metaDescription: "Discover the Mirage firm 2000 pocket sprung mattress with up to 2,000 springs, memory foam, reinforced edges and hand tufting. UK handcrafted, approx. 31cm deep.",
      insertKicker: "UK handcrafted • Firm pocket spring support • Memory foam comfort",
      whyChooseTitle: "Why Choose the Mirage Firm Pocket Spring Mattress?",
      featuresHeading: "Features You’ll Love",
      faqIntro: "Helpful answers about Mirage’s firm support, pocket springs, memory foam, edge construction and mattress care.",
      deliveryTitle: "Delivery, Warranty & Returns",
      notice: "Images are for illustration purposes only. Please refer to the product details for the exact items included.",
    },
    heroDescription:
      "The Mirage is a firm pocket sprung mattress, handcrafted in the UK with up to 2,000 individually pocketed springs and three foam layers, including memory foam and deep support foam. Designed for a supportive, firm feel with added cushioning, it features foam-encapsulated edges, a soft-touch knitted fabric finish and traditional hand tufting. This single-sided mattress measures approximately 31cm deep.",
    description:
      "Discover the Mirage firm pocket sprung mattress, combining up to 2,000 individually pocketed springs with three foam layers for a supportive yet cushioned sleeping surface. Its construction includes memory foam and deep support foam, complemented by a foam-encapsulated perimeter designed to provide additional edge stability. Finished in soft-touch knitted fabric and traditionally hand-tufted, this single-sided, UK-handcrafted mattress has an approximate depth of 31cm.",
    bullets: ["Firm pocket spring support", "Up to 2,000 pocket springs", "Three foam layers with memory foam", "Foam-encapsulated edges and hand-tufted finish"],
    accordionContent: {
      features: `• <strong>Firm comfort</strong> - Designed for sleepers who prefer a supportive mattress with a firmer underlying feel.
        • <strong>Up to 2,000 pocket springs</strong> - Individually pocketed springs respond independently to pressure and movement across the sleeping surface.
        • <strong>Foam-encapsulated perimeter</strong> - Foam reinforcement surrounds the pocket spring unit to provide additional structural stability towards the mattress edges.
        • <strong>Three foam comfort layers</strong> - A combination of foam materials, including memory foam and deep support foam, complements the pocket spring support system.
        • <strong>Soft-touch knitted fabric</strong> - A comfortable knitted fabric finish adds a soft feel to the mattress surface.
        • <strong>Traditional hand tufting</strong> - Hand tufting helps secure mattress fillings and maintain the arrangement of the comfort layers.
        • <strong>Single-sided construction</strong> - Designed for use with its designated sleeping surface facing upwards.
        • <strong>Approximately 31cm depth</strong> - A substantial mattress profile incorporating the spring unit and multiple foam layers.
        • <strong>Handcrafted in the UK</strong> - Expertly manufactured and finished in the United Kingdom.`,
      benefits: `• <strong>Supportive firm comfort</strong> - Mirage is designed for sleepers who prefer a firmer mattress feel without choosing a mattress described as extra firm.
        • <strong>Independent pocket spring response</strong> - Individually pocketed springs allow areas of the mattress to respond independently to pressure, helping to reduce movement transfer across the sleeping surface.
        • <strong>Layered foam cushioning</strong> - Three foam layers, including memory foam and deep support foam, provide cushioning alongside the pocket spring system.
        • <strong>Reinforced mattress edges</strong> - Foam encapsulation helps stabilise the mattress perimeter and provide structural support towards the edges.
        • <strong>Firmness matched to personal preference</strong> - Mirage may appeal to people who prefer a firm sleeping surface. The perceived firmness and comfort will vary according to body weight, sleeping position and individual preferences.
        • <strong>Single-sided mattress care</strong> - The mattress does not need to be flipped. Follow the manufacturer's instructions for any recommended rotation schedule.`,
      dimensions: `• <strong>Mattress Depth</strong> - Approximately 31cm

        • <strong>Single (3ft)</strong> - 90 × 190cm
        • <strong>Double (4ft 6in)</strong> - 135 × 190cm
        • <strong>King Size (5ft)</strong> - 150 × 200cm

        <strong>Please note:</strong> Please check your selected mattress dimensions against your existing bed frame or divan base before ordering. Dimensions are approximate, and small manufacturing tolerances may apply. For a mattress approximately 31cm deep, check that your fitted sheets have a suitable pocket depth.

        <strong>Mattress Type:</strong> Pocket Spring Memory Foam Mattress · <strong>Firmness Rating:</strong> Firm · <strong>Construction:</strong> Single-Sided · <strong>Spring Count:</strong> Up to 2,000 Pocket Springs`,
      deliveryReturns: `${DELIVERY}

        • <strong>Returns & Cancellations</strong> - Please review our current Returns Policy for details of cancellation rights, return eligibility, collection or return arrangements, and any applicable charges.`,
    },
    whyChoose: [
      "The Mirage combines firm pocket spring support with multiple foam comfort layers to create a supportive and cushioned mattress feel. Its individually pocketed spring system allows different areas of the mattress to respond to pressure, while the three foam layers, including memory foam and deep support foam, add comfort above the spring unit.",
      "A foam-encapsulated perimeter is designed to reinforce the mattress edges, and traditional hand tufting helps keep the fillings in place. Finished in soft-touch knitted fabric and handcrafted in the UK, Mirage has a substantial depth of approximately 31cm.",
      "With its single-sided construction, Mirage offers a practical choice for customers seeking a firm pocket sprung mattress with the additional cushioning of memory foam. The right mattress firmness is a personal decision and should take account of sleeping position, body weight and individual comfort preferences.",
    ],
    faqs: [
      { question: "How firm is the Mirage 2000 pocket spring mattress?", answer: "Mirage has a firm comfort rating. It combines a supportive pocket spring system with three foam layers, including memory foam and deep support foam. Although designed to provide a firmer feel, the perceived firmness will vary depending on body weight, sleeping position and personal preference." },
      { question: "Is a 2000 pocket spring mattress good?", answer: "A 2000 pocket sprung mattress can be a good option for sleepers who prefer responsive spring support. Individually pocketed springs allow different areas of the mattress to react to pressure. However, spring count alone does not determine comfort or quality. Mirage combines up to 2,000 pocket springs with foam cushioning and a firm comfort rating." },
      { question: "Do more pocket springs make a mattress firmer?", answer: "Not necessarily. Mattress firmness depends on several factors, including spring tension, spring design, foam layers and overall construction. A higher spring count does not automatically mean a firmer mattress. Mirage is rated firm by the manufacturer and incorporates up to 2,000 pocket springs." },
      { question: "Does the Mirage pocket spring mattress contain memory foam?", answer: "Yes. Mirage features three foam layers, including memory foam and deep support foam. These materials add cushioning above the pocket spring support system while maintaining the mattress's manufacturer-rated firm feel." },
      { question: "Should I flip or rotate the Mirage mattress?", answer: "Mirage has a single-sided construction and should not be flipped over. Always keep the designated sleeping surface facing upwards. Follow the manufacturer's care instructions for any recommended rotation schedule." },
      { question: "What is foam encapsulation in a pocket spring mattress?", answer: "Foam encapsulation uses reinforced foam around the perimeter of a pocket spring unit. It is designed to improve structural stability towards the mattress edges. Mirage incorporates a foam-encapsulated perimeter as part of its support system." },
    ],
    ...photos("Mirage 2000", ["Mirage pocket sprung mattress with hand-tufted knitted fabric sleeping surface", "Mirage firm pocket sprung mattress on a divan base", "Mirage pocket sprung mattress with a deep hand-tufted mattress profile"]),
    specs: [
      { label: "Firmness", value: "Firm", note: "Supportive feel" },
      { label: "Profile", value: "31cm", note: "Approximate depth" },
      { label: "Springs", value: "Up to 2,000", note: "Pocket springs" },
      { label: "Delivery", value: "Free", note: "All orders" },
    ],
    features: [
      { title: "Firm pocket spring support", body: "Firm pocket sprung mattress with up to 2,000 springs, memory foam cushioning and reinforced edges.", points: ["Up to 2,000 pocket springs", "Firm comfort rating", "Foam-encapsulated edges"] },
      { title: "Memory foam and deep support foam", body: "Three foam layers add cushioning above the springs, finished with traditional hand tufting.", points: ["Three foam layers", "Hand-tufted finish", "Soft-touch knitted fabric"] },
    ],
    bestFor: ["Pocket Spring", "Back Pain"],
    stockCount: 1000,
    compareSpecs: { springType: "Up to 2,000 pocket springs", comfortLayer: "3 foam layers incl. memory foam", cover: "Soft-touch knitted fabric", turnable: false, weight: "To be confirmed" },
  },
  {
    slug: "newby-1000-pocket-spring-mattress",
    layout: "pocket",
    quickFacts: ["Up to 1,000 Pocket Springs", "Memory Foam", "26cm Depth", "Firmness: Medium"],
    love: [
      { icon: "springs", label: "Support System", title: "Pocket Springs", text: "Up to 1,000 individually wrapped springs respond separately to pressure." },
      { icon: "foam", label: "Comfort Fillings", title: "Memory Foam", text: "A memory foam comfort layer adds body-contouring cushioning above the springs." },
      { icon: "firmness", label: "Firmness", title: "Medium", text: "A balanced feel between softer cushioning and firmer support." },
    ],
    name: "Newby 1000 Pocket Spring Memory Foam Mattress",
    shortName: "Newby 1000",
    price: "Price coming soon",
    firmness: "Medium",
    comingSoon: true,
    copy: {
      seoTitle: "Newby 1000 Pocket Spring Mattress | Memory Foam",
      metaDescription: "Discover the Newby 1000 medium pocket sprung mattress with memory foam, up to 1,000 pocket springs and hand-tufted comfort. Made in the UK, approx. 26cm deep.",
      insertKicker: "Made in the UK • Memory foam comfort • Medium feel",
      whyChooseTitle: "Why Choose the Newby 1000 Pocket Spring Mattress?",
      featuresHeading: "Features You’ll Love",
      faqIntro: "Helpful answers about Newby 1000’s medium feel, pocket springs, memory foam and mattress care.",
      deliveryTitle: "Delivery, Warranty & Returns",
      notice: "Mattress only. Bed base, headboard, bedding and decorative accessories are not included.",
    },
    heroDescription:
      "The Newby 1000 is a UK-made medium pocket sprung mattress combining up to 1,000 individually wrapped pocket springs with a memory foam comfort layer. Designed for a balanced feel, it features wire-edge support, deep polyester fillings and a hand-tufted finish. Its single-sided construction offers convenient mattress care, while the approximately 26cm depth provides a substantial sleeping surface. Available as a mattress only, without a bed base or headboard.",
    description:
      "The Newby 1000 is a medium pocket sprung mattress designed to combine responsive spring support with the cushioning comfort of memory foam. Manufactured in the UK, it features up to 1,000 individually wrapped pocket springs, wire-edge support, deep polyester fillings and a traditional hand-tufted finish. Its single-sided design means the mattress does not need flipping. With an approximate depth of 26cm, Newby 1000 is a practical choice for sleepers seeking a balanced mattress feel with the added comfort of memory foam.",
    bullets: ["Balanced medium comfort", "Up to 1,000 individually wrapped pocket springs", "Wire-edge support for mattress structure", "Memory foam comfort layer and hand-tufted finish"],
    accordionContent: {
      features: `• <strong>Medium comfort feel</strong> - Designed for sleepers who prefer a balanced feel between softer cushioning and firmer support.
        • <strong>Up to 1,000 pocket springs</strong> - Individually wrapped springs respond separately to pressure and help provide responsive support.
        • <strong>Memory foam comfort layer</strong> - Adds body-contouring cushioning above the pocket spring system.
        • <strong>Wire-edge support</strong> - Helps support the mattress structure around its perimeter.
        • <strong>Deep polyester fillings</strong> - Provide an additional layer of cushioning within the mattress.
        • <strong>Soft-touch knitted fabric</strong> - Provides a comfortable surface finish.
        • <strong>Hand-tufted construction</strong> - Helps secure the internal fillings and maintain the mattress structure.
        • <strong>Single-sided design</strong> - Designed to be slept on one side without the need for flipping.
        • <strong>Approx. 26cm mattress depth</strong> - Offers a substantial mattress profile.
        • <strong>Made in the UK</strong> - Manufactured in the United Kingdom.`,
      benefits: `• <strong>Balanced everyday comfort</strong> - Newby 1000 combines a medium mattress feel with a cushioning memory foam layer for sleepers who prefer neither an especially soft nor an extra-firm surface.
        • <strong>Responsive pocket spring support</strong> - Individually wrapped springs respond to pressure independently, helping the mattress adapt to movement and different areas of the body.
        • <strong>Cushioning where you need it</strong> - The memory foam layer adds contouring comfort around the body's contact points.
        • <strong>Supportive edge construction</strong> - Wire-edge support helps provide structural support around the mattress perimeter.
        • <strong>Convenient single-sided care</strong> - There is no need to flip the mattress, making regular care more straightforward.
        • <strong>Traditional UK craftsmanship</strong> - Hand tufting, deep fillings and UK manufacturing combine traditional mattress construction with modern pocket springs.`,
      dimensions: `Newby 1000 is designed for standard UK mattress sizes. Please select from the available size options.

        • <strong>Single</strong> - 90 × 190cm
        • <strong>Double</strong> - 135 × 190cm
        • <strong>King</strong> - 150 × 200cm
        • <strong>Mattress Depth</strong> - Approx. 26cm

        <strong>Please note:</strong> Please check your bed frame dimensions before ordering. Measurements are approximate, and small manufacturing tolerances may apply. The number of pocket springs may vary by mattress size. The stated spring count of up to 1,000 should not be interpreted as an exact count for every size.

        Mattress only. Bed base, headboard, bedding and decorative accessories are not included.`,
      deliveryReturns: `${DELIVERY}

        ${RETURNS}`,
    },
    whyChoose: [
      "The Newby 1000 Pocket Spring Memory Foam Mattress is designed for sleepers looking for balanced support with a comfortable, cushioning surface. Combining up to 1,000 individually wrapped pocket springs with a memory foam comfort layer, Newby 1000 offers a responsive sleeping surface with the added contouring feel of memory foam. Wire-edge support helps support the mattress perimeter, while deep polyester fillings and traditional hand tufting complete its carefully constructed design. Made in the UK and measuring approximately 26cm deep, this single-sided mattress is a practical option for everyday comfort. Whether you're looking for a medium pocket sprung mattress for your main bedroom or exploring pocket spring and memory foam options, Newby 1000 brings together responsive support, cushioning and traditional mattress craftsmanship.",
    ],
    faqs: [
      { question: "How firm is the Newby 1000 mattress?", answer: "The Newby 1000 has a medium comfort rating. It is designed to provide a balanced feel between cushioning and support, rather than an especially soft or extra-firm sleeping surface. Individual comfort will depend on body weight, sleeping position and personal preference." },
      { question: "Is the Newby 1000 mattress suitable for side sleepers?", answer: "Newby 1000 may appeal to side sleepers who prefer a medium mattress with a cushioning comfort layer. Its pocket springs provide responsive support, while the memory foam adds contouring comfort. Suitability depends on individual body shape, weight and personal preference." },
      { question: "How many pocket springs does the Newby 1000 mattress have?", answer: "Newby 1000 features up to 1,000 individually wrapped pocket springs. The exact number may vary depending on mattress size. Pocket springs respond separately to pressure, helping provide more individualised support across the mattress surface." },
      { question: "Does the Newby 1000 mattress contain memory foam?", answer: "Yes. The Newby 1000 combines a pocket spring support system with a memory foam comfort layer. The memory foam adds cushioning and helps the sleeping surface contour to the body." },
      { question: "Do I need to flip the Newby 1000 mattress?", answer: "No. Newby 1000 is a single-sided mattress and is not designed to be flipped. Follow the manufacturer's care instructions regarding rotation to help maintain even wear." },
      { question: "Can I buy the Newby 1000 mattress without a bed base?", answer: "Yes. Newby 1000 is offered as a mattress-only product. The bed base and headboard shown in lifestyle photographs are not included." },
    ],
    ...photos("Newby", ["Newby 1000 medium pocket sprung mattress with hand-tufted surface", "Newby 1000 UK-made pocket sprung mattress in bedroom setting", "Newby 1000 mattress showing its hand-tufted sleeping surface"]),
    specs: [
      { label: "Firmness", value: "Medium", note: "Balanced feel" },
      { label: "Profile", value: "26cm", note: "Approximate depth" },
      { label: "Springs", value: "Up to 1,000", note: "Pocket springs" },
      { label: "Delivery", value: "Free", note: "All orders" },
    ],
    features: [
      { title: "Balanced medium comfort", body: "Up to 1,000 individually wrapped pocket springs with wire-edge support.", points: ["Medium comfort feel", "Up to 1,000 pocket springs", "Wire-edge support"] },
      { title: "Memory foam and hand tufting", body: "A memory foam comfort layer and deep polyester fillings, with a traditional hand-tufted finish.", points: ["Memory foam comfort layer", "Deep polyester fillings", "Hand-tufted construction"] },
    ],
    bestFor: ["Pocket Spring", "Side Sleepers"],
    stockCount: 1000,
    compareSpecs: { springType: "Up to 1,000 pocket springs", comfortLayer: "Memory foam & deep polyester fillings", cover: "Soft-touch knitted fabric", turnable: false, weight: "To be confirmed" },
  },
];
