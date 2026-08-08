import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ExplorerNode, ToolData } from './config-explorer-types';
import { configExplorerTools } from './config-explorer-data';
import { withCode } from './with-code';
import './config-explorer.css';
import { useWidgetFrame } from './widget-frame';
import { useAccessibleTabs } from './use-accessible-tabs';
import { useSyncedToolIndex } from './use-synced-tool';

const BADGE_LABEL: Record<string, string> = {
  committed: 'committed',
  gitignored: 'gitignored',
  'auto-generated': 'auto-generated',
};

const BADGE_HINT: Record<string, string> = {
  committed: 'Tracked in git - shared with your whole team.',
  gitignored: 'Excluded from git - stays on your machine only.',
  'auto-generated': "Written by the tool itself - don't hand-edit.",
};

// Long path labels wrap at slashes rather than mid-token.
function breakAtSlashes(label: string): React.ReactNode {
  const parts = label.split(/(?<=\/)/);
  if (parts.length === 1) return label;
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {i > 0 && <wbr />}
      {part}
    </React.Fragment>
  ));
}

interface FlatNode {
  node: ExplorerNode;
  depth: number;
  scopeIdx: number;
  parentIds: string[];
}

function flattenScope(
  nodes: ExplorerNode[],
  scopeIdx: number,
  depth = 0,
  parentIds: string[] = []
): FlatNode[] {
  return nodes.flatMap((node) => [
    { node, depth, scopeIdx, parentIds },
    ...(node.children
      ? flattenScope(node.children, scopeIdx, depth + 1, [...parentIds, node.id])
      : []),
  ]);
}

function findNode(tool: ToolData, id: string): FlatNode | undefined {
  return tool.scopes
    .flatMap((scope, i) => flattenScope(scope.nodes, i))
    .find((f) => f.node.id === id);
}

interface TabState {
  selectedId: string | null;
  collapsed: Set<string>;
}

function emptyTabState(): TabState {
  return { selectedId: null, collapsed: new Set() };
}

