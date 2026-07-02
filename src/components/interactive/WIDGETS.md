# Interactive widget register

Every interactive component on the site, what page embeds it, where its facts
come from, and when those facts were last verified against the source content.

**Review cadence: monthly.** For each *fact-bound* widget, re-read its source
chapters (listed below) and confirm the widget's data file still matches; bump
the date. *Evergreen* widgets encode concepts, not vendor behavior — check them
only when the underlying mental model changes (window sizes, loop shape).

Conventions (all widgets follow these):

- `WidgetName.tsx` + `widget-name-data.ts` (facts + sync header) + `widget-name.css` (prefixed classes)
- Embedded with `client:visible`; root div has `not-content`
- Theme-aware via Starlight tokens + `--ac-*` site tokens; verified light and dark

## Fact-bound — drift when tool docs change; review monthly

| Widget | Page | Source of truth | Last verified |
|---|---|---|---|
| `RulesResolver` | `foundations/rules.mdx` | `tool-instructions/<tool>/rules.mdx` | 2026-07-02 |
| `ConfigExplorer` | `foundations/configuration.mdx` | `tool-instructions/<tool>/*.mdx` (config surfaces) | 2026-07-02 |
| `HookTimeline` | `foundations/hooks.mdx` | `tool-instructions/<tool>/hooks.mdx` | 2026-07-02 |
| `PermissionSim` | `foundations/permissions.mdx` | `tool-instructions/<tool>/permissions.mdx` | 2026-07-02 |
| `PlanModeStepper` | `foundations/plan-mode.mdx` | `tool-instructions/<tool>/plan-mode.mdx` | 2026-07-02 |
| `HeadlessBuilder` | `foundations/headless.mdx` | `tool-instructions/<tool>/headless.mdx` | 2026-07-02 |
| `SkillAnatomy` | `foundations/skills.mdx` | `tool-instructions/<tool>/skills.mdx` + cross-tool table in `foundations/skills.mdx` | 2026-07-02 |
| `PrimitivePicker` | `foundations/index.mdx` | the "Why this and not…" tables across foundations chapters | 2026-07-02 |
| `ModelMatcher` | `foundations/model-selection.mdx` | `tool-instructions/<tool>/model-selection.mdx` | 2026-07-02 |
| `CommandExpander` | `foundations/slash-commands.mdx` | `tool-instructions/<tool>/slash-commands.mdx` | 2026-07-02 |
| `PluginPacker` | `foundations/plugins.mdx` | `tool-instructions/<tool>/plugins.mdx` | 2026-07-02 |

## Evergreen — concept-only, no vendor facts

| Widget | Pages | Encodes |
|---|---|---|
| `LoopStepper` | `foundations/how-agents-work.mdx`, `course/claude-code/getting-started/first-change.mdx` | the agentic loop (decide → tool → result), illustrative bug-fix trace |
| `ContextSimulator` | `foundations/context-management.mdx`, `course/claude-code/sessions-context/inspect.mdx` | a long session against a 200k window; illustrative token magnitudes |
| `McpCostMeter` | `foundations/mcp-servers.mdx` | context cost of mounted servers; order-of-magnitude schema sizes |
| `SubagentFanout` | `foundations/subagents.mdx`, `course/claude-code/subagents/fan-out.mdx` | inline vs delegated fan-out; window/overhead consistent with `context-sim-data.ts` |

Course rule: only **evergreen** widgets embed in course lessons — the five-tool
comparative widgets would break the single-tool book narrative. Embed at the
story beat where the lesson hits the concept, with a prose bridge, never as a
templated section.

## Adding a widget

1. Follow the file conventions above; put the keep-in-sync header in the data file naming its source chapters.
2. Data strings render through `withCode()` — backticked spans become `<code>`; no `**bold**`/`*italic*` markdown.
3. Verify in the browser, light and dark, before committing.
4. Add a row to the right table here with today's date.
