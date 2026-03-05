import { PostListClient } from "@/components/blog/PostListClient";
import { getAllPosts, getAllTags } from "@/lib/posts";

export default async function PostIndexPage() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  return (
    <main className="min-h-screen pt-32 pb-20">
      <section className="container mx-auto px-4">
        <div className="rounded-3xl border border-card-border bg-card p-8 md:p-10">
          <p className="text-sm font-mono tracking-[0.2em] uppercase text-brand-primary">Editorial Index</p>
          <h1 className="mt-3 text-5xl md:text-6xl font-bold">All Posts</h1>
          <p className="mt-4 text-brand-text/60 text-lg">Search and filter technical notes from EdgeOps Labs.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-8">
        <PostListClient posts={posts} tags={tags} />
      </section>
    </main>
  );
}
