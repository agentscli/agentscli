/**
 * Autonomy-dial widget data. Evergreen — no vendor facts. Encodes the
 * match-autonomy-to-stakes judgment: two properties of a task
 * (reversibility of the worst single action × how far consequences reach)
 * pick a rung on a generic trust ladder. Rung names are deliberately
 * tool-agnostic; each embedding lesson's prose maps them to that tool's
 * real modes. Keep the ladder's shape consistent with the permission
 * chapters in foundations/permissions.mdx.
 */

export type RungId =
  | 'full-auto'
  | 'fenced-auto'
  | 'auto-edit'
  | 'ask-all'
  | 'readonly';

export interface Rung {
  id: RungId;
  label: string;
  /** What the rung actually is, one breath */
  desc: string;
  /** True for the rung the dial never recommends on a real machine */
  never?: boolean;
}

/** Loosest first — rendered top-down as a ladder */
export const adlRungs: Rung[] = [
  {
    id: 'full-auto',
    label: 'Run free, no fence',
    desc: 'Nothing pauses it and nothing contains it. No combination on this dial lands here — it belongs only where the whole environment is disposable: a throwaway container, an already-isolated CI runner.',
    never: true,
  },
  {
    id: 'fenced-auto',
    label: 'Run free inside a fence',
    desc: 'No prompts; the boundary does the protecting. The agent grinds end to end inside a sandbox, container, or scratch worktree, and you review the whole batch once at the end.',
  },
  {
    id: 'auto-edit',
    label: 'Auto-apply edits, gate the rest',
    desc: 'Project-local edits flow without asking; commands, state changes, and anything beyond the project still stop for a yes. The natural posture for supervised, hands-on iteration.',
  },
  {
    id: 'ask-all',
    label: 'Ask before acting',
    desc: 'Every write and every command pauses for your explicit yes. Slower by design — the checkpoint is the point.',
  },
  {
    id: 'readonly',
    label: 'Read & propose only',
    desc: 'The agent can look but not touch. It drafts the change, the commands, the plan; a human — or a separately gated pipeline — performs them.',
  },
];

export interface AxisOption {
  id: string;
  label: string;
  hint: string;
}

/** "If the agent's worst single action went wrong, undoing it would take…" */
export const adlReversibility: AxisOption[] = [
  {
    id: 'undoable',
    label: 'a `git checkout`',
    hint: 'the change lives in tracked files; the floor holds',
  },
  {
    id: 'costly',
    label: 'real work',
    hint: 'a migrated database, regenerated files, a rebased branch',
  },
  {
    id: 'irreversible',
    label: 'a miracle',
    hint: 'a send, a deploy, a delete with no backup',
  },
];

/** "…and its consequences would reach" */
export const adlBlast: AxisOption[] = [
  {
    id: 'local',
    label: 'your working copy',
    hint: 'one repo, one machine, nobody downstream',
  },
  {
    id: 'shared',
    label: 'what the team shares',
    hint: 'a library others consume, common infra, shared data',
  },
  {
    id: 'outward',
    label: 'beyond the machine',
    hint: 'production, customers, money, the public',
  },
];

export interface Cell {
  rung: RungId;
  /** The concrete task this combination looks like, plus the judgment */
  reading: string;
}

/** Keyed `${reversibility}/${blast}` */
export const adlCells: Record<string, Cell> = {
  'undoable/local': {
    rung: 'fenced-auto',
    reading:
      'A mechanical rename across your own repo is the canonical case: the worst outcome is a `git diff` you throw away. Prompting on every one of twenty-four identical edits doesn’t add safety — it teaches you to stop reading prompts, which is where real risk starts. Let it run inside the fence and review the batch once.',
  },
  'undoable/shared': {
    rung: 'auto-edit',
    reading:
      'Refactoring a shared library, in git: every edit is one `checkout` from undone, so let the edits flow — but the downstream consumers make the review non-negotiable, and any command that publishes or migrates is worth a pause. Cheap to undo is not the same as cheap to have shipped.',
  },
  'undoable/outward': {
    rung: 'ask-all',
    reading:
      'Editing deploy config or infrastructure code in git is the trap cell: the file is version-controlled, the apply is not. Reverting the edit doesn’t un-provision what it created. Gate the step where the tracked change becomes an outward action — that step is the real move, not the edit.',
  },
  'costly/local': {
    rung: 'auto-edit',
    reading:
      'Work that mutates local state beyond git — a dev-database migration, regenerated fixtures — earns a split posture: edits auto-apply, the state-changing commands stop and ask. Restoring a mangled dev DB isn’t a catastrophe, but it is an afternoon, and an afternoon is worth a prompt.',
  },
  'costly/shared': {
    rung: 'ask-all',
    reading:
      'Shared state that takes real work to rebuild — team seed data, common dev infra — is where most tools put their default, and this is why: ask-before-acting is the posture that’s rarely badly wrong in either direction. Loosen it per task when a safer cell genuinely applies, not as a standing habit.',
  },
  'costly/outward': {
    rung: 'ask-all',
    reading:
      'A staging environment other people test against is “recoverable” only on paper — the restore is yours to do while everyone downstream waits. Every action gets read before it runs. If the prompts feel relentless, shrink the task or move the work inside a fence; don’t skip the reading.',
  },
  'irreversible/local': {
    rung: 'ask-all',
    reading:
      '“It’s only my machine” doesn’t make a delete safe: untracked files, local secrets, anything without a backup has no floor under it. It was reversibility, not location, that earned the other cells their leash. Keep every destructive command behind a yes — and behind a hard deny where the tool supports one.',
  },
  'irreversible/shared': {
    rung: 'readonly',
    reading:
      'Rewriting shared branch history or dropping a shared table is the kind of mistake a team remembers. The agent’s leverage here is drafting — the exact commands, the migration script, the checklist — while a human runs them. An approval prompt you might wave through at 5pm is a checkpoint; this wants a wall.',
  },
  'irreversible/outward': {
    rung: 'readonly',
    reading:
      'Sends, deploys, payments, anything a customer sees: one wrong action outlives every apology. The agent proposes; a human — or a separately gated pipeline — disposes. If that feels too slow, the answer is a safer path to the same outcome (feature flags, staged rollout), not more agent autonomy.',
  },
};
