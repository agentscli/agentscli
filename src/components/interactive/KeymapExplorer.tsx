import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useWidgetFrame } from './widget-frame';
import { withCode } from './with-code';
import type { KmBinding, KmTool } from './keymap-explorer-data';
import './keymap-explorer.css';
import { useAccessibleTabs } from './use-accessible-tabs';

type KeymapData = typeof import('./keymap-explorer-data');

/* ------------------------------------------------------------------ keys */

/** One physical chord: modifiers plus a single base key. */
interface Chord {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  key: string;
}

const MOD_ALIASES: Record<string, keyof Omit<Chord, 'key'>> = {
  ctrl: 'ctrl',
  control: 'ctrl',
  cmd: 'ctrl',
  command: 'ctrl',
  super: 'ctrl',
  meta: 'ctrl',
  alt: 'alt',
  option: 'alt',
  opt: 'alt',
  shift: 'shift',
};

/** `"ctrl+shift+k"` -> a Chord. Unknown modifiers fold into the base key. */
function parseChord(raw: string): Chord | null {
  const s = raw.trim().toLowerCase();
  if (!s) return null;
  const parts = s.split('+').map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return null;
  const c: Chord = { ctrl: false, alt: false, shift: false, key: '' };
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const mod = MOD_ALIASES[p];
    if (mod && i < parts.length - 1) c[mod] = true;
    else c.key = p;
  }
  return c.key ? c : null;
}

/** A binding's `keys` string may hold several alternatives, comma separated. */
function chordsOf(b: KmBinding, mac: boolean): Chord[] {
  const raw = mac ? b.macKeys : b.keys;
  return raw
    .split(/[,/]| or /)
    .map(parseChord)
    .filter((c): c is Chord => c !== null);
}

const KEY_ALIASES: Record<string, string> = {
  esc: 'escape',
  return: 'enter',
  del: 'delete',
  ins: 'insert',
  pgup: 'pageup',
  pgdn: 'pagedown',
  pgdown: 'pagedown',
  spacebar: 'space',
  bksp: 'backspace',
};
const canonKey = (k: string) => KEY_ALIASES[k] ?? k;

/* --------------------------------------------------------------- layout */

const ROWS: string[][] = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

const SPECIALS: string[] = [
  'escape', 'tab', 'enter', 'space', 'backspace', 'delete',
  'up', 'down', 'left', 'right', 'home', 'end', 'pageup', 'pagedown',
];

const KEY_LABEL: Record<string, string> = {
  escape: 'Esc', tab: 'Tab', enter: 'Enter', space: 'Space',
  backspace: 'Bksp', delete: 'Del', up: '↑', down: '↓', left: '←', right: '→',
  home: 'Home', end: 'End', pageup: 'PgUp', pagedown: 'PgDn',
};
const label = (k: string) => KEY_LABEL[k] ?? k.toUpperCase();

/* ---------------------------------------------------------------- misc */

const SEV_LABEL: Record<string, string> = {
  destructive: 'can lose work',
  'silent-difference': 'silently different',
  harmless: 'harmless',
};

const CONF_LABEL: Record<string, string> = {
  'source-code': 'read from source',
  firsthand: 'verified first-hand',
  documented: 'from the docs',
};

const surfaceLabel = (t: KmTool) =>
  t.surface === 'ide' ? `${t.host ?? 'editor'} extension` : 'terminal';

type Mode = 'keyboard' | 'search' | 'reflex';
const MODES: [Mode, string][] = [
  ['keyboard', 'Press a key'],
  ['search', 'Find by intent'],
  ['reflex', 'Coming from a GUI'],
];

/* ----------------------------------------------------------- component */

