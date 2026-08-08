import React from 'react';
import type { CxpSeg, CxpToolId } from './command-expander-data';
import { cxpTools } from './command-expander-data';
import { withCode } from './with-code';
import './command-expander.css';
import { useWidgetFrame } from './widget-frame';
import { useAccessibleTabs } from './use-accessible-tabs';
import { useSyncedToolIndex } from './use-synced-tool';

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
  const [toolIdx, setToolIdx] = useSyncedToolIndex(cxpTools);
  const toolId = cxpTools[toolIdx].id as CxpToolId;
  const tool = cxpTools.find((t) => t.id === toolId)!;
  const tabs = useAccessibleTabs(cxpTools.length, toolIdx, setToolIdx);

  return (
    <div className={useWidgetFrame('cxp-root')}>
      <div className="cxp-tools" {...tabs.tabListProps} aria-label="Tool">
        {cxpTools.map((t) => (
          <button
            key={t.id}
            {...tabs.getTabProps(cxpTools.indexOf(t))}
            className={toolId === t.id ? 'cxp-tool cxp-tool-active' : 'cxp-tool'}
            onClick={() => setToolIdx(cxpTools.indexOf(t))}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="cxp-scope-note">
        This explainer covers five tools. Pi&apos;s prompt and skill surfaces are documented in the comparison below.
      </p>

      <div className="cxp-flow" {...tabs.panelProps}>
        <span className="cxp-sr-only" aria-live="polite">
          Showing the {tool.label} command expansion.
        </span>
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
