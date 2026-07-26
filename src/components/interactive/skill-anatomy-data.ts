/**
 * SKILL.md anatomy explorer - click a part of the file, see what it
 * controls and which tools honor it. Behavioral claims are extracted
 * from src/content/tool-instructions/<tool>/skills.mdx and the
 * cross-tool table in src/content/docs/foundations/skills.mdx - keep
 * in sync. The example skill itself is illustrative.
 */

export type SkaToolId = 'claude-code' | 'codex' | 'opencode' | 'cursor' | 'copilot';

export const skaToolLabel: Record<SkaToolId, string> = {
  'claude-code': 'Claude Code',
  codex: 'Codex',
  opencode: 'OpenCode',
  cursor: 'Cursor',
  copilot: 'Copilot',
};

export type SkaStatus = 'yes' | 'no' | 'partial';

export interface SkaSupport {
  status: SkaStatus;
  note: string;
}

export interface SkaPart {
  id: string;
  title: string;
  what: string;
  constraints?: string;
  support: Record<SkaToolId, SkaSupport>;
}

export const skaParts: SkaPart[] = [
  {
    id: 'folder',
    title: 'The skill folder',
    what: 'A skill is a directory with a `SKILL.md` inside. Where the directory lives decides who gets it - every tool reads its own paths, and most also read the shared ones.',
    support: {
      'claude-code': {
        status: 'yes',
        note: '`.claude/skills/` (project) · `~/.claude/skills/` (user) · plugin-bundled',
      },
      codex: {
        status: 'yes',
        note: '`.agents/skills/` walked up to the repo root · `~/.agents/skills/` · `/etc/codex/skills/`',
      },
      opencode: {
        status: 'yes',
        note: '`.opencode/skills/` - and reads `.claude/skills/` + `.agents/skills/` natively',
      },
      cursor: {
        status: 'yes',
        note: '`.cursor/skills/` + `.agents/skills/` - plus legacy `.claude/skills/`, `.codex/skills/`',
      },
      copilot: {
        status: 'yes',
        note: '`.github/skills/` - plus `.claude/skills/`, `.agents/skills/`; extra paths via `chat.agentSkillsLocations`',
      },
    },
  },
  {
    id: 'name',
    title: 'name',
    what: 'The skill’s identifier - how you invoke it and how the model refers to it. Lowercase-hyphenated by convention (required by the stricter tools).',
    constraints:
      'Cursor and OpenCode require it to match the folder name; Copilot and OpenCode cap it at 64 characters.',
    support: {
      'claude-code': { status: 'yes', note: 'required' },
      codex: { status: 'yes', note: 'required' },
      opencode: { status: 'yes', note: 'required · 1–64 chars, must match folder' },
      cursor: { status: 'yes', note: 'required · must match folder' },
      copilot: { status: 'yes', note: 'required · ≤64 chars, lowercase-hyphenated' },
    },
  },
  {
    id: 'description',
    title: 'description',
    what: 'The trigger. Every skill’s description is loaded into context at session start; the model matches your intent against it to decide when to pull the body in. It’s the most important line in the file - write it as a "use when…" hint, not a summary.',
    constraints: 'Capped at 1024 characters where a limit is documented (OpenCode, Copilot).',
    support: {
      'claude-code': { status: 'yes', note: 'required · drives auto-invocation' },
      codex: { status: 'yes', note: 'required · drives auto-invocation' },
      opencode: { status: 'yes', note: 'required · 1–1024 chars' },
      cursor: { status: 'yes', note: 'required · drives auto-select' },
      copilot: { status: 'yes', note: 'required · ≤1024 chars' },
    },
  },
  {
    id: 'disable-model-invocation',
    title: 'disable-model-invocation',
    what: 'Hides the skill from the model: it can only fire when you invoke it explicitly. The standard move for skills with side effects - deploys, releases, anything you never want auto-triggered.',
    support: {
      'claude-code': { status: 'yes', note: '`/<name>` still works' },
      codex: {
        status: 'no',
        note: 'uses the `agents/openai.yaml` sidecar instead (see below)',
      },
      opencode: { status: 'no', note: 'no equivalent documented' },
      cursor: { status: 'yes', note: 'slash invocation still works' },
      copilot: {
        status: 'yes',
        note: 'pair with `user-invocable: false` to hide from the `/` menu too',
      },
    },
  },
  {
    id: 'context-fork',
    title: 'context: fork',
    what: 'Runs the skill in a forked subagent context instead of inline - its reading and tool calls happen in a separate window and only the result returns to your conversation.',
    support: {
      'claude-code': { status: 'yes', note: '`inline` (default) or `fork`' },
      codex: { status: 'no', note: 'ignored' },
      opencode: { status: 'no', note: 'ignored' },
      cursor: { status: 'no', note: 'ignored' },
      copilot: {
        status: 'partial',
        note: 'mentioned in docs but behavior isn’t detailed - don’t rely on it',
      },
    },
  },
  {
    id: 'extras',
    title: 'Tool-specific keys',
    what: 'Beyond the shared core, each tool reads a few keys of its own. Unrecognized keys are silently ignored - which is exactly why one SKILL.md stays portable across all five tools.',
    support: {
      'claude-code': {
        status: 'no',
        note: 'its extras are `disable-model-invocation` and `context`, above',
      },
      codex: { status: 'no', note: 'extras live in the sidecar, not frontmatter' },
      opencode: { status: 'yes', note: '`license`, `compatibility`, `metadata`' },
      cursor: { status: 'yes', note: '`paths` (glob scoping), `metadata`' },
      copilot: {
        status: 'yes',
        note: '`user-invocable` (default true, controls `/` menu), `argument-hint`',
      },
    },
  },
  {
    id: 'body',
    title: 'The body',
    what: 'Whatever the agent needs to actually do the thing: a checklist, a procedure, domain knowledge. Loaded only when the skill fires - descriptions are always in context, bodies cost nothing until invoked. That progressive disclosure is what makes skills cheap to keep around.',
    support: {
      'claude-code': { status: 'yes', note: 'auto by description, or `/<name>`' },
      codex: { status: 'yes', note: 'auto · `/skills` to browse · `$<name>` to mention' },
      opencode: { status: 'yes', note: 'loaded on demand via the built-in `skill` tool' },
      cursor: {
        status: 'yes',
        note: 'auto · `/<name>` · `@<name>` attaches without invoking',
      },
      copilot: { status: 'yes', note: 'auto, or the `/` menu' },
    },
  },
  {
    id: 'files',
    title: 'Bundled files',
    what: 'Scripts, reference docs, and assets ride along in the folder; the body points at them and the agent reads or runs them on demand. They cost zero context until touched - the second layer of progressive disclosure.',
    constraints:
      'Keep references simple - paths relative to the skill folder. How each tool resolves them isn’t exhaustively documented.',
    support: {
      'claude-code': { status: 'yes', note: 'bundled scripts and assets' },
      codex: {
        status: 'yes',
        note: 'documents the `scripts/` · `references/` · `assets/` layout explicitly',
      },
      opencode: { status: 'yes', note: 'bundled files supported' },
      cursor: { status: 'yes', note: 'bundled files supported' },
      copilot: { status: 'yes', note: 'bundled files supported' },
    },
  },
  {
    id: 'sidecar',
    title: 'agents/openai.yaml',
    what: 'Codex’s out-of-band skill metadata. `policy.allow_implicit_invocation: false` is its version of `disable-model-invocation`; the sidecar can also declare tool dependencies. Every other tool ignores the directory.',
    support: {
      'claude-code': { status: 'no', note: 'ignored' },
      codex: { status: 'yes', note: 'defaults to `allow_implicit_invocation: true`' },
      opencode: { status: 'no', note: 'ignored' },
      cursor: { status: 'no', note: 'ignored' },
      copilot: { status: 'no', note: 'ignored' },
    },
  },
];
