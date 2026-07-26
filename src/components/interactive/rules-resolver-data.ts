/**
 * Rules layering resolver - which rules files load for a given working
 * location, per tool. Outcomes are hand-authored from the verified
 * tool-instructions content (rules chapter per tool), NOT simulated:
 * keep them in sync with src/content/tool-instructions/<tool>/rules.mdx.
 *
 * Shared scenario: a monorepo with a rules file at the root and one in
 * packages/api/, plus the user's global file. Three candidate working
 * locations exercise the three merge models (additive / positional
 * concatenation / first-match-wins replacement).
 */

export type RlrStatus = 'loaded' | 'skipped' | 'replaced';

export interface RlrOutcome {
  path: string;
  status: RlrStatus;
  /** 1-based position when loaded */
  order?: number;
  note: string;
}

export interface RlrLocationResult {
  outcomes: RlrOutcome[];
  summary: string;
}

export interface RlrTool {
  slug: string;
  label: string;
  /** One-line statement of the tool's combining model */
  model: string;
  results: Record<string, RlrLocationResult>;
}

export const rlrLocations = [
  { id: 'root', label: 'src/index.ts' },
  { id: 'api', label: 'packages/api/handler.ts' },
  { id: 'web', label: 'packages/web/App.tsx' },
];

export const rlrTools: RlrTool[] = [
  {
    slug: 'claude-code',
    label: 'Claude Code',
    model:
      'Additive - every applicable file loads; more specific guidance wins on conflict.',
    results: {
      root: {
        outcomes: [
          {
            path: '~/.claude/CLAUDE.md',
            status: 'loaded',
            order: 1,
            note: 'User-wide; applies to every project.',
          },
          {
            path: 'CLAUDE.md',
            status: 'loaded',
            order: 2,
            note: 'Project root; always loaded.',
          },
          {
            path: 'packages/api/CLAUDE.md',
            status: 'skipped',
            note: 'Nested files load only when the agent touches files in that subtree.',
          },
          {
            path: '.claude/rules/api-validation.md',
            status: 'skipped',
            note: 'paths: ["packages/api/**"] - no match for this file.',
          },
        ],
        summary:
          'Two files load, additively. When they conflict, the more specific (project) guidance takes precedence over the user-wide file.',
      },
      api: {
        outcomes: [
          {
            path: '~/.claude/CLAUDE.md',
            status: 'loaded',
            order: 1,
            note: 'User-wide; applies to every project.',
          },
          {
            path: 'CLAUDE.md',
            status: 'loaded',
            order: 2,
            note: 'Project root; always loaded.',
          },
          {
            path: 'packages/api/CLAUDE.md',
            status: 'loaded',
            order: 3,
            note: 'Nested file - loads because the agent is touching packages/api/.',
          },
          {
            path: '.claude/rules/api-validation.md',
            status: 'loaded',
            order: 4,
            note: 'Path-scoped rule - its paths: glob matches this file.',
          },
        ],
        summary:
          'All four load, additively. Specificity order on conflict: path-scoped rule > nested CLAUDE.md > project root > user-wide.',
      },
      web: {
        outcomes: [
          {
            path: '~/.claude/CLAUDE.md',
            status: 'loaded',
            order: 1,
            note: 'User-wide; applies to every project.',
          },
          {
            path: 'CLAUDE.md',
            status: 'loaded',
            order: 2,
            note: 'Project root; always loaded.',
          },
          {
            path: 'packages/api/CLAUDE.md',
            status: 'skipped',
            note: 'Different subtree - the api guidance never enters the window.',
          },
          {
            path: '.claude/rules/api-validation.md',
            status: 'skipped',
            note: 'paths: ["packages/api/**"] - no match for this file.',
          },
        ],
        summary:
          'Only the always-on layers load. The packages/api guidance stays out of the window entirely - nested rules are also a context-cost optimisation.',
      },
    },
  },
  {
    slug: 'codex',
    label: 'Codex',
    model:
      'Concatenation - applicable AGENTS.md files join into one prompt, root-down; deeper files appear later and override positionally.',
    results: {
      root: {
        outcomes: [
          {
            path: '~/.codex/AGENTS.md',
            status: 'loaded',
            order: 1,
            note: 'Global; first in the combined prompt.',
          },
          {
            path: 'AGENTS.md',
            status: 'loaded',
            order: 2,
            note: 'Project root; appended after the global file.',
          },
          {
            path: 'packages/api/AGENTS.md',
            status: 'skipped',
            note: 'Not on the path from repo root to the working directory.',
          },
        ],
        summary:
          'Global + root concatenate into one prompt. The project file comes later, so where they disagree, it effectively overrides the global one.',
      },
      api: {
        outcomes: [
          {
            path: '~/.codex/AGENTS.md',
            status: 'loaded',
            order: 1,
            note: 'Global; first in the combined prompt.',
          },
          {
            path: 'AGENTS.md',
            status: 'loaded',
            order: 2,
            note: 'Project root; appended next.',
          },
          {
            path: 'packages/api/AGENTS.md',
            status: 'loaded',
            order: 3,
            note: 'Closest to the working directory - appended last, positionally strongest.',
          },
        ],
        summary:
          'All three concatenate root-down, joined by blank lines. Nothing is dropped - but the deepest file speaks last, so its guidance wins where they conflict.',
      },
      web: {
        outcomes: [
          {
            path: '~/.codex/AGENTS.md',
            status: 'loaded',
            order: 1,
            note: 'Global; first in the combined prompt.',
          },
          {
            path: 'AGENTS.md',
            status: 'loaded',
            order: 2,
            note: 'Project root; appended after the global file.',
          },
          {
            path: 'packages/api/AGENTS.md',
            status: 'skipped',
            note: 'Not on the path from repo root to the working directory.',
          },
        ],
        summary:
          'Global + root concatenate; packages/web has no AGENTS.md of its own, so the root file is the most specific voice.',
      },
    },
  },
  {
    slug: 'opencode',
    label: 'OpenCode',
    model:
      'First match wins - OpenCode walks up from the working directory and the first AGENTS.md found REPLACES the others. No merging.',
    results: {
      root: {
        outcomes: [
          {
            path: 'AGENTS.md',
            status: 'loaded',
            order: 1,
            note: 'First match walking up from src/ - this file wins.',
          },
          {
            path: 'packages/api/AGENTS.md',
            status: 'skipped',
            note: 'Not an ancestor of the working directory.',
          },
          {
            path: '~/.config/opencode/AGENTS.md',
            status: 'skipped',
            note: 'Global file is used only when the project has no AGENTS.md.',
          },
        ],
        summary:
          'One file wins. The root AGENTS.md is the entire rules layer here - the global file is skipped, not merged in.',
      },
      api: {
        outcomes: [
          {
            path: 'packages/api/AGENTS.md',
            status: 'loaded',
            order: 1,
            note: 'First match walking up from packages/api/ - this file wins.',
          },
          {
            path: 'AGENTS.md',
            status: 'replaced',
            note: 'Replaced, not merged - everything in the root file is invisible for this work.',
          },
          {
            path: '~/.config/opencode/AGENTS.md',
            status: 'skipped',
            note: 'Global file is used only when the project has no AGENTS.md.',
          },
        ],
        summary:
          'The gotcha: your root-file conventions do NOT apply here. Duplicate what matters into the nested file, or list extra files via the instructions field in opencode.json.',
      },
      web: {
        outcomes: [
          {
            path: 'AGENTS.md',
            status: 'loaded',
            order: 1,
            note: 'packages/web has no AGENTS.md, so the walk up finds the root file.',
          },
          {
            path: 'packages/api/AGENTS.md',
            status: 'skipped',
            note: 'Not an ancestor of the working directory.',
          },
          {
            path: '~/.config/opencode/AGENTS.md',
            status: 'skipped',
            note: 'Global file is used only when the project has no AGENTS.md.',
          },
        ],
        summary:
          'No file in packages/web, so the walk up lands on the root AGENTS.md - and that single file is all the agent sees.',
      },
    },
  },
  {
    slug: 'pi',
    label: 'Pi',
    model:
      'Walk + concatenate - global, then each ancestor down to cwd; closest file wins where guidance overlaps.',
    results: {
      root: {
        outcomes: [
          {
            path: '~/.pi/agent/AGENTS.md',
            status: 'loaded',
            order: 1,
            note: 'User-global; always collected when present.',
          },
          {
            path: 'AGENTS.md',
            status: 'loaded',
            order: 2,
            note: 'Project root on the walk from cwd; CLAUDE.md is accepted as an alternate filename.',
          },
          {
            path: 'packages/api/AGENTS.md',
            status: 'skipped',
            note: 'Not on the path from repo root to this working file.',
          },
        ],
        summary:
          'Global + root concatenate. Stronger must-follow rules belong in APPEND_SYSTEM.md / SYSTEM.md, not only AGENTS.md.',
      },
      api: {
        outcomes: [
          {
            path: '~/.pi/agent/AGENTS.md',
            status: 'loaded',
            order: 1,
            note: 'User-global; still collected.',
          },
          {
            path: 'AGENTS.md',
            status: 'loaded',
            order: 2,
            note: 'Root file still loads; overlaps yield to the closer file.',
          },
          {
            path: 'packages/api/AGENTS.md',
            status: 'loaded',
            order: 3,
            note: 'Closest file on the walk - wins where it conflicts with the root file.',
          },
        ],
        summary:
          'All three load; on conflict the nested packages/api file wins. Disable context files entirely with --no-context-files.',
      },
      web: {
        outcomes: [
          {
            path: '~/.pi/agent/AGENTS.md',
            status: 'loaded',
            order: 1,
            note: 'User-global; still collected.',
          },
          {
            path: 'AGENTS.md',
            status: 'loaded',
            order: 2,
            note: 'packages/web has no AGENTS.md, so the walk lands on the root file.',
          },
          {
            path: 'packages/api/AGENTS.md',
            status: 'skipped',
            note: 'Not an ancestor of packages/web/.',
          },
        ],
        summary:
          'Global + root only - no nested file under packages/web, so the root AGENTS.md is the most specific project voice.',
      },
    },
  },
];
