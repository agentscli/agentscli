import type { TrBeat, TrChoice, TrScript } from './terminal-replay';

/**
 * Script for the ApprovalLedger scene (runs on the terminal-replay engine).
 * Evergreen - no vendor facts; the prompts and grants are generic and the
 * embedding lessons map them to each tool's spelling (allow rules, the
 * checkpoint dialog, approval modes). Encodes the approval decision from the
 * course permission chapters (claude-code/permissions-modes/rules.mdx,
 * copilot/permissions/the-checkpoint.mdx): every "approve?" prompt is a
 * policy edit, not a yes/no - "once" expires with the command, an allowlist
 * entry is a standing grant sized by its pattern, and a deny plus one line of
 * redirection is often the cheapest correction in the loop. The trap being
 * dramatized is approval fatigue: the destructive prompt arrives looking
 * exactly like the five routine ones before it.
 *
 * Uses the engine's non-meter mode: no capacity/values (this scene isn't
 * about filling anything) and scene-defined slot colors - green = auto,
 * amber = one-time, blue = narrow standing grant, red = broad standing grant.
 */

const intro: TrBeat[] = [
  {
    lines: [{ kind: 'sys', text: 'agent cli · new session · repo: orders-api · permissions: default' }],
    panel: {
      add: [
        { id: 'auto-read', slot: 'auto', label: 'Read anything in the repo - auto' },
        { id: 'auto-edit', slot: 'auto', label: 'Edit files in the repo - auto' },
      ],
      note: 'The starting policy. Reads and in-repo edits run without asking; anything that touches the world beyond the diff - shell, network, deletes - stops for you. The panel is that policy, kept live.',
    },
    holdMs: 900,
  },
  {
    lines: [
      {
        kind: 'user',
        text: 'the nightly invoice job double-charges annual plans - find it, fix it, prove it with tests',
      },
      { kind: 'tool', text: 'read src/billing/invoice.ts · 388 lines' },
      { kind: 'tool', text: 'read src/billing/proration.ts · 245 lines' },
      { kind: 'tool', text: 'edit src/billing/proration.ts' },
    ],
    panel: {
      note: 'All of that ran prompt-free - reads and edits sit inside the auto-allowed classes. The policy is doing its job in both directions: no friction here, friction later.',
    },
    holdMs: 600,
  },
  {
    lines: [
      { kind: 'warn', text: '▲ approve? run shell command: npm test' },
      { kind: 'user', text: 'allow once' },
      { kind: 'tool', text: '$ npm test → 2 failed' },
    ],
    panel: {
      add: [{ id: 'once-1', slot: 'once', label: 'npm test - approved once' }],
      note: '“Once” answers this command, this run. It grants nothing forward - which is why it comes back.',
    },
    holdMs: 600,
  },
  {
    lines: [
      { kind: 'agent', text: 'The proration guard runs after the discount is applied. Reordering the checks…' },
      { kind: 'warn', text: '▲ approve? run shell command: npm test' },
      { kind: 'user', text: 'allow once' },
    ],
    panel: {
      add: [{ id: 'once-2', slot: 'once', label: 'npm test - approved once (again)' }],
      note: 'Same prompt, two minutes later. Approve-once on a command the agent needs every lap means you are the loop’s slowest part.',
    },
    holdMs: 700,
  },
  {
    lines: [
      { kind: 'warn', text: '▲ approve? run shell command: npm test' },
      { kind: 'user', text: 'always allow `npm test` in this project' },
      { kind: 'sys', text: '⎿ allow rule added: npm test - exact command, this project' },
    ],
    panel: {
      clearExcept: ['auto-read', 'auto-edit'],
      add: [{ id: 'allow-test', slot: 'standing', label: 'npm test - standing grant (exact command)' }],
      note: 'Third time is a pattern, so you edited the policy: `npm test` - that exact command, nothing wider - moved from “ask every time” to standing. The two one-time approvals collapse into one line in the ledger.',
    },
    holdMs: 900,
  },
  {
    lines: [
      { kind: 'tool', text: '$ npm test → 14 passed' },
      { kind: 'agent', text: 'Fix verified. Adding a regression test for the annual-plan path…' },
      { kind: 'tool', text: '$ npm test → 15 passed' },
    ],
    panel: {
      note: 'The loop runs friction-free now - and the grant that made it so is sitting in the ledger where you can read it, not in a reflex you can’t.',
    },
    holdMs: 500,
  },
  {
    lines: [
      {
        kind: 'agent',
        text: 'Tests green. To be thorough I want to rebuild the local database so the fixture data matches the new proration shape.',
      },
      {
        kind: 'warn',
        text: '▲ approve? run shell command: npx prisma migrate reset --force - destructive: drops the local database',
      },
    ],
    panel: {
      note: 'A destructive command arrives on the same reflex you have spent ten minutes training: yes, yes, yes. This is the prompt that matters - and it looks almost exactly like the ones that didn’t.',
    },
    holdMs: 900,
  },
];

