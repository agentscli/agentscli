import type { TrBeat, TrChoice, TrScript } from './terminal-replay';

/**
 * Script for the RenderCheck scene (runs on the terminal-replay engine).
 * Evergreen - no vendor facts beyond the tool name; the judgment is substrate-
 * agnostic and applies to any code-rendered artifact (video, decks, PDFs).
 *
 * Keep in sync with: src/content/docs/playbooks/video-with-agents.mdx (same
 * running example - a release clip built from script.ts). Encodes the chapter's
 * organizing constraint: a composition that reads correctly in source can still
 * render wrong, so the only check that can say no is a rendered frame you look
 * at. The corruption dramatized here is real - it happened on the first take of
 * the verification run recorded in research/playbooks/remotion-verification-
 * 2026-07-26.md, where a monospace font's ligatures turned a literal `--frame`
 * into a single long dash in the rendered PNG while the source string was fine.
 *
 * Uses the engine's non-meter mode: no capacity/values, scene-defined slot
 * colors - blue = the copy source of truth, amber = work in progress, green =
 * verified output, red = shipped corruption.
 */

const intro: TrBeat[] = [
  {
    lines: [
      { kind: 'sys', text: 'agent session · repo: launch-video · branch: feat/release-clip' },
      { kind: 'sys', text: '⎿ task: build the 30-second release clip from src/script.ts' },
    ],
    panel: {
      add: [
        { id: 'script', slot: 'source', label: 'script.ts - every word that appears on screen' },
      ],
      note: 'The copy lives in one file, on purpose. Everything the video says is text you can read, diff and correct - no word on screen exists anywhere else.',
    },
    holdMs: 900,
  },
  {
    lines: [
      { kind: 'user', text: 'build the composition from src/script.ts. 1280x720, 30fps. don’t invent copy.' },
      { kind: 'tool', text: 'read src/script.ts · 4 shots' },
      { kind: 'tool', text: 'write src/Composition.tsx · 96 lines' },
    ],
    panel: {
      add: [{ id: 'comp', slot: 'work', label: 'Composition.tsx - one Sequence per shot' }],
      note: 'Ordinary React: components, props, timings. Nothing here is a black box - which is the whole reason the artifact was routed through code.',
    },
    holdMs: 700,
  },
  {
    lines: [
      { kind: 'agent', text: 'Composition built. Shot 3 shows the install command and the docs URL from script.ts.' },
      { kind: 'tool', text: 'grep "https://" src/script.ts → 1 match, shot 3' },
    ],
    panel: {
      note: 'The source is right. Read the file top to bottom and every character is exactly what you wrote - the URL, the flags, the product name.',
    },
    holdMs: 700,
  },
  {
    lines: [
      { kind: 'tool', text: '$ npx remotion render src/index.ts ReleaseClip out/clip.mp4' },
      { kind: 'tool', text: 'Rendered 900/900 · Encoded 900/900 → out/clip.mp4 2.4 MB' },
      { kind: 'agent', text: 'Done - the clip matches script.ts exactly. Ready to publish.' },
    ],
    panel: {
      add: [{ id: 'mp4', slot: 'work', label: 'clip.mp4 - rendered, unexamined' }],
      note: 'A confident claim about a picture, made by something that never saw the picture. The agent verified the source, not the output - those are different files.',
    },
    holdMs: 900,
  },
];

