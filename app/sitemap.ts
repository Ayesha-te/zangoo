import type { MetadataRoute } from "next";
import { getStoreCatalog } from "@/app/lib/woocommerce/catalog";
import { getBlogPosts } from "@/app/data/wordpressBlog";

// /sitemap.xml for search engines, generated at build time from the live catalogue and blog,
// so new mattresses and posts are listed automatically.
export const dynamic = "force-static";

const SITE = "https://www.orthobedroom.co.uk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly") => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  const [{ products }, posts] = await Promise.all([getStoreCatalog(), getBlogPosts().catch(() => [])]);

  return [
    page("/", 1, "daily"),
    page("/collections/", 0.8),
    page("/collections/bedroom/", 0.8),
    page("/collections/bedroom/mattresses/", 0.9, "daily"),
    ...products.map((product) => page(`/collections/bedroom/mattresses/${product.slug}/`, 0.9, "daily")),
    page("/blog/", 0.6),
    ...posts
      .filter((post) => post.slug)
      .map((post) => ({ ...page(`/blog/${post.slug}/`, 0.5, "monthly"), lastModified: post.date ? new Date(post.date) : now })),
    page("/faq/", 0.5, "monthly"),
    page("/delivery/", 0.5, "monthly"),
    page("/returns/", 0.5, "monthly"),
    page("/reviews/", 0.5),
    page("/about/", 0.4, "monthly"),
    page("/contact/", 0.4, "monthly"),
    page("/work-with-us/", 0.3, "monthly"),
    page("/sitemap/", 0.2, "monthly"),
  ];
}
