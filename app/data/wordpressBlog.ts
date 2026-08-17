import "server-only";

import { localBlogPosts } from "@/app/data/localBlogPosts";
import type { WordPressPost } from "@/app/components/blog/BlogDetailPage";

const WORDPRESS_POSTS_URL = "https://peru-armadillo-169520.hostingersite.com/wp-json/wp/v2/posts";

function localPostToWordPressPost(post: (typeof localBlogPosts)[number], id: number): WordPressPost {
  return {
    id,
    slug: post.slug,
    date: post.date,
    title: { rendered: post.title },
    excerpt: { rendered: post.excerpt },
    content: { rendered: post.contentHtml },
    _embedded: {
      "wp:term": [[{ name: post.category, slug: post.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") }]],
    },
  };
}

export const localWordPressPosts = localBlogPosts.map((post, index) =>
  localPostToWordPressPost(post, -(index + 1)),
);

export async function getBlogPosts(): Promise<WordPressPost[]> {
  const url = new URL(WORDPRESS_POSTS_URL);
  url.searchParams.set("_embed", "1");
  url.searchParams.set("per_page", "100");
  url.searchParams.set("categories_exclude", "31");
  url.searchParams.set("orderby", "date");
  url.searchParams.set("order", "desc");

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error(`WordPress returned ${response.status}`);
    const posts = (await response.json()) as WordPressPost[];
    return posts.length ? posts : localWordPressPosts;
  } catch {
    return localWordPressPosts;
  }
}

export async function getBlogPost(slug: string): Promise<WordPressPost | null> {
  const localPost = localWordPressPosts.find((post) => post.slug === slug);
  if (localPost) return localPost;

  const url = new URL(WORDPRESS_POSTS_URL);
  url.searchParams.set("_embed", "1");
  url.searchParams.set("slug", slug);
  url.searchParams.set("per_page", "1");

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error(`WordPress returned ${response.status}`);
    const posts = (await response.json()) as WordPressPost[];
    return posts[0] ?? null;
  } catch {
    return null;
  }
}
