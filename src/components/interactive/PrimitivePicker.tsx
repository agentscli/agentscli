import React, { useState } from 'react';
import { primitiveEntries } from './primitive-picker-data';
import { withCode } from './with-code';
import './primitive-picker.css';
import { useWidgetFrame } from './widget-frame';

export default function PrimitivePicker() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = primitiveEntries.find((e) => e.id === selectedId);

  return (
    <div className={useWidgetFrame('ppk-root')}>
      <div className="ppk-label">I want the agent to…</div>
      <div className="ppk-grid" role="group" aria-label="What do you want?">
        {primitiveEntries.map((entry) => (
          <button
            key={entry.id}
            className={
              entry.id === selectedId ? 'ppk-option ppk-option-active' : 'ppk-option'
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
            Pick the sentence that sounds like your problem — it routes to the
            primitive built for it, and says what <em>not</em> to reach for.
          </p>
        )}
      </div>
    </div>
  );
}
