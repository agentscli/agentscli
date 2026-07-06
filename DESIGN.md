# Design

> Captured from the shipped system (`src/styles/theme.css`, `astro.config.mjs`) on 2026-07-05.
> This is a **mature, committed identity** — treat it as source of truth, not a starting palette.
> Regenerate with `/impeccable document` after any theme-token change.

## Theme

Dual-theme (`:root` = light default, `[data-theme='dark']` = dark), toggled from the header.
Light is a near-white canvas (`#fafafa`) with a faint purple grid; dark is a deep near-black
plum (`#0a0910`). The brand reads the same in both: a single electric-purple accent on a quiet
neutral field, monospace for structure, sans for prose. **Color strategy: Restrained** — one
saturated accent (~5–10% of surface) over tinted neutrals. The purple is voice; everything else
recedes so code, widgets, and the agent character stand out.

Both themes are first-class and must stay AA-legible. Marketing/homepage and legacy blog CSS
carry some hardcoded dark values (known debt) — new work uses tokens, not literals.

## Color

All colors are CSS custom properties in `theme.css`. Starlight's semantic tokens are remapped so
`--sl-color-white` = highest-contrast *text* and `--sl-color-black` = page *background* (inverted
from their names — read carefully).

### Brand accent (purple — the only saturated hue)

| Role | Light | Dark |
| --- | --- | --- |
| Accent (links, active) | `#6b58e6` | `#7c69f7` |
| Accent-high (hover) | `#5848d0` | `#8b7bf7` |
| Accent-low (tint bg) | `rgba(107,88,230,0.10)` | `rgba(124,105,247,0.15)` |
| Bright glow (scrollbar/agent) | `#a78bfa` / `rgba(124,105,247,…)` | same |
| Text on accent | `#ffffff` | `#ffffff` |

`#7c69f7` is the canonical brand purple and the exact color of the **agent character's glow** in
hero imagery. The light theme deliberately darkens to `#6b58e6` for AA contrast on `#fafafa`.

### Neutrals & surfaces

| Role | Light | Dark |
| --- | --- | --- |
| Page bg | `#fafafa` | `#0a0910` |
| Nav / sidebar bg | `rgba(250,250,250,0.95)` | `rgba(10,9,16,0.95)` |
| Highest-contrast text (`white`) | `#0a0910` | `#ffffff` |
| Body text | `#1f2937` | `#cbd5e1` |
| Muted text (gray-2) | `#475569` | `#94a3b8` |
| Hairline border | `rgba(10,9,16,0.08)` | `rgba(255,255,255,0.08)` |
| Surface / surface-hover | `rgba(10,9,16,0.02 / 0.05)` | `rgba(255,255,255,0.02 / 0.05)` |
| Code block bg | `#f6f8fa` → frame `#ffffff`/`#fbfbff` | `#24233b` → frame `#171521`/`#0f0d16` |

Custom `--ac-*` tokens carry agentscli-specific surfaces (accent tints, grid line, scrollbar
gradient, code-frame treatment). Prefer these over inventing new values.

### Grid canvas

`body` has a two-axis linear-gradient grid at `40px` cells using `--ac-grid-line`
(`rgba(107/124,…,0.04–0.05)`) — a faint blueprint texture behind every page. Part of the brand;
keep it subtle enough not to fight body text.

### Contrast contract

Body ≥4.5:1 and large text ≥3:1 in **both** themes. Placeholders held to body contrast (not the
default muted gray). If a new tint is close to failing, push toward the ink end of the ramp.

## Typography

Three families, loaded from Google Fonts (`Fira Code` 400/500/600, `Instrument Serif` roman+italic,
`Space Grotesk` 400/500/600/700). Paired on a contrast axis (mono + geometric sans + serif accent),
never two similar families.

| Family | Role |
| --- | --- |
| **Fira Code** (mono) | Structure & identity: `h1`, all headings via `--sl-font-heading`, site title, card titles, nav labels, code, terminals. The "made-by-hand / terminal" signal. |
| **Space Grotesk** (sans) | Body copy, `h2–h6`, UI text. The workhorse. `line-height: 1.7` on paragraphs. |
| **Instrument Serif** (serif, often italic) | *Restrained* accent only — hero subtitle, pull quotes. Never drop-caps or magazine broadsheet styling. |

