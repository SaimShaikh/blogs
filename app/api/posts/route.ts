
import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const posts = await getAllPosts();

  const simplifiedPosts = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    author: post.author,
    tags: post.tags,
    readingTimeText: post.readingTimeText,
  }));

  return new Response(JSON.stringify(simplifiedPosts), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}
