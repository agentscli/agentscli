# Blog Post Quick Reference Card

> **Quick lookup for creating blog articles.** For detailed docs, see [BLOG_AUTHORING_GUIDE.md](./BLOG_AUTHORING_GUIDE.md)

---

## Create New Blog Post

**File**: `src/pages/blog/your-slug.astro`

```astro
---
import BlogPost from "../components/BlogPost.astro";
import TerminalBlock from "../components/TerminalBlock.astro";
import AgentCallout from "../components/AgentCallout.astro";
---

<BlogPost
  title="Your Title"
  subtitle="Brief description"
  category="Technical Guides"
  author={{ name: "Name", title: "Role @ Company" }}
  date="Mar 8, 2026"
  readTime="5 min read"
>
  <!-- Content here -->
</BlogPost>
```

---

## BlogPost Props

| Prop | Required | Example |
|------|----------|---------|
| `title` | ✅ | `"Getting Started"` |
| `subtitle` | | `"Learn the basics..."` |
| `category` | | `"Technical Guides"` |
| `author` | | `{ name: "John", title: "Engineer" }` |
| `date` | | `"Mar 8, 2026"` |
| `readTime` | | `"5 min read"` |
| `heroImage` | | `"/images/hero.png"` |

---

## TerminalBlock

```astro
<TerminalBlock
  title="bash"
  lines={[
    { type: "command", content: "npm install agents-cli" },
    { type: "success", content: "Installed!" },
    { type: "warning", content: "Note:", highlight: "ENV_VAR" },
    { type: "error", content: "Failed!" },
    { type: "output", content: "Result text" },
    { type: "prompt", content: "" }
  ]}
/>
```

---

## AgentCallout

```astro
<AgentCallout title="Tip" icon="tip">
  <p>Your content here.</p>
</AgentCallout>
```

**Icons**: `note` | `tip` | `warning` | `info`

---

## Typography

| Element | Usage |
|---------|-------|
| `<h2>` | Major sections |
| `<h3>` | Sub-sections |
| `<p>` | Body text |
| `<strong>` | Emphasis |
| `<code>` | Inline code |
| `<a>` | Links |
| `<ul>/<li>` | Lists |

---

## Categories

- `Technical Guides`
- `Getting Started`
- `Announcements`
- `Case Studies`
- `Best Practices`

---

## File Locations

```
src/pages/blog/*.astro     ← Create posts here
src/content/blog/*.mdx     ← Or use MDX
src/components/BlogPost.astro
src/components/TerminalBlock.astro
src/components/AgentCallout.astro
```
