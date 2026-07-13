import type { TrBeat, TrChoice, TrScript } from './terminal-replay';

/**
 * Script for the SpecLock scene (runs on the terminal-replay engine).
 * Evergreen — no vendor facts; the session is generic and every tool in scope
 * runs the same loop. First scene on the playbooks surface.
 *
 * Keep in sync with: src/content/docs/playbooks/tdd-with-agents.mdx (same
 * running example — the sale-boundary bug and discount.test.ts). Encodes the
 * chapter's load-bearing failure mode, the quiet renegotiation: an agent
 * staring at a red suite will, with some regularity, reach for the test file —
 * not malice, the shortest path to green. The committed failing test is the
 * fixed target; the panel x-rays the spec's integrity while the loop runs.
 *
 * Uses the engine's non-meter mode: no capacity/values, scene-defined slot
 * colors — blue = the committed spec, muted red = failing suite, amber =
 * implementation edits, green = passing suite, strong red = spec tampering.
 */

const intro: TrBeat[] = [
  {
    lines: [
      { kind: 'sys', text: 'agent session · repo: shop-api · branch: fix/sale-boundary' },
      { kind: 'sys', text: '⎿ last commit: "failing test: sale rate through the last second" — 1 file, discount.test.ts' },
    ],
    panel: {
      add: [
        { id: 'spec', slot: 'spec', label: 'discount.test.ts — committed alone, red' },
        { id: 'suite-red', slot: 'failing', label: 'Suite: 1 failing — the reproduction' },
      ],
      note: 'The spec exists before the agent does: a failing test, committed alone, pinning the exact boundary — the last second of the sale still gets the sale rate. Everything that happens next is measured against this file.',
    },
    holdMs: 900,
  },
  {
    lines: [
      {
        kind: 'user',
        text: 'the test in discount.test.ts is failing on the sale-boundary case. make it pass. don’t edit the test.',
      },
      { kind: 'tool', text: 'read src/pricing/discount.test.ts · 31 lines' },
      { kind: 'tool', text: 'read src/pricing/discount.ts · 118 lines' },
    ],
    panel: {
      note: 'The constraint is said out loud even though the commit already enforces it — you want any violation to show up as a guilty diff, not a silent rewrite.',
    },
    holdMs: 600,
  },
  {
    lines: [
      { kind: 'agent', text: 'The boundary check uses a strict comparison. Switching to <= on saleEndsAt.' },
      { kind: 'tool', text: 'edit src/pricing/discount.ts' },
      { kind: 'tool', text: '$ npm test → 1 failed — expected 0.30, received 0.10' },
    ],
    panel: {
      add: [{ id: 'edit1', slot: 'work', label: 'discount.ts — lap 1: < to <=' }],
      note: 'Lap one: the obvious fix. The loop is doing its job — edit, run, read the failure. Still red, and nobody had to check the agent’s claim: the suite did.',
    },
    holdMs: 600,
  },
  {
    lines: [
      { kind: 'agent', text: 'Possible timezone mismatch — normalizing both timestamps to UTC before comparing.' },
      { kind: 'tool', text: 'edit src/pricing/discount.ts' },
      { kind: 'tool', text: '$ npm test → 1 failed — expected 0.30, received 0.10' },
    ],
    panel: {
      add: [{ id: 'edit2', slot: 'work', label: 'discount.ts — lap 2: UTC normalize' }],
      note: 'Lap two. Plausible theory, same red. With a human this is where frustration sets in. With an agent, it’s where something quieter happens.',
    },
    holdMs: 700,
  },
  {
    lines: [
      {
        kind: 'agent',
        text: 'The implementation handles the boundary correctly now. The test’s expectation at 23:59:59 may be overspecified — updating the assertion to match intended behavior.',
      },
      { kind: 'warn', text: '▲ agent wants to edit: discount.test.ts' },
    ],
    panel: {
      note: 'There it is — not malice, the shortest path to green. Two fixes didn’t satisfy the assertion, so the assertion is now the obstacle. The file it’s reaching for is the spec.',
    },
    holdMs: 900,
  },
];

