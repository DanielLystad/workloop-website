/* WorkLoop AS — main.js */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     SECTION 1: PAGE SWITCHING (SWIPE TRANSITION)
     ───────────────────────────────────────────────────────────── */

  let currentPage = 'landing';
  const pageAbout = document.getElementById('pageAbout');
  const pageLanding = document.getElementById('pageLanding');
  const wiperEdge = document.getElementById('wiperEdge');
  const navBtns = document.querySelectorAll('.nav-btn');
  const scrollMemory = { landing: 0, about: 0 };
  const headerLogo = document.getElementById('headerLogo');
  const headerNav = document.getElementById('headerNav');

  /* Duration must match the CSS transition on .page (0.7s = 700ms) */
  const SWIPE_DURATION = 700;
  let swipeRafId = null;

  function switchPage(target) {
    if (currentPage === target || !pageAbout || !pageLanding) return;

    // Save outgoing page scroll position
    const outgoingEl = currentPage === 'about' ? pageAbout : pageLanding;
    scrollMemory[currentPage] = outgoingEl.scrollTop;

    // Update nav button active states
    navBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === target);
    });

    /* ── Animate wiper edge along the seam ── */
    if (wiperEdge) {
      wiperEdge.classList.add('is-moving');
      // Animate the glow line from one side to the other
      const startX = target === 'about' ? window.innerWidth : 0;
      const endX   = target === 'about' ? 0 : window.innerWidth;
      const t0 = performance.now();
      if (swipeRafId) cancelAnimationFrame(swipeRafId);

      (function moveEdge(now) {
        const p = Math.min((now - t0) / SWIPE_DURATION, 1);
        // Match the CSS cubic-bezier(0.22, 0.68, 0.35, 1) approximation
        const ease = 1 - Math.pow(1 - p, 2.6);
        wiperEdge.style.left = (startX + (endX - startX) * ease) + 'px';
        if (p < 1) {
          swipeRafId = requestAnimationFrame(moveEdge);
        } else {
          wiperEdge.classList.remove('is-moving');
          swipeRafId = null;
        }
      })(performance.now());
    }

    if (target === 'about') {
      // Swipe: landing slides left, about slides in from right
      pageLanding.classList.add('is-swiped');
      pageAbout.classList.add('is-visible');

      // Change logo to dark navy
      if (headerLogo) {
        const logoColor = '#1A2E44';
        headerLogo.querySelector('#workloop-logo').setAttribute('fill', logoColor);
        headerLogo.querySelectorAll('#loop-icon path').forEach(p => p.setAttribute('fill', logoColor));
        headerLogo.style.color = logoColor;
      }

      // Add light mode to header nav
      if (headerNav) {
        headerNav.classList.add('is-light');
      }

      // Manage pointer-events for scroll routing
      pageAbout.style.pointerEvents = 'auto';
      pageLanding.style.pointerEvents = 'none';

      // Trigger reveal animations after transition completes
      setTimeout(() => {
        observeReveals(pageAbout);
      }, SWIPE_DURATION);

      // Restore scroll position
      pageAbout.scrollTop = scrollMemory[target];
    } else if (target === 'landing') {
      // Swipe: about slides right, landing slides back in from left
      pageAbout.classList.remove('is-visible');
      pageLanding.classList.remove('is-swiped');

      // Set logo to white
      if (headerLogo) {
        const logoColor = '#ffffff';
        headerLogo.querySelector('#workloop-logo').setAttribute('fill', logoColor);
        headerLogo.querySelectorAll('#loop-icon path').forEach(p => p.setAttribute('fill', logoColor));
        headerLogo.style.color = logoColor;
      }

      // Remove light mode from header nav
      if (headerNav) {
        headerNav.classList.remove('is-light');
      }

      // Manage pointer-events for scroll routing
      pageLanding.style.pointerEvents = 'auto';
      pageAbout.style.pointerEvents = 'none';

      // Trigger reveal animations after transition completes
      setTimeout(() => {
        observeReveals(pageLanding);
      }, SWIPE_DURATION);

      // Restore scroll position
      pageLanding.scrollTop = scrollMemory[target];
    }

    currentPage = target;

    // Update browser history
    const newUrl = target === 'about' ? '/?page=about' : '/';
    if (window.location.search !== new URL(newUrl, window.location.origin).search) {
      history.pushState({ page: target }, '', newUrl);
    }

    // Announce page switch to screen readers
    const announcer = document.getElementById('srAnnounce');
    if (announcer) {
      announcer.textContent = target === 'about' ? 'Hvem er vi – side lastet' : 'Hva kan vi – side lastet';
    }

    // Notify canvas to pause/resume
    if (typeof window.setCanvasPaused === 'function') {
      window.setCanvasPaused(target === 'about');
    }
  }

  // Make switchPage available globally
  window.switchPage = switchPage;

  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    const target = (e.state && e.state.page) || 'landing';
    switchPage(target);
  });

  // Handle initial URL state (e.g. /?page=about)
  const params = new URLSearchParams(window.location.search);
  if (params.get('page') === 'about') {
    switchPage('about');
  }

  // Nav buttons use onclick handlers directly (pointer-events restored)

  /* ─── Scroll animations (IntersectionObserver) ──────────── */
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  if (animateElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animateElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    animateElements.forEach(el => el.classList.add('visible'));
  }

  /* ─── Hero logo fade-in ─────────────────────────────────── */
  var heroLogo = document.querySelector('.hero-logo-img');
  if (heroLogo) {
    setTimeout(function() { heroLogo.classList.add('visible'); }, 400);
  }

