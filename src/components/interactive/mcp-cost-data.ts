/**
 * Illustrative MCP servers for the context-cost meter. Tool counts and
 * schema sizes are order-of-magnitude estimates (~600 - 800 tokens per tool
 * definition), not measurements - the point is the shape of the cost, not
 * the exact numbers. Window + built-in baseline match context-sim-data.ts.
 */

export const MCM_WINDOW_TOKENS = 200;

/** Built-in tool definitions (read, edit, bash, grep…) - always present */
export const MCM_BUILTIN_TOKENS = 12;

/** Approx. cost per enabled server when schemas are deferred (name + description stub) */
export const MCM_DEFERRED_STUB_TOKENS = 0.4;

export interface McpServer {
  id: string;
  label: string;
  toolCount: number;
  /** Thousands of tokens of tool schemas when loaded up front */
  tokens: number;
  blurb: string;
}

export const mcpServers: McpServer[] = [
  {
    id: 'github',
    label: 'GitHub',
    toolCount: 35,
    tokens: 26,
    blurb: 'Issues, PRs, reviews, workflows - big surface, big schema.',
  },
  {
    id: 'playwright',
    label: 'Browser (Playwright)',
    toolCount: 25,
    tokens: 18,
    blurb: 'Navigate, click, fill, screenshot, network inspection.',
  },
  {
    id: 'notion',
    label: 'Notion',
    toolCount: 15,
    tokens: 11,
    blurb: 'Search, fetch, create and update pages and databases.',
  },
  {
    id: 'figma',
    label: 'Figma',
    toolCount: 12,
    tokens: 9,
    blurb: 'Read frames, components, and design tokens.',
  },
  {
    id: 'postgres',
    label: 'Postgres',
    toolCount: 8,
    tokens: 6,
    blurb: 'Query, schema inspection, explain plans.',
  },
];
