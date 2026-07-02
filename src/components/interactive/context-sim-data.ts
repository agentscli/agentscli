import type { SimSegment, SimStep } from './context-sim-types';

/**
 * A simulated long session against a 200k-token window. Token counts are
 * illustrative orders of magnitude, not measurements — the shape of the
 * session (fixed overhead, exploration spikes, delegation, the threshold,
 * what compaction keeps) is the content. Keep the story consistent with
 * the prose in foundations/context-management.mdx.
 */

/** Window size in thousands of tokens */
export const WINDOW_TOKENS = 200;

/** Where auto-compaction typically kicks in (thousands of tokens) */
export const AUTO_COMPACT_AT = 160;

export const SIM_CATEGORY_LABEL: Record<string, string> = {
  overhead: 'Fixed overhead',
  rules: 'Rules',
  chat: 'Conversation',
  files: 'File reads',
  tools: 'Tool output',
  summary: 'Summaries',
};

const FIXED: SimSegment[] = [
  {
    id: 'system-prompt',
    category: 'overhead',
    label: 'System prompt',
    tokens: 3,
    note: 'The tool vendor’s standing instructions. You don’t control this part.',
  },
  {
    id: 'tool-defs',
    category: 'overhead',
    label: 'Built-in tool definitions',
    tokens: 12,
    note: 'Schemas for read, edit, bash, grep… — present every turn.',
  },
  {
    id: 'rules',
    category: 'rules',
    label: 'Rules (CLAUDE.md / AGENTS.md)',
    tokens: 2,
    note: 'Reloaded every turn; survives every compaction. The one durable slot you own.',
  },
];

