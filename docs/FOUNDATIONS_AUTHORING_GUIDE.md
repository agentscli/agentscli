# Foundations Authoring Guide

Conventions for adding a new chapter to `/foundations/`, or substantially reshaping an existing one. This is the canonical reference; the `write-foundations-chapter` skill points here.

> **Revision note (2026-07-26).** This guide was rewritten after a section-wide audit found it describing a section that no longer existed: it prescribed headings no chapter used, listed three tools when six shipped, never mentioned the interactive widgets that open most pages, and named exemplars whose shape had changed. The cardinal rule was also inverted - see "The frame is deliberate" below. Where this guide contradicts what it said before 2026-07-26, this version wins.

## What foundations is (and isn't)

Foundations is the **ingredients** surface - spec-level reference for each primitive:

- **Spec-shaped, reference-shaped, slightly dry by design.** Narrative voice is the blog's job, not foundations'.
- **Ingredients, not recipes.** Each chapter explains *one primitive* (rules, skills, subagents, hooks, …) across multiple tools. Stories about *combining* primitives belong on the blog.
- **Concept-axis, not tool-axis.** Every chapter takes one concept and compares the tools in scope along that single axis.
- **Tied to the context-engineering thesis.** A reader should close each chapter with one more answer to: *what does the agent see, and at what cost?*

## The frame is deliberate. The middle is earned. Scaffold is banned.

This replaces the old "cardinal rule: no rigid template," which the section had already stopped following - and was right to.

Foundations is a **reference** surface. A reader comparing Codex across six chapters navigates by landmark, and landmarks only work if they sit in the same place every time. So the shared frame is not drift; it is the product. Keep it:

- the opening scenario, unheaded
- `## How it works in each tool` immediately above `<ToolTabs />` - byte-identical across chapters on purpose
- `## Comparison`
- `<UpstreamRefs />`

What is banned is **scaffold**: a section that exists because its siblings have one, whose content is thin, generic, or restates a table already on the page. The audit found five recurring species. Do not write these, and delete them where they appear:

1. **The per-tool roll-call intro.** A paragraph that walks the six tools in prose, immediately above a Comparison table that says the same thing in grid form. Keep the one *consequence* sentence the roll-call was building toward; delete the enumeration.
2. **A one-bullet `## Name collisions`** that restates a Comparison row. This section is for genuine cross-tool word collisions. If a chapter has none, it does not get the heading. Do not invent one for symmetry.
3. **`## Tips`** and any other catch-all bucket. If a tip is real, it belongs in the tool tab or as a Comparison footnote. If it needed a bucket, it was scaffold.
4. **The stamped opener.** `That's the gap X closes` appeared verbatim in 12 of 14 chapters. Write the sentence the chapter needs; do not run the template phrase.
5. **Restating a fact a third time.** Once in prose, once in a table, once in Name collisions is the pattern to watch for. One full-length home per fact; the others link or drop.

The test for any section: could you paste it onto a sibling chapter, swap the nouns, and have nobody notice? If yes, it is scaffold, whatever its heading says.

## The soft frame (what every chapter carries)

- **Frontmatter:** `title` + `description`. The description should hint at the gap the primitive closes. Keep tool counts out of it unless you plan to maintain them - three descriptions said "three tools" long after six shipped.
- **Front of the page:** unheaded prose, in this order - a concrete scenario the reader recognises, the gap it exposes, then the definition. Hook first, definition second; this was validated by a real target-persona reader test. Follow it with a bulleted list of concrete things teams put in this primitive, and a one-line `The test:` heuristic.
  - **Keep that whole run above the first `##`.** In five chapters the examples list and `The test:` line drifted *underneath* the widget's heading, so a reader scanning the table of contents finds the chapter's canonical use cases filed under something like "Explore the config surface." That is a mis-nesting bug, not a style choice.
- **Per-tool detail:** `## How it works in each tool` + `<ToolTabs chapter="<chapter>" />`, backed by one `.mdx` per tool in `src/content/tool-instructions/<tool-slug>/<chapter>.mdx`.
  - Exception: `how-agents-work` is the substrate chapter and has no per-tool axis. It carries no ToolTabs, no Comparison, and no Name collisions, and that is correct. It is the only chapter allowed to sit outside the frame.
- **Back of the page:** `## Comparison` table; `## Name collisions` where genuine collisions exist; `<UpstreamRefs />` linking each tool's canonical doc. UpstreamRefs must list **all six** tools.

## What varies (the middle - earn it)

Pick the form the concept actually needs:

