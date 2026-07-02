/**
 * Candidate lines for the rule-economy widget. Evergreen — no vendor facts.
 * Token numbers are illustrative: a rule line costs its tokens in the window
 * every session; a durable fact the agent would otherwise get wrong costs a
 * re-teach cycle (wrong attempt + correction + redo) most sessions. The
 * arithmetic is coarse on purpose — the shape is the point.
 */

/** Sessions assumed per working week, for the ledger arithmetic */
export const RLE_SESSIONS_PER_WEEK = 10;

export type RleClass = 'durable' | 'oneoff' | 'known';

export interface RleLine {
  id: string;
  /** The line as it would appear in the rules file */
  text: string;
  /** Window cost of the line, in tokens, paid every session */
  tokens: number;
  cls: RleClass;
  /** Chip label shown when the line is in the file */
  verdict: string;
  /** One-line explanation of the verdict */
  why: string;
  /** Tokens of re-teaching avoided across a week, if the line is in the file */
  savedPerWeek: number;
}

export const RLE_CLASS_META: Record<
  RleClass,
  { chip: string; tone: 'good' | 'warn' }
> = {
  durable: { chip: 'earns its slot', tone: 'good' },
  oneoff: { chip: 'one week of value, rent forever', tone: 'warn' },
  known: { chip: 'the model already knows', tone: 'warn' },
};

export const rleLines: RleLine[] = [
  {
    id: 'test-cmd',
    text: 'Tests run with `npm test -- --runInBand` — parallel runs deadlock the test DB.',
    tokens: 34,
    cls: 'durable',
    verdict: 'earns its slot',
    why: 'Without it, the agent runs plain `npm test`, hits the deadlock, and you explain — most sessions. One line ends that forever.',
    savedPerWeek: 5600,
  },
  {
    id: 'pkg-mgr',
    text: 'Use `pnpm`, never `npm` — the lockfile is pnpm’s and `npm install` corrupts it.',
    tokens: 30,
    cls: 'durable',
    verdict: 'earns its slot',
    why: 'A wrong guess here costs a broken lockfile and a cleanup. Durable, project-specific, invisible from the code until it bites.',
    savedPerWeek: 4200,
  },
  {
    id: 'error-pattern',
    text: 'Route handlers never throw — return `Result<T, AppError>` from `src/lib/result.ts`.',
    tokens: 36,
    cls: 'durable',
    verdict: 'earns its slot',
    why: 'A convention the agent can’t infer from one file. Un-taught, it writes idiomatic-but-wrong code you correct in review, every time.',
    savedPerWeek: 4800,
  },
  {
    id: 'todays-bug',
    text: 'The bug we’re fixing today is in `src/billing/charge.ts`.',
    tokens: 18,
    cls: 'oneoff',
    verdict: 'one week of value, rent forever',
    why: 'True today, noise tomorrow, misleading next month. Say it in the prompt — it doesn’t belong in a file every future session loads.',
    savedPerWeek: 700,
  },
  {
    id: 'current-task',
    text: 'Current sprint: migrate the users table to UUID keys.',
    tokens: 16,
    cls: 'oneoff',
    verdict: 'one week of value, rent forever',
    why: 'Session-scoped state in a permanent file. The sprint ends; the line stays; three months later the agent “helpfully” resumes a dead migration.',
    savedPerWeek: 500,
  },
  {
    id: 'clean-code',
    text: 'Write clean, readable code with good variable names.',
    tokens: 14,
    cls: 'known',
    verdict: 'the model already knows',
    why: 'The model does this by default. The line buys nothing — it just competes with your real rules for attention.',
    savedPerWeek: 0,
  },
  {
    id: 'be-careful',
    text: 'Think step by step and be careful about edge cases.',
    tokens: 14,
    cls: 'known',
    verdict: 'the model already knows',
    why: 'Generic exhortations don’t change behaviour; specific facts do. This is window space spent restating the default.',
    savedPerWeek: 0,
  },
];
