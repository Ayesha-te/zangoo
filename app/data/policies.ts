// Delivery and returns information: one source for the /delivery/ and /returns/ pages AND the product pages'
// "Delivery & Returns" sections (client, 17/11/2026: "create separate pages, then pull the information into the
// product pages"). Edit the wording here and every page updates.
//
// The client is preparing the final policies. Until then this holds the terms the site already states (free
// delivery, 1-year guarantee) plus the UK statutory 14-day cancellation right for online orders.

import type { MattressProduct } from "./mattressProducts";

export type PolicySection = { heading: string; paragraphs: string[]; bullets?: string[] };
export type Policy = { title: string; intro: string; sections: PolicySection[]; updated: string };

/** Where a product can be delivered. Set per product in WooCommerce with a "Delivery area" attribute ("London only" / "UK"). */
export type DeliveryArea = "london" | "uk";

export const DELIVERY_AREA_LABEL: Record<DeliveryArea, { short: string; long: string }> = {
  london: { short: "London delivery only", long: "This mattress is delivered within London only." },
  uk: { short: "UK delivery available", long: "This mattress can be delivered across the UK mainland." },
};

export function deliveryAreaOf(product: Pick<MattressProduct, "deliveryArea">): DeliveryArea {
  return product.deliveryArea ?? "uk";
}

export const DELIVERY_POLICY: Policy = {
  title: "Delivery Information",
  intro: "Free delivery on every mattress. Delivery areas vary by product: each product page shows whether that mattress is delivered within London only or across the UK.",
  updated: "17 November 2026",
  sections: [
    {
      heading: "Delivery cost",
      paragraphs: ["Delivery is free on all mattress orders. There is no minimum order value."],
    },
    {
      heading: "Where we deliver",
      paragraphs: ["Delivery areas depend on the mattress you choose. Each product page shows one of the following:"],
      bullets: [
        "London delivery only: available to addresses within London.",
        "UK delivery available: available to addresses across the UK mainland.",
      ],
    },
    {
      heading: "Delivery times",
      paragraphs: [
        "Standard delivery usually takes 3 to 5 working days from when your order is placed. We will confirm your delivery date with you before your mattress is dispatched.",
        "We use the mobile number you give at checkout to send delivery updates, so please make sure it is correct.",
      ],
    },
    {
      heading: "Before your delivery",
      paragraphs: ["Please check that your mattress will fit through doors, stairways and hallways, and that the size matches your bed frame or divan."],
    },
    {
      heading: "Questions about your delivery",
      paragraphs: ["Message us on WhatsApp at +44 7830 376489 (Mon to Fri, 9am to 5pm) or use our contact page."],
    },
  ],
};

export const RETURNS_POLICY: Policy = {
  title: "Returns & Guarantee",
  intro: "Your rights when you buy a mattress from OrthoBedroom online, and how to contact us about a return.",
  updated: "17 November 2026",
  sections: [
    {
      heading: "Changing your mind (14-day cancellation)",
      paragraphs: [
        "When you buy online you can cancel your order within 14 days of receiving it, under the Consumer Contracts Regulations 2013. Please contact us within that time to tell us you wish to cancel.",
        "Mattresses must be returned unused, in their original condition and protective packaging, for hygiene reasons.",
      ],
    },
    {
      heading: "Faulty or damaged items",
      paragraphs: [
        "If your mattress arrives damaged or develops a fault, contact us as soon as possible with your order number and photos of the problem. Your statutory rights under the Consumer Rights Act 2015 are not affected.",
      ],
    },
    {
      heading: "Guarantee",
      paragraphs: ["Our mattresses come with a 1-year guarantee against manufacturing faults, subject to normal domestic use and following the care guidance supplied."],
    },
    {
      heading: "Refunds",
      paragraphs: ["Approved refunds are made to your original payment method within 14 days of us receiving the returned item."],
    },
    {
      heading: "How to start a return",
      paragraphs: ["Message us on WhatsApp at +44 7830 376489 (Mon to Fri, 9am to 5pm) or use our contact page, with your order number."],
    },
  ],
};

/** Short points for product pages (the full text lives on /delivery/ and /returns/). */
export function productDeliverySummary(product: Pick<MattressProduct, "deliveryArea">) {
  const area = deliveryAreaOf(product);
  return [
    { title: "Free delivery", text: `${DELIVERY_AREA_LABEL[area].long} Delivery is free and usually takes 3 to 5 working days.` },
    { title: "14-day cancellation", text: "Changed your mind? You can cancel within 14 days of delivery. Mattresses must be unused and in their original packaging." },
  ];
}