export const simSteps: SimStep[] = [
  {
    id: 'start',
    title: 'Session start',
    narration:
      'Before you type a word, 17k tokens are spent: the system prompt, the built-in tool definitions, and your rules file. This fixed overhead reloads on every turn — which is also why it’s the one part of the window you fully control.',
    callout: 'A lean rules file pays rent every single turn.',
    add: FIXED,
  },
  {
    id: 'mcp',
    title: 'MCP servers connect',
    narration:
      'Three MCP servers register, and every one of their tool schemas lands in the window — whether the session ever calls them or not. Permanent weight, paid up front.',
    callout: 'Tool-schema deferral (where supported) keeps unused servers out of the window.',
    add: [
      {
        id: 'mcp-schemas',
        category: 'overhead',
        label: 'MCP tool schemas (3 servers)',
        tokens: 14,
        note: 'Postgres + Linear + Figma adapters. Each server’s full tool list, loaded whether used or not.',
      },
    ],
  },
  {
    id: 'brief',
    title: 'You describe the task',
    narration:
      'Your migration brief: one careful paragraph, about 1k tokens. Notice the ratio — the window is already 16% committed, and your actual request is half a percent of it.',
    add: [
      {
        id: 'user-brief',
        category: 'chat',
        label: 'Your migration brief',
        tokens: 1,
      },
    ],
  },
  {
    id: 'explore',
    title: 'The agent explores',
    narration:
      'Six file reads land in full — bodies, not summaries — plus greps and directory listings. Exploration is the first big spike of any session, and file contents are the biggest single eater of context.',
    add: [
      {
        id: 'file-reads',
        category: 'files',
        label: '6 file reads (full contents)',
        tokens: 22,
        note: 'The migration entry points, the schema, two callers. Full bodies enter the window.',
      },
      {
        id: 'explore-tools',
        category: 'tools',
        label: 'Greps & directory listings',
        tokens: 6,
      },
    ],
  },
  {
    id: 'dead-ends',
    title: 'Dead ends',
    narration:
      'Two hypotheses don’t pan out: failed test runs, a reverted edit, stack traces. None of it ever becomes signal — but all of it stays in the window, competing for attention with the things that matter.',
    add: [
      {
        id: 'dead-ends',
        category: 'tools',
        label: '2 abandoned hypotheses',
        tokens: 12,
        note: 'Failed test output, a reverted edit, error traces. Noise with permanent residency.',
      },
    ],
  },
  {
    id: 'delegate',
    title: 'Delegate the log analysis',
    narration:
      'The test-log analysis would dump ~45k of raw logs into the window, so it goes to a subagent instead. The subagent burns those tokens in its own separate window; only its 2k report lands in yours.',
    callout: 'Delegation is compaction you never have to run.',
    subagent: {
      label: 'Log-analysis subagent',
      tokens: 45,
      returns: 2,
    },
    add: [
      {
        id: 'subagent-report',
        category: 'summary',
        label: 'Subagent report',
        tokens: 2,
        note: 'The distilled answer. The 45k of raw logs it read never entered this window.',
      },
    ],
  },
  {
    id: 'grind',
    title: 'Implementation grind',
    narration:
      'Edits, diffs, and four full test runs. The window crosses half full and everything still works fine — but the trend line is set.',
    add: [
      {
        id: 'impl-turns',
        category: 'chat',
        label: 'Assistant turns & diffs',
        tokens: 8,
      },
      {
        id: 'test-output',
        category: 'tools',
        label: '4 test runs (full output)',
        tokens: 18,
      },
    ],
  },
  {
    id: 'mistake',
    title: 'The 24k mistake',
    narration:
      'One careless read of a generated lockfile: 24k tokens of pure noise in a single tool call. This is what the inspect commands (`/context`, `/status`) are for — catching the spike when it happens, not an hour later when the symptoms start.',
    add: [
      {
        id: 'lockfile',
        category: 'files',
        label: 'Generated lockfile, read in full',
        tokens: 24,
        note: 'Nothing in here helps the task. 12% of the window, gone in one tool call.',
      },
    ],
  },
  {
    id: 'long-middle',
    title: 'The long middle',
    narration:
      'Forty more minutes of work pushes the session past the auto-compact threshold. And before the hard limit ever hits, the coherence limit does: the agent re-suggests a fix you already rejected and has “forgotten” a constraint from an hour ago.',
    callout: 'Degradation starts before the window is technically full.',
    add: [
      {
        id: 'late-turns',
        category: 'chat',
        label: 'More turns',
        tokens: 14,
      },
      {
        id: 'late-reads',
        category: 'files',
        label: 'More file reads',
        tokens: 18,
      },
      {
        id: 'late-tools',
        category: 'tools',
        label: 'More test & command output',
        tokens: 12,
      },
    ],
  },
  {
    id: 'compact',
    title: '/compact',
    narration:
      'One summarisation call replaces the middle of the session. What survives: the goal, the decisions and why, file names, and the most recent turns verbatim. What’s gone: file bodies, exact error output, the precise sequence of steps.',
    callout:
      'Write unsaved work to disk before compacting — a diff that exists only in conversation gets flattened to “edited auth.ts”.',
    compact: {
      keepIds: ['system-prompt', 'tool-defs', 'rules', 'mcp-schemas'],
      add: [
        {
          id: 'compact-summary',
          category: 'summary',
          label: 'Structured summary',
          tokens: 9,
          note: 'Goal · key decisions · files touched · next steps. Lossy by design.',
        },
        {
          id: 'recent-turns',
          category: 'chat',
          label: 'Most recent turns (verbatim)',
          tokens: 8,
        },
      ],
    },
  },
  {
    id: 'sharp-again',
    title: 'Sharp again',
    narration:
      'The session continues on a lean window. The agent re-reads the two files that still matter — far cheaper than dragging seventeen stale reads along. And when this task ships and the next one is unrelated, the right move is `/clear`, not another compact.',
    add: [
      {
        id: 'post-turns',
        category: 'chat',
        label: 'Fresh working turns',
        tokens: 6,
      },
      {
        id: 're-reads',
        category: 'files',
        label: 'Re-reads the 2 files that matter',
        tokens: 8,
        note: 'Compaction kept the names; the agent re-reads the bodies it actually needs.',
      },
    ],
  },
];
