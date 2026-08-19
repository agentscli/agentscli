/**
 * Cheatsheet registry - one entry per tool. `foundations/cheatsheets/<slug>`
 * pages render `<Cheatsheet tool={slug} />`; the component reads from here.
 *
 * Adding a tool: create `<slug>.ts` exporting a `Cheatsheet`, register it
 * below, add the page + sidebar entry. Facts follow the same conf rules
 * (firsthand from the installed binary > documented from official docs).
 */
import { claudeCodeCheatsheet } from './claude-code';
import { codexCheatsheet } from './codex';
import { opencodeCheatsheet } from './opencode';
import { cursorCheatsheet } from './cursor';
import { copilotCheatsheet } from './copilot';
import { piCheatsheet } from './pi';
import type { Cheatsheet } from './claude-code';

export type { Cheatsheet, CheatCategory, CheatEntry, CheatConf } from './claude-code';

export const cheatsheets: Record<string, Cheatsheet> = {
  'claude-code': claudeCodeCheatsheet,
  codex: codexCheatsheet,
  opencode: opencodeCheatsheet,
  cursor: cursorCheatsheet,
  copilot: copilotCheatsheet,
  pi: piCheatsheet,
};
