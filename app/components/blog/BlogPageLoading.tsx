import { SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";

export function BlogPageLoading({ label = "Loading blog..." }: { label?: string }) {
  return (
    <>
      <SiteHeader />
      <main className="blog-page">
        <div className="wrap">
          <div className="blog-skeleton" aria-live="polite" aria-busy="true" aria-label={label}>
            <span className="blog-skeleton-line blog-skeleton-link" />
            <span className="blog-skeleton-line blog-skeleton-kicker" />
            <span className="blog-skeleton-line blog-skeleton-title" />
            <span className="blog-skeleton-line blog-skeleton-meta" />
            <span className="blog-skeleton-hero" />
            <span className="sr">{label}</span>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
