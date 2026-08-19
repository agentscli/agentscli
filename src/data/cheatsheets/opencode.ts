/**
 * OpenCode cheatsheet facts - the single source of truth for the cheatsheet
 * renderer and the foundations page.
 *
 * FACT-BOUND. Verification, 2026-08-18:
 *   - CLI flags and subcommands: read from the installed `opencode --help`
 *     and subcommand help, v1.4.7; marked `firsthand`.
 *   - TUI, config, agents, permissions, MCP, plugins, skills, and server:
 *     official docs at opencode.ai/docs; marked `documented`.
 *   - This page describes the v1 config shape used by the installed binary.
 *     The site's official `/v2/docs` pages use a different permissions schema.
 */

export type CheatConf = "firsthand" | "documented";

export interface CheatEntry {
  cmd: string;
  desc: string;
  example?: string;
  note?: string;
  conf: CheatConf;
  doc?: string;
  site?: string;
}

export interface CheatCategory {
  id: string;
  label: string;
  blurb: string;
  entries: CheatEntry[];
}

export interface Cheatsheet {
  tool: string;
  label: string;
  version: string;
  checkedAt: string;
  sources: string[];
  intro: string;
  categories: CheatCategory[];
}

const OC = "https://opencode.ai/docs";

export const opencodeCheatsheet: Cheatsheet = {
  tool: "opencode",
  label: "OpenCode",
  version: "1.4.7",
  checkedAt: "2026-08-18",
  sources: [
    "Installed binary: opencode --help and subcommand help (v1.4.7, first-hand)",
    "GitHub repository: https://github.com/anomalyco/opencode",
    "Installed-version release: https://github.com/anomalyco/opencode/releases/tag/v1.4.7",
    `${OC}/cli`,
    `${OC}/tui`,
    `${OC}/config`,
    `${OC}/permissions`,
    `${OC}/agents`,
    `${OC}/models`,
    `${OC}/mcp-servers`,
    `${OC}/plugins`,
    `${OC}/skills`,
    `${OC}/server`,
  ],
  intro:
    "OpenCode is a provider-agnostic, terminal-first coding agent. Rows marked binary were checked against installed v1.4.7; rows marked docs are from current OpenCode v1 documentation and may describe features added after that binary. OpenCode 2 is a separate beta product using `opencode2`; the config examples here target v1.",

  categories: [
    {
      id: "install",
      label: "Install & authenticate",
      blurb:
        "Put OpenCode on the path, update it, then connect a model provider.",
      entries: [
        {
          cmd: "curl -fsSL https://opencode.ai/install | bash",
          desc: "Install the native CLI with the official installer.",
          conf: "documented",
          doc: `${OC}/`,
        },
        {
          cmd: "brew install anomalyco/tap/opencode",
          desc: "Install the current Homebrew tap build on macOS or Linux.",
          conf: "documented",
          doc: `${OC}/`,
        },
        {
          cmd: "npm i -g opencode-ai@latest",
          desc: "Install or update the npm distribution.",
          conf: "documented",
          doc: `${OC}/`,
        },
        {
          cmd: "opencode --version",
          desc: "Print the installed version.",
          conf: "firsthand",
        },
        {
          cmd: "opencode upgrade [target]",
          desc: "Upgrade to the latest release or a specific target version.",
          conf: "firsthand",
        },
        {
          cmd: "opencode uninstall",
          desc: "Remove OpenCode and its related files.",
          conf: "firsthand",
        },
        {
          cmd: "opencode auth login",
          desc: "Alias for provider login; choose a provider and authenticate.",
          note: "The canonical v1 command is also `opencode providers login`.",
          conf: "firsthand",
          doc: `${OC}/providers`,
        },
        {
          cmd: "opencode auth list",
          desc: "List configured providers and credentials.",
          note: "Alias: `opencode providers list`.",
          conf: "firsthand",
          doc: `${OC}/providers`,
        },
        {
          cmd: "opencode auth logout",
          desc: "Interactively remove credentials for a configured provider.",
          note: "Alias: `opencode providers logout`; choose the provider interactively.",
          conf: "firsthand",
          doc: `${OC}/providers`,
        },
      ],
    },
    {
      id: "session",
      label: "Start & resume sessions",
      blurb:
        "Launch the TUI in a project, choose its model or agent, and pick up where you left off.",
      entries: [
        {
          cmd: "opencode",
          desc: "Start the TUI in the current directory.",
          conf: "firsthand",
          doc: `${OC}/cli`,
        },
        {
          cmd: "opencode /path/to/project",
          desc: "Start the TUI for a specific project directory.",
          conf: "firsthand",
          doc: `${OC}/tui`,
        },
        {
          cmd: "opencode --continue",
          desc: "Continue the last session.",
          note: "Short form: `-c`.",
          conf: "firsthand",
          doc: `${OC}/cli`,
        },
        {
          cmd: "opencode --session <id>",
          desc: "Continue a specific session by ID.",
          note: "Short form: `-s`; combine with `--fork` to branch it.",
          conf: "firsthand",
          doc: `${OC}/cli`,
        },
        {
          cmd: "opencode --fork --session <id>",
          desc: "Fork a session before continuing it.",
          conf: "firsthand",
          doc: `${OC}/cli`,
        },
        {
          cmd: "opencode session list",
          desc: "List saved sessions.",
          conf: "firsthand",
        },
        {
          cmd: "opencode session delete <sessionID>",
          desc: "Delete a saved session.",
          conf: "firsthand",
        },
        {
          cmd: "opencode export [sessionID]",
          desc: "Export session data as JSON.",
          conf: "firsthand",
        },
        {
          cmd: "opencode import <file>",
          desc: "Import session data from a JSON file or URL.",
          conf: "firsthand",
        },
      ],
    },
    {
      id: "tui",
      label: "TUI commands & controls",
      blurb:
        "The slash commands and input conventions that make the terminal interface fast.",
      entries: [
        {
          cmd: "/help",
          desc: "Show available TUI commands and keybinds.",
          conf: "documented",
          doc: `${OC}/tui`,
        },
        {
          cmd: "/connect",
          desc: "Add or authenticate an AI provider from the TUI.",
          conf: "documented",
          doc: `${OC}/tui`,
        },
        {
          cmd: "/models",
          desc: "Browse available models.",
          conf: "documented",
          doc: `${OC}/tui`,
        },
        {
          cmd: "/new",
          desc: "Start a new session.",
          conf: "documented",
          doc: `${OC}/tui`,
        },
        {
          cmd: "/sessions",
          desc: "Open the session picker.",
          conf: "documented",
          doc: `${OC}/tui`,
        },
        {
          cmd: "/compact",
          desc: "Compact the current session.",
          note: "Alias: `/summarize`; keybind: `ctrl+x c`.",
          conf: "documented",
          doc: `${OC}/tui`,
        },
        {
          cmd: "/undo",
          desc: "Undo the last message or change.",
          conf: "documented",
          doc: `${OC}/tui`,
        },
        {
          cmd: "/redo",
          desc: "Redo an undone message or change.",
          conf: "documented",
          doc: `${OC}/tui`,
        },
        {
          cmd: "/export",
          desc: "Export the current conversation to Markdown and open it in the configured editor.",
          conf: "documented",
          doc: `${OC}/tui`,
        },
        {
          cmd: "@path/to/file",
          desc: "Fuzzy-search for a file and attach its contents to the prompt.",
          conf: "documented",
          doc: `${OC}/tui`,
        },
        {
          cmd: "!command",
          desc: "Run a shell command and add its output to the conversation.",
          example: "!git status --short",
          conf: "documented",
          doc: `${OC}/tui`,
        },
        {
          cmd: "Tab",
          desc: "Switch between the built-in `build` and `plan` agents.",
          note: "`@general` invokes the built-in general subagent in a prompt.",
          conf: "documented",
          doc: `${OC}/agents`,
        },
      ],
    },
    {
      id: "models",
      label: "Agents & models",
      blurb:
        "Choose the worker and the provider/model pair that should do the work.",
      entries: [
        {
          cmd: "opencode --model <provider/model>",
          desc: "Start the TUI with a fully qualified provider/model ID.",
          example: "opencode --model anthropic/claude-sonnet-4-5",
          conf: "firsthand",
          doc: `${OC}/cli`,
        },
        {
          cmd: "opencode --agent <name>",
          desc: "Start with a named agent.",
          conf: "firsthand",
          doc: `${OC}/agents`,
        },
        {
          cmd: "opencode models [provider]",
          desc: "List available models, optionally filtered by provider.",
          conf: "firsthand",
          doc: `${OC}/models`,
        },
        {
          cmd: "opencode models --refresh",
          desc: "Refresh the model cache from models.dev.",
          note: "Use `--verbose` to include metadata such as costs.",
          conf: "firsthand",
        },
        {
          cmd: "opencode agent list",
          desc: "List available built-in and custom agents.",
          conf: "firsthand",
          doc: `${OC}/agents`,
        },
        {
          cmd: "opencode agent create",
          desc: "Interactively create a custom agent.",
          conf: "firsthand",
          doc: `${OC}/agents`,
        },
        {
          cmd: ".opencode/agents/<name>.md",
          desc: "Project agent definition with YAML frontmatter and instructions.",
          note: "Global agents live under `~/.config/opencode/agents/`.",
          conf: "documented",
          doc: `${OC}/agents`,
        },
        {
          cmd: "opencode run --variant <name> \"<prompt>\"",
          desc: "Select a provider-specific model variant, such as a reasoning effort.",
          conf: "firsthand",
          doc: `${OC}/cli`,
        },
      ],
    },
    {
      id: "permissions",
      label: "Permissions & safety",
      blurb:
        "Decide which tools run automatically, ask first, or remain blocked.",
      entries: [
        {
          cmd: "opencode --auto",
          desc: "Auto-approve requests that are not explicitly denied.",
          note: "Current v1 docs feature; not advertised by installed v1.4.7. Explicit `deny` rules still win; `opencode run --auto` works too.",
          conf: "documented",
          doc: `${OC}/permissions`,
        },
        {
          cmd: 'opencode run --dangerously-skip-permissions "<prompt>"',
          desc: "Auto-approve permissions that are not explicitly denied in a headless run.",
          note: "Dangerous: use only in a deliberately isolated environment.",
          conf: "firsthand",
          doc: `${OC}/permissions`,
        },
        {
          cmd: '"permission": { "*": "ask", "bash": "allow", "edit": "deny" }',
          desc: "Set v1 global permission defaults in `opencode.json`.",
          note: "Actions are `allow`, `ask`, or `deny`.",
          conf: "documented",
          doc: `${OC}/permissions`,
        },
        {
          cmd: '"permission": { "bash": { "*": "ask", "git *": "allow" } }',
          desc: "Use command patterns for granular bash permissions.",
          conf: "documented",
          doc: `${OC}/permissions`,
        },
        {
          cmd: '"permission": { "skill": { "internal-*": "deny" } }',
          desc: "Control which skills an agent may load by wildcard.",
          conf: "documented",
          doc: `${OC}/skills`,
        },
        {
          cmd: '"agent": { "plan": { "permission": { "edit": "deny" } } }',
          desc: "Override permissions for one agent.",
          note: "Agent rules take precedence over global rules.",
          conf: "documented",
          doc: `${OC}/agents`,
        },
      ],
    },
    {
      id: "config",
      label: "Config & project rules",
      blurb:
        "Know which JSON file wins and where to put durable project instructions.",
      entries: [
        {
          cmd: "opencode.json",
          desc: "Project config, safe to check into the repository.",
          note: "JSONC is also supported; add `$schema`: `https://opencode.ai/config.json`.",
          conf: "documented",
          doc: `${OC}/config`,
        },
        {
          cmd: "~/.config/opencode/opencode.json",
          desc: "Global user config for providers, models, permissions, and runtime defaults.",
          conf: "documented",
          doc: `${OC}/config`,
        },
        {
          cmd: "OPENCODE_CONFIG=/path/config.json",
          desc: "Load a custom config path.",
          conf: "documented",
          doc: `${OC}/config`,
        },
        {
          cmd: "OPENCODE_CONFIG_CONTENT={...}",
          desc: "Apply inline config at runtime.",
          conf: "documented",
          doc: `${OC}/config`,
        },
        {
          cmd: "opencode debug config",
          desc: "Print the resolved configuration after merging sources.",
          conf: "firsthand",
          doc: `${OC}/config`,
        },
        {
          cmd: "opencode debug paths",
          desc: "Show OpenCode data, config, cache, and state paths.",
          conf: "firsthand",
        },
        {
          cmd: "AGENTS.md",
          desc: "Project instructions OpenCode can use as durable context.",
          note: "OpenCode also supports `CLAUDE.md` and configurable instruction files.",
          conf: "documented",
          doc: `${OC}/rules`,
        },
        {
          cmd: "tui.json",
          desc: "Separate TUI settings such as theme, cursor, mouse, and attention notifications.",
          conf: "documented",
          doc: `${OC}/config`,
        },
      ],
    },
    {
      id: "mcp",
      label: "MCP servers",
      blurb:
        "Connect external tools and context through Model Context Protocol servers.",
      entries: [
        {
          cmd: "opencode mcp add",
          desc: "Interactively add a local or remote MCP server.",
          conf: "firsthand",
          doc: `${OC}/mcp-servers`,
        },
        {
          cmd: "opencode mcp list",
          desc: "List configured MCP servers and their status.",
          note: "Alias: `opencode mcp ls`.",
          conf: "firsthand",
          doc: `${OC}/mcp-servers`,
        },
        {
          cmd: "opencode mcp auth [name]",
          desc: "Authenticate an OAuth-enabled MCP server.",
          conf: "firsthand",
          doc: `${OC}/mcp-servers`,
        },
        {
          cmd: "opencode mcp logout [name]",
          desc: "Remove OAuth credentials for an MCP server.",
          conf: "firsthand",
          doc: `${OC}/mcp-servers`,
        },
        {
          cmd: "opencode mcp debug <name>",
          desc: "Debug an MCP OAuth connection.",
          conf: "firsthand",
          doc: `${OC}/mcp-servers`,
        },
        {
          cmd: '"mcp": { "my-server": { "type": "local", "command": ["npx", "-y", "example"] } }',
          desc: "Configure a local stdio server in v1 `opencode.json`.",
          conf: "documented",
          doc: `${OC}/mcp-servers`,
        },
        {
          cmd: '"mcp": { "my-server": { "type": "remote", "url": "https://example/mcp" } }',
          desc: "Configure a remote HTTP MCP server.",
          note: "Set `enabled: false` to keep a server configured but off.",
          conf: "documented",
          doc: `${OC}/mcp-servers`,
        },
      ],
    },
    {
      id: "extend",
      label: "Plugins & skills",
      blurb:
        "Extend OpenCode in-process and give agents reusable, on-demand instructions.",
      entries: [
        {
          cmd: "opencode plugin <npm-module>",
          desc: "Install a plugin and update config.",
          note: "Use `--global` for global config or `--force` to replace an installed version.",
          conf: "firsthand",
          doc: `${OC}/plugins`,
        },
        {
          cmd: '"plugin": ["my-plugin"]',
          desc: "Load a plugin from the v1 config.",
          conf: "documented",
          doc: `${OC}/plugins`,
        },
        {
          cmd: ".opencode/skills/<name>/SKILL.md",
          desc: "Define a project skill with required `name` and `description` frontmatter.",
          note: "Claude-compatible `.claude/skills/` and agent-compatible `.agents/skills/` paths are also discovered.",
          conf: "documented",
          doc: `${OC}/skills`,
        },
        {
          cmd: "opencode debug skill",
          desc: "List all skills OpenCode can discover.",
          conf: "firsthand",
          doc: `${OC}/skills`,
        },
        {
          cmd: '"permission": { "skill": { "*": "allow", "internal-*": "deny" } }',
          desc: "Allow, prompt for, or hide skills using wildcard permissions.",
          conf: "documented",
          doc: `${OC}/skills`,
        },
        {
          cmd: '"agent": { "plan": { "tools": { "skill": false } } }',
          desc: "Disable the skill tool for an agent.",
          note: "The v1 docs describe this alongside the permission system; use the agent override when only one agent should be restricted.",
          conf: "documented",
          doc: `${OC}/skills`,
        },
        {
          cmd: "opencode --pure",
          desc: "Run without external plugins.",
          conf: "firsthand",
          doc: `${OC}/plugins`,
        },
      ],
    },
    {
      id: "headless",
      label: "Headless, server & web",
      blurb:
        "Use OpenCode in scripts, CI, remote clients, and browser-facing workflows.",
      entries: [
        {
          cmd: 'opencode run "<prompt>"',
          desc: "Run one prompt without opening the TUI.",
          conf: "firsthand",
          doc: `${OC}/cli`,
        },
        {
          cmd: 'opencode run --format json "<prompt>"',
          desc: "Emit raw JSON events for programmatic consumers.",
          note: "Default output format is `default` (formatted).",
          conf: "firsthand",
          doc: `${OC}/cli`,
        },
        {
          cmd: 'opencode run --file src/app.ts "Review this file"',
          desc: "Attach one or more files to a run.",
          note: "Short form: `-f`; repeat the flag for multiple files.",
          conf: "firsthand",
          doc: `${OC}/cli`,
        },
        {
          cmd: 'opencode run --attach http://localhost:4096 "<prompt>"',
          desc: "Send a run to an already-running OpenCode server.",
          conf: "firsthand",
          doc: `${OC}/cli`,
        },
        {
          cmd: "opencode serve --port 4096",
          desc: "Start a headless OpenCode HTTP server.",
          note: "Default hostname is `127.0.0.1`; use `--hostname` to change it.",
          conf: "firsthand",
          doc: `${OC}/server`,
        },
        {
          cmd: "opencode web --port 4096",
          desc: "Start the server and open the web interface.",
          conf: "firsthand",
          doc: `${OC}/server`,
        },
        {
          cmd: "opencode attach http://localhost:4096",
          desc: "Attach the TUI to a running server.",
          conf: "firsthand",
          doc: `${OC}/server`,
        },
        {
          cmd: '"server": { "port": 4096, "hostname": "0.0.0.0", "cors": ["http://localhost:5173"] }',
          desc: "Configure server listening and browser CORS in `opencode.json`.",
          note: "mDNS is available with `mdns: true` and optional `mdnsDomain`.",
          conf: "documented",
          doc: `${OC}/server`,
        },
        {
          cmd: "opencode acp",
          desc: "Start an Agent Client Protocol server for compatible clients.",
          conf: "firsthand",
          doc: `${OC}/acp`,
        },
      ],
    },
  ],
};
