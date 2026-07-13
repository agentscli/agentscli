/**
 * Fresh-eyes probe data — the reader plays a fresh agent running the
 * step-2 naming probe against two repo structures: one smears the answer
 * across four folders, the other holds it in one file.
 *
 * Keep in sync with: src/content/docs/playbooks/ai-ready-code.mdx
 * (the billing running example, the probe question "Where do we decide
 * which customers get billed?", the layer-first vs domain-first trees in
 * step 2's code block, and the ≤2-moves pass threshold). Evergreen — no
 * vendor facts; the trees extend the chapter's block with plausible
 * distractor files only.
 *
 * Strings render through withCode(): backticked spans become <code>;
 * no markdown bold/italic. `{opens}` and `{s}` (plural suffix) are
 * interpolated by the component.
 */

/** The chapter's pass bar: land in ≤2 moves. */
export const FE_PASS_THRESHOLD = 2;

/** Layer-first opens before the nudge line may appear. */
export const FE_NUDGE_AT = 5;

/** The probe, rendered prompt-style with a leading `>`. */
export const FE_PROBE = 'Where do we decide which customers get billed?';

export const FE_FRAMING =
  "You're the fresh session: no rules file, no memory, no tenure. Open files until you can answer.";

export const FE_EMPTY =
  'Nothing opened yet — findings accumulate here as you read.';

/** Closing line under the scoreboard, once both structures have a verdict. */
export const FE_CLOSING =
  'That difference, times every session, forever — structure is context you pay for once.';

export type FeStructureId = 'layer' | 'domain';

export interface FeFolderRow {
  kind: 'folder';
  /** Folder label as shown in the tree, trailing slash included. */
  label: string;
  depth: number;
}

export interface FeFileRow {
  kind: 'file';
  id: string;
  /** File name as shown in the tree. */
  label: string;
  /** Path shown in the findings log (and read to screen readers). */
  path: string;
  depth: number;
  /** One line, written as what a reading agent would report after opening. */
  finding: string;
  /** True if this file holds a piece of the answer. */
  piece: boolean;
}

export type FeRow = FeFolderRow | FeFileRow;

export interface FeStructure {
  id: FeStructureId;
  tabLabel: string;
  rows: FeRow[];
  /** Piece-holding files that must all be opened to assemble the answer. */
  piecesNeeded: number;
  /** Verdict when assembled within the threshold; null if arithmetically impossible. */
  verdictPass: string | null;
  /** Verdict when assembled over the threshold. */
  verdictFail: string;
  /** Scoreboard fragments. */
  scorePass: string | null;
  scoreFail: string;
  /** Shown after FE_NUDGE_AT opens with no verdict; null = no nudge. */
  nudge: string | null;
  /** Shown after this structure's verdict while the other tab is unresolved. */
  nextPrompt: string;
}