- **A diagram** - when the concept is structural (context isolation, client/server protocols, lifecycle timing). Use the `<FlowDiagram>` and `<StackDiagram>` components. See: `how-agents-work`, `subagents`, `hooks`, `mcp-servers`, `context-management`.
- **A worked example** - when the value only shows in a sequence. Show the same task with and without the primitive. See: `subagents` (debug with vs without), `hooks` (push-to-main blocked).
- **A lossy-transform section** - when the reader's default mental model is wrong about what survives an operation. See: `context-management` ("What compaction keeps, and what it drops").
- **A cross-tool-standard callout** - when the format has actually converged. See: `skills` ("The cross-tool standard").
- **A translation block** - when readers arrive with an intent rather than a term. See: `permissions` ("Translation: make it stop asking").
- **A "when this matters" / decision matrix** - when the tools genuinely diverge on capability. See: `model-selection`.
- **A resolution-order section placed *after* the tabs** - when the ordering only makes sense once the reader has seen per-tool paths. See: `rules` ("Which files load, and in what order").

If a chapter doesn't need any of these, don't pad. A short, dense chapter beats a padded one. **Don't add a section to match other chapters - add it because the concept requires it.**

## Interactive widgets

Most chapters carry one React widget. It is a first-class convention, not decoration, and this guide used to be silent about the element a reader meets first.

- **The register is `src/components/interactive/WIDGETS.md`.** Read it before building one. Adding a widget without adding its register row is an incomplete change.
- **Placement:** the widget is the hook. It sits at the **end of the first framing section**, after the scenario, the examples list, and the `The test:` line - not in the middle of them, and not below the ToolTabs. A widget heading arriving before the framing is finished orphans everything under it.
- **Give the heading a noun.** "Anatomy of a skill" and "Every event, per tool" tell a scanner something. "Ship the setup," "Walk the posture," and "Build the invocation" are interchangeable and teach nothing from the table of contents.
- **Vary the genre.** Ten of sixteen foundations widgets open with a tool-selector tab row that renders that tool's static panel. That formula is at saturation. A widget offering no decision the ToolTabs block below it doesn't already offer is not earning its place.
- **Cover all six tools,** or record in the register why not. Several widgets are hardcoded to five tools and one to three, on chapters whose tables run six wide.
- **Theme:** use CSS custom properties, not hardcoded colors, or the light/dark toggle breaks. Prefix every class with the widget's own short slug; two widgets currently share the `ppk-` namespace, which is the bug this rule prevents.

## Context-cost tie-back

Where it lands naturally, link back to the three cost profiles in `how-agents-work`:

- **Always-loaded** (rules, tool defs, skill descriptions)
- **On-demand** (skill bodies, lazy MCP schemas)
- **Isolated** (subagents, discarded plan-mode contexts)

One sentence, linked. **Do not add a `## Context cost` section header to any chapter.** This rule is being followed cleanly; keep it that way.

## Tool scope

- **In scope, fully integrated (six):** Claude Code, Codex, OpenCode, Cursor, Copilot, Pi. All six have a complete set of per-tool files for every chapter.
- **Out of scope:** Aider, Gemini CLI, others. Do not add new tools to scope without explicit user buy-in.
- The tool roster lives in `src/data/tools.ts` (display label + slug) and is the source of truth. Per-tool detail files must exist for every tool listed there, or the tab silently vanishes - `ToolTabs.astro` filters missing files out with no build error.

## File layout

```
src/content/docs/foundations/<slug>.mdx           ← chapter prose
src/content/tool-instructions/<tool>/<slug>.mdx   ← per-tool detail, one per tool (six)
src/components/interactive/<Widget>.tsx           ← widget, plus its -data.ts and .css
src/components/interactive/WIDGETS.md             ← widget register (add a row)
astro.config.mjs                                  ← sidebar registration
src/data/tools.ts                                 ← tool roster (rarely changes)
```

Imports a chapter `.mdx` typically uses:

```astro
import ToolTabs from '../../../components/ToolTabs.astro';
import UpstreamRefs from '../../../components/UpstreamRefs.astro';
import SomeWidget from '../../../components/interactive/SomeWidget.tsx';
```

Plus `FlowDiagram` or `StackDiagram` where the concept is structural.

Per-tool detail files are plain Markdown bodies - no frontmatter, no imports, no headings. The house convention inside a tab is a bold run-in label (`**Locations:**`, `**Configuration:**`, `**Invocation:**`). They render inside `<TabItem>`.

