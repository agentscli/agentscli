import type { TrBeat, TrBlock, TrChoice, TrScript } from './terminal-replay';

/**
 * Script for the NightShift scene (runs on the terminal-replay engine).
 * Evergreen — no vendor facts; generic checks (build, types, unit suite,
 * end-to-end) that the embedding lessons map to each tool's spelling (a CI
 * step, a test command in the loop, a verifier subagent). Encodes the
 * unattended-trust argument from the course automation chapters
 * (claude-code/automation/loops.mdx, codex/automation/ci.mdx,
 * copilot/automation/draft-prs.mdx, cursor/cli-headless-ci/index.mdx,
 * opencode/share-and-headless/server-and-ci.mdx, pi/subagents/the-verifier.mdx):
 * with nobody watching, an agent's "done" is a claim, and each verifier wired
 * into the run converts one class of silent failure into a caught one. The
 * flaw rate is theatrically high on purpose; the residual — a misread ticket
 * that passes every machine check — is the honest ceiling of the night shift.
 * Successor to the retired VerifierLoop toggle widget (same nine chores, same
 * argument, replayed as a night instead of tabulated).
 *
 * Uses the engine's non-meter mode: no capacity/values (the panel is a report,
 * not a gauge) and scene-defined slot colors — gray = the worker's own word,
 * green = held up, blue = caught red and retried, amber = stopped and flagged,
 * red = shipped broken.
 */

type NsStatus = 'claim' | 'true' | 'fixed' | 'flagged' | 'broken';

const TASKS = [
  { id: 'rename', label: 'the rename sweep' },
  { id: 'depbump', label: 'the dependency bump' },
  { id: 'nullguard', label: 'the null guard' },
  { id: 'pagination', label: 'the pagination fix' },
  { id: 'dedup', label: 'the dedup tightening' },
  { id: 'webhook', label: 'the webhook handoff' },
  { id: 'authheader', label: 'the header propagation' },
  { id: 'errorcopy', label: 'the error-copy pass' },
  { id: 'misread', label: 'the “retry 3×” ticket' },
] as const;

type NsId = (typeof TASKS)[number]['id'];

const STATUS_TEXT: Record<NsStatus, string> = {
  claim: '— “done”',
  true: '— done, true',
  fixed: '— caught red, retried',
  flagged: '— stopped, flagged for you',
  broken: '— “done,” broken',
};

/** The full nine-row report, every row 'claim' unless overridden. */
const report = (overrides: Partial<Record<NsId, NsStatus>> = {}): TrBlock[] =>
  TASKS.map((t) => {
    const status = overrides[t.id] ?? 'claim';
    return { id: t.id, slot: status, label: `${t.label} ${STATUS_TEXT[status]}` };
  });

const claims = (...ids: NsId[]): TrBlock[] =>
  TASKS.filter((t) => ids.includes(t.id)).map((t) => ({
    id: t.id,
    slot: 'claim',
    label: `${t.label} ${STATUS_TEXT.claim}`,
  }));

