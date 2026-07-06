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

  /**
   * Legend chips are a full equivalent selector for the bar segments — the
   * cleanest fix for segments that render only a few px wide (e.g. Rules at
   * ~1% share) and are otherwise nearly untappable on touch. A category can
   * back more than one segment at once (e.g. "Conversation" appears several
   * times across a long session), so repeated taps cycle through them.
   */
  const selectCategory = (cat: string) => {
    const inCat = segments.filter((s) => s.category === cat);
    if (inCat.length === 0) return;
    if (inCat.length === 1) {
      const only = inCat[0];
      setSelectedId(selectedId === only.id ? null : only.id);
      return;
    }
    const curIdx = inCat.findIndex((s) => s.id === selectedId);
    const next = inCat[(curIdx + 1) % inCat.length];
    setSelectedId(next.id);
  };

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
        />
        <span
          className="cxs-threshold-label"
          style={{ left: `${(AUTO_COMPACT_AT / WINDOW_TOKENS) * 100}%` }}
        >
          auto-compact ~{Math.round((AUTO_COMPACT_AT / WINDOW_TOKENS) * 100)}%
        </span>
      </div>

      <div className="cxs-legend">
        {categoriesPresent.map((cat) => {
          const isActive = !!selected && selected.category === cat;
          const count = segments.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              className={
                isActive ? 'cxs-legend-item cxs-legend-item-active' : 'cxs-legend-item'
              }
              aria-pressed={isActive}
              aria-label={
                count > 1
                  ? `${SIM_CATEGORY_LABEL[cat]}, ${count} segments, tap to cycle through them`
                  : `${SIM_CATEGORY_LABEL[cat]} segment`
              }
              onClick={() => selectCategory(cat)}
            >
              <span className={`cxs-swatch cxs-seg-${cat}`} aria-hidden="true" />
              {SIM_CATEGORY_LABEL[cat]}
            </button>
          );
        })}
      </div>

      <div className="cxs-seg-detail" aria-live="polite">
        {selected ? (
          <>
            <strong>{selected.label}</strong> · {selected.tokens}k tokens
            {selected.note ? <> — {withCode(selected.note)}</> : null}
          </>
        ) : (
          <span className="cxs-seg-detail-hint">
            Click any segment of the bar — or a legend chip below — to see what it is.
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
