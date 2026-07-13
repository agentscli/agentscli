/**
 * Data for the EdgeAudit widget — the edge-receipt inspector.
 *
 * KEEP IN SYNC with src/content/docs/playbooks/architecture-diagrams.mdx:
 * the diagram is that chapter's step-4 login-flow sequence diagram (with one
 * fabricated edge planted), and the `session.ts → DB` receipt is the exact
 * step-5 receipt shown in the chapter — if the chapter's example changes,
 * change it here too. Evergreen — no vendor facts.
 *
 * Verdict strings render through withCode(): backticked spans become
 * inline <code>; no markdown bold/italic.
 */

/** Participant headers, left to right. Edges index into this array. */
export const EA_PARTICIPANTS = [
  'Client',
  '/auth/login',
  'session.ts',
  'DB',
] as const;

export interface EaTraceLine {
  /** Tool invoked in the mini trace */
  tool: 'Grep' | 'Read';
  /** Argument as shown, e.g. `"router.post" src/routes/` or `src/routes/auth.ts:12` */
  arg: string;
  /** Optional outcome annotation, e.g. `no matches` */
  result?: string;
}

export interface EaEdge {
  id: string;
  /** Index into EA_PARTICIPANTS — source lane */
  from: number;
  /** Index into EA_PARTICIPANTS — target lane */
  to: number;
  /** Arrow label as it appears on the diagram */
  label: string;
  /** Return edges render as dashed arrows */
  kind: 'call' | 'return';
  /** True for the one edge that came from the model's prior, not a read */
  fabricated: boolean;
  /** The mini tool-trace shown when the reader demands the receipt */
  trace: EaTraceLine[];
  /** Verdict line (withCode-rendered) */
  verdict: string;
}

export const EA_INTRO =
  'This diagram parsed, rendered, and looks authoritative — and one of its edges is fabricated. Click each edge and demand the receipt.';

export const EA_CLOSING =
  '5 receipts, 1 fabrication — and the render looked identical either way. Thirty seconds per edge is what turns a plausible summary into a map you checked: the verification is the play, the picture is a by-product.';

export const eaEdges: EaEdge[] = [
  {
    id: 'post-credentials',
    from: 0,
    to: 1,
    label: 'POST credentials',
    kind: 'call',
    fabricated: false,
    trace: [
      { tool: 'Grep', arg: '"router.post" src/routes/' },
      { tool: 'Read', arg: 'src/routes/auth.ts:12' },
    ],
    verdict: "confirmed — line 12, `router.post('/auth/login', handler)`",
  },
  {
    id: 'create-session',
    from: 1,
    to: 2,
    label: 'createSession(userId)',
    kind: 'call',
    fabricated: false,
    trace: [{ tool: 'Read', arg: 'src/routes/auth.ts:28-33' }],
    verdict: 'confirmed — line 31, `await createSession(user.id)`',
  },
  {
    id: 'insert-session',
    from: 2,
    to: 3,
    label: 'INSERT session',
    kind: 'call',
    fabricated: false,
    // The chapter's step-5 receipt, verbatim.
    trace: [{ tool: 'Read', arg: 'src/services/session.ts:14-22' }],
    verdict: 'confirmed — line 18, `db.sessions.insert(...)`',
  },
  {
    id: 'update-last-login',
    from: 1,
    to: 3,
    label: 'UPDATE users.last_login',
    kind: 'call',
    fabricated: true,
    trace: [
      { tool: 'Grep', arg: '"last_login" src/', result: 'no matches' },
      { tool: 'Grep', arg: '"UPDATE users" src/', result: 'no matches' },
    ],
    verdict:
      "nothing in the code makes this call — most login flows record a last-login timestamp; this one doesn't. The edge came from the model's prior, not from a read.",
  },
  {
    id: 'signed-cookie',
    from: 2,
    to: 1,
    label: 'signed cookie',
    kind: 'return',
    fabricated: false,
    trace: [{ tool: 'Read', arg: 'src/services/session.ts:24' }],
    verdict: 'confirmed — line 24, `return sign(session.id, secret)`',
  },
  {
    id: 'set-cookie',
    from: 1,
    to: 0,
    label: '200 + Set-Cookie',
    kind: 'return',
    fabricated: false,
    trace: [{ tool: 'Read', arg: 'src/routes/auth.ts:34' }],
    verdict: "confirmed — line 34, `res.cookie('session', token, ...)`",
  },
];
