import Link from "next/link";
import { ArrowRight, Radar, Sparkles, SquareTerminal } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";

export default async function HomePage() {
  const posts = await getAllPosts();
  const featured = posts[0];
  const secondary = posts.slice(1, 4);

  return (
    <main className="min-h-screen selection:bg-brand-primary/30 selection:text-white pt-32 pb-20">
      <section className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl border border-card-border bg-card">
          <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-primary/20 blur-[100px]" />
          <div className="grid gap-0 lg:grid-cols-[1.4fr_1fr]">
            <div className="p-8 md:p-12 lg:p-14">
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-primary/25 bg-brand-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.22em] text-brand-primary">
                <Sparkles size={13} />
                EdgeOps Blog
              </p>
              <h1 className="mt-7 text-5xl font-bold tracking-tight md:text-7xl">
                Editorial for the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent drop-shadow-[0_0_20px_rgba(5,202,255,0.3)]">
                  Autonomous Cloud
                </span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-brand-text/60 md:text-xl">
                High-signal writing on platform engineering, reliability, observability, and AI-powered operations.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/post"
                  className="inline-flex items-center gap-2 rounded-full border border-brand-primary/50 bg-brand-primary/10 px-6 py-3 font-mono text-sm uppercase tracking-wider transition-colors hover:bg-brand-primary/20"
                >
                  Browse All Posts
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="https://www.edgeopslabs.com"
                  className="rounded-full border border-card-border px-6 py-3 font-mono text-sm uppercase tracking-wider transition-colors hover:border-brand-primary/40"
                >
                  Visit Website
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-card-border bg-background/40 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-text/50">Articles</p>
                  <p className="mt-2 text-2xl font-bold text-brand-primary">{posts.length}</p>
                </div>
                <div className="rounded-xl border border-card-border bg-background/40 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-text/50">Categories</p>
                  <p className="mt-2 text-2xl font-bold text-brand-primary">
                    {new Set(posts.flatMap((post) => post.tags)).size}
                  </p>
                </div>
                <div className="rounded-xl border border-card-border bg-background/40 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-text/50">Newsletter</p>
                  <p className="mt-2 text-2xl font-bold text-brand-primary">Live</p>
                </div>
              </div>
            </div>

            <aside className="border-t border-card-border p-8 md:p-10 lg:border-l lg:border-t-0">
              <div className="space-y-5">
                <div className="rounded-2xl border border-card-border bg-background/30 p-5">
                  <div className="flex items-center gap-3 text-brand-primary">
                    <SquareTerminal size={18} />
                    <p className="font-mono text-xs uppercase tracking-[0.2em]">Publishing Model</p>
                  </div>
                  <p className="mt-3 text-sm text-brand-text/65">
                    Markdown-first workflow with Git-based release control and production-safe review flow.
                  </p>
                </div>
                <div className="rounded-2xl border border-card-border bg-background/30 p-5">
                  <div className="flex items-center gap-3 text-brand-primary">
                    <Radar size={18} />
                    <p className="font-mono text-xs uppercase tracking-[0.2em]">Editorial Focus</p>
                  </div>
                  <p className="mt-3 text-sm text-brand-text/65">
                    Infrastructure patterns, incident response playbooks, platform architecture, and operational AI.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {featured ? (
        <section className="container mx-auto mt-12 px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-mono text-3xl md:text-4xl">Featured Editorial</h2>
            <Link href="/post" className="font-mono text-sm uppercase tracking-[0.18em] text-brand-primary">
              View Archive
            </Link>
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <article className="rounded-2xl border border-card-border bg-card p-8">
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-brand-primary">Lead Story</p>
              <h3 className="mt-3 text-3xl font-bold md:text-4xl">{featured.title}</h3>
              <p className="mt-4 text-brand-text/60">{featured.description}</p>
              <div className="mt-6 flex flex-wrap gap-4 font-mono text-sm text-brand-text/50">
                <span>{featured.author}</span>
                <span>{featured.date}</span>
                <span>{featured.readingTimeText}</span>
              </div>
              <Link
                href={`/post/${featured.slug}`}
                className="inline-flex mt-8 items-center gap-2 font-mono text-brand-primary transition-all hover:gap-3"
              >
                Read now
                <ArrowRight size={16} />
              </Link>
            </article>

            <div className="space-y-4">
              {secondary.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-2xl border border-card-border bg-card p-5 transition-colors hover:border-brand-primary/40"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-primary">Recent</p>
                  <h4 className="mt-2 text-xl font-bold">{post.title}</h4>
                  <p className="mt-2 text-sm text-brand-text/60">{post.description}</p>
                  <Link href={`/post/${post.slug}`} className="inline-flex mt-4 font-mono text-sm text-brand-primary">
                    Open article
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="container mx-auto mt-12 px-4">
        <NewsletterSignup />
      </section>
    </main>
  );
}
