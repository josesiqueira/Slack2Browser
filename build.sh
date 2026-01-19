#!/bin/bash
# Build script for Slack2Browser
# Creates browser-ready folders in chrome/ and firefox/

cp src/content.js chrome/
cp -r src/icons chrome/

cp src/content.js firefox/
cp -r src/icons firefox/

echo "Build complete: chrome/ and firefox/ are ready to load"
