/**
 * Data for the bindings-check widget (BindingsCheck.tsx).
 *
 * KEEP IN SYNC with `src/content/docs/playbooks/design-to-code.mdx` - the
 * widget dramatizes that chapter's organizing constraint ("an image carries
 * looks, never bindings") and its step 6 ("check the bindings - grep the
 * diff for literals"), reusing the chapter's running example: a pricing
 * card built agent-first into a React + Tailwind codebase. Evergreen - no
 * vendor facts; palettes, file paths, and line numbers are illustrative.
 *
 * Copy strings render through withCode(): backticked spans become <code>;
 * no markdown bold/italic in data strings.
 */

/** The demo card's self-contained brand palette (widget custom properties). */
export interface BcPalette {
  /** `--bc-brand-500` - price accent */
  brand500: string;
  /** `--bc-brand-600` - badge and (nominally) CTA background */
  brand600: string;
}

/** Purple = the shipped brand; teal = the someday brand refresh. */
export const BC_PALETTES: Record<'purple' | 'teal', BcPalette> = {
  purple: { brand500: '#8f7ffa', brand600: '#7c69f7' },
  teal: { brand500: '#14b8a6', brand600: '#0d9488' },
};

/** `--bc-space-4` - the spacing token the card padding is bound to. */
export const BC_SPACE_4 = '16px';

export type BcSource = 'token' | 'literal';

export interface BcValue {
  id: string;
  /** Where the value lands on the card, e.g. "badge background" */
  label: string;
  /** The CSS property, shown in mono next to the label */
  property: string;
  kind: 'color' | 'length';
  /**
   * What the chip's swatch paints, as live CSS - a `var(--bc-*)` reference
   * for bound values (so the rebrand moves the swatch too), the raw literal
   * for hardcoded ones (so it stays put).
   */
  swatchCss?: string;
  /** Rendered value under the shipped (purple) brand - what the eye gets */
  rendersAs: string;
  /** Rendered value after the teal refresh (bound values flip; literals don't) */
  rendersAsRebranded: string;
  source: BcSource;
  /** What the reveal shows: the token binding, or the literal itself */
  resolved: string;
  /** One short line of why, shown once the chip resolves */
  note: string;
}

export const bcValues: BcValue[] = [
  {
    id: 'badge-bg',
    label: 'badge background',
    property: 'background',
    kind: 'color',
    swatchCss: 'var(--bc-brand-600)',
    rendersAs: '#7c69f7',
    rendersAsRebranded: '#0d9488',
    source: 'token',
    resolved: 'var(--brand-600)',
    note: 'Bound. A rebrand moves it for free.',
  },
  {
    id: 'cta-bg',
    label: 'CTA background',
    property: 'background',
    kind: 'color',
    swatchCss: '#7c69f7',
    rendersAs: '#7c69f7',
    rendersAsRebranded: '#7c69f7',
    source: 'literal',
    resolved: '#7c69f7',
    note: 'A literal that renders identical to `var(--brand-600)` - today.',
  },
  {
    id: 'price-color',
    label: 'price color',
    property: 'color',
    kind: 'color',
    swatchCss: 'var(--bc-brand-500)',
    rendersAs: '#8f7ffa',
    rendersAsRebranded: '#14b8a6',
    source: 'token',
    resolved: 'var(--brand-500)',
    note: 'Bound to the palette.',
  },
  {
    id: 'card-padding',
    label: 'card padding',
    property: 'padding',
    kind: 'length',
    rendersAs: '16px',
    rendersAsRebranded: '16px',
    source: 'token',
    resolved: 'var(--space-4)',
    note: 'Bound to the spacing scale.',
  },
  {
    id: 'title-margin',
    label: 'title margin-top',
    property: 'margin-top',
    kind: 'length',
    rendersAs: '13px',
    rendersAsRebranded: '13px',
    source: 'literal',
    resolved: '13px',
    note: 'A number read off the mockup - no token on the scale is 13px.',
  },
  {
    id: 'border-color',
    label: 'focused border color',
    property: 'border-color',
    kind: 'color',
    swatchCss: '#8b7af8',
    rendersAs: '#8b7af8',
    rendersAsRebranded: '#8b7af8',
    source: 'literal',
    resolved: '#8b7af8',
    note: 'A lookalike shade that isn’t any token.',
  },
];

/** The grep reveal - step 6, run today. */
export const BC_GREP = {
  command: "$ grep -nE '#[0-9a-f]{6}|[0-9]+px' src/components/PricingCard.tsx",
  lines: [
    {
      lineNo: 9,
      snippet: "<Card className={cn('p-4', highlighted && 'border-[#8b7af8]')}>",
    },
    {
      lineNo: 14,
      snippet: '<h3 className="mt-[13px] font-semibold">Pro</h3>',
    },
    {
      lineNo: 29,
      snippet: '<Button className="w-full bg-[#7c69f7]">Start free trial</Button>',
    },
  ],
};

/** Demo card content - the chapter's running example. */
export const BC_CARD = {
  badge: 'Recommended',
  name: 'Pro',
  amount: '$24',
  per: '/mo',
  features: ['Unlimited projects', 'Priority support', 'Custom domains'],
  cta: 'Start free trial',
};

/** All widget copy. `{n}` / `{x}` / `{y}` are interpolated by the component. */
export const BC_COPY = {
  statusPass: 'Step 5 passed: side-by-side matches the mockup, pixel level. ✓',
  hook:
    'Step 6 hasn’t run. Six of these values came from the diff - can you tell which are wired to tokens and which are hardcoded lookalikes?',
  chipsGroupLabel:
    'Six values from the diff. Mark the ones you suspect are hardcoded literals; arrow keys move between values, Enter or Space toggles a mark.',
  suspectTag: 'suspect',
  counter: 'suspects: {n}/6 marked',
  decidePrompt: 'Two ways to find out which is which:',
  decideGroupLabel: 'Run the bindings check',
  grepLabel: 'grep the diff',
  grepSub: 'step 6 - cheap, today',
  rebrandLabel: 'ship the brand refresh',
  rebrandSub: 'someday, in production',
  grepOutcome:
    'Three hits. The render could never have shown you these - the grep finds them in seconds, before the merge.',
  rebrandLead:
    '`tailwind.config.ts`: brand tokens repointed, purple → teal. Every bound value followed; the three literals stayed purple.',
  rebrandOutcome:
    'Same information the grep gave you - delivered on rebrand day, in production, as a bug report.',
  grading: 'You flagged {x} of 3 literals, with {y} false alarm{s}.',
  verdict:
    'Visual fidelity decays gracefully; a hardcoded palette decays all at once. Zero literals in the diff is the checkpoint - and it’s grep-able.',
  markFlagged: 'flagged',
  markMissed: 'missed',
  markFalseAlarm: 'false alarm',
  resetLabel: 'Reset',
  resetAria: 'Reset the bindings check to its starting state',
};
