import React, { useId, useRef, useState } from 'react';
import {
  FE_CLOSING,
  FE_EMPTY,
  FE_FRAMING,
  FE_NUDGE_AT,
  FE_PASS_THRESHOLD,
  FE_PROBE,
  feStructures,
  type FeFileRow,
  type FeStructureId,
} from './fresh-eyes-data';
import { withCode } from './with-code';
import './fresh-eyes.css';
import { useWidgetFrame } from './widget-frame';

/** Interpolate {opens} and the {s} plural suffix into a data template. */
const interp = (template: string, opens: number) =>
  template.replace(/\{opens\}/g, String(opens)).replace(/\{s\}/g, opens === 1 ? '' : 's');

/** Strip backticks for screen-reader announcements. */
const plain = (s: string) => s.replace(/`/g, '');

const isFile = (row: { kind: string }): row is FeFileRow => row.kind === 'file';

const EMPTY_OPENED: Record<FeStructureId, string[]> = { layer: [], domain: [] };
const EMPTY_VERDICTS: Record<FeStructureId, number | null> = {
  layer: null,
  domain: null,
};

export default function FreshEyes() {
  const uid = useId();
  const [tab, setTab] = useState<FeStructureId>('layer');
  const [opened, setOpened] = useState<Record<FeStructureId, string[]>>(EMPTY_OPENED);
  // Opens count at the moment the last piece landed, per structure.
  const [verdictOpens, setVerdictOpens] =
    useState<Record<FeStructureId, number | null>>(EMPTY_VERDICTS);
  const [announce, setAnnounce] = useState('');
  // Roving Tab stop within the active tree (index into its file rows).
  const [rove, setRove] = useState(0);
  const rowRefs = useRef(new Map<string, HTMLButtonElement>());
  const tabRefs = useRef(new Map<FeStructureId, HTMLButtonElement>());

  const structure = feStructures.find((s) => s.id === tab)!;
  const other = feStructures.find((s) => s.id !== tab)!;
  const files = structure.rows.filter(isFile);
  const openedIds = opened[tab];
  const opens = openedIds.length;
  const piecesFound = openedIds.filter(
    (id) => files.find((f) => f.id === id)?.piece
  ).length;
  const verdict = verdictOpens[tab];
  const verdictIsPass = (s: (typeof feStructures)[number], v: number) =>
    v <= FE_PASS_THRESHOLD && s.verdictPass !== null;

  const roveIdx = Math.min(rove, files.length - 1);
  const bothDone = feStructures.every((s) => verdictOpens[s.id] !== null);
  const isDefault =
    tab === 'layer' && opened.layer.length === 0 && opened.domain.length === 0;

  const reset = () => {
    setTab('layer');
    setOpened(EMPTY_OPENED);
    setVerdictOpens(EMPTY_VERDICTS);
    setAnnounce('');
    setRove(0);
  };

  const switchTab = (id: FeStructureId, focus = false) => {
    setTab(id);
    setRove(0);
    if (focus) tabRefs.current.get(id)?.focus();
  };

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      switchTab(other.id, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      switchTab(feStructures[0].id, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      switchTab(feStructures[feStructures.length - 1].id, true);
    }
  };

  const openFile = (f: FeFileRow) => {
    if (openedIds.includes(f.id)) return;
    const nextOpened = [...openedIds, f.id];
    setOpened((prev) => ({ ...prev, [tab]: nextOpened }));
    let msg = `${f.path}: ${plain(f.finding)}`;
    const nextPieces = nextOpened.filter(
      (id) => files.find((x) => x.id === id)?.piece
    ).length;
    if (verdict === null && nextPieces >= structure.piecesNeeded) {
      const n = nextOpened.length;
      setVerdictOpens((prev) => ({ ...prev, [tab]: n }));
      const template = verdictIsPass(structure, n)
        ? structure.verdictPass!
        : structure.verdictFail;
      msg += ` ${plain(interp(template, n))}`;
    }
    setAnnounce(msg);
  };

  // Roving-tabindex keyboard model for the tree's file rows: one Tab stop,
  // arrows/Home/End move it. Enter/Space open via the native button click.
  const onRowKey = (e: React.KeyboardEvent, idx: number) => {
    const moveTo = (target: number) => {
      e.preventDefault();
      setRove(target);
      rowRefs.current.get(files[target].id)?.focus();
    };
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        moveTo(Math.min(idx + 1, files.length - 1));
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        moveTo(Math.max(idx - 1, 0));
        break;
      case 'Home':
        moveTo(0);
        break;
      case 'End':
        moveTo(files.length - 1);
        break;
    }
  };

  const showNudge =
    structure.nudge !== null && verdict === null && opens >= FE_NUDGE_AT;
  const showNext = verdict !== null && verdictOpens[other.id] === null;

  let fileIdx = -1;

  return (
    <div className={useWidgetFrame('fresh-eyes-root')}>
      {!isDefault && (
        <button
          type="button"
          className="fe-reset"
          onClick={reset}
          aria-label="Reset both structures to unopened"
        >
          Reset
        </button>
      )}

      <p className="fe-probe">
        <span className="fe-probe-caret" aria-hidden="true">
          &gt;{' '}
        </span>
        {FE_PROBE}
      </p>
      <p className="fe-framing">{FE_FRAMING}</p>

      <div className="fe-tabs" role="tablist" aria-label="Repo structure">
        {feStructures.map((s) => {
          const active = s.id === tab;
          const nudged = showNext && s.id === other.id;
          return (
            <button
              key={s.id}
              ref={(el) => {
                if (el) tabRefs.current.set(s.id, el);
                else tabRefs.current.delete(s.id);
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${s.id}`}
              aria-selected={active}
              aria-controls={`${uid}-panel`}
              tabIndex={active ? 0 : -1}
              className={[
                'fe-tab',
                active && 'fe-tab-active',
                nudged && 'fe-tab-nudge',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => switchTab(s.id)}
              onKeyDown={onTabKey}
            >
              {s.tabLabel}
            </button>
          );
        })}
      </div>

      <div
        className="fe-body"
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${tab}`}
      >
        <div className="fe-tree-wrap">
          <div className="fe-meter">
            <span className={opens > FE_PASS_THRESHOLD ? 'fe-meter-opens fe-meter-over' : 'fe-meter-opens'}>
              opens: {opens}
            </span>
            <span className="fe-meter-sep" aria-hidden="true">
              ·
            </span>
            <span>pass ≤ {FE_PASS_THRESHOLD}</span>
            <span className="fe-meter-sep" aria-hidden="true">
              ·
            </span>
            <span>
              answer: {piecesFound}/{structure.piecesNeeded} pieces
            </span>
          </div>
          <div
            className="fe-tree"
            role="group"
            aria-label={`${structure.tabLabel} file tree — arrow keys move, Enter opens`}
          >
            {structure.rows.map((row, i) => {
              if (!isFile(row)) {
                return (
                  <div
                    key={`folder-${i}`}
                    className="fe-folder"
                    style={{ paddingLeft: 10 + row.depth * 16 }}
                  >
                    {row.label}
                  </div>
                );
              }
              fileIdx += 1;
              const idx = fileIdx;
              const isOpen = openedIds.includes(row.id);
              return (
                <button
                  key={row.id}
                  ref={(el) => {
                    if (el) rowRefs.current.set(row.id, el);
                    else rowRefs.current.delete(row.id);
                  }}
                  type="button"
                  className={isOpen ? 'fe-file fe-file-open' : 'fe-file'}
                  style={{ paddingLeft: 10 + row.depth * 16 }}
                  tabIndex={idx === roveIdx ? 0 : -1}
                  aria-pressed={isOpen}
                  aria-label={`${row.path}${isOpen ? ' — opened' : ''}`}
                  onClick={() => {
                    setRove(idx);
                    openFile(row);
                  }}
                  onKeyDown={(e) => onRowKey(e, idx)}
                >
                  <span className="fe-file-name">{row.label}</span>
                  <span className="fe-file-mark" aria-hidden="true">
                    {isOpen ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="fe-findings">
          <div className="fe-findings-head">findings</div>
          {opens === 0 ? (
            <p className="fe-empty">{FE_EMPTY}</p>
          ) : (
            <ul className="fe-find-list">
              {openedIds.map((id) => {
                const f = files.find((x) => x.id === id)!;
                return (
                  <li
                    key={id}
                    className={f.piece ? 'fe-find fe-find-piece' : 'fe-find'}
                  >
                    <span className="fe-find-glyph" aria-hidden="true">
                      {f.piece ? '◆' : '·'}
                    </span>
                    <span className="fe-find-path">{f.path}</span>{' '}
                    <span className="fe-find-text">{withCode(f.finding)}</span>
                  </li>
                );
              })}
            </ul>
          )}
          {showNudge && <p className="fe-nudge">{structure.nudge}</p>}
          {verdict !== null && (
            <p
              className={
                verdictIsPass(structure, verdict)
                  ? 'fe-verdict fe-verdict-pass'
                  : 'fe-verdict fe-verdict-fail'
              }
            >
              <span className="fe-verdict-mark">
                {verdictIsPass(structure, verdict) ? '✓ pass' : '✗ fail'}
              </span>{' '}
              {withCode(
                interp(
                  verdictIsPass(structure, verdict)
                    ? structure.verdictPass!
                    : structure.verdictFail,
                  verdict
                )
              )}
            </p>
          )}
          {showNext && <p className="fe-next">{structure.nextPrompt}</p>}
        </div>
      </div>

      {bothDone && (
        <div className="fe-score">
          <div className="fe-score-row">
            {feStructures.map((s) => {
              const v = verdictOpens[s.id]!;
              const pass = verdictIsPass(s, v);
              return (
                <span
                  key={s.id}
                  className={pass ? 'fe-score-cell fe-score-pass' : 'fe-score-cell fe-score-fail'}
                >
                  <span className="fe-score-name">{s.tabLabel}:</span>{' '}
                  {interp(pass ? s.scorePass! : s.scoreFail, v)}
                </span>
              );
            })}
          </div>
          <p className="fe-score-closing">{FE_CLOSING}</p>
        </div>
      )}

      <div className="fe-sr-only" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}
