export type MattressProduct = {
  slug: string;
  name: string;
  shortName: string;
  price: string;
  firmness: string;
  description: string;
  heroDescription: string;
  image: string;
  imageAlt: string;
  gallery?: Array<{ src: string; alt: string }>;
  bullets: string[];
  specs: Array<{ label: string; value: string; note: string }>;
  features: Array<{ title: string; body: string; points: string[] }>;
  whyChoose: string[];
  accordionContent?: {
    features: string;
    benefits: string;
    dimensions: string;
    deliveryReturns: string;
  };
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

const allOrthoMattressProducts: MattressProduct[] = [
  {
    slug: "capri-ortho-mattress",
    name: "Capri Ortho Mattress",
    shortName: "Capri Ortho",
    price: "From £749",
    firmness: "Medium to Firm",
    description:
      "A UK-made, medium-to-firm orthopaedic mattress with an open coil spring system, wire-edge support, deep polyester filling and a deep-tufted damask finish. Capri Ortho is double-sided and approximately 26cm deep.",
    heroDescription:
      "Capri Ortho is a UK-made medium-to-firm orthopaedic mattress combining open coil spring support with a reinforced wire edge, deep polyester filling and a quality damask cover. Its deep-tufted, double-sided construction is designed to be flipped and rotated regularly, helping both sleeping surfaces wear more evenly. Approximately 26cm deep, Capri Ortho is available in single, double and king sizes and is suitable for low-hazard domestic use under the stated BS 7177 specification.",
    whyChoose: [
      `The Capri Ortho Mattress is a medium-to-firm orthopaedic mattress designed for sleepers who prefer balanced support with a traditional sprung feel. Built around an interconnected open coil spring system with reinforced wire-edge support, it provides a consistent and supportive sleeping surface. Deep polyester fillings add cushioning above the springs, while the quality damask fabric and deep-tufted construction provide a traditional, durable mattress finish.

      Designed with a practical double-sided construction, Capri Ortho can be flipped and rotated regularly to help distribute everyday wear across both sleeping surfaces. Expertly made in the UK, this orthopaedic mattress has an approximate depth of 26cm and is available in three standard UK sizes: Single, Double and King.

      Order your Capri Ortho Mattress online from our mattress business in Ilford, London. Enjoy free UK delivery, a 1-year guarantee and the option of 0% interest-free finance, subject to applicable terms and eligibility requirements.`,
    ],
    accordionContent: {
      features:
        `• <strong>Medium-to-firm comfort</strong> - A balanced feel for sleepers who prefer noticeable support without choosing an extra-firm mattress.
        • <strong>Open coil spring system</strong> - Interconnected springs create a consistent, traditionally sprung mattress feel across the sleeping surface.
        • <strong>Wire-edge support</strong> - A reinforced perimeter helps support the mattress structure around its edges.
        • <strong>Deep polyester filling</strong> - Adds a comfort layer above the spring unit.
        • <strong>Quality damask fabric</strong> - A traditional woven mattress finish with a refined feel.
        • <strong>Deep-tufted construction</strong> - Tufting helps secure the mattress fillings and maintain the structure of the comfort layers.
        • <strong>Double-sided design</strong> - Designed to be used on both sleeping surfaces and flipped and rotated as part of regular mattress care.
        • <strong>Approx. 26cm depth</strong> - A substantial mattress profile across the Capri Ortho range.
        • <strong>Made in the UK</strong> - Expertly crafted in the UK.
        • <strong>BS 7177 fire-safety information</strong> - Ignition Source 2 for low-hazard domestic use, where applicable to the supplied product specification.`,
      benefits:
        `• <strong>Balanced medium-to-firm comfort</strong> - Capri Ortho is designed for people who prefer a medium-to-firm, traditionally sprung mattress rather than a soft or deeply sinking sleep surface.
        • <strong>Consistent support and cushioning</strong> - Its wire-edge reinforced open coil system provides a consistent feel across the mattress, while deep polyester filling adds cushioning above the springs.
        • <strong>Double-sided practical design</strong> - Because Capri Ortho is double-sided, both sleeping surfaces can be used as part of a regular flip-and-rotate care routine.
        • <strong>Traditional UK-made construction</strong> - It may be a good match if you want a UK-made mattress with straightforward construction, a supportive feel and fewer complex comfort layers.
        • <strong>Personal comfort considerations</strong> - Firmness is personal, however, so body weight, sleeping position and individual comfort preference should all be considered before choosing.`,
      dimensions:
        `Capri Ortho is available in three standard UK mattress sizes:

        • <strong>Single</strong> - 90 × 190cm
        • <strong>Double</strong> - 135 × 190cm
        • <strong>King</strong> - 150 × 200cm
        • <strong>Mattress Depth</strong> - Approx. 26cm

        <strong>Please note:</strong> Check your existing bed frame or divan dimensions before ordering. Mattress dimensions are approximate and small manufacturing tolerances may apply.`,
      deliveryReturns:
        `• <strong>Free UK Delivery</strong> - Free UK delivery is available on Capri Ortho mattresses. Your estimated delivery timing will be shown or confirmed as part of the ordering process.

        • <strong>1-Year Guarantee & Finance</strong> - Capri Ortho is covered by our 1-year guarantee. 0% interest-free finance is also available subject to the applicable finance terms and eligibility requirements.

        • <strong>Returns & Cancellations</strong> - Please review our current returns policy before ordering for full information about cancellations, returns and any applicable conditions.`,
    },
    image: "/Capri Ortho Product Images/px-conversions/Capri Ortho Main.webp",
    imageAlt: "Capri Ortho main product image",
    gallery: [
      {
        src: "/Capri Ortho Product Images/px-conversions/Capri Ortho Main Alternative.webp",
        alt: "Capri Ortho alternative main product image",
      },
      ...["Double Morning", "Double Evening", "King Morning", "King Evening", "Single Morning", "Single Evening"].map((view) => ({
        src: `/Capri Ortho Product Images/px-conversions/Capri Ortho ${view}.webp`,
        alt: `Capri Ortho ${view} product image`,
      })),
    ],
    bullets: ["Medium-to-firm orthopaedic feel", "Open coil spring system", "Wire-edge support", "Double-sided, deep-tufted design"],
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
      { question: "How firm is the Capri Ortho mattress?", answer: "Capri Ortho has a medium-to-firm feel. It is designed for sleepers who want a supportive, stable surface without moving into the firmer feel of Hampton Ortho or the extra-firm feel of Deluxe Ortho. Mattress firmness is subjective, so body weight and personal comfort preference can affect how it feels to you." },
      { question: "Can the Capri Ortho mattress help with back pain?", answer: "Capri Ortho provides a medium-to-firm, supportive sleep surface, but no mattress can be guaranteed to treat or relieve back pain. The right mattress depends on factors including your comfort preference, body weight and sleeping position. Persistent or severe back pain should be discussed with a qualified healthcare professional rather than relying on a mattress as treatment." },
      { question: "Is the Capri Ortho mattress suitable for side sleepers?", answer: "It can suit some side sleepers who prefer a medium-to-firm mattress, but there is no single firmness that works for every side sleeper. Your body weight, shoulder and hip comfort, and personal preference will affect how the mattress feels. If you prefer more cushioning, compare Capri Ortho with the other firmness and comfort constructions in our range before ordering." },
      { question: "What is an open coil orthopaedic mattress?", answer: "An open coil mattress uses interconnected springs that work together as a single spring unit. In Capri Ortho, the open coil system is combined with wire-edge support, polyester filling, damask fabric and deep tufting to create its medium-to-firm feel. “Orthopaedic” describes the product’s supportive positioning rather than a medical treatment or one specific spring technology." },
      { question: "Should I flip and rotate the Capri Ortho mattress?", answer: "Yes. Capri Ortho is a double-sided mattress, so it is designed to be flipped and rotated regularly. Alternating the sleeping surfaces helps distribute normal wear more evenly. Follow the care schedule supplied with your mattress and avoid bending or folding the spring unit when turning it." },
      { question: "Can I buy the Capri Ortho mattress online in the UK?", answer: "Yes. Capri Ortho is available to order online in single, double and king sizes, with free UK delivery, 0% interest-free finance and a 1-year guarantee. Current price, firmness, specifications and stock availability are shown on this product page before you order." },
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
      "A UK-made, medium-to-firm orthopaedic mattress built around a traditional open coil spring unit with wire-edge support. Classic Ortho combines deep polyester filling, quality damask fabric and hand tufting in a double-sided design approximately 26cm deep",
    heroDescription:
      "Classic Ortho is a UK-made medium-to-firm orthopaedic mattress with an open coil spring system, wire-edge support and a hand-tufted damask finish. Deep polyester filling adds cushioning above the spring unit, while the double-sided design allows the mattress to be flipped and rotated for more even wear. Approximately 26cm deep and available in single, double and king sizes, it offers straightforward, traditionally sprung support.",
    whyChoose: [
      `The Classic Ortho Mattress is a medium-to-firm orthopaedic mattress designed for sleepers who prefer dependable support with a traditional sprung feel. Built around an open coil spring system with reinforced wire-edge support, it provides a consistent and supportive sleeping surface. Deep polyester fillings add cushioning above the springs, while quality damask fabric delivers a classic woven mattress finish. Available as a double orthopaedic mattress, it is also a practical choice for shoppers looking for traditional comfort and straightforward construction.

      Featuring a hand-tufted, double-sided design, Classic Ortho allows both sleeping surfaces to be used as part of a regular flip-and-rotate care routine. Handcrafted in the UK using traditional mattress-making techniques, this orthopaedic mattress measures approximately 26cm deep and is available in three standard UK sizes: Single, Double and King.

      Order your Classic Ortho Mattress online from our mattress business at 70 Ilford Lane, Ilford, London IG1 2LA. Enjoy free UK delivery, a 1-year guarantee and the option of 0% interest-free finance, subject to applicable terms and eligibility requirements.`,
    ],
    accordionContent: {
      features:
        `• <strong>Medium-to-firm comfort</strong> - A balanced feel for sleepers who want clear support without choosing a firm or extra-firm mattress.
        • <strong>Open coil spring system</strong> - Interconnected springs create a consistent, traditionally sprung feel across the sleeping surface.
        • <strong>Wire-edge support</strong> - Reinforcement around the perimeter helps support the mattress structure at its edges.
        • <strong>Deep polyester filling</strong> - Adds cushioning above the spring unit for a more comfortable surface feel.
        • <strong>Quality damask fabric</strong> - A traditional woven mattress finish with a refined feel.
        • <strong>Hand-tufted construction</strong> - Tufting helps secure the fillings and maintain the structure of the comfort layers.
        • <strong>Double-sided design</strong> - Both sleeping surfaces are designed for use, allowing the mattress to be flipped and rotated as part of regular care.
        • <strong>Approx. 26cm depth</strong> - A substantial mattress profile across the Classic Ortho range.
        • <strong>Handmade in the UK</strong> - Crafted in the UK using traditional mattress-making techniques.
        • <strong>BS 7177 fire-safety information</strong> - Please refer to the documented product specification for the applicable BS 7177 fire-safety classification.`,
      benefits:
        `• <strong>Balanced medium-to-firm support</strong> - Classic Ortho is designed for sleepers who prefer a medium-to-firm, traditionally sprung mattress with a supportive feel and straightforward construction.
        • <strong>Consistent support and cushioning</strong> - Its open coil spring system works with wire-edge support to create a consistent sleeping surface, while deep polyester filling adds cushioning above the springs.
        • <strong>Practical double-sided design</strong> - The double-sided design means both sleeping surfaces can be used as part of a regular flip-and-rotate care routine.
        • <strong>Traditional UK-made construction</strong> - It can be a strong choice if you want a UK-made orthopaedic mattress without complex hybrid layers.
        • <strong>Personal comfort considerations</strong> - Firmness is personal, however, so body weight, sleeping position and individual comfort preference should all be considered before ordering.`,
      dimensions:
        `<strong>Mattress Sizes & Dimensions</strong>

        Classic Ortho is available in three standard UK mattress sizes:

        • <strong>Single</strong> - 90 × 190cm (3ft × 6ft3)

        • <strong>Double</strong> - 135 × 190cm (4ft6 × 6ft3)

        • <strong>King</strong> - 150 × 200cm (5ft × 6ft6)

        • <strong>Mattress Depth</strong> - Approx. 26cm (10.2in)

        <strong>Please note:</strong> Check your existing bed frame or divan dimensions before ordering. Mattress dimensions are approximate and small manufacturing tolerances may apply.`,
      deliveryReturns:
        `• <strong>Free UK Delivery</strong> - Free UK delivery is available on Classic Ortho mattresses. Your estimated delivery timing will be shown or confirmed as part of the ordering process.

        • <strong>1-Year Guarantee & Finance</strong> - Classic Ortho is covered by our 1-year guarantee. 0% interest-free finance is also available subject to the applicable finance terms and eligibility requirements.

        • <strong>Returns & Cancellations</strong> - Please review our current returns policy before ordering for full information about cancellations, returns and any applicable conditions.`,
    },
    image: "/classic ortho product images/classic/Classic Ortho Main.webp",
    imageAlt: "Classic Ortho Main product image",
    gallery: [
      {
        src: "/classic ortho product images/classic/Classic Ortho Main Alternative.webp",
        alt: "Classic Ortho alternative main product image",
      },
      ...["Double Morning", "Double Evening", "King Morning", "King Evening", "Single Morning", "Single Evening"].map((view) => ({ src: `/classic ortho product images/classic/Classic Ortho ${view}.webp`, alt: `Classic Ortho ${view} product image` })),
    ],
    bullets: ["Medium-to-firm orthopaedic feel", "Open coil spring system", "Wire-edge support", "Double-sided, hand-tufted build"],
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
      { question: "How firm is the Classic Ortho mattress?", answer: "Classic Ortho has a medium-to-firm feel. It is intended for sleepers who prefer a supportive, stable surface with more cushioning than a firm or extra-firm mattress. Firmness is subjective, so body weight, sleeping position and personal preference can all affect how the mattress feels." },
      { question: "Will the Classic Ortho mattress suit me?", answer: "Classic Ortho may suit you if you prefer a medium-to-firm, traditionally sprung mattress, want a double-sided design and like the feel of an open coil spring system. If you prefer a firmer surface, compare Hampton Ortho; if you want the most solid feel in our range, compare Deluxe Ortho." },
      { question: "Can the Classic Ortho mattress help with back pain?", answer: "Classic Ortho provides a supportive medium-to-firm sleep surface, but no mattress can be guaranteed to treat or relieve back pain. Comfort depends on factors such as firmness preference, body weight and sleeping position. Persistent or severe back pain should be discussed with a qualified healthcare professional rather than relying on a mattress as treatment." },
      { question: "What is an open coil mattress, and how is it different from pocket sprung?", answer: "An open coil mattress uses interconnected springs that move together as one spring unit, while a pocket sprung mattress uses individual springs housed in separate fabric pockets so they can respond more independently. Classic Ortho uses an open coil spring system with wire-edge support for a traditional, consistent mattress feel." },
      { question: "Should I flip and rotate the Classic Ortho mattress?", answer: "Yes. Classic Ortho is double-sided, so it is designed to be flipped and rotated regularly. Alternating the sleeping surfaces helps distribute normal wear more evenly. Follow the care guidance supplied with the mattress and avoid bending or folding the spring unit when turning it." },
      { question: "Can I buy the Classic Ortho mattress online in the UK?", answer: "Yes. Classic Ortho is available to order online in single, double and king sizes, with free UK delivery, 0% interest-free finance and a 1-year guarantee. Current price, firmness, specifications and stock availability are shown on this product page before you order." },
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
      "Crafted in the UK, this firm single-sided orthopaedic spring mattress features an approximate depth of 26cm and a deep adaptive memory foam layer. The hand-tufted design is finished with luxurious knitted fabric and complete with foam encapsulation.",
    heroDescription:
      "Hampton Ortho is a UK-made firm orthopaedic mattress combining a supportive spring system with foam encapsulation and a deep adaptive memory foam comfort layer. A premium knitted fabric finish and hand-tufted construction give the mattress a refined feel, while its single-sided design keeps regular care straightforward. Approximately 26cm deep and available in single, double and king sizes, Hampton Ortho combines firm support with responsive cushioning.",
    whyChoose: [
      `The Hampton Ortho Mattress is a firm orthopaedic mattress designed for sleepers who prefer reliable support with an additional layer of cushioning comfort. Combining a traditional open coil spring system with deep adaptive memory foam, it offers a supportive sleeping surface with a gently contouring feel. Foam encapsulation reinforces the mattress perimeter for a more structured edge, while the hand-tufted knitted fabric provides a soft-touch, premium finish.

      Unlike the double-sided Classic Ortho and Capri Ortho mattresses, Hampton Ortho features a single-sided design and should be rotated rather than flipped. Expertly made in the UK, this mattress has an approximate depth of 26cm and is available in three standard UK sizes: Single, Double and King. Please note that the Jacquard Black (J2) bed base shown in product images is sold separately.

      Order your Hampton Ortho Mattress online from our mattress business at 70 Ilford Lane, Ilford, London IG1 2LA. Enjoy free UK delivery, a 1-year guarantee and the option of 0% interest-free finance, subject to applicable terms and eligibility requirements.`,
    ],
    accordionContent: {
      features:
        `• <strong>Firm comfort</strong> - A stable, supportive feel for sleepers who deliberately prefer a firmer mattress surface.
        • <strong>Open coil orthopaedic spring system</strong> - Interconnected springs create a consistent, traditionally sprung support core.
        • <strong>Foam encapsulation</strong> - A foam border surrounds the spring unit to reinforce the mattress perimeter and create a more structured edge.
        • <strong>Deep adaptive memory foam</strong> - Adds a contouring comfort layer above the spring system while retaining Hampton Ortho's firm overall feel.
        • <strong>Luxurious knitted fabric</strong> - A soft-touch, premium outer finish across the sleeping surface.
        • <strong>Hand-tufted construction</strong> - Tufting helps hold the mattress layers securely in place and maintain the structure of the comfort system.
        • <strong>Single-sided design</strong> - Hampton Ortho is not designed to be flipped; rotate it according to the supplied mattress-care guidance.
        • <strong>Approx. 26cm depth</strong> - A substantial mattress profile combining spring support, foam encapsulation and memory foam.
        • <strong>Made in the UK</strong> - Expertly crafted in the UK.
        • <strong>Bed base note</strong> - The Jacquard Black (J2) base shown in product imagery is sold separately.`,
      benefits:
        `• <strong>Firm support with cushioning comfort</strong> - Hampton Ortho is designed for sleepers who want a firm orthopaedic mattress but still value a cushioning comfort layer. Its open coil spring system provides the main support structure, while adaptive memory foam adds a more conforming surface feel.
        • <strong>Reinforced edges and secure construction</strong> - Foam encapsulation reinforces the spring unit around the perimeter, and the hand-tufted knitted finish helps keep the mattress layers securely assembled.
        • <strong>Practical single-sided design</strong> - The single-sided construction makes care straightforward because the mattress is rotated rather than flipped.
        • <strong>Balanced firmness and comfort</strong> - Hampton Ortho may suit shoppers comparing firm and medium-to-firm mattresses who want less sink than softer options without moving to the extra-firm feel of Deluxe Ortho.
        • <strong>Personal comfort considerations</strong> - Firmness is subjective, so body weight, sleeping position and individual comfort preference should all be considered before ordering.`,
      dimensions:
        `Hampton Ortho is available in three standard UK mattress sizes:

        • <strong>Single</strong> - 90 × 190cm (3ft × 6ft3)
        • <strong>Double</strong> - 135 × 190cm (4ft6 × 6ft3)
        • <strong>King</strong> - 150 × 200cm (5ft × 6ft6)
        • <strong>Mattress Depth</strong> - Approx. 26cm (10.2in)

        <strong>Please note:</strong> Check your existing bed frame or divan dimensions before ordering. Mattress dimensions are approximate and small manufacturing tolerances may apply.`,
      deliveryReturns:
        `• <strong>Free UK Delivery</strong> - Free UK delivery is available on Hampton Ortho mattresses. Your estimated delivery timing will be shown or confirmed as part of the ordering process.

        • <strong>1-Year Guarantee & Finance</strong> - Hampton Ortho is covered by our 1-year guarantee. 0% interest-free finance is also available subject to the applicable finance terms and eligibility requirements.

        • <strong>Returns & Cancellations</strong> - Please review our current returns policy before ordering for full information about cancellations, returns and any applicable conditions.`,
    },
    image: "/Hampton Ortho Product Images/hampton/Hampton Ortho Main.webp",
    imageAlt: "Hampton Ortho main product image",
    gallery: [
      {
        src: "/Hampton Ortho Product Images/hampton/Hampton Ortho Main Alternative.webp",
        alt: "Hampton Ortho alternative main product image",
      },
      ...["Double Morning", "Double Evening", "King Morning", "King Evening", "Single Morning", "Single Evening"].map((view) => ({ src: `/Hampton Ortho Product Images/hampton/Hampton Ortho ${view}.webp`, alt: `Hampton Ortho ${view} product image` })),
    ],
    bullets: ["Firm orthopaedic feel", "Deep adaptive memory foam", "Foam-encapsulated spring unit", "Single-sided, hand-tufted build"],
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
      { question: "Does the Hampton Ortho mattress need flipping or rotating?", answer: "Hampton Ortho is a single-sided mattress, so it should not be flipped. Rotate it regularly according to the care guidance supplied with the mattress to help distribute normal wear across the sleeping surface." },
      { question: "Who is the Hampton Ortho firm mattress best for?", answer: "Hampton Ortho may suit sleepers who deliberately prefer a firm, stable mattress surface with a memory foam comfort layer. Back and stomach sleepers may prefer firmer surfaces, while some side sleepers may want more cushioning; body weight and personal comfort preference can change how firm the mattress feels." },
      { question: "Can a firm mattress help with back pain?", answer: "A firm mattress may feel supportive for some people, but no mattress can be guaranteed to treat or relieve back pain. Comfort depends on factors including firmness preference, body weight and sleeping position. Persistent or severe back pain should be discussed with a qualified healthcare professional rather than relying on a mattress as treatment." },
      { question: "What is foam encapsulation in a mattress?", answer: "Foam encapsulation means the spring unit is surrounded by a foam border. In Hampton Ortho, this helps create a more structured perimeter around the open coil spring system and works alongside the adaptive memory foam comfort layer." },
      { question: "What is the difference between a firm and medium-to-firm mattress?", answer: "A firm mattress generally has less surface give and a more stable feel than a medium-to-firm mattress. Hampton Ortho is the firm option in our range; Classic Ortho and Capri Ortho are medium-to-firm, while Deluxe Ortho is extra firm. The best choice depends on the feel you prefer rather than firmness alone." },
      { question: "Can I buy the Hampton Ortho mattress online in the UK?", answer: "Yes. Hampton Ortho is available to order online in single, double and king sizes, with free UK delivery, 0% interest-free finance and a 1-year guarantee. Current price, firmness, specifications and stock availability are shown on this product page before you order." },
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
      "A UK-made, extra-firm orthopaedic mattress with an open coil spring system, wire-edge and butterfly support, supportive coir filling and a deep polyester comfort layer. Deluxe Ortho is hand-tufted, finished in quality damask fabric and approximately 26cm deep.",
    heroDescription:
      "Deluxe Ortho is a UK-made extra firm orthopaedic mattress designed for sleepers who prefer a highly stable, low-sink sleep surface. Its open coil spring system is reinforced with wire-edge and butterfly support, while coir filling adds structure and a deep polyester layer provides cushioning above the springs. Hand-tufted and approximately 26cm deep, this double-sided mattress is available in single, double and king sizes.",
    whyChoose: [
      "Deluxe Ortho is built for shoppers who specifically prefer an extra-firm orthopaedic mattress with traditional spring construction. Its interconnected open coil system is reinforced with wire-edge and butterfly support, while coir adds structure and a deep polyester layer provides cushioning above the spring unit. The mattress is hand-tufted, finished in quality damask fabric and made in the UK. Its double-sided construction allows it to be flipped and rotated as part of regular care. Deluxe Ortho is approximately 26cm deep and available in single, double and king sizes. Order online from our Ilford, London business with free UK delivery, 0% interest-free finance and a 1-year guarantee.",
    ],
    accordionContent: {
      features:
        `• <strong>Extra-firm comfort</strong> - Designed for sleepers who specifically prefer a very firm, stable mattress feel with minimal sink.
        • <strong>Open coil spring system</strong> - Interconnected springs work together as one spring unit to create a consistent, traditionally sprung feel.
        • <strong>Wire-edge and butterfly support</strong> - Reinforcement around the spring unit helps support the mattress structure and perimeter.
        • <strong>Coir filling</strong> - A firm natural fibre layer adds structure and contributes to the Deluxe Ortho's distinctly extra-firm feel.
        • <strong>Deep polyester layer</strong> - Adds cushioning above the spring system without changing the mattress's extra-firm positioning.
        • <strong>Quality damask fabric</strong> - A traditional woven outer finish used across classic mattress constructions.
        • <strong>Hand-tufted construction</strong> - Tufting helps hold the fillings securely in place and maintain the mattress structure.
        • <strong>Double-sided design</strong> - Designed to be flipped and rotated as part of regular mattress care.
        • <strong>Approx. 26cm depth</strong> - A substantial mattress profile across the Deluxe Ortho range.
        • <strong>Made in the UK</strong> - Expertly crafted in the UK.`,
      benefits:
        `• <strong>Distinctly extra-firm comfort</strong> - Deluxe Ortho is designed for people who prefer a distinctly extra-firm, traditionally sprung mattress rather than a softer or deeply cushioning sleep surface.
        • <strong>Reinforced support and stability</strong> - Its open coil spring unit is reinforced with wire-edge and butterfly support, while coir and polyester layers create a robust, stable feel above the springs.
        • <strong>Practical double-sided construction</strong> - The double-sided design allows both sleeping surfaces to be used through a regular flip-and-rotate routine, helping distribute normal wear over time.
        • <strong>Personal comfort considerations</strong> - Extra-firm is not automatically the right choice for every sleeper. Body weight, sleeping position and personal comfort preference should all be considered before choosing this firmness level.`,
      dimensions:
        `Deluxe Ortho is available in three standard UK mattress sizes:

        • <strong>Single</strong> - 90 × 190cm
        • <strong>Double</strong> - 135 × 190cm
        • <strong>King</strong> - 150 × 200cm
        • <strong>Mattress Depth</strong> - Approx. 26cm

        <strong>Please note:</strong> Check your existing bed frame or divan dimensions before ordering. Mattress dimensions are approximate and small manufacturing tolerances may apply.`,
      deliveryReturns:
        `• <strong>Free UK Delivery</strong> - Free UK delivery is available on Deluxe Ortho mattresses. Your estimated delivery timing will be shown or confirmed as part of the ordering process.

        • <strong>1-Year Guarantee & Finance</strong> - Deluxe Ortho is covered by our 1-year guarantee. 0% interest-free finance is also available subject to the applicable finance terms and eligibility requirements.

        • <strong>Returns & Cancellations</strong> - Please review our current returns policy before ordering for full information about cancellations, returns and any applicable conditions.`,
    },
    image: "/Deluxe Ortho Product Images/deluxe/Deluxe Ortho Main.webp",
    imageAlt: "Deluxe Ortho main product image",
    gallery: [
      {
        src: "/Deluxe Ortho Product Images/deluxe/Deluxe Ortho Main Alternative.webp",
        alt: "Deluxe Ortho alternative main product image",
      },
      ...["Double Morning", "Double Evening", "King Morning", "King Evening", "Single Morning", "Single Evening"].map((view) => ({ src: `/Deluxe Ortho Product Images/deluxe/Deluxe Ortho ${view}.webp`, alt: `Deluxe Ortho ${view} product image` })),
    ],
    bullets: ["Extra-firm orthopaedic feel", "Wire-edge & butterfly support", "Coir-enhanced support layer", "Hand-tufted open coil construction"],
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
      { question: "Is the Deluxe Ortho mattress suitable for heavier sleepers?", answer: "Deluxe Ortho may suit heavier sleepers who personally prefer an extra-firm, stable mattress feel. Its open coil spring unit, wire-edge and butterfly support, coir layer and hand-tufted construction create the firmest feel in our current range. Comfort is subjective, so body weight alone should not determine your mattress choice." },
      { question: "Should I flip and rotate the Deluxe Ortho mattress?", answer: "Yes. Deluxe Ortho is a double-sided mattress designed to be flipped and rotated regularly. Alternating the sleeping surfaces helps distribute normal wear more evenly. Follow the care schedule supplied with your mattress and avoid bending or folding the spring unit when turning it." },
      { question: "Is an extra-firm mattress good for back pain?", answer: "An extra-firm mattress can feel supportive to some sleepers, but it cannot be guaranteed to treat or relieve back pain. A mattress that feels too firm can also be uncomfortable for some people. If back pain is persistent, severe or accompanied by other symptoms, seek advice from a qualified healthcare professional rather than relying on a mattress as treatment." },
      { question: "What is an open coil spring mattress?", answer: "An open coil mattress uses interconnected springs that work together as one spring unit. Deluxe Ortho combines this traditional spring construction with wire-edge and butterfly support, coir filling, polyester cushioning and hand tufting to create its extra-firm feel." },
      { question: "Who should not choose an extra-firm mattress?", answer: "An extra-firm mattress may not suit sleepers who prefer noticeable cushioning or pressure relief, particularly some lighter or side sleepers. Firmness is subjective, so compare your sleeping position, body weight and comfort preference before choosing the firmest option in the range." },
      { question: "Where can I buy the Deluxe Ortho mattress in London and the UK?", answer: "You can order Deluxe Ortho online from our business at 70 Ilford Lane, Ilford, London IG1 2LA. It is available in single, double and king sizes with free UK delivery, 0% interest-free finance and a 1-year guarantee. Current price and stock availability are shown on this product page before you order." },
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

// Launch catalogue: retain the other data for future releases, but expose only the approved four products.
const launchProductSlugs = new Set(["classic-ortho", "capri-ortho-mattress", "deluxe-ortho", "hampton-ortho"]);
export const orthoMattressProducts = allOrthoMattressProducts.filter((product) => launchProductSlugs.has(product.slug));

export function getMattressProduct(slug: string) {
  return orthoMattressProducts.find((product) => product.slug === slug);
}
