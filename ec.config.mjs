// Expressive Code configuration.
//
// Starlight ships with Expressive Code built in but runs it with defaults.
// This file opts in to the pieces this site uses:
// - the stock starlight theme pairing (light/dark match the site theme),
// - no filename frames or copy buttons beyond the defaults,
// - inline text markers for terminal transcripts and diffs.
//
// NOTE on fence syntax: line-range marks MUST use braces (mark={2}, mark={4,10}).
// A bare mark=2 is parsed as a *string search term* (highlights the literal text
// "2") and silently matches nothing when the code has no such text.
//
// The pilot annotation lives in foundations/subagents.mdx: paired `text`
// transcripts where `// emphasize` markers carry the contrast between
// debugging in the main window vs. delegating to a subagent.
import { defineEcConfig } from '@astrojs/starlight/expressive-code';

export default defineEcConfig({
	themes: ['starlight-dark', 'starlight-light'],
});
