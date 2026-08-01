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
- `Header.astro`, `Footer.astro` - Site-wide navigation
- `FeatureCard.astro`, `GuideCard.astro` - Content cards
- `Terminal.astro`, `TerminalBlock.astro` - Terminal/code display components
- `BlogPost.astro`, `BlogLayout.astro`, `RelatedPosts.astro` - Blog-specific components
- `AgentCallout.astro` - Special callout component
- `Head.astro` - Shared head for custom pages; also carries the theme-var
  `!important` override layer that makes the homepage and blog honor the
  light/dark toggle (the scoped styles in those pages are dark-hardcoded)

### Starlight Configuration

Configured in `astro.config.mjs`:
- Title: "agents.cli"
- Blog authors defined in config (sourabh, sanjay)
- Sidebar organized as topics (Courses, Foundations) via starlight-sidebar-topics
- Custom fonts: Fira Code (mono), Instrument Serif (serif), Space Grotesk (sans)

### Deployment

The project uses Cloudflare Workers via `wrangler.toml`:
- Assets served from `./dist` directory
- HTML handling forces trailing slashes
- Compatibility date: 2026-03-06

### Theming

The site uses a custom dark/purple theme via `src/styles/theme.css`:
- Overrides Starlight's default CSS custom properties for colors, fonts, and spacing
- Applied globally via `customCss` in `astro.config.mjs`
- All Starlight pages (docs, blog) inherit this theme automatically
- Custom homepage (`src/pages/index.astro`) uses scoped styles plus the
  theme-var override layer in `src/components/Head.astro`

**Theme colors**: Primary purple (#7c69f7), dark background (#0a0910)
**Fonts**: Fira Code (mono), Space Grotesk (sans), Instrument Serif (serif)

## Key Patterns

### Adding New Documentation

1. Create `.md` or `.mdx` files in `src/content/docs/`
2. Routes are auto-generated based on file path
3. For sidebar inclusion, add entry to `sidebar` array in `astro.config.mjs`

### Adding Blog Posts

1. Create `.mdx` files in `src/content/docs/blog/`
2. Use frontmatter with blog schema fields
3. Reference existing authors (james, elena, marcus) or add new ones in `astro.config.mjs`

### Typography System

The site uses three custom fonts:
- **Fira Code** - Monospace (terminal, code, navigation labels)
- **Instrument Serif** - Serif italic (hero subtitle, quotes)
- **Space Grotesk** - Sans-serif (body, headings)

### Custom Homepage

The homepage (`src/pages/index.astro`) is a **custom page**, not a Starlight page. It has its own styling and component structure independent of Starlight's theming.
