/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Filter, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/posts";
import PixelCard from "./PixelCard";

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
      <section className="relative overflow-hidden rounded-[2rem] border border-card-border bg-card/60 backdrop-blur-xl p-6 md:p-8 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-brand-accent/5 opacity-50" />
        <div className="relative z-10 grid gap-4 md:grid-cols-[1fr_260px]">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-text/40 group-focus-within:text-brand-primary transition-colors">
              <Search size={18} />
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search posts, tags, author..."
              className="h-14 w-full rounded-2xl border border-card-border bg-background/50 pl-11 pr-4 text-sm outline-none transition-all focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary/50"
            />
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-text/40 group-focus-within:text-brand-primary transition-colors">
              <Filter size={18} />
            </div>
            <select
              value={selectedTag}
              onChange={(event) => setSelectedTag(event.target.value)}
              className="h-14 w-full cursor-pointer appearance-none rounded-2xl border border-card-border bg-background/50 pl-11 pr-10 text-sm outline-none transition-all focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary/50"
            >
              <option value="all">All Available Tags</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-brand-text/40">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <article key={post.slug} className="group flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-card-border bg-card/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-primary/50 hover:bg-card hover:shadow-xl hover:shadow-brand-primary/10">
            <div className="relative aspect-[2/1] w-full overflow-hidden border-b border-card-border bg-card">
              {post.thumbnail && post.thumbnail !== "/logo.png" ? (
                <>
                  <img src={post.thumbnail} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-brand-primary/5">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary/30">EdgeOps</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-80" />
                </div>
              )}
              
              <div className="absolute top-3 left-3 flex w-[calc(100%-1.5rem)] items-center justify-between">
                <span className="inline-flex items-center rounded-full border border-card-border/50 bg-background/80 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand-primary backdrop-blur-md">
                  {post.date}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h2 className="text-xl font-bold leading-tight transition-colors group-hover:text-brand-primary line-clamp-2">{post.title}</h2>
              <p className="mt-3 text-sm text-brand-text/65 line-clamp-2">{post.description}</p>
              
              <div className="mt-auto pt-6">
                <div className="mb-4 flex flex-wrap items-center gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-brand-primary/20 bg-brand-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-brand-primary transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between border-t border-card-border/50 pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-brand-text/80">{post.author}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-brand-text/40">{post.readingTimeText}</span>
                  </div>
                  <Link href={`/post/${post.slug}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary transition-all duration-300 group-hover:-rotate-45 group-hover:bg-brand-primary group-hover:text-[#020617] group-hover:shadow-[0_0_15px_rgba(5,202,255,0.4)]">
                    <span className="sr-only">Read article</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
