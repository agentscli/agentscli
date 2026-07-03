import React, { useEffect, useState } from 'react';
import type { GapMode } from './gap-demo-data';
import { gapChips, gapPrompt, gapRuns } from './gap-demo-data';
import { withCode } from './with-code';
import './gap-demo.css';
import { useWidgetFrame } from './widget-frame';

const STEP_MS = 1000;
const FLIP_PAUSE_MS = 2200;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function GapDemo() {
  const [mode, setMode] = useState<GapMode>('bare');
  // Lines revealed so far; the outcome banner counts as the final step.
  const [shown, setShown] = useState(0);
  // First pass auto-plays bare → flips to ctx once; any click takes over.
  const [autoFlip, setAutoFlip] = useState(true);
  const [replayId, setReplayId] = useState(0);

  const run = gapRuns[mode];
  const total = run.lines.length + 1;

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(total);
      return;
    }
    setShown(0);
    const timer = setInterval(
      () =>
        setShown((s) => {
          if (s + 1 >= total) clearInterval(timer);
          return s + 1;
        }),
      STEP_MS,
    );
    return () => clearInterval(timer);
  }, [mode, replayId, total]);

  useEffect(() => {
    if (!autoFlip || mode !== 'bare' || shown < total || prefersReducedMotion()) return;
    const timer = setTimeout(() => setMode('ctx'), FLIP_PAUSE_MS);
    return () => clearTimeout(timer);
  }, [autoFlip, mode, shown, total]);

  const pick = (next: GapMode) => {
    setAutoFlip(false);
    if (next === mode) setReplayId((id) => id + 1);
    else setMode(next);
  };

  const done = shown >= total;

  return (
    <div className={useWidgetFrame('hgd-root')}>
      <div className="hgd-prompt">{gapPrompt}</div>

      <div className="hgd-controls">
        <div className="hgd-toggle" role="group" aria-label="Context mounted for this run">
          {(Object.keys(gapRuns) as GapMode[]).map((m) => (
            <button
              key={m}
              className="hgd-toggle-btn"
              aria-pressed={mode === m}
              onClick={() => pick(m)}
            >
              {gapRuns[m].toggleLabel}
            </button>
          ))}
        </div>
        <div className="hgd-chips" aria-hidden="true">
          {gapChips.map((chip) => (
            <span key={chip} className={mode === 'ctx' ? 'hgd-chip hgd-chip--on' : 'hgd-chip'}>
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="hgd-trace" aria-live="polite">
        {run.lines.slice(0, shown).map((line) => (
          <div key={line.call} className={`hgd-line hgd-line--${line.kind}`}>
            <div className="hgd-call">
              {line.kind === 'ask' ? '? ' : '$ '}
              {withCode(line.call)}
            </div>
            <div className="hgd-result">{withCode(line.result)}</div>
          </div>
        ))}
        {!done && (
          <div className="hgd-line" aria-hidden="true">
            <span className="hgd-cursor">▌</span>
          </div>
        )}
        {done && (
          <div className={run.outcome.ok ? 'hgd-outcome hgd-outcome--ok' : 'hgd-outcome hgd-outcome--fail'}>
            {run.outcome.text}
          </div>
        )}
      </div>
    </div>
  );
}
