import React, { useState } from 'react';
import {
  RLE_CLASS_META,
  RLE_SESSIONS_PER_WEEK,
  rleLines,
} from './rule-economy-data';
import { withCode } from './with-code';
import './rule-economy.css';

const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${Math.round(n)}`;

export default function RuleEconomy() {
  const [inFile, setInFile] = useState<Set<string>>(
    new Set(['test-cmd', 'clean-code'])
  );

  const toggle = (id: string) => {
    setInFile((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const picked = rleLines.filter((l) => inFile.has(l.id));
  const costPerWeek = picked.reduce(
    (sum, l) => sum + l.tokens * RLE_SESSIONS_PER_WEEK,
    0
  );
  const savedPerWeek = picked.reduce((sum, l) => sum + l.savedPerWeek, 0);
  const net = savedPerWeek - costPerWeek;
  const bloatCount = picked.filter((l) => l.cls !== 'durable').length;

  let reading: string;
  if (picked.length === 0) {
    reading =
      'An empty file costs nothing — and teaches nothing. Add a line and watch the ledger.';
  } else if (net > 0 && bloatCount === 0) {
    reading =
      'Every line pays rent. This is what a lean rules file looks like: durable, project-specific facts and nothing else.';
  } else if (net > 0) {
    reading = `Net positive — but ${bloatCount} ${
      bloatCount === 1 ? 'line is' : 'lines are'
    } paying rent with the durable facts’ savings. Cut the amber ones; the ledger only improves.`;
  } else {
    reading =
      'This file costs more than it saves. Bloat isn’t neutral: every line the model reads competes with the task for attention.';
  }

  return (
    <div className="rle-root not-content">
      <p className="rle-lead">
        Seven candidate lines for your rules file. Toggle each one in and see
        whether it earns its slot over a week of sessions.
      </p>

      <ul className="rle-lines">
        {rleLines.map((l) => {
          const on = inFile.has(l.id);
          const meta = RLE_CLASS_META[l.cls];
          return (
            <li key={l.id}>
              <label className="rle-line">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(l.id)}
                />
                <span className="rle-line-text">{withCode(l.text)}</span>
                <span className="rle-line-meta">
                  {on ? (
                    <span className={`rle-chip rle-chip-${meta.tone}`}>
                      {meta.chip}
                    </span>
                  ) : (
                    <span className="rle-cost-off">{l.tokens} tok</span>
                  )}
                </span>
                {on && <span className="rle-line-why">{withCode(l.why)}</span>}
              </label>
            </li>
          );
        })}
      </ul>

      <div className="rle-ledger" aria-live="polite">
        <div className="rle-stats">
          <span className="rle-stat">
            <span className="rle-stat-label">always-loaded cost</span>
            <span className="rle-stat-value">{fmt(costPerWeek)} tok/week</span>
          </span>
          <span className="rle-stat">
            <span className="rle-stat-label">re-teaching avoided</span>
            <span className="rle-stat-value rle-stat-saved">
              {fmt(savedPerWeek)} tok/week
            </span>
          </span>
          <span className="rle-stat">
            <span className="rle-stat-label">net</span>
            <span
              className={
                net >= 0
                  ? 'rle-stat-value rle-net-good'
                  : 'rle-stat-value rle-net-bad'
              }
            >
              {net >= 0 ? '+' : '−'}
              {fmt(Math.abs(net))} tok/week
            </span>
          </span>
        </div>
        <p className="rle-reading">{reading}</p>
      </div>

      <p className="rle-footnote">
        Token numbers are illustrative — a re-teach cycle (wrong attempt,
        correction, redo) dwarfs the cost of the line that prevents it, and
        that ratio is the point. Assumes {RLE_SESSIONS_PER_WEEK} sessions a
        week; the file is loaded into the window at the start of every one.
      </p>
    </div>
  );
}
