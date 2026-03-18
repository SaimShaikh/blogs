import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import { getImpressions } from "@/lib/impressions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  try {
    const posts = await getAllPosts();

    if (posts.length === 0) {
      return NextResponse.json(
        { latest: null, topImpressions: null, featured: [] },
        {
          headers: corsHeaders,
        },
      );
    }

    const slugs = posts.map((post) => post.slug);
    const impressionsMap = await getImpressions(slugs);

    const postsWithImpressions = posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      author: post.author,
      date: post.date,
      tags: post.tags,
      readingTimeText: post.readingTimeText,
      impressions: impressionsMap[post.slug] ?? 0,
    }));

    const latest = postsWithImpressions[0];
    const topImpressions = postsWithImpressions.reduce((prev, current) =>
      current.impressions > prev.impressions ? current : prev,
    );

    // Build featured array: mix of most read and latest (up to 3 unique posts)
    const featuredSlugs = new Set<string>();
    const featured: typeof postsWithImpressions = [];

    // Add top impression post first
    if (topImpressions) {
      featured.push(topImpressions);
      featuredSlugs.add(topImpressions.slug);
    }

    // Add latest post if different from top impressions
    if (latest && !featuredSlugs.has(latest.slug)) {
      featured.push(latest);
      featuredSlugs.add(latest.slug);
    }

    // Fill remaining slots with posts sorted by impressions (descending)
    const byImpressions = [...postsWithImpressions].sort(
      (a, b) => b.impressions - a.impressions,
    );
    for (const post of byImpressions) {
      if (featured.length >= 3) break;
      if (!featuredSlugs.has(post.slug)) {
        featured.push(post);
        featuredSlugs.add(post.slug);
      }
    }

    // If still need more, fill with most recent by date
    if (featured.length < 3) {
      for (const post of postsWithImpressions) {
        if (featured.length >= 3) break;
        if (!featuredSlugs.has(post.slug)) {
          featured.push(post);
          featuredSlugs.add(post.slug);
        }
      }
    }

    return NextResponse.json(
      { latest, topImpressions, featured },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error("Failed to compute highlights:", error);
    return NextResponse.json(
      {
        latest: null,
        topImpressions: null,
        featured: [],
        error: "Failed to compute highlights",
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: corsHeaders,
    },
  );
}
