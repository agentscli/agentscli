import { useState } from 'react';
import {
  adlBlast,
  adlCells,
  adlReversibility,
  adlRungs,
  type AxisOption,
} from './autonomy-dial-data';
import { withCode } from './with-code';
import './autonomy-dial.css';
import { useWidgetFrame } from './widget-frame';

function AxisGroup({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: AxisOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset className="adl-axis">
      <legend className="adl-axis-legend">{legend}</legend>
      {options.map((o) => (
        <label
          key={o.id}
          className={`adl-option${value === o.id ? ' adl-option-on' : ''}`}
        >
          <input
            type="radio"
            name={name}
            checked={value === o.id}
            onChange={() => onChange(o.id)}
          />
          <span className="adl-option-label">{withCode(o.label)}</span>
          <span className="adl-option-hint">{o.hint}</span>
        </label>
      ))}
    </fieldset>
  );
}

export default function AutonomyDial() {
  const [rev, setRev] = useState('undoable');
  const [blast, setBlast] = useState('local');

  const cell = adlCells[`${rev}/${blast}`];

  return (
    <div className={useWidgetFrame('adl-root')}>
      <p className="adl-lead">
        Two questions decide how much leash a task earns - neither of them is
        “how hard is it.” Set both for the work in front of you and read the
        rung it lands on.
      </p>

      <div className="adl-axes">
        <AxisGroup
          name="adl-rev"
          legend="If the agent’s worst single action went wrong, undoing it would take…"
          options={adlReversibility}
          value={rev}
          onChange={setRev}
        />
        <AxisGroup
          name="adl-blast"
          legend="…and its consequences would reach"
          options={adlBlast}
          value={blast}
          onChange={setBlast}
        />
      </div>

      <ol className="adl-ladder" aria-live="polite">
        {adlRungs.map((r) => {
          const picked = r.id === cell.rung;
          return (
            <li
              key={r.id}
              className={`adl-rung${picked ? ' adl-rung-on' : ''}${
                r.never ? ' adl-rung-never' : ''
              }`}
            >
              <span className="adl-rung-head">
                <span className="adl-rung-label">{r.label}</span>
                {picked && <span className="adl-rung-chip">this task</span>}
                {r.never && (
                  <span className="adl-rung-chip adl-rung-chip-never">
                    disposable environments only
                  </span>
                )}
              </span>
              {(picked || r.never) && (
                <span className="adl-rung-desc">{r.desc}</span>
              )}
            </li>
          );
        })}
      </ol>

      <p className="adl-reading">{withCode(cell.reading)}</p>

      <p className="adl-footnote">
        The rung names are generic on purpose - every tool spells its own
        versions of them, and most let you set different rungs for different
        categories of action. The judgment underneath is the same two
        questions, asked per task, never answered once for all time.
      </p>
    </div>
  );
}
