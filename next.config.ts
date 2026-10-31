import type { NextConfig } from "next";

// The basket talks to the WooCommerce Store API through same-origin /wc-store/*, and newsletter sign-ups go to
// /wp-signup/ and "Work with Us" applications to /wp-apply/ (the WordPress discount snippet), so no cross-site
// requests are needed.
// Production: vercel.json rewrites it. Dev: the same rewrite here (static exports can't use rewrites at build).
const siteUrl = (process.env.WOOCOMMERCE_URL ?? "").replace(/\/+$/, "");
const storeApi = `${siteUrl}/wp-json/wc/store/v1`;

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(process.env.NODE_ENV === "development" && process.env.WOOCOMMERCE_URL
    ? {
        rewrites: async () => [
          { source: "/wc-store/:path*", destination: `${storeApi}/:path*` },
          { source: "/wp-signup/:path*", destination: `${siteUrl}/wp-json/orthobedroom/v1/signup/:path*` },
          { source: "/wp-apply/:path*", destination: `${siteUrl}/wp-json/orthobedroom/v1/apply/:path*` },
        ],
      }
    : {}),
};

export default nextConfig;
