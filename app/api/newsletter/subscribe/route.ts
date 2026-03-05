import { NextResponse } from "next/server";

type SubscribeBody = {
  email?: string;
  name?: string;
};

function parseListIds(raw: string | undefined): number[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value) && value > 0);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubscribeBody;
    const email = body.email?.trim().toLowerCase();
    const name = body.name?.trim() || "";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, message: "Valid email is required." }, { status: 400 });
    }

    const baseUrl = process.env.LISTMONK_API_URL;
    const user = process.env.LISTMONK_API_USER;
    const pass = process.env.LISTMONK_API_PASSWORD;
    const listIds = parseListIds(process.env.LISTMONK_LIST_IDS);

    if (!baseUrl || !user || !pass || listIds.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Newsletter API is not configured. Set LISTMONK_* env vars." },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(`${user}:${pass}`).toString("base64");

    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/subscribers`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        email,
        name,
        status: "enabled",
        lists: listIds,
        preconfirm_subscriptions: true,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      const message = text.includes("already")
        ? "This email is already subscribed."
        : `Listmonk error: ${response.status}`;
      return NextResponse.json({ ok: false, message }, { status: response.status });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Unexpected error while subscribing." }, { status: 500 });
  }
}
