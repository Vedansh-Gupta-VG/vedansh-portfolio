// ============================================================================
// BUILD SCRIPT
// ----------------------------------------------------------------------------
// This project is written as many small per-section files (css/hero.css,
// js/nav.js, etc.) on purpose — that's what makes it easy to find and edit
// one feature at a time. But shipping 16 separate CSS files and 15 separate
// JS files to real visitors means 31 extra network requests before the page
// can finish rendering, which is what was dragging the Lighthouse
// Performance score down (was 65/100).
//
// This script does NOT change how you edit the site day to day — keep
// editing the files in css/ and js/ exactly as before. Run this script
// before deploying (or wire it into your host's build command) and it will:
//   1. Concatenate all CSS files (in the same order as index.html) into
//      dist/main.min.css, then minify it
//   2. Concatenate all JS files (in the same order as index.html) into
//      dist/main.min.js, then minify it
//   3. Copy index.html into dist/, rewriting its <link>/<script> tags to
//      point at the two bundled files instead of the 31 individual ones
//   4. Copy the assets/ folder into dist/ as-is (images aren't bundled)
//
// USAGE:
//   npm install        (one-time, installs esbuild + clean-css-cli)
//   npm run build       -> produces a ready-to-deploy dist/ folder
// ============================================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// Exact load order copied from index.html — keeps cascade/execution order
// identical to the unbundled version so nothing breaks by reordering.
const CSS_FILES = [
  'variables.css', 'base.css', 'atmosphere.css', 'nav.css', 'hero.css',
  'modal.css', 'about.css', 'skills.css', 'experience.css', 'projects.css',
  'achievements.css', 'education.css', 'doc-viewer.css', 'terminal.css',
  'contact.css', 'end.css',
];

const JS_FILES = [
  'atmosphere.js', 'interactions.js', 'selection.js', 'modal.js',
  'certificates.js', 'experience.js', 'projects-data.js', 'projects.js',
  'terminal.js', 'achievements.js', 'education.js', 'contact.js', 'end.js',
  'nav.js', 'hero.js',
];

function rmrf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

console.log('Building production bundle into dist/ ...');
rmrf(DIST);
fs.mkdirSync(DIST, { recursive: true });

// 1. Bundle + minify CSS
const cssCombinedPath = path.join(ROOT, '.build-combined.css');
const cssCombined = CSS_FILES.map(f => fs.readFileSync(path.join(ROOT, 'css', f), 'utf8')).join('\n');
fs.writeFileSync(cssCombinedPath, cssCombined);
execSync(`npx cleancss -o "${path.join(DIST, 'main.min.css')}" "${cssCombinedPath}"`, { stdio: 'inherit' });
fs.unlinkSync(cssCombinedPath);

// 2. Bundle + minify JS (esbuild handles concatenation + minification in one pass,
// and keeps the plain <script> execution order the files already relied on —
// no ES module conversion, so no behavior change from how it runs today)
const jsCombinedPath = path.join(ROOT, '.build-combined.js');
const jsCombined = JS_FILES.map(f => fs.readFileSync(path.join(ROOT, 'js', f), 'utf8')).join('\n;\n');
fs.writeFileSync(jsCombinedPath, jsCombined);
execSync(`npx esbuild "${jsCombinedPath}" --minify --outfile="${path.join(DIST, 'main.min.js')}"`, { stdio: 'inherit' });
fs.unlinkSync(jsCombinedPath);

// 3. Copy + rewrite index.html
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Remove all 16 individual <link rel="stylesheet"> tags, replace with one
CSS_FILES.forEach(f => {
  html = html.replace(new RegExp(`\\s*<link rel="stylesheet" href="css/${f}">`), '');
});
html = html.replace(
  '</head>',
  '  <link rel="stylesheet" href="main.min.css">\n</head>'
);

// Remove all 15 individual <script src="js/..."> tags, replace with one
// (the EmailJS CDN <script> tag is left untouched — that's a third-party
// library, not part of this project's own source)
JS_FILES.forEach(f => {
  html = html.replace(new RegExp(`\\s*<script src="js/${f}"></script>`), '');
});
html = html.replace(
  '</body>',
  '  <script src="main.min.js"></script>\n</body>'
);

fs.writeFileSync(path.join(DIST, 'index.html'), html);

// 4. Copy assets as-is (images are not bundled/minified by this script)
copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
// content-to-add/ holds real uploaded documents referenced directly by path
// in index.html (data-cert-image="content-to-add/...") — certificates,
// certifications, project images, the research paper, and the resume PDF.
// Missing this folder is why those images/PDFs 404 in a dist/ build.
if (fs.existsSync(path.join(ROOT, 'content-to-add'))) {
  copyDir(path.join(ROOT, 'content-to-add'), path.join(DIST, 'content-to-add'));
}

console.log('Done. dist/ is ready to deploy — 31 requests down to 2 (main.min.css + main.min.js).');
