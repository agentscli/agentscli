/**
 * Claude Code cheatsheet facts - the single source of truth for
 * `components/Cheatsheet.astro` (static render + search enhancement) and the
 * `foundations/cheatsheets/claude-code` page.
 *
 * FACT-BOUND. Verification, 2026-08-18:
 *   - CLI flags: read first-hand from the installed binary (`claude --help`,
 *     v2.1.234). Entries marked conf 'firsthand' exist in that help output.
 *   - Slash commands and subcommand behavior: official docs at
 *     code.claude.com/docs (commands + cli-reference pages), conf 'documented'.
 *   - Config/skills/context behavior: the site's own verified
 *     `tool-instructions/claude-code/*.mdx` chapters.
 *
 * Gotchas encoded on purpose (the popular community cheat sheets get these wrong):
 *   - `--max-turns` is missing from `claude --help` in 2.1.x but is real and
 *     documented (print mode only) - marked 'documented', not 'firsthand'.
 *   - Flags like `--production-mode`, `--cache-results`, `--security-enabled`,
 *     `--audit-log`, `--max-context`, `--compact-mode` that circulate in
 *     community sheets do not exist; none are listed here.
 *   - npm install is a *supported* path (installs the same native binary), not
 *     a deprecated fallback.
 *
 * Re-verify on the monthly WIDGETS.md pass: re-run `claude --help`, diff the
 * flag list, bump `checkedAt`, and update `version`.
 */

export type CheatConf = 'firsthand' | 'documented';

export interface CheatEntry {
  /** The command as typed. Slash commands keep their leading `/`. */
  cmd: string;
  /** One line: what it does, in the reader's terms. */
  desc: string;
  /** A realistic invocation, copyable. */
  example?: string;
  /** Gotcha, alias, or scope limitation worth knowing before using it. */
  note?: string;
  conf: CheatConf;
  /** Official docs URL for this command, when one exists. */
  doc?: string;
  /** Site chapter that covers the concept in depth. */
  site?: string;
}

export interface CheatCategory {
  id: string;
  label: string;
  /** One sentence under the heading: when you land in this section. */
  blurb: string;
  entries: CheatEntry[];
}

export interface Cheatsheet {
  tool: string;
  label: string;
  version: string;
  checkedAt: string;
  /** Where the facts came from; first is linked in the page meta line. */
  sources: string[];
  intro: string;
  categories: CheatCategory[];
}

const CC = 'https://code.claude.com/docs/en';

