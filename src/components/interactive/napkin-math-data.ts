/**
 * NapkinMath — the copy-paste tax calculator for the blog post "The Gap".
 *
 * Evergreen widget: pure arithmetic on reader-supplied numbers; no vendor
 * facts to drift. Defaults are the post's conservative napkin (10 handoffs
 * x 90 s over 220 working days). The rework half (PRs built on a guessed
 * schema) is deliberately NOT modelled — the widget says so.
 *
 * KEEP IN SYNC with: blog/the-gap-deepened.mdx, section
 * "How big is the gap? Napkin math". Verified 2026-09-02.
 */

export interface NapkinState {
  handoffs: number;
  seconds: number;
  days: number;
}

export const napkinDefaults: NapkinState = { handoffs: 10, seconds: 90, days: 220 };

export const napkinRanges: { key: keyof NapkinState; min: number; max: number; step: number; label: string; unit: string }[] = [
  { key: 'handoffs', min: 1, max: 40, step: 1, label: 'Context handoffs per day', unit: '×/day' },
  { key: 'seconds', min: 15, max: 300, step: 15, label: 'Cost of each, including the context switch', unit: 'sec' },
  { key: 'days', min: 180, max: 250, step: 5, label: 'Working days per year', unit: 'days' },
];

export const napkinCopy = {
  title: 'The copy-paste tax',
  subtitle: 'Move the sliders to your day. This is arithmetic, not a benchmark.',
  weeksLabel: 'working weeks per engineer, per year, spent as the human clipboard',
  note:
    'Counts only the relay work — open a tab, copy, paste back. The other half, PRs built on a guessed schema and reviewed into the ground, is real but varies too much by team to model honestly.',
  result: (hours: number, weeks: number) =>
    `≈ ${Math.round(hours)} hours a year — about ${weeks < 0.1 ? 'an afternoon' : weeks.toFixed(weeks < 1 ? 1 : 0)} working ${weeks === 1 ? 'week' : 'weeks'}.`,
};

/** 46 cells = one working year; filled cells = weeks lost to the relay. */
export const NAPKIN_YEAR_CELLS = 46;
