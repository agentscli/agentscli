import type { TrBeat, TrChoice, TrScript } from './terminal-replay';

/**
 * Script for the SessionXray scene (runs on the terminal-replay engine).
 * Evergreen — no vendor facts, no real flags; command names in the terminal
 * are generic (/compact, /clear) and the embedding lessons map them to each
 * tool's spelling. Encodes the reset decision from the course sessions
 * chapters (claude-code/sessions-context/compact.mdx,
 * codex/sessions-context/compact.mdx, opencode/the-tui/undo-redo-compact.mdx,
 * cursor/context/index.mdx, pi/context/sessions.mdx): every long session ends
 * in a reset — keep typing and the tool picks the moment, /compact keeps a
 * steered thread, /clear starts over with only what's on disk. Window size
 * and token counts are illustrative orders of magnitude, kept consistent with
 * context-sim-data.ts (200k window, ~17k fixed overhead).
 *
 * Color slots (see terminal-replay.css): a=overhead, b=rules, c=conversation,
 * d=file reads, e=tool output, f=summaries.
 */

/** Blocks that survive every reset: not conversational, reloaded from disk. */
const KEEP_ON_RESET = ['sys-prompt', 'tool-defs', 'rules'];

const intro: TrBeat[] = [
  {
    lines: [{ kind: 'sys', text: 'agent cli · new session · repo: billing-app' }],
    panel: {
      add: [
        { id: 'sys-prompt', slot: 'a', label: 'System prompt', value: 3 },
        { id: 'tool-defs', slot: 'a', label: 'Tool definitions', value: 12 },
        { id: 'rules', slot: 'b', label: 'Rules file (on disk)', value: 2 },
      ],
      note: '17k spent before you type a word — system prompt, tool schemas, your rules file. The rules block is the only one you wrote.',
    },
    holdMs: 800,
  },
  {
    lines: [
      {
        kind: 'user',
        text: 'the CSV export drops rows whenever a saved filter is active — find it and fix it',
      },
    ],
    panel: {
      add: [{ id: 'brief', slot: 'c', label: 'Your task brief', value: 1 }],
      note: 'Your actual request: 1k. The window is already 9% spent, and your ask is half a percent of it.',
    },
    holdMs: 500,
  },
  {
    lines: [
      { kind: 'tool', text: 'read src/export.ts · 412 lines' },
      { kind: 'tool', text: 'read src/filters.ts · 388 lines' },
      { kind: 'tool', text: 'read 9 more files…' },
    ],
    panel: {
      add: [{ id: 'reads', slot: 'd', label: '11 file reads (full bodies)', value: 44 }],
      note: 'Exploration lands as full file bodies, not summaries — the biggest single eater of context.',
    },
    holdMs: 600,
  },
  {
    lines: [
      { kind: 'tool', text: '$ npm test → 3 failed' },
      { kind: 'agent', text: 'All three failures export with a saved filter active. Digging in.' },
    ],
    panel: {
      add: [{ id: 'tests-1', slot: 'e', label: 'Test runs (full output)', value: 22 }],
    },
    holdMs: 400,
  },
  {
    lines: [
      { kind: 'agent', text: 'Hypothesis: the pagination cursor drops the tail. Rewriting it…' },
      { kind: 'tool', text: '$ npm test → still 3 failed' },
      { kind: 'agent', text: 'Wrong lead — reverted.' },
    ],
    panel: {
      add: [{ id: 'dead-end', slot: 'e', label: 'Dead-end attempt', value: 16 }],
      note: 'The bad hypothesis is reverted in the code — but its file dumps and failed runs never leave the window.',
    },
    holdMs: 800,
  },
  {
    lines: [
      {
        kind: 'agent',
        text: 'Found it. The filter runs after the page slice, so every filtered page under-fills. Fix: filter first, then slice — here is the exact change to runExport()…',
      },
    ],
    panel: {
      add: [
        { id: 'turns', slot: 'c', label: 'Working turns', value: 12 },
        { id: 'fix', slot: 'c', label: 'The fix, worked out in-chat', value: 8 },
      ],
      note: 'Note where the fix’s reasoning lives: in the conversation, and nowhere else. Keep an eye on that block.',
    },
    holdMs: 900,
  },
  {
    lines: [
      { kind: 'tool', text: 'edit src/export.ts' },
      { kind: 'tool', text: '$ npm test → 47 passed' },
    ],
    panel: {
      add: [{ id: 'reruns', slot: 'e', label: 'Re-runs after the fix', value: 30 }],
    },
    holdMs: 400,
  },
  {
    lines: [
      { kind: 'warn', text: 'context: 75% full — 150k of 200k' },
      { kind: 'agent', text: 'Re-reading src/export.ts to double-check the slice bounds…' },
    ],
    panel: {
      note: '75% full — and it just re-read a file it has already read twice. Coherence degrades before the window is technically full.',
    },
    holdMs: 900,
  },
];