- `h1`: Fira Code, `letter-spacing: -1px`. Headings use `text-wrap: balance` where added; long
  prose uses `text-wrap: pretty`.
- Display/hero clamp ceiling ≤ 6rem; letter-spacing floor ≥ -0.04em.
- Body measure capped ~65–75ch (`--sl-content-width: 54rem` main column).
- Light-on-dark text gets slightly looser line-height (already reflected in the 1.7 body rhythm).

## Layout & spacing

- **Radii:** small `4px`, medium `8px`. Cards, code frames, tables, pagination all use `8px`;
  inline code and small chips `4px`. No large pill-rounding on containers.
- **Nav height** `82px`; **sidebar** `280px`; **TOC** `240px`; **content** `54rem` (wider than
  Starlight's 45rem default so the reading column fills the space).
- **Header:** transparent with `backdrop-filter: blur(2px)`, hairline bottom border, `80px`
  side padding (`24px` on mobile).
- **Responsive band:** mobile layout held until `72rem` (the wide content column can't share a row
  with the sidebar sooner) — full-width content + hamburger below that. See the commented block in
  `theme.css`; don't naively revert to Starlight's 50rem breakpoint.
- Cards used sparingly (surface tint + hairline + `translateY(-2px)` hover lift). Grid gap `16px`.
  No nested cards, no side-stripe borders.

## Components (signature treatments)

- **Code frames (Expressive Code):** the premium detail — a faux-macOS window. `42px` title bar,
  three traffic-light dots (`#ff605c`/`#ffbd44`/`#00ca4e`), filename in the header, theme-aware
  frame bg + shadow, hover lift. This is a recognizable brand element; preserve it.
- **Scrollbar — "Metro Gradient Trail":** custom 8px webkit scrollbar with a purple
  transparent→bright→transparent gradient thumb; brightens on hover. Firefox fallback via
  `scrollbar-color`. `scrollbar-gutter: stable`.
- **Sidebar active link:** accent text + `--sl-color-accent-low` bg + `inset 2px 0 0` accent bar.
- **Tables:** block-scroll on overflow, hairline border, accent-tinted `th`, row hover tint.
- **Blockquotes:** accent left-border + `--ac-accent-soft` bg.
- **Interactive widgets** (`src/components/interactive/`, `src/styles/widget-standalone.css`):
  first-class, one-per-page floor. Genres vary deliberately (toggle+ledger, scripted terminal
  replay / TrScript, meters). Each must honor reduced-motion and be keyboard-operable.

## Motion

- Standard transition: `0.2s ease` on color/background/border/shadow/transform. Cards lift 2px;
  code frames deepen shadow on hover.
- Ease-out (exponential) for entrances; no bounce/elastic. Reveals enhance already-visible content
  (never gate visibility on a class transition — headless renders must not ship blank).
- **`prefers-reduced-motion: reduce` is a hard gate.** `theme.css` already zeroes transitions on
  cards, code frames, sidebar links, and links under reduced motion; every new animation/widget
  ships an equivalent crossfade-or-instant fallback.

## Iconography & imagery

- **The agent character:** a small, featureless humanoid of soft glowing electric-purple light
  (`#7c69f7`), always in an active pose, recurring in every blog hero. The publication's Houston.
- **Hero scenes:** photographic editorial still-life on a worn oak desk, warm tungsten side-light,
  shallow DoF; a tangible object encodes the post's thesis; purple is the only saturated color in
  frame (emitted by the agent). Do **not** revert to abstract thin-line minimalism.
- Assets live in-repo under `src/assets/blog/<slug>/`, served through Astro `<Image>` (WebP/AVIF +
  responsive). Default social card `og-default.png`; blog posts set per-post heroes.
- Logo: `logo-light.png` / `logo-dark.svg`, `replacesTitle`. Favicon `favicon.svg`.
