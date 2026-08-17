import { Suspense } from "react";
import { BlogDetailPage } from "@/app/components/blog/BlogDetailPage";
import { BlogPageLoading } from "@/app/components/blog/BlogPageLoading";
import { getBlogPosts } from "@/app/data/wordpressBlog";

export default async function Page() {
  const posts = await getBlogPosts();

  return (
    <Suspense fallback={<BlogPageLoading />}>
      <BlogDetailPage initialPosts={posts} initialDataReady />
    </Suspense>
  );
}
