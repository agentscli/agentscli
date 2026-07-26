import React, { useRef, useState } from 'react';
import {
  EA_CLOSING,
  EA_INTRO,
  EA_PARTICIPANTS,
  eaEdges,
  type EaEdge,
} from './edge-audit-data';
import { withCode } from './with-code';
import './edge-audit.css';
import { useWidgetFrame } from './widget-frame';

const LANE_W = 100 / EA_PARTICIPANTS.length;

export default function EdgeAudit() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [roveIdx, setRoveIdx] = useState(0);
  const edgeRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selected = eaEdges.find((e) => e.id === selectedId) ?? null;
  const checkedCount = checked.size;
  const receiptCount = eaEdges.filter(
    (e) => checked.has(e.id) && !e.fabricated
  ).length;
  const fabricatedCount = checkedCount - receiptCount;
  const allChecked = checkedCount === eaEdges.length;

  const reset = () => {
    setChecked(new Set());
    setSelectedId(null);
    setRoveIdx(0);
  };

  const activate = (edge: EaEdge) => {
    setSelectedId(edge.id);
    setChecked((prev) => {
      if (prev.has(edge.id)) return prev;
      const next = new Set(prev);
      next.add(edge.id);
      return next;
    });
  };

  // Roving tabindex: one Tab stop for the edge group, arrows move within.
  const onEdgeKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const n = eaEdges.length;
    let next: number | null = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (idx + 1) % n;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft')
      next = (idx - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next !== null) {
      e.preventDefault();
      setRoveIdx(next);
      edgeRefs.current[next]?.focus();
    }
  };

  // Polite live-region text: the verdict for the current receipt, plus the
  // closing line once the audit is complete.
  const announcement = selected
    ? `${EA_PARTICIPANTS[selected.from]} to ${EA_PARTICIPANTS[selected.to]}, ${
        selected.label
      }: ${selected.fabricated ? 'fabricated - ' : ''}${selected.verdict.replace(
        /`/g,
        ''
      )}${allChecked ? ` All six edges checked. ${EA_CLOSING}` : ''}`
    : '';

  return (
    <div className={useWidgetFrame('ea-root')}>
      {checkedCount > 0 && (
        <button
          type="button"
          className="ea-reset"
          onClick={reset}
          aria-label="Reset the audit - clear all checked edges"
        >
          Reset
        </button>
      )}
      <p className="ea-lead">{EA_INTRO}</p>

      <div className="ea-diagram">
        <div className="ea-heads" aria-hidden="true">
          {EA_PARTICIPANTS.map((p) => (
            <div key={p} className="ea-head">
              <span>{p}</span>
            </div>
          ))}
        </div>
        <div className="ea-lanes">
          {EA_PARTICIPANTS.map((p, i) => (
            <span
              key={p}
              className="ea-lifeline"
              style={{ left: `${(i + 0.5) * LANE_W}%` }}
              aria-hidden="true"
            />
          ))}
          <div
            className="ea-edges"
            role="group"
            aria-label="Diagram edges. Arrow keys move between edges; Enter or Space demands the receipt."
          >
            {eaEdges.map((edge, idx) => {
              const isChecked = checked.has(edge.id);
              const minLane = Math.min(edge.from, edge.to);
              const span = Math.abs(edge.to - edge.from);
              const rtl = edge.to < edge.from;
              const cls = [
                'ea-edge',
                edge.kind === 'return' && 'ea-edge-return',
                rtl && 'ea-edge-rtl',
                isChecked && (edge.fabricated ? 'ea-edge-fab' : 'ea-edge-ok'),
                selectedId === edge.id && 'ea-edge-sel',
              ]
                .filter(Boolean)
                .join(' ');
              const state = isChecked
                ? edge.fabricated
                  ? ' - checked: fabricated'
                  : ' - checked: receipt on file'
                : ' - unchecked';
              return (
                <button
                  key={edge.id}
                  ref={(el) => {
                    edgeRefs.current[idx] = el;
                  }}
                  type="button"
                  className={cls}
                  style={{
                    marginLeft: `${(minLane + 0.5) * LANE_W}%`,
                    width: `${span * LANE_W}%`,
                  }}
                  tabIndex={idx === roveIdx ? 0 : -1}
                  onClick={() => activate(edge)}
                  onKeyDown={(e) => onEdgeKeyDown(e, idx)}
                  onFocus={() => setRoveIdx(idx)}
                  aria-label={`${EA_PARTICIPANTS[edge.from]} to ${
                    EA_PARTICIPANTS[edge.to]
                  }: ${edge.label}${state}`}
                >
                  <span className="ea-edge-label">
                    {isChecked && (
                      <span
                        className={`ea-mark ${
                          edge.fabricated ? 'ea-mark-bad' : 'ea-mark-ok'
                        }`}
                        aria-hidden="true"
                      >
                        {edge.fabricated ? '✗' : '✓'}
                      </span>
                    )}
                    {edge.label}
                  </span>
                  <span className="ea-edge-line" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="ea-panel">
        <p className="ea-progress">
          checked {checkedCount}/{eaEdges.length} · receipts {receiptCount} ·
          fabricated {fabricatedCount}
        </p>
        {selected ? (
          <div className="ea-receipt">
            <p className="ea-receipt-title">
              {EA_PARTICIPANTS[selected.from]} → {EA_PARTICIPANTS[selected.to]}{' '}
              · <code>{selected.label}</code>
            </p>
            <div className="ea-trace">
              {selected.trace.map((t, i) => (
                <div key={i} className="ea-trace-line">
                  ⏵ {t.tool}
                  {'  '}
                  {t.arg}
                  {t.result && (
                    <span className="ea-trace-result">
                      {'  '}→ {t.result}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p
              className={`ea-verdict ${
                selected.fabricated ? 'ea-verdict-bad' : 'ea-verdict-good'
              }`}
            >
              <span className="ea-verdict-mark" aria-hidden="true">
                {selected.fabricated ? '✗' : '✓'}
              </span>{' '}
              {withCode(selected.verdict)}
            </p>
          </div>
        ) : (
          <p className="ea-hint">
            No receipts yet. Pick an edge - start with the one your next change
            depends on.
          </p>
        )}
        {allChecked && <p className="ea-closing">{EA_CLOSING}</p>}
      </div>

      <div className="ea-sr" aria-live="polite">
        {announcement}
      </div>
    </div>
  );
}
