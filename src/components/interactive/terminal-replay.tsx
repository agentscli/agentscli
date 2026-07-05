import React, { useEffect, useMemo, useRef, useState } from 'react';
import { withCode } from './with-code';
import './terminal-replay.css';
import { useWidgetFrame } from './widget-frame';

/**
 * TerminalReplay — the script-driven-terminal engine, not a widget itself.
 *
 * A scene is a `TrScript`: a scripted CLI session that auto-plays in a fake
 * terminal (typed user prompts, agent/tool lines) beside a live state panel
 * (labelled blocks + a running annotation, plus an optional capacity meter —
 * in the panel or as a full-width top strip with a legend). Block values and
 * the meter are optional: scenes that aren't about filling a window can show
 * unnumbered state. The script can pause at one decision point and branch on
 * the reader's choice, each branch ending in a toned verdict with replay
 * chips.
 *
 * Once playback pauses, the transcript becomes inspectable: hovering (or
 * tapping, or focusing) a terminal line highlights the state blocks its beat
 * produced and recalls that beat's annotation; hovering a block highlights
 * the lines that caused it. The line↔block mapping is derived from the
 * script's beat structure — scenes get inspection for free.
 *
 * To add a new scene: write a `<scene>-data.ts` exporting a TrScript, plus a
 * thin named wrapper component that renders <TerminalReplay script={...} />
 * (the wrapper is what lessons import and WIDGETS.md registers). No new
 * interaction code. First scene: SessionXray.tsx / session-xray-data.ts.
 */

/**
 * Color slot. 'a'–'f' are built into terminal-replay.css; any other name
 * needs an entry in the script's `slotColors`.
 */
export type TrSlot = string;

export interface TrBlock {
  id: string;
  /** color slot, see .tr-slot-* in terminal-replay.css / script slotColors */
  slot: TrSlot;
  label: string;
  /**
   * in the script's unit (e.g. thousands of tokens); omit for blocks whose
   * size isn't the point — they show no number and don't feed the meter
   */
  value?: number;
}

export interface TrLine {
  /** user lines type char-by-char; the rest appear line-by-line */
  kind: 'user' | 'agent' | 'tool' | 'sys' | 'warn';
  text: string;
}

export interface TrPanelOp {
  add?: TrBlock[];
  /** keep only these block ids (a reset), applied before `add` */
  clearExcept?: string[];
  /** annotation shown under the panel */
  note?: string;
}

export interface TrBeat {
  lines: TrLine[];
  panel?: TrPanelOp;
  /** extra pause after the beat, ms */
  holdMs?: number;
}

export interface TrChoice {
  id: string;
  /** decision-bar button label */
  button: string;
  /** replay-chip label once another branch has run */
  replay: string;
  beats: TrBeat[];
  verdict: string;
  verdictTone: 'good' | 'bad';
}

export interface TrScript {
  /** intro paragraph above the stage; `backticks` render as code */
  lead: string;
  /** terminal title-bar text */
  termTitle: string;
  /** state-panel heading */
  panelTitle: string;
  /**
   * meter capacity, in `unit`; omit for scenes that aren't about filling
   * something up — no meter or running total renders at all
   */
  capacity?: number;
  /** unit suffix for totals, e.g. 'k' */
  unit?: string;
  /**
   * legend names per color slot — segment tooltips, plus the legend row when
   * the meter sits on top
   */
  slots?: Record<TrSlot, string>;
  /**
   * scene-defined colors for slots beyond the built-in a–f; a bare string is
   * used in both themes
   */
  slotColors?: Record<TrSlot, string | { light: string; dark: string }>;
  /**
   * where the capacity meter lives: inside the state panel (default) or as a
   * full-width strip above the stage with a legend row
   */
  meter?: 'panel' | 'top';
  intro: TrBeat[];
  decisionPrompt: string;
  choices: TrChoice[];
  footnote?: string;
}

const TYPE_MS = 18;
const LINE_MS = 420;
const PANEL_MS = 300;
const AFTER_TYPE_MS = 380;
const AUTOSTART_MS = 700;

type TrEvent =
  | { t: 'type'; line: TrLine; beat: number }
  | { t: 'line'; line: TrLine; beat: number }
  | { t: 'panel'; op: TrPanelOp; beat: number }
  | { t: 'hold'; ms: number };