export default function ConfigExplorer({ initialTool }: { initialTool?: string }) {
  const tools = configExplorerTools;
  // Course pages open on their own tool's tab; a deep-link hash still wins
  // because the hash effect below runs after mount and overrides this.
  const [toolIdx, setSyncedToolIdx] = useSyncedToolIndex(tools, initialTool);
  // Per-tool memory: each tool keeps its own selection + collapse state for
  // the session, so switching tabs and back restores where you left off
  // instead of dumping you back to the empty state.
  const tabStateRef = useRef<Map<number, TabState>>(new Map());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const detailRef = useRef<HTMLDivElement>(null);

  const tool = tools[toolIdx];

  // Defined above the tab hook so arrow-key switching and clicking take the
  // exact same path: both must restore the target tab's saved state, or the
  // effect below writes the outgoing tab's selection under the incoming index.
  const switchTool = (i: number) => {
    const saved = tabStateRef.current.get(i) ?? emptyTabState();
    setSyncedToolIdx(i);
    setSelectedId(saved.selectedId);
    setCollapsed(saved.collapsed);
  };

  const tabs = useAccessibleTabs(tools.length, toolIdx, switchTool);

  // Keep the active tool's entry in the state map current so it's there to
  // restore from when the user switches away and back.
  useEffect(() => {
    tabStateRef.current.set(toolIdx, { selectedId, collapsed });
  }, [toolIdx, selectedId, collapsed]);

  // Deep link: #cx-<toolslug>-<nodeid> selects the node. Re-applied on
  // hashchange so links into the explorer work after bfcache restores too.
  useEffect(() => {
    const apply = () => {
      if (!window.location.hash.startsWith('#cx-')) return;
      const hash = window.location.hash.slice(4);
      for (let i = 0; i < tools.length; i++) {
        if (!hash.startsWith(tools[i].slug + '-')) continue;
        const nodeId = hash.slice(tools[i].slug.length + 1);
        if (findNode(tools[i], nodeId)) {
          const saved = tabStateRef.current.get(i) ?? emptyTabState();
          setSyncedToolIdx(i);
          setSelectedId(nodeId);
          setCollapsed(saved.collapsed);
          requestAnimationFrame(() => {
            document
              .getElementById(`cx-${tools[i].slug}-${nodeId}`)
              ?.scrollIntoView({ block: 'nearest' });
          });
          return;
        }
      }
    };
    apply();
    window.addEventListener('hashchange', apply);
    window.addEventListener('pageshow', apply);
    return () => {
      window.removeEventListener('hashchange', apply);
      window.removeEventListener('pageshow', apply);
    };
  }, [setSyncedToolIdx, tools]);

  useEffect(() => {
    if (detailRef.current) detailRef.current.scrollTop = 0;
  }, [selectedId, toolIdx]);

  const flatByScope = useMemo(
    () => tool.scopes.map((scope, i) => flattenScope(scope.nodes, i)),
    [tool]
  );

  const selected = selectedId ? findNode(tool, selectedId) : undefined;

  const selectNode = (node: ExplorerNode) => {
    const next = selectedId === node.id ? null : node.id;
    setSelectedId(next);
    const url = new URL(window.location.href);
    url.hash = next ? `cx-${tool.slug}-${next}` : '';
    history.replaceState(null, '', url);
  };

  const toggleFolder = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={useWidgetFrame('cx-root')}>
      <div className="cx-tabs" {...tabs.tabListProps} aria-label="Tool">
        {tools.map((t, i) => (
          <button
            key={t.slug}
            {...tabs.getTabProps(i)}
            className={i === toolIdx ? 'cx-tab cx-tab-active' : 'cx-tab'}
            onClick={() => switchTool(i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="cx-legend">
        <span className="cx-badge cx-badge-committed">committed</span>
        <span className="cx-legend-text">in git, shared with your team</span>
        <span className="cx-badge cx-badge-gitignored">gitignored</span>
        <span className="cx-legend-text">local only, never shared</span>
        <span className="cx-badge cx-badge-auto-generated">auto-generated</span>
        <span className="cx-legend-text">written by the tool; do not hand-edit</span>
      </div>

      <div className="cx-body" {...tabs.panelProps}>
        <div className="cx-tree" role="group" aria-label={`${tool.label} config files`}>
          {tool.scopes.map((scope, scopeIdx) => (
            <div key={scope.label} className="cx-scope">
              <div className="cx-scope-label">{scope.label}</div>
              {flatByScope[scopeIdx]
                .filter((f) => !f.parentIds.some((p) => collapsed.has(p)))
                .map((f) => {
                  const { node, depth } = f;
                  const isFolder = node.type === 'folder';
                  const isCollapsed = collapsed.has(node.id);
                  const isSelected = selectedId === node.id;
                  return (
                    <div
                      key={node.id}
                      id={`cx-${tool.slug}-${node.id}`}
                      className={isSelected ? 'cx-row cx-row-selected' : 'cx-row'}
                      style={{ paddingLeft: 10 + depth * 18 }}
                    >
                      {isFolder ? (
                        <button
                          className="cx-caret"
                          aria-label={isCollapsed ? `Expand ${node.label}` : `Collapse ${node.label}`}
                          aria-expanded={!isCollapsed}
                          onClick={() => toggleFolder(node.id)}
                        >
                          {isCollapsed ? '▸' : '▾'}
                        </button>
                      ) : (
                        <span className="cx-caret cx-caret-empty" aria-hidden="true" />
                      )}
                      <button
                        className="cx-row-main"
                        aria-current={isSelected || undefined}
                        onClick={() => selectNode(node)}
                      >
                        <span className={isFolder ? 'cx-label cx-label-folder' : 'cx-label'}>
                          {breakAtSlashes(node.label)}
                        </span>
                        {node.badge && (
                          <span
                            className={`cx-badge cx-badge-${node.badge}`}
                            title={BADGE_HINT[node.badge]}
                            aria-label={`${BADGE_LABEL[node.badge]}: ${BADGE_HINT[node.badge]}`}
                          >
                            {BADGE_LABEL[node.badge]}
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>

        <div className="cx-detail" ref={detailRef}>
          {selected ? (
            <DetailPanel node={selected.node} />
          ) : (
            <div className="cx-detail-empty">
              <div className="cx-detail-empty-title">Select a file or folder</div>
              <p>
                Every entry shows what the file does, when {tool.label} reads it, whether it
                belongs in git, and a working example.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ node }: { node: ExplorerNode }) {
  return (
    <div>
      <div className="cx-detail-header">
        <span className="cx-detail-title">{node.label}</span>
        {node.badge && (
          <span
            className={`cx-badge cx-badge-${node.badge}`}
            title={BADGE_HINT[node.badge]}
            aria-label={`${BADGE_LABEL[node.badge]}: ${BADGE_HINT[node.badge]}`}
          >
            {BADGE_LABEL[node.badge]}
          </span>
        )}
      </div>
      <p className="cx-detail-oneliner">{withCode(node.oneLiner)}</p>
      {node.when && (
        <div className="cx-detail-when">
          <span className="cx-detail-when-label">When it loads</span>
          <span>{withCode(node.when)}</span>
        </div>
      )}
      <p className="cx-detail-desc">{withCode(node.description)}</p>
      {node.tips && node.tips.length > 0 && (
        <ul className="cx-tips">
          {node.tips.map((tip, i) => (
            <li key={i}>{withCode(tip)}</li>
          ))}
        </ul>
      )}
      {node.example && (
        <div className="cx-example">
          <div className="cx-example-header">{node.exampleTitle ?? node.label}</div>
          {node.exampleIntro && <p className="cx-example-intro">{withCode(node.exampleIntro)}</p>}
          <pre className="cx-example-code">
            <code>{node.example}</code>
          </pre>
        </div>
      )}
      {node.chapter && (
        <a className="cx-chapter-link" href={node.chapter.href}>
          {node.chapter.label} →
        </a>
      )}
    </div>
  );
}
