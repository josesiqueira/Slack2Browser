# Slack2Browser

Chrome/Firefox extension that opens Slack links in your browser instead of the desktop app.

## Install

### Chrome

1. Clone this repo
2. Run `./build.sh`
3. Open `chrome://extensions/`
4. Enable **Developer mode** (top right)
5. Click **Load unpacked** → select the `chrome` folder

### Firefox

1. Clone this repo
2. Run `./build.sh`
3. Open `about:debugging#/runtime/this-firefox`
4. Click **Load Temporary Add-on** → select `firefox/manifest.json`

## Linux Users

If you see a popup asking to open `xdg-open`, run this once:

```bash
mkdir -p ~/.local/share/applications && cat > ~/.local/share/applications/slack-ignore.desktop << 'EOF'
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

## How it works

When you click a Slack link, Slack tries to open the desktop app. This extension intercepts that and redirects you to the browser version instead.
