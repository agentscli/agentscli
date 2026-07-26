import React, { useState } from 'react';
import {
  SKE_HOME_LABELS,
  SKE_SESSIONS_PER_WEEK,
  SKE_STUB_TOKENS,
  skeItems,
  type SkeHome,
} from './skill-economy-data';
import { withCode } from './with-code';
import './skill-economy.css';
import { useWidgetFrame } from './widget-frame';

const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${Math.round(n)}`;

/** Window tokens per week for one item under one placement */
function tokensPerWeek(item: (typeof skeItems)[number], home: SkeHome): number {
  if (home === 'rule') return item.tokens * SKE_SESSIONS_PER_WEEK;
  if (home === 'skill') {
    // A fact filed as a skill has no moment of invocation - the body never loads.
    const bodyLoads = item.kind === 'fact' ? 0 : item.usesPerWeek;
    return SKE_STUB_TOKENS * SKE_SESSIONS_PER_WEEK + item.tokens * bodyLoads;
  }
  return item.tokens * item.usesPerWeek;
}

/** Times per week the human re-teaches (or corrects) this item */
function reteachPerWeek(item: (typeof skeItems)[number], home: SkeHome): number {
  if (item.kind === 'fact' && home !== 'rule') return item.usesPerWeek;
  if (item.kind === 'procedure' && home === 'prompt') return item.usesPerWeek;
  return 0;
}

export default function SkillEconomy() {
  // The naive starting point: everything crammed into the rules file.
  const [homes, setHomes] = useState<Record<string, SkeHome>>(
    Object.fromEntries(skeItems.map((i) => [i.id, 'rule' as SkeHome]))
  );

  const place = (id: string, home: SkeHome) =>
    setHomes((prev) => ({ ...prev, [id]: home }));

  // Default is everything crammed into the rules file (see useState above).
  const isDefault = skeItems.every((i) => homes[i.id] === 'rule');
  const reset = () =>
    setHomes(
      Object.fromEntries(skeItems.map((i) => [i.id, 'rule' as SkeHome]))
    );

  const costPerWeek = skeItems.reduce(
    (sum, i) => sum + tokensPerWeek(i, homes[i.id]),
    0
  );
  const reteach = skeItems.reduce(
    (sum, i) => sum + reteachPerWeek(i, homes[i.id]),
    0
  );
  const misplaced = skeItems.filter((i) => homes[i.id] !== i.best);
  const deadFact = skeItems.some(
    (i) => i.kind === 'fact' && homes[i.id] === 'skill'
  );
  const idleRent = skeItems.some(
    (i) => i.kind === 'procedure' && homes[i.id] === 'rule'
  );
  const humanMemory = skeItems.some(
    (i) => i.kind === 'procedure' && homes[i.id] === 'prompt'
  );

  let reading: string;
  if (misplaced.length === 0) {
    reading =
      'Every piece is in its cheapest working home: the fact stays in view, the procedures wait behind a tiny stub, and the one-off never took a permanent slot. Same knowledge as the everything-in-rules version - at a fraction of the window cost, with nothing re-taught.';
  } else if (deadFact) {
    reading =
      'The dangerous one: a fact filed as a skill. It isn’t expensive - it just never loads, because facts don’t have a moment of invocation. The agent writes float code with the rule sitting one unfired call away.';
  } else if (idleRent) {
    reading =
      'The procedures are paying rent in every session for the few that use them. Move them behind a skill stub: the knowledge stays one invocation away, and the window cost collapses.';
  } else if (humanMemory) {
    reading =
      'Re-narrating a stable procedure keeps you as its memory. The tokens are similar to a skill - the difference is who holds the steps, and what happens the week you’re rushed.';
  } else {
    reading =
      'Close - the one-off is the odd piece out. Knowledge that expires with the task shouldn’t get a permanent slot anywhere; just say it in the prompt.';
  }

  return (
    <div className={useWidgetFrame('ske-root')}>
      {!isDefault && (
        <button
          type="button"
          className="ske-reset"
          onClick={reset}
          aria-label="Reset every item back to the rules file"
        >
          Reset
        </button>
      )}
      <p className="ske-lead">
        Four things you keep teaching the agent, all currently crammed into the
        rules file. Each needs a home: the <strong>rules file</strong> (loaded
        every session), a <strong>skill</strong> (a {SKE_STUB_TOKENS}-token
        menu line every session, full body only when invoked), or the{' '}
        <strong>prompt</strong> (said when it comes up). Re-home them and watch
        the ledger.
      </p>

      <ul className="ske-items">
        {skeItems.map((item) => {
          const home = homes[item.id];
          const verdict = item.verdicts[home];
          return (
            <li key={item.id} className="ske-item">
              <div className="ske-item-head">
                <span className="ske-item-label">{item.label}</span>
                <span className="ske-item-cadence">
                  {item.cadence} · ~{fmt(item.tokens)} tok
                </span>
              </div>
              <p className="ske-item-text">{withCode(item.text)}</p>
              <div className="ske-item-row">
                <div
                  className="ske-seg"
                  role="radiogroup"
                  aria-label={`Where should “${item.label}” live?`}
                >
                  {(Object.keys(SKE_HOME_LABELS) as SkeHome[]).map((h) => (
                    <label
                      key={h}
                      className={
                        home === h ? 'ske-seg-btn ske-seg-on' : 'ske-seg-btn'
                      }
                    >
                      <input
                        type="radio"
                        name={`ske-${item.id}`}
                        checked={home === h}
                        onChange={() => place(item.id, h)}
                      />
                      {SKE_HOME_LABELS[h]}
                    </label>
                  ))}
                </div>
                <span className={`ske-chip ske-chip-${verdict.tone}`}>
                  {verdict.chip}
                </span>
              </div>
              <p className="ske-item-why">{withCode(verdict.why)}</p>
            </li>
          );
        })}
      </ul>

      <div className="ske-ledger" aria-live="polite">
        <div className="ske-stats">
          <span className="ske-stat">
            <span className="ske-stat-label">window cost</span>
            <span className="ske-stat-value">{fmt(costPerWeek)} tok/week</span>
          </span>
          <span className="ske-stat">
            <span className="ske-stat-label">you re-teach</span>
            <span
              className={
                reteach > 0
                  ? 'ske-stat-value ske-stat-bad'
                  : 'ske-stat-value ske-stat-good'
              }
            >
              {fmt(reteach)}×/week
            </span>
          </span>
          <span className="ske-stat">
            <span className="ske-stat-label">misplaced</span>
            <span
              className={
                misplaced.length > 0
                  ? 'ske-stat-value ske-stat-bad'
                  : 'ske-stat-value ske-stat-good'
              }
            >
              {misplaced.length} of {skeItems.length}
            </span>
          </span>
        </div>
        <p className="ske-reading">{reading}</p>
      </div>

      <p className="ske-footnote">
        Numbers are illustrative - the ratios are the point. Over{' '}
        {SKE_SESSIONS_PER_WEEK} sessions a week: a rule pays full size every
        session, a skill pays a ~{SKE_STUB_TOKENS}-token stub plus its body only
        when it fires, a prompt pays only when said - but you’re the one saying
        it.
      </p>
    </div>
  );
}
