import React, { useState } from 'react';
import type { CxpSeg, CxpToolId } from './command-expander-data';
import { cxpTools } from './command-expander-data';
import { withCode } from './with-code';
import './command-expander.css';
import { useWidgetFrame } from './widget-frame';

function Segs({ segs, markClass }: { segs: CxpSeg[]; markClass: string }) {
  return (
    <>
      {segs.map((s, i) =>
        s.mark ? (
          <span key={i} className={markClass}>
            {s.text}
          </span>
        ) : (
          <React.Fragment key={i}>{s.text}</React.Fragment>
        )
      )}
    </>
  );
}

export default function CommandExpander() {
  const [toolId, setToolId] = useState<CxpToolId>('claude-code');
  const tool = cxpTools.find((t) => t.id === toolId)!;

  return (
    <div className={useWidgetFrame('cxp-root')}>
      <div className="cxp-tools" role="tablist" aria-label="Tool">
        {cxpTools.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={toolId === t.id}
            className={toolId === t.id ? 'cxp-tool cxp-tool-active' : 'cxp-tool'}
            onClick={() => setToolId(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="cxp-flow" aria-live="polite">
        <div className="cxp-stage">
          <span className="cxp-stage-tag">you type</span>
          <pre className="cxp-typed">
            <code>
              <span className="cxp-prompt">❯ </span>
              {tool.typed}
            </code>
          </pre>
        </div>

        <div className="cxp-stage">
          <span className="cxp-stage-tag">the file</span>
          <div className="cxp-file">
            <div className="cxp-path">{tool.path}</div>
            <pre className="cxp-body">
              <code>
                <Segs segs={tool.file} markClass="cxp-ph" />
              </code>
            </pre>
          </div>
        </div>

        <div className="cxp-stage">
          <span className="cxp-stage-tag">the model receives</span>
          <pre className="cxp-body cxp-receives">
            <code>
              <Segs segs={tool.receives} markClass="cxp-sub" />
            </code>
          </pre>
        </div>

        <ul className="cxp-notes">
          <li className="cxp-note">
            <span className="cxp-note-tag">invoke</span>
            <span>{withCode(tool.notes.invoke)}</span>
          </li>
          <li className="cxp-note">
            <span className="cxp-note-tag">args</span>
            <span>{withCode(tool.notes.args)}</span>
          </li>
          <li className="cxp-note">
            <span className="cxp-note-tag">note</span>
            <span>{withCode(tool.notes.caveat)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