const choices: TrChoice[] = [
  {
    id: 'ship',
    button: 'ship it - the source was correct',
    replay: 'replay: ship it',
    verdictTone: 'bad',
    verdict:
      'The source was right and the video is still wrong. Source correctness is not render correctness. Between the string and the picture sit font loading, ligatures, layout and a headless browser - any of which can change what a viewer reads without touching a character of your code. The clip went out with a mangled URL, and because the artifact is a video, the correction is a re-render, a re-upload, and a post explaining the first one.',
    beats: [
      {
        lines: [
          { kind: 'user', text: 'ship it' },
          { kind: 'tool', text: 'upload out/clip.mp4 → launch post, 4,100 views' },
          { kind: 'warn', text: 'reply: "is that http or https? the link in the video doesn’t work"' },
        ],
        panel: {
          clearExcept: ['script', 'comp'],
          add: [
            { id: 'bad', slot: 'breach', label: 'clip.mp4 - shipped with a corrupted URL' },
          ],
          note: 'The font’s ligatures rendered the URL and the command flags as glyphs nobody can retype. Perfect in script.ts, wrong in every frame anyone watched.',
        },
        holdMs: 900,
      },
    ],
  },
  {
    id: 'watch',
    button: 'watch the whole render',
    replay: 'replay: watch it through',
    verdictTone: 'bad',
    verdict:
      'Better than shipping blind, and still the wrong instrument. Watching catches the loud failures - a missing shot, a caption that never appears, audio out of sync. It is unreliable for exactly this class of defect: a glyph substitution at 30fps for two seconds reads as "some monospace font" unless you already suspect it. It also costs you the full runtime on every iteration, which is why people stop doing it by the third pass.',
    beats: [
      {
        lines: [
          { kind: 'user', text: 'play it' },
          { kind: 'tool', text: 'open out/clip.mp4 · 30s' },
          { kind: 'agent', text: 'Timing looks right - every shot enters on its cue.' },
          { kind: 'warn', text: 'shot 3 passes in 2.1s - the URL reads as "correct-looking monospace"' },
        ],
        panel: {
          add: [{ id: 'watched', slot: 'work', label: 'clip.mp4 - watched once, timing verified' }],
          note: 'Motion is the one thing stills cannot check, so this pass is not wasted - it is just aimed at the wrong defect. Typography needs a still; timing needs the video.',
        },
        holdMs: 900,
      },
    ],
  },
  {
    id: 'still',
    button: 'render one frame and look at it',
    replay: 'replay: check the frame',
    verdictTone: 'good',
    verdict:
      'The check that can say no. Seconds, not minutes - and the bundle caches, so every check after the first is faster. A rendered frame is the only artifact that can contradict the agent, because it is the thing the viewer will actually see. This is the whole play in one command: the agent produced a picture, so the check has to be a picture.',
    beats: [
      {
        lines: [
          { kind: 'user', text: 'render frame 45 as a still first' },
          { kind: 'tool', text: '$ npx remotion still src/index.ts ReleaseClip out/f45.png --frame=45' },
          { kind: 'tool', text: 'Rendered 1/1 → out/f45.png · 1280x720' },
          { kind: 'warn', text: '▲ frame shows "-frame" as one long dash; "->" rendered as an arrow glyph' },
        ],
        panel: {
          add: [{ id: 'still', slot: 'check', label: 'f45.png - inspected, defect visible' }],
          note: 'There it is. The source string was never wrong - the font’s ligatures rewrote it on the way to the screen, and no amount of reading the code would have surfaced that.',
        },
        holdMs: 950,
      },
      {
        lines: [
          { kind: 'user', text: 'disable ligatures on the mono face and re-render the still' },
          { kind: 'tool', text: 'edit src/Composition.tsx · fontVariantLigatures: "none"' },
          { kind: 'tool', text: '$ npx remotion still … --frame=45 → out/f45.png' },
          { kind: 'agent', text: 'Frame 45 now renders the URL and flags character for character.' },
        ],
        panel: {
          clearExcept: ['script', 'comp', 'still'],
          add: [{ id: 'good', slot: 'check', label: 'clip.mp4 - re-rendered against a verified frame' }],
          note: 'One line changed, one still re-checked, then the full render. The fix was cheap because it was found before 900 frames were encoded and published.',
        },
        holdMs: 900,
      },
    ],
  },
];

export const renderCheckScript: TrScript = {
  lead:
    'An agent builds a release clip from a copy file, renders it, and reports done. Every word in the source is correct. Watch what it takes to find out whether every word on the screen is - and when playback pauses, pick the check you would actually run.',
  termTitle: 'agent session - launch-video',
  panelTitle: 'source, output, and what has been checked',
  slots: {
    source: 'Copy source of truth',
    work: 'Produced, unverified',
    check: 'Verified against a frame',
    breach: 'Shipped corruption',
  },
  slotColors: {
    source: { light: '#4a7db5', dark: '#5d8fc4' },
    work: { light: '#cf9744', dark: '#d9a552' },
    check: { light: '#3f9154', dark: '#5cb56d' },
    breach: { light: '#c23b3b', dark: '#d96262' },
  },
  intro,
  decisionPrompt:
    'The render finished and the agent says it matches. It has read the source; it has not seen the picture. Your move:',
  footnote:
    'The same split holds for every code-rendered artifact: check typography and layout on a still, check timing and motion on the render, and never accept the editor preview as evidence for either - preview and render are two different engines, and fonts are exactly where they disagree.',
  choices,
};
