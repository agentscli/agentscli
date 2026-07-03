/**
 * Constraints for the guarantee-ladder widget. Evergreen — no vendor facts.
 * Encodes the enforcement ladder from the course hooks-vs lessons
 * (claude-code/extending/hooks-vs.mdx, codex/extending/hooks-vs.mdx,
 * opencode/extending/plugins-hooks.mdx): a rule informs the model
 * (probabilistic, lives in the window), a permission forbids a named class
 * (harness-enforced), a hook enforces a condition on the real action
 * (deterministic code on the rail). Each home's guarantee is stress-tested
 * against three situations — watching, hour-three post-compaction,
 * unattended at 2am — because what holds while you watch isn't what holds
 * with nobody in the loop. Home names are deliberately generic; each
 * embedding lesson's prose maps them to that tool's real surfaces.
 */

export type GldHome = 'rule' | 'permission' | 'hook';

export type GldSituation = 'watch' | 'late' | 'afk';

/**
 * What kind of guarantee a constraint gets from a given home — drives the
 * per-situation status. `judgment`: the model weighs it. `wall`: the harness
 * (or your code) blocks a named class. `code`: deterministic code checks the
 * real action. `blocksWork`: technically holds, by forbidding work you
 * wanted done. `unexpressed`: this home has no way to say it.
 */
export type GldKind = 'judgment' | 'wall' | 'code' | 'blocksWork' | 'unexpressed';

export interface GldCell {
  kind: GldKind;
  /** One-line explanation of what this placement buys (or doesn't) */
  why: string;
}

export interface GldConstraint {
  id: string;
  /** Short row title */
  label: string;
  /** The shape of the constraint, shown next to the label — hints the home */
  shape: string;
  /** The constraint as you'd say it */
  text: string;
  /** True when a silent miss is expensive (data loss, leaked secret) */
  highStakes: boolean;
  /** The home that wins */
  best: GldHome;
  cells: Record<GldHome, GldCell>;
}

export const GLD_HOME_LABELS: Record<GldHome, string> = {
  rule: 'rule',
  permission: 'permission',
  hook: 'hook',
};

export const GLD_SITUATIONS: { id: GldSituation; label: string }[] = [
  { id: 'watch', label: 'you’re watching' },
  { id: 'late', label: 'hour three · compacted' },
  { id: 'afk', label: 'unattended · 2am' },
];

export const gldConstraints: GldConstraint[] = [
  {
    id: 'fragile',
    label: 'the fragile module',
    shape: 'a preference · low stakes',
    text: 'The auth module is fragile — prefer minimal, surgical diffs there.',
    highStakes: false,
    best: 'rule',
    cells: {
      rule: {
        kind: 'judgment',
        why: '“Minimal and surgical” is a judgment call, not a checkable condition. You want the model informed and weighing it — and your diff review is the backstop for the times it doesn’t.',
      },
      permission: {
        kind: 'blocksWork',
        why: 'A deny on the module would hold — by making the work you wanted done impossible. “Careful” isn’t a tool class; a wall can only say never.',
      },
      hook: {
        kind: 'unexpressed',
        why: 'A hook needs a yes/no it can compute from the payload, and no script measures care. The preference goes unprotected while looking guarded.',
      },
    },
  },
  {
    id: 'secrets',
    label: 'the secrets wall',
    shape: 'a never · high stakes',
    text: 'The agent must never read `secrets/`.',
    highStakes: true,
    best: 'permission',
    cells: {
      rule: {
        kind: 'judgment',
        why: 'An instruction the model weighs — so “never” actually means “unless a debugging trail leads there after the line compacted out.” Walls that matter don’t get to be suggestions.',
      },
      permission: {
        kind: 'wall',
        why: '“Never touch this path” names a class of action — exactly what a deny expresses. The harness enforces it: no judgment, no memory, no 2am exception.',
      },
      hook: {
        kind: 'wall',
        why: 'A pre-read hook can block the path — you’re writing code to rebuild what a one-line deny gives you, and now the wall is only as good as your matcher’s coverage.',
      },
    },
  },
  {
    id: 'ledger',
    label: 'the tested-commit gate',
    shape: 'a condition on content · high stakes',
    text: 'No commit that touches money code unless the money tests pass.',
    highStakes: true,
    best: 'hook',
    cells: {
      rule: {
        kind: 'judgment',
        why: 'It works all morning, which is what makes it dangerous. The line compacts out at hour three, and the untested commit lands at 2am with nobody to catch it.',
      },
      permission: {
        kind: 'unexpressed',
        why: 'There’s no tool to forbid — committing is allowed, and should be. The condition lives inside this specific commit’s content, which a tool-name wall never inspects.',
      },
      hook: {
        kind: 'code',
        why: 'Deterministic code inspects the actual commit at the moment it’s attempted and fails it if the tests didn’t pass. The model’s memory, mood, and context budget are all out of the loop.',
      },
    },
  },
  {
    id: 'format',
    label: 'the every-time formatter',
    shape: 'an every-time · low stakes',
    text: 'Every file the agent writes gets formatted — every time, not most times.',
    highStakes: false,
    best: 'hook',
    cells: {
      rule: {
        kind: 'judgment',
        why: 'The model formats when it remembers, and “every time” done by memory is “most times.” No single miss hurts; the drift and the diff noise pile up.',
      },
      permission: {
        kind: 'unexpressed',
        why: 'Permissions gate what the agent proposes; they can’t make an action happen. There’s no allow-rule that runs a formatter.',
      },
      hook: {
        kind: 'code',
        why: 'Enforcement isn’t only blocking: fired on every write, the formatter runs whether or not the model thought of it. “This always happens” is a hook too.',
      },
    },
  },
];
