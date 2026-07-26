/**
 * Headless / CI job builder - pick a task, output format, and permission
 * posture; get the assembled command per tool. Flags and behavior are
 * extracted from src/content/tool-instructions/<tool>/headless.mdx -
 * keep in sync. Posture combinations are editorial recommendations
 * assembled from documented flags.
 */

export type HlbToolId = 'claude-code' | 'codex' | 'opencode' | 'cursor' | 'copilot';
export type HlbOutputId = 'text' | 'json' | 'stream';
export type HlbPostureId = 'readonly' | 'edit' | 'full';

export interface HlbTask {
  id: string;
  label: string;
  prompt: string;
}

export const hlbTasks: HlbTask[] = [
  {
    id: 'review',
    label: 'Review a PR diff',
    prompt: 'Review the changes on this branch for regressions. Be terse.',
  },
  {
    id: 'triage',
    label: 'Triage an issue',
    prompt: 'Label this issue and suggest an owner.',
  },
  {
    id: 'changelog',
    label: 'Draft release notes',
    prompt: 'Draft a CHANGELOG entry from today’s merged PRs.',
  },
];

export const hlbOutputs: { id: HlbOutputId; label: string }[] = [
  { id: 'text', label: 'Plain text' },
  { id: 'json', label: 'JSON' },
  { id: 'stream', label: 'Streaming JSON' },
];

export const hlbPostures: { id: HlbPostureId; label: string }[] = [
  { id: 'readonly', label: 'Read-only' },
  { id: 'edit', label: 'Can edit' },
  { id: 'full', label: 'Full access' },
];

export interface HlbFragment {
  /** Appended to the command as its own line; absent = no flag exists */
  part?: string;
  note: string;
}

export interface HlbPostureFragment extends HlbFragment {
  /** Posture that lives in config instead of flags (OpenCode) */
  config?: { title: string; code: string };
}

export interface HlbToolSpec {
  id: HlbToolId;
  label: string;
  /** Base command; {prompt} is substituted */
  base: string;
  outputs: Record<HlbOutputId, HlbFragment>;
  postures: Record<HlbPostureId, HlbPostureFragment>;
  footnote: string;
}

