/* WorkLoop — main.js
   Used by: all pages (services, bruksvilkar, personvern)
   Provides: scroll animations, smooth scroll, FAQ accordion, mailto fallback */

(function () {
  'use strict';

  /* ─── Scroll animations (IntersectionObserver) ──────────── */
  var animateElements = document.querySelectorAll('.animate-on-scroll');
  if (animateElements.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animateElements.forEach(function (el) { observer.observe(el); });
  } else {
    animateElements.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ─── Smooth scroll for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 72;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ─── FAQ accordion ─────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item   = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (el) {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ─── Mailto fallback: auto-copy email after 1s ─────────── */
  /* If the user's OS can't open a mail client, the mailto: link
     fails silently. After 1 second we assume it didn't work,
     auto-copy the address to clipboard, and show a toast. */

  var EMAIL = 'kontakt@workloop.no';
  var toastEl = null;

  function createToast() {
    if (toastEl) return toastEl;
    toastEl = document.createElement('div');
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    toastEl.textContent = 'E-postadresse kopiert!';
    var s = toastEl.style;
    s.position = 'fixed';
    s.bottom = '24px';
    s.right = '24px';
    s.background = '#1A2E44';
    s.color = '#fff';
    s.padding = '12px 20px';
    s.borderRadius = '10px';
    s.fontSize = '0.9rem';
    s.fontWeight = '600';
    s.fontFamily = 'inherit';
    s.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
    s.zIndex = '10000';
    s.opacity = '0';
    s.transform = 'translateY(12px)';
    s.transition = 'opacity 0.25s ease, transform 0.25s ease';
    s.pointerEvents = 'none';
    document.body.appendChild(toastEl);
    return toastEl;
  }

  function showToast() {
    var t = createToast();
    t.style.opacity = '1';
    t.style.transform = 'translateY(0)';
    setTimeout(function () {
      t.style.opacity = '0';
      t.style.transform = 'translateY(12px)';
    }, 2500);
  }

  function copyEmail() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(showToast);
    } else {
      /* Fallback for older browsers */
      var ta = document.createElement('textarea');
      ta.value = EMAIL;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast();
    }
  }

  /* Attach to every mailto link on the page */
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      /* After 1 second, auto-copy and show toast as fallback */
      setTimeout(function () {
        copyEmail();
      }, 1000);
    });
  });

})();
