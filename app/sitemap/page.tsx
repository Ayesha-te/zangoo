import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { orthoMattressProducts } from "@/app/data/mattressProducts";
import { getBlogPosts } from "@/app/data/wordpressBlog";

export const metadata: Metadata = {
  title: "Sitemap | Furniture Co.",
  description: "Every page on the Furniture Co. website in one place.",
};

const decode = (text: string) =>
  text
    .replace(/<[^>]+>/g, "")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&#038;/g, "&")
    .trim();

export default async function SitemapPage() {
  const posts = await getBlogPosts();

  const sections: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
    {
      title: "Main pages",
      links: [
        { label: "Home", href: "/" },
        { label: "Collections", href: "/collections/" },
        { label: "Blog", href: "/blog/" },
        { label: "FAQ", href: "/faq/" },
        { label: "Customer reviews", href: "/reviews/" },
        { label: "About us", href: "/about/" },
        { label: "Contact", href: "/contact/" },
      ],
    },
    {
      title: "Shop",
      links: [
        { label: "Bedroom", href: "/collections/bedroom/" },
        { label: "Mattresses", href: "/collections/bedroom/mattresses/" },
        ...orthoMattressProducts.map((product) => ({
          label: product.shortName,
          href: `/collections/bedroom/mattresses/${product.slug}/`,
        })),
      ],
    },
    {
      title: "Your account",
      links: [
        { label: "Account", href: "/account/" },
        { label: "Wishlist", href: "/wishlist/" },
        { label: "Basket", href: "/cart/" },
        { label: "Search", href: "/search/" },
      ],
    },
    {
      title: "Blog posts",
      links: posts
        .filter((post) => post.slug)
        .map((post) => ({ label: decode(post.title?.rendered ?? post.slug ?? ""), href: `/blog/${post.slug}/` })),
    },
  ];

  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label: "Sitemap" }]} />
      <main className="simple-page sitemap-page">
        <section className="wrap simple-page-inner">
          <span className="sec-lbl">Sitemap</span>
          <h1>Every page, in one place.</h1>
          <p>Find any page on the Furniture Co. website.</p>
          <div className="sitemap-grid">
            {sections.map((section) =>
              section.links.length ? (
                <nav className={`sitemap-group${section.title === "Blog posts" ? " sitemap-group-wide" : ""}`} aria-label={section.title} key={section.title}>
                  <h2>{section.title}</h2>
                  <ul role="list">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null,
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
