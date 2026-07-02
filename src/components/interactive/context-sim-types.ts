export type SimCategory =
  | 'overhead' // system prompt, tool definitions, MCP schemas
  | 'rules'
  | 'chat'
  | 'files'
  | 'tools'
  | 'summary';

export interface SimSegment {
  /** Unique across the whole scenario; compaction keeps segments by id */
  id: string;
  category: SimCategory;
  label: string;
  /** Thousands of tokens (12 = 12k) */
  tokens: number;
  /** Extra line shown when the segment is clicked */
  note?: string;
}

export interface SimStep {
  id: string;
  title: string;
  /** Backticks render as inline code */
  narration: string;
  /** Highlighted takeaway shown under the narration */
  callout?: string;
  add?: SimSegment[];
  /** Replaces the window: keeps only keepIds, then appends add */
  compact?: { keepIds: string[]; add: SimSegment[] };
  /** Shows the separate subagent window panel on this step */
  subagent?: { label: string; tokens: number; returns: number };
}
