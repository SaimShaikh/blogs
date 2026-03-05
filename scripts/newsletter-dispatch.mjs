#!/usr/bin/env node

import fs from "node:fs/promises";
import { execSync } from "node:child_process";
import path from "node:path";
import matter from "gray-matter";

function toBaseUrl(url) {
  return url.replace(/\/$/, "");
}

function getChangedPostFiles() {
  const before = process.env.GITHUB_EVENT_BEFORE || "";
  const after = process.env.GITHUB_SHA || "HEAD";

  let output = "";
  if (before && before !== "0000000000000000000000000000000000000000") {
    output = execSync(`git diff --name-only ${before} ${after} -- post/*.md`, { encoding: "utf8" });
  } else {
    output = execSync("git diff --name-only HEAD~1 HEAD -- post/*.md", { encoding: "utf8" });
  }

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.endsWith(".md"));
}

async function loadPost(filePath) {
  const absolute = path.join(process.cwd(), filePath);
  const raw = await fs.readFile(absolute, "utf8");
  const { data, content } = matter(raw);

  return {
    filePath,
    slug: path.basename(filePath, ".md"),
    title: typeof data.title === "string" ? data.title : "Untitled",
    description: typeof data.description === "string" ? data.description : "",
    author: typeof data.author === "string" ? data.author : "EdgeOps Labs",
    date: typeof data.date === "string" ? data.date : new Date().toISOString().slice(0, 10),
    image: typeof data.image === "string" ? data.image : "/logo.png",
    newsletter: data.newsletter === true,
    content,
  };
}

function renderHtml(post, siteUrl) {
  const postUrl = `${siteUrl.replace(/\/$/, "")}/post/${post.slug}`;
  const escapedDescription = post.description.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `
<div style="font-family: Inter, system-ui, sans-serif; max-width: 680px; margin: 0 auto; color: #0f172a;">
  <h1 style="font-family: 'JetBrains Mono', monospace; margin: 0 0 8px;">${post.title}</h1>
  <p style="margin: 0 0 16px; color: #475569;">${escapedDescription}</p>
  <p style="margin: 0 0 20px; color: #64748b; font-size: 14px;">By ${post.author} · ${post.date}</p>
  <a href="${postUrl}" style="display:inline-block; padding:12px 18px; border-radius:10px; border:1px solid #05CAFF; color:#0369a1; text-decoration:none; font-weight:600;">Read full post</a>
  <p style="margin-top:20px; color:#64748b; font-size:12px;">EdgeOps Labs · blogs.edgeopslabs.com</p>
</div>
`.trim();
}

async function fetchCampaigns(baseUrl, authHeader) {
  const response = await fetch(`${toBaseUrl(baseUrl)}/api/campaigns?page=1&per_page=200`, {
    headers: { authorization: authHeader },
  });

  if (!response.ok) return [];
  const payload = await response.json();
  const maybe = payload?.data?.results || payload?.data || payload?.results || [];
  return Array.isArray(maybe) ? maybe : [];
}

async function createCampaign(baseUrl, authHeader, payload) {
  const response = await fetch(`${toBaseUrl(baseUrl)}/api/campaigns`, {
    method: "POST",
    headers: {
      authorization: authHeader,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(`Create campaign failed (${response.status}): ${bodyText}`);
  }

  try {
    return JSON.parse(bodyText);
  } catch {
    return { data: null };
  }
}

async function startCampaign(baseUrl, authHeader, campaignId) {
  const response = await fetch(`${toBaseUrl(baseUrl)}/api/campaigns/${campaignId}/status`, {
    method: "PUT",
    headers: {
      authorization: authHeader,
      "content-type": "application/json",
    },
    body: JSON.stringify({ status: "running" }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Start campaign failed (${response.status}): ${text}`);
  }
}

async function dispatchViaWebhook(webhookUrl, post, siteUrl) {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      event: "post_published",
      post: {
        slug: post.slug,
        title: post.title,
        description: post.description,
        author: post.author,
        date: post.date,
        url: `${siteUrl.replace(/\/$/, "")}/post/${post.slug}`,
        image: post.image,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Webhook dispatch failed (${response.status}): ${text}`);
  }
}

async function main() {
  const changed = getChangedPostFiles();
  if (changed.length === 0) {
    console.log("No changed markdown posts in this push.");
    return;
  }

  const posts = await Promise.all(changed.map(loadPost));
  const eligible = posts.filter((post) => post.newsletter === true);

  if (eligible.length === 0) {
    console.log("No posts with newsletter: true in this push.");
    return;
  }

  const siteUrl = process.env.NEWSLETTER_SITE_URL || "https://blogs.edgeopslabs.com";
  const webhookUrl = process.env.LISTMONK_CAMPAIGN_WEBHOOK_URL;

  if (webhookUrl) {
    for (const post of eligible) {
      await dispatchViaWebhook(webhookUrl, post, siteUrl);
      console.log(`Dispatched newsletter webhook for: ${post.slug}`);
    }
    return;
  }

  const baseUrl = process.env.LISTMONK_API_URL;
  const user = process.env.LISTMONK_API_USER;
  const pass = process.env.LISTMONK_API_PASSWORD;
  const listIds = (process.env.LISTMONK_LIST_IDS || "")
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value) && value > 0);

  if (!baseUrl || !user || !pass || listIds.length === 0) {
    throw new Error(
      "Missing Listmonk config. Set LISTMONK_API_URL, LISTMONK_API_USER, LISTMONK_API_PASSWORD, LISTMONK_LIST_IDS or LISTMONK_CAMPAIGN_WEBHOOK_URL."
    );
  }

  const auth = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
  const existing = await fetchCampaigns(baseUrl, auth);

  for (const post of eligible) {
    const campaignName = `post:${post.slug}:${post.date}`;
    const exists = existing.some((campaign) => campaign?.name === campaignName);
    if (exists) {
      console.log(`Skipping duplicate campaign: ${campaignName}`);
      continue;
    }

    const campaignPayload = {
      name: campaignName,
      subject: post.title,
      lists: listIds,
      type: "regular",
      content_type: "html",
      body: renderHtml(post, siteUrl),
      from_email: process.env.LISTMONK_FROM_EMAIL || "no-reply@edgeopslabs.com",
    };

    const created = await createCampaign(baseUrl, auth, campaignPayload);
    const campaignId = created?.data?.id || created?.id;

    if (!campaignId) {
      throw new Error(`Campaign created but id is missing for ${campaignName}`);
    }

    if (process.env.LISTMONK_AUTO_SEND === "true") {
      await startCampaign(baseUrl, auth, campaignId);
      console.log(`Created and started campaign: ${campaignName}`);
    } else {
      console.log(`Created campaign draft: ${campaignName}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
