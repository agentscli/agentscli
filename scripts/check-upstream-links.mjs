import { readdir, readFile } from 'node:fs/promises';

const ROOT = new URL('../src/content/docs/foundations/', import.meta.url);

// Unknown flags are a hard error: a typo'd --network used to fall through to
// the offline path and still report success, which is the one failure this
// script must never have.
const KNOWN_FLAGS = new Set(['--network']);
const unknown = process.argv.slice(2).filter((arg) => !KNOWN_FLAGS.has(arg));
if (unknown.length) {
  console.error(`Unknown option(s): ${unknown.join(', ')}`);
  console.error('Usage: node scripts/check-upstream-links.mjs [--network]');
  process.exit(2);
}

const NETWORK = process.argv.includes('--network');
const TIMEOUT_MS = 8000;
const CONCURRENCY = 8;
// A bare node UA is a common 403 trigger on bot-protected doc CDNs.
const USER_AGENT = 'agentscli-link-check (+https://www.agentscli.com)';

// The overview page is prose about the other chapters and carries no refs.
const NO_REFS_EXPECTED = new Set(['index.mdx']);

const entries = await readdir(ROOT, { withFileTypes: true });
const files = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
  .map((entry) => new URL(entry.name, ROOT));

const failures = [];
const links = [];
const linksPerFile = new Map();

for (const file of files) {
  const text = await readFile(file, 'utf8');
  const label = file.pathname.split('/').at(-1);
  linksPerFile.set(label, 0);

  for (const match of text.matchAll(/<UpstreamRefs\b([\s\S]*?)\/>/g)) {
    const block = match[1];
    const checkedAt = block.match(/\bcheckedAt=["'](\d{4}-\d{2}-\d{2})["']/)?.[1];
    if (!checkedAt) failures.push(`${label}: UpstreamRefs is missing checkedAt`);
    else if (Number.isNaN(Date.parse(checkedAt))) failures.push(`${label}: invalid checkedAt ${checkedAt}`);

    for (const urlMatch of block.matchAll(/\burl:\s*["']([^"']+)["']/g)) {
      const url = urlMatch[1];
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'https:') throw new Error('must use https');
        links.push({ file: label, url });
        linksPerFile.set(label, linksPerFile.get(label) + 1);
      } catch (error) {
        failures.push(`${label}: ${url} (${error.message})`);
      }
    }
  }
}

// Coverage floor. Without this, a chapter that ships no UpstreamRefs at all -
// or one whose links are built outside the tag, where the attribute regex
// can't see them - passes as green having checked nothing.
for (const [label, count] of linksPerFile) {
  if (NO_REFS_EXPECTED.has(label)) continue;
  if (count === 0) {
    failures.push(`${label}: no UpstreamRefs links found (every chapter needs upstream refs with a checkedAt date)`);
  }
}

if (NETWORK) {
  const probe = async ({ file, url }) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const init = {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': USER_AGENT },
    };
    try {
      let response = await fetch(url, { ...init, method: 'HEAD' });
      // Plenty of doc hosts answer an unknown HEAD with 403/404/405 rather
      // than implementing it, so retry anything >= 400 as a GET before
      // calling the link dead.
      if (response.status >= 400) {
        response = await fetch(url, { ...init, method: 'GET' });
      }
      if (response.status >= 400) return `${file}: ${url} (${response.status})`;
    } catch (error) {
      return `${file}: ${url} (${error.name === 'AbortError' ? 'timeout' : error.message})`;
    } finally {
      clearTimeout(timer);
    }
    return null;
  };

  // These links cluster onto a handful of vendor domains, so firing all of
  // them at once mostly produces rate-limit failures that look like link rot.
  const queue = [...links];
  const checked = [];
  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    let next;
    while ((next = queue.shift()) !== undefined) {
      checked.push(await probe(next));
    }
  });
  await Promise.all(workers);
  failures.push(...checked.filter(Boolean));
}

if (failures.length) {
  console.error(`Found ${failures.length} upstream link problem(s):`);
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${links.length} upstream URLs across ${linksPerFile.size} Foundations pages${NETWORK ? ' (network)' : ''}.`);
}
