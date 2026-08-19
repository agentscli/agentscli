import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './cheat-sandbox.css';
import { useWidgetFrame } from './widget-frame';
import { claudeCodeCheatsheet } from '../../data/cheatsheets/claude-code';
import {
  BASE_BLOCKS,
  FALLBACK_REPLIES,
  FILES,
  KEY_HINTS,
  MCP_SERVERS,
  PERMISSION_RULES,
  REPLIES,
  SANDBOX_VERSION,
  SEED_CONVERSATION_K,
  SEED_LINES,
  SKILLS,
  WINDOW_K,
  paletteEntries,
  type SandLine,
  type SandLineKind,
} from './cheat-sandbox-data';

/**
 * CheatSandbox - an interactive, reader-driven Claude Code simulator.
 *
 * The static tables above it are the reference; this is the muscle memory.
 * Every slash command in the palette is the same verified entry that renders
 * the tables (one data file, two surfaces). The terminal simulates v2.1.234
 * behavior: /compact genuinely collapses the conversation block, /clear
 * genuinely resets, /rewind genuinely restores a checkpoint, Shift+Tab
 * genuinely cycles modes, Esc interrupts, Esc Esc opens the rewind menu.
 *
 * It is a simulation, labeled as one - no real binary runs in the browser.
 */

type Mode = 'default' | 'acceptEdits' | 'plan';
const MODES: Mode[] = ['default', 'acceptEdits', 'plan'];

interface Checkpoint {
  label: string;
  lines: SandLine[];
  convoK: number;
  summaryK: number;
}

const ALL_ENTRIES = paletteEntries(
  claudeCodeCheatsheet.categories.flatMap((c) => c.entries),
);