const intro: TrBeat[] = [
  {
    lines: [
      { kind: 'sys', text: 'overnight batch · repo: ledger-app · 9 chores queued · nobody watching' },
      { kind: 'user', text: 'run tonight’s list — report in the morning' },
    ],
    panel: {
      note: 'The panel is the morning report — the only thing you’ll read when you wake up. Right now nothing is wired into the run to check what goes into it.',
    },
    holdMs: 600,
  },
  {
    lines: [
      { kind: 'tool', text: 'rename Charge → Payment across 41 files … done' },
      { kind: 'tool', text: 'bump the HTTP client a major version … done' },
      { kind: 'tool', text: 'guard the missing-account case in statement export … done' },
    ],
    panel: {
      add: claims('rename', 'depbump', 'nullguard'),
      note: 'Three checkmarks in. Notice what each one is made of: the worker’s own word, and nothing else.',
    },
    holdMs: 500,
  },
  {
    lines: [
      { kind: 'tool', text: 'stop the transaction list dropping its last page … done' },
      { kind: 'tool', text: 'tighten dedup on the monthly totals … done' },
      { kind: 'tool', text: 'emit the import-complete event for the notifier … done' },
    ],
    panel: {
      add: claims('pagination', 'dedup', 'webhook'),
      note: 'Six for six. Some of these are genuinely done — the report gives you no way to tell which.',
    },
    holdMs: 500,
  },
  {
    lines: [
      { kind: 'tool', text: 'thread the request ID through the export calls … done' },
      { kind: 'tool', text: 'rewrite the four cryptic import-failure messages … done' },
      { kind: 'tool', text: 'retry failed imports up to 3 times … done' },
    ],
    panel: {
      add: claims('authheader', 'errorcopy', 'misread'),
      note: 'The last row is quietly the most dangerous one on the board: the ticket never said whether “3” counts the first attempt. The agent picked a reading. The report doesn’t mention that.',
    },
    holdMs: 600,
  },
  {
    lines: [
      { kind: 'sys', text: '⎿ batch complete · 02:47 · report: 9/9 done' },
      { kind: 'agent', text: 'All nine chores landed cleanly. Ready to merge.' },
    ],
    panel: {
      note: 'Nine for nine, and the only witness is the worker. That’s not a disaster — it’s an unfalsifiable claim. What you do next decides what these checkmarks are worth.',
    },
    holdMs: 900,
  },
];