**Aim for ~150-250 words each, and treat the floor as the harder constraint.** Roughly half the corpus sits under 150 words, and the short ones are short because they stop at paths and syntax. Every tab should carry at least one **gotcha** - the failure mode, the silent-ignore, the version gate, the thing that wastes an afternoon. If a sibling tab in the same chapter has one and yours doesn't, yours is unfinished.

**Handle absences honestly, then route the reader.** Where a tool genuinely lacks a primitive, say so plainly and follow with what to do instead. The Pi tabs are the model: `pi/mcp-servers.mdx` states the gap, gives three substitutes, and names the tradeoff to weigh. A tab that says "not supported" and stops has stranded the one reader who most needed help.

## Voice & no-go rules

- **No em dashes or en dashes, ever.** Use ` - `. This includes numeric ranges and code-adjacent prose. Note that `.claude/` is gitignored, so repo-wide sweeps do not reach the skill files - check those by hand.
- **No emojis** unless explicitly requested.
- **No citations to courses, podcasts, lectures, or transcripts.** Output stands on its own authority.
- **No drift from the context-engineering thesis.** Each chapter should leave a reader with one new lever on what-the-agent-sees.
- **Flag unverified claims** inline as `*Unverified*` italics, in exactly that form - a lowercase "unverified" buried in a sentence defeats the grep that audits this. If a claim is hedged in prose ("community reports note", "in some builds", "historically"), it needs the marker too.
- **Date perishable claims.** Version numbers, "preview", "deprecated", "experimental", pinned upstream issue numbers, model IDs and prices all rot. Stamp them (`as of 2026-07`) so the next reader knows the age of what they're trusting, and add them to the foundations staleness register kept with the project's research notes (outside this repo).
- **Hyperlinks** to other foundations chapters use the `/foundations/<slug>/` form (trailing slash, no `.mdx`).
- **Keep chapters focused on the primitive.** A chapter explains one primitive across tools - it shouldn't editorialize about how the broader site fits together. Chapters reference primitives, not surfaces.

## Workflow for a new chapter

1. **Read `how-agents-work`** - it's the substrate every other chapter assumes.
2. **Skim two or three existing chapters** with shape similar to what you're planning (structural concept: `subagents`, `mcp-servers`; decision-shaped: `model-selection`, `permissions`).
3. **Sketch the unique middle** before writing prose. Diagram? Walkthrough? Matrix? Nothing? Decide first.
4. **Write the chapter prose** (`src/content/docs/foundations/<slug>.mdx`).
5. **Write the per-tool detail files** - one per tool in `src/data/tools.ts`. All six.
6. **Build the widget** if the concept has a decision worth making interactive, and **add its row to `WIDGETS.md`**.
7. **Wire the entry points:** register the chapter in the `astro.config.mjs` sidebar, add a row to the `foundations/index.mdx` translation table, and add an entry to `primitive-picker-data.ts` so the problem-first chooser can reach it. All three, or the chapter is orphaned from one of them - `context-management` shipped missing two.
8. **Build:** `npx astro build` - must pass clean. (`pnpm` isn't on PATH; use `npx astro`.)
9. **Run the form gates:** `.claude/skills/reform-section/check.sh src/content/docs/foundations`. Hard gates are zero paragraphs over 90 words and zero em/en dashes. Read the SOFT "shared phrases" block too - anything appearing on 3+ pages is scaffold.
10. **Self-check:** would a reader who's never seen this primitive close the chapter with a usable mental model? If they'd still need the upstream doc to be productive, the chapter isn't done.

## Reference exemplars

- **`how-agents-work`** - substrate chapter; the loop, the window, the session boundary. The only chapter outside the frame, and the model for a tool-agnostic concept page.
- **`hooks`** - the best pairing of two devices in the section: a lifecycle timeline and a walked-through gate (`git push origin main` blocked) that carry genuinely different payloads.
- **`context-management`** - the "what compaction keeps and drops" section is content no table could hold. It also carries the only explicit chapter-boundary statement in foundations, which is why it doesn't read as a rerun of `how-agents-work`. Borrow that move.
- **`subagents`** - `<StackDiagram>` of parent vs subagent window, plus a worked example showing with and without.
- **`rules`** - resolution-order section placed *after* the tabs, which is unusual and correct.
- **`permissions`** - the "Translation: make it stop asking" table, for readers who arrive with an intent and not a term.
- **`mcp-servers`** - protocol and client/server picture before per-tool detail.
- **`configuration`** - the 2026-07-26 form pass exemplar: scaffold removed, precedence made the earned middle. Read it against its own git history to see what the scaffold list above looks like in practice.

When in doubt about shape, study which of these your concept most resembles and borrow its structure - not its section names.
