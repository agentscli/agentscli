/**
 * Codex CLI cheatsheet facts - the single source of truth for the static
 * cheatsheet renderer.
 *
 * FACT-BOUND. Verification, 2026-08-18:
 *   - CLI flags and subcommands: installed binary `codex --help` and
 *     subcommand help, codex-cli 0.147.0.
 *   - Workflow, configuration, MCP, skills, and agents: official OpenAI Docs.
 *
 * Re-verify on the next CLI/docs pass: run `codex --version`, `codex --help`,
 * and the relevant subcommand help, then bump `checkedAt` and `version`.
 */

import type { Cheatsheet } from './claude-code';

const DOCS = 'https://developers.openai.com/codex';

export const codexCheatsheet: Cheatsheet = {
  tool: 'codex',
  label: 'Codex CLI',
  version: '0.147.0',
  checkedAt: '2026-08-18',
  sources: [
    'Installed binary: codex --help and subcommand help (codex-cli 0.147.0, first-hand)',
    'GitHub repository: https://github.com/openai/codex',
    'GitHub release: https://github.com/openai/codex/releases/tag/rust-v0.147.0',
    `${DOCS}/cli`,
    `${DOCS}/developer-commands`,
    `${DOCS}/sandboxing`,
    `${DOCS}/permissions`,
    `${DOCS}/mcp`,
    `${DOCS}/skills`,
    `${DOCS}/subagents`,
    `${DOCS}/non-interactive-mode`,
  ],
  intro: 'Verified against installed codex-cli 0.147.0, the official OpenAI Docs, and the OpenAI Codex GitHub repository on 2026-08-18. This is an installed-version snapshot, not a claim about the latest CLI. CLI flags are first-hand; config, MCP, skills, and agent behavior is marked docs when it is not exposed by --help.',
  categories: [
    {
      id: 'install',
      label: 'Install & authenticate',
      blurb: 'Put Codex on the machine, sign in, and check the installation.',
      entries: [
        { cmd: 'curl -fsSL https://chatgpt.com/codex/install.sh | sh', desc: 'Install or update the standalone CLI on macOS and Linux.', conf: 'documented', doc: `${DOCS}/cli` },
        { cmd: 'npm i -g @openai/codex', desc: 'Install Codex from npm.', conf: 'documented', doc: `${DOCS}/cli` },
        { cmd: 'brew install --cask codex', desc: 'Install Codex with Homebrew.', conf: 'documented', doc: `${DOCS}/cli` },
        { cmd: 'codex --version', desc: 'Print the installed CLI version.', conf: 'firsthand' },
        { cmd: 'codex update', desc: 'Update Codex to the latest version.', conf: 'firsthand' },
        { cmd: 'codex login', desc: 'Authenticate with ChatGPT OAuth, device auth, an API key, or an access token from stdin.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
        { cmd: 'codex logout', desc: 'Remove stored authentication credentials.', conf: 'firsthand' },
        { cmd: 'codex doctor', desc: 'Generate a diagnostic report for installation, config, auth, runtime, Git, and session issues.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
      ],
    },
    {
      id: 'session',
      label: 'Start & steer a session',
      blurb: 'Launch the TUI in the right directory with the right model and context.',
      entries: [
        { cmd: 'codex', desc: 'Start an interactive terminal session in the current directory.', conf: 'firsthand' },
        { cmd: 'codex "explain this repository"', desc: 'Start a session with an initial prompt.', conf: 'firsthand' },
        { cmd: 'codex -C <dir> "run the tests"', desc: 'Use a specific directory as the working root.', note: 'Long form: `--cd`.', conf: 'firsthand' },
        { cmd: 'codex --add-dir <dir>', desc: 'Add another writable directory alongside the primary workspace.', conf: 'firsthand' },
        { cmd: 'codex -m <model>', desc: 'Choose the model for the session.', note: 'Long form: `--model`.', conf: 'firsthand' },
        { cmd: 'codex -i screenshot.png "fix the layout"', desc: 'Attach one or more images to the initial prompt.', note: 'Repeat `-i`/`--image` for multiple files.', conf: 'firsthand' },
        { cmd: '/model', desc: 'Choose or change the model and reasoning effort in the TUI.', conf: 'documented', doc: `${DOCS}/cli` },
        { cmd: '/status', desc: 'Show current session configuration.', conf: 'documented', doc: `${DOCS}/cli` },
        { cmd: '/review', desc: 'Review changes and find issues from inside a session.', conf: 'documented', doc: `${DOCS}/cli` },
        { cmd: '/permissions', desc: 'Open the permissions picker and change the active permissions profile.', conf: 'documented', doc: `${DOCS}/sandboxing` },
      ],
    },
    {
      id: 'approvals',
      label: 'Approvals & sandbox',
      blurb: 'Keep filesystem, network, and approval boundaries explicit.',
      entries: [
        { cmd: 'codex -s read-only', desc: 'Allow read-only inspection; edits and commands requiring approval remain blocked unless approved.', note: 'Other modes: `workspace-write` and `danger-full-access`.', conf: 'firsthand', doc: `${DOCS}/sandboxing` },
        { cmd: 'codex -s workspace-write -a on-request', desc: 'Use the common local-work preset: workspace writes plus approval when Codex needs escalation.', note: '`-a` is short for `--ask-for-approval`.', conf: 'firsthand', doc: `${DOCS}/sandboxing` },
        { cmd: 'codex -a untrusted', desc: 'Ask before commands outside the trusted command set.', conf: 'firsthand', doc: `${DOCS}/sandboxing` },
        { cmd: 'codex -a never', desc: 'Never ask for approval; command failures return to the model.', note: 'Pairing this with `danger-full-access` removes the safety boundary.', conf: 'firsthand', doc: `${DOCS}/sandboxing` },
        { cmd: 'codex --approve-for-me', desc: 'Route eligible approval requests through automatic review with workspace-write sandboxing.', conf: 'firsthand' },
        { cmd: 'codex --dangerously-bypass-approvals-and-sandbox', desc: 'Skip confirmation prompts and sandboxing.', note: 'Use only inside an external sandbox; it is explicitly dangerous.', conf: 'firsthand', doc: `${DOCS}/sandboxing` },
        { cmd: 'codex --search', desc: 'Enable live web search for the session.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
        { cmd: 'codex --strict-config', desc: 'Fail when config.toml contains fields this CLI version does not recognize.', conf: 'firsthand' },
      ],
    },
    {
      id: 'resume',
      label: 'Resume & automate',
      blurb: 'Continue work interactively, or make a repeatable CI-shaped run.',
      entries: [
        { cmd: 'codex resume', desc: 'Open the picker for a previous interactive session.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
        { cmd: 'codex resume --last', desc: 'Resume the most recent session from the current working directory.', note: 'Add `--all` to include sessions from other directories.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
        { cmd: 'codex resume <session-id> "follow up"', desc: 'Resume a session by UUID or session name with an optional follow-up prompt.', conf: 'firsthand' },
        { cmd: 'codex fork --last', desc: 'Fork the most recent interactive session into a new chat.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
        { cmd: 'codex exec "summarize the repo"', desc: 'Run non-interactively and exit after the task completes.', note: 'Alias: `codex e`.', conf: 'firsthand', doc: `${DOCS}/non-interactive-mode` },
        { cmd: 'cat prompt.txt | codex exec -', desc: 'Read the prompt from stdin for scripts and pipelines.', conf: 'firsthand' },
        { cmd: 'codex exec --json "run the checks"', desc: 'Emit machine-readable JSONL events to stdout.', conf: 'firsthand', doc: `${DOCS}/non-interactive-mode` },
        { cmd: 'codex exec -o result.txt "summarize failures"', desc: 'Write the final agent message to a file.', note: 'Long form: `--output-last-message`.', conf: 'firsthand', doc: `${DOCS}/non-interactive-mode` },
        { cmd: 'codex exec --output-schema schema.json -o result.json "extract metadata"', desc: 'Request a final response matching a JSON Schema and save it.', conf: 'firsthand', doc: `${DOCS}/non-interactive-mode` },
        { cmd: 'codex review', desc: 'Run a non-interactive review of uncommitted changes, a branch diff, or a commit.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
      ],
    },
    {
      id: 'config',
      label: 'Config & profiles',
      blurb: 'Layer persistent TOML settings and select a task-specific profile.',
      entries: [
        { cmd: '~/.codex/config.toml', desc: 'User-level Codex configuration.', conf: 'documented', doc: `${DOCS}/mcp` },
        { cmd: '.codex/config.toml', desc: 'Project-scoped configuration for a trusted project.', conf: 'documented', doc: `${DOCS}/mcp` },
        { cmd: 'codex -c key=value', desc: 'Override a TOML config value for one invocation.', note: 'Use dotted paths for nested values; repeat the flag.', conf: 'firsthand' },
        { cmd: 'codex -p <profile>', desc: 'Layer `$CODEX_HOME/<profile>.config.toml` over the base user config.', note: 'Long form: `--profile`.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
        { cmd: 'CODEX_HOME=<dir> codex', desc: 'Use an alternate Codex home for isolated config, auth, and session state.', conf: 'documented', doc: `${DOCS}/developer-commands` },
        { cmd: 'AGENTS.md', desc: 'Project or parent-directory instructions Codex loads as standing guidance.', conf: 'documented', doc: `${DOCS}/subagents` },
        { cmd: 'codex features', desc: 'Inspect feature flags and persistently enable or disable them in config.toml.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
      ],
    },
    {
      id: 'mcp',
      label: 'MCP servers',
      blurb: 'Connect local stdio tools or remote Streamable HTTP tools.',
      entries: [
        { cmd: 'codex mcp add <name> -- <stdio-command>', desc: 'Register a local stdio MCP server.', conf: 'firsthand', doc: `${DOCS}/mcp` },
        { cmd: 'codex mcp add <name> --env KEY=value -- <command>', desc: 'Pass environment variables to a stdio MCP server.', conf: 'firsthand', doc: `${DOCS}/mcp` },
        { cmd: 'codex mcp list', desc: 'List configured MCP servers.', conf: 'firsthand', doc: `${DOCS}/mcp` },
        { cmd: 'codex mcp get <name>', desc: 'Show one configured MCP server.', conf: 'firsthand' },
        { cmd: 'codex mcp login <name>', desc: 'Start OAuth login for an MCP server that supports it.', conf: 'firsthand', doc: `${DOCS}/mcp` },
        { cmd: 'codex mcp remove <name>', desc: 'Remove an MCP server registration.', conf: 'firsthand' },
        { cmd: '/mcp', desc: 'Show active MCP servers in the TUI.', conf: 'documented', doc: `${DOCS}/mcp` },
        { cmd: '[mcp_servers.<name>]', desc: 'Configure a server in config.toml; use `command`/`args` for stdio or `url` for Streamable HTTP.', conf: 'documented', doc: `${DOCS}/mcp` },
        { cmd: 'codex mcp-server', desc: 'Run Codex itself as an MCP server over stdio.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
      ],
    },
    {
      id: 'extend',
      label: 'Skills & agents',
      blurb: 'Package repeatable workflows and delegate focused work.',
      entries: [
        { cmd: '.agents/skills/<name>/SKILL.md', desc: 'Repository skill location; the file needs `name` and `description` frontmatter.', note: 'Codex also scans user, admin, and system skill locations.', conf: 'documented', doc: `${DOCS}/skills` },
        { cmd: '$skill-name', desc: 'Explicitly invoke a skill in the CLI.', note: 'The TUI also exposes skills through `/skills`.', conf: 'documented', doc: `${DOCS}/skills` },
        { cmd: '/skills', desc: 'List or select available skills in the TUI.', conf: 'documented', doc: `${DOCS}/skills` },
        { cmd: '[[skills.config]]', desc: 'Enable or disable a local skill from config.toml.', conf: 'documented', doc: `${DOCS}/skills` },
        { cmd: 'spawn two agents ...', desc: 'Ask Codex to delegate independent work to parallel subagents and combine the results.', note: 'Subagents inherit the parent sandbox and approval policy.', conf: 'documented', doc: `${DOCS}/subagents` },
        { cmd: '~/.codex/agents/<name>.toml', desc: 'Define a personal custom agent.', note: 'Project-scoped agents live in `.codex/agents/`.', conf: 'documented', doc: `${DOCS}/subagents` },
        { cmd: '[agents]', desc: 'Configure multi-agent enablement, concurrency, default model, and reasoning effort.', conf: 'documented', doc: `${DOCS}/subagents` },
        { cmd: 'codex plugin', desc: 'Install, list, and remove Codex plugins from marketplace sources.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
      ],
    },
    {
      id: 'useful',
      label: 'Useful commands',
      blurb: 'Session housekeeping, shell integration, and less-common surfaces.',
      entries: [
        { cmd: 'codex completion zsh', desc: 'Generate shell completion scripts.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
        { cmd: 'codex apply <TASK_ID>', desc: 'Apply a diff generated by a Codex cloud task to the local working tree.', note: 'Alias: `codex a <TASK_ID>`.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
        { cmd: 'codex archive <session>', desc: 'Archive a saved session by ID or name.', conf: 'firsthand' },
        { cmd: 'codex unarchive <session>', desc: 'Restore an archived session.', conf: 'firsthand' },
        { cmd: 'codex delete <session>', desc: 'Permanently delete a saved session.', note: 'Destructive; verify the session identifier first.', conf: 'firsthand' },
        { cmd: 'codex sandbox -- <command>', desc: 'Run a command inside a Codex-provided sandbox.', note: 'Choose the agent-session sandbox separately with `-s`/`--sandbox`.', conf: 'firsthand' },
        { cmd: 'codex app', desc: 'Launch the ChatGPT desktop app on macOS or Windows.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
        { cmd: 'codex --no-alt-screen', desc: 'Use inline TUI mode and preserve terminal scrollback.', conf: 'firsthand' },
        { cmd: 'codex --remote <addr>', desc: 'Connect the TUI to a remote app-server over WebSocket or Unix socket.', note: 'Experimental workflow; use `--remote-auth-token-env` for a bearer token.', conf: 'firsthand', doc: `${DOCS}/developer-commands` },
      ],
    },
  ],
};