const choices: TrChoice[] = [
  {
    id: 'once',
    button: 'allow once',
    replay: 'replay: allow once',
    verdictTone: 'good',
    verdict:
      'Right call - if, and only if, you actually read the prompt. “Once” is the correct size of grant for a destructive command: it authorises this run, on this machine, and leaves nothing standing behind it. The real risk was never this command; it was the streak - five routine yeses make the sixth automatic. The discipline that keeps once safe: the word `destructive` cancels autopilot, every time it appears.',
    beats: [
      {
        lines: [
          { kind: 'user', text: 'allow once' },
          { kind: 'tool', text: '$ npx prisma migrate reset --force → database reset · seed applied' },
          { kind: 'tool', text: '$ npm test → 15 passed' },
        ],
        panel: {
          add: [{ id: 'once-3', slot: 'once', label: 'prisma migrate reset - approved once' }],
          note: 'The command ran; the grant expired with it. Tomorrow’s session starts from the same short ledger - the destructive command still has to look you in the eye.',
        },
        holdMs: 800,
      },
    ],
  },
  {
    id: 'always',
    button: 'always allow npx prisma *',
    replay: 'replay: always allow',
    verdictTone: 'bad',
    verdict:
      'The grant outlived the moment. You didn’t approve a command - you approved a class of commands, sized by a wildcard, under approval fatigue. Allowlists are exactly right for narrow, boring, high-frequency commands: `npm test` earned its slot. A destructive command never earns one, because the entire value of that prompt is a human reading the word `reset` every single time it fires.',
    beats: [
      {
        lines: [
          { kind: 'user', text: 'always allow `npx prisma *` in this project' },
          { kind: 'sys', text: '⎿ allow rule added: npx prisma * - any subcommand, this project' },
          { kind: 'tool', text: '$ npx prisma migrate reset --force → database reset · seed applied' },
        ],
        panel: {
          add: [{ id: 'prisma-star', slot: 'broad', label: 'npx prisma * - standing grant (any subcommand)' }],
          note: 'The wildcard is in the ledger now. It matches `migrate reset` tomorrow as surely as it matched it today - and `db push`, and whatever ships in the next release.',
        },
        holdMs: 800,
      },
      {
        lines: [
          { kind: 'sys', text: '- three days later, a different task -' },
          { kind: 'agent', text: 'Schema drift detected. Resetting the local database to match…' },
          { kind: 'tool', text: '$ npx prisma migrate reset --force → database reset (no prompt)' },
        ],
        panel: {
          note: 'No prompt this time - you spent it three days ago. The agent didn’t overstep; the policy you wrote says this is fine. That’s what a standing grant is: a decision that keeps deciding without you.',
        },
        holdMs: 800,
      },
    ],
  },
  {
    id: 'deny',
    button: 'deny & redirect',
    replay: 'replay: deny & redirect',
    verdictTone: 'good',
    verdict:
      'Deny is under-used because it feels like stopping the work. It isn’t - paired with one line of redirection it’s the cheapest correction in the loop. The agent wanted fixtures that match the new shape; a database reset was just the first tool it reached for. When a destructive prompt surprises you, the question isn’t only “is this safe to allow?” - it’s “is this even the right move?” There is often a smaller one.',
    beats: [
      {
        lines: [
          { kind: 'user', text: 'deny - don’t reset anything. Update the seed script for the new shape instead' },
          { kind: 'agent', text: 'Understood - editing prisma/seed.ts to cover the new proration fields.' },
          { kind: 'tool', text: 'edit prisma/seed.ts' },
          { kind: 'tool', text: '$ npm test → 15 passed' },
        ],
        panel: {
          note: 'Nothing entered the ledger - the deny wasn’t a wall, it was steering. The agent got what it actually needed without the blast radius, and the policy is exactly as tight as it was this morning.',
        },
        holdMs: 800,
      },
    ],
  },
];

export const approvalLedgerScript: TrScript = {
  lead: 'One work session, played back with its permission policy x-rayed beside it. Every `approve?` prompt is an edit to that policy, not a yes/no - watch the ledger on the right, and when playback pauses, the prompt is yours.',
  termTitle: 'agent session - orders-api',
  panelTitle: 'what runs without asking',
  slots: {
    auto: 'Auto-allowed',
    once: 'One-time approvals',
    standing: 'Standing grants (narrow)',
    broad: 'Standing grants (broad)',
  },
  slotColors: {
    auto: { light: '#3f9154', dark: '#5cb56d' },
    once: { light: '#cf9744', dark: '#d9a552' },
    standing: { light: '#4a7db5', dark: '#5d8fc4' },
    broad: { light: '#c25454', dark: '#d06a6a' },
  },
  intro,
  decisionPrompt:
    'Your finger is already moving toward yes - the last five approvals were all routine. This one drops your local database. Your move:',
  choices,
  footnote:
    'The prompt wears different clothes across tools - allow/always/deny buttons, allow rules in a settings file, approval modes, sandbox flags - but underneath every one is this same ledger: a standing policy you edit one decision at a time. Grants sized to an exact command age well. Grants sized to a wildcard, approved under fatigue, are how an agent ends up with more rope than anyone remembers giving it.',
};
