import { useState } from 'react';
import {
  GLD_HOME_LABELS,
  GLD_SITUATIONS,
  gldConstraints,
  type GldHome,
  type GldKind,
  type GldSituation,
} from './guarantee-ladder-data';
import { withCode } from './with-code';
import './guarantee-ladder.css';
import { useWidgetFrame } from './widget-frame';

interface Status {
  label: string;
  tone: 'good' | 'warn' | 'bad';
}

/** What a placement's guarantee looks like when the situation stresses it */
function status(
  kind: GldKind,
  highStakes: boolean,
  sit: GldSituation
): Status {
  if (kind === 'wall')
    return { label: 'held - enforced, not remembered', tone: 'good' };
  if (kind === 'code') return { label: 'held - code on the rail', tone: 'good' };
  if (kind === 'blocksWork')
    return { label: 'holds - by blocking the work', tone: 'warn' };
  if (kind === 'unexpressed')
    return {
      label: 'not actually protected',
      tone: highStakes ? 'bad' : 'warn',
    };
  // judgment - the only kind the clock touches
  if (sit === 'watch') return { label: 'held - you’re the gate', tone: 'good' };
  if (sit === 'late')
    return {
      label: 'one compaction from gone',
      tone: highStakes ? 'bad' : 'warn',
    };
  return { label: 'nobody in the loop', tone: highStakes ? 'bad' : 'warn' };
}