type TrPhase = 'intro' | 'decision' | 'branch' | 'done';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function flatten(beats: TrBeat[], beatOffset: number): TrEvent[] {
  const out: TrEvent[] = [];
  beats.forEach((beat, i) => {
    const b = beatOffset + i;
    for (const line of beat.lines) {
      out.push(
        line.kind === 'user' ? { t: 'type', line, beat: b } : { t: 'line', line, beat: b },
      );
    }
    if (beat.panel) out.push({ t: 'panel', op: beat.panel, beat: b });
    if (beat.holdMs) out.push({ t: 'hold', ms: beat.holdMs });
  });
  return out;
}

const LINE_PREFIX: Record<TrLine['kind'], string> = {
  user: '❯ ',
  agent: '',
  tool: '• ',
  sys: '',
  warn: '⚠ ',
};

export default function TerminalReplay({ script }: { script: TrScript }) {
  const introEvents = useMemo(() => flatten(script.intro, 0), [script]);

  const [queue, setQueue] = useState<TrEvent[]>(introEvents);
  const [qi, setQi] = useState(0);
  const [chars, setChars] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<TrPhase>('intro');
  const [chosen, setChosen] = useState<TrChoice | null>(null);
  // Inspect mode: hover is transient, a click/tap pins. Beat index or null.
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);

  const termRef = useRef<HTMLDivElement>(null);

  // Autostart on hydration — with client:visible that means first scroll
  // into view. Reduced motion skips playback and lands on the decision.
  useEffect(() => {
    if (prefersReducedMotion()) {
      setQi(introEvents.length);
      setPhase(script.choices.length ? 'decision' : 'done');
      return;
    }
    const timer = setTimeout(() => setRunning(true), AUTOSTART_MS);
    return () => clearTimeout(timer);
  }, [introEvents, script]);

  // The player: one timeout per tick, everything else derived from (queue, qi, chars).
  useEffect(() => {
    if (!running) return;
    if (qi >= queue.length) {
      setRunning(false);
      setPhase(chosen || !script.choices.length ? 'done' : 'decision');
      return;
    }
    const ev = queue[qi];
    let timer: ReturnType<typeof setTimeout>;
    if (ev.t === 'type' && chars < ev.line.text.length) {
      timer = setTimeout(() => setChars((c) => c + 1), TYPE_MS);
    } else {
      const wait =
        ev.t === 'type' ? AFTER_TYPE_MS : ev.t === 'hold' ? ev.ms : ev.t === 'panel' ? PANEL_MS : LINE_MS;
      timer = setTimeout(() => {
        setQi((q) => q + 1);
        setChars(0);
      }, wait);
    }
    return () => clearTimeout(timer);
  }, [running, qi, chars, queue, chosen, script]);

  // Visible terminal lines: every line event at or before the playhead;
  // a type event at the playhead shows its typed-so-far slice.
  const lines = useMemo(() => {
    const out: { line: TrLine; beat: number; partial?: number }[] = [];
    const last = Math.min(qi, queue.length - 1);
    for (let i = 0; i <= last; i++) {
      const ev = queue[i];
      if (ev.t === 'line') out.push({ line: ev.line, beat: ev.beat });
      else if (ev.t === 'type')
        out.push(
          i === qi
            ? { line: ev.line, beat: ev.beat, partial: chars }
            : { line: ev.line, beat: ev.beat },
        );
    }
    return out;
  }, [queue, qi, chars]);

  // Panel state: replay every panel op up to the playhead. Each block
  // remembers the beat that added it; each noted beat feeds inspect mode.
  const { blocks, note, beatNotes, inspectable } = useMemo(() => {
    let acc: (TrBlock & { beat: number })[] = [];
    let n = '';
    const notes = new Map<number, string>();
    const insp = new Set<number>();
    const last = Math.min(qi, queue.length - 1);
    for (let i = 0; i <= last; i++) {
      const ev = queue[i];
      if (ev.t !== 'panel') continue;
      insp.add(ev.beat);
      if (ev.op.clearExcept) acc = acc.filter((b) => ev.op.clearExcept!.includes(b.id));
      if (ev.op.add) acc = [...acc, ...ev.op.add.map((b) => ({ ...b, beat: ev.beat }))];
      if (ev.op.note) {
        n = ev.op.note;
        notes.set(ev.beat, ev.op.note);
      }
    }
    return { blocks: acc, note: n, beatNotes: notes, inspectable: insp };
  }, [queue, qi]);

  const total = blocks.reduce((sum, b) => sum + (b.value ?? 0), 0);
  // Meter segments in slot first-appearance order (valueless blocks don't feed it).
  const slotTotals: { slot: TrSlot; value: number }[] = [];
  for (const b of blocks) {
    if (!b.value) continue;
    const hit = slotTotals.find((s) => s.slot === b.slot);
    if (hit) hit.value += b.value;
    else slotTotals.push({ slot: b.slot, value: b.value });
  }

  // Built-in slots color via .tr-slot-a…f; scene-defined ones via CSS vars.
  const slotProps = (slot: TrSlot) => {
    const c = script.slotColors?.[slot];
    if (!c) return { cls: `tr-slot-${slot}`, style: undefined };
    const light = typeof c === 'string' ? c : c.light;
    const dark = typeof c === 'string' ? c : c.dark;
    return {
      cls: 'tr-slot-custom',
      style: { '--tr-slot': light, '--tr-slot-dark': dark } as React.CSSProperties,
    };
  };

  useEffect(() => {
    const el = termRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines.length, chars, phase]);

  const canInspect = !running && (phase === 'decision' || phase === 'done');
  const inspected = canInspect ? hovered ?? pinned : null;
  const shownNote =
    inspected !== null ? beatNotes.get(inspected) ?? '' : note;

  const clearInspect = () => {
    setHovered(null);
    setPinned(null);
  };

  const hoverProps = (beat: number, active: boolean) =>
    active
      ? {
          onMouseEnter: () => setHovered(beat),
          onMouseLeave: () => setHovered(null),
          onFocus: () => setHovered(beat),
          onBlur: () => setHovered(null),
          onClick: () => setPinned((p) => (p === beat ? null : beat)),
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setPinned((p) => (p === beat ? null : beat));
            }
          },
          role: 'button' as const,
          tabIndex: 0,
        }
      : {};

  // Tapping a block also brings its lines into view — the stacked mobile
  // layout can't rely on side-by-side glancing.
  const revealLines = (beat: number) => {
    termRef.current
      ?.querySelector(`[data-beat="${beat}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  };

  const inspectClass = (beat: number, base: string) => {
    if (inspected === null) return base;
    return `${base} ${inspected === beat ? 'tr-hl' : 'tr-dim'}`;
  };

  const pick = (choice: TrChoice) => {
    const events = [...introEvents, ...flatten(choice.beats, script.intro.length)];
    setQueue(events);
    setChosen(choice);
    setChars(0);
    clearInspect();
    if (prefersReducedMotion()) {
      setQi(events.length);
      setPhase('done');
      setRunning(false);
    } else {
      setQi(introEvents.length);
      setPhase('branch');
      setRunning(true);
    }
  };

  const restart = () => {
    setQueue(introEvents);
    setChosen(null);
    setChars(0);
    clearInspect();
    if (prefersReducedMotion()) {
      setQi(introEvents.length);
      setPhase(script.choices.length ? 'decision' : 'done');
      setRunning(false);
    } else {
      setQi(0);
      setPhase('intro');
      setRunning(true);
    }
  };

  const skip = () => {
    setChars(0);
    setQi(queue.length);
  };

  const cap = script.capacity;
  const unit = script.unit ?? '';
  const meterTop = cap !== undefined && script.meter === 'top';

  const totalEl = cap !== undefined && (
    <span className="tr-panel-total">
      {total}
      {unit} / {cap}
      {unit}
    </span>
  );

  const meterEl = cap !== undefined && (
    <div
      className="tr-meter"
      role="img"
      aria-label={`${script.panelTitle}: ${total} of ${cap}${unit} used`}
    >
      {slotTotals.map(({ slot, value }) => {
        const { cls, style } = slotProps(slot);
        return (
          <span
            key={slot}
            className={`tr-seg ${cls}`}
            style={{ width: `${(value / cap) * 100}%`, ...style }}
            title={`${script.slots?.[slot] ?? slot} — ${value}${unit}`}
          />
        );
      })}
    </div>
  );

  return (
    <div className={useWidgetFrame('tr-root')}>
      <div className="tr-head">
        <p className="tr-lead">{withCode(script.lead)}</p>
        {(running || qi > 0) && (
          <button
            className="tr-restart"
            onClick={restart}
            title="reset the whole session and play it again"
          >
            ↺ restart
          </button>
        )}
      </div>

      {meterTop && (
        <div className="tr-topmeter">
          <div className="tr-topmeter-bar">
            {meterEl}
            {totalEl}
          </div>
          {script.slots && (
            <div className="tr-legend">
              {Object.entries(script.slots).map(([slot, label]) => {
                const { cls, style } = slotProps(slot);
                return (
                  <span key={slot} className="tr-legend-item">
                    <span className={`tr-dot ${cls}`} style={style} aria-hidden="true" />
                    {label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="tr-stage">
        <div className="tr-term">
          <div className="tr-term-bar">
            <span className="tr-term-dots" aria-hidden="true">
              <i /><i /><i />
            </span>
            <span className="tr-term-title">{script.termTitle}</span>
            {running ? (
              <button className="tr-skip" onClick={skip}>
                skip ▸
              </button>
            ) : qi > 0 ? (
              <button className="tr-skip" onClick={restart}>
                ↺ replay
              </button>
            ) : null}
          </div>
          <div className="tr-term-body" ref={termRef}>
            {lines.map(({ line, beat, partial }, i) => {
              const active = canInspect && inspectable.has(beat);
              return (
                <div
                  key={i}
                  data-beat={beat}
                  className={inspectClass(
                    beat,
                    `tr-line tr-line--${line.kind}${active ? ' tr-line--link' : ''}`,
                  )}
                  {...hoverProps(beat, active)}
                >
                  {LINE_PREFIX[line.kind]}
                  {partial === undefined ? line.text : line.text.slice(0, partial)}
                  {partial !== undefined && <span className="tr-caret">▌</span>}
                </div>
              );
            })}
            {phase === 'decision' && (
              <div className="tr-line tr-line--user" aria-hidden="true">
                ❯ <span className="tr-caret">▌</span>
              </div>
            )}
          </div>
        </div>

        <div className="tr-panel">
          <div className="tr-panel-head">
            <span className="tr-panel-title">{script.panelTitle}</span>
            {!meterTop && totalEl}
          </div>
          {!meterTop && meterEl}
          <ul className="tr-blocks">
            {blocks.map((b) => {
              const active = canInspect;
              const props = hoverProps(b.beat, active);
              const dot = slotProps(b.slot);
              return (
                <li
                  key={b.id}
                  className={inspectClass(
                    b.beat,
                    `tr-block${active ? ' tr-block--link' : ''}`,
                  )}
                  {...props}
                  onClick={
                    active
                      ? () => {
                          setPinned((p) => (p === b.beat ? null : b.beat));
                          revealLines(b.beat);
                        }
                      : undefined
                  }
                >
                  <span className={`tr-dot ${dot.cls}`} style={dot.style} aria-hidden="true" />
                  <span className="tr-block-label">{b.label}</span>
                  {b.value !== undefined && (
                    <span className="tr-block-value">
                      {b.value}
                      {unit}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="tr-note" aria-live="polite">
            {shownNote}
          </p>
        </div>
      </div>

      {canInspect && (
        <p className="tr-hint" aria-hidden="true">
          hover or tap any terminal line — or any block — to trace what caused what
        </p>
      )}

      {phase === 'decision' && (
        <div className="tr-decision">
          <p className="tr-decision-prompt">{script.decisionPrompt}</p>
          <div className="tr-decision-btns" role="group" aria-label="What happens next">
            {script.choices.map((c) => (
              <button key={c.id} className="tr-btn" onClick={() => pick(c)}>
                {c.button}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'done' && chosen && (
        <div className={`tr-verdict tr-verdict--${chosen.verdictTone}`} aria-live="polite">
          <p className="tr-verdict-text">{withCode(chosen.verdict)}</p>
          <div className="tr-replays">
            {script.choices
              .filter((c) => c.id !== chosen.id)
              .map((c) => (
                <button key={c.id} className="tr-btn tr-btn--ghost" onClick={() => pick(c)}>
                  {c.replay}
                </button>
              ))}
            <button className="tr-btn tr-btn--ghost" onClick={restart}>
              restart from the top
            </button>
          </div>
        </div>
      )}

      {script.footnote && <p className="tr-footnote">{withCode(script.footnote)}</p>}
    </div>
  );
}
