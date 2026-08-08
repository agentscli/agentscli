import { useState } from 'react';
import { rlrLocations, rlrTools } from './rules-resolver-data';
import { withCode } from './with-code';
import './rules-resolver.css';
import { useWidgetFrame } from './widget-frame';
import { useAccessibleTabs } from './use-accessible-tabs';
import { useSyncedToolIndex } from './use-synced-tool';

const STATUS_LABEL: Record<string, string> = {
  loaded: 'loaded',
  skipped: 'skipped',
  replaced: 'replaced',
};

export default function RulesResolver() {
  const [toolIdx, setToolIdx] = useSyncedToolIndex(rlrTools);
  const [locId, setLocId] = useState(rlrLocations[0].id);

  const tool = rlrTools[toolIdx];
  const result = tool.results[locId];
  const tabs = useAccessibleTabs(rlrTools.length, toolIdx, setToolIdx);

  return (
    <div className={useWidgetFrame('rlr-root')}>
      <div className="rlr-tabs" {...tabs.tabListProps} aria-label="Tool">
        {rlrTools.map((t, i) => (
          <button
            key={t.slug}
            {...tabs.getTabProps(i)}
            className={i === toolIdx ? 'rlr-tab rlr-tab-active' : 'rlr-tab'}
            onClick={() => setToolIdx(i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rlr-body" {...tabs.panelProps}>
        <div className="rlr-picker">
          <span className="rlr-picker-label">The agent is working on:</span>
          <div className="rlr-picker-options">
            {rlrLocations.map((loc) => (
              <button
                key={loc.id}
                className={
                  loc.id === locId ? 'rlr-loc rlr-loc-active' : 'rlr-loc'
                }
                aria-pressed={loc.id === locId}
                onClick={() => setLocId(loc.id)}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        <p className="rlr-model">{withCode(tool.model)}</p>

        <ol className="rlr-outcomes" aria-live="polite">
          {result.outcomes.map((o) => (
            <li key={o.path} className={`rlr-outcome rlr-outcome-${o.status}`}>
              <span className={`rlr-status rlr-status-${o.status}`}>
                {o.status === 'loaded' && o.order ? `#${o.order} ` : ''}
                {STATUS_LABEL[o.status]}
              </span>
              <span className="rlr-path">{o.path}</span>
              <span className="rlr-note">{withCode(o.note)}</span>
            </li>
          ))}
        </ol>

        <div className="rlr-summary">{withCode(result.summary)}</div>
      </div>
    </div>
  );
}
