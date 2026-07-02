import React, { useState } from 'react';
import type { SkaToolId } from './skill-anatomy-data';
import { skaParts, skaToolLabel } from './skill-anatomy-data';
import { withCode } from './with-code';
import './skill-anatomy.css';

const TOOL_ORDER: SkaToolId[] = ['claude-code', 'codex', 'opencode', 'cursor', 'copilot'];

const STATUS_GLYPH = { yes: '✓', no: '—', partial: '~' } as const;

/** One clickable region of the mock file */
function Region({
  id,
  active,
  onPick,
  className,
  children,
}: {
  id: string;
  active: boolean;
  onPick: (id: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`ska-region ${className ?? ''} ${active ? 'ska-region-active' : ''}`}
      onClick={() => onPick(id)}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export default function SkillAnatomy() {
  const [partId, setPartId] = useState('description');
  const part = skaParts.find((p) => p.id === partId)!;

  const pick = (id: string) => setPartId(id);
  const is = (id: string) => partId === id;

  return (
    <div className="ska-root not-content">
      <div className="ska-cols">
        <div className="ska-file" role="group" aria-label="Example skill — click a part to inspect it">
          <Region id="folder" active={is('folder')} onPick={pick} className="ska-line ska-folder">
            review-migrations/
          </Region>
          <div className="ska-frame">
            <div className="ska-frame-title">SKILL.md</div>
            <div className="ska-fm">
              <span className="ska-dashes">---</span>
              <Region id="name" active={is('name')} onPick={pick} className="ska-line">
                <span className="ska-key">name:</span> review-migrations
              </Region>
              <Region id="description" active={is('description')} onPick={pick} className="ska-line">
                <span className="ska-key">description:</span> Review DB migrations for
                reversibility, flag wiring, and real-DB tests. Use when a PR touches
                db/migrations/.
              </Region>
              <Region
                id="disable-model-invocation"
                active={is('disable-model-invocation')}
                onPick={pick}
                className="ska-line"
              >
                <span className="ska-key">disable-model-invocation:</span> false
              </Region>
              <Region id="context-fork" active={is('context-fork')} onPick={pick} className="ska-line">
                <span className="ska-key">context:</span> fork
              </Region>
              <Region id="extras" active={is('extras')} onPick={pick} className="ska-line ska-comment">
                # + user-invocable, paths, metadata… (per tool)
              </Region>
              <span className="ska-dashes">---</span>
            </div>
            <Region id="body" active={is('body')} onPick={pick} className="ska-body">
              <span className="ska-body-h">## What to check</span>
              {'\n'}1. The migration has a working `down()`.
              {'\n'}2. The feature flag is wired end to end.
              {'\n'}3. The integration test hits the real DB, not a mock.
              {'\n'}
              {'\n'}Run `scripts/check-reversibility.sh` first…
            </Region>
          </div>
          <Region id="files" active={is('files')} onPick={pick} className="ska-line ska-sibling">
            ├─ scripts/check-reversibility.sh
            {'\n'}├─ references/checklist.md
          </Region>
          <Region id="sidecar" active={is('sidecar')} onPick={pick} className="ska-line ska-sibling">
            └─ agents/openai.yaml
          </Region>
        </div>

        <div className="ska-detail" aria-live="polite">
          <div className="ska-detail-title">{part.title}</div>
          <p className="ska-what">{withCode(part.what)}</p>
          {part.constraints && <p className="ska-constraints">{withCode(part.constraints)}</p>}
          <ul className="ska-matrix">
            {TOOL_ORDER.map((t) => {
              const s = part.support[t];
              return (
                <li key={t} className="ska-row">
                  <span className={`ska-chip ska-chip-${s.status}`} aria-hidden="true">
                    {STATUS_GLYPH[s.status]}
                  </span>
                  <span className="ska-tool">{skaToolLabel[t]}</span>
                  <span className="ska-note">{withCode(s.note)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
