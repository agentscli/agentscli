/**
 * GitHub Copilot cheatsheet facts.
 *
 * Verification, 2026-08-18:
 *   - CLI flags, help topics, interactive commands, permissions, and
 *     environment variables: installed `copilot --help` and `copilot help`
 *     (v0.0.350, commit 6bd4106).
 *   - Current commands, customization, MCP, and GitHub surfaces: official
 *     GitHub Copilot documentation. Some documented commands are newer than
 *     the locally installed binary and are marked `documented`.
 */

import type { Cheatsheet } from './claude-code';

const GH = 'https://docs.github.com/en/copilot';
const CLI = `${GH}/reference/copilot-cli-reference/cli-command-reference`;

export const copilotCheatsheet: Cheatsheet = {
  tool: 'copilot',
  label: 'GitHub Copilot',
  version: 'CLI 0.0.350 (6bd4106)',
  checkedAt: '2026-08-18',
  sources: [
    'Installed binary: copilot --help / copilot help (v0.0.350, first-hand)',
    'GitHub repository: https://github.com/github/copilot-cli',
    'GitHub release: https://github.com/github/copilot-cli/releases/tag/v1.0.80',
    `${GH}/how-tos/copilot-cli/cli-getting-started`,
    CLI,
    `${GH}/reference/custom-instructions-support`,
    `${GH}/how-tos/copilot-cli/customize-copilot/add-mcp-servers`,
    `${GH}/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github`,
  ],
  intro: 'This is the terminal-native Copilot CLI reference. Local first-hand verification covers v0.0.350; current GitHub documentation and repository rows may describe the newer 1.0.x CLI. IDE Copilot and GitHub Copilot cloud agent are called out separately so their commands and permissions are not conflated.',
  categories: [
    {
      id: 'install-auth',
      label: 'Install & authenticate',
      blurb: 'Get the terminal CLI installed, then give it a GitHub identity.',
      entries: [
        { cmd: 'npm install -g @github/copilot', desc: 'Install Copilot CLI cross-platform; requires Node.js 22 or later.', conf: 'documented', doc: `${GH}/how-tos/copilot-cli/cli-getting-started` },
        { cmd: 'brew install --cask copilot-cli', desc: 'Install Copilot CLI on macOS or Linux with Homebrew.', conf: 'documented', doc: `${GH}/how-tos/copilot-cli/cli-getting-started` },
        { cmd: 'winget install GitHub.Copilot', desc: 'Install Copilot CLI on Windows with WinGet.', conf: 'documented', doc: `${GH}/how-tos/copilot-cli/cli-getting-started` },
        { cmd: 'copilot --version', desc: 'Print the installed CLI version.', conf: 'firsthand' },
        { cmd: 'copilot update', desc: 'Download and install the latest CLI version.', conf: 'documented', doc: CLI },
        { cmd: '/login', desc: 'Authenticate inside an interactive session with the GitHub OAuth flow.', note: 'The documented terminal command is `copilot login`; the installed v0.0.350 exposes `/login` in interactive mode but not the subcommand in top-level help.', conf: 'firsthand', doc: `${GH}/how-tos/copilot-cli/cli-getting-started` },
        { cmd: 'COPILOT_GITHUB_TOKEN=github_pat_... copilot', desc: 'Authenticate a headless run with a fine-grained token.', note: 'Precedence: `COPILOT_GITHUB_TOKEN`, then `GH_TOKEN`, then `GITHUB_TOKEN`. Never print the token in logs.', conf: 'documented', doc: CLI },
        { cmd: '/user [show|list|switch]', desc: 'Inspect or switch the GitHub account used by the CLI.', conf: 'firsthand' },
      ],
    },
    {
      id: 'session',
      label: 'Start, steer & resume',
      blurb: 'Interactive work is a terminal session with slash commands, approvals, and resumable state.',
      entries: [
        { cmd: 'copilot', desc: 'Start an interactive CLI session in the current directory.', conf: 'firsthand' },
        { cmd: 'copilot -p "Summarize this project"', desc: 'Run one prompt non-interactively and exit after completion.', note: 'Current docs add `-s`/`--silent` for response-only output; it is newer than installed v0.0.350. Programmatic runs require `--allow-all-tools` or `COPILOT_ALLOW_ALL=true`.', conf: 'firsthand', doc: `${GH}/how-tos/copilot-cli/cli-getting-started` },
        { cmd: 'copilot --continue', desc: 'Resume the most recent session.', conf: 'firsthand', doc: CLI },
        { cmd: 'copilot --resume', desc: 'Open the session picker, or use `--resume=<session-id>` for a specific session.', conf: 'firsthand', doc: CLI },
        { cmd: 'copilot -C <directory>', desc: 'Change working directory before starting the session.', conf: 'documented', doc: CLI },
        { cmd: 'copilot --model <model>', desc: 'Choose the model for the session.', note: 'The locally checked binary lists `claude-sonnet-4.5`, `claude-sonnet-4`, `claude-haiku-4.5`, and `gpt-5`; current docs may list a newer model catalog.', conf: 'firsthand', doc: CLI },
        { cmd: '/plan [prompt]', desc: 'Create an implementation plan before coding.', conf: 'documented', doc: CLI },
        { cmd: '/review [prompt]', desc: 'Ask the CLI code-review agent to analyze changes.', conf: 'documented', doc: CLI },
        { cmd: '/diff', desc: 'Open the interactive diff view for changes.', conf: 'documented', doc: CLI },
        { cmd: '/usage', desc: 'Display session usage metrics and statistics.', conf: 'firsthand' },
        { cmd: '/help', desc: 'Show interactive commands; `?` opens tabbed help and `/` opens the slash-command picker.', conf: 'firsthand', doc: CLI },
      ],
    },
    {
      id: 'options',
      label: 'CLI options',
      blurb: 'The high-value flags for workspace, output, model, autonomy, and diagnostics.',
      entries: [
        { cmd: '--add-dir <path>', desc: 'Allow file access to an additional directory; repeat for multiple directories.', conf: 'firsthand', doc: CLI },
        { cmd: '--attachment <path>', desc: 'Attach a file to the initial prompt; repeatable.', conf: 'documented', doc: CLI },
        { cmd: '--output-format json', desc: 'Emit JSONL instead of text for machine-readable automation.', note: 'Use with `-p`; `-s`/`--silent` suppresses usage statistics in text output.', conf: 'documented', doc: CLI },
        { cmd: '--model <model>', desc: 'Select a model; `COPILOT_MODEL` is the environment-variable equivalent.', conf: 'firsthand', doc: CLI },
        { cmd: '--name <name>', desc: 'Name a new session so it is easy to find with `--resume`.', conf: 'documented', doc: CLI },
        { cmd: '--agent <agent>', desc: 'Select a custom agent for the session.', conf: 'documented', doc: CLI },
        { cmd: '--autopilot', desc: 'Keep working until the agent reports task completion, then return to interactive mode.', note: 'Use `--max-autopilot-continues` to cap continuation messages.', conf: 'documented', doc: CLI },
        { cmd: '--mode plan|autopilot|interactive', desc: 'Set the initial agent mode.', note: '`--plan --mode autopilot` means plan-then-autopilot; `--plan` alone is plan mode.', conf: 'documented', doc: CLI },
        { cmd: '--no-custom-instructions', desc: 'Disable loading custom instructions for this session.', conf: 'firsthand', doc: CLI },
        { cmd: '--log-level <level>', desc: 'Set logging verbosity: none, error, warning, info, debug, all, or default.', conf: 'firsthand' },
        { cmd: '--help', desc: 'Show CLI options and examples; use one focused command such as `copilot help config` or `copilot help permissions`.', note: 'Do not paste the alternatives separated by `|` into a shell; that starts a pipeline.', conf: 'firsthand' },
      ],
    },
    {
      id: 'permissions',
      label: 'Permissions & approvals',
      blurb: 'Keep approvals narrow: tool, path, URL, and deny rules are separate controls.',
      entries: [
        { cmd: '--allow-tool "shell(git:*)"', desc: 'Pre-approve matching tool calls without prompting.', note: 'Patterns include `shell(command)`, `write`, and `<mcp-server>(tool)`; denial always wins.', conf: 'firsthand', doc: CLI },
        { cmd: '--deny-tool "shell(git push)"', desc: 'Block a tool call without prompting.', note: 'Use alongside a broad allow rule to make an exception, for example allow `shell(git:*)` but deny `shell(git push)`.', conf: 'firsthand', doc: CLI },
        { cmd: '--allow-all-tools', desc: 'Automatically allow every tool; required for non-interactive mode in installed v0.0.350.', note: 'High risk: it does not itself grant every path or URL. Current docs also describe newer `--allow-all`/`--yolo` options that are not in installed v0.0.350.', conf: 'firsthand', doc: CLI },
        { cmd: '--allow-all-paths', desc: 'Disable file-path verification and allow access to any path.', note: 'Prefer `--add-dir` for a bounded workspace.', conf: 'firsthand', doc: CLI },
        { cmd: '--allow-all-tools --deny-tool "shell(git push)"', desc: 'A practical CI approval pattern: automate tools while retaining a push deny rule.', note: 'Deny rules take precedence over allow rules.', conf: 'firsthand', doc: CLI },
        { cmd: '/permissions [default|assisted|allow-all|show]', desc: 'Switch or inspect the interactive permission mode.', note: 'Current docs call this canonical; the installed 0.0.350 help lists the lower-level allow/deny flags but not this newer slash command.', conf: 'documented', doc: CLI },
      ],
    },
    {
      id: 'customize',
      label: 'Instructions, agents & skills',
      blurb: 'Give the CLI durable project context, specialist subagents, and reusable procedures.',
      entries: [
        { cmd: 'copilot init', desc: 'Analyze the repository and create or improve `.github/copilot-instructions.md`.', note: 'Interactive equivalent: `/init`; current docs describe this command even though it is not exposed by the locally checked binary.', conf: 'documented', doc: CLI },
        { cmd: '.github/copilot-instructions.md', desc: 'Repository-wide instructions for Copilot CLI.', note: 'CLI also loads `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, path-specific `.github/instructions/**/*.instructions.md`, and personal `~/.copilot/...` files.', conf: 'documented', doc: `${GH}/reference/custom-instructions-support` },
        { cmd: '.github/agents/reviewer.agent.md', desc: 'Define a repository custom agent with YAML frontmatter and a Markdown prompt.', note: 'CLI also supports `.github/agents`/`.claude/agents` and `~/.copilot/agents`; frontmatter includes `description`, `tools`, `model`, `infer`, and optional `mcp-servers`.', conf: 'documented', doc: `${GH}/reference/custom-agents-configuration` },
        { cmd: '.github/skills/<name>/SKILL.md', desc: 'Create a project skill that can be invoked as `/<name>` or selected automatically.', note: 'Personal skills live in `~/.copilot/skills`; required frontmatter includes `name` and `description`.', conf: 'documented', doc: CLI },
        { cmd: 'copilot plugins install --skill ./skill/SKILL.md', desc: 'Install a skill non-interactively for the user account.', note: 'Use `--scope project` for a project-scoped file or URL skill.', conf: 'documented', doc: CLI },
        { cmd: 'copilot plugins list --kind mcp --kind skill --json', desc: 'Inspect discovered MCP servers and skills as machine-readable JSON.', conf: 'documented', doc: CLI },
        { cmd: '/env', desc: 'Show loaded instructions, MCP servers, skills, agents, hooks, plugins, and language servers.', conf: 'documented', doc: CLI },
      ],
    },
    {
      id: 'mcp',
      label: 'MCP servers',
      blurb: 'Extend the CLI with external tools and context; review repository configuration before trusting it.',
      entries: [
        { cmd: '/mcp add', desc: 'Open the interactive form to add a local stdio or remote MCP server.', note: 'The built-in GitHub MCP server is already available; this command is for additional servers.', conf: 'documented', doc: `${GH}/how-tos/copilot-cli/customize-copilot/add-mcp-servers` },
        { cmd: 'copilot mcp add context7 -- npx -y @upstash/context7-mcp', desc: 'Add a local stdio server to user configuration.', conf: 'documented', doc: `${GH}/how-tos/copilot-cli/customize-copilot/add-mcp-servers` },
        { cmd: 'copilot mcp add --transport http notion https://mcp.notion.com/mcp', desc: 'Add a remote HTTP MCP server.', conf: 'documented', doc: `${GH}/how-tos/copilot-cli/customize-copilot/add-mcp-servers` },
        { cmd: 'copilot mcp list --json', desc: 'List configured MCP servers and status without opening a session.', conf: 'documented', doc: CLI },
        { cmd: 'copilot mcp get <name> --json', desc: 'Inspect one server and its available tools.', conf: 'documented', doc: CLI },
        { cmd: '--additional-mcp-config @mcp.json', desc: 'Add MCP configuration for this session only; `@` means read JSON from a file.', conf: 'firsthand', doc: CLI },
        { cmd: '--disable-builtin-mcps', desc: 'Disable built-in MCP servers; `--disable-mcp-server <name>` disables one.', note: 'The current local help identifies `github-mcp-server` as built-in; current docs also describe other built-ins and the default tool subset.', conf: 'firsthand', doc: CLI },
        { cmd: '.mcp.json / .github/mcp.json', desc: 'Configure project-level MCP servers for a checkout or shared repository.', note: 'Review committed MCP configuration and narrow `tools` before enabling it.', conf: 'documented', doc: `${GH}/how-tos/copilot-cli/customize-copilot/add-mcp-servers` },
      ],
    },
    {
      id: 'automation-surfaces',
      label: 'Headless, CI & GitHub-native agent',
      blurb: 'Choose the surface deliberately: CLI automation runs in your environment; cloud agent works through GitHub and raises a PR.',
      entries: [
        { cmd: 'COPILOT_GITHUB_TOKEN="$GITHUB_TOKEN" copilot -sp "Summarize the test failures"', desc: 'A response-only, non-interactive CLI invocation suitable for a newer CLI version.', note: 'Current-docs feature; `--silent` is newer than installed v0.0.350. For tool-using automation, add explicit permissions such as `--allow-all-tools`; protect tokens with CI secret storage.', conf: 'documented', doc: `${GH}/how-tos/copilot-cli/cli-getting-started` },
        { cmd: 'copilot -p "Run the tests and report failures" --allow-all-tools --output-format json', desc: 'Run a headless agent task and emit JSONL in newer CLI versions.', note: 'Current-docs feature; unavailable in installed v0.0.350. This is Copilot CLI in the runner, not GitHub Copilot cloud agent.', conf: 'documented', doc: CLI },
        { cmd: 'copilot --remote', desc: 'Enable remote access to a CLI session from GitHub.com or GitHub Mobile.', note: 'This is still a local CLI session; it is distinct from cloud agent.', conf: 'documented', doc: CLI },
        { cmd: 'GitHub.com → Issues → Assignees → Copilot', desc: 'Assign an issue to Copilot cloud agent; it researches, changes code, opens a pull request, and requests review.', note: 'GitHub-native cloud agent is a separate surface, currently documented as public preview; it requires cloud agent access and write access to the target repository.', conf: 'documented', doc: `${GH}/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github` },
        { cmd: '/task <prompt> (GitHub.com Copilot Chat)', desc: 'Start a cloud-agent task from GitHub Copilot Chat that creates a pull request.', note: 'This is a GitHub.com command, not a Copilot CLI slash command.', conf: 'documented', doc: `${GH}/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github` },
        { cmd: '@copilot (pull request comment)', desc: 'Ask GitHub cloud agent to continue work on a pull request.', note: 'By default it pushes commits to that pull request branch; ask for a separate PR if that is what you want.', conf: 'documented', doc: `${GH}/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github` },
        { cmd: 'IDE Copilot Chat / agent mode', desc: 'Use Copilot inside VS Code, Visual Studio, JetBrains, Eclipse, or Xcode.', note: 'IDE chat, autocomplete, and agent mode are not the terminal CLI. Their instruction/agent support differs by IDE; consult the support matrix before sharing a config.', conf: 'documented', doc: `${GH}/reference/custom-instructions-support` },
      ],
    },
  ],
};
