export type Badge = 'committed' | 'gitignored' | 'auto-generated';

export interface ExplorerNode {
  /** Unique within a tool; used for deep links as #cx-<tool>-<id> */
  id: string;
  label: string;
  type: 'file' | 'folder';
  badge?: Badge;
  /** One-line purpose shown in the tree row tooltip and detail header */
  oneLiner: string;
  /** When the file loads / takes effect */
  when?: string;
  /** Backticks render as inline code */
  description: string;
  tips?: string[];
  exampleIntro?: string;
  /** Raw example file content, rendered in a mono block */
  example?: string;
  /** Filename shown in the example block header; defaults to label */
  exampleTitle?: string;
  /** Link into the foundations chapter that covers this surface */
  chapter?: { label: string; href: string };
  children?: ExplorerNode[];
}

export interface ToolScope {
  /** e.g. "your-project/" or "~ (home directory)" */
  label: string;
  nodes: ExplorerNode[];
}

export interface ToolData {
  slug: string;
  label: string;
  scopes: ToolScope[];
}
