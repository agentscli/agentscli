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
  Playbooks placement: end of the "How this works" block, before the numbered
  steps — the widget dramatizes the organizing constraint, never interrupts
  the procedure's spine. Playbooks are tool-agnostic, so only evergreen
  widgets belong there.
- Script-driven terminal scenes reuse the `terminal-replay.tsx` engine
  (+ `terminal-replay.css`): a scripted CLI session auto-plays in a fake
  terminal beside a live state panel (blocks + annotation, plus an optional
  capacity meter — in the panel or as a full-width top strip with a legend
  row), optionally pausing at one decision point that branches on the
  reader's choice. Block values and the meter are per-script optional, and
  scripts can define slot colors beyond the built-in a–f — so scenes that
  aren't about context length (or need a different palette) need no engine
  changes. Once playback pauses the transcript is inspectable both ways —
  hover/tap/focus a line to highlight the blocks its beat produced (and recall
  that beat's note), or a block to highlight its causing lines — derived from
  the beat structure, so scenes get it for free. A new scene is just a
  `<scene>-data.ts` exporting a `TrScript` plus a thin named wrapper component
  (what lessons import and this register lists) — no new interaction code.
  Scenes so far: `SessionXray` (top meter, token story), `ApprovalLedger`
  (no meter, custom slot palette — the non-token proof case), `NightShift`
  (no meter, custom slot palette; first scene converted *from* another genre —
  it replaced the VerifierLoop toggle-ledger widget at the automation beat),
  `SpecLock` (no meter, custom slot palette; first scene on the playbooks
  surface — the TDD quiet renegotiation).

Accessibility + interaction conventions (locked by the 2026-07-06 critique/fix
pass — new widgets follow these from day one):

- **Keyboard:** dense inspectable collections (transcript lines, block panels)
  are roving-tabindex composites — one Tab stop per group, arrows move within,
  Enter/Space pins, Escape exits. A widget's primary decision must be reachable
  in ≤4 Tabs from its first stop. Visible `:focus-visible` outline (accent, 2px)
  on every interactive element — never `outline: none` with only a tint.
- **Screen readers:** narrative widgets announce beats via a polite live region
  (the note line, not the char stream); decision bars are labelled `role="group"`
  regions and receive focus only on user-initiated playback. Visual-only hints
  get a non-visual equivalent (group `aria-label` or sr-only text).
- **Mobile:** ≥24px effective tap targets (padding/hit-area, not layout blowup);
  no "hover" in copy without "tap"; proportional bars whose segments can render
  <24px need an equivalent selector (e.g. legend chips as buttons).
- **Control naming:** playback widgets say `↺ replay`; stateful sims say `Reset`
  (quiet ghost pill, top-right, rendered only when state differs from default).
- **Choice architecture:** ≤4 visible options per decision point; bigger option
  sets get clustered/two-step flows (see `PrimitivePicker`).
- **No side-stripe accents** (`border-left` >1px on cards/callouts) — use a full
  accent border and/or semantic tint. Exempt idioms: code-diff gutters
  (`RulesResolver` added/removed lines), terminal-replay row markers, verdict
  tone markers inside terminal chrome.

## Fact-bound — drift when tool docs change; review monthly

| Widget | Page | Source of truth | Last verified |
|---|---|---|---|
| `RulesResolver` | `foundations/rules.mdx` | `tool-instructions/<tool>/rules.mdx` | 2026-07-02 |
| `ConfigExplorer` | `foundations/configuration.mdx`, `pages/index.astro` (homepage), plus one config-beat lesson per course, each opening on its own tool via `initialTool`: `course/claude-code/rules-memory/hierarchy.mdx`, `course/codex/rules/the-hierarchy.mdx`, `course/copilot/rules/hierarchy.mdx`, `course/cursor/extending/index.mdx`, `course/opencode/rules-agents-md/discovery-and-nesting.mdx`, `course/pi/models-config/config-files.mdx` | `tool-instructions/<tool>/*.mdx` (config surfaces); Pi tab: `course/pi/*` (no tool-instructions dir) | 2026-07-06 |
| `HookTimeline` | `foundations/hooks.mdx` | `tool-instructions/<tool>/hooks.mdx` | 2026-07-02 |
| `PermissionSim` | `foundations/permissions.mdx` | `tool-instructions/<tool>/permissions.mdx` | 2026-07-02 |
| `PlanModeStepper` | `foundations/plan-mode.mdx`, `course/pi/rebuild-the-defaults/plan-mode.mdx` (Pi exception — cross-tool contrast) | `tool-instructions/<tool>/plan-mode.mdx` | 2026-07-04 |
| `HeadlessBuilder` | `foundations/headless.mdx` | `tool-instructions/<tool>/headless.mdx` | 2026-07-02 |
| `SkillAnatomy` | `foundations/skills.mdx`, `course/pi/skills-packages/skills.mdx` (Pi exception — cross-tool contrast) | `tool-instructions/<tool>/skills.mdx` + cross-tool table in `foundations/skills.mdx` | 2026-07-04 |
| `PrimitivePicker` | `foundations/index.mdx`, `pages/index.astro` (homepage) | the "Why this and not…" tables across foundations chapters; two-step chooser (4 intent clusters → ≤4 problems each) since 2026-07-06 | 2026-07-06 |
| `ModelMatcher` | `foundations/model-selection.mdx` | `tool-instructions/<tool>/model-selection.mdx` | 2026-07-02 |
| `CommandExpander` | `foundations/slash-commands.mdx` | `tool-instructions/<tool>/slash-commands.mdx` | 2026-07-02 |
| `PluginPacker` | `foundations/plugins.mdx`, `course/pi/skills-packages/packages.mdx` (Pi exception — cross-tool contrast) | `tool-instructions/<tool>/plugins.mdx` | 2026-07-04 |

## Evergreen — concept-only, no vendor facts

| Widget | Pages | Encodes |
|---|---|---|
| `LoopStepper` | `foundations/how-agents-work.mdx`, `pages/index.astro` (homepage), `course/claude-code/getting-started/first-change.mdx`, `course/codex/getting-started/the-loop.mdx`, `course/opencode/getting-started/the-loop.mdx`, `course/cursor/getting-started/the-loop/index.mdx`, `course/pi/getting-started/the-loop.mdx` | the agentic loop (decide → tool → result), illustrative bug-fix trace |
| `ContextSimulator` | `foundations/context-management.mdx`, `course/claude-code/sessions-context/inspect.mdx`, `course/codex/sessions-context/status.mdx`, `course/pi/the-core/see-the-context.mdx`, `course/pi/context/compaction.mdx` | a long session against a 200k window; illustrative token magnitudes |
| `McpCostMeter` | `foundations/mcp-servers.mdx`, `course/claude-code/extending/mcp-connect.mdx`, `course/codex/extending/mcp-connect.mdx`, `course/copilot/extending/connect.mdx`, `course/opencode/extending/mcp-servers.mdx`, `course/cursor/extending/index.mdx` | context cost of mounted servers; order-of-magnitude schema sizes |
| `SubagentFanout` | `foundations/subagents.mdx`, `course/claude-code/subagents/fan-out.mdx`, `course/codex/subagents/fan-out.mdx`, `course/opencode/subagents/fan-out.mdx`, `course/pi/subagents/chains-and-fanout.mdx`, `course/pi/teams/orchestration.mdx` | inline vs delegated fan-out; window/overhead consistent with `context-sim-data.ts` |
| `RuleEconomy` | `course/claude-code/rules-memory/good-rules.mdx`, `course/codex/rules/good-rules.mdx`, `course/copilot/rules/good-rules.mdx`, `course/opencode/rules-agents-md/first-agents-md.mdx`, `course/cursor/rules/index.mdx` | a rule is context paid once vs re-taught every session; toggle candidate lines, ledger decides which earn their slot |
| `AutonomyDial` | `course/claude-code/permissions-modes/modes-ladder.mdx`, `course/codex/approvals-sandbox/two-axis.mdx`, `course/copilot/permissions/match-to-stakes.mdx`, `course/opencode/permissions/agent-as-policy.mdx`, `course/cursor/permissions/index.mdx`, `course/pi/rebuild-the-defaults/permissions.mdx` | match autonomy to stakes: reversibility × blast radius picks a rung on a generic trust ladder; each lesson's prose maps rungs to the tool's modes |
| `SkillEconomy` | `course/claude-code/skills/vs.mdx`, `course/codex/skills/vs.mdx`, `course/copilot/prompt-files/vs-rules.mdx`, `course/opencode/skills/first-skill.mdx` | where a piece of knowledge lives decides when its tokens are paid: rule = full size every session, skill = stub always + body on invocation, prompt = re-paid every time; sequel to `RuleEconomy` |
| `ModelEconomy` | `course/claude-code/models-thinking/cost.mdx`, `course/codex/models-effort/cost-aware.mdx`, `course/copilot/models/credits.mdx`, `course/cursor/models/index.mdx`, `course/opencode/providers-models/per-agent-model.mdx`, `course/pi/models-config/routing.mdx` | model × effort as a per-task spend: matched corners on the diagonal, overpay leak on pinned-expensive, redo tax makes underpowering the hard task the costlier mistake; illustrative 5×/3× multipliers |
| `GapDemo` | `pages/index.astro` (homepage; custom pages need the `styles/widget-standalone.css` token bridge), `course/pi/getting-started/index.mdx` | the site thesis as a live trace: same task run bare vs with context mounted (rules / skills / MCP chips); auto-plays bare → flips to ctx on first view, then the toggle replays either side; illustrative rate-limit scenario |
| `NightShift` | `course/claude-code/automation/loops.mdx`, `course/codex/automation/ci.mdx`, `course/copilot/automation/draft-prs.mdx`, `course/cursor/cli-headless-ci/index.mdx`, `course/opencode/share-and-headless/server-and-ci.mdx`, `course/pi/subagents/the-verifier.mdx`, `playbooks/afk-agents.mdx` (first widget on the playbooks surface, added 2026-07-12) | an unattended run's "done" is a claim until a wired check agrees (third scene on the `terminal-replay.tsx` engine; replaced the retired `VerifierLoop` toggle widget 2026-07-06): a 9-chore overnight batch reports 9/9 done with nothing wired in, playback pauses, reader picks ship-unverified / build+types / full-stack; shipping outsources the checks to production, build+types is the lint-green trap, the full stack retries reds and flags the seam break honestly — and the misread ticket still ships green through all four checks (the residual no machine check catches); illustrative flaw rate, generic checks that lessons map to each tool's spelling |
| `SessionXray` | `course/claude-code/sessions-context/compact.mdx`, `course/codex/sessions-context/compact.mdx`, `course/opencode/the-tui/undo-redo-compact.mdx`, `course/cursor/context/index.mdx`, `course/pi/context/sessions.mdx`, `foundations/context-management.mdx`, `blog/the-relay-not-the-window.mdx` (first widget on the blog surface) | the reset decision as a scripted terminal replay with a live window x-ray (first scene on the `terminal-replay.tsx` engine): a session fills to 75%, playback pauses, reader picks keep-going / compact / clear; keep-going ends in an unsteered mid-task auto-compact, compact shows a steered lossy summary, clear shows only on-disk blocks (rules) surviving; window size + magnitudes consistent with `context-sim-data.ts`; sequel to `ContextSimulator` |
| `ApprovalLedger` | `course/claude-code/permissions-modes/rules.mdx`, `course/copilot/permissions/the-checkpoint.mdx` | the approval prompt as a policy edit, not a yes/no (second scene on the `terminal-replay.tsx` engine; first non-meter scene, scene-defined slot colors): routine prompts train the yes reflex, `npm test` earns a narrow standing grant, then a destructive command arrives on the same reflex — reader picks allow-once / always-allow-wildcard / deny-and-redirect; once expires with the run, the wildcard outlives the moment, deny plus redirection is the cheapest correction; panel x-rays the standing-grants ledger; generic commands, lessons map to each tool's spelling |
| `SpecLock` | `playbooks/tdd-with-agents.mdx` | the committed failing test as a fixed target (fourth scene on the `terminal-replay.tsx` engine; first built for the playbooks surface, 2026-07-12): a delegated boundary-bug fix runs red through two plausible laps, then the agent reaches for the assertion it was told not to touch — reader picks let-it-through / hold-the-line / make-it-argue-the-case; letting it through ships the bug under a green suite, holding the line forces the loop to the real cause two files away, arguing the case shows the renegotiation done in the open where a human arbitrates; panel x-rays the spec's integrity (committed test, suite state, implementation edits, tampering); same sale-boundary running example as the chapter |
| `EdgeAudit` | `playbooks/architecture-diagrams.mdx` (added 2026-07-13) | a rendered diagram radiates authority it hasn't earned: the chapter's login-flow sequence diagram built in HTML/CSS with one fabricated edge (`UPDATE users.last_login` — the model's prior, not a read); reader clicks edges to demand receipts, five return file-and-line receipts (the `session.ts → DB` one verbatim from the chapter's step 5), one returns two empty greps; closing verdict lands only when all six are checked — the render looked identical either way |
| `BindingsCheck` | `playbooks/design-to-code.mdx` (added 2026-07-13) | an image carries looks, never bindings: the chapter's pricing card passes the looks check while six diff values show identical rendered output — reader marks suspects (token-bound and hardcoded chips are indistinguishable by design), then picks a reveal: `grep the diff` (step 6's move, three hits today) or `ship the brand refresh` (token-bound values flip teal live, the three literals stay purple — the card breaks two-tone in production); guesses get graded either way |
| `FreshEyes` | `playbooks/ai-ready-code.mdx` (added 2026-07-13) | the reader plays the fresh agent running the chapter's step-2 naming probe ("where do we decide which customers get billed?") against two structures: layer-first smears the answer across a service, a validator, and a job (fail — threshold is the chapter's ≤2 opens), domain-first answers it in one open of `billing/select.ts`; scoreboard compares both once each has a verdict; trees extend the chapter's own code block with distractors only |
| `GuaranteeLadder` | `course/claude-code/extending/hooks-vs.mdx`, `course/codex/extending/hooks-vs.mdx`, `course/opencode/extending/plugins-hooks.mdx`, `course/pi/first-extension/hooks.mdx` | the enforcement ladder: rule informs (probabilistic, window-bound), permission forbids a named class (harness wall), hook enforces a condition on the real action (code on the rail); situation clock (watching / compacted / unattended) shows rule-backed guarantees decay while enforced ones hold |

