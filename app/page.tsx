import { HomePage } from "@/app/components/home/HomePage";
import { getBlogPosts } from "@/app/data/wordpressBlog";

export default async function Page() {
  const posts = await getBlogPosts();
  return <HomePage initialBlogPosts={posts} />;
}