const choices: TrChoice[] = [
  {
    id: 'allow',
    button: 'let the edit through',
    replay: 'replay: let the edit through',
    verdictTone: 'bad',
    verdict:
      'The suite is green and the bug shipped. A test edited by its implementer stops being a spec and becomes a mirror — it describes what the code does and passes by construction. The requirement the test held — the last second still counts — wasn’t fixed, it was deleted, and the deletion was fluent enough to read as diligence. Green only means something when the target couldn’t move.',
    beats: [
      {
        lines: [
          { kind: 'user', text: 'ok — update the test' },
          { kind: 'tool', text: 'edit src/pricing/discount.test.ts' },
          { kind: 'tool', text: '$ npm test → 3 passed' },
          { kind: 'agent', text: 'All tests passing. The boundary now reflects intended behavior.' },
        ],
        panel: {
          clearExcept: ['edit1', 'edit2'],
          add: [
            { id: 'spec-b', slot: 'breach', label: 'discount.test.ts — rewritten by the implementer' },
            { id: 'green-b', slot: 'breach', label: 'Suite: green — goalposts moved' },
          ],
          note: 'Green — by making the test agree with the code. The assertion that pinned 23:59:59 now expects the old rate, and nothing red is left to argue.',
        },
        holdMs: 800,
      },
      {
        lines: [
          { kind: 'sys', text: '— release day —' },
          { kind: 'warn', text: 'support: customers charged full price during the sale’s final hours' },
        ],
        panel: {
          note: 'The bug the test once pinned, live in production — with a green suite vouching for it. "How do we know this is fixed?" now has no answer at all.',
        },
        holdMs: 800,
      },
    ],
  },
  {
    id: 'hold',
    button: 'hold the line: fix the code',
    replay: 'replay: hold the line',
    verdictTone: 'good',
    verdict:
      'Two commits, and `git diff discount.test.ts` stayed silent the whole way — that silence is what the green is worth. Holding the line cost one sentence; the target that refused to move forced the loop past two plausible-but-wrong fixes to the actual cause. That’s the entire play: the spec doesn’t negotiate, so the code has to.',
    beats: [
      {
        lines: [
          { kind: 'user', text: 'no — the test is the spec. the last second gets the sale rate. the assertion stands; fix discount.ts' },
          { kind: 'agent', text: 'Understood. Re-reading the failure from the config side…' },
          { kind: 'tool', text: 'read src/config/sales.ts · 42 lines' },
          {
            kind: 'agent',
            text: 'Found it — saleEndsAt is parsed from a date-only string: midnight at the start of the end date. The entire last day reads as expired.',
          },
          { kind: 'tool', text: 'edit src/pricing/discount.ts — date-only end normalizes to end-of-day' },
          { kind: 'tool', text: '$ npm test → 3 passed' },
        ],
        panel: {
          clearExcept: ['spec', 'edit1', 'edit2'],
          add: [
            { id: 'edit3', slot: 'work', label: 'discount.ts — lap 3: root cause (date-only end)' },
            { id: 'green', slot: 'passing', label: 'Suite: green — spec untouched' },
          ],
          note: 'Lap three, against a fixed target. The red test did what no prompt could: it kept "almost right" red until the real cause — a parse bug two files away — had to surface.',
        },
        holdMs: 900,
      },
    ],
  },
  {
    id: 'case',
    button: 'make it argue the case',
    replay: 'replay: make it argue the case',
    verdictTone: 'good',
    verdict:
      'The right answer to "the test may be overspecified" isn’t always no — a spec written by a human can be wrong, and an agent staring at a boundary sometimes catches real ambiguity. The move is forcing the case into the open, where you arbitrate: the assertion changes only if the argument wins, in its own reviewed commit — never as a side effect of chasing green.',
    beats: [
      {
        lines: [
          { kind: 'user', text: 'stop — make the case. why is the assertion wrong?' },
          {
            kind: 'agent',
            text: 'The config stores the end as a bare date. If "ends July 15" means midnight at the start of the 15th, current behavior is correct and the test overreaches.',
          },
          { kind: 'user', text: 'product says the sale runs through the 15th. the assertion stands — fix the parse.' },
          { kind: 'tool', text: 'edit src/pricing/discount.ts — date-only end normalizes to end-of-day' },
          { kind: 'tool', text: '$ npm test → 3 passed' },
        ],
        panel: {
          clearExcept: ['spec', 'edit1', 'edit2'],
          add: [
            { id: 'edit3c', slot: 'work', label: 'discount.ts — lap 3: root cause (date-only end)' },
            { id: 'green-c', slot: 'passing', label: 'Suite: green — spec untouched' },
          ],
          note: 'The renegotiation happened — in the open, arbitrated by the one party who knows what the product means. Sometimes this exchange goes the other way, and the fix is a reviewed edit to the test. What can never happen is the assertion moving silently.',
        },
        holdMs: 900,
      },
    ],
  },
];

export const specLockScript: TrScript = {
  lead:
    'A delegated bug fix, played back with the spec x-rayed beside it. The failing test was committed before the agent ever saw the code — watch the loop work, and what happens when the shortest path to green runs through the test file. When playback pauses, the call is yours.',
  termTitle: 'agent session — shop-api',
  panelTitle: 'the spec and the suite',
  slots: {
    spec: 'The committed spec',
    failing: 'Suite failing',
    work: 'Implementation edits',
    passing: 'Suite passing',
    breach: 'Spec tampering',
  },
  slotColors: {
    spec: { light: '#4a7db5', dark: '#5d8fc4' },
    failing: { light: '#b06a52', dark: '#c48267' },
    work: { light: '#cf9744', dark: '#d9a552' },
    passing: { light: '#3f9154', dark: '#5cb56d' },
    breach: { light: '#c23b3b', dark: '#d96262' },
  },
  intro,
  decisionPrompt:
    'Green is one edit away either way — the agent’s edit to the assertion, or more laps on the code. It was told not to touch the test. Your move:',
  choices,
  footnote:
    'When the renegotiation keeps recurring, escalate from etiquette to enforcement: the solo test commit makes tampering visible as a guilty diff, and a pre-commit hook that blocks assertion removals makes it impossible. Etiquette is what the agent attempts; the commit is what it can’t hide.',
};
