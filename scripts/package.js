const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const BROWSERS = ['chrome', 'firefox'];

// Run build first
require('./build.js');

console.log('\nPackaging for store submission...\n');

for (const browser of BROWSERS) {
  const browserDir = path.join(DIST, browser);
  const zipName = `slack2browser-${browser}.zip`;
  const zipPath = path.join(DIST, zipName);

  // Remove old zip if exists
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  // Create zip
  execSync(`cd "${browserDir}" && zip -r "../${zipName}" .`);

  console.log(`✓ ${zipName}`);
}

console.log('\nPackages ready in dist/');
console.log('  - slack2browser-chrome.zip → Chrome Web Store');
console.log('  - slack2browser-firefox.zip → Firefox Add-ons (AMO)');