Course rule: prefer **evergreen** widgets in course lessons — the five-tool
comparative widgets can break the single-tool book narrative. Embed at the
story beat where the lesson hits the concept, with a prose bridge, never as a
templated section. Exception pattern (established with `ConfigExplorer`,
2026-07-06): a comparator that covers **all six tools** and accepts an
`initialTool` prop may sit in each course's config-beat lesson, opening on that
course's own tab — the narrative stays single-tool, the other tabs become the
cross-tool payoff.

**Pi exception (2026-07-04).** The Pi course embeds a few fact-bound five-tool
comparators (`PlanModeStepper`, `SkillAnatomy`, `PluginPacker`)
where the lesson explicitly frames them as *cross-tool contrast* — "here's how
the other tools do it, and Pi does less" — because Pi is a minimal agent whose
whole story is what it omits, and these widgets carry no Pi tab. They stay in the
fact-bound review cadence above. If any of them gains a genuine Pi dataset later,
promote the prose from contrast to inclusion — as happened with `ConfigExplorer`,
which gained Copilot, Cursor, and Pi tabs on 2026-07-06 and was promoted out of
this list.

## Adding a widget

1. Follow the file conventions above; put the keep-in-sync header in the data file naming its source chapters.
2. Data strings render through `withCode()` — backticked spans become `<code>`; no `**bold**`/`*italic*` markdown.
3. Verify in the browser, light and dark, before committing.
4. Add a row to the right table here with today's date.
