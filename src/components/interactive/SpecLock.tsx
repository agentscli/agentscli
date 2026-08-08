import { specLockScript } from './spec-lock-data';
import TerminalReplay from './terminal-replay';

/**
 * SpecLock - a scene on the terminal-replay engine: a delegated bug fix runs
 * against a committed failing test, the agent burns two laps, then reaches
 * for the assertion it was told not to touch. The reader decides - let the
 * edit through / hold the line / make it argue the case. First scene on the
 * playbooks surface (tdd-with-agents.mdx); dramatizes the chapter's "quiet
 * renegotiation" failure mode with the same sale-boundary running example.
 * All content lives in spec-lock-data.ts; all behavior in terminal-replay.tsx.
 */
export default function SpecLock() {
  return <TerminalReplay script={specLockScript} />;
}