const SEED_NOTE =
  'The seeded session left 46k of reads and test output in the window. Squeeze it (/compact), undo it (/rewind), or drop it (/clear).';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function CheatSandbox() {
  const rootClasses = useWidgetFrame('csb-root');

  const [lines, setLines] = useState<SandLine[]>([]);
  const [convoK, setConvoK] = useState(SEED_CONVERSATION_K);
  const [summaryK, setSummaryK] = useState(0);
  const [model, setModel] = useState('fable');
  const [effort, setEffort] = useState('high');
  const [fast, setFast] = useState(false);
  const [mode, setMode] = useState<Mode>('default');
  const [sessionName, setSessionName] = useState('demo-app');
  const [note, setNote] = useState(SEED_NOTE);
  const [input, setInput] = useState('');
  const [paletteClosed, setPaletteClosed] = useState(false);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [menu, setMenu] = useState<{ kind: 'rewind' | 'resume'; index: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [announce, setAnnounce] = useState('');
  const [fallbackIdx, setFallbackIdx] = useState(0);

  const nextId = useRef(1);
  const runToken = useRef(0);
  const lastEmptyEsc = useRef(0);
  const checkpoints = useRef<Checkpoint[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const pushLine = useCallback((kind: SandLineKind, text: string): number => {
    const id = nextId.current++;
    setLines((ls) => [...ls, { id, kind, text }]);
    return id;
  }, []);

  // Seed once (state, not initializer - keeps Reset semantics simple).
  useEffect(() => {
    const seeded = SEED_LINES.map((l) => ({ ...l, id: nextId.current++ }));
    setLines(seeded);
    checkpoints.current = [
      { label: 'session start', lines: [], convoK: SEED_CONVERSATION_K, summaryK: 0 },
    ];
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, busy]);

  const reset = () => {
    runToken.current++;
    const seeded = SEED_LINES.map((l) => ({ ...l, id: nextId.current++ }));
    setLines(seeded);
    setConvoK(SEED_CONVERSATION_K);
    setSummaryK(0);
    setModel('fable');
    setEffort('high');
    setFast(false);
    setMode('default');
    setSessionName('demo-app');
    setNote(SEED_NOTE);
    setInput('');
    setMenu(null);
    setBusy(false);
    setPaletteClosed(false);
    checkpoints.current = [
      { label: 'session start', lines: [], convoK: SEED_CONVERSATION_K, summaryK: 0 },
    ];
    setAnnounce('Sandbox reset to the seeded session.');
  };

  const dirty =
    lines.length !== SEED_LINES.length ||
    convoK !== SEED_CONVERSATION_K ||
    summaryK !== 0 ||
    mode !== 'default' ||
    model !== 'fable' ||
    sessionName !== 'demo-app';

  const checkpoint = (label: string) => {
    checkpoints.current = [
      ...checkpoints.current.slice(-11),
      { label, lines: [...lines], convoK, summaryK },
    ];
  };

  const typeAgentText = async (text: string, token: number) => {
    if (reduced || !text) {
      if (text) pushLine('agent', text);
      return;
    }
    const id = pushLine('agent', '');
    for (let i = 1; i <= text.length; i++) {
      if (runToken.current !== token) return;
      if (i % 2 === 0) {
        setLines((ls) => ls.map((l) => (l.id === id ? { ...l, text: text.slice(0, i) } : l)));
        await sleep(16);
      }
    }
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, text } : l)));
  };

  const runAgent = async (tool: string[], text: string, costK: number, source: string) => {
    const token = ++runToken.current;
    setBusy(true);
    for (const t of tool) {
      if (runToken.current !== token) return;
      await sleep(reduced ? 60 : 340);
      if (runToken.current !== token) return;
      pushLine('tool', t);
    }
    await typeAgentText(text, token);
    if (runToken.current !== token) return;
    setConvoK((k) => k + costK);
    setNote(
      `+${costK}k: ${source} landed in the window. Nobody summarizes it for you - that's /compact's job.`,
    );
    setBusy(false);
  };

  const restore = (cp: Checkpoint, via: 'rewind' | 'resume') => {
    setLines([...cp.lines, { id: nextId.current++, kind: 'sys', text: `⏪ ${via === 'rewind' ? 'rewound' : 'resumed'} to: ${cp.label}` }]);
    setConvoK(cp.convoK);
    setSummaryK(cp.summaryK);
    setNote(
      via === 'rewind'
        ? 'Restored the conversation and token count from the checkpoint. The real /rewind also restores code - both files and transcript.'
        : 'Session restored. The real /resume lists every session on the machine, not just this one.',
    );
    setMenu(null);
    setAnnounce(`${via} to ${cp.label}. Window now at ${cp.convoK + 21 + cp.summaryK}k of 200k.`);
  };

  // ------------------------------------------------------------ commands

  const card = (text: string) => pushLine('card', text);

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    pushLine('user', trimmed);
    const spaceAt = trimmed.indexOf(' ');
    const cmd = (spaceAt < 0 ? trimmed : trimmed.slice(0, spaceAt)).toLowerCase();
    const arg = spaceAt < 0 ? '' : trimmed.slice(spaceAt + 1).trim();

    switch (cmd) {
      case '/help': {
        const keys = KEY_HINTS.map((k) => `${k.keys} - ${k.desc}`).join('\n');
        card(
          `simulated claude v${SANDBOX_VERSION} · this sandbox runs the cheatsheet's own data\n\ntry: /context · /compact keep the cursor fix · /rewind · /clear\n\nkeys:\n${keys}`,
        );
        setAnnounce('Help printed.');
        break;
      }
      case '/context': {
        const used = 21 + convoK + summaryK;
        card(
          `context window · ${used}k / ${WINDOW_K}k (${Math.round((used / WINDOW_K) * 100)}%)\nsystem prompt 3k · tools 12k · rules 2k · mcp 4k${summaryK ? ` · summary ${summaryK}k` : ''} · conversation ${convoK}k`,
        );
        setAnnounce(`Context: ${used}k of 200k.`);
        break;
      }
      case '/compact': {
        if (convoK < 10) {
          pushLine('warn', 'nothing to compact - the conversation block is already small');
          break;
        }
        const kept = arg || 'the task, the fix, and test output';
        const before = convoK;
        const newSummary = Math.max(4, Math.round(before * 0.12));
        setSummaryK((s) => s + newSummary);
        setConvoK(0);
        card(`compacted · conversation ${before}k → summary ${newSummary}k\nkept: ${kept}\n(steer what survives - unsteered compaction keeps what the model thought mattered)`);
        setNote(
          `Conversation collapsed: ${before}k became a ${newSummary}k summary - lossy by design. Steering it (/compact keep X) decides what survives.`,
        );
        setAnnounce(`Compacted: ${before}k down to ${newSummary}k.`);
        break;
      }
      case '/clear': {
        const name = arg || undefined;
        setLines([
          { id: nextId.current++, kind: 'sys', text: `cleared · previous session kept and resumable${name ? ` (was: ${name})` : ''}` },
          { id: nextId.current++, kind: 'sys', text: `claude v${SANDBOX_VERSION} · simulated · repo: demo-app (branch: fix/csv-export)` },
        ]);
        setConvoK(0);
        setSummaryK(0);
        checkpoints.current = [{ label: 'session start', lines: [], convoK: 0, summaryK: 0 }];
        setNote(
          'Only what loads from disk survives a /clear: system prompt, tool schemas, rules. The previous session stays resumable - /rename first if you want to find it again.',
        );
        setAnnounce('Cleared. Only disk-loaded blocks remain.');
        break;
      }
      case '/rewind':
      case '/resume':
      case '/checkpoint':
      case '/undo':
      case '/continue':
        setMenu({ kind: cmd === '/resume' || cmd === '/continue' ? 'resume' : 'rewind', index: checkpoints.current.length - 1 });
        setAnnounce(`${cmd} menu opened. Arrow keys to move, Enter to pick, Escape to cancel.`);
        break;
      case '/model': {
        if (!arg) {
          card('aliases: opus · sonnet · fable (or a full name)\nusage: /model sonnet');
        } else {
          setModel(arg.split(/\s+/)[0].toLowerCase());
          card(`model set to ${arg.split(/\s+/)[0]}`);
        }
        break;
      }
      case '/effort': {
        if (!arg) {
          card('levels: low · medium · high · xhigh · max · auto');
        } else {
          setEffort(arg.toLowerCase());
          card(`effort set to ${arg}`);
        }
        break;
      }
      case '/fast':
        setFast(!fast);
        card(`fast mode ${!fast ? 'on' : 'off'}`);
        break;
      case '/plan':
        setMode('plan');
        card(
          arg
            ? `plan mode on · brief: ${arg}`
            : 'plan mode on · reads and searches work, edits blocked - ask for a plan',
        );
        setNote('Plan mode is a posture, not a security boundary: the agent is instructed to plan, and edit tools are held back. Toggle with Shift+Tab.');
        break;
      case '/permissions':
        card(
          `allow: ${PERMISSION_RULES.allow.join(' · ')}\nask: ${PERMISSION_RULES.ask.join(' · ')}\ndeny: ${PERMISSION_RULES.deny.join(' · ')}`,
        );
        break;
      case '/usage':
        card('session $0.83 · 41% of weekly limit (sample numbers)\nby source: conversation 58% · subagents 22% · MCP 14% · skills 6%');
        break;
      case '/status':
        card(`claude v${SANDBOX_VERSION} (simulated) · model ${model} · effort ${effort}\naccount ok · api connected · sandbox of the real thing`);
        break;
      case '/skills':
        card(SKILLS.map((s) => `/${s.name} · ${s.tokens} tokens · ${s.note}`).join('\n'));
        break;
      case '/mcp':
        card(MCP_SERVERS.map((s) => `${s.name}: ${s.state} · ${s.detail}`).join('\n'));
        break;
      case '/rename':
        if (arg) {
          setSessionName(arg);
          card(`session renamed to ${arg}`);
        } else {
          card('usage: /rename <name> - names show in the /resume picker and terminal title');
        }
        break;
      case '/export':
        card('exported → ~/claude-session.md (simulated)');
        break;
      case '/diff':
        card('src/pagination.ts · +9 −4 · uncommitted\n(left/right arrows in the real tool switch between git diff and per-turn diffs)');
        break;
      case '/tasks':
        card('no background tasks in this session');
        break;
      case '/memory':
        card('CLAUDE.md · 2k in window · auto-memory off in the sandbox');
        break;
      case '/init':
        card('created CLAUDE.md with a project guide (simulated - the real one reads your codebase)');
        break;
      case '/doctor':
        card('install ok · settings ok · mcp 1 pending approval · terminal ok');
        break;
      case '/login':
      case '/logout':
        card(`${cmd === '/login' ? 'already' : 'still'} signed in - this sandbox has no account`);
        break;
      default: {
        const seg = cmd.slice(1);
        const near = ALL_ENTRIES.filter((e) => e.cmd.includes(seg)).slice(0, 3);
        pushLine(
          'warn',
          `unknown command in this sandbox: ${cmd}${near.length ? ` - did you mean ${near.map((n) => n.cmd).join(', ')}?` : ''}`,
        );
      }
    }
  };

  const runShell = (raw: string) => {
    const body = raw.slice(1).trim();
    pushLine('user', raw);
    if (body === 'ls' || body === 'ls src') {
      card((body === 'ls' ? FILES : FILES.filter((f) => f.startsWith('src/'))).join('\n'));
    } else if (body.startsWith('cat ')) {
      const f = body.slice(4).trim();
      card(FILES.includes(f) ? `${f} (contents elided - the real agent reads the full file into context)` : `cat: ${f}: no such file`);
    } else if (body.startsWith('git status')) {
      card('on branch fix/csv-export\nchanges not staged: src/pagination.ts');
    } else {
      card(`zsh: ${body.split(' ')[0]}: simulated - only ls, cat, and git status live here`);
    }
  };

  const submitFree = (text: string) => {
    pushLine('user', text);
    checkpoint(text.length > 44 ? `${text.slice(0, 44)}…` : text);
    setConvoK((k) => k + 1);
    if (mode === 'plan' && !/plan|think/i.test(text)) {
      runAgent([], 'In plan mode I hold edits back. Plan: reproduce with the saved filter, fix the cursor to respect it, add a regression test, re-run. Say the word and I drop back to making changes.', 5, 'the plan you asked for');
      return;
    }
    const hit = REPLIES.find((r) => r.match.test(text));
    const pick = hit ?? FALLBACK_REPLIES[fallbackIdx % FALLBACK_REPLIES.length];
    if (!hit) setFallbackIdx((i) => i + 1);
    runAgent(pick.tool, pick.text, pick.costK, hit ? 'file reads and tool output' : 'this exchange');
  };

  const execute = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    if (t.startsWith('/')) runCommand(t);
    else if (t.startsWith('!')) runShell(t);
    else submitFree(t);
  };

  // ------------------------------------------------------------ palette

  const slashOpen = input.startsWith('/') && !paletteClosed;
  const slashQuery = slashOpen ? input.slice(1).toLowerCase().split(' ')[0] : '';
  const paletteItems = useMemo(() => {
    if (!slashOpen) return [];
    const hits = ALL_ENTRIES.filter(
      (e) =>
        e.cmd.toLowerCase().includes(slashQuery) ||
        e.desc.toLowerCase().includes(slashQuery),
    ).slice(0, 9);
    if (input.length <= 1) {
      return [...hits, ...KEY_HINTS.slice(0, 3).map((k) => ({ cmd: k.keys, desc: k.desc }))];
    }
    return hits;
  }, [slashOpen, slashQuery, input]);

  useEffect(() => setPaletteIndex(0), [slashQuery]);

  const fileMatch = input.match(/@([a-zA-Z0-9._/-]*)$/);
  const fileItems = useMemo(
    () => (fileMatch ? FILES.filter((f) => f.includes(fileMatch[1])) : []),
    [input],
  );

  const cycleMode = () => {
    setMode((m) => MODES[(MODES.indexOf(m) + 1) % MODES.length]);
    setAnnounce(`Mode: ${MODES[(MODES.indexOf(mode) + 1) % MODES.length]}.`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // rewind / resume menu
    if (menu) {
      const cps = checkpoints.current;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setMenu((m) => (m ? { ...m, index: (m.index + (e.key === 'ArrowUp' ? -1 : 1) + cps.length) % cps.length } : m));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        restore(cps[menu.index], menu.kind);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setMenu(null);
      }
      return;
    }
    // @-mention autocomplete
    if (fileItems.length) {
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        setInput((v) => v.replace(/@([a-zA-Z0-9._/-]*)$/, `@${fileItems[0]} `));
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setInput((v) => v.replace(/@([a-zA-Z0-9._/-]*)$/, '@'));
      }
      return;
    }
    // slash palette
    if (slashOpen && paletteItems.length) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setPaletteIndex((i) => (i + 1) % paletteItems.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setPaletteIndex((i) => (i - 1 + paletteItems.length) % paletteItems.length);
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const pick = paletteItems[paletteIndex];
        if (pick.cmd.startsWith('/')) setInput(pick.cmd + ' ');
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const pick = paletteItems[paletteIndex];
        if (pick.cmd.startsWith('/')) {
          setInput('');
          setPaletteClosed(false);
          runCommand(pick.cmd);
        } else {
          setInput('');
        }
        return;
      }
    }
    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      cycleMode();
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (slashOpen) {
        setPaletteClosed(true);
      } else if (busy) {
        runToken.current++;
        setBusy(false);
        pushLine('warn', '⎋ interrupted - the work done so far is kept');
        setAnnounce('Interrupted. Partial work kept.');
      } else if (input === '') {
        // Real CC opens the rewind menu on a double-tap of Esc from an empty
        // prompt - a single tap is a no-op that arms the second.
        const now = Date.now();
        if (now - lastEmptyEsc.current < 700) {
          setMenu({ kind: 'rewind', index: checkpoints.current.length - 1 });
          setAnnounce('Rewind menu opened.');
          lastEmptyEsc.current = 0;
        } else {
          lastEmptyEsc.current = now;
        }
      } else {
        setInput('');
      }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = input;
      setInput('');
      setPaletteClosed(false);
      execute(value);
    }
  };

  const onInputChange = (v: string) => {
    if (!v.startsWith('/')) setPaletteClosed(false);
    setInput(v);
  };

  // ------------------------------------------------------------ panel

  const blocks = [
    ...BASE_BLOCKS.map((b) => ({ ...b })),
    ...(summaryK > 0 ? [{ id: 'summary', slot: 'f' as const, label: 'Compacted summary', value: summaryK }] : []),
    ...(convoK > 0 ? [{ id: 'convo', slot: 'c' as const, label: 'Conversation', value: convoK }] : []),
  ];
  const usedK = blocks.reduce((a, b) => a + b.value, 0);
  const pct = Math.round((usedK / WINDOW_K) * 100);

  return (
    <div className={rootClasses}>
      <div className="csb-head">
        <p className="csb-lead">
          A simulation, not the real binary - but every command below behaves the way Claude Code v{SANDBOX_VERSION} does. Type <code>/</code> for the command menu, chat to fill the window, <code>Shift+Tab</code> to cycle modes, <code>Esc Esc</code> to rewind.
        </p>
        {dirty && (
          <button type="button" className="csb-reset" onClick={reset}>
            Reset
          </button>
        )}
      </div>

      <div className="csb-stage">
        <div className="csb-term" onClick={() => inputRef.current?.focus()}>
          <div className="csb-term-bar">
            <span className="csb-term-dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="csb-term-title">claude · {sessionName} — simulated</span>
          </div>

          <div className="csb-body" ref={bodyRef} tabIndex={0} role="log" aria-label="Simulated Claude Code transcript">
            {lines.map((l) => (
              <p key={l.id} className={`csb-line csb-line--${l.kind}`}>
                {l.text}
                {busy && l.id === lines[lines.length - 1]?.id && l.kind === 'agent' && (
                  <span className="csb-caret" aria-hidden="true" />
                )}
              </p>
            ))}
            {!busy && lines.length > 0 && (
              <p className="csb-line csb-line--agent" aria-hidden="true">
                <span className="csb-caret" />
              </p>
            )}
          </div>

          <div className="csb-inputrow">
            {(slashOpen && paletteItems.length > 0) && (
              <div
                className="csb-palette"
                role="listbox"
                aria-label="Commands"
                aria-activedescendant={paletteItems[paletteIndex] ? `csb-pal-${paletteIndex}` : undefined}
              >
                <ul>
                  {paletteItems.map((it, i) => (
                    <li
                      key={it.cmd}
                      id={`csb-pal-${i}`}
                      role="option"
                      aria-selected={i === paletteIndex}
                      onClick={() => {
                        if (it.cmd.startsWith('/')) {
                          setInput('');
                          runCommand(it.cmd);
                        }
                      }}
                    >
                      <span className="csb-pc-cmd">{it.cmd}</span>
                      <span className="csb-pc-desc">{it.desc}</span>
                      {i === paletteIndex && <span className="csb-palette-pick">⏎</span>}
                    </li>
                  ))}
                </ul>
                <div className="csb-palette-foot">
                  <span>↑↓ move</span>
                  <span>⏎ run</span>
                  <span>⇥ fill</span>
                  <span>esc close</span>
                </div>
              </div>
            )}

            {fileItems.length > 0 && (
              <div className="csb-palette" role="listbox" aria-label="Files">
                <ul>
                  {fileItems.slice(0, 6).map((f) => (
                    <li
                      key={f}
                      role="option"
                      aria-selected={f === fileItems[0]}
                      onClick={() => {
                        setInput((v) => v.replace(/@([a-zA-Z0-9._/-]*)$/, `@${f} `));
                        inputRef.current?.focus();
                      }}
                    >
                      <span className="csb-pc-cmd">@{f}</span>
                      <span className="csb-pc-desc">mention - the agent reads this file</span>
                    </li>
                  ))}
                </ul>
                <div className="csb-palette-foot"><span>⇥ complete</span></div>
              </div>
            )}

            {menu && (
              <div className="csb-palette" role="listbox" aria-label={menu.kind === 'rewind' ? 'Rewind to checkpoint' : 'Resume session'}>
                <div className="csb-picker">
                  <div className="csb-picker-head">
                    {menu.kind === 'rewind'
                      ? 'rewind · restores conversation (and code, in the real tool)'
                      : 'resume · this sandbox keeps one session; the real one lists all'}
                  </div>
                  {[...checkpoints.current].reverse().map((cp, ri) => {
                    const idx = checkpoints.current.length - 1 - ri;
                    return (
                      <button
                        type="button"
                        key={`${cp.label}-${idx}`}
                        onClick={() => restore(cp, menu.kind)}
                        className={idx === menu.index ? 'csb-pick-active' : ''}
                        style={idx === menu.index ? { background: 'var(--sl-color-accent-low)' } : undefined}
                      >
                        {cp.label} · {21 + cp.convoK + cp.summaryK}k in window
                      </button>
                    );
                  })}
                  <button type="button" className="csb-picker-cancel" onClick={() => setMenu(null)}>
                    esc · cancel
                  </button>
                </div>
              </div>
            )}

            <input
              ref={inputRef}
              className="csb-input"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={busy ? 'esc to interrupt…' : 'type / for commands, or chat with the agent'}
              aria-label="Terminal input"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="csb-chips">
            {['/help', '/context', '/compact', '/rewind', '/clear'].map((c) => (
              <button type="button" key={c} className="csb-chip" onClick={() => execute(c)}>
                {c}
              </button>
            ))}
          </div>

          <div className="csb-status">
            <button
              type="button"
              className={`csb-status-badge csb-status-badge--${mode}`}
              onClick={cycleMode}
              title="cycle permission modes (Shift+Tab)"
            >
              {mode === 'default' ? '⏵ default' : mode === 'acceptEdits' ? '⏵⏵ accept edits on' : '⏸ plan mode on'}
            </button>
            <span>{model}</span>
            <span>effort {effort}</span>
            {fast && <span>fast</span>}
            <span className="csb-status-spacer" />
            <span className={`csb-status-ctx${pct > 80 ? ' csb-status-ctx--hot' : ''}`}>{pct}%</span>
            <span aria-hidden="true">? help</span>
          </div>
        </div>

        <div className="csb-panel">
          <h4>Context window · {usedK}k / {WINDOW_K}k</h4>
          <div
            className="csb-meter"
            role="img"
            aria-label={`Context window at ${pct} percent: ${blocks.map((b) => `${b.label} ${b.value}k`).join(', ')}`}
          >
            {blocks.map((b) => (
              <span key={b.id} className={`csb-slot-${b.slot}`} style={{ width: `${(b.value / WINDOW_K) * 100}%` }} />
            ))}
          </div>
          <ul className="csb-blocks">
            {blocks.map((b) => (
              <li key={b.id}>
                <i className={`csb-slot-${b.slot}`} aria-hidden="true" />
                <span className="csb-b-label">{b.label}</span>
                <span className="csb-b-val">{b.value}k</span>
              </li>
            ))}
          </ul>
          <p className="csb-panel-note">{note}</p>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{announce}</p>
    </div>
  );
}
