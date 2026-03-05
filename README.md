# EdgeOps Blog

Custom markdown-driven blog app with exact EdgeOps website branding.

## Stack
- Next.js 16 (App Router)
- Tailwind CSS v4
- next-themes
- lucide-react
- react-markdown + gray-matter

## Routes
- `/` landing page
- `/post` posts index with search/filter
- `/post/{slug}` post detail

## Write a post
Create a markdown file in `/post`.

Example: `/post/helloworld.md`

Required frontmatter:

```md
---
title: "Hello World"
description: "Short summary"
image: "/logo.png"
author: "Your Name"
date: "2026-03-03"
newsletter: true
tags: ["devops", "kubernetes"]
---

# Article content
```

## Newsletter behavior
- Posts with `newsletter: true` are eligible for newsletter send automation.
- Posts with `newsletter: false` are not sent.
- Subscriber form posts to `/api/newsletter/subscribe`, which forwards to Listmonk.
- GitHub Action `newsletter-dispatch.yml` runs on pushes to `main` when `post/*.md` changes.
- Dispatcher script: `/scripts/newsletter-dispatch.mjs`.

## Newsletter setup
1. Copy env:
```bash
cp .env.example .env.local
```
2. Configure local/runtime vars:
- `LISTMONK_API_URL`
- `LISTMONK_API_USER`
- `LISTMONK_API_PASSWORD`
- `LISTMONK_LIST_IDS`
3. Configure GitHub repo secrets/vars for workflow:
- Secrets:
  - `LISTMONK_API_URL`
  - `LISTMONK_API_USER`
  - `LISTMONK_API_PASSWORD`
  - `LISTMONK_LIST_IDS`
  - optional `LISTMONK_CAMPAIGN_WEBHOOK_URL`
- Vars:
  - `NEWSLETTER_SITE_URL`
  - `LISTMONK_FROM_EMAIL`
  - `LISTMONK_AUTO_SEND` (`true` to auto-send, otherwise drafts only)

## Run

```bash
npm install
npm run dev
```

## Validate

```bash
npm run lint
npm run build
```
