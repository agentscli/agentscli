/**
 * Agentic loop stepper — one small bug fix traced through the loop.
 * The scenario is illustrative; the loop mechanics (decide → tool →
 * result → decide, verify feeding back into gather) mirror the prose
 * in foundations/how-agents-work.mdx.
 */

export type LoopPhase = 'you' | 'gather' | 'act' | 'verify' | 'done';

export const LOOP_PHASE_LABEL: Record<LoopPhase, string> = {
  you: 'your prompt',
  gather: 'gather context',
  act: 'act',
  verify: 'verify',
  done: 'done',
};

export interface LoopStep {
  id: string;
  phase: LoopPhase;
  title: string;
  /** What the model concludes / decides next — the reasoning half of the loop */
  decide: string;
  tool?: {
    call: string;
    result: string;
  };
  callout?: string;
}

export const loopSteps: LoopStep[] = [
  {
    id: 'prompt',
    phase: 'you',
    title: 'You hand over a task',
    decide:
      'Your message lands in the context window. The model reads it and decides what it needs first — it can’t fix what it hasn’t seen, so the first move is almost never an edit.',
    tool: {
      call: '> The login test is failing on main. Fix it.',
      result: '(prompt enters the window)',
    },
  },
  {
    id: 'run-tests',
    phase: 'gather',
    title: 'Reproduce the failure',
    decide:
      'Decision: see the actual failure before touching anything. The full output — stack trace included — lands in the window and stays there.',
    tool: {
      call: 'run: npm test -- auth',
      result: `FAIL src/auth/session.test.ts
  ✕ rejects expired tokens (12 ms)
    Expected: 401, Received: 200
    at src/auth/session.ts:42`,
    },
  },
  {
    id: 'read-file',
    phase: 'gather',
    title: 'Read the suspect code',
    decide:
      'The trace points at session.ts:42. Reading the file, the model spots it: the expiry check uses `>` where it should be `>=` — a token expiring exactly now is still accepted. Hypothesis formed; time to act.',
    tool: {
      call: 'read: src/auth/session.ts',
      result: `41  const now = Date.now();
42  if (token.expiresAt > now) {   // ← boundary bug
43    return session;`,
    },
  },
  {
    id: 'edit',
    phase: 'act',
    title: 'Make the fix',
    decide:
      'One-line edit. Note what the model is acting on: not the codebase, but its picture of the codebase — the file contents it read one step ago.',
    tool: {
      call: 'edit: src/auth/session.ts',
      result: `- if (token.expiresAt > now) {
+ if (token.expiresAt >= now) {`,
    },
  },
  {
    id: 'verify-fail',
    phase: 'verify',
    title: 'Verify — and fail',
    decide:
      'Still red. A second assertion fails: the test fixture hard-codes a timestamp that’s now in the past. The verify result feeds straight back into gathering — this is why it’s a loop and not a script.',
    tool: {
      call: 'run: npm test -- auth',
      result: `FAIL src/auth/session.test.ts
  ✓ rejects expired tokens
  ✕ accepts fresh tokens (9 ms)
    fixture token expired at 2025-01-01`,
    },
    callout:
      'A failed verify doesn’t end the loop — it restarts it with better information.',
  },
  {
    id: 'fix-fixture',
    phase: 'act',
    title: 'Fix the fixture',
    decide:
      'Quick read of the fixture, then a second edit: generate the expiry relative to now instead of hard-coding it. Two loop iterations for what looked like a one-line task — normal.',
    tool: {
      call: 'edit: src/auth/fixtures.ts',
      result: `- expiresAt: 1735689600000,
+ expiresAt: Date.now() + 60_000,`,
    },
  },
  {
    id: 'verify-pass',
    phase: 'verify',
    title: 'Verify — green',
    decide:
      'Both tests pass. The model checks its work against the original ask, decides the task is complete, and exits the loop.',
    tool: {
      call: 'run: npm test -- auth',
      result: `PASS src/auth/session.test.ts
  ✓ rejects expired tokens
  ✓ accepts fresh tokens`,
    },
  },
  {
    id: 'reply',
    phase: 'done',
    title: 'The loop exits',
    decide:
      'The model reports back: what was wrong, what changed, how it verified. Everything it read, ran, and edited along the way is still sitting in the context window — which is exactly where the next section picks up.',
    tool: {
      call: 'reply',
      result:
        'Fixed a boundary bug in the token expiry check (> → >=) and a stale hard-coded timestamp in the test fixture. Both auth tests pass.',
    },
    callout:
      'Every tool result from this loop stays in the window. That cost is the subject of the next section.',
  },
];
