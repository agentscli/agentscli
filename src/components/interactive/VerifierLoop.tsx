import React, { useState } from 'react';
import {
  VL_VERIFIER_LABELS,
  VL_VERIFIER_ORDER,
  vlTasks,
  type VlVerifier,
} from './verifier-loop-data';
import { withCode } from './with-code';
import './verifier-loop.css';
import { useWidgetFrame } from './widget-frame';

type VlOutcome = 'clean' | 'fixed' | 'flagged' | 'broken';

function outcomeOf(
  task: (typeof vlTasks)[number],
  wired: Set<VlVerifier>
): VlOutcome {
  if (task.flaw === 'none') return 'clean';
  if (task.flaw === 'human') return 'broken';
  if (!wired.has(task.flaw)) return 'broken';
  return task.fixOnCatch ? 'fixed' : 'flagged';
}

const OUTCOME_CHIP: Record<VlOutcome, { label: string; tone: string }> = {
  clean: { label: 'done — true', tone: 'good' },
  fixed: { label: 'done — caught red, retried', tone: 'good' },
  flagged: { label: 'stopped — flagged for you', tone: 'warn' },
  broken: { label: 'reports done — broken', tone: 'bad' },
};

function whyOf(task: (typeof vlTasks)[number], outcome: VlOutcome): string {
  if (outcome === 'clean') return task.whyDone ?? '';
  if (outcome === 'broken') return task.whyShipped ?? '';
  return task.whyCaught ?? '';
}

