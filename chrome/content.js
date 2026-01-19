// Slack2Browser - Opens Slack links in browser, not the desktop app
// Injected into MAIN world at document_start to intercept protocol triggers

(function() {
  // Block slack:// protocol navigation
  const blockSlackProtocol = (url) => {
    if (typeof url === 'string' && url.startsWith('slack://')) {
      console.log('[Slack2Browser] Blocked slack:// navigation');
      return true;
    }
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

  // Remove slack:// links and iframes immediately and continuously
  const removeSlackProtocol = () => {
    // Remove slack:// links
    document.querySelectorAll('a[href^="slack://"]').forEach(el => {
      el.removeAttribute('href');
      el.style.pointerEvents = 'none';
    });
    // Remove slack:// iframes
    document.querySelectorAll('iframe[src^="slack://"]').forEach(el => el.remove());
    // Remove meta refresh to slack://
    document.querySelectorAll('meta[http-equiv="refresh"]').forEach(el => {
      if (el.content && el.content.includes('slack://')) el.remove();
    });
  };

  // Run immediately
  removeSlackProtocol();

  // Watch for new elements
  const observer = new MutationObserver(removeSlackProtocol);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['href', 'src'] });

  // Intercept clicks on any link
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && link.href.startsWith('slack://')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }, true);

  // Handle redirect to browser version
  const url = new URL(window.location.href);

  if (url.pathname.includes('/ssb/redirect')) {
    window.stop();
    const redir = url.searchParams.get('redir');
    if (redir) {
      origReplace(decodeURIComponent(redir));
      return;
    }
    const match = url.hostname.match(/^(.+)\.slack\.com$/);
    if (match) {
      origReplace('https://' + match[1] + '.slack.com/');
    }
    return;
  }

  if (url.pathname.includes('/archives/')) {
    const findBrowserLink = () => {
      const link = document.querySelector('a[href*="/messages/"]') ||
                   document.querySelector('a.p-ssb_redirect__open_in_browser') ||
                   document.querySelector('[data-qa="ssb_redirect_open_browser"]') ||
                   Array.from(document.querySelectorAll('a')).find(a =>
                     a.href && a.href.includes('.slack.com/') && !a.href.startsWith('slack://')
                   );
      if (link && link.href) {
        origReplace(link.href);
        return true;
      }
      return false;
    };

    if (!findBrowserLink()) {
      const poll = () => {
        let attempts = 0;
        const interval = setInterval(() => {
          if (findBrowserLink() || ++attempts > 20) clearInterval(interval);
        }, 250);
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { if (!findBrowserLink()) poll(); });
      } else {
        poll();
      }
    }
  }
})();
