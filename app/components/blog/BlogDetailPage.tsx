"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";

type WordPressRendered = {
  rendered?: string;
};

type WordPressMedia = {
  alt_text?: string;
  source_url?: string;
  media_details?: {
    sizes?: Record<string, { source_url?: string }>;
  };
};

type WordPressTerm = {
  name?: string;
};

type WordPressPost = {
  id: number;
  slug?: string;
  date?: string;
  link?: string;
  title?: WordPressRendered;
  content?: WordPressRendered;
  excerpt?: WordPressRendered;
  _embedded?: {
    "wp:featuredmedia"?: WordPressMedia[];
    "wp:term"?: WordPressTerm[][];
  };
};

const WORDPRESS_ORIGIN = "https://peru-armadillo-169520.hostingersite.com";

function decodeHtml(value: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function stripHtml(value: string) {
  const doc = new DOMParser().parseFromString(value, "text/html");
  return decodeHtml(doc.body.textContent?.replace(/\s+/g, " ").trim() ?? "");
}

function sanitizeWordPressHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script,style,iframe,object,embed,form,input,button,textarea,select").forEach((node) => node.remove());

  doc.body.querySelectorAll("*").forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith("on") || value.startsWith("javascript:")) {
        node.removeAttribute(attribute.name);
      }
    });
  });

  return doc.body.innerHTML;
}

function getFeaturedImage(media?: WordPressMedia) {
  return (
    media?.media_details?.sizes?.medium_large?.source_url ??
    media?.media_details?.sizes?.large?.source_url ??
    media?.source_url
  );
}

function formatDate(date?: string) {
  if (!date) return "Latest";
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getCategory(post: WordPressPost) {
  return post._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "Blog";
}

function getTitle(post: WordPressPost) {
  return stripHtml(post.title?.rendered ?? "Untitled post");
}

function getExcerpt(post: WordPressPost) {
  const excerpt = stripHtml(post.excerpt?.rendered ?? "");
  return excerpt.length > 170 ? `${excerpt.slice(0, 170).trimEnd()}...` : excerpt;
}

function internalBlogHref(post: WordPressPost) {
  return `/blog/?slug=${encodeURIComponent(post.slug ?? String(post.id))}`;
}

async function fetchWordPressPosts(url: URL, signal: AbortSignal) {
  const response = await fetch(url.toString(), {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(`WordPress returned ${response.status}`);
  }

  return (await response.json()) as WordPressPost[];
}

function BlogShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}

export function BlogDetailPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [post, setPost] = useState<WordPressPost | null>(null);
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    const url = new URL(`${WORDPRESS_ORIGIN}/wp-json/wp/v2/posts`);
    url.searchParams.set("_embed", "1");
    url.searchParams.set("_", String(Date.now()));

    if (slug) {
      url.searchParams.set("slug", slug);
      url.searchParams.set("per_page", "1");
    } else {
      url.searchParams.set("per_page", "6");
      url.searchParams.set("orderby", "date");
      url.searchParams.set("order", "desc");
    }

    async function loadPost() {
      try {
        setStatus("loading");
        const data = await fetchWordPressPosts(url, controller.signal);

        if (slug) {
          setPost(data[0] ?? null);
          setStatus(data[0] ? "ready" : "empty");
        } else {
          setPosts(data);
          setStatus(data.length ? "ready" : "empty");
        }
      } catch {
        if (!controller.signal.aborted) {
          setStatus("error");
        }
      }
    }

    loadPost();

    return () => controller.abort();
  }, [slug]);

  const safeContent = useMemo(() => {
    if (!post?.content?.rendered) return "";
    return sanitizeWordPressHtml(post.content.rendered);
  }, [post]);

  if (status === "loading") {
    return (
      <BlogShell>
        <main className="blog-page">
          <div className="wrap">
            <p className="blog-status">Loading blog post...</p>
          </div>
        </main>
      </BlogShell>
    );
  }

  if (status === "error") {
    return (
      <BlogShell>
        <main className="blog-page">
          <div className="wrap">
            <Link className="blog-back" href="/#blog-h">Back to home</Link>
            <h1>Blog temporarily unavailable</h1>
            <p className="blog-status">We could not load the WordPress post right now. Please try again shortly.</p>
          </div>
        </main>
      </BlogShell>
    );
  }

  if (!slug) {
    return (
      <BlogShell>
        <main className="blog-page">
          <div className="wrap">
            <Link className="blog-back" href="/#blog-h">Back to home</Link>
            <span className="sec-lbl">Ideas &amp; Inspiration</span>
            <h1>Latest Blog Posts</h1>
            <div className="blog-list">
              {posts.map((item) => {
                const media = item._embedded?.["wp:featuredmedia"]?.[0];
                const image = getFeaturedImage(media);

                return (
                  <Link href={internalBlogHref(item)} className="blog-list-card" key={item.id}>
                    {image ? (
                      <span className="blog-list-img" style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />
                    ) : null}
                    <span className="blog-list-body">
                      <span className="blog-detail-meta">{formatDate(item.date)} - {getCategory(item)}</span>
                      <strong>{getTitle(item)}</strong>
                      <span>{getExcerpt(item)}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </BlogShell>
    );
  }

  if (!post) {
    return (
      <BlogShell>
        <main className="blog-page">
          <div className="wrap">
            <Link className="blog-back" href="/#blog-h">Back to home</Link>
            <h1>Post not found</h1>
            <p className="blog-status">This post may have been removed or unpublished in WordPress.</p>
          </div>
        </main>
      </BlogShell>
    );
  }

  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const image = getFeaturedImage(media);

  return (
    <BlogShell>
      <main className="blog-page">
        <article className="wrap blog-article">
          <Link className="blog-back" href="/#blog-h">Back to home</Link>
          <span className="sec-lbl">{getCategory(post)}</span>
          <h1>{getTitle(post)}</h1>
          <p className="blog-detail-meta">{formatDate(post.date)}</p>
          {image ? (
            <div className="blog-hero-img" style={{ backgroundImage: `url(${image})` }} role="img" aria-label={media?.alt_text || getTitle(post)} />
          ) : null}
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: safeContent }} />
        </article>
      </main>
    </BlogShell>
  );
}
