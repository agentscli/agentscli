/**
 * Plugin packer - one team setup (skill + subagent + hook + MCP server +
 * slash command) and how it ships to a teammate in each tool: which pieces
 * ride in the plugin bundle, which stay loose files. Formats, commands, and
 * marketplace names are extracted from
 * src/content/tool-instructions/<tool>/plugins.mdx - keep in sync.
 */

export type PpkToolId = 'claude-code' | 'codex' | 'opencode' | 'cursor' | 'copilot';
export type PpkStatus = 'bundle' | 'loose';

export interface PpkPiece {
  id: string;
  label: string;
}

export const ppkPieces: PpkPiece[] = [
  { id: 'skill', label: 'Skill' },
  { id: 'subagent', label: 'Subagent' },
  { id: 'hook', label: 'Hook' },
  { id: 'mcp', label: 'MCP server' },
  { id: 'command', label: 'Slash command' },
];

export interface PpkPieceCell {
  status: PpkStatus;
  note: string;
}

export interface PpkToolSpec {
  id: PpkToolId;
  label: string;
  pieces: Record<string, PpkPieceCell>;
  ship: { text?: string; code?: string };
  dist: string;
  caveat: string;
}

export const ppkTools: PpkToolSpec[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    pieces: {
      skill: { status: 'bundle', note: 'Lands in the plugin’s `skills/` directory.' },
      subagent: { status: 'bundle', note: '`agents/<name>.md` inside the plugin.' },
      hook: { status: 'bundle', note: 'Ships in the bundle and registers on install.' },
      mcp: { status: 'bundle', note: 'Server config ships in the bundle.' },
      command: { status: 'bundle', note: 'Namespaced on install: `/team-stack:pre-merge`.' },
    },
    ship: {
      code: '/plugin marketplace add our-org/team-plugins\n/plugin install team-stack@team-plugins',
    },
    dist: 'Scopes: user by default, `--scope project` commits the install to `.claude/settings.json`, and managed scope lets an org enforce it. The official `claude-plugins-official` marketplace is preinstalled.',
    caveat:
      'Installed plugins are copied into `~/.claude/plugins/cache/` - a plugin can’t reference files outside its own directory.',
  },
  {
    id: 'codex',
    label: 'Codex',
    pieces: {
      skill: { status: 'bundle', note: 'Lands in the plugin’s `skills/` directory.' },
      subagent: {
        status: 'loose',
        note: 'No `agents` manifest field - agent TOML files ship alongside the plugin, not inside it.',
      },
      hook: { status: 'bundle', note: '`hooks/hooks.json` ships in the plugin.' },
      mcp: { status: 'bundle', note: '`.mcp.json` ships in the plugin.' },
      command: {
        status: 'loose',
        note: 'No dedicated commands field - package it as a skill (standalone custom prompts are deprecated).',
      },
    },
    ship: {
      code: 'codex plugin marketplace add our-org/team-plugins\n/plugins   # browse + install from the CLI',
    },
    dist: 'Marketplace sources are `marketplace.json` files (local path, Git repo, or npm package), declared in `~/.codex/config.toml` under `[marketplaces.<name>]`. `/plugins` browses tabs for OpenAI-curated, workspace, and personal sources.',
    caveat:
      'Per-plugin state lives in `config.toml` - `[plugins."team-stack@team-plugins"] enabled = false` turns it off without uninstalling.',
  },
  {
    id: 'opencode',
    label: 'OpenCode',
    pieces: {
      skill: { status: 'loose', note: 'Skills stay loose files in `.opencode/skills/`.' },
      subagent: { status: 'loose', note: 'Agent markdown stays a loose file.' },
      hook: {
        status: 'bundle',
        note: 'The plugin IS the hook surface - export handlers for events like `file.edited`.',
      },
      mcp: { status: 'loose', note: 'Configured in `opencode.json`, outside the plugin.' },
      command: {
        status: 'loose',
        note: 'Explicitly not a plugin capability - commands stay in `.opencode/commands/`.',
      },
    },
    ship: {
      code: '// opencode.json\n"plugin": ["@our-org/team-stack"]',
    },
    dist: 'Plugins are live JS/TS modules - closer to a VS Code extension than a static bundle. npm packages auto-install at startup (via Bun); local files load from `.opencode/plugins/` or `~/.config/opencode/plugins/`.',
    caveat: 'No official registry - the community index is `awesome-opencode` on GitHub.',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    pieces: {
      skill: { status: 'loose', note: 'Share the `.cursor/skills/` folder directly.' },
      subagent: { status: 'loose', note: 'A `.cursor/*` file - share it directly.' },
      hook: { status: 'loose', note: 'A `.cursor/*` file - share it directly.' },
      mcp: {
        status: 'loose',
        note: 'One-click installs via the MCP Marketplace and cursor.directory.',
      },
      command: { status: 'loose', note: '`.cursor/commands/*.md` - share the files.' },
    },
    ship: {
      text: 'No plugin format yet - commit the `.cursor/*` files to the repo, and the whole team gets the setup on pull.',
    },
    dist: 'The inherited surfaces: OpenVSX-backed extensions (the VS Code model, with thinner coverage than upstream) and the MCP Marketplace. Neither bundles rules + skills + agents into one unit.',
    caveat:
      'Cursor’s public marketplace documentation does not establish a first-class registry that bundles rules, skills, agents, and hooks; verify any such product claim against the current docs.',
  },
  {
    id: 'copilot',
    label: 'Copilot',
    pieces: {
      skill: { status: 'bundle', note: 'Bundles into the plugin.' },
      subagent: { status: 'bundle', note: 'Agents bundle into the plugin.' },
      hook: { status: 'bundle', note: 'Bundles into the plugin.' },
      mcp: {
        status: 'bundle',
        note: 'MCP server configs bundle; the separate MCP registry (github.com/mcp) covers one-off installs.',
      },
      command: {
        status: 'loose',
        note: 'Prompt files aren’t listed among plugin components in our chapter - share `.github/prompts/` files.',
      },
    },
    ship: {
      text: 'Install from a plugin marketplace - `github/copilot-plugins` (official) and `github/awesome-copilot` (community) are registered by default; marketplaces can live on GitHub, any Git server, or disk.',
    },
    dist: 'Plugins bundle agents + skills + hooks + MCP + LSP for both VS Code and the Copilot CLI. Enterprise admins can set baseline plugins for every user (enterprise-managed plugins remain in public preview).',
    caveat:
      'Don’t reach for Copilot Extensions - the GitHub-App, `@`-invocable Marketplace extensions were disabled on 2025-11-10. Plugins and MCP are the live surfaces.',
  },
];
