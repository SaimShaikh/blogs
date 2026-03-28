/* eslint-disable @next/next/no-img-element */
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
        <div className="relative overflow-hidden rounded-[2.5rem] border border-card-border bg-card shadow-2xl">
          {/* Ambient Background Glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-brand-primary/20 blur-[120px]" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-brand-accent/10 blur-[120px]" />
          
          <div className="grid gap-0 lg:grid-cols-[1.5fr_1fr] relative z-10">
            <div className="flex flex-col justify-center p-10 md:p-14 lg:p-16">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-brand-primary backdrop-blur-md">
                <Sparkles size={14} className="animate-pulse" />
                <span>EdgeOps Editorial</span>
              </div>
              <h1 className="mt-8 text-5xl font-extrabold tracking-tight md:text-7xl lg:text-[5rem] leading-[1.1]">
                Editorial for the<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary bg-[length:200%_auto] animate-gradient shadow-brand-primary/20 drop-shadow-xl">
                  Autonomous Cloud
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-brand-text/70 md:text-xl leading-relaxed">
                High-signal writing on platform engineering, container orchestration, site reliability, and AI-powered infrastructure operations.
              </p>
              
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Link
                  href="/post"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-brand-primary px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-[#020617] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(5,202,255,0.4)]"
                >
                  <span className="relative z-10">Browse Archive</span>
                  <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 z-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
                </Link>
                <a
                  href="https://www.edgeopslabs.com"
                  className="inline-flex rounded-full border border-card-border bg-background/50 px-8 py-3.5 font-mono text-sm uppercase tracking-wider text-brand-text backdrop-blur-sm transition-all hover:border-brand-primary/50 hover:bg-brand-primary/5 hover:text-brand-primary"
                >
                  Visit Platform
                </a>
              </div>

              <div className="mt-16 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Published", value: posts.length, suffix: " Articles" },
                  { label: "Topics", value: new Set(posts.flatMap((post) => post.tags)).size, suffix: " Categories" },
                  { label: "Newsletter", value: "Live", suffix: " Updates", static: true }
                ].map((stat, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl border border-card-border bg-background/40 p-5 transition-all hover:-translate-y-1 hover:border-brand-primary/50 hover:bg-background/80 hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <p className="relative z-10 font-mono text-xs uppercase tracking-[0.2em] text-brand-text/50">{stat.label}</p>
                    <div className="relative z-10 mt-2 flex items-baseline gap-1">
                      <p className="text-3xl font-black text-brand-primary drop-shadow-sm">{stat.value}</p>
                    </div>
                    <p className="relative z-10 mt-1 text-xs text-brand-text/40">{stat.suffix}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="relative flex flex-col justify-center border-t border-card-border bg-gradient-to-br from-background/40 to-background/5 p-8 md:p-12 lg:border-l lg:border-t-0">
              {/* Decorative grid pattern in the background of the aside */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(var(--brand-text-dynamic) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              
              <div className="relative z-10 w-full max-w-sm mx-auto space-y-6">
                <div className="group relative transform rounded-2xl border border-card-border bg-card/80 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:-rotate-1 hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/5">
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-brand-primary/50 to-brand-accent/50 opacity-0 blur transition-opacity duration-500 group-hover:opacity-20" />
                  <div className="relative flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                      <SquareTerminal size={22} />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-bold uppercase tracking-wider text-brand-text">Git-Backed</p>
                      <p className="text-xs text-brand-text/60">Version controlled CMS</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-brand-text/70">
                    Markdown-first workflow integrated with GitHub Actions for a production-safe editorial review process.
                  </p>
                </div>
                
                <div className="group relative ml-auto w-[90%] transform rounded-2xl border border-card-border bg-card/80 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:translate-x-2 hover:rotate-1 hover:border-brand-accent/40 hover:shadow-xl hover:shadow-brand-accent/5">
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-brand-accent/50 to-brand-primary/50 opacity-0 blur transition-opacity duration-500 group-hover:opacity-20" />
                  <div className="relative flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                      <Radar size={22} />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-bold uppercase tracking-wider text-brand-text">High Signal</p>
                      <p className="text-xs text-brand-text/60">Zero fluff policy</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-brand-text/70">
                    Deep technical dives into infrastructure patterns, incident response playbooks, and architecture.
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
            <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-card-border bg-card transition-all hover:border-brand-primary/50">
              {featured.image && (
                <div className="absolute inset-0 z-0 opacity-20 transition-opacity duration-700 group-hover:opacity-40">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                  <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay" />
                </div>
              )}
              
              <div className="relative z-10 flex flex-1 flex-col p-8 md:p-10">
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-brand-primary drop-shadow-md">
                  Lead Story
                </p>
                <h3 className="mt-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl drop-shadow-sm">
                  {featured.title}
                </h3>
                <p className="mt-6 max-w-2xl text-lg text-brand-text/70">
                  {featured.description}
                </p>
                
                <div className="mt-auto pt-12">
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex flex-wrap gap-4 font-mono text-sm text-brand-text/50">
                      <span>{featured.author}</span>
                      <span>{featured.date}</span>
                      <span>{featured.readingTimeText}</span>
                    </div>
                    <Link
                      href={`/post/${featured.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-background/50 px-6 py-2.5 font-mono text-sm text-brand-primary backdrop-blur-md transition-all hover:gap-3 hover:border-brand-primary hover:bg-brand-primary/10"
                    >
                      Read now
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            <div className="space-y-4">
              {secondary.map((post) => (
                <article
                  key={post.slug}
                  className="flex gap-4 rounded-2xl border border-card-border bg-card p-5 transition-colors hover:border-brand-primary/40"
                >
                  <div className="flex-1">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-primary">Recent</p>
                    <h4 className="mt-2 text-xl font-bold">{post.title}</h4>
                    <p className="mt-2 text-sm text-brand-text/60 line-clamp-2">{post.description}</p>
                    <Link href={`/post/${post.slug}`} className="inline-flex mt-4 font-mono text-sm text-brand-primary">
                      Open article
                    </Link>
                  </div>
                  {post.image && post.image !== "/logo.png" && (
                    <div className="hidden sm:block h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-card-border bg-background/50">
                      <img src={post.image} alt={post.title} className="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100" />
                    </div>
                  )}
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
