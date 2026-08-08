import { useState } from 'react';
import type { MmtScopeId, MmtToolId } from './model-matcher-data';
import { mmtScopes, mmtTasks, mmtTools } from './model-matcher-data';
import { withCode } from './with-code';
import './model-matcher.css';
import { useWidgetFrame } from './widget-frame';
import { useAccessibleTabs } from './use-accessible-tabs';
import { useSyncedToolIndex } from './use-synced-tool';

function ChoiceRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="mmt-row" role="group" aria-label={label}>
      <span className="mmt-row-label">{label}</span>
      <div className="mmt-row-options">
        {options.map((o) => (
          <button
            key={o.id}
            className={value === o.id ? 'mmt-choice mmt-choice-active' : 'mmt-choice'}
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ModelMatcher() {
  const [toolIdx, setToolIdx] = useSyncedToolIndex(mmtTools);
  const toolId = mmtTools[toolIdx].id as MmtToolId;
  const [taskId, setTaskId] = useState(mmtTasks[0].id);
  const [scopeId, setScopeId] = useState<MmtScopeId>('session');

  const tool = mmtTools.find((t) => t.id === toolId)!;
  const task = mmtTasks.find((t) => t.id === taskId)!;
  const tier = tool.tiers[task.tier];
  const scope = tool.scopes[scopeId];
  const code = scope.code?.replace('{model}', tier.model);
  const tabs = useAccessibleTabs(mmtTools.length, toolIdx, setToolIdx);

  return (
    <div className={useWidgetFrame('mmt-root')}>
      <div className="mmt-tools" {...tabs.tabListProps} aria-label="Tool">
        {mmtTools.map((t) => (
          <button
            key={t.id}
            {...tabs.getTabProps(mmtTools.indexOf(t))}
            className={toolId === t.id ? 'mmt-tool mmt-tool-active' : 'mmt-tool'}
            onClick={() => setToolIdx(mmtTools.indexOf(t))}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="mmt-scope-note">
        This matcher covers five tools. Pi&apos;s provider and model configuration is documented in the comparison below.
      </p>

      <ChoiceRow label="Work" options={mmtTasks} value={taskId} onChange={setTaskId} />
      <ChoiceRow label="Scope" options={mmtScopes} value={scopeId} onChange={setScopeId} />

      <div className="mmt-result" {...tabs.panelProps}>
        <span className="mmt-sr-only" aria-live="polite">
          {tool.label}, {task.label}, {mmtScopes.find((s) => s.id === scopeId)?.label}: use {tier.model}.
        </span>
        <div className="mmt-pick">
          <span className="mmt-pick-label">use</span>
          <code className="mmt-pick-model">{tier.model}</code>
        </div>

        {code && (
          <pre className="mmt-cmd">
            <code>{code}</code>
          </pre>
        )}

        <ul className="mmt-notes">
          <li className="mmt-note">
            <span className="mmt-note-tag">why</span>
            <span>{withCode(task.why)}</span>
          </li>
          <li className="mmt-note">
            <span className="mmt-note-tag">model</span>
            <span>{withCode(tier.note)}</span>
          </li>
          <li className="mmt-note">
            <span className="mmt-note-tag">how</span>
            <span>{withCode(scope.how)}</span>
          </li>
          <li className="mmt-note">
            <span className="mmt-note-tag">roster</span>
            <span>{withCode(tool.roster)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
