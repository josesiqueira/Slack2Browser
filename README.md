# Slack2Browser

Opens Slack links in your browser instead of the desktop app.

## Install from Store

- **Chrome**: *Coming soon*
- **Firefox**: *Coming soon*

## Install from Source

### Build

```bash
git clone https://github.com/josesiqueira/Slack2Browser.git
cd Slack2Browser
npm run build
```

### Load in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select `dist/chrome`

### Load in Firefox

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on** → select `dist/firefox/manifest.json`

## Linux Users

If you see a popup asking to open `xdg-open`, run this once:

```bash
mkdir -p ~/.local/share/applications
cat > ~/.local/share/applications/slack-ignore.desktop << 'EOF'
[Desktop Entry]
Name=Ignore Slack Protocol
Exec=/bin/true
Type=Application
NoDisplay=true
MimeType=x-scheme-handler/slack;
EOF
xdg-mime default slack-ignore.desktop x-scheme-handler/slack
```

Check "Always allow" and click "Open xdg-open" — it does nothing and won't ask again.

## Development

```
Slack2Browser/
├── src/                  # Extension source code
│   ├── content.js
│   └── icons/
├── manifests/            # Manifest templates
│   ├── base.json         # Shared manifest
│   ├── chrome.json       # Chrome-specific
│   └── firefox.json      # Firefox-specific
├── scripts/              # Build scripts
│   ├── build.js          # Builds to dist/
│   └── package.js        # Creates store zips
└── dist/                 # Build output (gitignored)
    ├── chrome/
    └── firefox/
```

### Commands

```bash
npm run build      # Build for both browsers
npm run package    # Build + create zip files for store submission
```

## Publishing

### Chrome Web Store

1. Run `npm run package`
2. Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Upload `dist/slack2browser-chrome.zip`

### Firefox Add-ons (AMO)

1. Run `npm run package`
2. Go to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
3. Upload `dist/slack2browser-firefox.zip`

## License

MIT
