import type { SimSegment, SimStep } from './context-sim-types';

/**
 * A simulated long session against a 200k-token window. Token counts are
 * illustrative orders of magnitude, not measurements - the shape of the
 * session (fixed overhead, exploration spikes, delegation, the threshold,
 * what compaction keeps) is the content. Keep the story consistent with
 * the prose in foundations/context-management.mdx.
 */

/** Window size in thousands of tokens */
export const WINDOW_TOKENS = 200;

/** Illustrative compaction threshold, not a vendor default (thousands of tokens). */
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
    note: 'Schemas for read, edit, bash, grep… - present every turn.',
  },
  {
    id: 'rules',
    category: 'rules',
    label: 'Rules (CLAUDE.md / AGENTS.md)',
    tokens: 2,
    note: 'Retained as standing guidance in this simulation. Actual loading and compaction behavior depend on the tool.',
  },
];

export const simSteps: SimStep[] = [
  {
    id: 'start',
    title: 'Session start',
    narration:
      'This simulation starts with 17k tokens assigned to system instructions, loaded tool definitions, and a rules file. Those values are teaching assumptions. The rules are the part the project author supplies.',
    callout: 'A lean rules file pays rent every single turn.',
    add: FIXED,
  },
  {
    id: 'mcp',
    title: 'MCP servers connect',
    narration:
      'This scenario assumes three MCP servers load their full schemas up front. Tools that defer definitions can have a different footprint; inspect the actual session instead of treating this as a default.',
    callout: 'Deferral can reduce schema overhead; names, instructions, and loaded definitions can still occupy context.',
    add: [
      {
        id: 'mcp-schemas',
        category: 'overhead',
        label: 'MCP tool schemas (3 servers)',
        tokens: 14,
        note: 'Postgres + Linear + Figma adapters. Full tool lists loaded eagerly for this illustrative scenario.',
      },
    ],
  },
  {
    id: 'brief',
    title: 'You describe the task',
    narration:
      'The task brief adds an assumed 1k tokens. The total is now 32k, or 16% of the modeled window; the brief itself occupies half a percent.',
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
      'Six file reads land in full - bodies, not summaries - plus greps and directory listings. In this scenario, exploration produces the first large increase. Real tools may return excerpts or truncated results.',
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
      'Two hypotheses don’t pan out: failed test runs, a reverted edit, stack traces. Their results remain in this modeled window. The rejected hypotheses may be worth preserving, even when the full output is no longer useful.',
    add: [
      {
        id: 'dead-ends',
        category: 'tools',
        label: '2 abandoned hypotheses',
        tokens: 12,
        note: 'Failed test output, a reverted edit, error traces. Retained here until the modeled compaction step.',
      },
    ],
  },
  {
    id: 'delegate',
    title: 'Delegate the log analysis',
    narration:
      'The test-log analysis would dump ~45k of raw logs into the window, so it goes to a subagent instead. The subagent burns those tokens in its own separate window; only its 2k report lands in yours.',
    callout: 'The report reduces what returns to the parent window; the separate work still consumes resources.',
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
      'Edits, diffs, and four modeled test runs bring the total to 100k: half of this simulated window. That occupancy does not establish how well the agent is performing.',
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
      'One careless read of a generated lockfile: 24k tokens of pure noise in a single tool call. An inspection view - where your tool ships one - can reveal the increase. It does not establish that any later mistake was caused by that increase.',
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
      'More modeled turns push this window toward the illustrative threshold. If a real agent repeats a rejected proposal, check whether it has the relevant decision; occupancy alone cannot establish the cause.',
    callout: 'There is no universal occupancy percentage that diagnoses answer quality.',
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
      'This modeled compaction retains standing context and replaces earlier work with a summary and recent turns. A real summary may omit important details, so compare it with the files and saved decisions.',
    callout:
      'Save important proposed changes and decisions as accessible artifacts. Do not assume a summary preserves them exactly.',
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
    title: 'Continue with a smaller window',
    narration:
      'The session continues on a lean window. The agent re-reads the two files that still matter - rather than assuming that the summary contains their current contents. And when this task ships and the next one is unrelated, the right move is a fresh session, not another compact.',
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
