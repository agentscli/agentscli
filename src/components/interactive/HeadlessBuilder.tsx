import { useState } from 'react';
import type { HlbOutputId, HlbPostureId, HlbToolId } from './headless-builder-data';
import { hlbAssemble, hlbOutputs, hlbPostures, hlbTasks, hlbTools } from './headless-builder-data';
import { withCode } from './with-code';
import './headless-builder.css';
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
    <div className="hlb-row" role="group" aria-label={label}>
      <span className="hlb-row-label">{label}</span>
      <div className="hlb-row-options">
        {options.map((o) => (
          <button
            key={o.id}
            className={value === o.id ? 'hlb-choice hlb-choice-active' : 'hlb-choice'}
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

export default function HeadlessBuilder() {
  const [toolIdx, setToolIdx] = useSyncedToolIndex(hlbTools);
  const toolId = hlbTools[toolIdx].id as HlbToolId;
  const [taskId, setTaskId] = useState(hlbTasks[0].id);
  const [outputId, setOutputId] = useState<HlbOutputId>('json');
  const [postureId, setPostureId] = useState<HlbPostureId>('readonly');

  const tool = hlbTools.find((t) => t.id === toolId)!;
  const task = hlbTasks.find((t) => t.id === taskId)!;
  const output = tool.outputs[outputId];
  const posture = tool.postures[postureId];
  const command = hlbAssemble(tool, task.prompt, outputId, postureId);
  const tabs = useAccessibleTabs(hlbTools.length, toolIdx, setToolIdx);

  return (
    <div className={useWidgetFrame('hlb-root')}>
      <div className="hlb-tools" {...tabs.tabListProps} aria-label="Tool">
        {hlbTools.map((t) => (
          <button
            key={t.id}
            {...tabs.getTabProps(hlbTools.indexOf(t))}
            className={toolId === t.id ? 'hlb-tool hlb-tool-active' : 'hlb-tool'}
            onClick={() => setToolIdx(hlbTools.indexOf(t))}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="hlb-scope-note">
        This builder covers five tools. Pi&apos;s headless and JSON modes are documented in the comparison below.
      </p>

      <ChoiceRow label="Task" options={hlbTasks} value={taskId} onChange={setTaskId} />
      <ChoiceRow label="Output" options={hlbOutputs} value={outputId} onChange={setOutputId} />
      <ChoiceRow label="Posture" options={hlbPostures} value={postureId} onChange={setPostureId} />

      <div className="hlb-result" {...tabs.panelProps}>
        <span className="hlb-sr-only" aria-live="polite">
          {tool.label}, {task.label}, {hlbOutputs.find((o) => o.id === outputId)?.label}, {hlbPostures.find((p) => p.id === postureId)?.label}.
        </span>
        <pre className="hlb-cmd">
          <code>{command}</code>
        </pre>

        {posture.config && (
          <div className="hlb-config">
            <div className="hlb-config-title">{posture.config.title}</div>
            <pre className="hlb-config-code">
              <code>{posture.config.code}</code>
            </pre>
          </div>
        )}

        <ul className="hlb-notes">
          <li className="hlb-note">
            <span className="hlb-note-tag">posture</span>
            <span>{withCode(posture.note)}</span>
          </li>
          <li className="hlb-note">
            <span className="hlb-note-tag">output</span>
            <span>{withCode(output.note)}</span>
          </li>
          <li className="hlb-note">
            <span className="hlb-note-tag">beyond</span>
            <span>{withCode(tool.footnote)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
