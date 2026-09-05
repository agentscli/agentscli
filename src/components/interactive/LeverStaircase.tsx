import { useState } from 'react';
import { withCode } from './with-code';
import { levers, staircaseCopy } from './lever-staircase-data';
import './lever-staircase.css';
import { useWidgetFrame } from './widget-frame';

/**
 * LeverStaircase — the six context-engineering levers drawn as a climbable
 * staircase. Steps are buttons (native keyboard access); the selected rung
 * details its cost, assumption, and first win, with a link to the owning
 * foundations chapter. No auto-play, no state to reset beyond selection.
 */
export default function LeverStaircase() {
  const [active, setActive] = useState(0);
  const lever = levers[active];

  return (
    <div className={useWidgetFrame('ls-root')}>
      <p className="ls-title">{staircaseCopy.title}</p>
      <p className="ls-climb">{staircaseCopy.climb}</p>

      <div className="ls-stairs" role="group" aria-label="Context-engineering levers, climb order">
        {levers.map((l, i) => (
          <button
            key={l.key}
            type="button"
            className="ls-step"
            aria-pressed={i === active}
            style={{ height: `${44 + i * 13}px` }}
            onClick={() => setActive(i)}
          >
            {l.name}
          </button>
        ))}
      </div>

      <dl className="ls-detail" aria-live="polite">
        <div>
          <dt className="ls-name">{lever.name}</dt>
        </div>
        <div>
          <dt>{staircaseCopy.costLabel}</dt>
          <dd>{withCode(lever.cost)}</dd>
        </div>
        <div>
          <dt>{staircaseCopy.assumesLabel}</dt>
          <dd>{withCode(lever.assumes)}</dd>
        </div>
        <div>
          <dt>{staircaseCopy.firstWinLabel}</dt>
          <dd>{withCode(lever.firstWin)}</dd>
        </div>
      </dl>
      <a className="ls-read" href={lever.href}>
        {staircaseCopy.read}
      </a>
    </div>
  );
}
