import type { ToolData } from './config-explorer-types';

// Facts sourced from src/content/tool-instructions/<tool>/*.mdx — the same
// verified content that renders in the foundations chapters. If a chapter
// changes, this file needs the matching update.

const CHAPTER = {
  configuration: { label: 'Configuration & profiles', href: '/foundations/configuration/' },
  rules: { label: 'Rules', href: '/foundations/rules/' },
  skills: { label: 'Skills', href: '/foundations/skills/' },
  slashCommands: { label: 'Slash commands', href: '/foundations/slash-commands/' },
  subagents: { label: 'Subagents', href: '/foundations/subagents/' },
  mcp: { label: 'MCP servers', href: '/foundations/mcp-servers/' },
  hooks: { label: 'Hooks', href: '/foundations/hooks/' },
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
              'Registers the MCP servers this repo depends on — database adapters, issue trackers, browsers. Scope precedence is local > project > user. Servers can fail silently mid-session; use `/mcp` to inspect what is actually connected.',
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
                  'The team\'s enforced configuration — unlike CLAUDE.md, which Claude reads as guidance, these settings are applied by the harness. Layering order: managed > user > project local > project shared. Hooks defined here fire on events like tool use and session start, and every matching hook from every config level runs.',
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
                  'Markdown rule files with `paths:` frontmatter — the pressure valve that keeps CLAUDE.md small. A rule scoped to `src/api/**` costs zero context until Claude actually edits an API file.',
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
                  'The older form of user-defined commands. Still works, but superseded by skills — same `/name` invocation, plus skills can bundle supporting files. Put new workflows in `skills/` instead.',
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
                  'Your cross-project preferences — style, tone, habits. Layers additively with project rules; the project file wins on conflict by specificity.',
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
              'Codex implements the open `agents.md` spec. Files are concatenated from the repo root downward — nested AGENTS.md files appear later in context and override earlier guidance positionally. No `@path` import directives are supported.',
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
                oneLiner: 'Project settings and named profiles — Codex\'s signature feature.',
                when: 'Read on invocation; applies only in trusted directories.',
                description:
                  'TOML config with feature flags, MCP server tables (`[mcp_servers.<name>]`, stdio or streamable HTTP), and named profiles — separate config bundles you swap with `codex --profile <name>` at launch. No other tool in scope has profiles.',
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
                  'Markdown templates with placeholder support: `$1`–`$9` positional, `$ARGUMENTS` for the full tail, named placeholders like `$FILE`. Simpler than skills — and now flagged as deprecated by OpenAI in favor of skills.',
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
              'Your user-level skill repository in the Agent Skills open standard — portable between Codex, Claude Code, and OpenCode.',
            chapter: CHAPTER.skills,
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
              'JSON config declaring MCP servers (`mcp`, with `type: "local"` or `type: "remote"`), LSP servers (`lsp` — the agent gets diagnostics as feedback without an MCP wrapper), extra rule file paths or globs (`instructions`), and agent customization. Sources merge rather than replace; project values win where they overlap.',
            tips: [
              'The `instructions` field is the workaround for AGENTS.md not supporting `@path` imports — list extra rule files here.',
              '`OPENCODE_CONFIG` / `OPENCODE_CONFIG_DIR` env vars override the default locations, useful in CI.',
            ],
            chapter: CHAPTER.configuration,
          },
          {
            id: 'oc-agents-md',
            label: 'AGENTS.md',
            type: 'file',
            badge: 'committed',
            oneLiner: 'The rules layer — OpenCode has no separate rules file.',
            when: 'Read at session start, every invocation.',
            description:
              'Follows the open `agents.md` spec and is portable from Codex unchanged. Nesting uses a first-win strategy: a subdirectory\'s AGENTS.md replaces a parent\'s rather than merging with it — the opposite of Claude Code\'s additive layering.',
            chapter: CHAPTER.rules,
          },
          {
            id: 'dot-opencode',
            label: '.opencode/',
            type: 'folder',
            oneLiner: 'Project-scoped skills, commands, and agents.',
            description:
              'OpenCode\'s native asset directory. Note that OpenCode also cross-reads `.claude/skills/` and `.agents/skills/` from the same repo — see those entries below.',
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
                  'Frontmatter requires `name` (must match the directory) and `description`. There is no equivalent to Claude Code\'s `disable-model-invocation` or `context: fork` — the agent sees every skill and loads bodies as needed.',
                chapter: CHAPTER.skills,
              },
              {
                id: 'oc-commands',
                label: 'commands/',
                type: 'folder',
                badge: 'committed',
                oneLiner: 'Slash commands — a separate primitive from skills here.',
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
  bash: { "git *": allow, "*": ask }
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
                oneLiner: 'Personal rules — skipped entirely when a project has its own.',
                when: 'Read at session start only if the project has no AGENTS.md (first-win).',
                description:
                  'Because of OpenCode\'s first-win strategy, this file does not merge with a project AGENTS.md — it is only used when no project file exists.',
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
];
