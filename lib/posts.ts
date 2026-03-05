import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type PostFrontmatter = {
  title: string;
  description: string;
  image: string;
  author: string;
  date: string;
  newsletter: boolean;
  tags: string[];
};

export type BlogPost = PostFrontmatter & {
  slug: string;
  content: string;
  readingTimeText: string;
};

const postsDirectory = path.join(process.cwd(), "post");

function parseFrontmatter(data: Record<string, unknown>, slug: string): PostFrontmatter {
  const title = typeof data.title === "string" ? data.title : "Untitled";
  const description = typeof data.description === "string" ? data.description : "";
  const image = typeof data.image === "string" ? data.image : "/logo.png";
  const author = typeof data.author === "string" ? data.author : "EdgeOps Labs";
  const date = typeof data.date === "string" ? data.date : new Date().toISOString().slice(0, 10);
  const newsletter = typeof data.newsletter === "boolean" ? data.newsletter : false;
  const tags = Array.isArray(data.tags) ? data.tags.filter((item): item is string => typeof item === "string") : [];

  if (!title) {
    throw new Error(`Missing title in post: ${slug}`);
  }

  return { title, description, image, author, date, newsletter, tags };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = await fs.readdir(postsDirectory);
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  const posts = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const raw = await fs.readFile(fullPath, "utf8");
      const { data, content } = matter(raw);
      const frontmatter = parseFrontmatter(data as Record<string, unknown>, slug);

      return {
        ...frontmatter,
        slug,
        content,
        readingTimeText: readingTime(content).text,
      } satisfies BlogPost;
    })
  );

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  return Array.from(new Set(posts.flatMap((post) => post.tags))).sort();
}
