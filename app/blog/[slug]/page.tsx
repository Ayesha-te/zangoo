import { Suspense } from "react";
import { BlogDetailPage } from "@/app/components/blog/BlogDetailPage";
import { BlogPageLoading } from "@/app/components/blog/BlogPageLoading";
import { blogPosts } from "@/app/data/home";
import { localBlogPosts } from "@/app/data/localBlogPosts";

type WordPressSlugPost = {
  slug?: string;
};

export async function generateStaticParams() {
  const fallbackSlugs = [...blogPosts.map((post) => post.slug), ...localBlogPosts.map((post) => post.slug)];

  try {
    const response = await fetch("https://peru-armadillo-169520.hostingersite.com/wp-json/wp/v2/posts?per_page=20&_fields=slug&categories_exclude=31");

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

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<BlogPageLoading label="Loading blog post..." />}>
      <BlogDetailPage slug={slug} />
    </Suspense>
  );
}
