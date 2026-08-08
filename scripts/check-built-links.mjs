import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const SITE = new URL('https://www.agentscli.com');

if (!existsSync(DIST)) {
  console.error('dist/ does not exist. Run `pnpm build` before checking built links.');
  process.exit(1);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const filePath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(filePath) : [filePath];
  }));
  return nested.flat();
}

function routeFor(filePath) {
  const relative = path.relative(DIST, filePath).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
}

function decodeFragment(fragment) {
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
}

const allFiles = await walk(DIST);
const htmlFiles = allFiles.filter((file) => file.endsWith('.html'));
const publicPaths = new Set(allFiles.map((file) => `/${path.relative(DIST, file).replaceAll(path.sep, '/')}`));
const pages = new Map();

for (const filePath of htmlFiles) {
  const html = await readFile(filePath, 'utf8');
  const anchors = new Set([
    ...[...html.matchAll(/\s(?:id|name)=["']([^"']+)["']/g)].map((match) => match[1]),
  ]);
  const page = { filePath, html, anchors };
  const route = routeFor(filePath);
  pages.set(route, page);
  // Starlight's generated 404 page uses /404/ as its canonical URL while the
  // static artifact is necessarily /404.html.
  if (route === '/404.html') pages.set('/404/', page);
}

const failures = new Set();
let checked = 0;

for (const [sourceRoute, page] of pages) {
  // Anchor the attribute search to a real opening tag. Documentation examples
  // can legitimately contain text such as `href="relative/path"`.
  for (const match of page.html.matchAll(/<[a-z][^>]*?\s(?:href|src)=["']([^"']+)["'][^>]*>/gi)) {
    const rawTarget = match[1];
    if (
      !rawTarget ||
      rawTarget.startsWith('data:') ||
      rawTarget.startsWith('mailto:') ||
      rawTarget.startsWith('tel:') ||
      rawTarget.startsWith('javascript:')
    ) continue;

    let target;
    try {
      target = new URL(rawTarget.replaceAll('&amp;', '&'), new URL(sourceRoute, SITE));
    } catch {
      failures.add(`${sourceRoute} -> ${rawTarget} (invalid URL)`);
      continue;
    }
    if (target.origin !== SITE.origin) continue;

    checked += 1;
    const targetPage = pages.get(target.pathname) ?? pages.get(`${target.pathname}/`);
    const targetFile = publicPaths.has(target.pathname);

    if (!targetPage && !targetFile) {
      failures.add(`${sourceRoute} -> ${rawTarget} (missing target)`);
      continue;
    }

    if (target.hash && targetPage) {
      const fragment = decodeFragment(target.hash.slice(1));
      if (!targetPage.anchors.has(fragment)) {
        failures.add(`${sourceRoute} -> ${rawTarget} (missing fragment)`);
      }
    }
  }
}

if (failures.size) {
  console.error(`Found ${failures.size} broken built link(s):`);
  for (const failure of failures) console.error(`✗ ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${checked} internal links and assets across ${htmlFiles.length} built pages.`);
}
