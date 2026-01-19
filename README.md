# Slack2Browser

Opens Slack links in your browser instead of the desktop app.

Works on **Chrome** and **Firefox**.

## Install

### Chrome
1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** → select this folder

### Firefox
1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on** → select `manifest.json`

## Linux

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

Then check "Always allow" and click "Open xdg-open" — it does nothing and won't ask again.
