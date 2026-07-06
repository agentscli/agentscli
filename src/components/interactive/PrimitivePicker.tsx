import React, { useEffect, useRef, useState } from 'react';
import {
  primitiveEntries,
  problemClusters,
} from './primitive-picker-data';
import { withCode } from './with-code';
import './primitive-picker.css';
import { useWidgetFrame } from './widget-frame';

export default function PrimitivePicker() {
  const [clusterId, setClusterId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const cluster = problemClusters.find((c) => c.id === clusterId) ?? null;
  const clusterEntries = cluster
    ? cluster.entryIds
        .map((id) => primitiveEntries.find((e) => e.id === id))
        .filter((e): e is (typeof primitiveEntries)[number] => Boolean(e))
    : [];
  const selected = primitiveEntries.find((e) => e.id === selectedId);

  // Focus management across the two steps.
  const clusterRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const firstProblemRef = useRef<HTMLButtonElement | null>(null);
  const returnFocusId = useRef<string | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    // Don't steal focus on first paint — only on step changes.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (clusterId) {
      firstProblemRef.current?.focus();
    } else if (returnFocusId.current) {
      clusterRefs.current[returnFocusId.current]?.focus();
      returnFocusId.current = null;
    }
  }, [clusterId]);

  const openCluster = (id: string) => {
    setSelectedId(null);
    setClusterId(id);
  };

  const goBack = () => {
    returnFocusId.current = clusterId;
    setSelectedId(null);
    setClusterId(null);
  };

  return (
    <div className={useWidgetFrame('ppk-root')}>
      {/* Screen-reader step announcement; focus moves too, but this is belt-and-braces. */}
      <span className="ppk-sr-live" aria-live="polite">
        {cluster
          ? `Step 2 of 2: ${cluster.label}. ${clusterEntries.length} problems.`
          : 'Step 1 of 2: pick the kind of problem.'}
      </span>

      {!cluster ? (
        <div className="ppk-step" key="step1">
          <div className="ppk-label">Where’s it going wrong?</div>
          <div
            className="ppk-grid ppk-clusters"
            role="group"
            aria-label="Pick the kind of problem"
          >
            {problemClusters.map((c) => (
              <button
                key={c.id}
                ref={(el) => {
                  clusterRefs.current[c.id] = el;
                }}
                className="ppk-cluster"
                onClick={() => openCluster(c.id)}
              >
                <span className="ppk-cluster-label">{c.label}</span>
                <span className="ppk-cluster-hint">{c.hint}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="ppk-step" key="step2">
          <div className="ppk-crumbs">
            <button
              className="ppk-back"
              onClick={goBack}
              aria-label="Back to problem types"
            >
              ← Back
            </button>
            <span className="ppk-crumb">{cluster.label}</span>
          </div>
          <div className="ppk-grid" role="group" aria-label={cluster.label}>
            {clusterEntries.map((entry, i) => (
              <button
                key={entry.id}
                ref={i === 0 ? firstProblemRef : undefined}
                className={
                  entry.id === selectedId
                    ? 'ppk-option ppk-option-active'
                    : 'ppk-option'
                }
                aria-pressed={entry.id === selectedId}
                onClick={() =>
                  setSelectedId(entry.id === selectedId ? null : entry.id)
                }
              >
                {entry.statement}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="ppk-answer" aria-live="polite">
        {selected ? (
          <>
            <div className="ppk-answer-header">
              <span className="ppk-answer-label">You want</span>
              <a className="ppk-primitive" href={selected.href}>
                {selected.primitive} →
              </a>
              {selected.cost && (
                <span className="ppk-cost">{selected.cost}</span>
              )}
            </div>
            <p className="ppk-why">{withCode(selected.why)}</p>
            <p className="ppk-not">
              <span className="ppk-not-label">Not:</span>{' '}
              {withCode(selected.notThis)}
            </p>
          </>
        ) : (
          <p className="ppk-hint">
            {cluster
              ? 'Pick the sentence that stings — it routes to the primitive built for it, and says what not to reach for.'
              : 'Say the problem, get the primitive. Pick the complaint that sounds like yours.'}
          </p>
        )}
      </div>
    </div>
  );
}
