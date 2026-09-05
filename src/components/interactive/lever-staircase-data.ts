/**
 * LeverStaircase — the six context-engineering levers in climb order for
 * the blog post "The Gap".
 *
 * Evergreen widget: encodes the site's own lever model (rules → skills →
 * MCP servers → subagents → hooks → permissions), not vendor behavior.
 * Links point at the foundations chapters that own each lever.
 *
 * KEEP IN SYNC with: blog/the-gap-deepened.mdx "The practice: write it
 * where the agent reads" and the six foundations chapters linked below.
 * Verified 2026-09-02.
 */

export interface Lever {
  key: string;
  name: string;
  cost: string;
  assumes: string;
  firstWin: string;
  href: string;
}

export const levers: Lever[] = [
  {
    key: 'rules',
    name: 'Rules',
    cost: 'An afternoon. Twenty lines in a file the agent reads at startup.',
    assumes: 'Your conventions can be written as flat statements: `pnpm`, not `npm`. Logger, not `console.log`.',
    firstWin: 'The first PR that uses your package manager unprompted.',
    href: '/foundations/rules/',
  },
  {
    key: 'skills',
    name: 'Skills',
    cost: 'A day, once. Package the procedure, not just the fact.',
    assumes: 'The team repeats this workflow — the agent should follow your runbook, not improvise a generic one.',
    firstWin: 'A repeated task comes back done your way, first try.',
    href: '/foundations/skills/',
  },
  {
    key: 'mcp',
    name: 'MCP servers',
    cost: 'A server install plus scopes. The heaviest lift of the middle rungs.',
    assumes: 'The knowledge lives in other systems — Jira, Postgres, Figma — not in the repo.',
    firstWin: 'The agent checks the actual schema itself; you stop copy-pasting `\d users`.',
    href: '/foundations/mcp-servers/',
  },
  {
    key: 'subagents',
    name: 'Subagents',
    cost: 'A config and a prompt per chamber.',
    assumes: 'Exploration is polluting the main thread — the messy search belongs in isolation.',
    firstWin: 'The main line stays clean; the haystack search happens off-stage.',
    href: '/foundations/subagents/',
  },
  {
    key: 'hooks',
    name: 'Hooks',
    cost: 'One hook entry per check. Deterministic, so cheap to reason about.',
    assumes: 'A rule must hold even when the model ignores it — format, lint, the migration rule.',
    firstWin: 'The check fires on every save, no arguing, no forgetting.',
    href: '/foundations/hooks/',
  },
  {
    key: 'permissions',
    name: 'Permissions',
    cost: 'A permissions block, decided once, reviewed rarely.',
    assumes: 'The agent now touches real systems — the blast radius must be bounded before autonomy.',
    firstWin: 'The first autonomous run that could not have hurt anything.',
    href: '/foundations/permissions/',
  },
];

export const staircaseCopy = {
  title: 'The levers, in climb order',
  climb: 'Climb in this order — each rung assumes the ones below it.',
  costLabel: 'Cost',
  assumesLabel: 'Assumes',
  firstWinLabel: 'First win',
  read: 'Read the chapter →',
};