export default function GuaranteeLadder() {
  // The instinct this widget stress-tests: write everything in the rules file.
  const [homes, setHomes] = useState<Record<string, GldHome>>(
    Object.fromEntries(gldConstraints.map((c) => [c.id, 'rule' as GldHome]))
  );
  const [sit, setSit] = useState<GldSituation>('watch');

  const place = (id: string, home: GldHome) =>
    setHomes((prev) => ({ ...prev, [id]: home }));

  const statuses = gldConstraints.map((c) => {
    const cell = c.cells[homes[c.id]];
    return status(cell.kind, c.highStakes, sit);
  });
  const held = statuses.filter((s) => s.tone === 'good').length;
  const shaky = statuses.filter((s) => s.tone === 'warn').length;
  const gone = statuses.filter((s) => s.tone === 'bad').length;

  const allRule = gldConstraints.every((c) => homes[c.id] === 'rule');
  const allBest = gldConstraints.every((c) => homes[c.id] === c.best);

  // Default is everything in the rules file, clock on "watch" (see useState).
  const isDefault = allRule && sit === 'watch';
  const reset = () => {
    setHomes(
      Object.fromEntries(gldConstraints.map((c) => [c.id, 'rule' as GldHome]))
    );
    setSit('watch');
  };

  let reading: string;
  if (allRule) {
    reading =
      sit === 'watch'
        ? 'All four look fine - and that’s the trap state. While you watch, an instruction is indistinguishable from a guarantee, because you’re the enforcement. The file didn’t hold the line; you did. Move the clock.'
        : sit === 'late'
          ? 'Hour three is where instructions quietly stop being guarantees: the session compacted, and whether any given line survived isn’t something you can see from here. The two high-stakes constraints are now running on hope.'
          : 'The 2am run: the only thing between the secrets, the untested money commit, and a mistake is the model’s memory of a file it read at session start. Nothing here holds because nothing here enforces.';
  } else if (allBest) {
    reading =
      sit === 'watch'
        ? 'Everything holds - but notice why each one holds. One is being weighed, one is walled, two are enforced. Same green, three different guarantees; the difference only shows when you stop watching.'
        : sit === 'late'
          ? 'The compaction cost you nothing that mattered. The preference may have faded - it was judgment, low stakes, and review catches it - while the wall and the two gates don’t live in the context window at all.'
          : 'The unattended run is the exam, and this passes it: the preference degraded gracefully, and everything with teeth is enforced by the harness or by code on the rail. Inform what needs judgment; wall what has a name; enforce what must be true.';
  } else {
    reading = `${held} of ${gldConstraints.length} hold here, and the gaps aren’t random - each one is a constraint whose home can’t express it or can’t enforce it. Match the guarantee to the need: judgment wants a rule, a named class wants a permission, a condition on the real action wants a hook.`;
  }

  return (
    <div className={useWidgetFrame('gld-root')}>
      {!isDefault && (
        <button
          type="button"
          className="gld-reset"
          onClick={reset}
          aria-label="Reset every constraint to the rules file and the clock to watch"
        >
          Reset
        </button>
      )}
      <p className="gld-lead">
        Four constraints you want to hold, three homes each: a{' '}
        <strong>rule</strong> (the model is told), a <strong>permission</strong>{' '}
        (the harness forbids a class of action), a <strong>hook</strong> (your
        code runs on the rail, every time). All four start in the rules file.
        Re-home them - then move the clock, because what holds while you watch
        isn’t what holds at 2am.
      </p>

      <div
        className="gld-clock"
        role="radiogroup"
        aria-label="Situation to stress-test against"
      >
        <span className="gld-clock-name">situation</span>
        <span className="gld-seg">
          {GLD_SITUATIONS.map((s) => (
            <label
              key={s.id}
              className={sit === s.id ? 'gld-seg-btn gld-seg-on' : 'gld-seg-btn'}
            >
              <input
                type="radio"
                name="gld-situation"
                checked={sit === s.id}
                onChange={() => setSit(s.id)}
              />
              {s.label}
            </label>
          ))}
        </span>
      </div>

      <ul className="gld-items">
        {gldConstraints.map((c, i) => {
          const home = homes[c.id];
          const cell = c.cells[home];
          const st = statuses[i];
          return (
            <li key={c.id} className="gld-item">
              <div className="gld-item-head">
                <span className="gld-item-label">{c.label}</span>
                <span className="gld-item-shape">{c.shape}</span>
              </div>
              <p className="gld-item-text">{withCode(c.text)}</p>
              <div className="gld-item-row">
                <span
                  className="gld-seg"
                  role="radiogroup"
                  aria-label={`Where should “${c.label}” live?`}
                >
                  {(Object.keys(GLD_HOME_LABELS) as GldHome[]).map((h) => (
                    <label
                      key={h}
                      className={
                        home === h ? 'gld-seg-btn gld-seg-on' : 'gld-seg-btn'
                      }
                    >
                      <input
                        type="radio"
                        name={`gld-${c.id}`}
                        checked={home === h}
                        onChange={() => place(c.id, h)}
                      />
                      {GLD_HOME_LABELS[h]}
                    </label>
                  ))}
                </span>
                <span className={`gld-chip gld-chip-${st.tone}`}>
                  {st.label}
                </span>
              </div>
              <p className="gld-item-why">{withCode(cell.why)}</p>
            </li>
          );
        })}
      </ul>

      <div className="gld-ledger" aria-live="polite">
        <div className="gld-stats">
          <span className="gld-stat">
            <span className="gld-stat-label">holding</span>
            <span
              className={
                held === gldConstraints.length
                  ? 'gld-stat-value gld-stat-good'
                  : 'gld-stat-value'
              }
            >
              {held} of {gldConstraints.length}
            </span>
          </span>
          <span className="gld-stat">
            <span className="gld-stat-label">shaky</span>
            <span
              className={
                shaky > 0
                  ? 'gld-stat-value gld-stat-warn'
                  : 'gld-stat-value gld-stat-good'
              }
            >
              {shaky}
            </span>
          </span>
          <span className="gld-stat">
            <span className="gld-stat-label">silently broken</span>
            <span
              className={
                gone > 0
                  ? 'gld-stat-value gld-stat-bad'
                  : 'gld-stat-value gld-stat-good'
              }
            >
              {gone}
            </span>
          </span>
        </div>
        <p className="gld-reading">{reading}</p>
      </div>

      <p className="gld-footnote">
        Each tool wears its own names - permissions may be an
        approvals-and-sandbox dial, a hook a plugin on lifecycle events - but
        the ladder is the same: guarantee strength is set by what sits in the
        loop - the model’s memory, a harness wall, or your code.
      </p>
    </div>
  );
}
