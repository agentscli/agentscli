import React, { useState } from 'react';
import type { PmsToolId } from './plan-mode-stepper-data';
import { pmsStages, pmsTools } from './plan-mode-stepper-data';
import { withCode } from './with-code';
import './plan-mode-stepper.css';
import { useWidgetFrame } from './widget-frame';
import { useAccessibleTabs } from './use-accessible-tabs';
import { useSyncedToolIndex } from './use-synced-tool';

export default function PlanModeStepper() {
  const [toolIdx, setToolIdx] = useSyncedToolIndex(pmsTools);
  const toolId = pmsTools[toolIdx].id as PmsToolId;
  const [stageIdx, setStageIdx] = useState(0);

  const stage = pmsStages[stageIdx];
  const cell = stage.detail[toolId];
  const tabs = useAccessibleTabs(pmsTools.length, toolIdx, setToolIdx);

  return (
    <div className={useWidgetFrame('pms-root')}>
      <div className="pms-tools" {...tabs.tabListProps} aria-label="Tool">
        {pmsTools.map((t) => (
          <button
            key={t.id}
            {...tabs.getTabProps(pmsTools.indexOf(t))}
            className={toolId === t.id ? 'pms-tool pms-tool-active' : 'pms-tool'}
            onClick={() => setToolIdx(pmsTools.indexOf(t))}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="pms-ribbon" role="group" aria-label={`Stage ${stageIdx + 1} of ${pmsStages.length}: ${stage.title}`}>
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
              aria-pressed={i === stageIdx}
            >
              {s.label}
            </button>
          </React.Fragment>
        ))}
      </div>

      <div className="pms-panel" {...tabs.panelProps}>
        <span className="pms-sr-only" aria-live="polite">
          {stage.title}: {cell.text}
        </span>
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
