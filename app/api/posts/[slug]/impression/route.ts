import { NextResponse } from "next/server";
import { incrementImpression } from "@/lib/impressions";

export async function POST(
  _: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  if (!slug) {
    return NextResponse.json(
      { ok: false, message: "Missing slug parameter." },
      { status: 400 },
    );
  }

  try {
    await incrementImpression(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to increment impression:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to record impression." },
      { status: 500 },
    );
  }
}
