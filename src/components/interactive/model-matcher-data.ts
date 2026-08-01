/**
 * Model matcher - pick the work and where the choice should live; see the
 * right model tier and the exact switch mechanism per tool. Rosters, commands,
 * flags, and config fields are extracted from
 * src/content/tool-instructions/<tool>/model-selection.mdx - keep in sync.
 * The task→tier mapping is editorial and evergreen.
 */

export type MmtToolId = 'claude-code' | 'codex' | 'opencode' | 'cursor' | 'copilot';
export type MmtTierId = 'flagship' | 'default' | 'light';
export type MmtScopeId = 'session' | 'launch' | 'pin' | 'subagent';

export interface MmtTask {
  id: string;
  label: string;
  tier: MmtTierId;
  why: string;
}

export const mmtTasks: MmtTask[] = [
  {
    id: 'design',
    label: 'Design a feature / review a big diff',
    tier: 'flagship',
    why: 'Reasoning depth is the bottleneck here. The flagship’s per-token premium is cheaper than the hours you’d spend untangling a design the light model tied in knots.',
  },
  {
    id: 'everyday',
    label: 'Everyday coding',
    tier: 'default',
    why: 'The tier the tool’s own defaults assume - calibrated for the ordinary loop of reading, editing, and running tests.',
  },
  {
    id: 'sweep',
    label: 'Sweep & summarize',
    tier: 'light',
    why: 'High-volume, low-stakes per call. You don’t need the flagship to spell `connectionTimeout` correctly - pay for speed, not depth.',
  },
];

export const mmtScopes: { id: MmtScopeId; label: string }[] = [
  { id: 'session', label: 'Right now' },
  { id: 'launch', label: 'At launch' },
  { id: 'pin', label: 'Pinned in config' },
  { id: 'subagent', label: 'Per subagent' },
];

export interface MmtTierCell {
  /** Model name(s) shown in the result chip; single IDs substitute into code */
  model: string;
  note: string;
}

export interface MmtScopeCell {
  how: string;
  /** Exact command/flag/field; {model} is substituted with the tier's model */
  code?: string;
}

export interface MmtToolSpec {
  id: MmtToolId;
  label: string;
  tiers: Record<MmtTierId, MmtTierCell>;
  scopes: Record<MmtScopeId, MmtScopeCell>;
  roster: string;
}

