import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Candidate inventory only. Presentation authority: docs/COURSE_AUTHORING_GUIDE.md.
// Parse the configuration as source; never execute its imports or expressions.
export function sidebarEntries(source, filename = 'astro.config.mjs') {
  const tree = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  if (tree.parseDiagnostics.length) throw new Error(`Cannot parse ${filename}`);
  const entries = [];
  const limitations = [];
  const literal = (node) => node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    ? node.text : undefined;
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const properties = new Map(node.properties.filter(ts.isPropertyAssignment)
        .map((property) => [property.name.getText(tree).replace(/^['"]|['"]$/g, ''), property.initializer]));
      if (properties.has('slug')) {
        const slug = literal(properties.get('slug'));
        const label = literal(properties.get('label'));
        const line = tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1;
        if (slug === undefined) limitations.push({ file: filename, line, reason: 'Dynamic slug requires manual inspection.' });
        else if (slug.startsWith('course/')) {
          entries.push({ slug: slug.replace(/\/$/, ''), label, line });
          if (properties.has('label') && label === undefined) {
            limitations.push({ file: filename, line, reason: `Dynamic label for ${slug} requires manual inspection.` });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return { entries, limitations };
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => entry.isDirectory() ? walk(path.join(directory, entry.name))
      : entry.isFile() && entry.name.endsWith('.mdx') ? [path.join(directory, entry.name)] : []);
}

// Regions are lexical, not a full MDX interpretation. This keeps matches visible
// without mistaking quoted output, frontmatter, or code for an editorial verdict.
export function scanPage(source, file) {
  const candidates = [];
  const lines = source.split(/\r?\n/);
  let frontmatter = false;
  let fence;
  let title;
  let titleLine;
  const add = (kind, line, region, excerpt, detail) => candidates.push({ kind, file, line, region, excerpt, detail });
  const patterns = [
    ['scorecard', /Blast radius|Tokens\s*\/\s*Turns|Recurs\?/i],
    ['project-mention', /\bbudgetcli\b/i],
    ['typographic-dash', /[—–]/],
    ['prior-page-reference', /\bas discussed earlier\b/i],
  ];
  for (const [index, line] of lines.entries()) {
    const number = index + 1;
    if (index === 0 && line.trim() === '---') { frontmatter = true; continue; }
    if (frontmatter && line.trim() === '---') { frontmatter = false; continue; }
    if (frontmatter) {
      const match = line.match(/^title:\s*(.*?)\s*$/);
      if (match) {
        titleLine = number;
        const raw = match[1];
        if (/^[>|]/.test(raw)) title = null;
        else if (raw.startsWith('"')) {
          try { title = JSON.parse(raw); } catch { title = null; }
        } else if (raw.startsWith("'")) {
          title = /^'(?:[^']|'')*'$/.test(raw) ? raw.slice(1, -1).replaceAll("''", "'") : null;
        } else title = raw.replace(/\s+#.*$/, '').trim();
      }
    }
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    let region = frontmatter ? 'frontmatter' : fence?.region ?? 'prose';
    if (!frontmatter && marker) {
      if (!fence) {
        const language = marker[2].trim().split(/\s/)[0].toLowerCase();
        region = ['text', 'plaintext', 'output', 'console', 'log'].includes(language) ? 'output' : 'code';
        fence = { character: marker[1][0], length: marker[1].length, region };
      } else if (marker[1][0] === fence.character && marker[1].length >= fence.length && !marker[2].trim()) {
        fence = undefined;
      }
    }
    for (const [kind, pattern] of patterns) {
      if (pattern.test(line)) add(kind, number, region, line.trim(), 'Inspect in context; a match is not a finding.');
    }
  }
  if (titleLine === undefined) add('missing-title', 1, 'frontmatter', '', 'No top-level title found.');
  else if (title === null) add('title-needs-inspection', titleLine, 'frontmatter', lines[titleLine - 1], 'Title syntax requires manual inspection.');
  else if (!title) add('empty-title', titleLine, 'frontmatter', lines[titleLine - 1], 'Title is empty.');
  return { candidates, title };
}

export function scanCourse({ root = process.cwd(), track } = {}) {
  if (track !== undefined && !/^[a-z0-9-]+$/.test(track)) throw new Error('Track must be a course slug.');
  const coursesRoot = path.join(root, 'src/content/docs/course');
  const target = track ? path.join(coursesRoot, track) : coursesRoot;
  if (!fs.statSync(target).isDirectory()) throw new Error(`Not a course directory: ${target}`);
  const files = walk(target);
  if (!files.length) throw new Error(`No course pages in ${target}`);
  const display = (filename) => path.relative(root, filename).split(path.sep).join('/');
  const sidebar = sidebarEntries(fs.readFileSync(path.join(root, 'astro.config.mjs'), 'utf8'));
  const candidates = [];
  const pages = new Map();
  const pageManifest = [];
  for (const filename of files) {
    const file = display(filename);
    const relative = path.relative(coursesRoot, filename).split(path.sep).join('/').replace(/\.mdx$/, '');
    const slug = `course/${relative.replace(/\/index$/, '')}`;
    const bytes = fs.readFileSync(filename);
    pageManifest.push({ path: file, sha256: createHash('sha256').update(bytes).digest('hex') });
    const page = scanPage(bytes.toString('utf8'), file);
    pages.set(slug, { file, title: page.title });
    candidates.push(...page.candidates);
  }
  const relevant = sidebar.entries.filter((entry) => !track || entry.slug === `course/${track}` || entry.slug.startsWith(`course/${track}/`));
  const mappings = [];
  for (const entry of relevant) {
    const page = pages.get(entry.slug);
    mappings.push({ ...entry, file: page?.file, title: page?.title });
    let kind;
    if (!page) kind = 'sidebar-target-missing';
    else if (entry.label === undefined || !entry.label.trim()) kind = 'sidebar-label-needs-inspection';
    if (kind) candidates.push({ kind, file: 'astro.config.mjs', line: entry.line, region: 'configuration', excerpt: entry.slug, detail: 'Inspect this mapping; short labels may intentionally differ from titles.' });
  }
  for (const [slug, page] of pages) {
    const matches = relevant.filter((entry) => entry.slug === slug);
    if (!matches.length) candidates.push({ kind: 'sidebar-entry-missing', file: page.file, line: 1, region: 'configuration', excerpt: slug, detail: 'No static slug mapping found; inspect navigation and any dynamic configuration.' });
    if (new Set(matches.map((entry) => entry.label).filter((label) => label !== undefined)).size > 1) {
      candidates.push({ kind: 'sidebar-label-conflict', file: page.file, line: 1, region: 'configuration', excerpt: slug, detail: 'Multiple labels target this page; inspect whether each use is intentional.' });
    }
  }
  return {
    scope: track ?? 'all',
    pageCount: files.length,
    pages: pageManifest,
    advisory: true,
    candidates,
    sidebarMappings: mappings,
    limitations: [
      'Lexical regions do not fully parse MDX, inline code, JSX, or prose quotations; inspect excerpts before judging.',
      'Output classification uses fence language, not proof of captured provenance.',
      'Sidebar inspection covers literal slug objects only; links, generated entries, spreads, and imported configurations need manual review.',
      ...sidebar.limitations,
    ],
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2).filter((arg) => arg !== '--');
    if (args.length > 1) throw new Error('Usage: node scripts/check-course-editorial.mjs [track]');
    console.log(JSON.stringify(scanCourse({ track: args[0] }), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
