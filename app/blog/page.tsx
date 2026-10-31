import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogDetailPage } from "@/app/components/blog/BlogDetailPage";
import { BlogPageLoading } from "@/app/components/blog/BlogPageLoading";
import { getBlogPosts } from "@/app/data/wordpressBlog";

export const metadata: Metadata = {
  title: "Blog | OrthoBedroom",
  description: "Mattress buying guides, sleep advice and orthopaedic mattress tips from OrthoBedroom.",
};

export default async function Page() {
  const posts = await getBlogPosts();

  return (
    <Suspense fallback={<BlogPageLoading />}>
      <BlogDetailPage initialPosts={posts} initialDataReady refreshPosts />
    </Suspense>
  );
}
