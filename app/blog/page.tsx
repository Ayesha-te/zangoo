import { Suspense } from "react";
import { BlogDetailPage } from "@/app/components/blog/BlogDetailPage";
import { SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";

function BlogFallback() {
  return (
    <>
      <SiteHeader />
      <main className="blog-page">
        <div className="wrap">
          <p className="blog-status">Loading blog...</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<BlogFallback />}>
      <BlogDetailPage />
    </Suspense>
  );
}
