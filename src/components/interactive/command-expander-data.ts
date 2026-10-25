/**
 * Command expander - one custom command (/security-review) traced from the
 * keystroke, through the file that defines it, to the prompt the model
 * receives. Paths, placeholders, and invocation semantics are extracted from
 * src/content/tool-instructions/<tool>/slash-commands.mdx - keep in sync.
 * The example command itself is illustrative.
 */

export type CxpToolId = 'claude-code' | 'codex' | 'opencode' | 'cursor' | 'copilot';

/** A run of text; mark=true renders highlighted (placeholder or substituted value) */
export interface CxpSeg {
  text: string;
  mark?: boolean;
}

export interface CxpToolSpec {
  id: CxpToolId;
  label: string;
  /** What the user types in the session */
  typed: string;
  /** Where the defining file lives */
  path: string;
  /** The file's contents */
  file: CxpSeg[];
  /** The expanded prompt the model receives */
  receives: CxpSeg[];
  notes: { invoke: string; args: string; caveat: string };
}

export const cxpTools: CxpToolSpec[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    typed: '/security-review src/auth.ts',
    path: '.claude/skills/security-review/SKILL.md',
    file: [
      { text: '---\nname: security-review\ndescription: Security review of a file or diff\n---\n\nReview ' },
      { text: '$ARGUMENTS', mark: true },
      { text: ' for injection risks, authz gaps,\nand secrets handling. Report findings by severity.' },
    ],
    receives: [
      { text: 'Review ' },
      { text: 'src/auth.ts', mark: true },
      { text: ' for injection risks, authz gaps,\nand secrets handling. Report findings by severity.' },
    ],
    notes: {
      invoke:
        'Every user-invocable skill is a slash command - `/security-review` fires this SKILL.md. The legacy `.claude/commands/<name>.md` form still works.',
      args: '`$ARGUMENTS` is the full tail after the command name; `$ARGUMENTS[N]` or `$N` picks one argument by 0-based index, and named arguments can be declared in the `arguments` frontmatter list.',
      caveat:
        'Add `disable-model-invocation: true` and the model can never auto-trigger it - the pattern for side-effect commands like `/deploy-dry-run`.',
    },
  },
  {
    id: 'codex',
    label: 'Codex',
    typed: '$security-review src/auth.ts',
    path: '.agents/skills/security-review/SKILL.md',
    file: [
      { text: '---\nname: security-review\ndescription: Security review of one file\n---\n\nReview ' },
      { text: 'the file the user names', mark: true },
      { text: ' for injection risks, authz gaps,\nand secrets handling. Report findings by severity.' },
    ],
    receives: [
      { text: 'Review ' },
      { text: 'src/auth.ts', mark: true },
      { text: ' for injection risks, authz gaps,\nand secrets handling. Report findings by severity.' },
    ],
    notes: {
      invoke:
        '`$security-review` (or pick it from `/skills`) loads the skill. Unique to Codex: press Tab to queue input while a turn runs - it fires when the turn finishes.',
      args: 'No placeholder substitution is documented for skills - the model reads the skill body plus whatever you typed after the name.',
      caveat:
        'Codex custom prompts (`~/.codex/prompts/`, `/prompts:name`) were removed in 0.117.0, so a reusable prompt is a skill now, invoked with `$name` rather than `/name`.',
    },
  },
  {
    id: 'opencode',
    label: 'OpenCode',
    typed: '/security-review src/auth.ts',
    path: '.opencode/commands/security-review.md',
    file: [
      { text: 'Review ' },
      { text: '$1', mark: true },
      { text: ' for injection risks, authz gaps,\nand secrets handling. Report findings by severity.' },
    ],
    receives: [
      { text: 'Review ' },
      { text: 'src/auth.ts', mark: true },
      { text: ' for injection risks, authz gaps,\nand secrets handling. Report findings by severity.' },
    ],
    notes: {
      invoke:
        '`/security-review` executes immediately - no queueing. User-level commands live in `~/.config/opencode/commands/`.',
      args: '`$ARGUMENTS` for the full tail, `$1`, `$2`, … for positional tokens.',
      caveat:
        'Commands are the user-triggered surface; skills are a separate primitive - and plugin-registered slash commands aren’t documented.',
    },
  },
  {
    id: 'cursor',
    label: 'Cursor',
    typed: '/security-review',
    path: '.cursor/commands/security-review.md',
    file: [
      {
        text: 'Review the changes I point you at for injection\nrisks, authz gaps, and secrets handling. Report\nfindings by severity.',
      },
    ],
    receives: [
      {
        text: 'Review the changes I point you at for injection\nrisks, authz gaps, and secrets handling. Report\nfindings by severity.',
      },
    ],
    notes: {
      invoke:
        'In the editor’s Agent chat, the `/` picker lists subagents, skills, and custom commands (since 1.6). The CLI’s slash set is fixed built-ins (`/model`, `/rules`, `/commands`, …).',
      args: 'Argument-passing semantics are not established here, so this example shows the body verbatim without arguments.',
      caveat:
        '`/` runs something, `@` attaches context - a deliberate split. Team Commands push commands centrally from the dashboard with no local file edit.',
    },
  },
  {
    id: 'copilot',
    label: 'Copilot',
    typed: '/security-review',
    path: '.github/prompts/security-review.prompt.md',
    file: [
      {
        text: '---\nagent: agent\ndescription: Security review of the current context\n---\n\nReview the selected code for injection risks,\nauthz gaps, and secrets handling. Report findings\nby severity.',
      },
    ],
    receives: [
      {
        text: 'Review the selected code for injection risks,\nauthz gaps, and secrets handling. Report findings\nby severity.',
      },
    ],
    notes: {
      invoke:
        '`/security-review` from Chat in VS Code - note the `.prompt.md` extension. Prompt files run only in Local harness sessions in the Chat view; for other harnesses, convert the prompt to a skill.',
      args: 'No positional arguments - the body ships as written. Write `${input:name}` in the body and the model prompts for that value.',
      caveat:
        '`/` runs an action, `@` attaches context. The `copilot` CLI and `gh copilot` are separate surfaces - their commands don’t carry over.',
    },
  },
];
