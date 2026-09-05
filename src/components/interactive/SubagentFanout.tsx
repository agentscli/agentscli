import { useState } from 'react';
import { withCode } from './with-code';
import './subagent-fanout.css';
import { useWidgetFrame } from './widget-frame';

/**
 * Inline-vs-delegated comparison for a fan-out task. Token counts are
 * illustrative (window = 200k, fixed overhead matches context-sim-data.ts);
 * the shape - parent coherence + parallelism vs total tokens - is the point.
 * Domains match the stash extraction-engine migration (teams/orchestration.mdx):
 * extraction lead, index lead, interface lead each read their own domain
 * before any migration work starts.
 */

const WINDOW = 200;

interface Seg {
  id: string;
  label: string;
  tokens: number;
  color: 'overhead' | 'chat' | 'files' | 'summary';
}

const PARENT_BASE: Seg[] = [
  { id: 'overhead', label: 'System prompt, tools, rules', tokens: 17, color: 'overhead' },
  { id: 'brief', label: 'Your migration brief', tokens: 1, color: 'chat' },
];

const SWEEPS = [
  { id: 'extraction', label: 'extraction/ sweep', tokens: 46 },
  { id: 'index', label: 'index/ sweep', tokens: 39 },
  { id: 'interface', label: 'interface/ sweep', tokens: 33 },
];

const SUMMARY_TOKENS = 2;

export default function SubagentFanout() {
  const [delegated, setDelegated] = useState(false);

  const parentSegs: Seg[] = delegated
    ? [
        ...PARENT_BASE,
        ...SWEEPS.map((s) => ({
          id: `${s.id}-sum`,
          label: `${s.label} - summary`,
          tokens: SUMMARY_TOKENS,
          color: 'summary' as const,
        })),
      ]
    : [
        ...PARENT_BASE,
        ...SWEEPS.map((s) => ({
          id: s.id,
          label: `${s.label} - full trail`,
          tokens: s.tokens,
          color: 'files' as const,
        })),
      ];

  const total = parentSegs.reduce((sum, s) => sum + s.tokens, 0);
  const pct = Math.round((total / WINDOW) * 100);

  return (
    <div className={useWidgetFrame('sbf-root')}>
      <div className="sbf-modes" role="group" aria-label="Execution mode">
        <button
          className={!delegated ? 'sbf-mode sbf-mode-active' : 'sbf-mode'}
          aria-pressed={!delegated}
          onClick={() => setDelegated(false)}
        >
          Run it inline
        </button>
        <button
          className={delegated ? 'sbf-mode sbf-mode-active' : 'sbf-mode'}
          aria-pressed={delegated}
          onClick={() => setDelegated(true)}
        >
          Delegate to 3 subagents
        </button>
      </div>

      <div className="sbf-parent">
        <div className="sbf-parent-head">
          <span className="sbf-parent-title">Your window</span>
          <span className={pct >= 50 ? 'sbf-gauge sbf-gauge-hot' : 'sbf-gauge'}>
            {total}k / {WINDOW}k ({pct}%)
          </span>
        </div>
        <div
          className="sbf-bar"
          role="img"
          aria-label={`Parent window: ${total}k of ${WINDOW}k tokens (${pct}%)`}
        >
          {parentSegs.map((seg) => (
            <span
              key={seg.id}
              className={`sbf-seg sbf-seg-${seg.color}`}
              style={{ width: `${(seg.tokens / WINDOW) * 100}%` }}
              title={`${seg.label} - ${seg.tokens}k`}
            />
          ))}
        </div>
      </div>

      {delegated && (
        <div className="sbf-subagents">
          {SWEEPS.map((s) => (
            <div key={s.id} className="sbf-sub">
              <div className="sbf-sub-title">{s.label} subagent</div>
              <div className="sbf-sub-bar">
                <span
                  className="sbf-sub-fill"
                  style={{ width: `${(s.tokens / WINDOW) * 100}%` }}
                />
              </div>
              <div className="sbf-sub-note">
                {s.tokens}k burned in its own window · returns {SUMMARY_TOKENS}k
                · window discarded
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="sbf-narration" aria-live="polite">
        {delegated
          ? withCode(
              'Same reading, same greps - but in three windows you never see, running in parallel. Your window holds the brief and three short lead reports; the migration work you were about to start is still in full focus. Delegation doesn’t reduce total tokens spent. It buys parent coherence and parallelism.'
            )
          : withCode(
              'Three domain sweeps, sequentially, in your window. Every file read and dead-end grep lands next to the migration work you actually came here to do - illustrative bars, but the shape holds: past halfway before any of it is done, and the sweeps ran one at a time.'
            )}
      </p>
    </div>
  );
}