const choices: TrChoice[] = [
  {
    id: 'ship',
    button: 'ship it — nine greens',
    replay: 'replay: ship unverified',
    verdictTone: 'bad',
    verdict:
      'Nine checkmarks, and the only witness was the worker. Shipping that report isn’t a disaster because everything breaks — two rows were genuinely done — it’s a disaster because nothing in it distinguishes the true rows from the false ones. Unverified “done” doesn’t remove the checking work; it moves it downstream, to production and the people who read the numbers, on the least convenient schedule available.',
    beats: [
      {
        lines: [
          { kind: 'user', text: 'looks green — merge it' },
          { kind: 'tool', text: 'merge batch → main' },
          { kind: 'sys', text: '— the next morning —' },
        ],
        panel: {
          note: 'Nine claims are now nine commits. The checks you didn’t wire overnight don’t disappear — they get outsourced to production, on its schedule.',
        },
        holdMs: 600,
      },
      {
        lines: [
          { kind: 'warn', text: 'CI on main: build red — retryOptions was renamed in v8, 3 call sites don’t compile' },
          { kind: 'warn', text: 'crash report: statement export returns undefined where a report object is expected' },
        ],
        panel: {
          clearExcept: [],
          add: report({ depbump: 'broken', nullguard: 'broken' }),
          note: 'The cheap failures surface first — anything a compiler or type checker would have named in one red line overnight is instead a broken main branch at 9am.',
        },
        holdMs: 700,
      },
      {
        lines: [
          { kind: 'sys', text: '— three weeks later —' },
          { kind: 'warn', text: 'finance: monthly totals are off — legitimate twin payments are being merged' },
          { kind: 'warn', text: 'support: last page of transactions renders twice · the notifier has been silent since the import change' },
        ],
        panel: {
          clearExcept: [],
          add: report({
            depbump: 'broken',
            nullguard: 'broken',
            pagination: 'broken',
            dedup: 'broken',
            webhook: 'broken',
          }),
          note: 'The logic and seam failures don’t announce themselves — they get discovered by the people downstream of the numbers, weeks after the checkmark.',
        },
        holdMs: 700,
      },
      {
        lines: [
          { kind: 'sys', text: '— the retro —' },
          { kind: 'warn', text: 'ticket author: “retry up to 3 times” meant 3 attempts total — the agent shipped 4' },
          { kind: 'warn', text: 'traces: one export call is missing its request ID; nobody noticed until an incident needed it' },
        ],
        panel: {
          clearExcept: [],
          add: report({
            rename: 'true',
            depbump: 'broken',
            nullguard: 'broken',
            pagination: 'broken',
            dedup: 'broken',
            webhook: 'broken',
            authheader: 'broken',
            errorcopy: 'true',
            misread: 'broken',
          }),
          note: 'The final tally: two of nine were true. The report said nine. Every verdict on this board got re-derived by a human, the expensive way — which is the work the overnight run was supposed to take off you.',
        },
        holdMs: 800,
      },
    ],
  },
  {
    id: 'floor',
    button: 're-run: build + types',
    replay: 'replay: build + types',
    verdictTone: 'bad',
    verdict:
      'This is the trap state, and it feels like progress. Whatever fails loudly at compile or type level now dies overnight against a named error — that’s worth wiring, always. But the duplicate last page, the merged twin payments, the event the notifier never receives, the misread ticket: every one of them compiles cleanly, so every one of them just shipped with more confidence behind it. A lint-green pipeline doesn’t reduce silent failures — it makes them feel checked.',
    beats: [
      {
        lines: [
          { kind: 'user', text: 'wire build + types into the run, then re-queue' },
          { kind: 'sys', text: 'overnight batch · re-run · wired: build, types & lint' },
        ],
        panel: {
          note: 'Same nine chores, but now two checks stand between the worker’s word and the report.',
        },
        holdMs: 500,
      },
      {
        lines: [
          { kind: 'warn', text: 'build red — retryOptions renamed in v8, 3 call sites don’t compile' },
          { kind: 'tool', text: 'retry with the exact error in hand … build green' },
        ],
        panel: {
          clearExcept: [],
          add: report({ depbump: 'fixed' }),
          note: 'A red build is the easiest fix an agent ever gets: the error names the file, the line, and the renamed option. First attempt broken, second attempt in the report.',
        },
        holdMs: 600,
      },
      {
        lines: [
          { kind: 'warn', text: 'types red — statement export returns undefined, caller expects a report object' },
          { kind: 'tool', text: 'retry against the named mismatch … types green' },
        ],
        panel: {
          clearExcept: [],
          add: report({ depbump: 'fixed', nullguard: 'fixed' }),
          note: '“Done” just upgraded from an opinion to “the code holds together.” That’s real — and it’s also the entire upgrade.',
        },
        holdMs: 600,
      },
      {
        lines: [
          { kind: 'sys', text: '⎿ batch complete · 03:12 · report: 9/9 done · build ✓ types ✓' },
          { kind: 'agent', text: 'All nine chores landed cleanly. Ready to merge.' },
        ],
        panel: {
          note: 'The report is exactly as green as before — nine for nine either way. Look at the seven rows that never went red: a valid program and a correct program are different claims, and nothing overnight tested the second one.',
        },
        holdMs: 900,
      },
    ],
  },
  {
    id: 'stack',
    button: 're-run: the full stack',
    replay: 'replay: the full stack',
    verdictTone: 'good',
    verdict:
      'This is the report worth waking up to — not because it’s all green, but because every green had to get past something. Wiring the stack bought you “the code does what the checks say”: reds retried against named errors, a seam break flagged honestly with its trace instead of bluffed through. What it cannot buy is “the checks say what the ticket meant” — the misread ticket shipped green through all four layers. That’s the division of labour: the night shift verifies every claim somebody encoded; your morning review owns the claims nobody did.',
    beats: [
      {
        lines: [
          { kind: 'user', text: 'wire the full stack — build, types, suite, end-to-end' },
          { kind: 'sys', text: 'overnight batch · re-run · wired: build · types · unit suite · end-to-end' },
        ],
        panel: {
          note: 'Four layers now stand between the worker’s word and the report — each one converts a different class of silent failure into a caught one.',
        },
        holdMs: 500,
      },
      {
        lines: [
          { kind: 'warn', text: 'build red — renamed option, 3 call sites · retried … green' },
          { kind: 'warn', text: 'types red — undefined return in statement export · retried … green' },
        ],
        panel: {
          clearExcept: [],
          add: report({ depbump: 'fixed', nullguard: 'fixed' }),
          note: 'The floor checks fire first and cost seconds: the loudest signals a retry can get.',
        },
        holdMs: 600,
      },
      {
        lines: [
          { kind: 'warn', text: 'suite red — boundary test: last page duplicated · retried … green' },
          { kind: 'warn', text: 'suite red — twin-payments fixture merged by dedup · retried … green' },
        ],
        panel: {
          clearExcept: [],
          add: report({ depbump: 'fixed', nullguard: 'fixed', pagination: 'fixed', dedup: 'fixed' }),
          note: 'Two logic flaws no compiler can see died overnight — against tests somebody once wrote — instead of being discovered in next month’s totals.',
        },
        holdMs: 600,
      },
      {
        lines: [
          { kind: 'warn', text: 'e2e red — one export call missing its request ID · retried … green' },
          { kind: 'warn', text: 'e2e red — import event fires, the notifier never receives it' },
          { kind: 'sys', text: '⎿ cause sits across a service boundary — stopping here, flag + failing trace attached' },
        ],
        panel: {
          clearExcept: [],
          add: report({
            depbump: 'fixed',
            nullguard: 'fixed',
            pagination: 'fixed',
            dedup: 'fixed',
            authheader: 'fixed',
            webhook: 'flagged',
          }),
          note: 'The full path caught two breaks that live in the seams — every unit passes against its mock either way. One was retryable; the other wasn’t, and the run stopped honestly instead of bluffing. A red flag with a trace is a good overnight outcome.',
        },
        holdMs: 800,
      },
      {
        lines: [
          { kind: 'sys', text: '⎿ batch complete · 04:03 · report: 8/9 done, 1 flagged · all checks green' },
        ],
        panel: {
          clearExcept: [],
          add: report({
            rename: 'true',
            depbump: 'fixed',
            nullguard: 'fixed',
            pagination: 'fixed',
            dedup: 'fixed',
            authheader: 'fixed',
            webhook: 'flagged',
            errorcopy: 'true',
            misread: 'true',
          }),
          note: 'Every checkmark is load-bearing now: each row either passed four independent checks or was retried against a specific red. This is what the same nine chores look like when the report has to earn itself.',
        },
        holdMs: 800,
      },
      {
        lines: [
          { kind: 'sys', text: '— the morning review —' },
          { kind: 'warn', text: 'ticket author: “retry up to 3 times” meant 3 attempts total — the agent shipped 4' },
        ],
        panel: {
          clearExcept: [],
          add: report({
            rename: 'true',
            depbump: 'fixed',
            nullguard: 'fixed',
            pagination: 'fixed',
            dedup: 'fixed',
            authheader: 'fixed',
            webhook: 'flagged',
            errorcopy: 'true',
            misread: 'broken',
          }),
          note: 'Through all four checks, green — and wrong. No test encodes an intent nobody wrote down; a verifier can only check a claim somebody already made falsifiable. This row is the honest ceiling of the night shift.',
        },
        holdMs: 800,
      },
    ],
  },
];