export const mmtTools: MmtToolSpec[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    tiers: {
      flagship: {
        model: 'claude-opus-4-7',
        note: 'The reasoning ceiling of the lineup, with a 1M-token context window.',
      },
      default: {
        model: 'claude-sonnet-4-6',
        note: 'The tool’s own default - balanced, with the same 1M-token window.',
      },
      light: {
        model: 'claude-haiku-4-5',
        note: 'Fastest and cheapest, 200K window - built for sweeps and exploration subagents.',
      },
    },
    scopes: {
      session: {
        code: '/model',
        how: 'Lists the available models; the pick applies to the rest of the conversation.',
      },
      launch: {
        code: 'ANTHROPIC_MODEL={model} claude',
        how: 'The environment variable steers that invocation - handy in scripts and CI.',
      },
      pin: {
        code: '"model": "{model}"',
        how: 'The `model` key in `settings.json` - project-level pins the team, user-level pins you.',
      },
      subagent: {
        code: 'model: {model}',
        how: 'In the subagent’s markdown frontmatter - the worker runs on this model while the main loop keeps its own.',
      },
    },
    roster:
      'Anthropic models only. Changing vendors means changing tools - the vendor-risk trade the multi-provider tools soften.',
  },
  {
    id: 'codex',
    label: 'Codex',
    tiers: {
      flagship: {
        model: 'gpt-5.5',
        note: 'Top of the documented lineup - the catalog isn’t static, so run `codex debug models` for what your account can actually drive.',
      },
      default: {
        model: 'gpt-5.5',
        note: 'The default for ChatGPT sign-in (with `gpt-5.4` as fallback); API-key sessions default to `gpt-5.2-codex`.',
      },
      light: {
        model: 'gpt-5.4-mini',
        note: 'The small fast tier - the one to hand to exploration subagents.',
      },
    },
    scopes: {
      session: {
        code: '/model',
        how: 'Switches the model mid-session.',
      },
      launch: {
        code: 'codex --model {model}',
        how: 'Sets the model for that run.',
      },
      pin: {
        code: 'model = "{model}"',
        how: 'In `config.toml` - or inside a profile, so one `--profile` flag swaps model and settings together.',
      },
      subagent: {
        code: 'model = "{model}"',
        how: 'In the agent’s TOML file.',
      },
    },
    roster:
      'OpenAI models only. Codex doesn’t publish a static catalog - `codex debug models` prints the live list for your account.',
  },
  {
    id: 'opencode',
    label: 'OpenCode',
    tiers: {
      flagship: {
        model: 'anthropic/claude-opus-4-7',
        note: 'An example - OpenCode refs are `provider/model`, and any of ~75 providers can fill either side. Zen curates the tested combinations.',
      },
      default: {
        model: 'anthropic/claude-sonnet-4-6',
        note: 'An example - every agent carries its own `model`, so “the default” is whatever your build agent says it is.',
      },
      light: {
        model: 'anthropic/claude-haiku-4-5',
        note: 'An example - a small Gemini, Groq-hosted model, or a local Ollama model slots in the same way.',
      },
    },
    scopes: {
      session: {
        how: 'Models live on agents, not sessions - pick a different agent in the TUI, or point the current one at another `model`.',
      },
      launch: {
        how: 'The agent you start with brings its model - set that agent’s `model` field before the run.',
      },
      pin: {
        code: '"model": "{model}"',
        how: 'Providers configure in `opencode.json`; each agent’s `model` field pins its model.',
      },
      subagent: {
        code: 'model: {model}',
        how: 'In the agent’s markdown frontmatter - the same field powers side-by-side comparisons: two agents, two models, one prompt.',
      },
    },
    roster:
      'Fully multi-provider - ~75 providers preloaded via the Models.dev catalog, including local Ollama and LM Studio. The only tool in scope that runs models that never leave your machine.',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    tiers: {
      flagship: {
        model: 'Opus 4.7 · GPT-5 · Gemini 3 Pro',
        note: 'Caveat: MAX Mode changes context and pricing behavior; model-specific activation and per-request override availability vary by Cursor release.',
      },
      default: {
        model: 'Sonnet 4.6 · Composer',
        note: 'Or skip the choice: Auto Mode has Cursor pick a model balancing intelligence, cost, and reliability from a discounted pool.',
      },
      light: {
        model: 'Haiku 4.5 · Gemini Flash',
        note: 'The fast end of the built-in roster.',
      },
    },
    scopes: {
      session: {
        how: 'The per-chat model picker - switch any time. Plan mode goes further: plan with one model and hand the build to another, the only native split in scope.',
      },
      launch: {
        how: 'The picker sits at message composition - no launch flag is documented in our chapter.',
      },
      pin: {
        how: 'No project pin documented - model choice lives in the picker, and org admins gate the roster on Team / Enterprise plans.',
      },
      subagent: {
        how: 'Subagent frontmatter supports a model override, same pattern as the others.',
      },
    },
    roster:
      'Multi-vendor built-in roster: Anthropic, OpenAI, Google, xAI, Moonshot, plus Cursor’s own Composer family. Auto Mode draws from a discounted Auto + Composer pool.',
  },
  {
    id: 'copilot',
    label: 'Copilot',
    tiers: {
      flagship: {
        model: 'Claude Opus 4.7',
        note: 'Pro+ / Enterprise plans only - the roster is plan-gated, and premium models bill against a monthly quota with per-model multipliers.',
      },
      default: {
        model: 'Claude Sonnet 4.6 · GPT-5',
        note: 'The Pro-tier additions. Auto model selection picks for you at a 10% premium-request discount.',
      },
      light: {
        model: 'GPT-5 mini · Claude Haiku 4.5',
        note: 'Free-tier models, unlimited on paid plans - the quota-safe workhorses.',
      },
    },
    scopes: {
      session: {
        code: '/model',
        how: 'VS Code: the model picker in chat. CLI: `/model` at runtime - the default is Claude Sonnet 4.5.',
      },
      launch: {
        how: 'The CLI can point at custom providers via environment variables - OpenAI-compatible, Azure, Anthropic, or a local Ollama.',
      },
      pin: {
        how: 'No project pin documented. On Business / Enterprise, org admins allow or deny models - the picker only shows what policy permits.',
      },
      subagent: {
        how: 'Not supported - Copilot has no per-subagent model override.',
      },
    },
    roster:
      'Curated multi-vendor roster (Claude, GPT, Gemini), gated by plan and org policy. Watch premium-request burn: Coding Agent runs consume the quota fast.',
  },
];
