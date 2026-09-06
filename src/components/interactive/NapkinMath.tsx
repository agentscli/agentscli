import { useState } from 'react';
import { withCode } from './with-code';
import {
  napkinDefaults,
  napkinRanges,
  napkinCopy,
  NAPKIN_YEAR_CELLS,
  type NapkinState,
} from './napkin-math-data';
import './napkin-math.css';
import { useWidgetFrame } from './widget-frame';

/**
 * NapkinMath — stateful sim: sliders for the reader's own relay habit,
 * live arithmetic to hours/year, and a 46-cell year grid where filled
 * cells are working weeks spent as the human clipboard. Honesty rule:
 * labels itself arithmetic, refuses to model the rework half.
 */
export default function NapkinMath() {
  const [state, setState] = useState<NapkinState>(napkinDefaults);

  const minutesPerDay = (state.handoffs * state.seconds) / 60;
  const hoursPerYear = (minutesPerDay * state.days) / 60;
  const weeks = hoursPerYear / 40;
  const lostCells = Math.max(
    weeks >= 1 ? 1 : 0,
    Math.min(NAPKIN_YEAR_CELLS, Math.round(weeks)),
  );
  const dirty =
    state.handoffs !== napkinDefaults.handoffs ||
    state.seconds !== napkinDefaults.seconds ||
    state.days !== napkinDefaults.days;

  return (
    <div className={useWidgetFrame('nm-root')}>
      {dirty && (
        <button
          type="button"
          className="nm-reset"
          onClick={() => setState(napkinDefaults)}
        >
          Reset
        </button>
      )}
      <div className="nm-head">
        <p className="nm-title">{napkinCopy.title}</p>
      </div>
      <p className="nm-sub">{napkinCopy.subtitle}</p>

      {napkinRanges.map(({ key, min, max, step, label, unit }) => (
        <div className="nm-slider" key={key}>
          <label htmlFor={`nm-${key}`}>{label}</label>
          <input
            id={`nm-${key}`}
            type="range"
            min={min}
            max={max}
            step={step}
            value={state[key]}
            onChange={(e) =>
              setState((s) => ({ ...s, [key]: Number(e.target.value) }))
            }
          />
          <output htmlFor={`nm-${key}`}>
            {state[key]} {unit}
          </output>
        </div>
      ))}

      <p className="nm-result" aria-live="polite">
        {napkinCopy.result(hoursPerYear, weeks)}
      </p>

      <div
        className="nm-year"
        role="img"
        aria-label={`${lostCells} of ${NAPKIN_YEAR_CELLS} working weeks in the year spent relaying context`}
      >
        {Array.from({ length: NAPKIN_YEAR_CELLS }, (_, i) => (
          <span
            key={i}
            className={i < lostCells ? 'nm-cell nm-cell--lost' : 'nm-cell'}
          />
        ))}
      </div>
      <p className="nm-yearlabel">{napkinCopy.weeksLabel}</p>

      <p className="nm-note">{withCode(napkinCopy.note)}</p>
    </div>
  );
}
