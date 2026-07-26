import React, { useRef, useState } from 'react';
import {
  BC_CARD,
  BC_COPY,
  BC_GREP,
  BC_PALETTES,
  BC_SPACE_4,
  bcValues,
  type BcValue,
} from './bindings-check-data';
import { withCode } from './with-code';
import './bindings-check.css';
import { useWidgetFrame } from './widget-frame';

type BcReveal = 'grep' | 'rebrand';
type BcMark = 'flagged' | 'missed' | 'false-alarm' | null;

export default function BindingsCheck() {
  const [suspects, setSuspects] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<BcReveal | null>(null);
  const [rove, setRove] = useState(0);
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const revealed = active !== null;
  const rebranded = active === 'rebrand';
  const isDefault = suspects.size === 0 && !revealed;

  const pal = BC_PALETTES[rebranded ? 'teal' : 'purple'];
  const rootStyle = {
    '--bc-brand-500': pal.brand500,
    '--bc-brand-600': pal.brand600,
    '--bc-space-4': BC_SPACE_4,
  } as React.CSSProperties;

  const reset = () => {
    setSuspects(new Set());
    setActive(null);
  };

  const toggle = (id: string) => {
    if (revealed) return;
    setSuspects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onChipKey = (e: React.KeyboardEvent, i: number) => {
    const n = bcValues.length;
    let next: number | null = null;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (i + 1) % n;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (i - 1 + n) % n;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = n - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    setRove(next);
    chipRefs.current[next]?.focus();
  };

  const markOf = (v: BcValue): BcMark => {
    if (!revealed) return null;
    const suspected = suspects.has(v.id);
    if (v.source === 'literal') return suspected ? 'flagged' : 'missed';
    return suspected ? 'false-alarm' : null;
  };

  const markLabel: Record<Exclude<BcMark, null>, string> = {
    flagged: BC_COPY.markFlagged,
    missed: BC_COPY.markMissed,
    'false-alarm': BC_COPY.markFalseAlarm,
  };

  const flaggedCount = bcValues.filter(
    (v) => v.source === 'literal' && suspects.has(v.id)
  ).length;
  const falseAlarms = suspects.size - flaggedCount;
  const grading = BC_COPY.grading
    .replace('{x}', String(flaggedCount))
    .replace('{y}', String(falseAlarms))
    .replace('{s}', falseAlarms === 1 ? '' : 's');

  return (
    <div
      className={useWidgetFrame('bc-root')}
      style={rootStyle}
      data-rebranded={rebranded || undefined}
    >
      {!isDefault && (
        <button
          type="button"
          className="bc-reset"
          onClick={reset}
          aria-label={BC_COPY.resetAria}
        >
          {BC_COPY.resetLabel}
        </button>
      )}

      <div className="bc-stage">
        <div className="bc-card-col">
          {/* Demo artifact only - every value it renders is inspectable as
              text in the chips, so the card itself is hidden from AT. */}
          <div className="bc-card" aria-hidden="true">
            <span className="bc-card-badge">{BC_CARD.badge}</span>
            <div className="bc-card-title">{BC_CARD.name}</div>
            <p className="bc-card-price">
              <span className="bc-card-amount">{BC_CARD.amount}</span>
              <span className="bc-card-per">{BC_CARD.per}</span>
            </p>
            <ul className="bc-card-features">
              {BC_CARD.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <span className="bc-card-cta">{BC_CARD.cta}</span>
          </div>
          <p className="bc-status">{BC_COPY.statusPass}</p>
          <p className="bc-hook">{BC_COPY.hook}</p>
        </div>

        <div className="bc-inspect">
          <div
            className="bc-chips"
            role="group"
            aria-label={BC_COPY.chipsGroupLabel}
          >
            {bcValues.map((v, i) => {
              const suspected = suspects.has(v.id);
              const mark = markOf(v);
              const tone = revealed
                ? v.source === 'token'
                  ? ' bc-chip--good'
                  : ' bc-chip--bad'
                : '';
              return (
                <button
                  key={v.id}
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  type="button"
                  className={`bc-chip${suspected ? ' bc-chip--suspect' : ''}${tone}`}
                  tabIndex={i === rove ? 0 : -1}
                  aria-pressed={suspected}
                  aria-disabled={revealed || undefined}
                  onClick={() => {
                    setRove(i);
                    toggle(v.id);
                  }}
                  onFocus={() => setRove(i)}
                  onKeyDown={(e) => onChipKey(e, i)}
                >
                  <span className="bc-chip-head">
                    <span className="bc-chip-label">{v.label}</span>
                    <code className="bc-chip-prop">{v.property}</code>
                    {!revealed && suspected && (
                      <span className="bc-tag bc-tag--suspect">
                        {BC_COPY.suspectTag}
                      </span>
                    )}
                    {mark && (
                      <span className={`bc-tag bc-tag--${mark}`}>
                        {markLabel[mark]}
                      </span>
                    )}
                  </span>
                  <span className="bc-chip-body">
                    <span className="bc-chip-render">
                      {v.kind === 'color' && (
                        <span
                          className="bc-swatch"
                          style={{ background: v.swatchCss }}
                          aria-hidden="true"
                        />
                      )}
                      <span className="bc-chip-value">
                        renders{' '}
                        {rebranded ? v.rendersAsRebranded : v.rendersAs}
                      </span>
                    </span>
                    <span className="bc-chip-source">
                      {revealed ? (
                        <code>{v.resolved}</code>
                      ) : (
                        <>
                          source <code>?</code>
                        </>
                      )}
                    </span>
                  </span>
                  {revealed && (
                    <span className="bc-chip-note">{withCode(v.note)}</span>
                  )}
                </button>
              );
            })}
          </div>
          {!revealed && (
            <p className="bc-counter">
              {BC_COPY.counter.replace('{n}', String(suspects.size))}
            </p>
          )}
        </div>
      </div>

      <p className="bc-decide-prompt">{BC_COPY.decidePrompt}</p>
      <div
        className="bc-decide"
        role="group"
        aria-label={BC_COPY.decideGroupLabel}
      >
        <button
          type="button"
          className="bc-btn bc-btn--primary"
          aria-pressed={active === 'grep'}
          onClick={() => setActive('grep')}
        >
          <span className="bc-btn-label">{BC_COPY.grepLabel}</span>
          <span className="bc-btn-sub">{BC_COPY.grepSub}</span>
        </button>
        <button
          type="button"
          className="bc-btn"
          aria-pressed={active === 'rebrand'}
          onClick={() => setActive('rebrand')}
        >
          <span className="bc-btn-label">{BC_COPY.rebrandLabel}</span>
          <span className="bc-btn-sub">{BC_COPY.rebrandSub}</span>
        </button>
      </div>

      <div className="bc-outcome" aria-live="polite">
        {active === 'grep' && (
          <>
            <div className="bc-grep">
              <div className="bc-grep-cmd">{BC_GREP.command}</div>
              {BC_GREP.lines.map((l) => (
                <div key={l.lineNo} className="bc-grep-line">
                  <span className="bc-grep-no">{l.lineNo}:</span>
                  <span className="bc-grep-snippet">{l.snippet}</span>
                </div>
              ))}
            </div>
            <p className="bc-outcome-line">{BC_COPY.grepOutcome}</p>
          </>
        )}
        {active === 'rebrand' && (
          <>
            <p className="bc-outcome-lead">{withCode(BC_COPY.rebrandLead)}</p>
            <p className="bc-outcome-line">{BC_COPY.rebrandOutcome}</p>
          </>
        )}
        {revealed && (
          <>
            <p className="bc-grading">{grading}</p>
            <p className="bc-verdict">{BC_COPY.verdict}</p>
          </>
        )}
      </div>
    </div>
  );
}
