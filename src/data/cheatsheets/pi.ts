/**
 * Pi coding agent cheatsheet facts.
 *
 * Verification, 2026-08-18:
 *   - CLI flags and subcommands: installed pi --help (v0.84.2, first-hand).
 *   - Interactive commands, settings, resources, compaction, extensions, and
 *     RPC: the official pi repository documentation (documented).
 *
 * Keep first-hand CLI facts distinct from repository documentation: Pi can
 * add flags through extensions, and the installed binary is the authority for
 * the version actually available on this machine.
 */

import type { Cheatsheet } from "./claude-code";

const REPO =
  "https://github.com/earendil-works/pi/tree/main/packages/coding-agent";
const DOCS = `${REPO}/docs`;

export const piCheatsheet: Cheatsheet = {
  tool: "pi",
  label: "Pi coding agent",
  version: "0.84.2",
  checkedAt: "2026-08-18",
  sources: [
    "Installed binary: pi --help (v0.84.2, first-hand)",
    "Official repository: https://github.com/earendil-works/pi",
    `${REPO}/README.md`,
    `${DOCS}/settings.md`,
    `${DOCS}/compaction.md`,
    `${DOCS}/extensions.md`,
    `${DOCS}/rpc.md`,
  ],
  intro:
    "Pi is a deliberately small coding-agent harness: start with read, write, edit, and bash, then add skills, extensions, prompt templates, and packages. The rows marked firsthand were present in the installed v0.84.2 binary; documented rows come from the official repository.",
  categories: [
    {
      id: "install-session",
      label: "Install & session",
      blurb:
        "Get Pi running, preserve the conversation you care about, and keep session files explicit.",
      entries: [
        {
          cmd: "npm install -g --ignore-scripts @earendil-works/pi-coding-agent",
          desc: "Install the Pi coding agent globally.",
          conf: "documented",
          doc: `${REPO}/README.md`,
        },
        {
          cmd: "pi --version",
          desc: "Print the installed Pi version.",
          conf: "firsthand",
        },
        {
          cmd: "pi",
          desc: "Start an interactive session in the current directory.",
          conf: "firsthand",
        },
        {
          cmd: 'pi "Inspect the auth flow"',
          desc: "Start interactively with an initial prompt.",
          conf: "firsthand",
        },
        {
          cmd: 'pi @prompt.md @image.png "Review these"',
          desc: "Attach files to the initial message with @ references.",
          conf: "firsthand",
          note: "Use a path Pi can read; image support depends on the provider/model.",
        },
        {
          cmd: "pi --continue",
          desc: "Continue the previous session for this project.",
          conf: "firsthand",
        },
        {
          cmd: "pi --resume",
          desc: "Choose a session to resume.",
          conf: "firsthand",
        },
        {
          cmd: "pi --session <path|id>",
          desc: "Use a particular session file or partial UUID.",
          conf: "firsthand",
        },
        {
          cmd: "pi --fork <path|id>",
          desc: "Fork a session into a new branch/session.",
          conf: "firsthand",
        },
        {
          cmd: "pi --session-id <id>",
          desc: "Use an exact project session ID, creating it if missing.",
          conf: "firsthand",
        },
        {
          cmd: 'pi --name "Refactor auth"',
          desc: "Set a display name for the session.",
          conf: "firsthand",
        },
        {
          cmd: "pi --no-session",
          desc: "Run ephemerally without saving the session.",
          conf: "firsthand",
          note: "Use this for disposable automation, not work you may need to resume.",
        },
        {
          cmd: "pi --session-dir ./tmp/pi-sessions",
          desc: "Override where sessions are stored and found.",
          conf: "firsthand",
        },
        {
          cmd: "/session",
          desc: "Show the active session file, ID, messages, tokens, and cost.",
          conf: "documented",
          doc: `${REPO}/README.md`,
        },
        {
          cmd: "/tree",
          desc: "Navigate to an earlier point and continue from that branch.",
          conf: "documented",
          doc: `${REPO}/README.md`,
        },
      ],
    },
    {
      id: "print-headless",
      label: "Print & headless",
      blurb:
        "Use stdout-friendly modes for scripts, CI, and another process driving Pi.",
      entries: [
        {
          cmd: 'pi -p "List TODOs"',
          desc: "Process a prompt non-interactively and exit.",
          conf: "firsthand",
          note: "Short form of `--print`.",
        },
        {
          cmd: 'pi --mode text -p "Summarize"',
          desc: "Select ordinary text output explicitly.",
          conf: "firsthand",
        },
        {
          cmd: 'pi --mode json -p "Review package.json"',
          desc: "Emit the JSON event stream for a headless consumer.",
          conf: "firsthand",
          note: "JSON mode is an event stream; use RPC when you need bidirectional control.",
        },
        {
          cmd: "pi --mode rpc --no-session",
          desc: "Run the line-oriented JSON RPC interface without persisting a session.",
          conf: "firsthand",
          doc: `${DOCS}/rpc.md`,
        },
        {
          cmd: "pi --export session.jsonl output.html",
          desc: "Export a session file to HTML.",
          conf: "firsthand",
        },
        {
          cmd: 'pi --offline -p "Explain this file"',
          desc: "Disable startup network operations.",
          conf: "firsthand",
          note: "This does not make a provider request offline; it only disables Pi startup network work.",
        },
        {
          cmd: 'pi --no-tools -p "Answer from context only"',
          desc: "Disable built-in and extension tools by default.",
          conf: "firsthand",
        },
        {
          cmd: 'pi --tools read,grep,find,ls -p "Review src/"',
          desc: "Allowlist read-only tools for a review run.",
          conf: "firsthand",
          note: "grep/find/ls are read-only built-ins but are off by default.",
        },
      ],
    },
    {
      id: "provider-model",
      label: "Provider & model",
      blurb:
        "Choose credentials, model routing, thinking depth, and the models available to cycle.",
      entries: [
        {
          cmd: "pi auth <command>",
          desc: "Print credentials or check provider readiness.",
          conf: "firsthand",
        },
        {
          cmd: "pi auth print-api-key --provider openai",
          desc: "Print an API key for an external client.",
          conf: "firsthand",
        },
        {
          cmd: "pi auth print-bearer-token --provider openai-codex",
          desc: "Print or refresh an OAuth bearer token.",
          conf: "firsthand",
        },
        {
          cmd: 'pi --provider openai --model gpt-4o "Refactor this"',
          desc: "Choose a provider and model for one run.",
          conf: "firsthand",
        },
        {
          cmd: 'pi --model openai/gpt-4o "Refactor this"',
          desc: "Use the provider/model-qualified ID without a separate provider flag.",
          conf: "firsthand",
        },
        {
          cmd: 'pi --thinking high "Solve this carefully"',
          desc: "Set thinking level: off, minimal, low, medium, high, xhigh, or max.",
          conf: "firsthand",
        },
        {
          cmd: 'pi --models "anthropic/*,openai/*"',
          desc: "Limit Ctrl+P model cycling to matching patterns.",
          conf: "firsthand",
          note: "Patterns support globs and fuzzy matching; a model may also carry `:thinking`.",
        },
        {
          cmd: "/model",
          desc: "Switch models inside an interactive session.",
          conf: "documented",
          doc: `${REPO}/README.md`,
        },
        {
          cmd: "/scoped-models",
          desc: "Enable or disable models used by Ctrl+P cycling.",
          conf: "documented",
          doc: `${REPO}/README.md`,
        },
        {
          cmd: "export ANTHROPIC_API_KEY=…",
          desc: "Provide a provider credential through its documented environment variable.",
          conf: "firsthand",
          note: "Pi also supports OAuth/login and many provider-specific variables; never commit secrets.",
        },
      ],
    },
    {
      id: "settings-keybindings",
      label: "Settings & keybindings",
      blurb:
        "Put durable preferences in the right scope and discover or remap the TUI controls.",
      entries: [
        {
          cmd: "pi config",
          desc: "Open the TUI for enabling/disabling package resources.",
          conf: "firsthand",
          note: "Tab switches between scopes.",
        },
        {
          cmd: "/settings",
          desc: "Edit common interactive settings.",
          conf: "documented",
          doc: `${DOCS}/settings.md`,
        },
        {
          cmd: "~/.pi/agent/settings.json",
          desc: "Global settings for all projects.",
          conf: "documented",
          doc: `${DOCS}/settings.md`,
        },
        {
          cmd: ".pi/settings.json",
          desc: "Project settings that override global settings.",
          conf: "documented",
          doc: `${DOCS}/settings.md`,
          note: "Nested objects merge; project-local resources may trigger a trust prompt.",
        },
        {
          cmd: "~/.pi/agent/keybindings.json",
          desc: "Customize interactive keybindings.",
          conf: "documented",
          doc: `${DOCS}/keybindings.md`,
        },
        {
          cmd: "/hotkeys",
          desc: "Show the full active keyboard shortcut list.",
          conf: "documented",
          doc: `${REPO}/README.md`,
        },
        {
          cmd: "Ctrl+L / Ctrl+P / Shift+Tab",
          desc: "Open the model selector / cycle models / cycle thinking level.",
          conf: "documented",
          doc: `${REPO}/README.md`,
        },
        {
          cmd: "Escape / Escape twice",
          desc: "Cancel the current operation / open the session tree.",
          conf: "documented",
          doc: `${REPO}/README.md`,
        },
        {
          cmd: "Ctrl+O / Ctrl+T",
          desc: "Collapse tool output / thinking blocks.",
          conf: "documented",
          doc: `${REPO}/README.md`,
        },
      ],
    },
    {
      id: "extensions-skills",
      label: "Extensions, skills & packages",
      blurb:
        "Extend Pi deliberately: skills guide the model, extensions add code, and packages distribute resources.",
      entries: [
        {
          cmd: "pi install npm:@org/package@1.0.0",
          desc: "Install an extension/package and add it to settings.",
          conf: "firsthand",
          note: "Use `-l` for project-local installation.",
        },
        {
          cmd: "pi install git:github.com/org/repo@v1",
          desc: "Install a package from a Git source.",
          conf: "firsthand",
        },
        {
          cmd: "pi list",
          desc: "List installed packages and resources from user and project settings.",
          conf: "firsthand",
        },
        {
          cmd: "pi update [source|self|pi]",
          desc: "Update Pi, installed packages, or model catalogs.",
          conf: "firsthand",
        },
        {
          cmd: "pi remove <source>",
          desc: "Remove a package source from settings.",
          conf: "firsthand",
          note: "Alias: `pi uninstall`; add `-l` for project scope.",
        },
        {
          cmd: "pi -e ./extension.ts",
          desc: "Load an extension source for one run.",
          conf: "firsthand",
          note: "Paths, npm, and git sources are supported; use auto-discovered locations for extensions you keep.",
        },
        {
          cmd: "pi --skill ./skills/review",
          desc: "Load a skill file or directory for one run.",
          conf: "firsthand",
        },
        {
          cmd: "pi --no-extensions --no-skills",
          desc: "Disable extension discovery and skills discovery.",
          conf: "firsthand",
          note: "Explicit `-e` paths still load when discovery is disabled.",
        },
        {
          cmd: "~/.pi/agent/extensions/  ·  .pi/extensions/",
          desc: "Global and project-local auto-discovery locations for TypeScript extensions.",
          conf: "documented",
          doc: `${DOCS}/extensions.md`,
        },
        {
          cmd: "~/.pi/agent/skills/  ·  ~/.agents/skills/  ·  .pi/skills/  ·  .agents/skills/",
          desc: "Common user and project skill locations; project `.agents/skills/` directories are also searched through ancestors.",
          conf: "documented",
          doc: `${DOCS}/skills.md`,
        },
        {
          cmd: "/skill:<name>",
          desc: "Invoke a loaded skill as a slash command.",
          conf: "documented",
          doc: `${DOCS}/skills.md`,
          note: "Skill commands are enabled by default via `enableSkillCommands`.",
        },
        {
          cmd: "/reload",
          desc: "Reload keybindings, extensions, skills, prompts, themes, and context files.",
          conf: "documented",
          doc: `${REPO}/README.md`,
        },
      ],
    },
    {
      id: "compaction-context",
      label: "Compaction & context",
      blurb:
        "Keep long sessions useful by understanding what is loaded, summarized, and retained.",
      entries: [
        {
          cmd: "/compact [instructions]",
          desc: "Manually summarize older context, optionally steering the summary.",
          conf: "documented",
          doc: `${DOCS}/compaction.md`,
        },
        {
          cmd: "compaction.enabled: true",
          desc: "Enable automatic compaction when context approaches its limit.",
          conf: "documented",
          doc: `${DOCS}/settings.md`,
        },
        {
          cmd: "compaction.reserveTokens: 16384",
          desc: "Reserve response space before auto-compaction triggers.",
          conf: "documented",
          doc: `${DOCS}/compaction.md`,
        },
        {
          cmd: "compaction.keepRecentTokens: 20000",
          desc: "Keep roughly this many recent tokens out of the summary.",
          conf: "documented",
          doc: `${DOCS}/compaction.md`,
        },
        {
          cmd: "/tree",
          desc: "Navigate branches; Pi can summarize a branch when switching context.",
          conf: "documented",
          doc: `${DOCS}/compaction.md`,
        },
        {
          cmd: "pi --no-context-files",
          desc: "Disable discovery/loading of AGENTS.md, AGENTS.override.md, and CLAUDE.md files.",
          conf: "firsthand",
          note: "This is useful for isolating unexpected project instructions.",
        },
        {
          cmd: "AGENTS.md / CLAUDE.md",
          desc: "Context files Pi discovers and loads unless disabled.",
          conf: "firsthand",
        },
      ],
    },
    {
      id: "rpc-automation",
      label: "RPC & automation",
      blurb:
        "Drive Pi from another process while retaining structured control over prompts, events, and session state.",
      entries: [
        {
          cmd: "pi --mode rpc --no-session",
          desc: "Start the JSON-lines RPC process for a language-agnostic client.",
          conf: "documented",
          doc: `${DOCS}/rpc.md`,
        },
        {
          cmd: '{"type":"prompt","message":"Run tests"}',
          desc: "Send a prompt message to an RPC session.",
          conf: "documented",
          doc: `${DOCS}/rpc.md`,
          note: "The RPC client owns the UI; do not assume interactive TUI commands work over RPC.",
        },
        {
          cmd: '{"type":"compact","customInstructions":"Keep commands and failures"}',
          desc: "Request compaction over RPC with custom instructions.",
          conf: "documented",
          doc: `${DOCS}/rpc.md`,
        },
        {
          cmd: "get_commands",
          desc: "RPC command for discovering extension, prompt-template, and skill commands.",
          conf: "documented",
          doc: `${DOCS}/rpc.md`,
        },
        {
          cmd: "--mode json",
          desc: "Emit a one-way JSON event stream; extensions run without interactive UI.",
          conf: "firsthand",
          note: "For bidirectional automation, use RPC.",
        },
        {
          cmd: "PI_CODING_AGENT_DIR=…",
          desc: "Override Pi’s config directory (default `~/.pi/agent`).",
          conf: "firsthand",
        },
        {
          cmd: "PI_CODING_AGENT_SESSION_DIR=…",
          desc: "Set the session storage directory unless `--session-dir` overrides it.",
          conf: "firsthand",
        },
        {
          cmd: "PI_OFFLINE=1",
          desc: "Disable startup network operations.",
          conf: "firsthand",
        },
      ],
    },
    {
      id: "safety",
      label: "Safety caveats",
      blurb:
        "The useful defaults are powerful; make trust boundaries and tool access explicit before automation.",
      entries: [
        {
          cmd: "pi --approve",
          desc: "Trust project-local files and resources for this run.",
          conf: "firsthand",
          note: "This is project trust, not a sandbox or command-approval mechanism. Only use when you have inspected project-local settings, skills, and extensions.",
        },
        {
          cmd: "pi --no-approve",
          desc: "Ignore trust-protected project-local files and resources for this run.",
          note: "This is project trust, not a sandbox or command-approval mechanism.",
          conf: "firsthand",
        },
        {
          cmd: "pi --exclude-tools bash,write",
          desc: "Denylist dangerous tools while retaining the rest.",
          conf: "firsthand",
        },
        {
          cmd: "pi --no-builtin-tools",
          desc: "Disable built-in tools while retaining extension/custom tools.",
          conf: "firsthand",
          note: "That can still leave powerful extension tools available.",
        },
        {
          cmd: "pi --no-context-files --no-extensions --no-skills",
          desc: "Start with project instructions and customization discovery disabled.",
          conf: "firsthand",
          note: "Use as a troubleshooting/isolation baseline, not as a security guarantee.",
        },
        {
          cmd: "inspect before `pi install`",
          desc: "Review package source and pin a trusted version before installing.",
          conf: "documented",
          doc: `${DOCS}/extensions.md`,
          note: "Official docs warn that extensions run with full system permissions and can execute arbitrary code.",
        },
        {
          cmd: "never commit API keys or session files",
          desc: "Keep credentials and potentially sensitive transcripts outside source control.",
          conf: "documented",
          doc: `${REPO}/README.md`,
          note: "`/share` uploads a private GitHub gist; private does not mean safe for secrets.",
        },
      ],
    },
  ],
};