export const hlbTools: HlbToolSpec[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    base: 'claude -p "{prompt}"',
    outputs: {
      text: { note: 'Plain prose to stdout - the default, no flag needed.' },
      json: {
        part: '--output-format json',
        note: 'One structured object with `result`, `session_id`, `cost`, and `usage`. Capture `session_id` if a later run should `--resume` this one.',
      },
      stream: {
        part: '--output-format stream-json',
        note: 'Newline-delimited JSON events as the loop runs - for dashboards and long jobs.',
      },
    },
    postures: {
      readonly: {
        part: '--bare --allowedTools "Read,Bash(git diff *)" --permission-mode dontAsk',
        note: 'The allowlist is the guardrail - tool patterns like `Bash(git diff *)` scope commands, not just tools. `--bare` skips auto-discovery of CLAUDE.md, hooks, and MCP servers so CI behaves deterministically, and `dontAsk` keeps the run from hanging on an approval no one will answer.',
      },
      edit: {
        part: '--allowedTools "Read,Edit,Bash(npm test)" --permission-mode dontAsk',
        note: 'Widen the allowlist to exactly the write surface the job needs - nothing outside it can run.',
      },
      full: {
        part: '--permission-mode dontAsk',
        note: 'No allowlist: every tool call goes through unprompted. Only inside a container you can throw away.',
      },
    },
    footnote:
      'First-party CI: `anthropics/claude-code-action@v1` wraps all of this in a GitHub Action - pass any of these flags via `claude_args`.',
  },
  {
    id: 'codex',
    label: 'Codex',
    base: 'codex exec "{prompt}"',
    outputs: {
      text: { note: 'Plain output - the default, no flag needed.' },
      json: {
        part: '--json',
        note: 'NDJSON events (`thread.started`, `turn.completed`, `item.*`…). Add `--output-schema <file>` to constrain the final message, or `-o <file>` to write just the last message.',
      },
      stream: {
        part: '--json',
        note: 'Same flag - NDJSON is already a stream; consume it line by line.',
      },
    },
    postures: {
      readonly: {
        part: '--sandbox read-only --ask-for-approval never',
        note: 'The OS sandbox is the guardrail: reads work, writes and mutating commands are blocked at the sandbox layer. `never` keeps a headless run from waiting on an approval prompt.',
      },
      edit: {
        part: '--sandbox workspace-write --ask-for-approval never',
        note: 'File edits and sandboxed commands allowed inside the workspace; the sandbox still bounds everything else.',
      },
      full: {
        part: '--sandbox danger-full-access --ask-for-approval never',
        note: 'The YOLO combination. The docs’ own advice: only in a throwaway environment.',
      },
    },
    footnote:
      'Known issue: `--output-schema` is silently ignored when MCP servers are active (codex #15451). `codex cloud exec` runs the same job on a remote environment.',
  },
  {
    id: 'opencode',
    label: 'OpenCode',
    base: 'opencode run "{prompt}"',
    outputs: {
      text: { note: 'Plain output - the default, no flag needed.' },
      json: {
        part: '--format json',
        note: 'Machine-readable output; the same flag works on `opencode session list` and `opencode db`.',
      },
      stream: {
        part: '--format json',
        note: 'Line-delimited JSON arrives through the same flag - there is no separate streaming format.',
      },
    },
    postures: {
      readonly: {
        config: {
          title: 'opencode.json - the posture lives in config, not flags',
          code: '"permission": {\n  "read": "allow",\n  "grep": "allow",\n  "edit": "deny",\n  "bash": "deny"\n}',
        },
        note: 'OpenCode has no permission flags on `run` - the per-agent permission map decides. This shape is the stock `plan` agent.',
      },
      edit: {
        config: {
          title: 'opencode.json - the posture lives in config, not flags',
          code: '"permission": {\n  "read": "allow",\n  "edit": "allow",\n  "bash": "ask"\n}',
        },
        note: 'Grant exactly what the job needs. Rules are last-match-wins, with `*` and `?` wildcards - but beware `ask` in CI: nobody is there to answer.',
      },
      full: {
        config: {
          title: 'opencode.json',
          code: '"permission": {\n  "read": "allow",\n  "edit": "allow",\n  "bash": "allow"\n}',
        },
        note: 'Everything allowed. OpenCode has no built-in OS sandbox - wrap the run in a Docker container if you go here.',
      },
    },
    footnote:
      'For GitHub, `opencode github install` generates a workflow triggered by `/oc` comments on PRs and issues; a GitLab CI component exists too.',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    base: 'cursor-agent -p "{prompt}"',
    outputs: {
      text: { note: 'Clean final-answer text - the default, no flag needed.' },
      json: {
        part: '--output-format json',
        note: 'Single structured result - parse the `.result` field.',
      },
      stream: {
        part: '--output-format stream-json',
        note: 'Message-level JSON events; add `--stream-partial-output` for incremental deltas on long runs.',
      },
    },
    postures: {
      readonly: {
        note: 'The default is the guardrail: without `--force`, the agent only proposes changes - nothing is applied.',
      },
      edit: {
        part: '--force --auto-run auto-run-in-sandbox',
        note: '`--force` applies file changes directly (`--yolo` is a synonym); commands run inside the sandbox without prompting. Cursor’s own guidance: run CI jobs in a container or VM, not on your machine.',
      },
      full: {
        part: '--force --auto-run always-run-everything',
        note: 'No gating at all - the historical "YOLO mode". Environment isolation is the only guardrail left.',
      },
    },
    footnote:
      'Bugbot (PR reviewer) and the Cloud Agents REST API are Cursor’s first-party CI surfaces; the local CLI is the scriptable one.',
  },
  {
    id: 'copilot',
    label: 'Copilot',
    base: 'copilot --prompt "{prompt}"',
    outputs: {
      text: { note: 'Pipe-friendly text - the only documented output format.' },
      json: {
        note: 'No structured-output flag is documented for the Copilot CLI. Post-process the text - or use the Coding Agent, whose "output format" is a draft PR.',
      },
      stream: {
        note: 'No streaming format is documented for the Copilot CLI.',
      },
    },
    postures: {
      readonly: {
        note: 'No blanket read-only switch is documented - grant tools one at a time with `--allow-tool <tool>` and block with `--deny-tool <tool>`.',
      },
      edit: {
        note: 'Allow the write surface explicitly via `--allow-tool <tool>`; everything not allowed still prompts.',
      },
      full: {
        part: '--allow-all-tools',
        note: 'Unattended, everything allowed. The safer unattended surface is the Coding Agent - it runs in a GitHub Actions sandbox behind a firewall.',
      },
    },
    footnote:
      'For CI, the canonical Copilot surface is the Coding Agent: assign an issue to Copilot or `@copilot` a PR, and it comes back with a draft PR.',
  },
];

/** Assemble the multi-line command for a tool + choices */
export function hlbAssemble(
  tool: HlbToolSpec,
  prompt: string,
  outputId: HlbOutputId,
  postureId: HlbPostureId
): string {
  const lines = [tool.base.replace('{prompt}', prompt)];
  const posture = tool.postures[postureId].part;
  const output = tool.outputs[outputId].part;
  if (posture) lines.push(posture);
  if (output) lines.push(output);
  return lines.join(' \\\n  ');
}
