# Interactive widget register

Every interactive component on the site, what page embeds it, where its facts
come from, and when those facts were last verified against the source content.

**Review cadence: monthly.** For each *fact-bound* widget, re-read its source
chapters (listed below) and confirm the widget's data file still matches; bump
the date. *Evergreen* widgets encode concepts, not vendor behavior — check them
only when the underlying mental model changes (window sizes, loop shape).

Conventions (all widgets follow these):

- `WidgetName.tsx` + `widget-name-data.ts` (facts + sync header) + `widget-name.css` (prefixed classes)
- Embedded with `client:visible`; root div gets its classes from
  `useWidgetFrame('xxx-root')` (adds `not-content` plus the shared "agent
  trace" affordance — an accent comet around the border on first
  scroll-into-view, repeating every 10s, faint accent border tint / on hover; see
  `widget-frame.tsx` / `widget-frame.css`)
- Theme-aware via Starlight tokens + `--ac-*` site tokens; verified light and dark
- Placement (foundations): the widget is the hook — it sits at the end of the
  first framing section, after one or two sentences of setup, not below the
  ToolTabs. Course placement stays at the story beat (see course rule below).

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
| `LoopStepper` | `foundations/how-agents-work.mdx`, `course/claude-code/getting-started/first-change.mdx`, `course/codex/getting-started/the-loop.mdx`, `course/opencode/getting-started/the-loop.mdx`, `course/cursor/getting-started/the-loop/index.mdx` | the agentic loop (decide → tool → result), illustrative bug-fix trace |
| `ContextSimulator` | `foundations/context-management.mdx`, `course/claude-code/sessions-context/inspect.mdx`, `course/codex/sessions-context/status.mdx` | a long session against a 200k window; illustrative token magnitudes |
| `McpCostMeter` | `foundations/mcp-servers.mdx`, `course/claude-code/extending/mcp-connect.mdx`, `course/codex/extending/mcp-connect.mdx`, `course/copilot/extending/connect.mdx`, `course/opencode/extending/mcp-servers.mdx`, `course/cursor/extending/index.mdx` | context cost of mounted servers; order-of-magnitude schema sizes |
| `SubagentFanout` | `foundations/subagents.mdx`, `course/claude-code/subagents/fan-out.mdx`, `course/codex/subagents/fan-out.mdx`, `course/opencode/subagents/fan-out.mdx` | inline vs delegated fan-out; window/overhead consistent with `context-sim-data.ts` |
| `RuleEconomy` | `course/claude-code/rules-memory/good-rules.mdx`, `course/codex/rules/good-rules.mdx`, `course/copilot/rules/good-rules.mdx`, `course/opencode/rules-agents-md/first-agents-md.mdx`, `course/cursor/rules/index.mdx` | a rule is context paid once vs re-taught every session; toggle candidate lines, ledger decides which earn their slot |
| `AutonomyDial` | `course/claude-code/permissions-modes/modes-ladder.mdx`, `course/codex/approvals-sandbox/two-axis.mdx`, `course/copilot/permissions/match-to-stakes.mdx`, `course/opencode/permissions/agent-as-policy.mdx`, `course/cursor/permissions/index.mdx` | match autonomy to stakes: reversibility × blast radius picks a rung on a generic trust ladder; each lesson's prose maps rungs to the tool's modes |
| `SkillEconomy` | `course/claude-code/skills/vs.mdx`, `course/codex/skills/vs.mdx`, `course/copilot/prompt-files/vs-rules.mdx`, `course/opencode/skills/first-skill.mdx` | where a piece of knowledge lives decides when its tokens are paid: rule = full size every session, skill = stub always + body on invocation, prompt = re-paid every time; sequel to `RuleEconomy` |
| `ModelEconomy` | `course/claude-code/models-thinking/cost.mdx`, `course/codex/models-effort/cost-aware.mdx`, `course/copilot/models/credits.mdx`, `course/cursor/models/index.mdx`, `course/opencode/providers-models/per-agent-model.mdx` | model × effort as a per-task spend: matched corners on the diagonal, overpay leak on pinned-expensive, redo tax makes underpowering the hard task the costlier mistake; illustrative 5×/3× multipliers |

Course rule: only **evergreen** widgets embed in course lessons — the five-tool
comparative widgets would break the single-tool book narrative. Embed at the
story beat where the lesson hits the concept, with a prose bridge, never as a
templated section.

## Adding a widget

1. Follow the file conventions above; put the keep-in-sync header in the data file naming its source chapters.
2. Data strings render through `withCode()` — backticked spans become `<code>`; no `**bold**`/`*italic*` markdown.
3. Verify in the browser, light and dark, before committing.
4. Add a row to the right table here with today's date.
