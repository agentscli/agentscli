/**
 * GitHub Copilot cheatsheet facts.
 *
 * Verification, 2026-10-25:
 *   - Current CLI version: `npm view @github/copilot version` returned 1.0.103.
 *   - Slash commands, subcommands, flags, shortcuts, autopilot, remote control,
 *     plugins, skills, and hooks: the GitHub Copilot CLI command reference and
 *     hooks reference on docs.github.com, read 2026-10-25. Rows from the
 *     earlier 2026-08-18 pass checked against a local v0.0.350 binary keep
 *     their `firsthand` label; the current docs supersede that binary where
 *     they differ, and notes say so.
 */

import type { Cheatsheet } from './claude-code';

const GH = 'https://docs.github.com/en/copilot';
const CLI = `${GH}/reference/copilot-cli-reference/cli-command-reference`;

export const copilotCheatsheet: Cheatsheet = {
  tool: 'copilot',
  label: 'GitHub Copilot',
  version: 'CLI 1.0.103',
  checkedAt: '2026-10-25',
  sources: [
    'Installed binary: copilot --help / copilot help (v0.0.350, first-hand, 2026-08-18; superseded by current docs where they differ)',
    'npm registry: https://www.npmjs.com/package/@github/copilot (1.0.103, 2026-10-25)',
    'GitHub repository: https://github.com/github/copilot-cli',
    'GitHub release: https://github.com/github/copilot-cli/releases',
    `${GH}/how-tos/copilot-cli/cli-getting-started`,
    CLI,
    `${GH}/reference/custom-instructions-support`,
    `${GH}/how-tos/copilot-cli/customize-copilot/add-mcp-servers`,
    `${GH}/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github`,
    `${GH}/reference/hooks-reference`,
    `${GH}/concepts/agents/copilot-cli/autopilot`,
    `${GH}/concepts/agents/copilot-cli/about-remote-control`,
  ],
  intro: 'This is the terminal-native Copilot CLI reference, re-checked on 2026-10-25 against the current 1.0.x command reference. Rows marked first-hand were run on an older v0.0.350 binary in August and are kept where current docs still agree. IDE Copilot and GitHub Copilot cloud agent are called out separately so their commands and permissions are not conflated.',
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
        { cmd: '/login', desc: 'Authenticate inside an interactive session with the GitHub OAuth flow.', note: 'Outside a session, `copilot login` takes `--host`, `--web-flow`, `--device-code`, or `--with-token`. Current docs list the subcommand; the older v0.0.350 binary did not.', conf: 'documented', doc: CLI },
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
        { cmd: 'copilot -p "Summarize this project"', desc: 'Run one prompt non-interactively and exit after completion.', note: '`-s`/`--silent` prints only the agent response. Programmatic runs require `--allow-all-tools` or `COPILOT_ALLOW_ALL=true`. The exit summary prints a `copilot --resume=SESSION-ID` hint.', conf: 'documented', doc: CLI },
        { cmd: 'copilot --continue', desc: 'Resume the most recent session.', conf: 'firsthand', doc: CLI },
        { cmd: 'copilot --resume', desc: 'Open the session picker, or use `--resume=<session-id>` for a specific session.', conf: 'firsthand', doc: CLI },
        { cmd: 'copilot -C <directory>', desc: 'Change working directory before starting the session.', conf: 'documented', doc: CLI },
        { cmd: 'copilot --model <model>', desc: 'Choose the model for the session.', note: 'The locally checked binary lists `claude-sonnet-4.5`, `claude-sonnet-4`, `claude-haiku-4.5`, and `gpt-5`; current docs may list a newer model catalog.', conf: 'firsthand', doc: CLI },
        { cmd: '/plan [prompt]', desc: 'Create an implementation plan before coding.', conf: 'documented', doc: CLI },
        { cmd: '/review [prompt]', desc: 'Ask the CLI code-review agent to analyze changes.', conf: 'documented', doc: CLI },
        { cmd: '/diff', desc: 'Open the interactive diff view for changes.', conf: 'documented', doc: CLI },
        { cmd: '/usage', desc: 'Display session usage metrics and statistics.', conf: 'firsthand' },
        { cmd: 'Shift+Tab', desc: 'Cycle the session mode between standard (interactive), plan, and autopilot.', conf: 'documented', doc: CLI },
        { cmd: '/autopilot [objective]', desc: 'Start or refocus autopilot, where the agent keeps working through successive steps until it reports the task complete.', note: 'Alias `/goal`. Add `--max-ai-credits N` to cap spend. Autopilot controls continuation, not approvals; `--allow-all` controls approvals. Cap continuations with `--max-autopilot-continues=COUNT`. Press Esc twice to interrupt a running turn.', conf: 'documented', doc: `${GH}/concepts/agents/copilot-cli/autopilot` },
        { cmd: 'copilot --plan --mode autopilot', desc: 'Start in plan mode and move to autopilot automatically once the plan is ready.', note: 'It does not wait for interactive plan approval.', conf: 'documented', doc: CLI },
        { cmd: '/compact [focus]', desc: 'Summarize the conversation to free context window; the optional focus steers the summary.', conf: 'documented', doc: CLI },
        { cmd: '/context', desc: 'Show context window token usage with a visualization.', conf: 'documented', doc: CLI },
        { cmd: '/ask [question]', desc: 'Ask a side question without adding it to the conversation history.', note: 'Alias `/btw`.', conf: 'documented', doc: CLI },
        { cmd: '/tasks', desc: 'View and manage running subagents and shell commands.', conf: 'documented', doc: CLI },
        { cmd: '/resume [session-id]', desc: 'Switch to another session from a list; alias `/continue`.', conf: 'documented', doc: CLI },
        { cmd: '/undo', desc: 'Open the rewind picker to roll back to an earlier turn, conversation only or conversation plus the files changed.', note: 'Alias `/rewind`. File changes are tracked per turn, so Git is not required.', conf: 'documented', doc: CLI },
        { cmd: '/fleet [prompt]', desc: 'Run parts of a task in parallel through subagents.', note: 'Also `copilot --fleet` with `-p`, `-i`, or piped input.', conf: 'documented', doc: CLI },
        { cmd: '/new worktree', desc: 'Start an empty session in a new Git worktree, leaving the current session untouched.', note: 'Related: `copilot -w [name]` starts a session in an isolated worktree; `/worktree`, `/move`, and `/fork worktree` also exist.', conf: 'documented', doc: CLI },
        { cmd: '/pr [view|create|fix|auto|automerge]', desc: 'Manage the pull request for the current branch from the session.', conf: 'documented', doc: CLI },
        { cmd: '/model [auto <tier>|MODEL]', desc: 'Pick a model or Auto for this session; `--global` sets the default for future sessions.', note: '`copilot --model auto` also works. `--effort` sets reasoning effort (low to max).', conf: 'documented', doc: CLI },
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
        { cmd: '--output-format json', desc: 'Emit JSONL (one JSON object per line) instead of text for machine-readable automation.', note: 'Use with `-p`; `-s`/`--silent` suppresses usage statistics in text output.', conf: 'documented', doc: CLI },
        { cmd: '--model <model>', desc: 'Select a model; `COPILOT_MODEL` is the environment-variable equivalent.', conf: 'firsthand', doc: CLI },
        { cmd: '--name <name>', desc: 'Name a new session so it is easy to find with `--resume`.', conf: 'documented', doc: CLI },
        { cmd: '--agent <agent>', desc: 'Select a custom agent for the session.', conf: 'documented', doc: CLI },
        { cmd: '--autopilot', desc: 'Keep working until the agent reports task completion, then return to interactive mode.', note: 'Use `--max-autopilot-continues` to cap continuation messages.', conf: 'documented', doc: CLI },
        { cmd: '--mode plan|autopilot|interactive', desc: 'Set the initial agent mode.', note: '`--plan --mode autopilot` means plan-then-autopilot; `--plan` alone is plan mode.', conf: 'documented', doc: CLI },
        { cmd: '--max-ai-credits=<n>', desc: 'Set a soft AI Credit limit for each response; it resets per user message.', note: 'Adjust mid-session with `/limits`.', conf: 'documented', doc: CLI },
        { cmd: '-w, --worktree[=name]', desc: 'Create or reuse an isolated Git worktree and start the session inside it.', conf: 'documented', doc: CLI },
        { cmd: '--sandbox / --no-sandbox', desc: 'Turn the OS-level shell sandbox on or off for this session only.', note: 'An enterprise-managed policy can still force sandboxing on. Manage the sandbox CA with `copilot sandbox ca`.', conf: 'documented', doc: CLI },
        { cmd: '--acp', desc: 'Start as an Agent Client Protocol server.', conf: 'documented', doc: CLI },
        { cmd: 'copilot config --list', desc: 'Read or change settings from the command line; also `copilot config KEY VALUE`, `--rm`, `--global`, `--repo`.', conf: 'documented', doc: CLI },
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
        { cmd: '--allow-all-tools', desc: 'Automatically allow every tool; required for non-interactive mode.', note: 'High risk: it does not itself grant every path or URL. `--allow-all` (alias `--yolo`) is the same as `--allow-all-tools --allow-all-paths --allow-all-urls`.', conf: 'documented', doc: CLI },
        { cmd: '--allow-all-paths', desc: 'Disable file-path verification and allow access to any path.', note: 'Prefer `--add-dir` for a bounded workspace.', conf: 'firsthand', doc: CLI },
        { cmd: '--allow-all-tools --deny-tool "shell(git push)"', desc: 'A practical CI approval pattern: automate tools while retaining a push deny rule.', note: 'Deny rules take precedence over allow rules.', conf: 'firsthand', doc: CLI },
        { cmd: '/permissions [default|assisted|allow-all|show]', desc: 'Switch or inspect the interactive permission mode.', note: 'Canonical command; `/allow-all` and `/yolo` are aliases for allow-all. Assisted mode attaches an LLM safety recommendation to each prompt. `/permissions reset` clears in-memory approvals for the session.', conf: 'documented', doc: CLI },
      ],
    },
    {
      id: 'customize',
      label: 'Instructions, agents & skills',
      blurb: 'Give the CLI durable project context, specialist subagents, and reusable procedures.',
      entries: [
        { cmd: 'copilot init', desc: 'Analyze the repository and create or improve Copilot custom instructions.', note: 'Interactive equivalent: `/init`.', conf: 'documented', doc: CLI },
        { cmd: '.github/copilot-instructions.md', desc: 'Repository-wide instructions for Copilot CLI.', note: 'CLI also loads `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, path-specific `.github/instructions/**/*.instructions.md`, and personal `~/.copilot/...` files.', conf: 'documented', doc: `${GH}/reference/custom-instructions-support` },
        { cmd: '.github/agents/reviewer.agent.md', desc: 'Define a repository custom agent with YAML frontmatter and a Markdown prompt.', note: 'CLI also supports `.github/agents`/`.claude/agents` and `~/.copilot/agents`; frontmatter includes `description`, `tools`, `model`, `infer`, and optional `mcp-servers`.', conf: 'documented', doc: `${GH}/reference/custom-agents-configuration` },
        { cmd: '.github/skills/<name>/SKILL.md', desc: 'Create a project skill that can be invoked as `/<name>` or selected automatically.', note: 'Personal skills live in `~/.copilot/skills`; required frontmatter includes `name` and `description`.', conf: 'documented', doc: CLI },
        { cmd: 'copilot skill add ./my-skill/SKILL.md', desc: 'Install a skill non-interactively for the user account.', note: 'Add `--project` to scope a file or URL skill to the repository. Also `copilot skill list|enable|disable|remove`. The older `copilot plugins install --skill` form is not in the current reference.', conf: 'documented', doc: CLI },
        { cmd: 'copilot skill list --json', desc: 'Inspect skills as machine-readable JSON with name, description, source, path, and enabled.', note: 'MCP servers: `copilot mcp list --json`. Plugins: `copilot plugin`. Language servers: `copilot lsp list`.', conf: 'documented', doc: CLI },
        { cmd: '.github/hooks/*.json', desc: 'Define hooks: external commands that run at lifecycle events such as preToolUse, postToolUse, sessionStart, and agentStop.', note: 'A preToolUse hook can return `permissionDecision: "deny"`. User hooks live in `~/.copilot/hooks/`. See the hooks lesson in the course.', conf: 'documented', doc: `${GH}/reference/hooks-reference` },
        { cmd: '/plugin marketplace add <source>', desc: 'Register a plugin marketplace; then `/plugin install <plugin>@<marketplace>`.', note: 'Non-interactive: `copilot plugin`. Bare `/plugin` opens the dashboard with Installed, Online, and Marketplace views.', conf: 'documented', doc: CLI },
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
        { cmd: 'COPILOT_GITHUB_TOKEN="$GITHUB_TOKEN" copilot -sp "Summarize the test failures"', desc: 'A response-only, non-interactive CLI invocation.', note: 'For tool-using automation, add explicit permissions such as `--allow-tool` rules or `--allow-all-tools`; protect tokens with CI secret storage.', conf: 'documented', doc: `${GH}/how-tos/copilot-cli/cli-getting-started` },
        { cmd: 'copilot -p "Run the tests and report failures" --allow-all-tools --output-format json', desc: 'Run a headless agent task and emit JSONL.', note: 'This is Copilot CLI in the runner, not GitHub Copilot cloud agent.', conf: 'documented', doc: CLI },
        { cmd: '/remote on', desc: 'Let you monitor and steer the running interactive CLI session from GitHub.com or GitHub Mobile.', note: 'The session still runs on your machine. Needs interactive mode and, for organization seats, the "Store local sessions in the Cloud" policy set to "View and control". The legacy `--remote` flag is not supported for interactive startup or with `-p`; `/remote off` ends the connection.', conf: 'documented', doc: `${GH}/concepts/agents/copilot-cli/about-remote-control` },
        { cmd: 'GitHub.com → Issues → Assignees → Copilot', desc: 'Assign an issue to Copilot cloud agent; it researches, changes code, opens a pull request, and requests review.', note: 'GitHub-native cloud agent is a separate surface, currently documented as public preview; it requires cloud agent access and write access to the target repository.', conf: 'documented', doc: `${GH}/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github` },
        { cmd: '/task <prompt> (GitHub.com Copilot Chat)', desc: 'Start a cloud-agent task from GitHub Copilot Chat that creates a pull request.', note: 'This is a GitHub.com command, not a Copilot CLI slash command.', conf: 'documented', doc: `${GH}/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github` },
        { cmd: '@copilot (pull request comment)', desc: 'Ask GitHub cloud agent to continue work on a pull request.', note: 'By default it pushes commits to that pull request branch; ask for a separate PR if that is what you want.', conf: 'documented', doc: `${GH}/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github` },
        { cmd: 'IDE Copilot Chat / agent mode', desc: 'Use Copilot inside VS Code, Visual Studio, JetBrains, Eclipse, or Xcode.', note: 'IDE chat, autocomplete, and agent mode are not the terminal CLI. Their instruction/agent support differs by IDE; consult the support matrix before sharing a config.', conf: 'documented', doc: `${GH}/reference/custom-instructions-support` },
      ],
    },
  ],
};
