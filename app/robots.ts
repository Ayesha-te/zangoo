import type { MetadataRoute } from "next";

// /robots.txt: everything can be crawled except the basket, checkout and account pages; points to the sitemap.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart/", "/checkout/", "/account/", "/wishlist/", "/search/", "/product-page-wireframe/", "/confirm-email/"] }],
    sitemap: "https://www.orthobedroom.co.uk/sitemap.xml",
    host: "https://www.orthobedroom.co.uk",
  };
}
