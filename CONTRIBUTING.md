# Contributing to EdgeOps Editorial

Thank you for your interest in contributing to the EdgeOps Blog! We aim to provide high-signal technical content for the modern engineering community.

## Project Tracking

All content and website work is tracked on the **[EdgeOps Blog GitHub Project](https://github.com/orgs/EdgeOpslabs/projects)**.  
Every issue and pull request is automatically added to the board when it is opened.  
Ask a maintainer for the direct project link if you need it.

### Boards

| Board | Purpose |
|-------|---------|
| **Editorial Pipeline** | Tracks blog post proposals through publication. |
| **Website Enhancements** | Tracks feature requests, bugs, and UX improvements. |

### Issue Templates

Use the correct template when opening an issue:

| Template | Title prefix | Labels applied |
|----------|-------------|----------------|
| Blog Proposal | `[PROPOSAL]: ` | `editorial:proposal`, `area:content` |
| Website Enhancement | `[ENHANCEMENT]: ` | `type:enhancement`, `area:website` |
| Bug Report | `[BUG]: ` | `type:bug`, `area:website` |

### Labels

We use a structured labelling system — see [`.github/labels.yml`](.github/labels.yml) for the full list.  
The [`label-sync`](.github/workflows/label-sync.yml) workflow keeps repository labels in sync with that file automatically on every push to `main`.

---

## Editorial Workflow

To ensure a high standard of quality and consistency, we follow a structured editorial process. **Please do not open a Pull Request without an approved proposal.**

### 1. The Proposal Stage
- **Action**: [Open a "Blog Proposal" Issue](https://github.com/EdgeOpslabs/blogs/issues/new?template=blog_proposal.md).
- **Goal**: Share your topic, a brief outline, and why it matters to the EdgeOps audience.
- **Label**: Your issue will be labeled `editorial:proposal`.
- **Approval**: Once the core team reviews and approves the outline, the issue will be labeled `editorial:approved`.

### 2. The Writing Stage
- **Action**: Fork the repository and create a new branch `content/your-post-title`.
- **Content**: Create a new `.md` file in the `/post` directory.
- **Images**: Place any custom images in `/public/post/` and reference them using absolute paths like `/post/your-image.png`.
- **Frontmatter**: Ensure all required fields are filled out.

### 3. The Review Stage
- **Action**: Submit a Pull Request.
- **Review**: Technical and grammatical review by the EdgeOps team.
- **Label**: `editorial:review`.
- **Feedback**: Address any comments or suggested edits.

### 4. Publication
- **Action**: PR merged by a maintainer.
- **Deployment**: Automatic deployment to production.
- **Newsletter**: If `newsletter: true`, the post will be dispatched to subscribers.

## Technical Guidelines

### Markdown Standards
- Use H2 (`##`) and H3 (`###`) for content hierarchy. Reserve H1 (`#`) for the article title.
- Use fenced code blocks with language identifiers for syntax highlighting.
- Use inclusive, professional language.

### Image Optimization
- Use clear, professional diagrams (Mermaid, Excalidraw, etc.).
- Keep file sizes under 500KB where possible.
- Preferred formats: `.png`, `.jpg`, `.webp`.

## Labeling Strategy

We use labels to manage the lifecycle of content. The full label set is defined in [`.github/labels.yml`](.github/labels.yml) and is synced automatically.

**Editorial lifecycle**
| Label | Meaning |
|-------|---------|
| `editorial:proposal` | Initial content idea submitted. |
| `editorial:approved` | Proposal approved — ready to write. |
| `editorial:in-progress` | Author is writing. |
| `editorial:review` | PR submitted and under review. |
| `editorial:published` | Merged and live. |

**Content type**
| Label | Meaning |
|-------|---------|
| `type:technical` | Deep-dive technical content. |
| `type:case-study` | Real-world implementation story. |
| `type:tutorial` | Step-by-step guide. |
| `type:opinion` | Opinion / editorial piece. |

**Website / platform**
| Label | Meaning |
|-------|---------|
| `type:bug` | Broken or incorrect behaviour. |
| `type:enhancement` | New feature or improvement. |
| `area:website` | Affects the blog platform. |
| `area:infrastructure` | Affects CI/CD or deployment. |
| `area:newsletter` | Affects the newsletter system. |

**Priority**
`priority:critical` → `priority:high` → `priority:medium` → `priority:low`

---

## Project Management Setup (Maintainers)

To enable automated project board integration:

1. **Create a GitHub Project** at `https://github.com/orgs/EdgeOpslabs/projects/new`.  
   Create two views — *Editorial Pipeline* and *Website Enhancements* — each with a **Status** field.

2. **Add the project URL** as a repository Actions variable:  
   `Settings → Secrets and variables → Actions → Variables`  
   Name: `PROJECT_URL`, Value: `https://github.com/orgs/EdgeOpslabs/projects/<N>`

3. **Create a PAT** with `project` and `repo` scopes, then add it as a repository secret:  
   Name: `PROJECT_TOKEN`

Once configured, the [`project-automation`](.github/workflows/project-automation.yml) workflow will automatically add every new issue and PR to the board.

---
Questions? Open an issue or contact the maintainers.
