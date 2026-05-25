export type Tool = {
  slug: string;
  label: string;
};

export const tools: Tool[] = [
  { slug: 'claude-code', label: 'Claude Code' },
  { slug: 'codex', label: 'Codex' },
  { slug: 'opencode', label: 'opencode' },
  { slug: 'cursor', label: 'Cursor' },
  { slug: 'copilot', label: 'Copilot' },
];
