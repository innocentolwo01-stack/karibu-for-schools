import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const appRoot = path.join(root, 'app');

function walk(directory, matcher) {
  const output = [];
  for (const name of fs.readdirSync(directory)) {
    const fullPath = path.join(directory, name);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) output.push(...walk(fullPath, matcher));
    else if (matcher(fullPath)) output.push(fullPath);
  }
  return output;
}

const routePatterns = walk(appRoot, file => file.endsWith('.tsx'))
  .filter(file => path.basename(file) !== '_layout.tsx')
  .map(file => {
    let parts = path.relative(appRoot, file).replace(/\.tsx$/, '').split(path.sep);
    parts = parts.filter(part => !(part.startsWith('(') && part.endsWith(')')));
    if (parts.at(-1) === 'index') parts = parts.slice(0, -1);
    const route = `/${parts.join('/')}` || '/';
    const pattern = new RegExp(`^${route.replace(/\[[^/]+\]/g, '[^/]+')}$`);
    return { route, pattern };
  });

const sourceRoots = ['app', 'components', 'context'];
const sourceFiles = sourceRoots.flatMap(directory => walk(path.join(root, directory), file => /\.tsx?$/.test(file)));
const references = [];
const referencePattern = /(?:router\.(?:push|replace)\(\s*|pathname:\s*|route:\s*)['"](\/[^'"]+)['"]/g;

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(referencePattern)) {
    references.push({ file: path.relative(root, file), route: match[1].split('?')[0] });
  }
}

const missing = references.filter(reference => !routePatterns.some(item => item.pattern.test(reference.route)));
if (missing.length) {
  console.error('Invalid internal routes:');
  for (const item of missing) console.error(`- ${item.file}: ${item.route}`);
  process.exit(1);
}

console.log(`Validated ${references.length} internal route references against ${routePatterns.length} application routes.`);
