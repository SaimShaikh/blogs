import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { PostViewTracker } from "@/components/blog/PostViewTracker";
import { CodeBlock } from "@/components/blog/CodeBlock";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import { SocialFollow } from "@/components/blog/SocialFollow";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found | EdgeOps Blog" };
  }

  return {
    title: `${post.title} | EdgeOps Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getAllPosts();
  const recentPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main className="min-h-screen pt-32 pb-20">
      <PostViewTracker />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Link href="/post" className="text-sm font-mono text-brand-primary hover:underline transition-all">
            ← Back to posts
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <article className="lg:w-2/3">
            <header className="rounded-2xl border border-card-border bg-card p-8">
          {post.image && (
            <div className="mb-8 aspect-video w-full overflow-hidden rounded-xl border border-card-border bg-background/50">
              <img
                src={post.image}
                alt={post.title}
                className="block h-full w-full object-cover"
              />
            </div>
          )}
          <p className="text-xs uppercase tracking-[0.2em] text-brand-primary font-mono">
            Technical Article
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold">{post.title}</h1>
          <p className="mt-4 text-lg text-brand-text/65">{post.description}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-mono text-brand-text/55">
            <span>{post.author}</span>
            <span>{post.date}</span>
            <span>{post.readingTimeText}</span>
          </div>
        </header>

        <section className="markdown-content mt-8 rounded-2xl border border-card-border bg-card p-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img(props) {
                return (
                  <div className="my-10 w-full overflow-hidden rounded-2xl border border-card-border bg-background/50">
                    <img
                      {...props}
                      alt={props.alt || "Blog Image"}
                      className="block !m-0 max-h-[500px] w-full !rounded-none !border-0 object-cover"
                    />
                  </div>
                );
              },
              pre({ children }) {
                // @ts-expect-error - ReactMarkdown passes code element as child
                const codeChild = children?.props?.children;
                // @ts-expect-error - className is on the child
                const className = children?.props?.className || "";
                const match = /language-(\w+)/.exec(className);
                
                if (codeChild) {
                  return (
                    <CodeBlock
                      code={String(codeChild).replace(/\n$/, "")}
                      language={match ? match[1] : "text"}
                    />
                  );
                }
                return <pre>{children}</pre>;
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </section>
        </article>

        <aside className="lg:w-1/3 flex flex-col gap-8 mt-12 lg:mt-0">
          <div className="rounded-2xl border border-card-border bg-card p-6 md:p-8">
            <h3 className="relative mb-6 pb-4 text-xl font-bold md:text-2xl border-b border-card-border/50">
              Recent Posts
              <span className="absolute bottom-[-1px] left-0 h-[2px] w-16 bg-brand-primary/80"></span>
            </h3>
            <div className="flex flex-col gap-6">
              {recentPosts.map((recentPost) => (
                <Link key={recentPost.slug} href={`/post/${recentPost.slug}`} className="group flex gap-4 items-center focus:outline-none">
                  <div className="flex flex-1 flex-col justify-center">
                    <h4 className="text-[15px] font-bold leading-snug transition-colors group-hover:text-brand-primary line-clamp-3">
                      {recentPost.title}
                    </h4>
                    <span className="mt-2 text-xs font-mono text-brand-text/55">
                      {recentPost.date}
                    </span>
                  </div>
                  {recentPost.thumbnail && (
                    <div className="shrink-0 w-24 aspect-[4/3] overflow-hidden bg-background/50 border border-card-border/50">
                      <img
                        src={recentPost.thumbnail}
                        alt={recentPost.title}
                        className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
          <NewsletterSignup />
          <SocialFollow />
        </aside>
        </div>
      </div>
    </main>
  );
}
