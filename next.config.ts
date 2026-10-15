import type { NextConfig } from "next";

// The basket talks to the WooCommerce Store API through same-origin /wc-store/* (no CORS needed).
// Production: vercel.json rewrites it. Dev: the same rewrite here (static exports can't use rewrites at build).
const storeApi = `${(process.env.WOOCOMMERCE_URL ?? "").replace(/\/+$/, "")}/wp-json/wc/store/v1`;

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(process.env.NODE_ENV === "development" && process.env.WOOCOMMERCE_URL
    ? { rewrites: async () => [{ source: "/wc-store/:path*", destination: `${storeApi}/:path*` }] }
    : {}),
};

export default nextConfig;
