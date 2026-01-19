const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const MANIFESTS = path.join(ROOT, 'manifests');
const DIST = path.join(ROOT, 'dist');

const BROWSERS = ['chrome', 'firefox'];

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function clean() {
  for (const browser of BROWSERS) {
    const dir = path.join(DIST, browser);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }
  }
}

function build() {
  console.log('Building Slack2Browser...\n');

  clean();

  const baseManifest = JSON.parse(fs.readFileSync(path.join(MANIFESTS, 'base.json'), 'utf8'));

  for (const browser of BROWSERS) {
    const browserDir = path.join(DIST, browser);

    // Copy source files
    copyDir(SRC, browserDir);

    // Merge manifests
    const browserManifest = JSON.parse(fs.readFileSync(path.join(MANIFESTS, `${browser}.json`), 'utf8'));
    const finalManifest = deepMerge(baseManifest, browserManifest);

    // Write manifest
    fs.writeFileSync(
      path.join(browserDir, 'manifest.json'),
      JSON.stringify(finalManifest, null, 2)
    );

    console.log(`✓ ${browser} → dist/${browser}/`);
  }

  console.log('\nDone! Load extensions from dist/chrome or dist/firefox');
}

build();
