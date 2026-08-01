import fs from 'node:fs';
import path from 'node:path';

const course = process.argv[2] ?? 'copilot';
if (!/^[a-z0-9-]+$/.test(course)) {
  console.error(`Invalid course slug: ${course}`);
  process.exit(1);
}

const courseRoot = path.resolve('src/content/docs/course', course);
const prefix = `/course/${course}/`;
const files = [];

if (!fs.existsSync(courseRoot)) {
  console.error(`Course directory not found: ${courseRoot}`);
  process.exit(1);
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(filePath);
    else if (entry.name.endsWith('.mdx')) files.push(filePath);
  }
}

function routeFor(filePath) {
  const relative = path.relative(courseRoot, filePath).replaceAll(path.sep, '/');
  const withoutExtension = relative.replace(/\.mdx$/, '');
  const route = withoutExtension === 'index'
    ? ''
    : withoutExtension.endsWith('/index')
      ? withoutExtension.slice(0, -'/index'.length)
      : withoutExtension;
  return `${prefix}${route ? `${route}/` : ''}`;
}

walk(courseRoot);
const routes = new Set(files.map(routeFor));
const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const linkPattern = new RegExp(`\\]\\((${escapedPrefix}[^)#?\\s]+)\\)`, 'g');
const broken = [];
let linkCount = 0;

for (const filePath of files) {
  const contents = fs.readFileSync(filePath, 'utf8');
  let match;
  while ((match = linkPattern.exec(contents))) {
    linkCount += 1;
    const target = match[1].endsWith('/') ? match[1] : `${match[1]}/`;
    if (!routes.has(target)) broken.push(`${filePath}: ${match[1]}`);
  }
}

if (broken.length > 0) {
  console.error(`Found ${broken.length} broken ${course} course link(s):`);
  for (const link of broken) console.error(`- ${link}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${files.length} ${course} course pages and ${linkCount} internal links.`);
}