export const feStructures: FeStructure[] = [
  {
    id: 'layer',
    tabLabel: 'layer-first',
    rows: [
      { kind: 'folder', label: 'src/', depth: 0 },
      { kind: 'folder', label: 'controllers/', depth: 1 },
      {
        kind: 'file',
        id: 'l-ctrl-billing',
        label: 'billing.ts',
        path: 'controllers/billing.ts',
        depth: 2,
        finding:
          'routes the request; delegates to `services/billing` on line 9. Not here.',
        piece: false,
      },
      {
        kind: 'file',
        id: 'l-ctrl-customers',
        label: 'customers.ts',
        path: 'controllers/customers.ts',
        depth: 2,
        finding: 'nothing about billing selection.',
        piece: false,
      },
      { kind: 'folder', label: 'services/', depth: 1 },
      {
        kind: 'file',
        id: 'l-svc-billing',
        label: 'billing.ts',
        path: 'services/billing.ts',
        depth: 2,
        finding:
          'part of it — `runBilling()` filters by due date, but imports the exclusion rules from the validator.',
        piece: true,
      },
      {
        kind: 'file',
        id: 'l-svc-payments',
        label: 'payments.ts',
        path: 'services/payments.ts',
        depth: 2,
        finding: 'nothing about billing selection.',
        piece: false,
      },
      { kind: 'folder', label: 'models/', depth: 1 },
      {
        kind: 'file',
        id: 'l-mdl-billing',
        label: 'billing.ts',
        path: 'models/billing.ts',
        depth: 2,
        finding: 'fields and types; no decisions.',
        piece: false,
      },
      {
        kind: 'file',
        id: 'l-mdl-customer',
        label: 'customer.ts',
        path: 'models/customer.ts',
        depth: 2,
        finding: 'nothing about billing selection.',
        piece: false,
      },
      { kind: 'folder', label: 'validators/', depth: 1 },
      {
        kind: 'file',
        id: 'l-val-billing',
        label: 'billing.ts',
        path: 'validators/billing.ts',
        depth: 2,
        finding:
          'part of it — the archived-customer exclusion lives here, as a validation rule.',
        piece: true,
      },
      { kind: 'folder', label: 'jobs/', depth: 1 },
      {
        kind: 'file',
        id: 'l-job-nightly',
        label: 'nightly-run.ts',
        path: 'jobs/nightly-run.ts',
        depth: 2,
        finding:
          "part of it — the nightly job hardcodes a `status !== 'trial'` filter before calling the service.",
        piece: true,
      },
    ],
    piecesNeeded: 3,
    // Three pieces means three opens minimum — a pass is arithmetically impossible.
    verdictPass: null,
    verdictFail:
      'Answer assembled — from three files in three folders, in {opens} opens. The threshold was 2. Nothing here is missing; it’s smeared. And a fresh session pays this again tomorrow.',
    scorePass: null,
    scoreFail: '{opens} opens, 3 files — fail',
    nudge:
      'Still assembling — the decision is split across a service, a validator, and a job.',
    nextPrompt:
      'Same question, same logic — now run it against the domain-first tab.',
  },
  {
    id: 'domain',
    tabLabel: 'domain-first',
    rows: [
      { kind: 'folder', label: 'src/', depth: 0 },
      { kind: 'folder', label: 'billing/', depth: 1 },
      {
        kind: 'file',
        id: 'd-select',
        label: 'select.ts',
        path: 'billing/select.ts',
        depth: 2,
        finding:
          'all of it — `selectBillableItems()` filters due, non-archived, non-trial customers. One pure function, one file.',
        piece: true,
      },
      {
        kind: 'file',
        id: 'd-invoice',
        label: 'invoice.ts',
        path: 'billing/invoice.ts',
        depth: 2,
        finding: 'how much — not who. One folder over from the answer.',
        piece: false,
      },
      {
        kind: 'file',
        id: 'd-notify',
        label: 'notify.ts',
        path: 'billing/notify.ts',
        depth: 2,
        finding: 'side effects: email, audit. Not the decision.',
        piece: false,
      },
      { kind: 'folder', label: 'customers/', depth: 1 },
      {
        kind: 'file',
        id: 'd-profile',
        label: 'profile.ts',
        path: 'customers/profile.ts',
        depth: 2,
        finding: 'nothing about billing.',
        piece: false,
      },
      { kind: 'folder', label: 'email/', depth: 1 },
      {
        kind: 'file',
        id: 'd-templates',
        label: 'templates.ts',
        path: 'email/templates.ts',
        depth: 2,
        finding: 'nothing about billing.',
        piece: false,
      },
    ],
    piecesNeeded: 1,
    verdictPass:
      '{opens} open{s}. Pass. Same logic, same codebase maturity — the structure just answers the question itself.',
    // Reachable only by opening distractors before select.ts.
    verdictFail:
      'Assembled in {opens} opens — the answer was one file all along. The structure would have ended this in one.',
    scorePass: '{opens} open{s} — pass',
    scoreFail: '{opens} opens — fail',
    nudge: null,
    nextPrompt: 'Now run the same question against the layer-first tab.',
  },
];
