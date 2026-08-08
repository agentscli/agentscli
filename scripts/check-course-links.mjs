import fs from 'node:fs';
import path from 'node:path';

const coursesRoot = path.resolve('src/content/docs/course');
const requestedCourse = process.argv[2];

if (requestedCourse && !/^[a-z0-9-]+$/.test(requestedCourse)) {
  console.error(`Invalid course slug: ${requestedCourse}`);
  process.exit(1);
}

if (!fs.existsSync(coursesRoot)) {
  console.error(`Course directory not found: ${coursesRoot}`);
  process.exit(1);
}

const courses = requestedCourse
  ? [requestedCourse]
  : fs.readdirSync(coursesRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .filter((entry) => !entry.name.startsWith('.'))
      .map((entry) => entry.name)
      .sort();

function walk(directory, files) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(filePath, files);
    else if (entry.name.endsWith('.mdx')) files.push(filePath);
  }
}

function checkCourse(course) {
  const courseRoot = path.join(coursesRoot, course);
  const prefix = `/course/${course}/`;
  const files = [];

  if (!fs.existsSync(courseRoot)) {
    return { failures: [`Course directory not found: ${courseRoot}`], fileCount: 0, linkCount: 0 };
  }

  walk(courseRoot, files);

  const routeFor = (filePath) => {
    const relative = path.relative(courseRoot, filePath).replaceAll(path.sep, '/');
    const withoutExtension = relative.replace(/\.mdx$/, '');
    const route = withoutExtension === 'index'
      ? ''
      : withoutExtension.endsWith('/index')
        ? withoutExtension.slice(0, -'/index'.length)
        : withoutExtension;
    return `${prefix}${route ? `${route}/` : ''}`;
  };

  const routes = new Set(files.map(routeFor));
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const linkPattern = new RegExp(`\\]\\((${escapedPrefix}[^)#?\\s]+)\\)`, 'g');
  const failures = [];
  let linkCount = 0;

  for (const filePath of files) {
    const contents = fs.readFileSync(filePath, 'utf8');
    let match;
    while ((match = linkPattern.exec(contents))) {
      linkCount += 1;
      const target = match[1].endsWith('/') ? match[1] : `${match[1]}/`;
      if (!routes.has(target)) failures.push(`${filePath}: ${match[1]}`);
    }
  }

  return { failures, fileCount: files.length, linkCount };
}

let totalFiles = 0;
let totalLinks = 0;
const failures = [];

for (const course of courses) {
  const result = checkCourse(course);
  totalFiles += result.fileCount;
  totalLinks += result.linkCount;
  failures.push(...result.failures);
  if (!result.failures.length) {
    console.log(`✓ ${course}: ${result.fileCount} pages, ${result.linkCount} internal links`);
  }
}

if (failures.length) {
  console.error(`Found ${failures.length} broken course link(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${courses.length} course(s), ${totalFiles} pages, and ${totalLinks} internal links.`);
}
