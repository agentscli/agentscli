import { useState } from 'react';
import {
  MDE_EFFORT_LABELS,
  MDE_EFFORT_MULT,
  MDE_MODEL_LABELS,
  MDE_MODEL_MULT,
  mdeTasks,
  type MdeCorner,
  type MdeEffort,
  type MdeModel,
} from './model-economy-data';
import { withCode } from './with-code';
import './model-economy.css';
import { useWidgetFrame } from './widget-frame';

interface Dial {
  model: MdeModel;
  effort: MdeEffort;
}

/** Cost of the expensive corner, per occurrence - what an escalation pays */
const escalate = (size: number) =>
  size * MDE_MODEL_MULT.capable * MDE_EFFORT_MULT.high;

/** Spend on first runs for one task under one dial setting */
function runCost(task: (typeof mdeTasks)[number], d: Dial): number {
  return (
    task.count * task.size * MDE_MODEL_MULT[d.model] * MDE_EFFORT_MULT[d.effort]
  );
}

/**
 * The redo tax. An underpowered hard task fails twice more at its corner and
 * escalates to the expensive corner anyway; a capable-but-shallow hard task
 * pays one rerun at full depth after review catches the coin flip.
 */
function redoCost(task: (typeof mdeTasks)[number], d: Dial): number {
  if (!task.hard) return 0;
  const perRun =
    task.size * MDE_MODEL_MULT[d.model] * MDE_EFFORT_MULT[d.effort];
  if (d.model === 'light')
    return task.count * (2 * perRun + escalate(task.size));
  if (d.effort === 'low') return task.count * escalate(task.size);
  return 0;
}

function DialGroup({
  taskId,
  taskLabel,
  name,
  labels,
  value,
  onChange,
}: {
  taskId: string;
  taskLabel: string;
  name: string;
  labels: Record<string, string>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <span className="mde-dial">
      <span className="mde-dial-name">{name}</span>
      <span
        className="mde-seg"
        role="radiogroup"
        aria-label={`${name} for “${taskLabel}”`}
      >
        {Object.keys(labels).map((k) => (
          <label
            key={k}
            className={value === k ? 'mde-seg-btn mde-seg-on' : 'mde-seg-btn'}
          >
            <input
              type="radio"
              name={`mde-${taskId}-${name}`}
              checked={value === k}
              onChange={() => onChange(k)}
            />
            {labels[k]}
          </label>
        ))}
      </span>
    </span>
  );
}

