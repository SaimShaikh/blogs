import { PostListClient } from "@/components/blog/PostListClient";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { Sparkles } from "lucide-react";
import PixelCard from "@/components/blog/PixelCard";

export default async function PostIndexPage() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  return (
    <main className="min-h-screen pt-32 pb-20">
      <section className="container mx-auto px-4">
        <PixelCard variant="blue" className="relative overflow-hidden rounded-[2.5rem] border border-card-border bg-card p-10 md:p-14 lg:p-16 shadow-2xl">
          <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-brand-primary/20 blur-[120px]" />
          <div className="relative z-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-brand-primary backdrop-blur-md">
              <Sparkles size={14} className="animate-pulse" />
              <span>Editorial Index</span>
            </div>
            <h1 className="mt-8 text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
              All Posts
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-brand-text/70 md:text-xl leading-relaxed">
              Search and filter technical notes from EdgeOps Labs.
            </p>
          </div>
        </PixelCard>
      </section>

      <section className="container mx-auto px-4 mt-8">
        <PostListClient posts={posts} tags={tags} />
      </section>
    </main>
  );
}
