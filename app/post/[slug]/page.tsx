import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { PostViewTracker } from "@/components/blog/PostViewTracker";
import { CodeBlock } from "@/components/blog/CodeBlock";

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

  return (
    <main className="min-h-screen pt-32 pb-20">
      <PostViewTracker />
      <article className="container mx-auto px-4 max-w-4xl">
        <Link href="/post" className="text-sm font-mono text-brand-primary">
          ← Back to posts
        </Link>

        <header className="mt-6 rounded-2xl border border-card-border bg-card p-8">
          {post.image && (
            <div className="mb-8 aspect-video w-full overflow-hidden rounded-xl border border-card-border bg-background/50">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover"
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
            <span>
              {post.newsletter ? "Newsletter: Enabled" : "Newsletter: Disabled"}
            </span>
          </div>
        </header>

        <section className="markdown-content mt-8 rounded-2xl border border-card-border bg-card p-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
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
    </main>
  );
}
