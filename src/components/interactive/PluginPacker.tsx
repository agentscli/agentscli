import React, { useState } from 'react';
import type { PpkToolId } from './plugin-packer-data';
import { ppkPieces, ppkTools } from './plugin-packer-data';
import { withCode } from './with-code';
import './plugin-packer.css';
import { useWidgetFrame } from './widget-frame';

const STATUS_LABEL = { bundle: 'in the plugin', loose: 'ships separately' } as const;
const STATUS_GLYPH = { bundle: '✓', loose: '~' } as const;

export default function PluginPacker() {
  const [toolId, setToolId] = useState<PpkToolId>('claude-code');
  const tool = ppkTools.find((t) => t.id === toolId)!;

  return (
    <div className={useWidgetFrame('ppk-root')}>
      <div className="ppk-tools" role="tablist" aria-label="Tool">
        {ppkTools.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={toolId === t.id}
            className={toolId === t.id ? 'ppk-tool ppk-tool-active' : 'ppk-tool'}
            onClick={() => setToolId(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="ppk-panel" aria-live="polite">
        <ul className="ppk-pieces">
          {ppkPieces.map((p) => {
            const cell = tool.pieces[p.id];
            return (
              <li key={p.id} className="ppk-piece">
                <span className={`ppk-chip ppk-chip-${cell.status}`}>
                  <span aria-hidden="true">{STATUS_GLYPH[cell.status]}</span>{' '}
                  {STATUS_LABEL[cell.status]}
                </span>
                <span className="ppk-piece-label">{p.label}</span>
                <span className="ppk-piece-note">{withCode(cell.note)}</span>
              </li>
            );
          })}
        </ul>

        <div className="ppk-ship">
          <span className="ppk-ship-tag">how it ships</span>
          {tool.ship.code ? (
            <pre className="ppk-ship-code">
              <code>{tool.ship.code}</code>
            </pre>
          ) : (
            <p className="ppk-ship-text">{withCode(tool.ship.text!)}</p>
          )}
        </div>

        <ul className="ppk-notes">
          <li className="ppk-note">
            <span className="ppk-note-tag">dist</span>
            <span>{withCode(tool.dist)}</span>
          </li>
          <li className="ppk-note">
            <span className="ppk-note-tag">note</span>
            <span>{withCode(tool.caveat)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
