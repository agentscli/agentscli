import React, { useState } from 'react';
import { hookTools } from './hook-timeline-data';
import { withCode } from './with-code';
import './hook-timeline.css';
import { useWidgetFrame } from './widget-frame';

export default function HookTimeline() {
  const [toolIdx, setToolIdx] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);

  const tool = hookTools[toolIdx];

  const switchTool = (i: number) => {
    setToolIdx(i);
    setOpenId(null);
  };

  return (
    <div className={useWidgetFrame('hkt-root')}>
      <div className="hkt-tabs" role="tablist" aria-label="Tool">
        {hookTools.map((t, i) => (
          <button
            key={t.slug}
            role="tab"
            aria-selected={i === toolIdx}
            className={i === toolIdx ? 'hkt-tab hkt-tab-active' : 'hkt-tab'}
            onClick={() => switchTool(i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="hkt-body">
        <p className="hkt-config-note">{withCode(tool.configNote)}</p>
        {tool.orderNote && <p className="hkt-order-note">{tool.orderNote}</p>}

        {tool.phases.map((phase) => {
          const events = tool.events.filter((e) => e.phase === phase);
          if (events.length === 0) return null;
          return (
            <div key={phase} className="hkt-phase">
              <div className="hkt-phase-label">{phase}</div>
              {events.map((ev) => {
                const open = openId === ev.id;
                return (
                  <div key={ev.id} className="hkt-event">
                    <button
                      className="hkt-event-head"
                      aria-expanded={open}
                      onClick={() => setOpenId(open ? null : ev.id)}
                    >
                      <span className="hkt-event-name">{ev.name}</span>
                      <span
                        className={
                          ev.kind === 'gate'
                            ? 'hkt-kind hkt-kind-gate'
                            : 'hkt-kind hkt-kind-reactive'
                        }
                      >
                        {ev.kind === 'gate' ? 'can block' : 'observe'}
                      </span>
                      <span className="hkt-chevron" aria-hidden="true">
                        {open ? '▾' : '▸'}
                      </span>
                    </button>
                    {open && (
                      <div className="hkt-event-detail">
                        <p>{withCode(ev.fires)}</p>
                        {ev.blocking && (
                          <p className="hkt-blocking">
                            <strong>How it blocks:</strong> {withCode(ev.blocking)}
                          </p>
                        )}
                        {ev.example && (
                          <div className="hkt-example">
                            {ev.exampleTitle && (
                              <div className="hkt-example-header">
                                {ev.exampleTitle}
                              </div>
                            )}
                            <pre className="hkt-example-code">
                              <code>{ev.example}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