export default function KeymapExplorer() {
  const rootClass = useWidgetFrame('kme-root');
  const [data, setData] = useState<KeymapData | null>(null);

  useEffect(() => {
    let active = true;
    import('./keymap-explorer-data').then((loaded) => {
      if (active) setData(loaded);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!data) {
    return (
      <div className={rootClass} role="status" aria-live="polite">
        Loading the interactive keymap...
      </div>
    );
  }

  return <KeymapExplorerLoaded data={data} rootClass={rootClass} />;
}

function KeymapExplorerLoaded({
  data,
  rootClass,
}: {
  data: KeymapData;
  rootClass: string;
}) {
  const { KM_TOOLS, KM_COLLISIONS, KM_INTENTS } = data;

  const [toolIdx, setToolIdx] = useState(0);
  const [mode, setMode] = useState<Mode>('keyboard');
  const [mac, setMac] = useState(false);
  const [mods, setMods] = useState({ ctrl: true, alt: false, shift: false });
  const [sel, setSel] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [focusKey, setFocusKey] = useState('u');
  const toolTabs = useAccessibleTabs(KM_TOOLS.length, toolIdx, (i) => {
    setToolIdx(i);
    setSel(null);
  });
  const modeTabs = useAccessibleTabs(MODES.length, MODES.findIndex(([id]) => id === mode), (i) => setMode(MODES[i][0]));

  const gridRef = useRef<HTMLDivElement>(null);
  const keyRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Default the platform toggle from the reader's own machine.
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setMac(/mac|iphone|ipad/i.test(navigator.userAgent));
    }
  }, []);

  const tool = KM_TOOLS[toolIdx];

  /** key -> bindings that fire on the current modifier combination */
  const byKey = useMemo(() => {
    const m = new Map<string, KmBinding[]>();
    for (const b of tool.bindings) {
      for (const c of chordsOf(b, mac)) {
        if (c.ctrl !== mods.ctrl || c.alt !== mods.alt || c.shift !== mods.shift) continue;
        const k = canonKey(c.key);
        if (!m.has(k)) m.set(k, []);
        if (!m.get(k)!.includes(b)) m.get(k)!.push(b);
      }
    }
    return m;
  }, [tool, mods, mac]);

  /** every key that is bound under ANY modifier combo - drives the dim state */
  const everBound = useMemo(() => {
    const s = new Set<string>();
    for (const b of tool.bindings) {
      for (const c of chordsOf(b, mac)) s.add(canonKey(c.key));
    }
    return s;
  }, [tool, mac]);

  const modString =
    (mods.ctrl ? (mac ? '⌘' : 'Ctrl+') : '') +
    (mods.alt ? (mac ? '⌥' : 'Alt+') : '') +
    (mods.shift ? (mac ? '⇧' : 'Shift+') : '');

  /* --------------------------------------------------------- searching */

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const scored: { b: KmBinding; score: number }[] = [];

    // Intents whose aliases match give a strong boost to their bindings.
    const hitIntents = new Set(
      KM_INTENTS.filter(
        (i) =>
          i.aliases.some((a) => a.includes(q) || q.includes(a)) ||
          i.label.toLowerCase().includes(q)
      ).map((i) => i.id)
    );

    for (const b of tool.bindings) {
      let s = 0;
      const desc = b.desc.toLowerCase();
      const keys = (mac ? b.macKeys : b.keys).toLowerCase();
      if (b.intents.some((i) => hitIntents.has(i))) s += 60;
      if (keys.replace(/\s/g, '') === q.replace(/\s/g, '')) s += 50;
      else if (keys.includes(q)) s += 25;
      if (desc.includes(q)) s += 20;
      if ((b.action ?? []).some((a) => a.toLowerCase().includes(q))) s += 15;
      for (const w of q.split(/\s+/).filter((w) => w.length > 2)) {
        if (desc.includes(w)) s += 6;
      }
      if (s > 0) scored.push({ b, score: s });
    }
    scored.sort((a, z) => z.score - a.score);
    return scored.slice(0, 14).map((x) => x.b);
  }, [query, tool, mac]);

  /** collisions worth surfacing for this query - the "wrong answer" index */
  const queryCollisions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return KM_COLLISIONS.filter(
      (c) =>
        c.key === q.replace(/\s/g, '') ||
        c.key.includes(q) ||
        c.reflex.toLowerCase().includes(q) ||
        KM_INTENTS.some(
          (i) => i.aliases.includes(q) && i.reflex.toLowerCase().includes(c.key)
        )
    ).slice(0, 3);
  }, [query]);

  /* --------------------------------------------------------- selection */

  const selected = useMemo(() => {
    if (!sel) return null;
    const list = byKey.get(sel);
    return list && list.length ? { key: sel, bindings: list } : null;
  }, [sel, byKey]);

  /** the same physical chord in every other tool - the cross-tool payoff */
  const elsewhere = useMemo(() => {
    if (!sel) return [];
    const out: { tool: KmTool; bindings: KmBinding[] }[] = [];
    for (const t of KM_TOOLS) {
      if (t === tool) continue;
      const hits: KmBinding[] = [];
      for (const b of t.bindings) {
        for (const c of chordsOf(b, mac)) {
          if (
            c.ctrl === mods.ctrl && c.alt === mods.alt && c.shift === mods.shift &&
            canonKey(c.key) === sel
          ) {
            if (!hits.includes(b)) hits.push(b);
          }
        }
      }
      if (hits.length) out.push({ tool: t, bindings: hits.slice(0, 2) });
    }
    return out;
  }, [sel, mods, mac, tool]);

  /* ------------------------------------------------ keyboard navigation */

  const moveFocus = (key: string) => {
    setFocusKey(key);
    requestAnimationFrame(() => keyRefs.current[key]?.focus());
  };

  function onGridKeyDown(e: KeyboardEvent) {
    const k = e.key;
    if (k === 'Enter' || k === ' ') {
      e.preventDefault();
      setSel(focusKey);
      return;
    }
    if (k === 'Escape') {
      setSel(null);
      return;
    }
    if (!k.startsWith('Arrow')) return;
    e.preventDefault();

    // Locate the focused key within the visual grid.
    let r = ROWS.findIndex((row) => row.includes(focusKey));
    let c = r >= 0 ? ROWS[r].indexOf(focusKey) : SPECIALS.indexOf(focusKey);
    const inSpecials = r < 0;

    if (k === 'ArrowLeft' || k === 'ArrowRight') {
      const row = inSpecials ? SPECIALS : ROWS[r];
      const next = c + (k === 'ArrowRight' ? 1 : -1);
      if (next >= 0 && next < row.length) moveFocus(row[next]);
      return;
    }
    const dir = k === 'ArrowDown' ? 1 : -1;
    if (inSpecials) {
      if (dir === -1) moveFocus(ROWS[ROWS.length - 1][Math.min(c, ROWS[ROWS.length - 1].length - 1)]);
      return;
    }
    const nr = r + dir;
    if (nr < 0) return;
    if (nr >= ROWS.length) moveFocus(SPECIALS[Math.min(c, SPECIALS.length - 1)]);
    else moveFocus(ROWS[nr][Math.min(c, ROWS[nr].length - 1)]);
  }

  function renderKey(k: string) {
    const bound = byKey.has(k);
    const ever = everBound.has(k);
    const isSel = sel === k;
    const cls = [
      'kme-key',
      SPECIALS.includes(k) ? 'kme-key--wide' : '',
      bound ? 'kme-key--bound' : ever ? 'kme-key--elsewhere' : 'kme-key--free',
      isSel ? 'kme-key--sel' : '',
    ].filter(Boolean).join(' ');
    const desc = bound ? byKey.get(k)![0].desc : '';
    return (
      <button
        key={k}
        type="button"
        className={cls}
        ref={(element) => { keyRefs.current[k] = element; }}
        tabIndex={focusKey === k ? 0 : -1}
        aria-pressed={isSel}
        aria-label={
          bound
            ? `${modString}${label(k)}: ${desc}`
            : `${modString}${label(k)}: not bound in ${tool.label}`
        }
        onClick={() => { moveFocus(k); setSel(k); }}
        onFocus={() => setFocusKey(k)}
      >
        {label(k)}
      </button>
    );
  }

  /* ------------------------------------------------------------ render */

  return (
    <div className={rootClass}>
      {/* ---- tool row ---- */}
      <div className="kme-bar">
        <div className="kme-tools" {...toolTabs.tabListProps} aria-label="Tool">
          {KM_TOOLS.map((t, i) => (
            <button
              key={t.slug + t.surface}
              type="button"
              {...toolTabs.getTabProps(i)}
              className={`kme-tool${i === toolIdx ? ' kme-tool--on' : ''}`}
              onClick={() => { setToolIdx(i); setSel(null); }}
            >
              {t.label}
              <span className="kme-tool-surface">{t.surface === 'ide' ? 'IDE' : 'CLI'}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="kme-plat"
          onClick={() => setMac((m) => !m)}
          aria-label={`Showing ${mac ? 'macOS' : 'Windows and Linux'} keys. Switch.`}
        >
          {mac ? '⌘ macOS' : '⌃ Win/Linux'}
        </button>
      </div>

      {/* The tool tabs own everything below the tool row, so their
          aria-controls resolves; the mode tabs are a nested tab widget. */}
      <div {...toolTabs.panelProps}>
      {/* ---- provenance ---- */}
      <p className="kme-prov">
        {tool.label} <span className="kme-prov-sep">·</span>{' '}
        {surfaceLabel(tool)}
        {tool.version && (<> <span className="kme-prov-sep">·</span> <code>{tool.version}</code></>)}
        <span className="kme-prov-sep">·</span> {tool.bindings.length} bindings
        <span className="kme-prov-sep">·</span> checked {tool.checkedAt}
      </p>

      {/* ---- mode tabs ---- */}
      <div className="kme-modes" {...modeTabs.tabListProps} aria-label="View">
        {MODES.map(([m, lab], i) => (
          <button
            key={m}
            type="button"
            {...modeTabs.getTabProps(i)}
            className={`kme-mode${mode === m ? ' kme-mode--on' : ''}`}
            onClick={() => setMode(m)}
          >
            {lab}
          </button>
        ))}
      </div>

      <div {...modeTabs.panelProps}>
      {/* =============================================== KEYBOARD MODE */}
      {mode === 'keyboard' && (
        <>
          <div className="kme-mods" role="group" aria-label="Modifiers">
            {(['ctrl', 'alt', 'shift'] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={`kme-mod${mods[m] ? ' kme-mod--on' : ''}`}
                aria-pressed={mods[m]}
                onClick={() => { setMods((s) => ({ ...s, [m]: !s[m] })); setSel(null); }}
              >
                {m === 'ctrl' ? (mac ? '⌘ Cmd' : 'Ctrl') : m === 'alt' ? (mac ? '⌥ Opt' : 'Alt') : '⇧ Shift'}
              </button>
            ))}
            <span className="kme-mods-hint">
              {byKey.size} key{byKey.size === 1 ? '' : 's'} bound under{' '}
              <strong>{modString || 'no modifier'}</strong>
            </span>
          </div>

          <div
            className="kme-grid"
            ref={gridRef}
            role="group"
            aria-label="Virtual keyboard. Arrow keys to move, Enter to inspect."
            onKeyDown={onGridKeyDown}
          >
            {ROWS.map((row, i) => (
              <div className="kme-row" key={i} style={{ paddingLeft: `${i * 13}px` }}>
                {row.map(renderKey)}
              </div>
            ))}
            <div className="kme-row kme-row--special">{SPECIALS.map(renderKey)}</div>
          </div>

          <p className="kme-legend">
            <span className="kme-dot kme-dot--bound" /> bound now
            <span className="kme-dot kme-dot--elsewhere" /> bound under another modifier
            <span className="kme-dot kme-dot--free" /> unbound
          </p>
        </>
      )}

      {/* ================================================= SEARCH MODE */}
      {mode === 'search' && (
        <div className="kme-search">
          <input
            type="search"
            className="kme-input"
            placeholder="What are you trying to do? e.g. clear what I typed"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search bindings by what you want to do"
          />
          {!query && (
            <div className="kme-chips">
              {KM_INTENTS.slice(0, 10).map((i) => (
                <button
                  key={i.id}
                  type="button"
                  className="kme-chip"
                  onClick={() => setQuery(i.aliases[0])}
                >
                  {i.label}
                </button>
              ))}
            </div>
          )}

          {queryCollisions.map((c) => (
            <div className={`kme-warn kme-warn--${c.severity}`} key={c.key}>
              <p className="kme-warn-head">
                <code>{c.key}</code> is not what you think here
                <span className="kme-warn-sev">{SEV_LABEL[c.severity]}</span>
              </p>
              <p className="kme-warn-body">
                You expect: {c.reflex}
                <br />
                {(() => {
                  const hit = c.tools[tool.slug] ?? c.tools[`${tool.slug}:${tool.surface}`];
                  return hit ? (
                    <>In {tool.label}: {hit.actual}</>
                  ) : (
                    <>Not recorded as a collision in {tool.label}.</>
                  );
                })()}
              </p>
            </div>
          ))}

          {query && !results.length && !queryCollisions.length && (
            <p className="kme-empty">
              Nothing in {tool.label} matches that. Try a different phrasing, or the
              key itself (<code>ctrl+u</code>).
            </p>
          )}

          <ul className="kme-results">
            {results.map((b, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="kme-result"
                  onClick={() => {
                    const c = chordsOf(b, mac)[0];
                    if (c) {
                      setMods({ ctrl: c.ctrl, alt: c.alt, shift: c.shift });
                      setSel(canonKey(c.key));
                      setFocusKey(canonKey(c.key));
                      setMode('keyboard');
                    }
                  }}
                >
                  <kbd className="kme-kbd">{mac ? b.macKeys : b.keys}</kbd>
                  <span className="kme-result-desc">{b.desc}</span>
                  <span className="kme-result-ctx">{b.ctx}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ================================================= REFLEX MODE */}
      {mode === 'reflex' && (
        <div className="kme-reflex">
          <p className="kme-reflex-intro">
            {withCode(
              'What your GUI muscle memory does instead. Ordered by how many tools diverge - these are the keys that fail silently, not the ones that error.'
            )}
          </p>
          {KM_COLLISIONS.map((c) => (
            <details className={`kme-coll kme-coll--${c.severity}`} key={c.key}>
              <summary>
                <kbd className="kme-kbd">{c.key}</kbd>
                <span className="kme-coll-reflex">you expect: {c.reflex}</span>
                <span className={`kme-sev kme-sev--${c.severity}`}>{SEV_LABEL[c.severity]}</span>
                <span className="kme-coll-n">{Object.keys(c.tools).length} tools</span>
              </summary>
              <ul className="kme-coll-list">
                {Object.entries(c.tools).map(([slug, v]) => (
                  <li key={slug}>
                    <span className="kme-coll-tool">{slug}</span>
                    <span>{v.actual}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}

      </div>

      {/* ------------------------------------------------ detail panel */}
      <div className="kme-detail" aria-live="polite">
        {mode === 'keyboard' && !selected && (
          <p className="kme-detail-idle">
            Pick a modifier, then a lit key. Dimmed keys are bound under a different
            modifier; flat keys do nothing in {tool.label}.
          </p>
        )}
        {mode === 'keyboard' && selected && (
          <>
            <p className="kme-detail-head">
              <kbd className="kme-kbd kme-kbd--lg">{modString}{label(selected.key)}</kbd>
              <span className="kme-detail-tool">in {tool.label}</span>
            </p>
            {selected.bindings.map((b, i) => (
              <div className="kme-bind" key={i}>
                <p className="kme-bind-desc">{b.desc}</p>
                <p className="kme-bind-meta">
                  <span className="kme-tag">{b.ctx}</span>
                  <span className="kme-tag">{b.origin.replace(/-/g, ' ')}</span>
                  <span className={`kme-tag kme-tag--${b.conf.replace(/[^a-z]/g, '')}`}>
                    {CONF_LABEL[b.conf]}
                  </span>
                  {b.action?.map((a) => (
                    <code className="kme-action" key={a}>{a}</code>
                  ))}
                  {b.cmd && <code className="kme-action">{b.cmd}</code>}
                </p>
                {b.notes && <p className="kme-bind-notes">{withCode(b.notes)}</p>}
                {tool.sources[b.src]?.startsWith('https://') && (
                  <p className="kme-bind-src">
                    <a href={tool.sources[b.src]} target="_blank" rel="noopener noreferrer">
                      source
                    </a>{' '}
                    · checked {tool.checkedAt}
                  </p>
                )}
                {tool.sources[b.src] && !tool.sources[b.src].startsWith('https://') && (
                  <p className="kme-bind-src">
                    <span>{tool.sources[b.src]}</span> · checked {tool.checkedAt}
                  </p>
                )}
              </div>
            ))}
            {elsewhere.length > 0 && (
              <div className="kme-else">
                <p className="kme-else-head">
                  The same chord elsewhere
                </p>
                <ul>
                  {elsewhere.map(({ tool: t, bindings }) => (
                    <li key={t.slug + t.surface}>
                      <span className="kme-else-tool">{t.label}</span>
                      <span>{bindings.map((b) => b.desc).join(' / ')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  );
}
