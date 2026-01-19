# Slack2Browser

Chrome extension that opens Slack links in your browser instead of the desktop app.

## Install

1. Download or clone this repository
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the `Slack2Browser` folder

## Linux Users

If you see a popup asking to open `xdg-open`, run this once in terminal:

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

Then check "Always allow" and click "Open xdg-open" - it will do nothing and never ask again.

## How it works

When you click a Slack link, Slack tries to open the desktop app. This extension intercepts that and redirects you to the browser version instead.