export const claudeCodeCheatsheet: Cheatsheet = {
  tool: 'claude-code',
  label: 'Claude Code',
  version: '2.1.234',
  checkedAt: '2026-08-18',
  sources: [
    'Installed binary: claude --help (v2.1.234, first-hand)',
    `${CC}/cli-reference`,
    `${CC}/commands`,
    `${CC}/setup`,
  ],
  intro: 'Every command below was read out of the installed binary or the official docs - community cheat sheets circulating flags like --production-mode or --cache-results are listing commands that do not exist.',

  categories: [
    {
      id: 'install',
      label: 'Install & keep current',
      blurb: 'Getting it on the machine and keeping it there.',
      entries: [
        {
          cmd: 'curl -fsSL https://claude.ai/install.sh | bash',
          desc: 'Native install for macOS, Linux, and WSL (the recommended path).',
          note: 'Windows PowerShell: `irm https://claude.ai/install.ps1 | iex`',
          conf: 'documented',
          doc: `${CC}/setup`,
        },
        {
          cmd: 'brew install --cask claude-code',
          desc: 'Install via Homebrew on macOS.',
          note: 'Windows: `winget install Anthropic.ClaudeCode`',
          conf: 'documented',
          doc: `${CC}/setup`,
        },
        {
          cmd: 'npm install -g @anthropic-ai/claude-code',
          desc: 'Install via npm - a supported path, installs the same native binary.',
          note: 'Do not `sudo`; upgrade with `@latest`, not `npm update -g`.',
          conf: 'documented',
          doc: `${CC}/setup`,
        },
        {
          cmd: 'claude update',
          desc: 'Check for updates and install if available.',
          note: 'Alias: `claude upgrade`',
          conf: 'firsthand',
        },
        {
          cmd: 'claude install <stable|latest|version>',
          desc: 'Install or pin a specific native build, e.g. `claude install 2.1.118`.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude doctor',
          desc: 'Check installation health without a trust prompt.',
          note: 'For a checkup that can also fix issues, run `/doctor` inside a session.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --version',
          desc: 'Print the installed version.',
          conf: 'firsthand',
        },
      ],
    },

    {
      id: 'auth',
      label: 'Sign in',
      blurb: 'Accounts, tokens, and enterprise auth.',
      entries: [
        {
          cmd: 'claude auth login',
          desc: 'Sign in to your Anthropic account (opens a browser flow).',
          conf: 'firsthand',
        },
        {
          cmd: 'claude auth status',
          desc: 'Show authentication status.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude auth logout',
          desc: 'Sign out.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude setup-token',
          desc: 'Set up a long-lived auth token (requires a Claude subscription).',
          conf: 'firsthand',
        },
        {
          cmd: 'claude gateway',
          desc: 'Run the enterprise auth/telemetry gateway.',
          conf: 'firsthand',
        },
      ],
    },

    {
      id: 'session',
      label: 'Start & steer a session',
      blurb: 'Interactive use: launching with the right shape of workspace.',
      entries: [
        {
          cmd: 'claude',
          desc: 'Start an interactive session in the current directory.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude "summarize this project"',
          desc: 'Start with an initial prompt.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude -n <name>',
          desc: 'Name the session at startup (shows in the prompt bar, /resume picker, terminal title).',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --add-dir ../apps ../lib',
          desc: 'Grant tool access to additional working directories.',
          conf: 'firsthand',
          site: '/foundations/permissions/',
        },
        {
          cmd: 'claude -w <name>',
          desc: 'Create a git worktree for the session (add --tmux to open it in tmux/iTerm2 panes).',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --ide',
          desc: 'Auto-connect to an IDE on startup when exactly one is available.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --bg',
          desc: 'Start the session as a background agent and return immediately; manage with `claude agents`.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --safe-mode',
          desc: 'Start with all customizations (CLAUDE.md, skills, plugins, hooks, MCP) disabled - for troubleshooting a broken config.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --bare',
          desc: 'Minimal mode: skips hooks, plugins, auto-memory, CLAUDE.md discovery; auth via API key only.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude import <source>',
          desc: 'Import config from another AI coding agent into Claude Code.',
          conf: 'firsthand',
        },
      ],
    },

    {
      id: 'resume',
      label: 'Get back to a session',
      blurb: 'Continuing, resuming, forking, and rewinding.',
      entries: [
        {
          cmd: 'claude -c',
          desc: 'Continue the most recent conversation in this directory.',
          note: 'Long form: `claude --continue`',
          conf: 'firsthand',
        },
        {
          cmd: 'claude -r <session>',
          desc: 'Resume by session ID or name; opens the picker with no argument.',
          note: 'Long form: `claude --resume`',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --fork-session',
          desc: 'When resuming, create a new session ID instead of reusing the original.',
          note: 'Use with `--resume` or `--continue`.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --from-pr 123',
          desc: 'Resume the session linked to a pull request (by number or URL).',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --session-id <uuid>',
          desc: 'Start the conversation with a specific session ID.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --teleport',
          desc: 'Pull a Claude Code on the web session into this terminal.',
          conf: 'firsthand',
        },
        {
          cmd: '/rename <name>',
          desc: 'Rename the current session; auto-generates a name with no argument.',
          note: 'Also works in `-p` mode from v2.1.205.',
          conf: 'documented',
          doc: `${CC}/sessions`,
        },
        {
          cmd: '/rewind',
          desc: 'Rewind conversation and/or code to a previous checkpoint - an undo, not a summary.',
          note: 'Aliases: `/checkpoint`, `/undo`. Also double-tap `Esc`.',
          conf: 'documented',
          doc: `${CC}/checkpointing`,
          site: '/foundations/context-management/',
        },
        {
          cmd: '/recap',
          desc: 'One-line summary of the current session on demand.',
          conf: 'documented',
        },
      ],
    },

    {
      id: 'model',
      label: 'Model & effort',
      blurb: 'Picking the brain and the throttle for the run.',
      entries: [
        {
          cmd: 'claude --model <alias|name>',
          desc: 'Model for the session - an alias (`opus`, `sonnet`) or a full name (`claude-fable-5`).',
          conf: 'firsthand',
          site: '/foundations/model-selection/',
        },
        {
          cmd: 'claude --effort <level>',
          desc: 'Reasoning effort for the session: low, medium, high, xhigh, or max.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --fallback-model <list>',
          desc: 'Comma-separated fallback models when the default is overloaded (print mode only).',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --max-budget-usd <amount>',
          desc: 'Cap API spend for the run (print mode only).',
          conf: 'firsthand',
        },
        {
          cmd: '/model <model>',
          desc: 'Switch model mid-session.',
          conf: 'documented',
        },
        {
          cmd: '/effort <level|auto>',
          desc: 'Adjust reasoning effort mid-session.',
          conf: 'documented',
        },
        {
          cmd: '/fast <on|off>',
          desc: 'Toggle fast mode.',
          conf: 'documented',
        },
      ],
    },

    {
      id: 'permissions',
      label: 'Permissions & modes',
      blurb: 'What the agent may do without asking.',
      entries: [
        {
          cmd: 'claude --permission-mode <mode>',
          desc: 'Start in a mode: acceptEdits, auto, bypassPermissions, manual, dontAsk, or plan.',
          conf: 'firsthand',
          site: '/foundations/permissions/',
        },
        {
          cmd: 'claude --allowedTools "Bash(git log:*)" "Read"',
          desc: 'Allow specific tools (with optional patterns) without prompting.',
          note: 'Hyphen spelling `--allowed-tools` also works.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --disallowedTools "Bash(rm:*)" "Bash(sudo:*)"',
          desc: 'Deny specific tools for the run.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --tools "Bash,Edit,Read"',
          desc: 'Restrict the session to a subset of built-in tools; `""` disables all.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --dangerously-skip-permissions',
          desc: 'Bypass all permission checks - for sandboxes with no internet access, nothing else.',
          note: 'Safer pairing: `--allow-dangerously-skip-permissions` enables bypass as an option without defaulting to it.',
          conf: 'firsthand',
          site: '/foundations/permissions/',
        },
        {
          cmd: '/permissions',
          desc: 'Manage allow/ask/deny rules by scope in an interactive dialog.',
          conf: 'documented',
          doc: `${CC}/iam`,
        },
        {
          cmd: '/fewer-permission-prompts',
          desc: 'Scan transcripts for common read-only calls and add a safe allowlist to project settings.',
          conf: 'documented',
        },
        {
          cmd: '/sandbox',
          desc: 'Toggle OS-level sandbox mode (supported platforms only).',
          conf: 'documented',
          site: '/foundations/permissions/',
        },
        {
          cmd: 'Shift+Tab',
          desc: 'Cycle permission modes in-session: default → acceptEdits → plan (plus auto/bypass if enabled).',
          note: 'Key reference: the keyboard shortcuts chapter.',
          conf: 'documented',
          site: '/foundations/keyboard-shortcuts/',
        },
        {
          cmd: '/plan <description>',
          desc: 'Enter plan mode - read/search work, edits blocked, agent produces a plan.',
          conf: 'documented',
          site: '/foundations/plan-mode/',
        },
      ],
    },

    {
      id: 'context',
      label: 'Watch the window',
      blurb: 'Context is the resource; these are the gauges and the release valves.',
      entries: [
        {
          cmd: '/context [all]',
          desc: 'Visualize what occupies the window right now: system prompt, rules, tools, MCP schemas, conversation.',
          conf: 'documented',
          site: '/foundations/context-management/',
        },
        {
          cmd: '/usage',
          desc: 'Session cost, plan usage limits, and activity stats - including spend by skill, subagent, plugin, and MCP server.',
          note: 'Aliases: `/cost`, `/stats`.',
          conf: 'documented',
        },
        {
          cmd: '/compact <instructions>',
          desc: 'Summarize the conversation to free context, optionally steering what survives.',
          example: '/compact Keep the API changes and the failing test output',
          conf: 'documented',
          site: '/foundations/context-management/',
        },
        {
          cmd: '/clear <name>',
          desc: 'Start a fresh conversation; the previous session stays resumable.',
          note: 'Rename first (`/rename`) if you will want to find it later.',
          conf: 'documented',
        },
        {
          cmd: '/autocompact <auto|tokens>',
          desc: 'Tune auto-compaction: auto, or a window size from 100k to 1M tokens.',
          conf: 'documented',
        },
        {
          cmd: 'claude --autocompact <auto|tokens>',
          desc: 'Set the auto-compact window size at startup.',
          conf: 'firsthand',
        },
        {
          cmd: '/memory',
          desc: 'Edit CLAUDE.md files and manage auto memory.',
          conf: 'documented',
          site: '/foundations/rules/',
        },
        {
          cmd: '/init',
          desc: 'Initialize the project with a CLAUDE.md guide; interactive flow also walks through skills and hooks.',
          conf: 'documented',
          site: '/foundations/rules/',
        },
      ],
    },

    {
      id: 'slash',
      label: 'Everyday slash commands',
      blurb: 'The in-session set most people actually use. Roughly a hundred exist; these earn their keystrokes.',
      entries: [
        {
          cmd: '/help',
          desc: 'Show help and available commands.',
          conf: 'documented',
        },
        {
          cmd: '/exit',
          desc: 'Exit. In an attached background session, detaches and the session keeps running.',
          note: 'Alias: `/quit`',
          conf: 'documented',
        },
        {
          cmd: '/status',
          desc: 'Version, model, account, connectivity.',
          conf: 'documented',
        },
        {
          cmd: '/config <key=value>',
          desc: 'Open the settings panel, or set values directly.',
          conf: 'documented',
          site: '/foundations/configuration/',
        },
        {
          cmd: '/diff',
          desc: 'Interactive diff viewer: uncommitted changes and per-turn diffs.',
          conf: 'documented',
        },
        {
          cmd: '/export <filename>',
          desc: 'Export the current conversation.',
          conf: 'documented',
        },
        {
          cmd: '/tasks',
          desc: 'View and manage background work in the session, including finished subagents.',
          note: 'Alias: `/bashes`',
          conf: 'documented',
        },
        {
          cmd: '/mcp <reconnect|enable|disable>',
          desc: 'Manage MCP servers in-session.',
          conf: 'documented',
          site: '/foundations/mcp-servers/',
        },
        {
          cmd: '/skills',
          desc: 'List skills; filter by name, sort by token cost, cycle visibility.',
          conf: 'documented',
          site: '/foundations/skills/',
        },
        {
          cmd: '/hooks',
          desc: 'View hook configurations for tool events.',
          conf: 'documented',
          site: '/foundations/hooks/',
        },
        {
          cmd: '/agents',
          desc: 'Create or manage subagents - v2.1.198+ asks Claude to do it, or edit `.claude/agents/` directly.',
          conf: 'documented',
          site: '/foundations/subagents/',
        },
        {
          cmd: '/review <level> [--fix]',
          desc: 'Multi-agent review of the current diff, a PR number, branch, or path.',
          example: '/review medium --fix 1234',
          conf: 'documented',
          doc: `${CC}/code-review`,
        },
        {
          cmd: '/security-review',
          desc: 'Security review of your branch against origin default (needs an `origin` remote).',
          conf: 'documented',
        },
        {
          cmd: '/simplify <target>',
          desc: 'Bundled skill: four parallel agents review changed code for cleanup, then apply fixes.',
          conf: 'documented',
        },
        {
          cmd: '/debug <description>',
          desc: 'Bundled debugging skill.',
          conf: 'documented',
        },
        {
          cmd: '/deep-research <question>',
          desc: 'Bundled skill: multi-search research pass with citations.',
          conf: 'documented',
        },
        {
          cmd: '/loop <interval> <prompt>',
          desc: 'Run a prompt on a schedule in-session.',
          conf: 'documented',
        },
        {
          cmd: '/batch <instruction>',
          desc: 'Bundled skill: run one instruction across many files.',
          conf: 'documented',
        },
        {
          cmd: '/focus',
          desc: 'Toggle focus view: last prompt, tool-call summary, final response.',
          conf: 'documented',
        },
        {
          cmd: '/terminal-setup',
          desc: 'Configure the terminal for Shift+Enter (only shown in terminals that need it).',
          conf: 'documented',
        },
      ],
    },

    {
      id: 'headless',
      label: 'Script it (print mode)',
      blurb: 'Pipes, CI, and the SDK surface.',
      entries: [
        {
          cmd: 'claude -p "<prompt>"',
          desc: 'Print mode: run the agent loop to a final answer, print, exit - built for pipelines.',
          note: 'Long form: `claude --print`. Skips the workspace trust dialog - only use in trusted directories.',
          conf: 'firsthand',
          site: '/foundations/headless/',
        },
        {
          cmd: 'cat error.log | claude -p "find the root cause"',
          desc: 'Process piped content as input.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude -p "<query>" --output-format <format>',
          desc: 'Structured output: text (default), json (single result), or stream-json (realtime).',
          conf: 'firsthand',
        },
        {
          cmd: 'claude -p --input-format stream-json',
          desc: 'Streaming input for programmatic two-way sessions.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude -p --max-turns 3 "<query>"',
          desc: 'Limit agentic turns in print mode; exits with an error at the limit.',
          note: 'Real but hidden from `claude --help` in 2.1.x - verified in the official CLI reference.',
          conf: 'documented',
          doc: `${CC}/cli-reference`,
        },
        {
          cmd: 'claude -p --json-schema <schema> "<query>"',
          desc: 'Validate structured output against a JSON Schema.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude -p --include-partial-messages "<query>"',
          desc: 'Emit partial message chunks as they arrive (with stream-json output).',
          note: 'Companions: `--include-hook-events`, `--forward-subagent-text`.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude -p --no-session-persistence "<query>"',
          desc: 'Do not save the session to disk (print mode only).',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --append-system-prompt "<text>"',
          desc: 'Append to the default system prompt; or replace it with `--system-prompt`.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude ultrareview <target>',
          desc: 'Cloud-hosted multi-agent review of the current branch or a PR.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude-agent-sdk (npm / PyPI)',
          desc: 'Embeddable SDK for programmatic control; the GitHub Action is the supported CI path.',
          note: 'npm package was renamed from `@anthropic-ai/claude-code` in late 2025.',
          conf: 'documented',
          doc: 'https://docs.anthropic.com',
          site: '/foundations/headless/',
        },
      ],
    },

    {
      id: 'mcp',
      label: 'MCP servers',
      blurb: 'Mounting tools and data sources.',
      entries: [
        {
          cmd: 'claude mcp add --transport http <name> <url>',
          desc: 'Add an HTTP MCP server; `--header` for auth headers.',
          example: 'claude mcp add --transport http sentry https://mcp.sentry.dev/mcp',
          conf: 'firsthand',
          site: '/foundations/mcp-servers/',
        },
        {
          cmd: 'claude mcp add <name> -- <command>',
          desc: 'Add a stdio server; `-e KEY=val` passes environment variables.',
          example: 'claude mcp add my-server -e API_KEY=xxx -- npx my-mcp-server',
          conf: 'firsthand',
        },
        {
          cmd: 'claude mcp add-json <name> <json>',
          desc: 'Add a server from a JSON config string (stdio or SSE).',
          conf: 'firsthand',
        },
        {
          cmd: 'claude mcp list',
          desc: 'List configured servers with health checks (pending ones shown as unapproved).',
          conf: 'firsthand',
        },
        {
          cmd: 'claude mcp remove <name>',
          desc: 'Remove a server.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude mcp login <name>',
          desc: 'Authenticate with an MCP server (OAuth); `logout` clears credentials.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --mcp-config <file.json>',
          desc: 'Load MCP servers from JSON files for this run; `--strict-mcp-config` ignores all other config.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude mcp serve',
          desc: 'Run Claude Code itself as an MCP server.',
          conf: 'firsthand',
        },
      ],
    },

    {
      id: 'config',
      label: 'Configuration files',
      blurb: 'Where settings live and how they stack.',
      entries: [
        {
          cmd: '.claude/settings.json',
          desc: 'Project-shared settings (checked in); `.claude/settings.local.json` is the gitignored local override.',
          note: 'User scope: `~/.claude/settings.json`. Orgs can pin a managed policy above everything.',
          conf: 'documented',
          doc: `${CC}/settings`,
          site: '/foundations/configuration/',
        },
        {
          cmd: 'claude --settings <file|json>',
          desc: 'Load additional settings from a file or inline JSON for this run.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --setting-sources <list>',
          desc: 'Limit which setting sources load: user, project, local.',
          conf: 'firsthand',
        },
        {
          cmd: 'CLAUDE.md',
          desc: 'Standing instructions, loaded every session - the rules file.',
          note: 'There are no named profiles; a scope\'s settings.json is its only config at a time.',
          conf: 'documented',
          doc: `${CC}/memory`,
          site: '/foundations/rules/',
        },
        {
          cmd: 'claude --verbose',
          desc: 'Verbose logging for the session; `-d` enables debug mode with category filters.',
          example: 'claude -d "api,hooks"',
          conf: 'firsthand',
        },
      ],
    },

    {
      id: 'extend',
      label: 'Skills, agents & plugins',
      blurb: 'Teaching the tool new tricks.',
      entries: [
        {
          cmd: '.claude/skills/<name>/SKILL.md',
          desc: 'A skill becomes a slash command: type `/<name>` to invoke.',
          note: 'Legacy `.claude/commands/<name>.md` still works; skills are the recommended path.',
          conf: 'documented',
          doc: `${CC}/skills`,
          site: '/foundations/skills/',
        },
        {
          cmd: '$ARGUMENTS',
          desc: 'Placeholder in skill content, replaced with whatever follows the command.',
          conf: 'documented',
          site: '/foundations/slash-commands/',
        },
        {
          cmd: 'disable-model-invocation: true',
          desc: 'Skill frontmatter that hides the skill from Claude - only explicit `/<name>` works. For side-effecting skills.',
          conf: 'documented',
        },
        {
          cmd: 'claude plugin',
          desc: 'Manage plugins; plugin slash commands are namespaced like `/my-plugin:review`.',
          conf: 'firsthand',
          site: '/foundations/plugins/',
        },
        {
          cmd: 'claude --plugin-dir <path>',
          desc: 'Load a plugin from a directory or .zip for this session only; `--plugin-url` fetches from a URL.',
          conf: 'firsthand',
        },
        {
          cmd: 'claude --agents <json>',
          desc: 'Define custom agents inline for the session; `--agent <name>` starts on a specific one.',
          conf: 'firsthand',
          site: '/foundations/subagents/',
        },
        {
          cmd: '/reload-skills',
          desc: 'Re-scan skill directories so on-disk changes are available without restarting.',
          note: 'Companion: `/reload-plugins --force`.',
          conf: 'documented',
        },
        {
          cmd: '/list-agents',
          desc: 'List subagents and sessions Claude can message, with the name to use for each.',
          conf: 'documented',
        },
      ],
    },
  ],
};