const choices: TrChoice[] = [
  {
    id: 'keep',
    button: 'keep going',
    replay: 'replay: keep going',
    verdictTone: 'bad',
    verdict:
      'Doing nothing was also a context decision — the window just made it for you. Every long session ends in a reset; the only question is who picks the moment and what survives it. Left to the tool, the reset lands mid-task, the summary is unsteered, and the reasoning you paid 150k tokens for shrinks to a filename.',
    beats: [
      {
        lines: [
          { kind: 'user', text: 'nice — now add an XLSX export next to the CSV one' },
          { kind: 'tool', text: 'read src/export.ts · 412 lines (again)' },
          { kind: 'tool', text: 'read src/xlsx/…' },
        ],
        panel: {
          add: [
            { id: 'xlsx-reads', slot: 'd', label: 'Reads for the XLSX task', value: 22 },
            { id: 'xlsx-out', slot: 'e', label: 'More output', value: 14 },
          ],
          note: 'New task, same thread: 93% full. Every token of the export saga still rides along under the new work.',
        },
        holdMs: 600,
      },
      {
        lines: [
          { kind: 'warn', text: 'context: 93% full — 186k of 200k' },
          {
            kind: 'agent',
            text: 'Quick check — which module owns the CSV export? I will mirror its structure.',
          },
        ],
        panel: {
          note: 'It wrote the CSV fix in that module twenty minutes ago. That is what 93% full feels like from the outside.',
        },
        holdMs: 900,
      },
      {
        lines: [
          { kind: 'warn', text: 'context limit — auto-compacting mid-task…' },
          { kind: 'sys', text: '⎿ compacted · 186k → 30k · summary written by the tool' },
        ],
        panel: {
          clearExcept: KEEP_ON_RESET,
          add: [
            { id: 'auto-sum', slot: 'f', label: 'Auto-summary (unsteered)', value: 9 },
            { id: 'recent-a', slot: 'c', label: 'Recent turns', value: 6 },
          ],
          note: 'The reset happened anyway — you just didn’t pick the moment, and nobody told the summariser what mattered.',
        },
        holdMs: 700,
      },
      {
        lines: [
          {
            kind: 'agent',
            text: '…resuming. Context so far: fixed an export bug (edited src/export.ts). For the XLSX exporter — which filter behaviour should it copy?',
          },
        ],
        panel: {
          note: 'The fix you watched it reason through now survives as “edited src/export.ts”. The XLSX work restarts on a guess.',
        },
        holdMs: 400,
      },
    ],
  },
  {
    id: 'compact',
    button: '/compact',
    replay: 'replay: /compact',
    verdictTone: 'good',
    verdict:
      'Compact is the mid-task move: same thread, out of room. You picked the moment — a clean boundary, tests green — and named what couldn’t be lost. The reflex that makes it safe: compaction is lossy, so anything that exists only in the conversation goes to disk first. The fix survived here because it was also sitting in `src/export.ts`; the version that lived purely in chat would have been flattened.',
    beats: [
      {
        lines: [
          {
            kind: 'user',
            text: '/compact — keep the filter-before-slice fix and which tests were failing',
          },
          { kind: 'sys', text: '⎿ compacted · 150k → 35k' },
          { kind: 'sys', text: '  kept: goal · root cause · the fix · failing-test names · recent turns' },
          { kind: 'sys', text: '  collapsed: 44k of file bodies · test output · the dead end' },
        ],
        panel: {
          clearExcept: KEEP_ON_RESET,
          add: [
            { id: 'steered-sum', slot: 'f', label: 'Steered summary', value: 12 },
            { id: 'recent-b', slot: 'c', label: 'Recent turns (verbatim)', value: 6 },
          ],
          note: 'What survived is what you named. Unsteered compaction guesses at the protagonist; you told it.',
        },
        holdMs: 1000,
      },
      {
        lines: [
          { kind: 'user', text: 'now add a regression test for the empty-filter case' },
          { kind: 'tool', text: 'read src/export.test.ts · 210 lines' },
          {
            kind: 'agent',
            text: 'Adding it next to the three that were failing — they are named in the summary.',
          },
        ],
        panel: {
          add: [
            { id: 're-read', slot: 'd', label: 'One re-read', value: 6 },
            { id: 'fresh-b', slot: 'c', label: 'Fresh turns', value: 4 },
          ],
          note: 'Same thread, same understanding, a quarter of the weight. One re-read beats carrying eleven stale ones.',
        },
        holdMs: 400,
      },
    ],
  },
  {
    id: 'clear',
    button: '/clear',
    replay: 'replay: /clear',
    verdictTone: 'good',
    verdict:
      'Clear is the done move: the task shipped and the next one is unrelated, so the thread is dead weight. The failure modes are directional — clear when you should have compacted and the working thread is gone; compact when you should have cleared and you’re just preserving noise more efficiently. Done → clear. Not done → compact. Either way, whatever must outlive the reset belongs on disk, not in the window.',
    beats: [
      {
        lines: [
          { kind: 'user', text: '/clear' },
          { kind: 'sys', text: '⎿ cleared · fresh window' },
        ],
        panel: {
          clearExcept: KEEP_ON_RESET,
          note: 'Everything conversational is gone — and one block is still standing: the rules file, reloaded from disk every session. What’s written down is what survives a reset.',
        },
        holdMs: 1000,
      },
      {
        lines: [
          {
            kind: 'user',
            text: 'the dashboard is slow on first paint — profile it and find the biggest win',
          },
          { kind: 'tool', text: 'read src/dashboard/panel.tsx · 300 lines' },
          { kind: 'agent', text: 'Profiling the initial render path…' },
        ],
        panel: {
          add: [
            { id: 'brief-2', slot: 'c', label: 'New task brief', value: 1 },
            { id: 'dash-reads', slot: 'd', label: 'Fresh reads', value: 12 },
          ],
          note: 'A clean start at 9% full — nothing from the export saga competing for the new task’s attention.',
        },
        holdMs: 400,
      },
    ],
  },
];

export const sessionXrayScript: TrScript = {
  lead: 'One session, played back with its context window x-rayed. Watch what the work costs on the right; when the playback pauses, you decide what the session does next — then replay the other choices.',
  termTitle: 'agent session — billing-app',
  panelTitle: 'the window, x-rayed',
  capacity: 200,
  unit: 'k',
  meter: 'top',
  slots: {
    a: 'Fixed overhead',
    b: 'Rules',
    c: 'Conversation',
    d: 'File reads',
    e: 'Tool output',
    f: 'Summaries',
  },
  intro,
  decisionPrompt:
    'Tests are green, the window is three-quarters full, and more work is queued. The next thing you type decides what this session carries. Your move:',
  choices,
  footnote:
    'Every number is an illustrative order of magnitude, and the commands answer to different names across tools — `/compact`, `/compress`, or `/summarize`; `/clear`, `/new`, or a fresh chat. The trade is the same everywhere: a reset is coming, and choosing its moment — and what survives it — is yours to keep.',
};
