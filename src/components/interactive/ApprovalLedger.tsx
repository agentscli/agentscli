import React from 'react';
import { approvalLedgerScript } from './approval-ledger-data';
import TerminalReplay from './terminal-replay';

/**
 * ApprovalLedger - a scene on the terminal-replay engine: the approval
 * decision (allow once / always-allow a wildcard / deny & redirect) played
 * out against a live x-ray of the standing permission policy. Second scene
 * on the engine; first to use the non-meter mode (no capacity, unnumbered
 * blocks) and scene-defined slot colors.
 * All content lives in approval-ledger-data.ts; all behavior in terminal-replay.tsx.
 */
export default function ApprovalLedger() {
  return <TerminalReplay script={approvalLedgerScript} />;
}
