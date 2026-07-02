import React, { useState } from 'react';
import type { LoopPhase } from './loop-stepper-data';
import { LOOP_PHASE_LABEL, loopSteps } from './loop-stepper-data';
import { withCode } from './with-code';
import './loop-stepper.css';
import { useWidgetFrame } from './widget-frame';

const RING: LoopPhase[] = ['gather', 'act', 'verify'];

export default function LoopStepper() {
  const [stepIdx, setStepIdx] = useState(0);
  const step = loopSteps[stepIdx];

  return (
    <div className={useWidgetFrame('lps-root')}>
      <div className="lps-header">
        <div className="lps-step-meta">
          <span className="lps-step-count">
            Step {stepIdx + 1} / {loopSteps.length}
          </span>
          <span className="lps-step-title">{step.title}</span>
        </div>
        <div className="lps-controls">
          <button
            className="lps-btn"
            onClick={() => setStepIdx(0)}
            disabled={stepIdx === 0}
          >
            Reset
          </button>
          <button
            className="lps-btn"
            onClick={() => setStepIdx(stepIdx - 1)}
            disabled={stepIdx === 0}
          >
            ← Back
          </button>
          <button
            className="lps-btn lps-btn-primary"
            onClick={() => setStepIdx(stepIdx + 1)}
            disabled={stepIdx === loopSteps.length - 1}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="lps-ring" role="img" aria-label={`Current phase: ${LOOP_PHASE_LABEL[step.phase]}`}>
        <span
          className={
            step.phase === 'you' ? 'lps-node lps-node-edge lps-node-active' : 'lps-node lps-node-edge'
          }
        >
          you
        </span>
        <span className="lps-arrow" aria-hidden="true">
          →
        </span>
        {RING.map((phase, i) => (
          <React.Fragment key={phase}>
            {i > 0 && (
              <span className="lps-arrow" aria-hidden="true">
                →
              </span>
            )}
            <span
              className={
                step.phase === phase
                  ? `lps-node lps-node-${phase} lps-node-active`
                  : `lps-node lps-node-${phase}`
              }
            >
              {LOOP_PHASE_LABEL[phase]}
            </span>
          </React.Fragment>
        ))}
        <span className="lps-arrow lps-arrow-loop" aria-hidden="true">
          ↺
        </span>
        <span className="lps-arrow" aria-hidden="true">
          →
        </span>
        <span
          className={
            step.phase === 'done' ? 'lps-node lps-node-edge lps-node-active' : 'lps-node lps-node-edge'
          }
        >
          done
        </span>
      </div>

      <div className="lps-panel" aria-live="polite">
        {step.tool && (
          <div className="lps-tool">
            <div className="lps-tool-call">{step.tool.call}</div>
            <pre className="lps-tool-result">
              <code>{step.tool.result}</code>
            </pre>
          </div>
        )}
        <p className="lps-decide">{withCode(step.decide)}</p>
        {step.callout && <div className="lps-callout">{withCode(step.callout)}</div>}
      </div>
    </div>
  );
}
