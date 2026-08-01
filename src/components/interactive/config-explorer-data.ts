import type { ToolData } from './config-explorer-types';

// Facts sourced from src/content/tool-instructions/<tool>/*.mdx - the same
// verified content that renders in the foundations chapters. If a chapter
// changes, this file needs the matching update.
// Pi facts: keep in sync with src/content/tool-instructions/pi/ and the
// Pi course (esp. models-config/config-files.mdx, context/system-md.mdx).

const CHAPTER = {
  configuration: { label: 'Configuration & profiles', href: '/foundations/configuration/' },
  rules: { label: 'Rules', href: '/foundations/rules/' },
  skills: { label: 'Skills', href: '/foundations/skills/' },
  slashCommands: { label: 'Slash commands', href: '/foundations/slash-commands/' },
  subagents: { label: 'Subagents', href: '/foundations/subagents/' },
  mcp: { label: 'MCP servers', href: '/foundations/mcp-servers/' },
  hooks: { label: 'Hooks', href: '/foundations/hooks/' },
  headless: { label: 'Headless & CI', href: '/foundations/headless/' },
};

export const configExplorerTools: ToolData[] = [
  {
    slug: 'claude-code',
    label: 'Claude Code',
    scopes: [
      {
        label: 'your-project/',
        nodes: [
          {
            id: 'claude-md',
            label: 'CLAUDE.md',
            type: 'file',
            badge: 'committed',
            oneLiner: 'Project rules and conventions Claude reads every session.',
            when: 'Loaded at session start, every session.',
            description:
              'Project-wide guidance: coding conventions, common commands, architecture notes. Layers additively with your user-level `~/.claude/CLAUDE.md`; the more specific file wins on conflict. Can also be nested in subdirectories for guidance that only applies when Claude works there.',
            tips: [
              'Keep it under ~200 lines. Move reference material to skills and path-specific guidance to `.claude/rules/`.',
              'Committed to the repo, so the whole team works from the same assumptions.',
            ],
            chapter: CHAPTER.rules,
          },
          {
            id: 'mcp-json',
            label: '.mcp.json',
            type: 'file',
            badge: 'committed',
            oneLiner: 'Project-scoped MCP servers, shared with the team.',
            when: 'Servers connect at session start.',
            description:
              'Registers the MCP servers this repo depends on - database adapters, issue trackers, browsers. Scope precedence is local > project > user. Servers can fail silently mid-session; use `/mcp` to inspect what is actually connected.',
            chapter: CHAPTER.mcp,
          },
          {
            id: 'dot-claude',
            label: '.claude/',
            type: 'folder',
            oneLiner: 'Everything Claude Code reads that is specific to this project.',
            description:
              'Project-level settings, rules, skills, commands, and subagents. Most of it is meant to be committed; `settings.local.json` is the personal exception.',
            chapter: CHAPTER.configuration,
            children: [
              {
                id: 'settings-json',
                label: 'settings.json',
                type: 'file',
                badge: 'committed',
                oneLiner: 'Shared project settings: permissions, hooks, model defaults.',
                when: 'Read at session start; changes take effect next session.',
                description:
                  'The team\'s enforced configuration - unlike CLAUDE.md, which Claude reads as guidance, these settings are applied by the harness. Layering order: managed > user > project local > project shared. Hooks defined here fire on events like tool use and session start, and every matching hook from every config level runs.',
                exampleIntro:
                  'A PreToolUse hook that vets shell commands before they run:',
                example: `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "scripts/check-bash-command.sh"
      }
    ]
  }
}`,
                chapter: CHAPTER.configuration,
              },
              {
                id: 'settings-local-json',
                label: 'settings.local.json',
                type: 'file',
                badge: 'gitignored',
                oneLiner: 'Your personal overrides for this project, kept out of git.',
                when: 'Read at session start; takes precedence over the shared settings.json.',
                description:
                  'Machine-specific quirks that should not reach teammates: a different model, a noisier hook, an extra debugging MCP server. Sits between managed policy and project-shared settings in the precedence chain.',
                chapter: CHAPTER.configuration,
              },
              {
                id: 'rules-dir',
                label: 'rules/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'Path-scoped rules that load only when Claude touches matching files.',
                when: 'A rule loads when Claude accesses a file matching its `paths:` globs.',
                description:
                  'Markdown rule files with `paths:` frontmatter - the pressure valve that keeps CLAUDE.md small. A rule scoped to `src/api/**` costs zero context until Claude actually edits an API file.',
                exampleIntro: 'A rule that only loads for API code:',
                exampleTitle: '.claude/rules/api.md',
                example: `---
paths: ["src/api/**"]
---
Use Zod for all request validation.`,
                chapter: CHAPTER.rules,
              },
              {
                id: 'skills-dir',
                label: 'skills/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'Reusable procedures invoked as `/name`, by you or by Claude.',
                when: 'Descriptions load at session start; the full body loads on invocation.',
                description:
                  'Each skill is a directory with a SKILL.md plus any supporting files. Frontmatter controls invocation: `disable-model-invocation: true` makes it user-only, `context: fork` runs it in an isolated subagent. Project skills take precedence over user and plugin skills of the same name.',
                exampleIntro: 'Skill frontmatter with the key control fields:',
                exampleTitle: '.claude/skills/deploy/SKILL.md',
                example: `---
name: deploy
description: Run the team's deploy checklist.
disable-model-invocation: false
context: fork
---`,
                chapter: CHAPTER.skills,
              },
              {
                id: 'commands-dir',
                label: 'commands/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'Legacy single-file slash commands.',
                when: 'Indexed at session start; invoked as `/name`.',
                description:
                  'The older form of user-defined commands. Still works, but superseded by skills - same `/name` invocation, plus skills can bundle supporting files. Put new workflows in `skills/` instead.',
                chapter: CHAPTER.slashCommands,
              },
              {
                id: 'agents-dir',
                label: 'agents/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'Custom subagents with their own tools and context window.',
                when: 'Descriptions cached at session start; each agent runs on invocation in a fresh context.',
                description:
                  'One markdown file per subagent, with frontmatter constraining what it can do: `tools` limits tool access, `skills` preloads skills. Precedence when names collide: managed > CLI flag > project > user > plugin.',
                exampleIntro: 'A read-only review agent:',
                exampleTitle: '.claude/agents/code-reviewer.md',
                example: `---
name: code-reviewer
description: Reviews a diff for bugs, performance, and security issues.
tools: [Read, Grep, Glob]
skills: [security-checklist]
---`,
                chapter: CHAPTER.subagents,
              },
            ],
          },
        ],
      },
      {
        label: '~ (home directory)',
        nodes: [
          {
            id: 'home-claude',
            label: '~/.claude/',
            type: 'folder',
            oneLiner: 'Your personal setup, applied across every project.',
            description:
              'User-level counterparts of the project files. Everything here follows you between repos; project files override or extend it per the layering rules.',
            chapter: CHAPTER.configuration,
            children: [
              {
                id: 'home-settings',
                label: 'settings.json',
                type: 'file',
                oneLiner: 'User-wide defaults: permissions, model, theme, hooks, MCP servers.',
                when: 'Read at session start in every project.',
                description:
                  'Your personal baseline. Takes precedence over a project\'s shared settings.json but not over managed org policy or your project-local overrides.',
                chapter: CHAPTER.configuration,
              },
              {
                id: 'home-claude-md',
                label: 'CLAUDE.md',
                type: 'file',
                oneLiner: 'Personal rules applied to every session, in every project.',
                when: 'Loaded at session start alongside the project CLAUDE.md.',
                description:
                  'Your cross-project preferences - style, tone, habits. Layers additively with project rules; the project file wins on conflict by specificity.',
                chapter: CHAPTER.rules,
              },
              {
                id: 'home-skills',
                label: 'skills/',
                type: 'folder',
                oneLiner: 'Personal skills available in every project.',
                when: 'Descriptions load at session start; body on invocation.',
                description:
                  'Same directory-plus-SKILL.md shape as project skills. When a project skill shares a name, the project version wins.',
                chapter: CHAPTER.skills,
              },
              {
                id: 'home-agents',
                label: 'agents/',
                type: 'folder',
                oneLiner: 'Personal subagent definitions available in every project.',
                when: 'Descriptions cached at session start; run on invocation.',
                description:
                  'Same schema as project agents. Project agents of the same name take precedence.',
                chapter: CHAPTER.subagents,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'codex',
    label: 'Codex',
    scopes: [
      {
        label: 'your-project/',
        nodes: [
          {
            id: 'agents-md',
            label: 'AGENTS.md',
            type: 'file',
            badge: 'committed',
            oneLiner: 'Project rules following the open agents.md spec.',
            when: 'Read at session start, every invocation.',
            description:
              'Codex implements the open `agents.md` spec. Files are concatenated from the repo root downward - nested AGENTS.md files appear later in context and override earlier guidance positionally. No `@path` import directives are supported.',
            chapter: CHAPTER.rules,
          },
          {
            id: 'dot-codex',
            label: '.codex/',
            type: 'folder',
            oneLiner: 'Project-level Codex configuration, agents, and hooks.',
            description:
              'Project config only applies once the directory is trusted (`trust_level = "trusted"` under the project\'s entry in config). Holds the TOML config, subagent definitions, and hook bindings.',
            chapter: CHAPTER.configuration,
            children: [
              {
                id: 'config-toml',
                label: 'config.toml',
                type: 'file',
                badge: 'committed',
                oneLiner: 'Project settings and named profiles - Codex\'s signature feature.',
                when: 'Read on invocation; applies only in trusted directories.',
                description:
                  'TOML config with feature flags, MCP server tables (`[mcp_servers.<name>]`, stdio or streamable HTTP), and named profiles - separate config bundles you swap with `codex --profile <name>` at launch. No other tool in scope has profiles.',
                exampleIntro: 'Two profiles: a sandboxed work setup and a full-access one:',
                example: `[profiles.work]
model = "gpt-5-..."
sandbox = "workspace-write"

[profiles.yolo]
model = "gpt-5-..."
sandbox = "danger-full-access"
approval_policy = "never"`,
                chapter: CHAPTER.configuration,
              },
              {
                id: 'codex-agents',
                label: 'agents/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'Project subagents, one TOML file each.',
                when: 'Spawned only when you explicitly ask; dispatched by natural-language request.',
                description:
                  'Standalone TOML files defining subagents. Required fields: `name`, `description`, `developer_instructions`. Optional: `model`, `sandbox_mode`, `mcp_servers`, `skills.config`.',
                exampleIntro: 'A reviewer agent:',
                exampleTitle: '.codex/agents/reviewer.toml',
                example: `name = "reviewer"
description = "Reviews a diff for bugs, performance, and security issues."
developer_instructions = "..."
model = "gpt-5.4"`,
                chapter: CHAPTER.subagents,
              },
              {
                id: 'codex-hooks',
                label: 'hooks.json',
                type: 'file',
                badge: 'committed',
                oneLiner: 'Project-level event hooks.',
                when: 'Registered at session start; fire on matching events.',
                description:
                  'Standalone hook configuration that merges with your user-level hooks. Handlers are `type = "command"` scripts; each event delivers a JSON payload on stdin (session id, cwd, event name, model, and more).',
                chapter: CHAPTER.hooks,
              },
            ],
          },
          {
            id: 'dot-agents',
            label: '.agents/',
            type: 'folder',
            oneLiner: 'Skills following the cross-tool Agent Skills standard.',
            description:
              'Codex walks up from your working directory to the repo root looking for `.agents/skills/`. Skills here are portable to Claude Code and OpenCode with their basic shape intact.',
            chapter: CHAPTER.skills,
            children: [
              {
                id: 'agents-skills',
                label: 'skills/<name>/SKILL.md',
                type: 'file',
                badge: 'committed',
                oneLiner: 'A project skill; invoke via `/skills` or `$name`.',
                when: 'Descriptions indexed at session start; full body loads on invocation.',
                description:
                  'Only `name` and `description` are required in frontmatter. Codex reads Claude Code\'s `disable-model-invocation`, `context: fork`, and `allowed-tools` keys but does not enforce them.',
                chapter: CHAPTER.skills,
              },
              {
                id: 'openai-yaml',
                label: 'skills/<name>/agents/openai.yaml',
                type: 'file',
                badge: 'committed',
                oneLiner: 'Codex-specific sidecar: invocation policy and metadata.',
                when: 'Read when skill descriptions are indexed at session start.',
                description:
                  'Set `policy.allow_implicit_invocation: false` (default true) to stop Codex auto-invoking the skill. Also carries UI metadata and declared MCP/tool dependencies.',
                chapter: CHAPTER.skills,
              },
            ],
          },
        ],
      },
      {
        label: '~ (home directory)',
        nodes: [
          {
            id: 'home-codex',
            label: '~/.codex/',
            type: 'folder',
            oneLiner: 'Your personal Codex setup across all projects.',
            description:
              'User-wide config, rules, prompts, agents, and hooks. Project-level files override or extend these where they overlap.',
            chapter: CHAPTER.configuration,
            children: [
              {
                id: 'home-config-toml',
                label: 'config.toml',
                type: 'file',
                oneLiner: 'User-wide settings, profiles, and MCP servers.',
                when: 'Read on every invocation, in every project.',
                description:
                  'The main personal config: profiles, feature flags, MCP server tables, and optionally an inline `[hooks]` table. Launch with `codex --profile <name>` to pick a bundle.',
                chapter: CHAPTER.configuration,
              },
              {
                id: 'home-agents-md',
                label: 'AGENTS.md',
                type: 'file',
                oneLiner: 'Personal rules applied across all projects.',
                when: 'Read at session start; project AGENTS.md files appear later and override positionally.',
                description:
                  'Your user-level rules layer, concatenated before project files in the agents.md chain.',
                chapter: CHAPTER.rules,
              },
              {
                id: 'home-prompts',
                label: 'prompts/',
                type: 'folder',
                oneLiner: 'Custom prompt templates, invoked as `/name`.',
                when: 'Indexed at session start; invoked from the TUI by filename.',
                description:
                  'Markdown templates with placeholder support: `$1`–`$9` positional, `$ARGUMENTS` for the full tail, named placeholders like `$FILE`. Simpler than skills - and now flagged as deprecated by OpenAI in favor of skills.',
                chapter: CHAPTER.slashCommands,
              },
              {
                id: 'home-codex-agents',
                label: 'agents/',
                type: 'folder',
                oneLiner: 'Personal subagent TOML files, available everywhere.',
                when: 'Dispatched on explicit request.',
                description: 'Same one-agent-per-file TOML schema as project agents.',
                chapter: CHAPTER.subagents,
              },
              {
                id: 'home-codex-hooks',
                label: 'hooks.json',
                type: 'file',
                oneLiner: 'User-level hooks, merged with project hooks.',
                when: 'Registered at session start.',
                description:
                  'Same handler model as project hooks: command scripts receiving JSON event payloads on stdin.',
                exampleIntro: 'A PreToolUse hook in TOML form (inline in config.toml):',
                exampleTitle: '~/.codex/config.toml',
                example: `[[hooks.PreToolUse]]
matcher = "Bash"
[[hooks.PreToolUse.hooks]]
type = "command"
command = "scripts/check-bash-command.sh"`,
                chapter: CHAPTER.hooks,
              },
            ],
          },
          {
            id: 'home-dot-agents',
            label: '~/.agents/skills/',
            type: 'folder',
            oneLiner: 'Personal skills in the cross-tool standard, available everywhere.',
            when: 'Descriptions at session start; body on invocation.',
            description:
              'Your user-level skill repository in the Agent Skills open standard - portable between Codex, Claude Code, and OpenCode.',
            chapter: CHAPTER.skills,
          },
        ],
      },
    ],
  },
  {
    slug: 'copilot',
    label: 'Copilot',
    scopes: [
      {
        label: 'your-project/',
        nodes: [
          {
            id: 'copilot-instructions',
            label: '.github/copilot-instructions.md',
            type: 'file',
            badge: 'committed',
            oneLiner: 'The repo-wide rules file, applied to every Copilot request.',
            when: 'Always on, for every chat and agent request in this repo.',
            description:
              'Copilot\'s flagship rules surface - and the only customization layer that reaches every surface Copilot runs on: VS Code, JetBrains, Visual Studio, chat on GitHub.com, the cloud coding agent, and code review. Layers combine rather than override; on conflict, precedence is personal > repository > organization.',
            tips: [
              'Run `/init` in chat to scaffold this file from your codebase.',
              'Gated by the VS Code setting `github.copilot.chat.codeGeneration.useInstructionFiles`.',
            ],
            chapter: CHAPTER.rules,
          },
          {
            id: 'instructions-dir',
            label: '.github/instructions/',
            type: 'folder',
            badge: 'committed',
            oneLiner: 'Path-scoped rules that apply only where their glob matches.',
            when: 'A file applies when files matching its `applyTo` glob are in play.',
            description:
              '`*.instructions.md` files with an `applyTo` glob in frontmatter - the pressure valve that keeps the repo-wide file small. Optional `excludeAgent` opts a file out of surfaces like code review. One catch: these are read in the IDE and by cloud agents, but not by chat on GitHub.com.',
            exampleIntro: 'A rule scoped to model code:',
            exampleTitle: '.github/instructions/models.instructions.md',
            example: `---
applyTo: "app/models/**/*.rb"
---
Use Active Record validations; never raw SQL in models.`,
            chapter: CHAPTER.rules,
          },
          {
            id: 'cp-agents-md',
            label: 'AGENTS.md',
            type: 'file',
            badge: 'committed',
            oneLiner: 'The cross-tool rules standard - Copilot reads it natively.',
            when: 'Read when the `chat.useAgentsMdFile` setting is enabled.',
            description:
              'The same AGENTS.md that Codex, OpenCode, and Cursor read works here unchanged. Copilot also reads `CLAUDE.md` (repo root, `.claude/CLAUDE.md`, or `CLAUDE.local.md` - gated by `chat.useClaudeMdFile`), so a team already invested in another tool\'s rules file keeps it. Nested AGENTS.md support exists but is experimental.',
            chapter: CHAPTER.rules,
          },
          {
            id: 'prompts-dir',
            label: '.github/prompts/',
            type: 'folder',
            badge: 'committed',
            oneLiner: 'Reusable prompts invoked as `/name` - Copilot\'s slash commands.',
            when: 'On invocation only: `/name` in chat, or "Chat: Run Prompt".',
            description:
              'One `<name>.prompt.md` file per command. Frontmatter picks what runs it - `agent: ask | agent | plan`, or a custom agent\'s name - plus `model` and `tools`. When a prompt file and a custom agent both set `tools`, the prompt file\'s list wins.',
            exampleIntro: 'A prompt that runs in agent mode with scoped tools:',
            exampleTitle: '.github/prompts/add-tests.prompt.md',
            example: `---
name: add-tests
description: Generate unit tests for the selected file
agent: agent
tools: [read, edit, runTests]
---
Write unit tests covering edge cases for the selected file.`,
            chapter: CHAPTER.slashCommands,
          },
          {
            id: 'cp-agents-dir',
            label: '.github/agents/',
            type: 'folder',
            badge: 'committed',
            oneLiner: 'Custom agents: a persona with its own model, tools, and subagents.',
            when: 'Loaded when you select the agent or another agent hands off to it.',
            description:
              'One `<name>.agent.md` per agent - note the extension: these were `.chatmode.md` before a rename, the single biggest churn trap in Copilot content. Frontmatter: `tools`, `model` (one name or a prioritized list), `agents` (which subagents it may call), and `handoffs` for sequential workflows.',
            exampleIntro: 'A reviewer agent:',
            exampleTitle: '.github/agents/db-reviewer.agent.md',
            example: `---
name: db-reviewer
description: Reviews database migration PRs for safety
model: [gpt-5, claude-sonnet]
tools: [read, search]
---
You are a strict reviewer of SQL migrations. Flag destructive DDL.`,
            chapter: CHAPTER.subagents,
          },
          {
            id: 'cp-skills-dir',
            label: '.github/skills/',
            type: 'folder',
            badge: 'committed',
            oneLiner: 'Agent Skills in the cross-tool open standard.',
            when: 'Descriptions indexed up front; a skill\'s body loads on match or `/name`.',
            description:
              'Each skill is a folder with a SKILL.md - the same format the other tools on this page read, so a skill written for Claude Code drops in unchanged. Copilot also reads `.claude/skills/` and `.agents/skills/` in the repo. `disable-model-invocation: true` makes a skill user-only; custom locations via `chat.agentSkillsLocations`.',
            chapter: CHAPTER.skills,
          },
          {
            id: 'vscode-mcp',
            label: '.vscode/mcp.json',
            type: 'file',
            badge: 'committed',
            oneLiner: 'Workspace MCP servers, shared with the team.',
            when: 'Servers start after you confirm trust; tools appear in agent mode.',
            description:
              'A `servers` object, each entry `type: "stdio"` (with `command` and `args`) or `"http"` (with `url`). VS Code asks you to confirm trust before a server first runs, and again when its config changes. Personal servers live in VS Code\'s user configuration instead ("MCP: Open User Configuration").',
            exampleIntro: 'A stdio server:',
            example: `{
  "servers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@github/mcp-server"]
    }
  }
}`,
            chapter: CHAPTER.mcp,
          },
          {
            id: 'setup-steps',
            label: '.github/workflows/copilot-setup-steps.yml',
            type: 'file',
            badge: 'committed',
            oneLiner: 'Environment prep for the cloud coding agent - not a hook.',
            when: 'Runs once per cloud-agent task, before the agent starts.',
            description:
              'Despite the name, this is not a lifecycle hook: it is a GitHub Actions workflow that installs dependencies and preps the sandbox the cloud coding agent works in. It never runs for local VS Code sessions.',
            chapter: CHAPTER.headless,
          },
        ],
      },
      {
        label: 'you (VS Code & github.com)',
        nodes: [
          {
            id: 'vscode-settings',
            label: 'VS Code settings.json',
            type: 'file',
            oneLiner: 'The switchboard: `chat.*` settings decide which files Copilot reads.',
            when: 'Always on, across every workspace.',
            description:
              'Copilot has no dotfile of its own - your personal layer is VS Code\'s user settings. The keys that matter for this map: `chat.useAgentsMdFile`, `chat.useClaudeMdFile`, `chat.instructionsFilesLocations`, `chat.promptFilesLocations`, `chat.agentFilesLocations`, `chat.agentSkillsLocations`, and the `chat.tools.*.autoApprove` permission family.',
            chapter: CHAPTER.configuration,
          },
          {
            id: 'personal-instructions',
            label: 'Personal instructions  (github.com)',
            type: 'file',
            oneLiner: 'Your account-level rules - a setting on github.com, not a file.',
            when: 'Always on, in every repo; the top of the precedence order.',
            description:
              'Set at github.com/settings/copilot and applied to your sessions everywhere. When layers conflict, personal beats repository beats organization - but all applicable layers are concatenated, not replaced.',
            chapter: CHAPTER.rules,
          },
          {
            id: 'org-instructions',
            label: 'Org instructions  (github.com)',
            type: 'file',
            oneLiner: 'Org-wide rules - with a catch almost everyone misses.',
            when: 'Applied only in chat on GitHub.com, the cloud coding agent, and code review.',
            description:
              'Organization custom instructions do not apply in your IDE - not VS Code, not JetBrains. A rule that must hold in the editor has to live in the repository file instead. Orgs also control model allow-lists, content exclusions, and MCP policy from here.',
            chapter: CHAPTER.rules,
          },
          {
            id: 'home-copilot-skills',
            label: '~/.copilot/skills/',
            type: 'folder',
            oneLiner: 'Personal skills available in every repo.',
            when: 'Same lifecycle as project skills: descriptions up front, body on demand.',
            description:
              'Same SKILL.md format as project skills. Copilot also reads `~/.agents/skills/`, the cross-tool location shared with Codex, Cursor, and OpenCode.',
            chapter: CHAPTER.skills,
          },
          {
            id: 'cp-home-claude-md',
            label: '~/.claude/CLAUDE.md',
            type: 'file',
            oneLiner: 'Your user-level Claude Code rules - Copilot reads them too.',
            when: 'Read when `chat.useClaudeMdFile` is enabled.',
            description:
              'Part of Copilot\'s convergence on the shared specs: rules you already maintain for Claude Code apply here without duplication.',
            chapter: CHAPTER.rules,
          },
        ],
      },
    ],
  },
  {
    slug: 'cursor',
    label: 'Cursor',
    scopes: [
      {
        label: 'your-project/',
        nodes: [
          {
            id: 'cu-agents-md',
            label: 'AGENTS.md',
            type: 'file',
            badge: 'committed',
            oneLiner: 'Always-on portable rules; nested files stack, they don\'t replace.',
            when: 'Root file always; a nested AGENTS.md joins in for work in its subtree.',
            description:
              'Plain markdown, no frontmatter - the cross-tool standard shared with Codex, OpenCode, and Copilot. Nested files concatenate with their ancestors, and the deeper file wins on direct conflict. When you need rules that load conditionally instead of always, you graduate to `.cursor/rules/`.',
            chapter: CHAPTER.rules,
          },
          {
            id: 'cursorrules',
            label: '.cursorrules',
            type: 'file',
            badge: 'committed',
            oneLiner: 'The legacy single-file rules format - still honored, no longer recommended.',
            when: 'Always loaded if present, as one undifferentiated block.',
            description:
              'Cursor\'s original rules file, from before `.cursor/rules/` existed; current docs no longer mention it. Migration path: always-true lines move to AGENTS.md, conditional lines become scoped `.mdc` rules.',
            chapter: CHAPTER.rules,
          },
          {
            id: 'dot-cursor',
            label: '.cursor/',
            type: 'folder',
            oneLiner: 'Everything Cursor reads that is specific to this repo.',
            description:
              'Rules, skills, commands, subagents, MCP servers, and hooks - all committed so the whole team shares them. User Rules and Team Rules have no file here: those live in Cursor Settings and the team dashboard.',
            chapter: CHAPTER.configuration,
            children: [
              {
                id: 'cu-rules-dir',
                label: 'rules/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'Structured `.mdc` rules whose frontmatter controls when they attach.',
                when: 'Per rule: always, glob-matched, agent-judged, or manual via `@RuleName`.',
                description:
                  'Three frontmatter fields - `description`, `globs`, `alwaysApply` - combine into four rule types: Always, Apply Intelligently (the agent judges by description), Apply to Specific Files (globs), and Apply Manually. The glob type is not deterministic: it attaches when a matching file enters the agent\'s context, not merely when it\'s open in the editor.',
                tips: [
                  'Never trust a glob rule for a non-negotiable convention - promote it to `alwaysApply: true` or into AGENTS.md.',
                ],
                exampleIntro: 'A glob-scoped rule:',
                exampleTitle: '.cursor/rules/api-validation.mdc',
                example: `---
description: Validate every API request body with a Zod schema
globs: ["src/api/**"]
alwaysApply: false
---
All handlers under src/api/ validate input with a Zod
schema before any business logic.`,
                chapter: CHAPTER.rules,
              },
              {
                id: 'cu-skills-dir',
                label: 'skills/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'Agent Skills - procedures the agent loads when the work matches.',
                when: 'Auto-loaded when the task matches the description, or invoked as `/skill-name`.',
                description:
                  'Folders with a SKILL.md; `paths` globs scope when a skill is a candidate, and `disable-model-invocation: true` makes it manual-only. Cursor also reads `.agents/skills/` plus legacy `.claude/skills/` and `.codex/skills/` - a skill authored for another tool works unchanged.',
                chapter: CHAPTER.skills,
              },
              {
                id: 'cu-commands-dir',
                label: 'commands/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'Fixed prompt templates fired as `/name` in chat.',
                when: 'On invocation; the filename is the command name.',
                description:
                  'Plain markdown, one file per command. Argument passing is limited - no `$ARGUMENTS`-style templating - so write commands that act on current context (the staged diff, the open file) rather than expecting parameters. Team Commands can also be distributed from the dashboard with no local file.',
                exampleIntro: 'A command that works on the staged diff:',
                exampleTitle: '.cursor/commands/commit-msg.md',
                example: `Write a conventional-commits message for the currently
staged diff. Subject under 60 characters, imperative mood.`,
                chapter: CHAPTER.slashCommands,
              },
              {
                id: 'cu-agents-dir',
                label: 'agents/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'Subagents with isolated context windows, runnable in parallel.',
                when: 'Auto-delegated by the main agent, invoked as `/name`, or mentioned by name.',
                description:
                  'One markdown file per subagent; frontmatter covers `name`, `description`, `model`, `readonly`, and `is_background`. Project definitions beat user-level ones on a name collision, and Cursor also discovers `.claude/agents/` and `.codex/agents/`.',
                chapter: CHAPTER.subagents,
              },
              {
                id: 'cu-mcp-json',
                label: 'mcp.json',
                type: 'file',
                badge: 'committed',
                oneLiner: 'MCP servers for this repo - stdio, SSE, or streamable HTTP.',
                when: 'Servers connect at session start; every enabled server\'s tool schemas load into context.',
                description:
                  'stdio servers get `command`, `args`, and `env`; remote servers get `url` and `headers`. The project file resolves before your user file. One-click installs from the MCP Marketplace or cursor.directory write into an mcp.json for you - check which scope it landed in.',
                exampleIntro: 'A local database server:',
                example: `{
  "mcpServers": {
    "budgetcli-db": {
      "command": "uvx",
      "args": ["postgres-mcp", "--access-mode=restricted"],
      "env": {
        "DATABASE_URI": "postgresql://localhost:5432/budgetcli_dev"
      }
    }
  }
}`,
                chapter: CHAPTER.mcp,
              },
              {
                id: 'cu-hooks-json',
                label: 'hooks.json',
                type: 'file',
                badge: 'committed',
                oneLiner: 'Deterministic gates on the agent lifecycle - the broadest event surface in scope.',
                when: 'Fires at the named lifecycle event, every time, whatever the model decided.',
                description:
                  'Around 21 events across agent, Tab, and app lifecycle. `beforeShellExecution`, `beforeReadFile`, and `beforeMCPExecution` are the policy workhorses - and the latter two have no analog in Claude Code or Codex. Hooks read JSON on stdin and answer with `permission: allow | deny | ask`; exit 2 blocks, other non-zero exits fail open, so test the deny path.',
                exampleIntro: 'A gate on shell commands:',
                example: `{
  "version": 1,
  "hooks": {
    "beforeShellExecution": [
      { "command": "./.cursor/hooks/protect-ledger.sh" }
    ]
  }
}`,
                chapter: CHAPTER.hooks,
              },
            ],
          },
        ],
      },
      {
        label: '~ (home directory)',
        nodes: [
          {
            id: 'home-cursor',
            label: '~/.cursor/',
            type: 'folder',
            oneLiner: 'Your personal Cursor setup across every project.',
            description:
              'User-level counterparts of the project files. Note what\'s absent: there is no `~/.cursor/rules/` - personal rules are settings-managed, not a dotfile.',
            chapter: CHAPTER.configuration,
            children: [
              {
                id: 'cu-home-mcp',
                label: 'mcp.json',
                type: 'file',
                oneLiner: 'Personal MCP servers, available in every repo.',
                when: 'Servers connect at session start; resolved after the project file.',
                description:
                  'Same schema as the project file - the home for tools that are your habit rather than the repo\'s business. On Linux the path is `~/.config/cursor/mcp.json`.',
                chapter: CHAPTER.mcp,
              },
              {
                id: 'cu-home-hooks',
                label: 'hooks.json',
                type: 'file',
                oneLiner: 'Personal hooks with the same event surface as project hooks.',
                when: 'Fires at the named lifecycle event, in every project.',
                description:
                  'Same schema and verdict channels as the project file. Enterprise plans can also distribute hooks centrally from the dashboard, with no local file.',
                chapter: CHAPTER.hooks,
              },
              {
                id: 'cu-home-skills',
                label: 'skills/',
                type: 'folder',
                oneLiner: 'Personal skills that follow you across projects.',
                when: 'Same lifecycle as project skills.',
                description:
                  'Cursor also reads `~/.agents/skills/` and the legacy `~/.claude/skills/` and `~/.codex/skills/` at user scope.',
                chapter: CHAPTER.skills,
              },
              {
                id: 'cu-home-agents',
                label: 'agents/',
                type: 'folder',
                oneLiner: 'Personal subagent definitions.',
                when: 'Available everywhere; project definitions win on a name collision.',
                description: 'Same frontmatter schema as project subagents.',
                chapter: CHAPTER.subagents,
              },
            ],
          },
          {
            id: 'cu-user-rules',
            label: 'User Rules  (in-app, no file)',
            type: 'file',
            oneLiner: 'Personal working-style rules, set in Cursor Settings - not a dotfile.',
            when: 'Always on, in every project.',
            description:
              'Your personal rules layer lives in Cursor Settings → Rules; there is no home-directory file for it. Team Rules and Team Commands are the same idea at org scope, distributed from the Cursor dashboard on Team and Enterprise plans. All rule layers are additive - none cancels another.',
            chapter: CHAPTER.rules,
          },
        ],
      },
    ],
  },
  {
    slug: 'opencode',
    label: 'OpenCode',
    scopes: [
      {
        label: 'your-project/',
        nodes: [
          {
            id: 'opencode-json',
            label: 'opencode.json',
            type: 'file',
            badge: 'committed',
            oneLiner: 'The primary config file: MCP, LSP, instructions, agents.',
            when: 'Read on invocation; project config has highest precedence.',
            description:
              'JSON config declaring MCP servers (`mcp`, with `type: "local"` or `type: "remote"`), LSP servers (`lsp` - the agent gets diagnostics as feedback without an MCP wrapper), extra rule file paths or globs (`instructions`), and agent customization. Sources merge rather than replace; project values win where they overlap.',
            tips: [
              'The `instructions` field is the workaround for AGENTS.md not supporting `@path` imports - list extra rule files here.',
              '`OPENCODE_CONFIG` / `OPENCODE_CONFIG_DIR` env vars override the default locations, useful in CI.',
            ],
            chapter: CHAPTER.configuration,
          },
          {
            id: 'oc-agents-md',
            label: 'AGENTS.md',
            type: 'file',
            badge: 'committed',
            oneLiner: 'The rules layer - OpenCode has no separate rules file.',
            when: 'Read at session start, every invocation.',
            description:
              'Follows the open `agents.md` spec and is portable from Codex unchanged. Project discovery walks upward and uses the first matching project instruction file; it does not stack every ancestor\'s AGENTS.md. Use `instructions` when you need an explicit additive set.',
            chapter: CHAPTER.rules,
          },
          {
            id: 'dot-opencode',
            label: '.opencode/',
            type: 'folder',
            oneLiner: 'Project-scoped skills, commands, and agents.',
            description:
              'OpenCode\'s native asset directory. Note that OpenCode also cross-reads `.claude/skills/` and `.agents/skills/` from the same repo - see those entries below.',
            chapter: CHAPTER.configuration,
            children: [
              {
                id: 'oc-skills',
                label: 'skills/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'Native OpenCode skills, loaded on demand via the `skill` tool.',
                when: 'Names and descriptions at session start; the body loads on demand.',
                description:
                  'Frontmatter requires `name` (must match the directory) and `description`. There is no equivalent to Claude Code\'s `disable-model-invocation` or `context: fork` - the agent sees every skill and loads bodies as needed.',
                chapter: CHAPTER.skills,
              },
              {
                id: 'oc-commands',
                label: 'commands/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'Slash commands - a separate primitive from skills here.',
                when: 'Indexed at session start; invoked as `/name`.',
                description:
                  'Markdown files with optional frontmatter. Commands are the user-triggered slash surface; skills are the agent-loaded procedure surface. Supports `$ARGUMENTS` and positional `$1`, `$2`, … tokens.',
                chapter: CHAPTER.slashCommands,
              },
              {
                id: 'oc-agents',
                label: 'agents/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'Subagents and custom primary agents.',
                when: 'Subagents run on `@mention`; primary agents are selected at launch.',
                description:
                  'Markdown with rich frontmatter: `mode` (`subagent` | `primary` | `all`), per-agent `model` and `temperature`, a `permission` object with glob support, `steps` to cap iterations, and `hidden` to keep it out of autocomplete. Custom primary agents are OpenCode\'s answer to Codex profiles.',
                exampleIntro: 'A read-only security auditor:',
                exampleTitle: '.opencode/agents/auditor.md',
                example: `---
description: Read-only auditor for security findings
mode: subagent
model: anthropic/claude-sonnet-4-6
permission:
  edit: deny
  bash: { "*": ask, "git *": allow }
  skill: { "security-*": allow }
---`,
                chapter: CHAPTER.subagents,
              },
            ],
          },
          {
            id: 'oc-cross-claude',
            label: '.claude/skills/  (cross-read)',
            type: 'folder',
            badge: 'committed',
            oneLiner: 'OpenCode reads Claude Code\'s skill directory directly.',
            when: 'Same lifecycle as native skills: descriptions at start, body on demand.',
            description:
              'A skill authored for Claude Code generally works unchanged; OpenCode ignores frontmatter keys it doesn\'t know. Precedence when names collide: `.opencode/skills/` > `.claude/skills/` > `.agents/skills/`.',
            chapter: CHAPTER.skills,
          },
          {
            id: 'oc-cross-agents',
            label: '.agents/skills/  (cross-read)',
            type: 'folder',
            badge: 'committed',
            oneLiner: 'Skills in the cross-tool standard, shared with Codex.',
            when: 'Walked up from cwd to the git worktree root at session start.',
            description:
              'The same `.agents/skills/` directories Codex reads. One skill directory can serve OpenCode, Codex, and Claude Code at once.',
            chapter: CHAPTER.skills,
          },
        ],
      },
      {
        label: '~ (home directory)',
        nodes: [
          {
            id: 'home-opencode',
            label: '~/.config/opencode/',
            type: 'folder',
            oneLiner: 'Your personal OpenCode setup across all projects.',
            description:
              'Global counterparts of the project files: `opencode.json`, `AGENTS.md`, and skills/commands/agents directories.',
            chapter: CHAPTER.configuration,
            children: [
              {
                id: 'home-oc-json',
                label: 'opencode.json',
                type: 'file',
                oneLiner: 'User-wide MCP, LSP, instructions, and agent settings.',
                when: 'Read on invocation; overridden by project config and managed policy.',
                description:
                  'Same schema as the project file. Merges with project config; project values win on overlap.',
                chapter: CHAPTER.configuration,
              },
              {
                id: 'home-oc-agents-md',
                label: 'AGENTS.md',
                type: 'file',
                oneLiner: 'Personal rules applied alongside project rules.',
                when: 'Read at session start for every project.',
                description:
                  'Global rules are combined with the selected project instruction file. Within each category, the first matching filename wins (for example, AGENTS.md before CLAUDE.md).',
                chapter: CHAPTER.rules,
              },
              {
                id: 'home-oc-skills',
                label: 'skills/',
                type: 'folder',
                oneLiner: 'Personal skills available in every project.',
                when: 'Descriptions at session start; body on demand.',
                description:
                  'Same frontmatter schema as project skills. OpenCode also cross-reads `~/.claude/skills/` and `~/.agents/skills/` at the user level.',
                chapter: CHAPTER.skills,
              },
              {
                id: 'home-oc-commands',
                label: 'commands/',
                type: 'folder',
                oneLiner: 'Personal slash commands.',
                when: 'Indexed at session start; invoked as `/name`.',
                description: 'Same syntax and placeholder support as project commands.',
                chapter: CHAPTER.slashCommands,
              },
              {
                id: 'home-oc-agents',
                label: 'agents/',
                type: 'folder',
                oneLiner: 'Personal agent definitions.',
                when: 'Subagents on `@mention`; primary agents at launch.',
                description:
                  'Same frontmatter schema as project agents. OpenCode also ships three built-in subagents: `general` (full access), `explore` (read-only codebase), and `scout` (read-only docs and dependencies).',
                chapter: CHAPTER.subagents,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'pi',
    label: 'Pi',
    scopes: [
      {
        label: 'your-project/',
        nodes: [
          {
            id: 'pi-agents-md',
            label: 'AGENTS.md',
            type: 'file',
            badge: 'committed',
            oneLiner: 'Project context collected on a directory walk - matching files are concatenated.',
            when: 'Collected at startup: global first, then each parent directory down to your cwd.',
            description:
              'Injected into the system prompt\'s project-context block as guidance - deliberately weaker than `APPEND_SYSTEM.md`, which is for rules the model must not treat as optional. Pi concatenates every matching file on the walk in order; closer files appear later but do not implement a formal override rule. Disable with `--no-context-files`.',
            chapter: CHAPTER.rules,
          },
          {
            id: 'dot-pi',
            label: '.pi/',
            type: 'folder',
            oneLiner: 'Everything project-specific - and Pi loads none of it until you trust the repo.',
            description:
              'The project mirror of `~/.pi/agent/`. Because a project\'s settings, extensions, and skills can execute code the moment they load, Pi stops and asks before honoring any of it the first time you open the repo; the answer persists in your global `trust.json`.',
            chapter: CHAPTER.configuration,
            children: [
              {
                id: 'pi-settings',
                label: 'settings.json',
                type: 'file',
                badge: 'committed',
                oneLiner: 'Project overrides, deep-merged key-by-key into your global settings.',
                when: 'Read at startup, once the project is trusted.',
                description:
                  'The project file doesn\'t replace the global one - it deep-merges into it, key by key, on every nested object. Declare only what this repo overrides; everything else falls through from `~/.pi/agent/settings.json`. This is the mechanism behind the "I changed the project file and nothing happened" afternoon: you edited a key that wasn\'t the one winning.',
                exampleIntro: 'A project file that only tightens one nested key:',
                example: `// ~/.pi/agent/settings.json
{ "compaction": { "enabled": true, "reserveTokens": 16384 } }

// .pi/settings.json
{ "compaction": { "reserveTokens": 8192 } }

// effective for this project
{ "enabled": true, "reserveTokens": 8192 }`,
                chapter: CHAPTER.configuration,
              },
              {
                id: 'pi-append-system',
                label: 'APPEND_SYSTEM.md',
                type: 'file',
                badge: 'committed',
                oneLiner: 'Rules appended to the system prompt itself - Pi\'s strongest rules layer.',
                when: 'Appended at the start of every session in this repo.',
                description:
                  'Where AGENTS.md is helpful context, this file lands inside the system prompt and is stated with full force - while keeping everything the default prompt does well. Its sibling `SYSTEM.md` replaces the default prompt wholesale instead: that\'s for building a fundamentally different agent, at the cost of rewriting the built-in tool guidance yourself.',
                chapter: CHAPTER.rules,
              },
              {
                id: 'pi-extensions',
                label: 'extensions/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'TypeScript extensions: custom tools, commands, and hooks in one API.',
                when: 'Scanned at startup - but only after the project is trusted.',
                description:
                  'Each extension is a `.ts` file (or a directory with an `index.ts`) exporting a function over `ExtensionAPI` - no build step; Pi transpiles on load. This one surface carries what other tools split across MCP configs, hook files, and command directories. An untrusted clone skips the folder silently.',
                tips: [
                  '`pi -e ./file.ts` loads one extension for a single run - the fast way to try an idea.',
                  '`/reload` picks up extension edits without losing the conversation.',
                ],
                exampleIntro: 'The smallest useful extension:',
                exampleTitle: '.pi/extensions/stash-tools.ts',
                example: `import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.notify("stash-tools loaded", "info");
  });
}`,
                chapter: CHAPTER.hooks,
              },
              {
                id: 'pi-skills',
                label: 'skills/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'SKILL.md procedures, loaded progressively when the work matches.',
                when: 'Names and descriptions enter the system prompt at startup; the body loads only when read.',
                description:
                  'Same SKILL.md format as the other tools, with one deliberate deviation: the `name` doesn\'t have to match the directory, so a shared skills repo can serve several tools. Invoke explicitly with `/skill:name`, or let the description match free-text requests.',
                chapter: CHAPTER.skills,
              },
              {
                id: 'pi-prompts',
                label: 'prompts/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'Prompt templates fired as `/name` - manual only, never model-invoked.',
                when: 'Discovered at startup (trust-gated); invoked by typing `/` plus the filename.',
                description:
                  'Markdown with positional `$1`/`$2` arguments, `$ARGUMENTS`, and default fallbacks. The dividing line from a skill: a template\'s description is read by you, in autocomplete; a skill\'s description is read by the model to decide invocation. If it should fire on its own, it wanted to be a skill.',
                exampleIntro: 'A template with a defaulted argument:',
                exampleTitle: '.pi/prompts/triage-fetch.md',
                example: `---
description: Triage a batch of failed fetch-worker jobs
argument-hint: "[since]"
---
Look at the fetch-worker failures \${1:-in the last 24 hours}.
For each failed URL, report the error and one recommended
next step (retry, skip, or needs a new source adapter).`,
                chapter: CHAPTER.slashCommands,
              },
              {
                id: 'pi-themes',
                label: 'themes/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'TUI color themes as JSON, hot-reloaded while active.',
                when: 'Discovered at startup (trust-gated); the active theme reloads on edit.',
                description:
                  '51 color tokens per theme, with a `vars` block so you name a color once and reference it everywhere. Values can be hex, a 256-color index, or empty to fall back to the terminal default.',
                chapter: CHAPTER.configuration,
              },
            ],
          },
          {
            id: 'pi-cross-agents',
            label: '.agents/skills/  (cross-read)',
            type: 'folder',
            badge: 'committed',
            oneLiner: 'The cross-tool skills standard - the same directories the other tools read.',
            when: 'Checked alongside `.pi/skills/`, plus ancestor directories up to the repo root.',
            description:
              'One skills directory can serve Pi, Claude Code, Codex, Cursor, OpenCode, and Copilot at once. Pi\'s relaxed name-matching rule exists partly for this: a shared skills repo doesn\'t need renaming per tool.',
            chapter: CHAPTER.skills,
          },
        ],
      },
      {
        label: '~ (home directory)',
        nodes: [
          {
            id: 'home-pi',
            label: '~/.pi/agent/',
            type: 'folder',
            oneLiner: 'Your entire personal Pi setup - settings, models, credentials, trust.',
            description:
              'The global tier of Pi\'s two-tier config. Notably absent from this map: no `mcp.json` and no `agents/` directory - MCP arrives via community extensions, and a subagent is just `pi` spawning `pi`. Mirrored `prompts/` and `themes/` directories work exactly like their project copies.',
            chapter: CHAPTER.configuration,
            children: [
              {
                id: 'home-pi-settings',
                label: 'settings.json',
                type: 'file',
                oneLiner: 'Global defaults for every project - the base of the deep merge.',
                when: 'Read at startup, in every project.',
                description:
                  'The fields worth knowing on sight: `defaultProvider` and `defaultModel`, `defaultThinkingLevel` (`off` through `xhigh`), `enabledModels` (the allow-list `Ctrl+P` cycles through), resource-path arrays (`packages`, `extensions`, `skills`, `prompts`, `themes`), retry policy, and `defaultProjectTrust`.',
                chapter: CHAPTER.configuration,
              },
              {
                id: 'home-pi-models',
                label: 'models.json',
                type: 'file',
                oneLiner: 'Provider and model definitions: base URLs, API shapes, cost metadata.',
                when: 'Reloads live; changes apply the next time you open `/model`.',
                description:
                  'Where custom and local providers live - the file that makes Pi provider-agnostic. Per-model overrides and context metadata sit alongside each definition.',
                chapter: CHAPTER.configuration,
              },
              {
                id: 'home-pi-auth',
                label: 'auth.json',
                type: 'file',
                oneLiner: 'Stored credentials - the one pure-secret file, kept at 0600.',
                when: 'Written by `/login` for OAuth; consulted whenever a provider needs a key.',
                description:
                  'Pi splits config into settings you tweak often, credentials you never want on screen, and trust decisions made once per repo - three files, so a stray `cat` of your config doesn\'t also dump your API keys.',
                chapter: CHAPTER.configuration,
              },
              {
                id: 'home-pi-trust',
                label: 'trust.json',
                type: 'file',
                oneLiner: 'Which project directories you\'ve agreed to trust. Global only - no project mirror.',
                when: 'Consulted the first time Pi finds project-local settings, extensions, or skills.',
                description:
                  'Project-local config can execute code the moment it loads, so Pi stops and asks once per repo and records the answer here. `defaultProjectTrust` and the `--approve`/`--no-approve` flags skip the prompt on purpose for scripted runs.',
                chapter: CHAPTER.configuration,
              },
              {
                id: 'home-pi-extensions',
                label: 'extensions/',
                type: 'folder',
                oneLiner: 'Personal extensions loaded in every project.',
                when: 'Scanned at startup; not trust-gated - you put them here yourself.',
                description:
                  'Same shape as project extensions. A tool you build for one repo belongs in that repo\'s `.pi/extensions/` instead, so it doesn\'t clutter every other session.',
                chapter: CHAPTER.hooks,
              },
              {
                id: 'home-pi-skills',
                label: 'skills/',
                type: 'folder',
                oneLiner: 'Personal skills, highest tier in the discovery order.',
                when: 'Descriptions at startup; body on demand.',
                description:
                  'Checked first, alongside `~/.agents/skills/`, before any project location.',
                chapter: CHAPTER.skills,
              },
            ],
          },
          {
            id: 'pi-home-agents-skills',
            label: '~/.agents/skills/',
            type: 'folder',
            oneLiner: 'Personal skills in the cross-tool standard, shared with the other tools.',
            when: 'Descriptions at startup; body on demand.',
            description:
              'The same user-level directory Codex, Cursor, OpenCode, and Copilot read - author a skill once, use it everywhere.',
            chapter: CHAPTER.skills,
          },
        ],
      },
    ],
  },
];
