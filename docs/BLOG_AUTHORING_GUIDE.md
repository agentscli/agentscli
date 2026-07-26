# Blog Article Authoring Guide

> **For AI Agents & Developers**: This guide explains how to create blog articles for the agents.cli documentation site using the established templates and components.

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Creating a New Blog Post](#creating-a-new-blog-post)
4. [BlogPost Component Props](#blogpost-component-props)
5. [Available Components](#available-components)
6. [Typography & Styling](#typography--styling)
7. [Code Examples](#code-examples)
8. [Best Practices](#best-practices)

---

## Overview

The blog system uses Astro components with a Figma-designed template. Each blog post follows a consistent structure:

- **Navigation Header** - Site branding and links
- **Article Header** - Breadcrumb, title, subtitle, author info
- **Hero Image** - Optional featured image
- **Article Content** - Rich text with custom components
- **Author Footer** - Author card with actions
- **Newsletter Section** - Email signup
- **Site Footer** - Copyright and social links

---

## File Structure

```
src/
├── components/
│   ├── BlogPost.astro          # Main blog post template
│   ├── TerminalBlock.astro     # Code/terminal display
│   └── AgentCallout.astro      # Note/tip callout boxes
├── layouts/
│   └── BlogPostLayout.astro    # Full-page layout
├── pages/
│   └── blog/
│       └── your-post.astro     # Create blog posts here
├── content/
│   └── blog/
│       └── your-post.mdx       # Or use MDX format
└── styles/
    └── blog-post.css           # Blog-specific styles
```

---

## Creating a New Blog Post

### Option 1: Using the BlogPost Component (Recommended)

Create a new file in `src/pages/blog/your-post-slug.astro`:

```astro
---
import BlogPost from "../components/BlogPost.astro";
import TerminalBlock from "../components/TerminalBlock.astro";
import AgentCallout from "../components/AgentCallout.astro";
---

<BlogPost
  title="Your Article Title"
  subtitle="A compelling subtitle that describes what the reader will learn"
  category="Technical Guides"
  author={{
    name: "Author Name",
    title: "Lead Engineer @ agents.cli"
  }}
  date="Mar 8, 2026"
  readTime="6 min read"
  heroImage="/images/your-image.png"
>
  <!-- Article content goes here -->

  <p>Your opening paragraph...</p>

  <h2>First Section Heading</h2>

  <p>Section content...</p>

  <!-- Add terminal blocks for code -->
  <TerminalBlock
    title="bash"
    lines={[
      { type: "command", content: "npm install @agents/cli" },
      { type: "success", content: "Package installed successfully!" }
    ]}
  />

  <!-- Add callout boxes for important notes -->
  <AgentCallout title="Pro Tip" icon="tip">
    <p>Important information the reader should know.</p>
  </AgentCallout>
</BlogPost>
```

### Option 2: Using MDX with starlight-blog

Create a file in `src/content/blog/your-post-slug.mdx`:

```mdx
---
title: Your Article Title
description: A compelling description
authors: me
date: 2026-03-08
categories:
  - Technical Guides
---

Your content here with standard Markdown syntax...

## Section Heading

Content with **bold** and `code` inline.

```bash
npm install @agents/cli
```

> **Note:** Important information here.
```

---

## BlogPost Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ Yes | - | Article title (displayed as H1) |
| `subtitle` | `string` | No | - | Article subtitle/description |
| `category` | `string` | No | `"Technical Guides"` | Category shown in breadcrumb |
| `author` | `object` | No | `{ name: "Team" }` | Author information |
| `author.name` | `string` | ✅ | - | Author's display name |
| `author.title` | `string` | No | - | Author's role/title |
| `author.avatar` | `string` | No | - | URL to author avatar image |
| `date` | `string` | No | - | Publication date (e.g., "Mar 8, 2026") |
| `readTime` | `string` | No | `"5 min read"` | Estimated reading time |
| `heroImage` | `string` | No | - | URL to hero/featured image |

---

## Available Components

### TerminalBlock

Displays code/terminal output with macOS-style window decorations.

```astro
<TerminalBlock
  title="bash - agents-cli"
  lines={[
    { type: "command", content: "agents-cli deploy --env production" },
    { type: "success", content: "Analyzing project structure..." },
    { type: "success", content: "Detected Next.js framework." },
    { type: "warning", content: "Missing environment variable:", highlight: "DB_URL" },
    { type: "output", content: "Agent: Should I retrieve this from AWS? (y/n)" },
    { type: "prompt", content: "" }
  ]}
/>
```

#### Line Types

| Type | Appearance | Use Case |
|------|------------|----------|
| `prompt` | Blinking cursor `_` | Active input line |
| `command` | `>` prefix, white text | User commands |
| `output` | Muted gray text | General output |
| `success` | Green ✔ checkmark | Success messages |
| `warning` | Yellow ! icon | Warning messages |
| `error` | Red ✗ icon | Error messages |

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Window title (default: `"bash"`) |
| `lines` | `array` | Array of line objects |
| `lines[].type` | `string` | Line type (see table above) |
| `lines[].content` | `string` | Line text content |
| `lines[].highlight` | `string` | Optional inline code highlight |

### AgentCallout

Highlighted callout boxes for notes, tips, and warnings.

```astro
<AgentCallout title="Security Note" icon="warning">
  <p>Never commit API keys to version control.</p>
</AgentCallout>
```

#### Icon Options

| Icon | Appearance | Use Case |
|------|------------|----------|
| `"note"` | Purple info icon | General notes |
| `"tip"` | Green lightbulb | Helpful tips |
| `"warning"` | Yellow warning | Cautions/warnings |
| `"info"` | Purple info | Information |

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Agent Note"` | Callout heading |
| `icon` | `string` | `"note"` | Icon type |

---

## Typography & Styling

### Heading Hierarchy

| Element | Font Size | Font Weight | Use Case |
|---------|-----------|-------------|----------|
| `h1` | 60px | 800 (Extra Bold) | Article title (auto-generated) |
| `h2` | 24px | 700 (Bold) | Major sections |
| `h3` | 20px | 700 (Bold) | Sub-sections |
| `h4` | 16px | 700 (Bold) | Minor headings |

### Text Styles

| Element | Font Size | Color | Use Case |
|---------|-----------|-------|----------|
| `<p>` | 18px | `#e8e8f0` | Body paragraphs |
| `<strong>` | 18px | `#ffffff` | Emphasized text |
| `<code>` | 14px | `#7c69f7` | Inline code |
| `<a>` | 18px | `#7c69f7` | Links |

### Color Palette

```css
/* Primary Colors */
--color-primary: #7c69f7;        /* Purple - links, accents */
--color-primary-hover: #6b58e6;  /* Purple hover state */

/* Text Colors */
--color-text-primary: #ffffff;   /* White - headings */
--color-text-secondary: #e8e8f0; /* Light gray - body text */
--color-text-muted: #9890cb;     /* Muted purple - meta text */

/* Background Colors */
--color-bg-primary: #0a0a0f;     /* Near black - main background */
--color-bg-secondary: #111118;   /* Dark gray - cards */

/* Border Colors */
--color-border-subtle: rgba(255, 255, 255, 0.05);
--color-border-light: rgba(255, 255, 255, 0.1);
```

---

## Code Examples

### Complete Blog Post Example

```astro
---
import BlogPost from "../components/BlogPost.astro";
import TerminalBlock from "../components/TerminalBlock.astro";
import AgentCallout from "../components/AgentCallout.astro";
---

<BlogPost
  title="Getting Started with CLI Agents"
  subtitle="Learn how to set up and configure your first AI-powered CLI agent in minutes."
  category="Getting Started"
  author={{
    name: "Sarah Chen",
    title: "Developer Advocate @ agents.cli"
  }}
  date="Mar 8, 2026"
  readTime="5 min read"
>
  <p>
    CLI agents represent a paradigm shift in how developers interact with
    their terminals. Instead of memorizing complex commands, you can now
    express your intent in natural language.
  </p>

  <h2>Installation</h2>

  <p>
    Getting started is simple. Install the CLI agent globally using your
    preferred package manager:
  </p>

  <TerminalBlock
    title="bash"
    lines={[
      { type: "command", content: "npm install -g @agents/cli" },
      { type: "success", content: "Package installed successfully!" },
      { type: "command", content: "agents-cli --version" },
      { type: "output", content: "agents-cli v2.4.0" }
    ]}
  />

  <h2>Configuration</h2>

  <p>
    Create a configuration file in your project root to customize the
    agent's behavior:
  </p>

  <TerminalBlock
    title="bash"
    lines={[
      { type: "command", content: "agents-cli init" },
      { type: "output", content: "Creating agents.config.json..." },
      { type: "success", content: "Configuration created!" },
      { type: "output", content: "Edit the file to customize your agent." }
    ]}
  />

  <AgentCallout title="Configuration Tip" icon="tip">
    <p>
      You can specify multiple environments in your config file. Use
      <code>agents-cli --env staging</code> to switch contexts.
    </p>
  </AgentCallout>

  <h2>Next Steps</h2>

  <p>
    Now that you have agents-cli installed, check out our guide on
    <a href="/blog/multi-agent-orchestration">Multi-Agent Orchestration</a>
    to learn about advanced workflows.
  </p>

  <ul>
    <li>Read the <a href="/docs">full documentation</a></li>
    <li>Join our <a href="/community">community forum</a></li>
    <li>Star us on <a href="https://github.com">GitHub</a></li>
  </ul>
</BlogPost>
```

### Terminal with Error Handling Example

```astro
<TerminalBlock
  title="bash - deploy"
  lines={[
    { type: "command", content: "agents-cli deploy --env production" },
    { type: "success", content: "Building application..." },
    { type: "success", content: "Running tests... 42 passed" },
    { type: "error", content: "Deployment failed: Missing AWS credentials" },
    { type: "output", content: "Run 'agents-cli auth' to configure credentials" },
    { type: "prompt", content: "" }
  ]}
/>
```

---

## Best Practices

### Writing Style

1. **Lead with value** - Open with what the reader will learn or achieve
2. **Use active voice** - "Run this command" not "This command should be run"
3. **Be concise** - Aim for 5-7 minute reads (1000-1500 words)
4. **Include code examples** - Show, don't just tell

### Formatting

1. **Use semantic headings** - H2 for major sections, H3 for sub-sections
2. **Break up text** - Use lists, code blocks, and callouts
3. **Highlight key terms** - Use `code` for technical terms
4. **Add alt text** - Describe images for accessibility

### Code Blocks

1. **Use TerminalBlock** - For CLI interactions and command output
2. **Show realistic output** - Include success/error states
3. **Keep commands copyable** - One command per line when possible

### Callouts

1. **Use sparingly** - One or two per article maximum
2. **Choose the right icon** - tip, warning, note, info
3. **Keep it brief** - 1-3 sentences maximum

### Categories

Standard categories for blog posts:

| Category | Use For |
|----------|---------|
| `Technical Guides` | Tutorials, how-tos, deep dives |
| `Getting Started` | Introductory content |
| `Announcements` | Product updates, releases |
| `Case Studies` | Real-world implementations |
| `Best Practices` | Recommended patterns |

---

## File Naming Conventions

- **URL-friendly slugs**: Use lowercase with hyphens
- **Examples**:
  - `getting-started-cli-agents.astro`
  - `multi-agent-orchestration.astro`
  - `deploying-to-production.astro`

---

## Testing Your Blog Post

1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:4321/blog/your-post-slug`
3. Verify:
   - [ ] All props are rendering correctly
   - [ ] Terminal blocks display properly
   - [ ] Callout boxes appear correctly
   - [ ] Links work
   - [ ] Responsive on mobile

---

## Quick Reference

### Minimal Blog Post

```astro
---
import BlogPost from "../components/BlogPost.astro";
---

<BlogPost title="My First Post">
  <p>Hello, world!</p>
</BlogPost>
```

### Full-Featured Blog Post

```astro
---
import BlogPost from "../components/BlogPost.astro";
import TerminalBlock from "../components/TerminalBlock.astro";
import AgentCallout from "../components/AgentCallout.astro";
---

<BlogPost
  title="Full Featured Post"
  subtitle="Demonstrating all available options"
  category="Technical Guides"
  author={{ name: "Your Name", title: "Your Role" }}
  date="Mar 8, 2026"
  readTime="5 min read"
  heroImage="/images/hero.png"
>
  <p>Content with <strong>bold</strong> and <code>code</code>.</p>

  <h2>Section</h2>

  <TerminalBlock title="bash" lines={[...]} />

  <AgentCallout title="Note">
    <p>Important information.</p>
  </AgentCallout>
</BlogPost>
```

---

## Support

- **Issues**: Report bugs or request features on GitHub
- **Questions**: Ask in the community forum
- **Contributing**: See CONTRIBUTING.md for guidelines

---

*Last updated: March 2026*
