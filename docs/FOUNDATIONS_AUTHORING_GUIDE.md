# Foundations Authoring Guide

Conventions for adding a new chapter to `/foundations/`, or substantially reshaping an existing one. This is the canonical reference; the `write-foundations-chapter` skill points here.

## What foundations is (and isn't)

Foundations is the **ingredients** surface — spec-level reference for each primitive:

- **Spec-shaped, reference-shaped, slightly dry by design.** Narrative voice is the blog's job, not foundations'.
- **Ingredients, not recipes.** Each chapter explains *one primitive* (rules, skills, subagents, hooks, …) across multiple tools. Stories about *combining* primitives belong on the blog.
- **Concept-axis, not tool-axis.** Every chapter takes one concept and compares the tools in scope along that single axis.
- **Tied to the context-engineering thesis.** A reader should close each chapter with one more answer to: *what does the agent see, and at what cost?*

## The cardinal rule: no rigid template

Each chapter is shaped by what the **concept** needs, not by a uniform section spine. Chapters that flatten are the ones forced into a fixed template. Some current chapters intentionally break the template — and they read better for it. Treat that as the model, not the exception.

## What stays consistent (the soft frame)

These pieces *every* chapter has, because they carry weight regardless of concept:

- **Frontmatter:** `title` + `description`. The description should hint at the gap the primitive closes; tie to the context-engineering thesis when it lands naturally.
- **Front of the page:** `## What X is` + `## Why you'd want one`. Open with a real-world scenario; close the gap; give a bulleted list of concrete things teams put in this primitive; end with a one-line "the test" heuristic.
- **Per-tool detail:** `<ToolTabs chapter="<chapter>" />` block. Backed by one `.mdx` per tool in `src/content/tool-instructions/<tool-slug>/<chapter>.mdx`.
- **Back of the page:** `## Comparison` table; `## Name collisions` (only where genuine collisions exist — don't invent them); `<UpstreamRefs />` block linking each tool's canonical doc.

## What varies (the middle — earn it)

The middle is where each chapter earns its shape. Pick the form that the concept actually needs:

- **A diagram** — when the concept is structural (context isolation, client/server protocols, lifecycle timing). ASCII in `text` code fences for now; we may upgrade to SVG later. See: `how-agents-work`, `subagents`, `hooks`, `mcp-servers`.
- **A worked example** — when the value only shows in a sequence (delegation, gating, multi-step). Show the same task with and without the primitive. See: `subagents` (debug-with-vs-without), `hooks` (push-to-main blocked).
- **A cross-tool-standard callout** — when the format has actually converged across tools. See: `skills` ("The cross-tool standard"), `rules` (AGENTS.md framing).
- **A translation block** — when readers need to map a goal to per-tool actions. See: `permissions` ("Translation: make it stop asking").
- **A "when this matters" / decision matrix** — when the tools genuinely diverge on capability. See: `plan-mode`, `plugins`.

If a chapter doesn't need any of these, don't pad. A short, dense chapter beats a padded one. **Don't add a section to match other chapters — add it because the concept requires it.**

## Context-cost tie-back

Where it lands naturally, link back to the three cost profiles in [`how-agents-work`](../src/content/docs/foundations/how-agents-work.mdx):

- **Always-loaded** (rules, tool defs, skill descriptions)
- **On-demand** (skill bodies, lazy MCP schemas)
- **Isolated** (subagents, discarded plan-mode contexts)

One sentence is usually enough. **Do not add a `## Context cost` section header to every chapter.** That's the kind of rigid templating this guide exists to prevent.

## Tool scope

- **Currently in scope:** Claude Code, Codex, opencode.
- **Future-approved (not yet integrated everywhere):** Cursor, Copilot. When adding either to an existing chapter, follow the per-tool detail pattern; ensure ToolTabs renders the new tab.
- **Out of scope:** Aider, Gemini CLI, others. Do not add new tools to scope without explicit user buy-in.
- The tool list lives in `src/data/tools.ts` (display label + slug). Per-tool detail files must exist for every tool listed there, or the tab won't render.

## File layout

```
src/content/docs/foundations/<slug>.mdx           ← chapter prose
src/content/tool-instructions/<tool>/<slug>.mdx   ← per-tool detail, one per tool
astro.config.mjs                                  ← sidebar registration
src/data/tools.ts                                 ← tool roster (rarely changes)
```

Imports the chapter `.mdx` always uses:

```astro
import ToolTabs from '../../../components/ToolTabs.astro';
import UpstreamRefs from '../../../components/UpstreamRefs.astro';
```

Per-tool detail files are plain Markdown bodies — no frontmatter, no imports. They're rendered inside `<TabItem>` by the `ToolTabs` component. Keep each ~150–250 words: paths, syntax, the one or two gotchas that matter, real frontmatter snippets where helpful.

## Voice & no-go rules

- **No emojis** unless explicitly requested.
- **No citations to courses, podcasts, lectures, or transcripts.** Output stands on its own authority.
- **No drift from the context-engineering thesis.** Each chapter should leave a reader with one new lever on what-the-agent-sees.
- **Flag unverified claims** inline as `*Unverified*` italics. Existing chapters do this — match that pattern rather than asserting.
- **Diagrams:** ASCII in `text` code fences. We may upgrade to SVG with the project's purple-agent visual brand later; until then, ASCII is the canon.
- **Hyperlinks** to other foundations chapters use the `/foundations/<slug>/` form (trailing slash, no `.mdx`).
- **Keep chapters focused on the primitive.** A chapter explains one primitive across tools — it shouldn't editorialize about how the broader site fits together. Chapters reference primitives, not surfaces.

## Workflow for a new chapter

1. **Read [`how-agents-work`](../src/content/docs/foundations/how-agents-work.mdx)** — it's the substrate every other chapter assumes.
2. **Skim two or three existing chapters** with shape similar to what you're planning (e.g. for a structural concept, look at `subagents` and `mcp-servers`; for a decision-shaped concept, look at `model-selection` and `permissions`).
3. **Sketch the unique middle** before writing prose. What does this concept *need* that the soft frame can't carry? Diagram? Walkthrough? Matrix? Nothing? Decide first.
4. **Write the chapter prose** (`src/content/docs/foundations/<slug>.mdx`).
5. **Write the per-tool detail files** (one per tool in `src/data/tools.ts`).
6. **Register the chapter** in `astro.config.mjs` sidebar.
7. **Build:** `npx astro build` — must pass clean. (`pnpm` isn't on PATH; use `npx astro`.)
8. **Self-check:** would a reader who's never seen this primitive close the chapter with a usable mental model? If they'd still need to read the upstream doc to be productive, the chapter isn't done.

## Reference exemplars

- **`how-agents-work`** — substrate chapter; the loop + context window. The model for "tool-agnostic concept page."
- **`subagents`** — concept-led ASCII diagram (parent vs subagent context window) + worked example showing with/without.
- **`hooks`** — lifecycle timeline diagram + walked-through gate (`git push origin main` blocked).
- **`mcp-servers`** — protocol/client/server picture before per-tool detail.
- **`skills`** — cross-tool-standard callout intentionally breaks the soft frame.
- **`permissions`** — "Translation: make it stop asking" table breaks the soft frame.
- **`rules`** — comparison-table-heavy because the AGENTS.md standard *is* the story. Different shape, still working.

When in doubt about shape, study which of these your concept most resembles and borrow its structure.
