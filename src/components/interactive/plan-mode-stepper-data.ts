/**
 * Plan mode stepper — one task walked through the think-first posture,
 * per tool. Behavioral claims are extracted from
 * src/content/tool-instructions/<tool>/plan-mode.mdx — keep in sync.
 */

export type PmsToolId = 'claude-code' | 'codex' | 'opencode' | 'cursor' | 'copilot';

export interface PmsTool {
  id: PmsToolId;
  label: string;
}

export const pmsTools: PmsTool[] = [
  { id: 'claude-code', label: 'Claude Code' },
  { id: 'codex', label: 'Codex' },
  { id: 'opencode', label: 'opencode' },
  { id: 'cursor', label: 'Cursor' },
  { id: 'copilot', label: 'Copilot' },
];

export interface PmsCell {
  text: string;
  /** Rendered as a mono command/keypress chip above the text */
  code?: string;
}

export interface PmsStage {
  id: string;
  /** Short label for the stage ribbon */
  label: string;
  title: string;
  detail: Record<PmsToolId, PmsCell>;
}

export const pmsStages: PmsStage[] = [
  {
    id: 'enter',
    label: 'switch in',
    title: 'You switch into the posture',
    detail: {
      'claude-code': {
        code: 'Shift-Tab',
        text: 'A session toggle on the active agent — cycle into Plan mode mid-conversation. The `/plan` skill pairs with it but is a separate thing: the skill asks for a plan, the mode enforces the posture.',
      },
      codex: {
        code: 'codex --sandbox read-only --ask-for-approval untrusted',
        text: 'No dedicated toggle — you compose the posture from permission primitives. Mid-session, the `/permissions` picker switches to the "Read Only" preset.',
      },
      opencode: {
        code: 'Tab',
        text: 'Plan mode is a primary agent, not a mode. `Tab` switches you from `build` (full edit access, the default) to `plan` (read-only).',
      },
      cursor: {
        code: 'Shift+Tab',
        text: 'A first-class IDE mode: `Shift+Tab` in the chat input, the mode dropdown, or `/plan`. It sits alongside Ask, Agent, and Debug modes.',
      },
      copilot: {
        text: 'Pick "Plan" from the mode dropdown in VS Code Chat — one of four first-class modes alongside Ask, Edit, and Agent.',
      },
    },
  },
  {
    id: 'explore',
    label: 'explore',
    title: 'The agent explores — reads allowed',
    detail: {
      'claude-code': {
        text: 'Read, search, and grep tools work normally. The agent is also instructed differently: produce a plan, not action.',
      },
      codex: {
        text: 'The `read-only` sandbox allows reads, so exploration proceeds as usual — the agent maps the change set with the tools it always had.',
      },
      opencode: {
        text: 'The `plan` agent reads freely — its permission map is read-only, so exploration is exactly the `build` experience minus the writes.',
      },
      cursor: {
        text: 'A read-only research phase: the agent explores the codebase before drafting. The precise tool allowlist inside Plan Mode isn’t exhaustively documented — treat "read-only" as the working assumption, not a verified guarantee.',
      },
      copilot: {
        text: 'Analysis only — the agent reasons over the workspace to shape the plan, with no execution along the way.',
      },
    },
  },
  {
    id: 'edit-attempt',
    label: 'edit attempt',
    title: 'An edit is attempted — the posture holds',
    detail: {
      'claude-code': {
        text: 'Write, Edit, and mutating Bash are blocked by the mode itself. Even if the model reaches for an edit, the tool call can’t land.',
      },
      codex: {
        text: 'The sandbox blocks file writes and mutating commands. With `--ask-for-approval untrusted`, an attempted escalation surfaces as an approval prompt instead of executing silently.',
      },
      opencode: {
        text: 'Edits are gated to ask/deny — an edit proposal surfaces for your explicit approval instead of landing. Deny it and the agent keeps planning.',
      },
      cursor: {
        text: 'No writes land during research. The one thing the mode does emit is the plan itself — an editable markdown file, which is the next step.',
      },
      copilot: {
        text: 'Plan mode never executes — there is no edit to block, because the mode’s output is the plan artefact, full stop.',
      },
    },
  },
  {
    id: 'plan',
    label: 'plan lands',
    title: 'The plan lands',
    detail: {
      'claude-code': {
        text: 'Inline in the chat: the proposed change set, file by file, ready for you to push back on before anything moves.',
      },
      codex: {
        text: 'Inline chat output — the agent lays out the approach; nothing has been written yet.',
      },
      opencode: {
        text: 'Inline chat output from the `plan` agent — the proposal, with any attempted edits still parked behind ask/deny.',
      },
      cursor: {
        text: 'An editable markdown file — saved to your home directory by default, or "Save to workspace" to keep it in the repo. Add and remove todos, change the approach, right in the file.',
      },
      copilot: {
        text: 'A structured implementation plan in chat: steps, risks, and acceptance criteria — a review artefact, not prose.',
      },
    },
  },
  {
    id: 'gate',
    label: 'the gate',
    title: 'You approve — or keep planning',
    detail: {
      'claude-code': {
        text: 'Accept the plan when prompted, or `Shift-Tab` again to stay in the posture and keep iterating. The gate is the toggle itself.',
      },
      codex: {
        text: 'There’s no plan-specific gate — approval happens per escalation prompt. When you’re satisfied, you change the posture yourself via `/permissions`.',
      },
      opencode: {
        text: 'The ask/deny prompt on each proposed edit is the gate — you approve changes one by one, or hold them all and switch agents when the plan convinces you.',
      },
      cursor: {
        text: 'You refine the markdown plan inline — edit todos, reorder, cut scope — then click to build when it says what you’d have written.',
      },
      copilot: {
        text: 'No explicit approval prompt — the gate is you deciding the plan is good enough to hand to Agent mode.',
      },
    },
  },
  {
    id: 'execute',
    label: 'execute',
    title: 'The posture flips — execution starts',
    detail: {
      'claude-code': {
        code: 'Shift-Tab',
        text: 'Same session, history preserved. The agent starts executing the accepted plan with everything it learned while exploring still in context.',
      },
      codex: {
        code: '/permissions',
        text: 'Switch to a permissive preset (e.g. "Auto") via the picker — or restart with different flags. The plan text carries; a restart’s exploration doesn’t.',
      },
      opencode: {
        code: 'Tab',
        text: 'Tab back to `build`. Session and history carry over — the plan and everything the `plan` agent read are still in the window.',
      },
      cursor: {
        text: 'Build runs from the plan file. Cursor lets you pair models here: plan with a frontier reasoning model, build with a faster one.',
      },
      copilot: {
        text: 'Switch the dropdown to Agent and hand it the plan — the autonomous loop executes what Plan mode drafted.',
      },
    },
  },
];
