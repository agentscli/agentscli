# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro + Starlight documentation site for "agents.cli" with a custom-designed homepage. The site includes documentation pages, guides, and a blog. It uses pnpm as the package manager and deploys to Cloudflare Workers.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (localhost:4321)
pnpm dev
# or
pnpm start

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

## Architecture

### Content Collections

The active content config is `src/content.config.ts` (Astro's root content-config location).
Blog posts use a separate `blog` collection so custom blog routes do not overlap
with Starlight's documentation route. Do not recreate `src/content/config.ts`.

Content structure:
- `src/content/docs/` - Guides and reference docs (using the Starlight docs schema)
- `src/content/docs/blog/` - Blog posts as MDX files

### Routing

- **Documentation routes**: Handled by Starlight based on `src/content/docs/` structure
- **Custom pages**: `src/pages/` contains custom routes:
  - `index.astro` - Custom homepage (non-Starlight)
  - `src/pages/blog/` - Custom blog routes and RSS feed

### Components

Custom Astro components in `src/components/`:
- `Header.astro`, `Footer.astro` - Homepage navigation
- `BlogHeader.astro`, `BlogLayout.astro`, `RelatedPosts.astro` - Blog chrome;
  the post page itself is `src/layouts/BlogPostLayout.astro`
- `SiteThemeToggle.astro` - Light/dark toggle for the custom routes (homepage,
  blog). Starlight routes use the `ThemeSelect` override. Both write the same
  `starlight-theme` localStorage key, so the choice carries across surfaces.
- `FeatureCard.astro`, `GuideCard.astro` - Content cards
- `Terminal.astro`, `TerminalBlock.astro` - Terminal/code display components
- `AgentCallout.astro` - Special callout component
- `Head.astro` - Shared head for custom pages. Resolves the stored or OS theme
  before paint and defines the custom-route tokens (`--page-bg`, `--accent`,
  `--text-*`, `--border-*`, `--surface-bg*`) for light and dark. Custom pages
  style themselves with these tokens; do not add fixed hex colors to them.
- `StarlightHead.astro`, `StarlightPageTitle.astro`, `Sidebar.astro`,
  `ThemeSelect.astro` - Starlight component overrides (see `astro.config.mjs`)

### Starlight Configuration

Configured in `astro.config.mjs`:
- Title: "agents.cli"
- Blog authors defined in config (sourabh, sanjay)
- Sidebar organized as topics (Courses, Playbooks, Foundations) via
  starlight-sidebar-topics
- Fonts are self-hosted through Fontsource: `src/styles/fonts.css` for the
  Starlight routes, `src/styles/fonts-editorial.css` for the custom routes

### Deployment

The project uses Cloudflare Workers via `wrangler.toml`:
- Assets served from `./dist` directory
- HTML handling forces trailing slashes
- Compatibility date: 2026-03-06

### Theming

One warm palette with an oxblood accent, light and dark, on every surface:
- `src/styles/theme.css` sets the Starlight tokens (`--sl-*`, `--ac-*`) for
  light (`:root`) and dark (`[data-theme='dark']`). Applied through
  `customCss` in `astro.config.mjs`.
- `src/components/Head.astro` sets the equivalent tokens for the custom routes.
  `src/styles/blog-post.css` and `src/styles/widget-standalone.css` carry
  copies of the same values. When a value changes in theme.css, change it in
  all three.
- Light: paper `#fcfbf7`, ink `#17160f`, accent `#9c2f27`. Dark: page
  `#191a1f`, ink `#ece7dd`, accent `#d68a72`.
- Purple (`#7c69f7`) is retired from the UI. It survives only as the agent
  character in hero images and the dot in the logo.

## Key Patterns

### Adding New Documentation

1. Create `.md` or `.mdx` files in `src/content/docs/`
2. Routes are auto-generated based on file path
3. For sidebar inclusion, add entry to `sidebar` array in `astro.config.mjs`

### Adding Blog Posts

1. Create `.mdx` files in `src/content/docs/blog/`
2. Use frontmatter with blog schema fields
3. Reference existing authors (`sourabh`, `sanjay`) or add new ones in `astro.config.mjs`

### Typography System

- **Source Serif 4 Variable** - Reading face for body prose on blog posts,
  Foundations and Courses. Loaded with the optical size axis
  (`font-optical-sizing: auto`) and antialiased smoothing. That pairing is
  what keeps the strokes light at 18-20px; do not swap in the static cuts.
- **Space Grotesk** - Sans for headings, sidebar, tabs, nav and UI
- **Fira Code** - Monospace (code, terminal, eyebrow labels)
- **Instrument Serif** - Homepage hero italic only
- **Plus Jakarta Sans**, **Geist Mono** - Blog listing and cards only

### Custom Homepage

The homepage (`src/pages/index.astro`) is a **custom page**, not a Starlight page. It has its own styling and component structure independent of Starlight's theming.
