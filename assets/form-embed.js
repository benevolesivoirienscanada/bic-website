// form-embed.js
// -------------------------------------------------------------------------
// Reveals the Google Forms iframe when the user clicks the intro button.
// Used by adhesion.html (FR) and en/membership.html (EN).
//
// External file (rather than inline) so that the strict CSP in `_headers`
// (`script-src 'self'`) doesn't reject it. Adding 'unsafe-inline' to the
// CSP would weaken XSS protection across the whole site — externalizing
// is the safer choice.
// -------------------------------------------------------------------------

(function () {
  function init() {
    const btn = document.getElementById('form-start-btn');
    const intro = document.getElementById('form-intro');
    const wrap = document.getElementById('form-iframe-wrap');
    const iframe = document.getElementById('form-iframe');

    if (!btn || !intro || !wrap || !iframe) return;

    btn.addEventListener('click', () => {
      // Lazy-load: only set src on click. Keeps the page fast on first load.
      if (!iframe.src && iframe.dataset.src) {
        iframe.src = iframe.dataset.src;
      }

      // Hide intro card, reveal iframe wrapper.
      intro.style.display = 'none';
      wrap.style.display = 'block';

      // Smooth-scroll so the form is in view after reveal.
      wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // The script tag has `defer`, so the DOM is ready when this runs —
  // but guard against the script being loaded synchronously elsewhere.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
