/**
 * Data for CheatSandbox.tsx - the interactive Claude Code sandbox on
 * `foundations/cheatsheets/claude-code`.
 *
 * FACT-BOUND behaviors, EVERGREEN conversation: the command palette's names
 * and one-liners come from `src/data/cheatsheets/claude-code.ts` (the same
 * verified facts that render the static tables); this file supplies the
 * simulation's scenery - the seeded session, the fake repo, the reply pool,
 * sample MCP servers and skills. Token magnitudes follow context-sim-data.ts
 * (200k window, ~17k fixed overhead) so the sandbox agrees with every other
 * window visualization on the site.
 *
 * The sandbox is a simulation, labeled as one in the title bar and lead.
 * Behaviors (what /compact does to the window, what Shift+Tab cycles, what
 * Esc Esc opens) were modeled against the installed binary v2.1.234 on
 * 2026-08-18. Re-verify with the cheatsheet data on the monthly pass.
 */

import type { CheatEntry } from '../../data/cheatsheets/claude-code';

export const SANDBOX_VERSION = '2.1.234';
export const WINDOW_K = 200; // thousands of tokens, matches context-sim-data.ts

/** Fixed overhead blocks - everything the reader doesn't type. */
export interface SandBlockSeed {
  id: string;
  slot: 'a' | 'b' | 'c' | 'f';
  label: string;
  value: number; // thousands of tokens
}

export const BASE_BLOCKS: SandBlockSeed[] = [
  { id: 'sys', slot: 'a', label: 'System prompt', value: 3 },
  { id: 'tools', slot: 'a', label: 'Tool definitions', value: 12 },
  { id: 'rules', slot: 'b', label: 'Rules (CLAUDE.md)', value: 2 },
  { id: 'mcp', slot: 'a', label: 'MCP schemas (deferred)', value: 4 },
];

export const SEED_CONVERSATION_K = 46; // seeded exchanges below add up to this

/** Files the @-mention autocomplete offers. */
export const FILES = [
  'src/export.ts',
  'src/filters.ts',
  'src/pagination.ts',
  'tests/export.test.ts',
  'CLAUDE.md',
  'package.json',
];

/** Sample /mcp listing - one healthy, one pending, to show the approval state. */
export const MCP_SERVERS = [
  { name: 'github', state: 'connected', detail: '47 tools · schemas deferred' },
  { name: 'sentry', state: 'pending', detail: '⏸ pending approval (.mcp.json) — not connected' },
];

/** Sample /skills listing with plausible token costs. */
export const SKILLS = [
  { name: 'export-doctor', tokens: 312, note: 'project · .claude/skills/' },
  { name: 'review-checklist', tokens: 940, note: 'user · ~/.claude/skills/' },
  { name: 'simplify', tokens: 0, note: 'bundled · stub only until invoked' },
];

/** Permission rules shown by /permissions - shaped like settings.json truth. */
export const PERMISSION_RULES = {
  allow: ['Bash(npm run test:*)', 'Read(src/**)'],
  ask: ['Bash(*)'],
  deny: ['Bash(rm:*)', 'Edit(.env)'],
};

export type SandLineKind = 'user' | 'agent' | 'tool' | 'sys' | 'warn' | 'card';

export interface SandLine {
  id: number;
  kind: SandLineKind;
  text: string;
}

/** The session the reader walks in on - gives /compact something to squeeze. */
export const SEED_LINES: Omit<SandLine, 'id'>[] = [
  { kind: 'sys', text: `claude v${SANDBOX_VERSION} · simulated · repo: demo-app (branch: fix/csv-export)` },
  { kind: 'user', text: 'the CSV export drops rows whenever a saved filter is active - find it and fix it' },
  { kind: 'tool', text: 'read src/export.ts · 412 lines' },
  { kind: 'tool', text: 'read src/filters.ts · 388 lines' },
  { kind: 'tool', text: '$ npm test → 3 failed' },
  {
    kind: 'agent',
    text: 'All three failures export with a saved filter active. The filter narrows the rows, then the exporter paginates with an offset cursor that ignores it - the tail pages come back empty and get skipped. I can patch the cursor in src/pagination.ts.',
  },
];

/** One canned agent exchange: tool lines + reply + context cost (thousands). */
export interface SandReply {
  match: RegExp;
  tool: string[];
  text: string;
  costK: number;
}

export const REPLIES: SandReply[] = [
  {
    match: /test|spec|suite/i,
    tool: ['$ npm test → 2 failed, 1 skipped'],
    text: 'The two failures are the saved-filter cases from before; the skip is the empty-page case, which is exactly the cursor bug. Patch first, then re-run.',
    costK: 14,
  },
  {
    match: /fix|patch|cursor|paginat|bug|why|drop/i,
    tool: ['edit src/pagination.ts · +9 −4'],
    text: 'The cursor now starts from the filtered row count instead of the table total. Empty tail pages no longer occur, so the exporter stops skipping them.',
    costK: 18,
  },
  {
    match: /plan|design|architect/i,
    tool: [],
    text: 'Plan: (1) reproduce with the saved filter, (2) fix the cursor to respect the filter, (3) add a regression test for the empty-page case, (4) re-run the suite. No file changes yet — say the word.',
    costK: 6,
  },
  {
    match: /read|look|explain|what|how/i,
    tool: ['read src/pagination.ts · 197 lines'],
    text: 'src/pagination.ts takes a total row count and walks pages from it. When a filter is active the caller passes the unfiltered total, so the cursor walks past the last real row. Small bug, loud symptom.',
    costK: 12,
  },
  {
    match: /deploy|ship|commit|pr\b/i,
    tool: ['git commit -m "fix(export): respect saved filters in pagination cursor"'],
    text: 'Committed. Want me to open a PR with the failing-case test included?',
    costK: 8,
  },
];

export const FALLBACK_REPLIES: { tool: string[]; text: string; costK: number }[] = [
  {
    tool: [],
    text: 'Noted. This sandbox runs one scripted storyline - the CSV export bug - so I answer best around that. The reference tables below the sandbox cover everything else.',
    costK: 4,
  },
  {
    tool: ['grep -r "saved filter" src/ · 6 matches'],
    text: 'Working the export story. Try asking about the tests, the fix, or a plan - or run /compact and watch the window let go of the exploration.',
    costK: 10,
  },
];

/** Keys the palette teaches beyond slash commands. */
export const KEY_HINTS = [
  { keys: 'Shift+Tab', desc: 'cycle permission modes: default → acceptEdits → plan' },
  { keys: 'Esc', desc: 'interrupt the run - work done so far is kept' },
  { keys: 'Esc Esc', desc: 'open the rewind menu from an empty prompt' },
  { keys: '!', desc: 'shell mode: !ls, !cat README.md' },
  { keys: '@', desc: 'mention a file: @src/export.ts' },
];

/** Palette = every verified slash entry from the cheatsheet data. */
export function paletteEntries(entries: CheatEntry[]): CheatEntry[] {
  return entries.filter((e) => e.cmd.startsWith('/'));
}
