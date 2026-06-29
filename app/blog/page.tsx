import { Suspense } from "react";
import { BlogDetailPage } from "@/app/components/blog/BlogDetailPage";
import { BlogPageLoading } from "@/app/components/blog/BlogPageLoading";

export default function Page() {
  return (
    <Suspense fallback={<BlogPageLoading />}>
      <BlogDetailPage />
    </Suspense>
  );
}
