/**
 * Permission decision simulator - three tools, three genuinely different
 * models, one question: "will this run?". Facts sourced from the verified
 * tool-instructions content (permissions chapter per tool): keep in sync
 * with src/content/tool-instructions/<tool>/permissions.mdx.
 *
 * Claude Code: allow/ask/deny rule lists, evaluated deny > ask > allow,
 * unmatched actions fall through to the default (ask). The example policy
 * and the per-command walks below are hand-authored against that order.
 */

export type Verdict = 'allow' | 'ask' | 'deny' | 'blocked';

export const VERDICT_LABEL: Record<Verdict, string> = {
  allow: 'runs without asking',
  ask: 'asks you first',
  deny: 'denied',
  blocked: 'blocked by sandbox',
};

/* ---------- Claude Code ---------- */

export const ccPolicy = `{
  "permissions": {
    "deny":  ["Bash(rm -rf:*)", "Edit(.env)", "Read(.env)"],
    "ask":   ["Bash(git push:*)", "Bash(npm install:*)"],
    "allow": ["Bash(npm run test:*)", "Read(src/**)", "Bash(git status)"]
  }
}`;

export interface CcStep {
  list: 'deny' | 'ask' | 'allow' | 'default';
  matched?: string;
  text: string;
}

export interface CcScenario {
  id: string;
  label: string;
  verdict: Verdict;
  steps: CcStep[];
}

export const ccScenarios: CcScenario[] = [
  {
    id: 'test',
    label: 'npm run test:unit',
    verdict: 'allow',
    steps: [
      { list: 'deny', text: 'No deny rule matches.' },
      { list: 'ask', text: 'No ask rule matches.' },
      {
        list: 'allow',
        matched: 'Bash(npm run test:*)',
        text: 'Allow rule matches - the command runs without a prompt.',
      },
    ],
  },
  {
    id: 'push',
    label: 'git push origin feature',
    verdict: 'ask',
    steps: [
      { list: 'deny', text: 'No deny rule matches.' },
      {
        list: 'ask',
        matched: 'Bash(git push:*)',
        text: 'Ask rule matches - you get a prompt before anything is pushed.',
      },
    ],
  },
  {
    id: 'rmrf',
    label: 'rm -rf node_modules',
    verdict: 'deny',
    steps: [
      {
        list: 'deny',
        matched: 'Bash(rm -rf:*)',
        text: 'Deny rule matches - evaluation stops here. Deny beats everything.',
      },
    ],
  },
  {
    id: 'env',
    label: 'Edit .env',
    verdict: 'deny',
    steps: [
      {
        list: 'deny',
        matched: 'Edit(.env)',
        text: 'Deny rule matches - the file is untouchable regardless of other rules.',
      },
    ],
  },
  {
    id: 'terraform',
    label: 'terraform apply',
    verdict: 'ask',
    steps: [
      { list: 'deny', text: 'No deny rule matches.' },
      { list: 'ask', text: 'No ask rule matches.' },
      { list: 'allow', text: 'No allow rule matches either.' },
      {
        list: 'default',
        text: 'Nothing matched - falls through to the default: ask you.',
      },
    ],
  },
];

/* ---------- Codex ---------- */

export const cxSandboxes = [
  {
    id: 'read-only',
    label: 'read-only',
    blurb: 'read files only; no edits, no commands',
  },
  {
    id: 'workspace-write',
    label: 'workspace-write',
    blurb: 'edit inside the workspace; sandboxed commands',
  },
  {
    id: 'danger-full-access',
    label: 'danger-full-access',
    blurb: 'no sandbox - deliberate use only',
  },
];

export const cxApprovals = [
  { id: 'untrusted', label: 'untrusted', blurb: 'ask for every action' },
  { id: 'on-request', label: 'on-request', blurb: 'agent decides when to ask' },
  { id: 'never', label: 'never', blurb: 'never ask' },
];

export interface CxAction {
  id: string;
  label: string;
  /** Which sandbox modes permit this action at all */
  allowedIn: Record<string, boolean>;
}

export const cxActions: CxAction[] = [
  {
    id: 'read',
    label: 'Read a file',
    allowedIn: { 'read-only': true, 'workspace-write': true, 'danger-full-access': true },
  },
  {
    id: 'edit-in',
    label: 'Edit a file in the workspace',
    allowedIn: { 'read-only': false, 'workspace-write': true, 'danger-full-access': true },
  },
  {
    id: 'command',
    label: 'Run a shell command',
    allowedIn: { 'read-only': false, 'workspace-write': true, 'danger-full-access': true },
  },
  {
    id: 'edit-out',
    label: 'Edit a file outside the workspace',
    allowedIn: { 'read-only': false, 'workspace-write': false, 'danger-full-access': true },
  },
];

/* ---------- OpenCode ---------- */

export const ocConfig = `# example per-agent permission maps
agent:
  build:
    permission:
      read: allow
      edit: allow
      bash: ask
  plan:
    permission:
      read: allow
      edit: deny
      bash: ask`;

export const ocAgents = [
  {
    id: 'build',
    label: 'build',
    permissions: { read: 'allow', edit: 'allow', bash: 'ask' } as Record<string, Verdict>,
  },
  {
    id: 'plan',
    label: 'plan',
    permissions: { read: 'allow', edit: 'ask', bash: 'ask' } as Record<string, Verdict>,
  },
];

export const ocTools = [
  { id: 'read', label: 'read' },
  { id: 'edit', label: 'edit' },
  { id: 'bash', label: 'bash' },
];