export default function ModelEconomy() {
  // The trap this widget exists to price: a favourite setting, pinned.
  const [dials, setDials] = useState<Record<string, Dial>>(
    Object.fromEntries(
      mdeTasks.map((t) => [t.id, { model: 'capable', effort: 'high' } as Dial])
    )
  );

  const setDial = (id: string, patch: Partial<Dial>) =>
    setDials((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const bestDial = (t: (typeof mdeTasks)[number]): Dial => {
    const [model, effort] = t.best.split('/') as [MdeModel, MdeEffort];
    return { model, effort };
  };

  // Three ways to set every dial at once - the second state (the redo tax)
  // is one chip away instead of hidden behind a deliberate mis-dial.
  type Preset = {
    id: string;
    label: string;
    dialFor: (t: (typeof mdeTasks)[number]) => Dial;
  };
  const presets: Preset[] = [
    {
      id: 'pin',
      label: 'pin everything expensive',
      dialFor: () => ({ model: 'capable', effort: 'high' }),
    },
    { id: 'route', label: 'route by task', dialFor: bestDial },
    {
      id: 'underpower',
      label: 'underpower the hard task',
      dialFor: (t) => (t.hard ? { model: 'light', effort: 'low' } : bestDial(t)),
    },
  ];
  const applyPreset = (p: Preset) =>
    setDials(Object.fromEntries(mdeTasks.map((t) => [t.id, p.dialFor(t)])));
  const presetActive = (p: Preset) =>
    mdeTasks.every((t) => {
      const d = p.dialFor(t);
      return dials[t.id].model === d.model && dials[t.id].effort === d.effort;
    });

  // Default is the pinned-expensive corner (see useState above).
  const isDefault = mdeTasks.every(
    (t) => dials[t.id].model === 'capable' && dials[t.id].effort === 'high'
  );
  const reset = () =>
    setDials(
      Object.fromEntries(
        mdeTasks.map((t) => [t.id, { model: 'capable', effort: 'high' } as Dial])
      )
    );

  const spend = mdeTasks.reduce((sum, t) => sum + runCost(t, dials[t.id]), 0);
  const redo = mdeTasks.reduce((sum, t) => sum + redoCost(t, dials[t.id]), 0);
  const total = spend + redo;

  const matchedTotal = mdeTasks.reduce((sum, t) => {
    const [model, effort] = t.best.split('/') as [MdeModel, MdeEffort];
    return sum + runCost(t, { model, effort });
  }, 0);
  const ratio = total / matchedTotal;

  const misplaced = mdeTasks.filter(
    (t) => `${dials[t.id].model}/${dials[t.id].effort}` !== t.best
  ).length;
  const underpowered = mdeTasks.some(
    (t) => t.hard && dials[t.id].model === 'light'
  );
  const coinflip = mdeTasks.some(
    (t) =>
      t.hard &&
      dials[t.id].model === 'capable' &&
      dials[t.id].effort === 'low'
  );

  let reading: string;
  if (misplaced === 0) {
    reading =
      'This is the lumpy day costing what it should: pocket change on the mechanical work, real budget on the two hard problems - which are now almost the entire bill, and earn it. Spend concentrated where a wrong answer is expensive is what a well-dialled day looks like.';
  } else if (underpowered) {
    reading =
      'The cheap corner just became the expensive one: the hard task fails, retries, and escalates to the big model anyway, so the redo tax alone beats starting on the matched corner - before counting your time reading confident wrong answers. Underpowering the hard problem is the costly mistake, not overpaying for it.';
  } else if (coinflip) {
    reading =
      'Nothing failed outright - but a hard problem got a capable brain on a shallow budget, and what that buys is the first defensible answer, delivered confidently. The tasks that fork are exactly where deep effort pays; skimp there and your review is doing the reasoning you didn’t buy.';
  } else {
    reading = `Everything ships - no failures, no redo tax - and the day still costs ${ratio.toFixed(
      1
    )}× what it should. That’s the quiet leak of a pinned dial: the mechanical work bills like hard work, five and three times over. Dial it down to the cheapest corner that ships it; the hard problems keep their budget.`;
  }

  return (
    <div className={useWidgetFrame('mde-root')}>
      {!isDefault && (
        <button
          type="button"
          className="mde-reset"
          onClick={reset}
          aria-label="Reset the dials to the starting configuration"
        >
          Reset
        </button>
      )}
      <p className="mde-lead">
        A lumpy day: four kinds of task, and two dials on each - which{' '}
        <strong>model</strong> answers, and how much <strong>effort</strong> it
        spends thinking. Everything starts where most people leave it: pinned
        to the expensive corner. Re-dial each task and watch what the day
        costs.
      </p>

      <ul className="mde-tasks">
        {mdeTasks.map((t) => {
          const d = dials[t.id];
          const verdict = t.verdicts[`${d.model}/${d.effort}` as MdeCorner];
          return (
            <li key={t.id} className="mde-task">
              <div className="mde-task-head">
                <span className="mde-task-label">{t.label}</span>
                <span className="mde-task-cadence">{t.cadence}</span>
              </div>
              <p className="mde-task-text">{withCode(t.text)}</p>
              <div className="mde-task-row">
                <div className="mde-dials">
                  <DialGroup
                    taskId={t.id}
                    taskLabel={t.label}
                    name="model"
                    labels={MDE_MODEL_LABELS}
                    value={d.model}
                    onChange={(v) => setDial(t.id, { model: v as MdeModel })}
                  />
                  <DialGroup
                    taskId={t.id}
                    taskLabel={t.label}
                    name="effort"
                    labels={MDE_EFFORT_LABELS}
                    value={d.effort}
                    onChange={(v) => setDial(t.id, { effort: v as MdeEffort })}
                  />
                </div>
                <span className={`mde-chip mde-chip-${verdict.tone}`}>
                  {verdict.chip}
                </span>
              </div>
              <p className="mde-task-why">{withCode(verdict.why)}</p>
            </li>
          );
        })}
      </ul>

      <div className="mde-presets" role="group" aria-label="Dial presets">
        <span className="mde-presets-name">presets</span>
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            className={presetActive(p) ? 'mde-preset mde-preset-on' : 'mde-preset'}
            aria-pressed={presetActive(p)}
            onClick={() => applyPreset(p)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mde-ledger" aria-live="polite">
        <div className="mde-stats">
          <span className="mde-stat">
            <span className="mde-stat-label">first runs</span>
            <span className="mde-stat-value">{spend} units</span>
          </span>
          <span className="mde-stat">
            <span className="mde-stat-label">redo tax</span>
            <span
              className={
                redo > 0
                  ? 'mde-stat-value mde-stat-bad'
                  : 'mde-stat-value mde-stat-good'
              }
            >
              {redo} units
            </span>
          </span>
          <span className="mde-stat">
            <span className="mde-stat-label">vs the matched day</span>
            <span
              className={
                ratio > 1.01
                  ? 'mde-stat-value mde-stat-bad'
                  : 'mde-stat-value mde-stat-good'
              }
            >
              {ratio.toFixed(1)}×
            </span>
          </span>
        </div>
        <p className="mde-reading">{reading}</p>
      </div>

      <p className="mde-footnote">
        Numbers are illustrative - the ratios are the point (capable ≈{' '}
        {MDE_MODEL_MULT.capable}× per token, high effort ≈{' '}
        {MDE_EFFORT_MULT.high}× the tokens). The redo tax counts an
        underpowered task’s failed attempts plus the escalation you’d run
        anyway, not the hour lost to confident wrong answers.
      </p>
    </div>
  );
}
