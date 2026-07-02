import React, { useMemo, useState } from 'react';
import type { SimSegment } from './context-sim-types';
import {
  AUTO_COMPACT_AT,
  SIM_CATEGORY_LABEL,
  WINDOW_TOKENS,
  simSteps,
} from './context-sim-data';
import { withCode } from './with-code';
import './context-simulator.css';
import { useWidgetFrame } from './widget-frame';

/** Replay steps 0..idx to get the window contents at that point. */
function stateAt(idx: number): SimSegment[] {
  let segs: SimSegment[] = [];
  for (let i = 0; i <= idx; i++) {
    const step = simSteps[i];
    if (step.compact) {
      segs = segs.filter((s) => step.compact!.keepIds.includes(s.id));
      segs = [...segs, ...step.compact.add];
    }
    if (step.add) segs = [...segs, ...step.add];
  }
  return segs;
}

export default function ContextSimulator() {
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const step = simSteps[stepIdx];
  const segments = useMemo(() => stateAt(stepIdx), [stepIdx]);
  const total = segments.reduce((sum, s) => sum + s.tokens, 0);
  const pct = Math.round((total / WINDOW_TOKENS) * 100);
  const overThreshold = total >= AUTO_COMPACT_AT;
  const selected = segments.find((s) => s.id === selectedId);

  const goTo = (idx: number) => {
    setStepIdx(idx);
    setSelectedId(null);
  };

  const categoriesPresent = useMemo(() => {
    const seen = new Set(segments.map((s) => s.category));
    return Object.keys(SIM_CATEGORY_LABEL).filter((c) => seen.has(c as never));
  }, [segments]);

  return (
    <div className={useWidgetFrame('cxs-root')}>
      <div className="cxs-header">
        <div className="cxs-step-meta">
          <span className="cxs-step-count">
            Step {stepIdx + 1} / {simSteps.length}
          </span>
          <span className="cxs-step-title">{step.title}</span>
        </div>
        <div className="cxs-controls">
          <button
            className="cxs-btn"
            onClick={() => goTo(0)}
            disabled={stepIdx === 0}
          >
            Reset
          </button>
          <button
            className="cxs-btn"
            onClick={() => goTo(stepIdx - 1)}
            disabled={stepIdx === 0}
          >
            ← Back
          </button>
          <button
            className="cxs-btn cxs-btn-primary"
            onClick={() => goTo(stepIdx + 1)}
            disabled={stepIdx === simSteps.length - 1}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="cxs-gauge-row">
        <span className={overThreshold ? 'cxs-gauge cxs-gauge-hot' : 'cxs-gauge'}>
          {total}k / {WINDOW_TOKENS}k tokens ({pct}%)
        </span>
        {overThreshold && (
          <span className="cxs-gauge-warning">past the auto-compact threshold</span>
        )}
      </div>

      <div
        className="cxs-bar-wrap"
        role="img"
        aria-label={`Context window: ${total}k of ${WINDOW_TOKENS}k tokens used (${pct}%)`}
      >
        <div className="cxs-bar">
          {segments.map((seg) => (
            <button
              key={seg.id}
              className={
                selectedId === seg.id
                  ? `cxs-seg cxs-seg-${seg.category} cxs-seg-selected`
                  : `cxs-seg cxs-seg-${seg.category}`
              }
              style={{ width: `${(seg.tokens / WINDOW_TOKENS) * 100}%` }}
              title={`${seg.label} — ${seg.tokens}k`}
              aria-label={`${seg.label}, ${seg.tokens}k tokens`}
              onClick={() =>
                setSelectedId(selectedId === seg.id ? null : seg.id)
              }
            />
          ))}
        </div>
        <div
          className="cxs-threshold"
          style={{ left: `${(AUTO_COMPACT_AT / WINDOW_TOKENS) * 100}%` }}
        >
          <span className="cxs-threshold-label">
            auto-compact ~{Math.round((AUTO_COMPACT_AT / WINDOW_TOKENS) * 100)}%
          </span>
        </div>
      </div>

      <div className="cxs-legend">
        {categoriesPresent.map((cat) => (
          <span key={cat} className="cxs-legend-item">
            <span className={`cxs-swatch cxs-seg-${cat}`} aria-hidden="true" />
            {SIM_CATEGORY_LABEL[cat]}
          </span>
        ))}
      </div>

      <div className="cxs-seg-detail" aria-live="polite">
        {selected ? (
          <>
            <strong>{selected.label}</strong> · {selected.tokens}k tokens
            {selected.note ? <> — {withCode(selected.note)}</> : null}
          </>
        ) : (
          <span className="cxs-seg-detail-hint">
            Click any segment of the bar to see what it is.
          </span>
        )}
      </div>

      <div className="cxs-narration" aria-live="polite">
        <p>{withCode(step.narration)}</p>
        {step.callout && <div className="cxs-callout">{withCode(step.callout)}</div>}
        {step.subagent && (
          <div className="cxs-subagent">
            <div className="cxs-subagent-title">
              {step.subagent.label} — its own separate window
            </div>
            <div className="cxs-subagent-bar">
              <span
                className="cxs-subagent-fill"
                style={{
                  width: `${(step.subagent.tokens / WINDOW_TOKENS) * 100}%`,
                }}
              />
            </div>
            <div className="cxs-subagent-note">
              {step.subagent.tokens}k of raw logs stay here · only the{' '}
              {step.subagent.returns}k report returns to your window
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
