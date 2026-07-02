import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ExplorerNode, ToolData } from './config-explorer-types';
import { configExplorerTools } from './config-explorer-data';
import { withCode } from './with-code';
import './config-explorer.css';

const BADGE_LABEL: Record<string, string> = {
  committed: 'committed',
  gitignored: 'gitignored',
  'auto-generated': 'auto-generated',
};

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

export default function ConfigExplorer() {
  const tools = configExplorerTools;
  const [toolIdx, setToolIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const detailRef = useRef<HTMLDivElement>(null);

  const tool = tools[toolIdx];

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
          setToolIdx(i);
          setSelectedId(nodeId);
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
  }, [tools]);

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

  const switchTool = (i: number) => {
    setToolIdx(i);
    setSelectedId(null);
    setCollapsed(new Set());
  };

  return (
    <div className="cx-root not-content">
      <div className="cx-tabs" role="tablist" aria-label="Tool">
        {tools.map((t, i) => (
          <button
            key={t.slug}
            role="tab"
            aria-selected={i === toolIdx}
            className={i === toolIdx ? 'cx-tab cx-tab-active' : 'cx-tab'}
            onClick={() => switchTool(i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="cx-body">
        <div className="cx-tree" aria-label={`${tool.label} config files`}>
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
                          {node.label}
                        </span>
                        {node.badge && (
                          <span className={`cx-badge cx-badge-${node.badge}`}>
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
          <span className={`cx-badge cx-badge-${node.badge}`}>{BADGE_LABEL[node.badge]}</span>
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
