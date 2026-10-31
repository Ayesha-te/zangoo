import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogDetailPage } from "@/app/components/blog/BlogDetailPage";
import { BlogPageLoading } from "@/app/components/blog/BlogPageLoading";
import { blogPosts } from "@/app/data/home";
import { localBlogPosts } from "@/app/data/localBlogPosts";
import { getBlogPost } from "@/app/data/wordpressBlog";

type WordPressSlugPost = {
  slug?: string;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const fallbackSlugs = [...blogPosts.map((post) => post.slug), ...localBlogPosts.map((post) => post.slug)];

  try {
    const response = await fetch("https://peru-armadillo-169520.hostingersite.com/wp-json/wp/v2/posts?per_page=100&_fields=slug&categories_exclude=31");

    if (!response.ok) return fallbackSlugs.map((slug) => ({ slug }));

    const posts = (await response.json()) as WordPressSlugPost[];
    const wordpressSlugs = posts
      .map((post) => post.slug)
      .filter((slug): slug is string => Boolean(slug));

    return Array.from(new Set([...fallbackSlugs, ...wordpressSlugs])).map((slug) => ({ slug }));
  } catch {
    return fallbackSlugs.map((slug) => ({ slug }));
  }
}

/** WordPress titles arrive as HTML (entities, tags): plain text for the browser tab. */
function plainTitle(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .trim();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  const title = post?.title?.rendered ? plainTitle(post.title.rendered) : "";
  return { title: title ? `${title} | OrthoBedroom` : "Blog | OrthoBedroom" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  return (
    <Suspense fallback={<BlogPageLoading label="Loading blog post..." />}>
      <BlogDetailPage slug={slug} initialPost={post} initialDataReady />
    </Suspense>
  );
}
