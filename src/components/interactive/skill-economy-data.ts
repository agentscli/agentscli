/**
 * Items for the skill-economy widget. Evergreen - no vendor facts.
 * The model: a rules-file line pays its tokens in the window every session;
 * a skill pays a small stub (name + description) every session and its body
 * only in the sessions that invoke it; a plain prompt pays nothing until the
 * moment it's needed - and again every time after that. Token numbers are
 * illustrative and coarse on purpose - the shape is the point.
 */

/** Sessions assumed per working week, for the ledger arithmetic */
export const SKE_SESSIONS_PER_WEEK = 10;

/** Always-in-view cost of a skill's menu line (name + description), tokens */
export const SKE_STUB_TOKENS = 25;

export type SkeHome = 'rule' | 'skill' | 'prompt';

export type SkeKind = 'fact' | 'procedure' | 'oneoff';

export interface SkeVerdict {
  /** Chip label shown for this placement */
  chip: string;
  tone: 'good' | 'warn';
  /** One-line explanation of the verdict */
  why: string;
}

export interface SkeItem {
  id: string;
  /** Short row title */
  label: string;
  /** The knowledge itself, as you'd write it down */
  text: string;
  /** What kind of knowledge this is - drives the cost model */
  kind: SkeKind;
  /** Human-readable cadence, shown next to the label */
  cadence: string;
  /** Size of the full write-up, in tokens */
  tokens: number;
  /** Sessions per week that actually need it */
  usesPerWeek: number;
  /** The placement that wins */
  best: SkeHome;
  verdicts: Record<SkeHome, SkeVerdict>;
}

export const SKE_HOME_LABELS: Record<SkeHome, string> = {
  rule: 'rules file',
  skill: 'skill',
  prompt: 'prompt',
};

export const skeItems: SkeItem[] = [
  {
    id: 'money-cents',
    label: 'cents, not floats',
    text: 'Money is integer cents - `amountCents: number`, never floats.',
    kind: 'fact',
    cadence: 'fact · matters most sessions',
    tokens: 22,
    usesPerWeek: 10,
    best: 'rule',
    verdicts: {
      rule: {
        chip: 'right home',
        tone: 'good',
        why: 'Twenty-two tokens a session and the float bug is extinct. A fact the agent must hold while writing any code has to be in view before it starts - that’s the rules file.',
      },
      skill: {
        chip: 'never fires',
        tone: 'warn',
        why: 'A fact isn’t an occasion. There’s no moment where the agent thinks “now I should invoke the money rule” - it just writes `19.99` with the skill sitting unloaded. Facts don’t fire; they have to already be there.',
      },
      prompt: {
        chip: 're-taught forever',
        tone: 'warn',
        why: 'You’ll say “cents, not floats” in every session that touches money - and the session you forget is the one that ships a float.',
      },
    },
  },
  {
    id: 'release-checklist',
    label: 'release checklist',
    text: 'The release ritual: bump the version, regenerate the changelog, tag, build, smoke-test - fifteen steps in a fixed order.',
    kind: 'procedure',
    cadence: 'procedure · runs ~2×/week',
    tokens: 1200,
    usesPerWeek: 2,
    best: 'skill',
    verdicts: {
      rule: {
        chip: 'idle rent',
        tone: 'warn',
        why: 'Fifteen steps loaded into every session to be used twice a week. The other eight sessions pay 1.2k tokens for a procedure that never runs - bulk that competes with your real rules for attention.',
      },
      skill: {
        chip: 'right home',
        tone: 'good',
        why: 'The agent sees one menu line every session; the fifteen steps load only in the two sessions that release. Same knowledge, under a quarter of the window cost.',
      },
      prompt: {
        chip: 'you’re the memory',
        tone: 'warn',
        why: 'Pasting the steps costs about what the skill costs in tokens - but now you hold the checklist, and the step you skip under deadline is the one that bites.',
      },
    },
  },
  {
    id: 'migration-recipe',
    label: 'migration recipe',
    text: 'Schema migrations follow expand → backfill → contract, with a fixture check and a written rollback plan.',
    kind: 'procedure',
    cadence: 'procedure · runs ~2×/month',
    tokens: 900,
    usesPerWeek: 0.5,
    best: 'skill',
    verdicts: {
      rule: {
        chip: 'idle rent',
        tone: 'warn',
        why: 'Twenty sessions pay 900 tokens each for every one that migrates. The rarer the procedure, the worse a rules file suits it.',
      },
      skill: {
        chip: 'right home',
        tone: 'good',
        why: 'Rare is what skills are for: a 25-token stub keeps it reachable in every session, and the body loads only in the odd session that actually migrates.',
      },
      prompt: {
        chip: 'you’re the memory',
        tone: 'warn',
        why: 'Every other month you’ll reconstruct the expand-backfill-contract dance from memory - and the rollback plan is the part that gets dropped.',
      },
    },
  },
  {
    id: 'todays-flake',
    label: 'today’s flake',
    text: 'Today’s job: chase the flaky auth test in `login.spec.ts`.',
    kind: 'oneoff',
    cadence: 'one-off · this week only',
    tokens: 25,
    usesPerWeek: 1,
    best: 'prompt',
    verdicts: {
      rule: {
        chip: 'rent for a one-off',
        tone: 'warn',
        why: 'True this week, noise forever after. Next month the agent still “knows” about a flake that’s long fixed.',
      },
      skill: {
        chip: 'menu clutter',
        tone: 'warn',
        why: 'A skill for a situation that happens once. It never fires again - but its stub sits on the menu in every session from now on.',
      },
      prompt: {
        chip: 'right home',
        tone: 'good',
        why: 'Say it, fix it, done. Knowledge that expires with the task never needs a permanent home.',
      },
    },
  },
];
