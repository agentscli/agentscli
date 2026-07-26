/**
 * Homepage gap demo - the site thesis as a live trace. The same agent runs
 * the same task twice: once bare, once with the project's context mounted
 * (rules, skills, MCP). Evergreen: encodes the context-engineering thesis,
 * no vendor facts. The scenario is illustrative; keep the bad outcome
 * honest (a bounced PR, not a disaster movie).
 */

export type GapMode = 'bare' | 'ctx';

export type GapLineKind = 'tool' | 'ask';

export interface GapLine {
  kind: GapLineKind;
  /** Mono lead line - a tool call, or the agent asking you a question */
  call: string;
  /** Dim result line under the call */
  result: string;
}

export interface GapRun {
  id: GapMode;
  toggleLabel: string;
  lines: GapLine[];
  outcome: { ok: boolean; text: string };
}

export const gapPrompt = '> Add rate limiting to the invite endpoint.';

/** Context surfaces shown as chips; `mounted` flips with the toggle. */
export const gapChips = ['AGENTS.md', 'skills/', 'mcp: issue-tracker'];

export const gapRuns: Record<GapMode, GapRun> = {
  bare: {
    id: 'bare',
    toggleLabel: 'bare agent',
    lines: [
      {
        kind: 'tool',
        call: 'grep -r "rateLimit" src/',
        result: 'no matches - no house pattern found',
      },
      {
        kind: 'ask',
        call: 'Which limiter do you use - `express-rate-limit`, or a Redis bucket?',
        result: 'you’re in a meeting. It guesses.',
      },
      {
        kind: 'tool',
        call: 'npm install express-rate-limit',
        result: '+ 1 new dependency',
      },
      {
        kind: 'tool',
        call: 'edit routes/invite.ts',
        result: 'inline limiter, invented limit: 60/min',
      },
    ],
    outcome: {
      ok: false,
      text: 'PR bounced - wrong library, wrong layer, made-up spec. Six comments to relay what you already knew.',
    },
  },
  ctx: {
    id: 'ctx',
    toggleLabel: '+ your context',
    lines: [
      {
        kind: 'tool',
        call: 'read AGENTS.md',
        result: '“rate limits live in `src/middleware/rateLimiter` - never inline”',
      },
      {
        kind: 'tool',
        call: 'mcp: issue-tracker → INV-482',
        result: 'spec: 100 req/min per org · respond 429 + Retry-After',
      },
      {
        kind: 'tool',
        call: 'edit src/middleware/rateLimiter.ts',
        result: 'invite route registered, house pattern',
      },
      {
        kind: 'tool',
        call: 'npm test -- invite',
        result: 'PASS - 2 new tests, matching the existing suite',
      },
    ],
    outcome: {
      ok: true,
      text: 'Approved first pass. Same model, same prompt - it just knew what you know.',
    },
  },
};
