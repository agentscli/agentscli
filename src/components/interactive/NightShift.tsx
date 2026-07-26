import React from 'react';
import { nightShiftScript } from './night-shift-data';
import TerminalReplay from './terminal-replay';

/**
 * NightShift - a scene on the terminal-replay engine: an unattended overnight
 * batch reports 9/9 done, and the reader decides what the run has to get past
 * before that means anything (ship it / build + types / the full stack).
 * Successor to the retired VerifierLoop toggle widget - same nine chores,
 * same unattended-trust argument, replayed as a night instead of tabulated.
 * All content lives in night-shift-data.ts; all behavior in terminal-replay.tsx.
 */
export default function NightShift() {
  return <TerminalReplay script={nightShiftScript} />;
}
