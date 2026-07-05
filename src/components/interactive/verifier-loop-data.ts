/**
 * Tasks for the verifier-loop widget. Evergreen — no vendor facts, no tool
 * names, no real flags. Encodes the unattended-trust argument from the course
 * automation chapters (claude-code/automation/loops.mdx,
 * codex/automation/ci.mdx, copilot/automation/draft-prs.mdx,
 * cursor/cli-headless-ci/index.mdx, opencode/share-and-headless/server-and-ci.mdx):
 * with nobody watching, an agent's "done" is a claim, and each verifier wired
 * into the run converts one class of silent failure into a caught one. The
 * flaw rate is theatrically high on purpose; the residual — a misread ticket
 * that passes every machine check — is the honest ceiling of the night shift.
 */

export type VlVerifier = 'build' | 'types' | 'unit' | 'e2e';
export type VlFlaw = VlVerifier | 'none' | 'human';

export const VL_VERIFIER_LABELS: Record<VlVerifier, string> = {
  build: 'build',
  types: 'types & lint',
  unit: 'unit suite',
  e2e: 'end-to-end',
};

export const VL_VERIFIER_ORDER: VlVerifier[] = ['build', 'types', 'unit', 'e2e'];

export interface VlTask {
  id: string;
  /** Short row title */
  label: string;
  /** The chore as queued */
  text: string;
  /** Which check class catches the first attempt's flaw; 'none' = clean first try, 'human' = no machine check can see it */
  flaw: VlFlaw;
  /** When caught, does the retry land, or does the run stop and flag it? */
  fixOnCatch: boolean;
  /** Why-line when the task ships correct without needing a catch (flaw: 'none') */
  whyDone?: string;
  /** Why-line when its verifier is wired: fixed after a red signal, or honestly flagged */
  whyCaught?: string;
  /** Why-line when it ships broken under a confident checkmark */
  whyShipped?: string;
}

export const vlTasks: VlTask[] = [
  {
    id: 'rename',
    label: 'the rename sweep',
    text: 'Rename `Charge` to `Payment` everywhere the old name appears — wide, mechanical, boring.',
    flaw: 'none',
    fixOnCatch: true,
    whyDone:
      'Genuinely done, first try. Worth noticing what that’s worth: in a report where every row says done, the true rows are indistinguishable from the false ones.',
  },
  {
    id: 'depbump',
    label: 'the dependency bump',
    text: 'Take the HTTP client up a major version and adjust the call sites.',
    flaw: 'build',
    fixOnCatch: true,
    whyCaught:
      'First attempt tripped on a renamed option — the red build put the exact error in front of the retry, which is the easiest fix an agent ever gets.',
    whyShipped:
      'The changelog buried a renamed option; three call sites don’t even compile. Nothing ran a build, so nothing noticed — the report says done because the diff looked plausible.',
  },
  {
    id: 'nullguard',
    label: 'the null guard',
    text: 'Handle the missing-account case in the statement export instead of crashing.',
    flaw: 'types',
    fixOnCatch: true,
    whyCaught:
      'The type check named the mismatch in one line — returned `undefined`, promised a report object — and the retry fixed a specific complaint instead of a hunch.',
    whyShipped:
      'The guard returns `undefined` where the caller expects a report object. What ships is the same crash, moved two files downstream of where anyone will look for it.',
  },
  {
    id: 'pagination',
    label: 'the pagination fix',
    text: 'Stop the transaction list dropping the last page when the count divides evenly.',
    flaw: 'unit',
    fixOnCatch: true,
    whyCaught:
      'The suite’s boundary test went red on the first attempt — last page duplicated — and the version in the report is the second attempt, the one that passed.',
    whyShipped:
      'The fix is off by one in the other direction: the last page now renders twice. The suite has a test that catches exactly this. It never ran.',
  },
  {
    id: 'dedup',
    label: 'the dedup tightening',
    text: 'Stop near-identical transactions double-counting in the monthly totals.',
    flaw: 'unit',
    fixOnCatch: true,
    whyCaught:
      'A fixture with two legitimate twin payments failed the first pass. The suite is where “too aggressive” becomes a red line overnight instead of a discovery in next month’s numbers.',
    whyShipped:
      'Too aggressive: legitimate same-amount, same-day payments now merge. The totals are quietly wrong — a flaw no compile can see, priced silently into every report from here on.',
  },
  {
    id: 'webhook',
    label: 'the webhook handoff',
    text: 'Emit an event when an import completes, so the notifier service can fan out.',
    flaw: 'e2e',
    fixOnCatch: false,
    whyCaught:
      'The full-path run failed — the event fires, the notifier never sees it — and the cause sits across a service boundary the agent can’t step through alone. You get an honest red flag and the failing trace: the correct overnight outcome for a problem this shape.',
    whyShipped:
      'Works perfectly against the mock. The real notifier never receives the event — the break lives in a handoff no unit test crosses, and nothing walked the full path.',
  },
  {
    id: 'authheader',
    label: 'the header propagation',
    text: 'Forward the request ID through the export service’s downstream calls.',
    flaw: 'e2e',
    fixOnCatch: true,
    whyCaught:
      'The end-to-end pass flagged the one downstream call without the header; the retry threaded it through. Only the full path could have seen it, and tonight the full path was watching.',
    whyShipped:
      'One of three downstream calls didn’t get the header. Every unit passes — each call is tested against a mock that doesn’t care — and the gap only exists on the full path nothing walked.',
  },
  {
    id: 'errorcopy',
    label: 'the error-copy pass',
    text: 'Rewrite the four cryptic import-failure messages so a human can act on them.',
    flaw: 'none',
    fixOnCatch: true,
    whyDone:
      'Done, first try — the second true checkmark on the board. The report can’t tell you that; only a check, or your morning, can.',
  },
  {
    id: 'misread',
    label: 'the ambiguous ticket',
    text: '“Retry failed imports up to 3 times” — the ticket doesn’t say whether 3 counts the first attempt.',
    flaw: 'human',
    fixOnCatch: false,
    whyShipped:
      'The agent picked a defensible reading — three retries after the first attempt — and the reporter meant the other one. It compiles, type-checks, passes every test (no test encodes an intent nobody wrote down) and walks the full path cleanly. Four for four, and wrong. No verifier catches a misread ticket; that’s what your morning is for.',
  },
];
