// Slack2Browser - Opens Slack links in browser, not the desktop app

(function() {
  const blockSlackProtocol = (url) => {
    if (typeof url === 'string' && url.startsWith('slack://')) return true;
    return false;
  };

  // Override location methods
  const origAssign = window.location.assign.bind(window.location);
  const origReplace = window.location.replace.bind(window.location);

  window.location.assign = function(url) {
    if (blockSlackProtocol(url)) return;
    origAssign(url);
  };

  window.location.replace = function(url) {
    if (blockSlackProtocol(url)) return;
    origReplace(url);
  };

  // Override window.open
  const origOpen = window.open.bind(window);
  window.open = function(url, ...args) {
    if (blockSlackProtocol(url)) return null;
    return origOpen(url, ...args);
  };

  // Remove slack:// elements
  const removeSlackProtocol = () => {
    document.querySelectorAll('a[href^="slack://"]').forEach(el => el.removeAttribute('href'));
    document.querySelectorAll('iframe[src^="slack://"]').forEach(el => el.remove());
  };

  removeSlackProtocol();
  new MutationObserver(removeSlackProtocol).observe(document.documentElement, {
    childList: true, subtree: true, attributes: true, attributeFilter: ['href', 'src']
  });

  // Block clicks on slack:// links
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && link.href.startsWith('slack://')) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);

  // Redirect to browser version
  const url = new URL(window.location.href);

  if (url.pathname.includes('/ssb/redirect')) {
    window.stop();
    const redir = url.searchParams.get('redir');
    if (redir) return origReplace(decodeURIComponent(redir));
    const match = url.hostname.match(/^(.+)\.slack\.com$/);
    if (match) return origReplace('https://' + match[1] + '.slack.com/');
  }

  if (url.pathname.includes('/archives/')) {
    const findBrowserLink = () => {
      const link = document.querySelector('a[href*="/messages/"]') ||
                   document.querySelector('a.p-ssb_redirect__open_in_browser') ||
                   Array.from(document.querySelectorAll('a')).find(a =>
                     a.href && a.href.includes('.slack.com/') && !a.href.startsWith('slack://')
                   );
      if (link) { origReplace(link.href); return true; }
      return false;
    };

    const poll = () => {
      let attempts = 0;
      const interval = setInterval(() => {
        if (findBrowserLink() || ++attempts > 20) clearInterval(interval);
      }, 250);
    };

    if (!findBrowserLink()) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { if (!findBrowserLink()) poll(); });
      } else poll();
    }
  }
})();
