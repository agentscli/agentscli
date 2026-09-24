import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { scanCourse, scanPage, sidebarEntries } from './check-course-editorial.mjs';

test('candidate regions distinguish prose, frontmatter, code, and output', () => {
  const source = ['---', 'title: "A — title"', '---', 'As discussed earlier, budgetcli', '```js', 'const label = "Blast radius";', '```', '~~~console', 'budgetcli — output', '~~~', 'Blast radius'].join('\n');
  const result = scanPage(source, 'lesson.mdx');
  assert.equal(result.candidates.find((row) => row.line === 2).region, 'frontmatter');
  assert.equal(result.candidates.find((row) => row.line === 4).region, 'prose');
  assert.equal(result.candidates.find((row) => row.line === 6).region, 'code');
  assert.equal(result.candidates.find((row) => row.line === 9).region, 'output');
  assert.equal(result.candidates.find((row) => row.line === 11).region, 'prose');
});

test('short inner fences do not close an outer fence', () => {
  const result = scanPage('---\ntitle: Test\n---\n````md\n```\nbudgetcli\n````\nbudgetcli', 'lesson.mdx');
  assert.deepEqual(result.candidates.map((row) => row.region), ['code', 'prose']);
});

test('sidebar parser reads either property order and reports dynamic mappings without executing source', () => {
  const parsed = sidebarEntries("throw new Error('must not run'); const entries = [{slug: 'course/codex/a', label: 'Short'}, {label: `Other`, slug: 'course/codex/b'}, {slug: target, label: 'Dynamic'}];");
  assert.deepEqual(parsed.entries.map((row) => row.label), ['Short', 'Other']);
  assert.equal(parsed.limitations.length, 1);
  assert.throws(() => sidebarEntries('const x = {'), /Cannot parse/);
});

test('mapping review allows shorter labels, detects missing targets and conflicts, and scopes tracks', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'course-editorial-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const directory = path.join(root, 'src/content/docs/course/codex');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.mdx'), '---\ntitle: Codex overview with a long title\n---\nbudgetcli');
  fs.writeFileSync(path.join(directory, 'unlisted.mdx'), '---\ntitle: Unlisted\n---\nText');
  fs.writeFileSync(path.join(root, 'astro.config.mjs'), "const entries = [{label: 'Overview', slug: 'course/codex'}, {label: 'Missing', slug: 'course/codex/missing'}, {label: 'Elsewhere', slug: 'course/cursor'}];");
  const result = scanCourse({ root, track: 'codex' });
  assert.equal(result.pageCount, 2);
  assert.deepEqual(result.pages.map((page) => page.path), [
    'src/content/docs/course/codex/index.mdx',
    'src/content/docs/course/codex/unlisted.mdx',
  ]);
  assert.ok(result.pages.every((page) => /^[a-f0-9]{64}$/.test(page.sha256)));
  assert.equal(result.sidebarMappings.length, 2);
  assert.deepEqual(result.candidates.map((row) => row.kind), ['project-mention', 'sidebar-target-missing', 'sidebar-entry-missing']);
  fs.appendFileSync(path.join(root, 'astro.config.mjs'), "const extra = {slug: 'course/codex', label: 'Conflicting'};");
  assert.ok(scanCourse({ root, track: 'codex' }).candidates.some((row) => row.kind === 'sidebar-label-conflict'));
  assert.throws(() => scanCourse({ root, track: '../codex' }), /course slug/);
  const script = path.resolve('scripts/check-course-editorial.mjs');
  const run = spawnSync(process.execPath, [script, 'codex'], { cwd: root, encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(JSON.parse(run.stdout).advisory, true);
  const bad = spawnSync(process.execPath, [script, '../codex'], { cwd: root, encoding: 'utf8' });
  assert.equal(bad.status, 1);
});

test('missing and unsupported titles remain explicit rather than silently passing', () => {
  assert.equal(scanPage('Text', 'a.mdx').candidates[0].kind, 'missing-title');
  assert.equal(scanPage('---\ntitle: >\n  Multiline title\n---', 'a.mdx').candidates[0].kind, 'title-needs-inspection');
});

test('manifest hashes exact bytes, including pages with no candidates, and updates after edits', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'course-hashes-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const directory = path.join(root, 'src/content/docs/course/codex');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(root, 'astro.config.mjs'), "const x = [{slug: 'course/codex/a', label: 'A'}, {slug: 'course/codex/b', label: 'B'}];");
  fs.writeFileSync(path.join(directory, 'a.mdx'), 'abc');
  const cleanPage = path.join(directory, 'b.mdx');
  fs.writeFileSync(cleanPage, '---\r\ntitle: B\r\n---\r\nClean prose\r\n');
  const first = scanCourse({ root, track: 'codex' });
  assert.equal(first.pages[0].sha256, 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.equal(first.candidates.filter((candidate) => candidate.file.endsWith('b.mdx')).length, 0);
  assert.equal(first.pages.length, 2);
  fs.writeFileSync(cleanPage, fs.readFileSync(cleanPage, 'utf8').replaceAll('\r\n', '\n'));
  const second = scanCourse({ root, track: 'codex' });
  assert.notEqual(first.pages[1].sha256, second.pages[1].sha256);
  assert.equal(first.pages[0].sha256, second.pages[0].sha256);
});
