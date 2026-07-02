import React, { useState } from 'react';
import type { PmsToolId } from './plan-mode-stepper-data';
import { pmsStages, pmsTools } from './plan-mode-stepper-data';
import { withCode } from './with-code';
import './plan-mode-stepper.css';

export default function PlanModeStepper() {
  const [toolId, setToolId] = useState<PmsToolId>('claude-code');
  const [stageIdx, setStageIdx] = useState(0);

  const stage = pmsStages[stageIdx];
  const cell = stage.detail[toolId];

  return (
    <div className="pms-root not-content">
      <div className="pms-tools" role="tablist" aria-label="Tool">
        {pmsTools.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={toolId === t.id}
            className={toolId === t.id ? 'pms-tool pms-tool-active' : 'pms-tool'}
            onClick={() => setToolId(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="pms-ribbon" role="img" aria-label={`Stage ${stageIdx + 1} of ${pmsStages.length}: ${stage.title}`}>
        {pmsStages.map((s, i) => (
          <React.Fragment key={s.id}>
            {i > 0 && (
              <span className="pms-arrow" aria-hidden="true">
                →
              </span>
            )}
            <button
              className={
                i === stageIdx
                  ? 'pms-node pms-node-active'
                  : i < stageIdx
                    ? 'pms-node pms-node-past'
                    : 'pms-node'
              }
              onClick={() => setStageIdx(i)}
              aria-label={`Go to stage ${i + 1}: ${s.title}`}
            >
              {s.label}
            </button>
          </React.Fragment>
        ))}
      </div>

      <div className="pms-panel" aria-live="polite">
        <div className="pms-panel-head">
          <span className="pms-stage-count">
            {stageIdx + 1} / {pmsStages.length}
          </span>
          <span className="pms-stage-title">{stage.title}</span>
        </div>
        {cell.code && <div className="pms-code">{cell.code}</div>}
        <p className="pms-text">{withCode(cell.text)}</p>
      </div>

      <div className="pms-controls">
        <button
          className="pms-btn"
          onClick={() => setStageIdx(stageIdx - 1)}
          disabled={stageIdx === 0}
        >
          ← Back
        </button>
        <button
          className="pms-btn pms-btn-primary"
          onClick={() => setStageIdx(stageIdx + 1)}
          disabled={stageIdx === pmsStages.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
