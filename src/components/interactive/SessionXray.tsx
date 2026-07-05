import React from 'react';
import { sessionXrayScript } from './session-xray-data';
import TerminalReplay from './terminal-replay';

/**
 * SessionXray — a scene on the terminal-replay engine: the reset decision
 * (keep going / compact / clear) played out against a live window x-ray.
 * All content lives in session-xray-data.ts; all behavior in terminal-replay.tsx.
 */
export default function SessionXray() {
  return <TerminalReplay script={sessionXrayScript} />;
}
