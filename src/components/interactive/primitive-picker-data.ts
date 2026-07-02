/**
 * Primitive picker — "I want the agent to…" statements routed to the
 * right foundations chapter. Condenses the per-chapter "Why this and
 * not…" tables into one navigation surface; keep the reasoning
 * consistent with those tables and the cost profiles defined in
 * foundations/how-agents-work.mdx.
 */

export type CostProfile = 'always-loaded' | 'on-demand' | 'isolated';

export interface PrimitiveEntry {
  id: string;
  statement: string;
  primitive: string;
  href: string;
  cost?: CostProfile;
  why: string;
  notThis: string;
}

export const primitiveEntries: PrimitiveEntry[] = [
  {
    id: 'rules',
    statement: 'It should always know a fact about this repo',
    primitive: 'Rules',
    href: '/foundations/rules/',
    cost: 'always-loaded',
    why: 'A rules file (`CLAUDE.md` / `AGENTS.md`) is reloaded every turn and survives every compaction — the one durable slot you own. “We use pnpm, not npm” belongs here.',
    notThis:
      'Saying it in chat. A fact stated in conversation can be summarised away an hour later.',
  },
  {
    id: 'skills',
    statement: 'There’s a procedure it should follow when the situation comes up',
    primitive: 'Skills',
    href: '/foundations/skills/',
    cost: 'on-demand',
    why: 'A skill’s description is always visible, but its body loads only when relevant — a release checklist, a migration recipe, a review protocol, at near-zero standing cost.',
    notThis:
      'Putting the procedure in the rules file, where it pays window rent every single turn whether or not it’s needed.',
  },
  {
    id: 'mcp',
    statement: 'It needs to reach an external system — tickets, database, browser, designs',
    primitive: 'MCP servers',
    href: '/foundations/mcp-servers/',
    why: 'A typed adapter the agent calls itself: `jira.get_ticket`, `postgres.query`, a browser. The integration moves from “you, by hand” to “the agent, in-flow.”',
    notThis:
      'Switching tabs and pasting the contents in — you as the integration layer, every session, forever.',
  },
  {
    id: 'hooks',
    statement: 'There’s a rule it must never break, even when it wants to',
    primitive: 'Hooks',
    href: '/foundations/hooks/',
    why: 'A gating hook sits inside the loop but outside the model’s reasoning — the tool call to push to main simply doesn’t complete, no matter how convinced the model is.',
    notThis:
      'Bold text in the rules file. Prose informs; it doesn’t enforce. The model can still ignore it.',
  },
  {
    id: 'subagents',
    statement: 'A noisy sub-task would trash my window',
    primitive: 'Subagents',
    href: '/foundations/subagents/',
    cost: 'isolated',
    why: 'The sub-task runs in its own fresh window and returns only a summary. Forty-five thousand tokens of log-reading never touch your context.',
    notThis:
      'Doing it inline and compacting afterwards — by then the noise has already crowded out the signal.',
  },
  {
    id: 'plan-mode',
    statement: 'I want to approve the approach before it touches anything',
    primitive: 'Plan mode',
    href: '/foundations/plan-mode/',
    why: 'A read-only posture: the agent explores and proposes, you approve or redirect, then it executes. Pacing for work where the approach matters more than the speed.',
    notThis: 'Watching the diffs fly by and hoping you can unwind the bad ones.',
  },
  {
    id: 'permissions',
    statement: 'Limit what it can do without asking me',
    primitive: 'Permissions',
    href: '/foundations/permissions/',
    why: 'Declarative policy — allow the reads and the test runs, ask on `git push`, deny `rm -rf` outright. Checked in, so the whole team gets the same guardrails.',
    notThis:
      'Trusting the agent to remember you said “don’t push” three sessions ago. That’s what rules are for — and enforcement isn’t their job either.',
  },
  {
    id: 'slash-commands',
    statement: 'I keep retyping the same prompt',
    primitive: 'Slash commands',
    href: '/foundations/slash-commands/',
    why: 'A saved prompt with arguments, invoked as `/name`. The zero-friction end of the reuse spectrum.',
    notThis:
      'Retyping it — or reaching for a skill when all you need is a stored prompt, not a procedure.',
  },
  {
    id: 'context',
    statement: 'A long session is getting hazy',
    primitive: 'Context window management',
    href: '/foundations/context-management/',
    why: 'Inspect what’s eating the window, compact at phase boundaries, resume instead of re-explaining. The levers for operating within a finite window.',
    notThis:
      'Opening a fresh session and rebuilding an hour of context from memory — yours, since the agent’s is gone.',
  },
  {
    id: 'model',
    statement: 'This task doesn’t need the expensive model',
    primitive: 'Model selection',
    href: '/foundations/model-selection/',
    why: 'Match the model tier to the task — a cheap fast model for mechanical edits, the strong one for architecture. Pinnable per project so the team defaults sensibly.',
    notThis: 'One model for everything, priced for the hardest task you ever do.',
  },
  {
    id: 'headless',
    statement: 'Run it unattended — CI, cron, one-off batch jobs',
    primitive: 'Headless & CI',
    href: '/foundations/headless/',
    why: 'Every CLI has a non-interactive mode (`claude -p`, `codex exec`, `opencode run`) with structured output and preset permissions — the loop as a build step.',
    notThis: 'Babysitting a terminal, or scripting the TUI with expect.',
  },
  {
    id: 'plugins',
    statement: 'Ship this whole setup to my team',
    primitive: 'Plugins & marketplaces',
    href: '/foundations/plugins/',
    why: 'Bundle skills, commands, hooks, and MCP registrations into one installable unit with versioning, instead of a config scavenger hunt.',
    notThis: 'A wiki page asking everyone to copy five config files by hand.',
  },
];