export const nightShiftScript: TrScript = {
  lead: 'Nine chores, queued for an agent to run overnight. The terminal replays the night as it happened; the panel is the morning report — the only thing you’ll actually read. Watch what its checkmarks are made of, and when playback pauses, decide what the run has to get past before you believe it.',
  termTitle: 'overnight batch — ledger-app',
  panelTitle: 'the morning report',
  slots: {
    claim: 'Reported done (the worker’s word)',
    true: 'Done — held up',
    fixed: 'Caught red, retried',
    flagged: 'Stopped & flagged',
    broken: 'Shipped broken',
  },
  slotColors: {
    claim: { light: '#6b7280', dark: '#8b93a1' },
    true: { light: '#3f9154', dark: '#5cb56d' },
    fixed: { light: '#4a7db5', dark: '#5d8fc4' },
    flagged: { light: '#cf9744', dark: '#d9a552' },
    broken: { light: '#c25454', dark: '#d06a6a' },
  },
  intro,
  decisionPrompt:
    'Nine greens, zero checks. Trust the report, or re-queue the night with verifiers wired in — checks the run has to get past before it may say done:',
  choices,
  footnote:
    'The flaw rate here is theatrical — seven duds in nine — because the point is what each wiring would have caught, not the odds. The checks wear different clothes per tool (a CI step, a test command the loop must pass, a verifier agent), but the question is always the same: what does this run have to get past before “done” reaches you? And the residual is real: no check catches a requirement nobody wrote down.',
};
