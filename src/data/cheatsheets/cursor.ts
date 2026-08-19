/**
 * Cursor cheatsheet facts - the single source of truth for the Cursor
 * cheatsheet page.
 *
 * Verification, 2026-08-18:
 *   - CLI flags and subcommands: read first-hand from the installed
 *     `cursor-agent --help` and subcommand help, v2026.08.11-e8db854.
 *   - Editor features and CLI behavior: official Cursor documentation.
 *
 * Keep editor commands (Command Palette, chat commands, shortcuts, and
 * project files) visibly separate from `cursor-agent` terminal commands.
 */

import type { Cheatsheet } from "./claude-code";

const DOCS = "https://cursor.com/docs";
const CLI = `${DOCS}/cli`;

export const cursorCheatsheet: Cheatsheet = {
  tool: "cursor",
  label: "Cursor",
  version: "2026.08.11-e8db854",
  checkedAt: "2026-08-18",
  sources: [
    "Installed binary: cursor-agent --help (v2026.08.11-e8db854, first-hand)",
    "GitHub repository: https://github.com/cursor/cursor",
    `${CLI}/overview`,
    `${CLI}/reference/parameters`,
    `${CLI}/using`,
    `${DOCS}/context/rules-for-ai`,
    `${DOCS}/agent`,
    `${DOCS}/advanced/keyboard-shortcuts`,
    `${DOCS}/bugbot`,
  ],
  intro:
    "Cursor has two command surfaces: the Cursor editor (Agent, Ask, and Custom modes, shortcuts, and project context) and the separate `agent`/`cursor-agent` terminal CLI. Rows marked CLI were checked against the installed binary; editor rows come from the official Cursor docs.",

  categories: [
    {
      id: "cli-install-session",
      label: "CLI: install & sessions",
      blurb:
        "Start, authenticate, automate, and return to terminal agent conversations.",
      entries: [
        {
          cmd: "curl https://cursor.com/install -fsS | bash",
          desc: "Install Cursor CLI on macOS, Linux, or Windows WSL.",
          conf: "documented",
          doc: `${CLI}/installation`,
          note: "Verify with `cursor-agent --version`; the CLI is currently beta.",
        },
        {
          cmd: "cursor-agent",
          desc: "Start an interactive terminal agent session in the current workspace.",
          conf: "firsthand",
        },
        {
          cmd: 'cursor-agent "<prompt>"',
          desc: "Start a session with an initial prompt.",
          conf: "firsthand",
          example: 'cursor-agent "explain this repository"',
        },
        {
          cmd: "cursor-agent login",
          desc: "Authenticate with Cursor using the browser flow.",
          conf: "firsthand",
          doc: `${CLI}/reference/authentication`,
        },
        {
          cmd: "cursor-agent status",
          desc: "Show authentication status, account, and endpoint configuration.",
          conf: "firsthand",
          doc: `${CLI}/reference/authentication`,
        },
        {
          cmd: "cursor-agent logout",
          desc: "Sign out and clear stored authentication.",
          conf: "firsthand",
        },
        {
          cmd: "cursor-agent ls",
          desc: "List previous chats for resuming.",
          conf: "firsthand",
          doc: `${CLI}/overview`,
        },
        {
          cmd: "cursor-agent resume",
          desc: "Resume the latest chat session.",
          conf: "firsthand",
          doc: `${CLI}/overview`,
        },
        {
          cmd: "cursor-agent --resume <chat-id>",
          desc: "Resume a specific chat by ID; omit the ID to select one.",
          conf: "firsthand",
        },
        {
          cmd: "cursor-agent --continue",
          desc: "Continue the previous session.",
          conf: "firsthand",
        },
        {
          cmd: "cursor-agent update",
          desc: "Update Cursor Agent to the latest version.",
          conf: "firsthand",
          note: "Alias: `cursor-agent upgrade`.",
        },
        {
          cmd: "cursor-agent about --format json",
          desc: "Display version, system, and account information.",
          conf: "firsthand",
        },
      ],
    },
    {
      id: "cli-modes-models",
      label: "CLI: modes & models",
      blurb:
        "Choose planning behavior, model selection, and machine-readable output.",
      entries: [
        {
          cmd: "cursor-agent --mode plan",
          desc: "Start read-only planning mode; analyze and propose without edits.",
          conf: "firsthand",
          note: "Alias: `--plan`.",
        },
        {
          cmd: "cursor-agent --mode ask",
          desc: "Start read-only Q&A mode for explanations and questions.",
          conf: "firsthand",
        },
        {
          cmd: "cursor-agent --model <model>",
          desc: "Select a model for the session.",
          conf: "firsthand",
          example: 'cursor-agent --model gpt-5 "review this change"',
        },
        {
          cmd: "cursor-agent --list-models",
          desc: "List available models and exit.",
          conf: "firsthand",
          note: "The `cursor-agent models` command also lists models for the account.",
        },
        {
          cmd: "cursor-agent -p --output-format <text|json|stream-json>",
          desc: "Run non-interactively and select human-readable or structured output.",
          conf: "firsthand",
          doc: `${CLI}/reference/output-format`,
          note: "`--output-format` requires print mode; `stream-json` is useful for event processing.",
        },
        {
          cmd: 'CURSOR_API_KEY=<key> cursor-agent -p "<prompt>"',
          desc: "Authenticate a script or CI job with an API key.",
          conf: "documented",
          doc: `${CLI}/reference/authentication`,
          note: "Prefer the environment variable over putting a key in shell history.",
        },
      ],
    },
    {
      id: "cli-permissions-workspaces",
      label: "CLI: permissions & workspaces",
      blurb:
        "Control what the terminal agent can touch before granting it autonomy.",
      entries: [
        {
          cmd: "cursor-agent --trust",
          desc: "Trust the current workspace without prompting.",
          conf: "firsthand",
          note: "Only use in a workspace you have reviewed.",
        },
        {
          cmd: "cursor-agent --force",
          desc: "Allow commands unless explicitly denied.",
          conf: "firsthand",
          note: "Alias: `--yolo`; use with care. In print mode, write access requires force.",
        },
        {
          cmd: "cursor-agent --auto-review",
          desc: "Use Smart Auto: automatically run safe tool calls and prompt for the rest.",
          conf: "firsthand",
        },
        {
          cmd: "cursor-agent --sandbox <enabled|disabled>",
          desc: "Explicitly enable or disable CLI sandbox mode.",
          conf: "firsthand",
          note: "Overrides configuration.",
        },
        {
          cmd: "cursor-agent --workspace <path-or-name>",
          desc: "Choose a workspace directory or saved workspace.",
          conf: "firsthand",
        },
        {
          cmd: "cursor-agent --add-dir <path>",
          desc: "Add another workspace root; repeat for multiple roots.",
          conf: "firsthand",
        },
        {
          cmd: "cursor-agent -w [name]",
          desc: "Start in an isolated git worktree.",
          conf: "firsthand",
          note: "Use `--worktree-base <branch>` to choose its base.",
        },
        {
          cmd: "~/.cursor/cli-config.json",
          desc: "Global CLI permission configuration.",
          conf: "documented",
          doc: `${CLI}/reference/permissions`,
          note: "Project-specific permissions live in `<project>/.cursor/cli.json`.",
        },
        {
          cmd: "Shell(git) / Read(src/**) / Write(src/**)",
          desc: "Permission tokens for shell, file reads, and file writes.",
          conf: "documented",
          doc: `${CLI}/reference/permissions`,
          note: "Put tokens in `permissions.allow` or `permissions.deny`; deny rules take precedence.",
        },
      ],
    },
    {
      id: "rules",
      label: "Editor & CLI: rules",
      blurb: "Give both Cursor surfaces durable, scoped project instructions.",
      entries: [
        {
          cmd: ".cursor/rules/<name>.mdc",
          desc: "Create a version-controlled project rule with MDC frontmatter.",
          conf: "documented",
          doc: `${DOCS}/context/rules-for-ai`,
          note: "Use `description`, `globs`, and `alwaysApply` to control scope.",
        },
        {
          cmd: "AGENTS.md",
          desc: "Use a plain root-level instruction file for simple project guidance.",
          conf: "documented",
          doc: `${CLI}/using`,
          note: "The CLI also reads root-level `CLAUDE.md`; project rules are the richer, scoped system.",
        },
        {
          cmd: ".cursorrules",
          desc: "Legacy project instruction file.",
          conf: "documented",
          doc: `${DOCS}/context/rules-for-ai`,
          note: "Still supported, but deprecated; use `.cursor/rules`.",
        },
        {
          cmd: "New Cursor Rule",
          desc: "Editor Command Palette action to create a project rule.",
          conf: "documented",
          doc: `${DOCS}/context/rules-for-ai`,
        },
        {
          cmd: "/create-rule",
          desc: "Editor chat command that creates a reusable project rule.",
          conf: "documented",
          doc: `${DOCS}/context/rules-for-ai`,
        },
        {
          cmd: "cursor-agent generate-rule",
          desc: "Generate a Cursor rule with interactive CLI prompts.",
          conf: "firsthand",
          note: "Alias: `cursor-agent rule`.",
        },
      ],
    },
    {
      id: "mcp",
      label: "Editor & CLI: MCP",
      blurb:
        "Extend the agent with Model Context Protocol servers, then inspect and approve them deliberately.",
      entries: [
        {
          cmd: ".cursor/mcp.json",
          desc: "Project MCP configuration detected by the IDE and CLI.",
          conf: "documented",
          doc: `${CLI}/using`,
          note: "The CLI also reads `~/.cursor/mcp.json`.",
        },
        {
          cmd: "cursor-agent mcp list",
          desc: "List configured MCP servers and their status.",
          conf: "firsthand",
        },
        {
          cmd: "cursor-agent mcp list-tools <server>",
          desc: "List a configured server’s tools and argument names.",
          conf: "firsthand",
        },
        {
          cmd: "cursor-agent mcp login <server>",
          desc: "Authenticate with a configured MCP server.",
          conf: "firsthand",
        },
        {
          cmd: "cursor-agent mcp enable|disable <server>",
          desc: "Add or remove a server from the local approved list.",
          conf: "firsthand",
          note: "Disabling prevents loading and approval prompts.",
        },
        {
          cmd: "cursor-agent --approve-mcps",
          desc: "Automatically approve all MCP servers for this run.",
          conf: "firsthand",
          note: "Review server trust before using this shortcut.",
        },
      ],
    },
    {
      id: "cloud-bugbot",
      label: "Editor: background agents & Bugbot",
      blurb:
        "Delegate work to Cursor’s hosted agents and use automated pull-request review.",
      entries: [
        {
          cmd: "Ctrl+E",
          desc: "Open the Background Agent control panel.",
          conf: "documented",
          doc: `${DOCS}/advanced/keyboard-shortcuts`,
        },
        {
          cmd: "Cloud Agents (formerly Background Agents)",
          desc: "Delegate a task to an isolated cloud VM that can build, test, and return changes for review.",
          conf: "documented",
          doc: `${DOCS}/cloud-agent`,
          note: "Start from Cursor Desktop, cursor.com/agents, integrations, or the API; source-control connection is required.",
        },
        {
          cmd: "cursor-agent worker start",
          desc: "Start a private cloud worker that connects Cursor to an environment you control.",
          conf: "firsthand",
          note: "Use `cursor-agent worker --help` for pool, token, labels, and opt-in computer-use options.",
        },
        {
          cmd: ".cursor/BUGBOT.md",
          desc: "Project-specific instructions automatically included in Bugbot reviews.",
          conf: "documented",
          doc: `${DOCS}/bugbot`,
          note: "Nested files can scope guidance to changed-file directories.",
        },
        {
          cmd: "cursor review",
          desc: "Comment on a pull request to manually trigger a Bugbot review.",
          conf: "documented",
          doc: `${DOCS}/bugbot`,
          note: "Alias: `bugbot run`.",
        },
        {
          cmd: "cursor review verbose=true",
          desc: "Request verbose Bugbot logs and a request ID for troubleshooting.",
          conf: "documented",
          doc: `${DOCS}/bugbot`,
        },
      ],
    },
    {
      id: "editor-shortcuts",
      label: "Editor: useful shortcuts",
      blurb:
        "Fast navigation and context control in the Cursor editor; keybindings can be remapped.",
      entries: [
        {
          cmd: "Ctrl+Shift+P",
          desc: "Open the Command Palette.",
          conf: "documented",
          doc: `${DOCS}/advanced/keyboard-shortcuts`,
        },
        {
          cmd: "Ctrl+I / Ctrl+L",
          desc: "Toggle the AI side panel.",
          conf: "documented",
          doc: `${DOCS}/advanced/keyboard-shortcuts`,
        },
        {
          cmd: "Ctrl+.",
          desc: "Open the mode menu.",
          conf: "documented",
          doc: `${DOCS}/agent`,
        },
        {
          cmd: "Ctrl+/",
          desc: "Cycle through AI models.",
          conf: "documented",
          doc: `${DOCS}/advanced/keyboard-shortcuts`,
        },
        {
          cmd: "Ctrl+K",
          desc: "Open Inline Edit; in the terminal, open the terminal prompt bar.",
          conf: "documented",
          doc: `${DOCS}/advanced/keyboard-shortcuts`,
          note: "The active editor surface determines the action.",
        },
        {
          cmd: "@ / # / ! / /",
          desc: "Add symbols/files, invoke shell mode, or open shortcut commands in chat.",
          conf: "documented",
          doc: `${DOCS}/advanced/keyboard-shortcuts`,
        },
        {
          cmd: "Tab",
          desc: "Accept a Cursor Tab suggestion.",
          conf: "documented",
          doc: `${DOCS}/advanced/keyboard-shortcuts`,
        },
        {
          cmd: "Ctrl+R",
          desc: "Review generated changes in the CLI; in the editor, keybindings can vary by context.",
          conf: "documented",
          doc: `${CLI}/using`,
          note: "Use the Command Palette to inspect or remap the current binding.",
        },
      ],
    },
  ],
};
