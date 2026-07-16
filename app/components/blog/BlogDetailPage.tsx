"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BlogPageLoading } from "@/app/components/blog/BlogPageLoading";
import { SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { localBlogPosts, type LocalBlogPost } from "@/app/data/localBlogPosts";

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
  slug?: string;
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

function isSafeHref(value: string) {
  const href = value.trim();
  return (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function applyMarkdownLinks(doc: Document) {
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const parent = node.parentElement;
    if (!parent || parent.closest("a,code,pre,script,style")) continue;
    if (/\[[^\]]+]\([^)]+\)/.test(node.nodeValue ?? "")) {
      textNodes.push(node);
    }
  }

  textNodes.forEach((node) => {
    const text = node.nodeValue ?? "";
    const fragment = doc.createDocumentFragment();
    let lastIndex = 0;
    const pattern = /\[([^\]]+)]\(([^)]+)\)/g;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text))) {
      fragment.append(text.slice(lastIndex, match.index));
      const href = match[2].trim();

      if (isSafeHref(href)) {
        const anchor = doc.createElement("a");
        anchor.href = href;
        anchor.textContent = match[1];
        fragment.append(anchor);
      } else {
        fragment.append(match[1]);
      }

      lastIndex = match.index + match[0].length;
    }

    fragment.append(text.slice(lastIndex));
    node.replaceWith(fragment);
  });
}

function tableFromMarkdown(doc: Document, lines: string[]) {
  if (lines.length < 3 || !/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[1])) {
    return null;
  }

  const splitCells = (line: string) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());

  const headers = splitCells(lines[0]);
  const rows = lines.slice(2).map(splitCells).filter((row) => row.some(Boolean));
  if (!headers.length || !rows.length) return null;

  const tableWrap = doc.createElement("div");
  tableWrap.className = "blog-table-wrap";
  const table = doc.createElement("table");
  const thead = doc.createElement("thead");
  const headRow = doc.createElement("tr");
  headers.forEach((header) => {
    const th = doc.createElement("th");
    th.textContent = header;
    headRow.append(th);
  });
  thead.append(headRow);

  const tbody = doc.createElement("tbody");
  rows.forEach((row) => {
    const tr = doc.createElement("tr");
    headers.forEach((_, index) => {
      const td = doc.createElement("td");
      td.textContent = row[index] ?? "";
      tr.append(td);
    });
    tbody.append(tr);
  });

  table.append(thead, tbody);
  tableWrap.append(table);
  return tableWrap;
}

function applyMarkdownBlocks(doc: Document) {
  doc.body.querySelectorAll("p").forEach((paragraph) => {
    const rawText = paragraph.textContent?.trim() ?? "";
    const lines = rawText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

    if (lines.length >= 3 && lines.every((line) => line.includes("|"))) {
      const table = tableFromMarkdown(doc, lines);
      if (table) {
        paragraph.replaceWith(table);
        return;
      }
    }

    if (lines.length > 1 && lines.every((line) => /^[-*]\s+/.test(line))) {
      const list = doc.createElement("ul");
      lines.forEach((line) => {
        const item = doc.createElement("li");
        item.textContent = line.replace(/^[-*]\s+/, "");
        list.append(item);
      });
      paragraph.replaceWith(list);
      return;
    }

    if (lines.length > 1 && lines.every((line) => /^\d+\.\s+/.test(line))) {
      const list = doc.createElement("ol");
      lines.forEach((line) => {
        const item = doc.createElement("li");
        item.textContent = line.replace(/^\d+\.\s+/, "");
        list.append(item);
      });
      paragraph.replaceWith(list);
      return;
    }

    const heading = rawText.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      const level = Math.min(heading[1].length, 4);
      const nextHeading = doc.createElement(`h${level}`);
      nextHeading.textContent = heading[2];
      paragraph.replaceWith(nextHeading);
    }
  });
}

function sanitizeWordPressHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script,style,iframe,object,embed,form,input,button,textarea,select").forEach((node) => node.remove());

  applyMarkdownBlocks(doc);
  applyMarkdownLinks(doc);

  doc.body.querySelectorAll("*").forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith("on") || value.startsWith("javascript:")) {
        node.removeAttribute(attribute.name);
      }

      if ((name === "href" || name === "src") && !isSafeHref(attribute.value)) {
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

function isReviewCategoryPost(post: WordPressPost) {
  return Boolean(
    post._embedded?.["wp:term"]?.some((termGroup) =>
      termGroup.some((term) => {
        const name = term.name?.toLowerCase();
        const slug = term.slug?.toLowerCase();
        return name === "reviews" || slug === "reviews";
      }),
    ),
  );
}

function getTitle(post: WordPressPost) {
  return stripHtml(post.title?.rendered ?? "Untitled post");
}

function getExcerpt(post: WordPressPost) {
  const excerpt = stripHtml(post.excerpt?.rendered ?? "");
  return excerpt.length > 170 ? `${excerpt.slice(0, 170).trimEnd()}...` : excerpt;
}

function internalBlogHref(post: WordPressPost) {
  return `/blog/${encodeURIComponent(post.slug ?? String(post.id))}/`;
}

function localPostToWordPressPost(post: LocalBlogPost): WordPressPost {
  return {
    id: -1,
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

export function BlogDetailPage({ slug: routeSlug }: { slug?: string } = {}) {
  const searchParams = useSearchParams();
  const slug = routeSlug ?? searchParams.get("slug");
  const [post, setPost] = useState<WordPressPost | null>(null);
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    const localPost = slug ? localBlogPosts.find((item) => item.slug === slug) : null;

    if (localPost) {
      setPost(localPostToWordPressPost(localPost));
      setStatus("ready");
      return () => controller.abort();
    }

    const url = new URL(`${WORDPRESS_ORIGIN}/wp-json/wp/v2/posts`);
    url.searchParams.set("_embed", "1");
    url.searchParams.set("_", String(Date.now()));

    if (slug) {
      url.searchParams.set("slug", slug);
      url.searchParams.set("per_page", "1");
    } else {
      url.searchParams.set("per_page", "6");
      url.searchParams.set("categories_exclude", "31");
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
          const blogOnlyPosts = data.filter((item) => !isReviewCategoryPost(item));
          setPosts(blogOnlyPosts);
          setStatus(blogOnlyPosts.length ? "ready" : "empty");
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
    return <BlogPageLoading label={slug ? "Loading blog post..." : "Loading blog..."} />;
  }

  if (status === "error") {
    return (
      <BlogShell>
        <main className="blog-page">
          <div className="wrap">
            <Link className="blog-back" href="/blog/">Back to blog</Link>
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
            <Link className="blog-back" href="/blog/">Back to blog</Link>
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
            <Link className="blog-back" href="/blog/">Back to blog</Link>
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
          <Link className="blog-back" href="/blog/">Back to blog</Link>
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
