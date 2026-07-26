import React, { useState } from 'react';
import type { Verdict } from './permission-sim-data';
import {
  VERDICT_LABEL,
  ccPolicy,
  ccScenarios,
  cxActions,
  cxApprovals,
  cxSandboxes,
  ocAgents,
  ocConfig,
  ocTools,
} from './permission-sim-data';
import { withCode } from './with-code';
import './permission-sim.css';
import { useWidgetFrame } from './widget-frame';

const TABS = ['Claude Code', 'Codex', 'opencode'];

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return (
    <span className={`psim-verdict psim-verdict-${verdict}`}>
      {VERDICT_LABEL[verdict]}
    </span>
  );
}

function Chips<T extends { id: string; label: string }>(props: {
  items: T[];
  activeId: string;
  onPick: (id: string) => void;
  ariaLabel: string;
}) {
  return (
    <div className="psim-chips" role="group" aria-label={props.ariaLabel}>
      {props.items.map((item) => (
        <button
          key={item.id}
          className={
            item.id === props.activeId ? 'psim-chip psim-chip-active' : 'psim-chip'
          }
          aria-pressed={item.id === props.activeId}
          onClick={() => props.onPick(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function ClaudeCodePanel() {
  const [scenarioId, setScenarioId] = useState(ccScenarios[0].id);
  const scenario = ccScenarios.find((s) => s.id === scenarioId)!;

  return (
    <div>
      <p className="psim-intro">
        Rules live in <code>settings.json</code> as allow / ask / deny lists.
        Evaluation order: <strong>deny beats ask beats allow</strong>; anything
        unmatched falls through to the default (ask). Example policy:
      </p>
      <pre className="psim-code">
        <code>{ccPolicy}</code>
      </pre>
      <div className="psim-control">
        <span className="psim-control-label">The agent tries:</span>
        <Chips
          items={ccScenarios.map((s) => ({ id: s.id, label: s.label }))}
          activeId={scenarioId}
          onPick={setScenarioId}
          ariaLabel="Command to evaluate"
        />
      </div>
      <ol className="psim-steps" aria-live="polite">
        {scenario.steps.map((step, i) => (
          <li
            key={i}
            className={step.matched ? 'psim-step psim-step-hit' : 'psim-step'}
          >
            <span className="psim-step-list">
              {step.list === 'default' ? 'default' : `${step.list} list`}
            </span>
            <span className="psim-step-text">
              {step.matched && <code>{step.matched}</code>} {step.text}
            </span>
          </li>
        ))}
      </ol>
      <div className="psim-result">
        Result: <VerdictBadge verdict={scenario.verdict} />
      </div>
    </div>
  );
}

function CodexPanel() {
  const [sandbox, setSandbox] = useState('workspace-write');
  const [approval, setApproval] = useState('on-request');
  const [actionId, setActionId] = useState(cxActions[1].id);

  const action = cxActions.find((a) => a.id === actionId)!;
  const sandboxOk = action.allowedIn[sandbox];

  let verdict: Verdict;
  let explanation: string;
  if (!sandboxOk) {
    verdict = 'blocked';
    explanation =
      'The sandbox rejects this before the approval policy is ever consulted. Two gates, in sequence - the sandbox is the outer one.';
  } else if (approval === 'untrusted') {
    verdict = 'ask';
    explanation =
      'The sandbox permits it, and the `untrusted` policy asks before every action.';
  } else if (approval === 'on-request') {
    verdict = 'allow';
    explanation =
      'The sandbox permits it; with `on-request`, the agent proceeds and decides for itself when something is worth asking about.';
  } else {
    verdict = 'allow';
    explanation =
      'The sandbox permits it and `never` means no prompts - the sandbox boundary is your only guardrail.';
  }

  return (
    <div>
      <p className="psim-intro">
        Codex separates <strong>what the agent can touch</strong> (sandbox) from{' '}
        <strong>when it must ask</strong> (approval policy). Set with{' '}
        <code>--sandbox</code> and <code>--ask-for-approval</code>, or in{' '}
        <code>config.toml</code> profiles.
      </p>
      <div className="psim-control">
        <span className="psim-control-label">Sandbox:</span>
        <Chips
          items={cxSandboxes}
          activeId={sandbox}
          onPick={setSandbox}
          ariaLabel="Sandbox mode"
        />
      </div>
      <p className="psim-hint">{cxSandboxes.find((s) => s.id === sandbox)!.blurb}</p>
      <div className="psim-control">
        <span className="psim-control-label">Approval policy:</span>
        <Chips
          items={cxApprovals}
          activeId={approval}
          onPick={setApproval}
          ariaLabel="Approval policy"
        />
      </div>
      <p className="psim-hint">{cxApprovals.find((a) => a.id === approval)!.blurb}</p>
      <div className="psim-control">
        <span className="psim-control-label">The agent tries:</span>
        <Chips
          items={cxActions}
          activeId={actionId}
          onPick={setActionId}
          ariaLabel="Action to evaluate"
        />
      </div>
      <div className="psim-result" aria-live="polite">
        Result: <VerdictBadge verdict={verdict} />
        <p className="psim-explanation">{withCode(explanation)}</p>
      </div>
    </div>
  );
}

function OpenCodePanel() {
  const [agentId, setAgentId] = useState(ocAgents[0].id);
  const [toolId, setToolId] = useState('edit');

  const agent = ocAgents.find((a) => a.id === agentId)!;
  const verdict = agent.permissions[toolId];

  return (
    <div>
      <p className="psim-intro">
        opencode scopes permissions <strong>per tool, per agent</strong> - each
        primary agent carries its own allow/ask/deny map, so switching agents
        (Tab) switches policies. Example config:
      </p>
      <pre className="psim-code">
        <code>{ocConfig}</code>
      </pre>
      <div className="psim-control">
        <span className="psim-control-label">Active agent:</span>
        <Chips
          items={ocAgents}
          activeId={agentId}
          onPick={setAgentId}
          ariaLabel="Primary agent"
        />
      </div>
      <div className="psim-control">
        <span className="psim-control-label">The agent tries the tool:</span>
        <Chips
          items={ocTools}
          activeId={toolId}
          onPick={setToolId}
          ariaLabel="Tool to evaluate"
        />
      </div>
      <div className="psim-result" aria-live="polite">
        Result: <VerdictBadge verdict={verdict} />
        <p className="psim-explanation">
          The <code>{agent.label}</code> agent's map says{' '}
          <code>
            {toolId}: {verdict}
          </code>
          . Same repo, same command - the other agent may answer differently.
        </p>
      </div>
    </div>
  );
}

export default function PermissionSim() {
  const [tab, setTab] = useState(0);

  return (
    <div className={useWidgetFrame('psim-root')}>
      <div className="psim-tabs" role="tablist" aria-label="Tool">
        {TABS.map((label, i) => (
          <button
            key={label}
            role="tab"
            aria-selected={i === tab}
            className={i === tab ? 'psim-tab psim-tab-active' : 'psim-tab'}
            onClick={() => setTab(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="psim-body">
        {tab === 0 && <ClaudeCodePanel />}
        {tab === 1 && <CodexPanel />}
        {tab === 2 && <OpenCodePanel />}
      </div>
    </div>
  );
}
