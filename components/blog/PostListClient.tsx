"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/posts";

type PostListClientProps = {
  posts: BlogPost[];
  tags: string[];
};

export function PostListClient({ posts, tags }: PostListClientProps) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesQuery =
        q.length === 0 ||
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        post.tags.join(" ").toLowerCase().includes(q);

      const matchesTag = selectedTag === "all" || post.tags.includes(selectedTag);
      return matchesQuery && matchesTag;
    });
  }, [posts, query, selectedTag]);

  return (
    <>
      <section className="rounded-2xl border border-card-border bg-card p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-[1fr_260px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts, tags, author..."
            className="h-12 rounded-xl border border-card-border bg-background px-4 text-sm outline-none transition-colors focus:border-brand-primary"
          />
          <select
            value={selectedTag}
            onChange={(event) => setSelectedTag(event.target.value)}
            className="h-12 rounded-xl border border-card-border bg-background px-4 text-sm outline-none transition-colors focus:border-brand-primary"
          >
            <option value="all">All tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.map((post) => (
          <article key={post.slug} className="group rounded-2xl border border-card-border bg-card p-6 transition-all hover:border-brand-primary/40 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-brand-primary font-mono">Post</span>
              <span className="text-xs text-brand-text/50 font-mono">{post.date}</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold">{post.title}</h2>
            <p className="mt-3 text-sm text-brand-text/65">{post.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full border border-card-border px-2 py-1 text-xs font-mono text-brand-text/60">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5 text-xs text-brand-text/50 font-mono">{post.author} • {post.readingTimeText}</div>
            <Link href={`/post/${post.slug}`} className="inline-flex mt-5 text-brand-primary font-mono text-sm">
              Read article
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
