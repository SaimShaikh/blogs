# EdgeOps Blog

![Build](https://img.shields.io/github/actions/workflow/status/EdgeOpslabs/blogs/newsletter-dispatch.yml?branch=main&style=for-the-badge&logo=github&label=build&color=00D1FF)
![Deployment Status](https://img.shields.io/badge/deployment-operational-00C853?style=for-the-badge&logo=vercel)
![Version](https://img.shields.io/badge/release-v1.0.0-05CAFF?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-000000?style=for-the-badge)
![Tech](https://img.shields.io/badge/built_with-Next.js_16-000000?style=for-the-badge&logo=next.js)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-00D1FF?style=for-the-badge&logo=github)
![Open Source](https://img.shields.io/badge/open_source-yes-05CAFF?style=for-the-badge)
![Maintained](https://img.shields.io/badge/maintained-yes-00C853?style=for-the-badge)

High-signal technical editorial for the Autonomous Cloud. Built with precision for platform engineers, SREs, and DevOps professionals.

[**Visit the Editorial**](https://blogs.edgeopslabs.com) | [**Write for us**](#write-for-edgeops) | [**Community**](CONTRIBUTORS.md)

## Stack
- Next.js 16 (App Router)
- Tailwind CSS v4
- next-themes
- lucide-react
- react-markdown + gray-matter

## Routes
- `/` – Hero & Featured Editorial
- `/post` – Full archive with search & filtered discovery
- `/post/{slug}` – Deep-dive article view

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

## Feeds & APIs
- `GET /rss.xml` – generates an RSS 2.0 feed for all markdown posts. The marketing site consumes this from `https://blogs.edgeopslabs.com/rss.xml`.
- `GET /api/posts` – returns simplified JSON metadata for every post (title, slug, tags, reading time, etc.).
- `GET /api/posts/highlights` – returns `{ latest, topImpressions }`, combining markdown metadata with real-time impression counts.

Use these endpoints for any downstream automation (community cards, dashboards, etc.).

## Impressions telemetry config
View counts are recorded automatically whenever someone opens `/post/[slug]`. The tracker writes to Upstash Redis through the `/api/posts/[slug]/impression` route.

Set the following environment variables in `.env.local` (and in your deployment platform):

```bash
UPSTASH_REDIS_REST_URL="https://<your-upstash-rest-url>"
UPSTASH_REDIS_REST_TOKEN="<your-upstash-rest-token>"
```

---

## Write for EdgeOps

Are you a platform engineer, SRE, or cloud architect? We are looking for high-signal insights on:
- **Autonomous Infrastructure**: AI-driven operations and self-healing systems.
- **Platform Engineering**: Internal Developer Platforms (IDPs) and developer experience.
- **Cloud Native Patterns**: Kubernetes, eBPF, and cutting-edge orchestration.
- **SRE & Resilience**: Incident response playbooks and reliability engineering.

### Workflow
1. **Submit a Proposal**: [Open an issue](https://github.com/EdgeOpslabs/blogs/issues/new?template=blog_proposal.md) to pitch your idea first.
2. **Collaborate**: Refine the outline with the core team.
3. **Contribute**: Fork, write, and submit a PR.

See [**CONTRIBUTING.md**](CONTRIBUTING.md) for the full editorial guidelines.

## Community & Credits

This platform is a collaborative effort. View our [**CONTRIBUTORS.md**](CONTRIBUTORS.md) to see the humans behind the code and content.

---
© 2026 EdgeOps Labs. Licensed under MIT.