/* ─── Animated number counters ──────────────────────────── */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(easeOut(progress) * target);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ─── Smooth scroll for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Contact form Web3Forms ────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const submitBtn  = contactForm.querySelector('[type="submit"]');
    const formMsg    = document.getElementById('formMessage');

    // Check for success parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      formMsg.className = 'form-message success';
      formMsg.textContent = 'Takk for meldingen! Vi tar kontakt innen 1 virkedag.';
      formMsg.style.display = 'block';
      window.history.replaceState({}, '', window.location.pathname);
    }

    function generateICS(name, email, date, time) {
      var start = date.replace(/-/g, '') + 'T' + time.replace(':', '') + '00';
      var h = parseInt(time.split(':')[0]);
      var m = parseInt(time.split(':')[1]) + 30;
      if (m >= 60) { h++; m -= 60; }
      var end = date.replace(/-/g, '') + 'T' + String(h).padStart(2,'0') + String(m).padStart(2,'0') + '00';
      var now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
      return 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//WorkLoop//Booking//NO\r\nBEGIN:VEVENT\r\n' +
        'DTSTART;TZID=Europe/Oslo:' + start + '\r\nDTEND;TZID=Europe/Oslo:' + end + '\r\n' +
        'DTSTAMP:' + now + '\r\nSUMMARY:WorkLoop - Gratis samtale\r\n' +
        'DESCRIPTION:Gratis 30 min samtale med WorkLoop.\\nKontakt: ' + name + ' (' + email + ')\r\n' +
        'ORGANIZER;CN=WorkLoop:mailto:kontakt@workloop.no\r\nATTENDEE;CN=' + name + ':mailto:' + email + '\r\n' +
        'STATUS:TENTATIVE\r\nEND:VEVENT\r\nEND:VCALENDAR';
    }

    function downloadICS(content) {
      var blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'workloop-booking.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sender…';

      const wantBooking = document.getElementById('wantBooking');
      const isBooking = wantBooking && wantBooking.checked;
      const nameVal = contactForm.querySelector('#name').value;
      const emailVal = contactForm.querySelector('#email').value;
      const dateVal = contactForm.querySelector('#bookDate') ? contactForm.querySelector('#bookDate').value : '';
      const timeVal = contactForm.querySelector('#bookTime') ? contactForm.querySelector('#bookTime').value : '';

      try {
        const formData = new FormData(contactForm);

        if (isBooking && dateVal && timeVal) {
          formData.set('subject', 'Ny booking fra WorkLoop.no');
          const msg = formData.get('message') || '';
          formData.set('message', 'BOOKING - ' + dateVal + ' kl. ' + timeVal + '\n\n' + msg);
        }

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const json = await res.json();

        if (json.success) {
          formMsg.className = 'form-message success';

          if (isBooking && dateVal && timeVal) {
            formMsg.innerHTML = 'Takk, ' + nameVal + '! Vi bekrefter tidspunktet innen 1 virkedag.<br><br>' +
              '<a href="#" id="downloadIcs" style="color:#065f46;font-weight:600;">Last ned kalenderinvitasjon (.ics)</a>';
            setTimeout(() => {
              var dl = document.getElementById('downloadIcs');
              if (dl) dl.addEventListener('click', (ev) => {
                ev.preventDefault();
                downloadICS(generateICS(nameVal, emailVal, dateVal, timeVal));
              });
            }, 0);
          } else {
            formMsg.textContent = 'Takk! Vi tar kontakt innen 1 virkedag.';
          }

          contactForm.reset();
          var bookingFields = document.getElementById('bookingFields');
          if (bookingFields) bookingFields.style.display = 'none';
        } else {
          formMsg.className = 'form-message error';
          formMsg.textContent = json.message || 'Noe gikk galt. Prøv igjen.';
        }
      } catch {
        formMsg.className = 'form-message error';
        formMsg.textContent = 'Tilkoblingsfeil. Sjekk internett og prøv igjen.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send melding &rarr;';
        formMsg.style.display = 'block';
        formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* ─── FAQ accordion (CSS-only fallback for JS-enhanced) ─── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

})();
