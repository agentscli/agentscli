/**
 * Hook event timeline - every lifecycle event each tool exposes, in firing
 * order, with gate vs reactive semantics. Facts sourced from the verified
 * tool-instructions content (hooks chapter per tool): keep in sync with
 * src/content/tool-instructions/<tool>/hooks.mdx.
 */

export type HookKind = 'gate' | 'reactive';

export interface HookEvent {
  id: string;
  name: string;
  phase: string;
  kind: HookKind;
  /** What it fires on / what you'd use it for */
  fires: string;
  /** How blocking works (gate events only) */
  blocking?: string;
  example?: string;
  exampleTitle?: string;
}

export interface HookTool {
  slug: string;
  label: string;
  /** Where hooks are configured for this tool */
  configNote: string;
  /** Caveat about event ordering, if any */
  orderNote?: string;
  phases: string[];
  events: HookEvent[];
}

export const hookTools: HookTool[] = [
  {
    slug: 'claude-code',
    label: 'Claude Code',
    configNote:
      'Declared in `settings.json` (project, user, or managed) under the `hooks` key. Hooks from all levels merge; every matching hook fires.',
    phases: ['Session opens', 'Each turn', 'Each tool call', 'Special moments', 'Session ends'],
    events: [
      {
        id: 'cc-session-start',
        name: 'SessionStart',
        phase: 'Session opens',
        kind: 'reactive',
        fires:
          'Once, when the session opens. Classic use: inject context the agent should start with - `git status`, recent log, current branch.',
      },
      {
        id: 'cc-user-prompt',
        name: 'UserPromptSubmit',
        phase: 'Each turn',
        kind: 'reactive',
        fires: 'Before the model processes your prompt, every turn.',
      },
      {
        id: 'cc-pre-tool',
        name: 'PreToolUse',
        phase: 'Each tool call',
        kind: 'gate',
        fires:
          'Before a tool call executes. The enforcement point: block `rm -rf`, protect `.env`, stop pushes to main.',
        blocking:
          'Returns a decision - allow, deny, or modify the arguments. A deny feeds its reason back to the model.',
        exampleTitle: '.claude/settings.json',
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
      },
      {
        id: 'cc-post-tool',
        name: 'PostToolUse',
        phase: 'Each tool call',
        kind: 'reactive',
        fires:
          'After a tool call completes; receives the tool output. Classic use: lint or format the file that was just edited, feed errors back into the conversation.',
      },
      {
        id: 'cc-pre-compact',
        name: 'PreCompact',
        phase: 'Special moments',
        kind: 'reactive',
        fires:
          'Before the context window is compacted - a chance to snapshot the conversation before the summary flattens it.',
      },
      {
        id: 'cc-subagent-stop',
        name: 'SubagentStop',
        phase: 'Special moments',
        kind: 'reactive',
        fires: 'When a subagent terminates.',
      },
      {
        id: 'cc-stop',
        name: 'Stop',
        phase: 'Session ends',
        kind: 'reactive',
        fires:
          'At the end of the agent’s turn / session. Classic use: desktop or Slack notification, append to a work log.',
      },
    ],
  },
  {
    slug: 'codex',
    label: 'Codex',
    configNote:
      'Declared in `config.toml` under `[hooks]` (or a standalone `hooks.json`), at user (`~/.codex/`) or project (`.codex/`) level; managed hooks via `requirements.toml`. Hooks receive a JSON payload on stdin (`session_id`, `cwd`, `hook_event_name`, `model`, …).',
    phases: ['Session opens', 'Each turn', 'Each tool call', 'Session ends'],
    events: [
      {
        id: 'cx-session-start',
        name: 'SessionStart',
        phase: 'Session opens',
        kind: 'reactive',
        fires: 'Once, at session open.',
      },
      {
        id: 'cx-user-prompt',
        name: 'UserPromptSubmit',
        phase: 'Each turn',
        kind: 'reactive',
        fires: 'Before the model processes your prompt, every turn.',
      },
      {
        id: 'cx-pre-tool',
        name: 'PreToolUse',
        phase: 'Each tool call',
        kind: 'gate',
        fires:
          'Before a tool call executes. Example from the wild: scan the content about to be written for API keys, block the write if any are found.',
        blocking:
          'Exit code 2 + a message on stderr blocks the action; the message is fed back to the model as the reason.',
        exampleTitle: '~/.codex/config.toml',
        example: `[[hooks.PreToolUse]]
matcher = "Bash"

  [[hooks.PreToolUse.hooks]]
  type = "command"
  command = "scripts/check-bash-command.sh"`,
      },
      {
        id: 'cx-post-tool',
        name: 'PostToolUse',
        phase: 'Each tool call',
        kind: 'reactive',
        fires: 'After a tool call completes.',
      },
      {
        id: 'cx-permission',
        name: 'PermissionRequest',
        phase: 'Each tool call',
        kind: 'gate',
        fires: 'When an action needs a permission decision.',
        blocking: 'The hook can decide allow or deny instead of prompting you.',
      },
      {
        id: 'cx-stop',
        name: 'Stop',
        phase: 'Session ends',
        kind: 'reactive',
        fires: 'At session end.',
      },
    ],
  },
  {
    slug: 'opencode',
    label: 'OpenCode',
    configNote:
      'No declarative config - hooks live inside JS/TS plugins. The plugin receives `project`, `client`, `$` (shell), `directory`, `worktree`, and returns an object keyed by event name.',
    orderNote:
      'OpenCode exposes event families rather than a fixed pipeline - which events fire, and when, depends on what the session does.',
    phases: ['Files', 'Commands', 'Permissions', 'Session & messages'],
    events: [
      {
        id: 'oc-file-edited',
        name: 'file.edited',
        phase: 'Files',
        kind: 'reactive',
        fires: 'After the agent edits a file. Classic use: lint the touched file.',
        exampleTitle: '.opencode/plugin/lint.ts',
        example: `export default ({ project, client, $ }) => ({
  'file.edited': async (event) => {
    await $\`pnpm lint \${event.path}\`;
  },
});`,
      },
      {
        id: 'oc-file-watcher',
        name: 'file.watcher.updated',
        phase: 'Files',
        kind: 'reactive',
        fires: 'When the file watcher sees changes on disk.',
      },
      {
        id: 'oc-command',
        name: 'command.executed',
        phase: 'Commands',
        kind: 'reactive',
        fires: 'After a command runs - log it, react to it.',
      },
      {
        id: 'oc-permission-asked',
        name: 'permission.asked',
        phase: 'Permissions',
        kind: 'gate',
        fires: 'When the agent requests a permission.',
        blocking:
          'The plugin can answer allow or deny in code instead of surfacing the prompt.',
      },
      {
        id: 'oc-permission-replied',
        name: 'permission.replied',
        phase: 'Permissions',
        kind: 'reactive',
        fires: 'After a permission decision lands.',
      },
      {
        id: 'oc-session',
        name: 'session / message / TUI events',
        phase: 'Session & messages',
        kind: 'reactive',
        fires:
          'Session lifecycle, server, message, and TUI event families - the richest taxonomy of the four modeled tools, at the cost of writing code instead of config.',
      },
    ],
  },
  {
    slug: 'pi',
    label: 'Pi',
    configNote:
      'No hooks.json - hooks are TypeScript extensions via ExtensionAPI (`pi.on(...)`). Global: `~/.pi/agent/extensions/`. Project: `.pi/extensions/` (trust-gated).',
    orderNote:
      'Pi exposes a large ExtensionAPI event surface. The events below are the ones that map cleanest onto the hooks primitive; many more exist for turns, messages, and UI.',
    phases: ['Project trust', 'Session opens', 'Each tool call', 'Compaction', 'Session ends'],
    events: [
      {
        id: 'pi-project-trust',
        name: 'project_trust',
        phase: 'Project trust',
        kind: 'gate',
        fires:
          'Before project-local `.pi/` resources load. A user/global or CLI extension can own the trust decision.',
        blocking:
          'Return `{ trusted: "yes" | "no" | "undecided" }`. First yes/no wins; otherwise built-in trust.json / prompt flow continues.',
      },
      {
        id: 'pi-session-start',
        name: 'session_start',
        phase: 'Session opens',
        kind: 'reactive',
        fires:
          'When a session starts, resumes, or forks. Classic use: notify, inject startup context, open session-scoped resources.',
        exampleTitle: '.pi/extensions/stash-tools.ts',
        example: `import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.notify("stash-tools loaded", "info");
  });
}`,
      },
      {
        id: 'pi-tool-call',
        name: 'tool_call',
        phase: 'Each tool call',
        kind: 'gate',
        fires:
          'Before a tool runs. The enforcement point for permission gates and protected paths.',
        blocking:
          'Can block or reshape the call - the stock pattern for hand-rolling approval prompts Pi does not ship by default.',
      },
      {
        id: 'pi-compact',
        name: 'session_before_compact / session_compact',
        phase: 'Compaction',
        kind: 'reactive',
        fires: 'Around context compaction - customize summarization or observe what was dropped.',
      },
      {
        id: 'pi-session-shutdown',
        name: 'session_shutdown',
        phase: 'Session ends',
        kind: 'reactive',
        fires:
          'When the session runtime is torn down (quit, switch, fork). Clean up anything opened in session_start.',
      },
    ],
  },
];
