import React, { useState } from 'react';
import {
  MCM_BUILTIN_TOKENS,
  MCM_DEFERRED_STUB_TOKENS,
  MCM_WINDOW_TOKENS,
  mcpServers,
} from './mcp-cost-data';
import './mcp-cost-meter.css';
import { useWidgetFrame } from './widget-frame';

export default function McpCostMeter() {
  const [enabled, setEnabled] = useState<Set<string>>(
    new Set(mcpServers.map((s) => s.id))
  );
  const [deferred, setDeferred] = useState(false);

  const toggle = (id: string) => {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const active = mcpServers.filter((s) => enabled.has(s.id));
  const costOf = (tokens: number) =>
    deferred ? MCM_DEFERRED_STUB_TOKENS : tokens;
  const mcpTotal = active.reduce((sum, s) => sum + costOf(s.tokens), 0);
  const total = MCM_BUILTIN_TOKENS + mcpTotal;
  const pct = Math.round((total / MCM_WINDOW_TOKENS) * 100);
  const fmt = (n: number) => (n < 1 ? n.toFixed(1) : Math.round(n).toString());

  return (
    <div className={useWidgetFrame('mcm-root')}>
      <div className="mcm-gauge-row">
        <span className={pct >= 25 ? 'mcm-gauge mcm-gauge-hot' : 'mcm-gauge'}>
          {fmt(total)}k of {MCM_WINDOW_TOKENS}k ({pct}%) spent before your first
          message
        </span>
      </div>

      <div
        className="mcm-bar"
        role="img"
        aria-label={`Tool definitions cost ${fmt(total)}k of ${MCM_WINDOW_TOKENS}k tokens (${pct}%)`}
      >
        <span
          className="mcm-block mcm-block-builtin"
          style={{ width: `${(MCM_BUILTIN_TOKENS / MCM_WINDOW_TOKENS) * 100}%` }}
          title={`Built-in tools - ${MCM_BUILTIN_TOKENS}k`}
        />
        {active.map((s) => (
          <span
            key={s.id}
            className="mcm-block mcm-block-mcp"
            style={{ width: `${(costOf(s.tokens) / MCM_WINDOW_TOKENS) * 100}%` }}
            title={`${s.label} - ${fmt(costOf(s.tokens))}k`}
          />
        ))}
      </div>

      <div className="mcm-legend">
        <span className="mcm-legend-item">
          <span className="mcm-swatch mcm-block-builtin" aria-hidden="true" />
          Built-in tools ({MCM_BUILTIN_TOKENS}k, fixed)
        </span>
        <span className="mcm-legend-item">
          <span className="mcm-swatch mcm-block-mcp" aria-hidden="true" />
          MCP tool schemas ({fmt(mcpTotal)}k)
        </span>
      </div>

      <label className="mcm-defer">
        <input
          type="checkbox"
          checked={deferred}
          onChange={() => setDeferred(!deferred)}
        />
        <span>
          <strong>Defer schemas until first use</strong> - each server shrinks to
          a ~{MCM_DEFERRED_STUB_TOKENS}k stub (name + description); the full
          schema loads only when a tool is actually called. Claude Code ships
          this (tool search, on by default); the other tools in scope load
          schemas up front.
        </span>
      </label>

      <ul className="mcm-servers">
        {mcpServers.map((s) => {
          const on = enabled.has(s.id);
          return (
            <li key={s.id}>
              <label className="mcm-server">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(s.id)}
                />
                <span className="mcm-server-name">{s.label}</span>
                <span className="mcm-server-meta">
                  {s.toolCount} tools ·{' '}
                  <span className={on ? 'mcm-cost' : 'mcm-cost mcm-cost-off'}>
                    {on ? `${fmt(costOf(s.tokens))}k` : '0k'}
                  </span>
                  {on && deferred && (
                    <span className="mcm-was"> (was {s.tokens}k)</span>
                  )}
                </span>
                <span className="mcm-server-blurb">{s.blurb}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <p className="mcm-footnote">
        Tool counts and schema sizes are illustrative (~600–800 tokens per tool
        definition). The shape is the point: every registered server is paid
        for in window space whether the session uses it or not.
      </p>
    </div>
  );
}