export default function VerifierLoop() {
  // The trap this widget exists to expose: the run as most people first
  // script it — the agent's own report, and nothing checking it.
  const [wired, setWired] = useState<Set<VlVerifier>>(new Set());

  const toggle = (v: VlVerifier) =>
    setWired((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });

  // Default is nothing wired — the agent's own report, unchecked.
  const isDefault = wired.size === 0;
  const reset = () => setWired(new Set());

  const outcomes = vlTasks.map((t) => outcomeOf(t, wired));
  const count = (o: VlOutcome) => outcomes.filter((x) => x === o).length;

  const clean = count('clean');
  const fixed = count('fixed');
  const flagged = count('flagged');
  const broken = count('broken');
  const reported = clean + fixed + broken;
  const correct = clean + fixed;

  const hasUnit = wired.has('unit');
  const hasE2e = wired.has('e2e');

  let reading: string;
  if (wired.size === 0) {
    reading =
      'Nine checkmarks, and the only witness is the worker. Two of these are genuinely done — and nothing in the report tells you which two. That’s the shape of an unverified overnight run: not a disaster, an unfalsifiable claim. You’ll spend the morning re-deriving all nine verdicts by hand, which is the shift this job was meant to take off you.';
  } else if (wired.size === 4) {
    reading =
      'Now every checkmark is load-bearing: what reports done either was right the first time or was retried against a specific red signal, and the one task that couldn’t be verified stopped honestly instead of bluffing. Except — look at the last row. The misread ticket ships green through all four checks, because a verifier can only check intent somebody already encoded, and this intent lived in the reporter’s head. That’s the honest ceiling of the night shift: wiring buys you “the code does what the checks say”; only the morning review buys “the checks say what the ticket meant.”';
  } else if (!hasUnit && !hasE2e) {
    reading =
      'The report is exactly as green as before — nine checkmarks either way — but “done” just upgraded from an opinion to “the code holds together.” That’s real: whatever fails loudly at compile or type level now gets caught and retried against a named error. It’s also the trap state, because a valid program and a correct program are different claims, and every flaw that compiles cleanly just shipped with more confidence behind it. Greener-feeling, same silent failures — this is the lint-green pipeline that bites.';
  } else if (hasUnit && !hasE2e) {
    reading =
      'The suite changes what a checkmark means: “done” now includes “does what the existing tests say,” and the logic flaws that would have quietly poisoned the monthly totals died overnight instead. What still slips through lives at the seams — every unit passes against its mock while the real handoff drops the event, because a suite checks the pieces and nobody is checking the whole. The remaining silent failures are exactly the ones a full-path run exists to catch.';
  } else if (hasE2e && !hasUnit) {
    reading =
      'Backwards wiring, and instructively so: the full path is walked, so the cross-service breaks no unit test can see got caught — but the cheap, sharp checks that would name a logic flaw in one red line aren’t running. An end-to-end pass tells you the happy path survives; it’s a blunt instrument for the edge cases a suite encodes one by one. You bought the expensive guarantee and skipped the cheap ones underneath it.';
  } else {
    reading =
      'Almost airtight, from the top down: behaviour is checked at the unit seams and across the full path. The leak that’s left is the cheapest one on the board — attempts that fail at compile or type level ship un-run, because nothing in this wiring so much as builds the code before believing in it. Wire the floor; it costs seconds and it’s the loudest signal a retry can get.';
  }

  return (
    <div className={useWidgetFrame('vl-root')}>
      {!isDefault && (
        <button
          type="button"
          className="vl-reset"
          onClick={reset}
          aria-label="Reset to an unverified run, nothing wired"
        >
          Reset
        </button>
      )}
      <p className="vl-lead">
        Nine chores, queued for the agent to run overnight. You’re asleep, so
        the agent’s <strong>report</strong> is all you’ll read in the morning —
        and the only thing that decides what its checkmarks <em>mean</em> is
        which <strong>verifiers</strong> were wired into the run. Toggle the
        wiring; watch the report.
      </p>

      <div className="vl-wiring">
        <span className="vl-wiring-name">wired into the run</span>
        <span className="vl-toggles" role="group" aria-label="Verifiers wired into the run">
          {VL_VERIFIER_ORDER.map((v) => (
            <label
              key={v}
              className={wired.has(v) ? 'vl-toggle vl-toggle-on' : 'vl-toggle'}
            >
              <input
                type="checkbox"
                checked={wired.has(v)}
                onChange={() => toggle(v)}
              />
              {VL_VERIFIER_LABELS[v]}
            </label>
          ))}
        </span>
      </div>

      <ul className="vl-tasks">
        {vlTasks.map((t, i) => {
          const outcome = outcomes[i];
          const chip = OUTCOME_CHIP[outcome];
          return (
            <li key={t.id} className="vl-task">
              <div className="vl-task-head">
                <span className="vl-task-label">{t.label}</span>
                <span className={`vl-chip vl-chip-${chip.tone}`}>
                  {chip.label}
                </span>
              </div>
              <p className="vl-task-text">{withCode(t.text)}</p>
              <p className="vl-task-why">{withCode(whyOf(t, outcome))}</p>
            </li>
          );
        })}
      </ul>

      <div className="vl-ledger" aria-live="polite">
        <div className="vl-stats">
          <span className="vl-stat">
            <span className="vl-stat-label">reports done</span>
            <span className="vl-stat-value">{reported} of 9</span>
          </span>
          <span className="vl-stat">
            <span className="vl-stat-label">actually done</span>
            <span
              className={
                correct === reported
                  ? 'vl-stat-value vl-stat-good'
                  : 'vl-stat-value'
              }
            >
              {correct}
            </span>
          </span>
          <span className="vl-stat">
            <span className="vl-stat-label">shipped broken</span>
            <span
              className={
                broken > 0
                  ? 'vl-stat-value vl-stat-bad'
                  : 'vl-stat-value vl-stat-good'
              }
            >
              {broken}
            </span>
          </span>
          <span className="vl-stat">
            <span className="vl-stat-label">flagged honestly</span>
            <span className="vl-stat-value">{flagged}</span>
          </span>
        </div>
        <p className="vl-reading">{reading}</p>
      </div>

      <p className="vl-footnote">
        Numbers are illustrative — the point is what each wiring{' '}
        <em>would have caught</em>, not the odds (a theatrical seven duds in
        nine). The residual is real, though: no check catches a requirement
        nobody wrote down.
      </p>
    </div>
  );
}
