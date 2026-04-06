/* WorkLoop AS — main.js */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     SECTION 1: PAGE SWITCHING (WIPER TRANSITION)
     ───────────────────────────────────────────────────────────── */

  let currentPage = 'landing';
  const pageAbout = document.getElementById('pageAbout');
  const pageLanding = document.getElementById('pageLanding');
  const wiperEdge = document.getElementById('wiperEdge');
  const navBtns = document.querySelectorAll('.nav-btn');
  const scrollMemory = { landing: 0, about: 0 };
  const headerLogo = document.getElementById('headerLogo');
  const headerNav = document.getElementById('headerNav');

  function switchPage(target) {
    if (currentPage === target || !pageAbout || !pageLanding) return;

    // Save outgoing page scroll position
    const outgoingEl = currentPage === 'about' ? pageAbout : pageLanding;
    scrollMemory[currentPage] = outgoingEl.scrollTop;

    // Update nav button active states
    navBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === target);
    });

    // Show/hide wiper edge glow
    if (wiperEdge) {
      wiperEdge.classList.add('is-moving');
    }

    if (target === 'about') {
      // Add visible class to aboutPage
      pageAbout.classList.add('is-visible');
      pageLanding.classList.remove('is-visible');

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

      // Trigger reveal animations after 400ms delay
      setTimeout(() => {
        observeReveals(pageAbout);
      }, 400);

      // Restore scroll position
      pageAbout.scrollTop = scrollMemory[target];
    } else if (target === 'landing') {
      // Remove classes
      pageAbout.classList.remove('is-visible');
      pageLanding.classList.add('is-visible');

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

      // Trigger reveal animations after 400ms delay
      setTimeout(() => {
        observeReveals(pageLanding);
      }, 400);

      // Restore scroll position
      pageLanding.scrollTop = scrollMemory[target];
    }

    currentPage = target;

    // Clean up wiper edge after 1200ms
    if (wiperEdge) {
      setTimeout(() => {
        wiperEdge.classList.remove('is-moving');
      }, 1200);
    }
  }

  // Make switchPage available globally
  window.switchPage = switchPage;

  // Coordinate-based click detection for nav buttons
  document.addEventListener('click', (e) => {
    navBtns.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const target = btn.dataset.page;
        if (target) {
          switchPage(target);
        }
      }
    });
  });

  // Show pointer cursor when hovering over nav buttons
  document.addEventListener('mousemove', (e) => {
    let isOverBtn = false;
    navBtns.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        isOverBtn = true;
      }
    });
    document.documentElement.style.cursor = isOverBtn ? 'pointer' : 'auto';
  });

  // Wiper edge tracking
  function trackWiperEdge() {
    if (!wiperEdge || !pageAbout) return;

    const clipPathValue = window.getComputedStyle(pageAbout).clipPath;
    if (clipPathValue && clipPathValue !== 'none') {
      // Parse clip-path to find the rightmost point
      const match = clipPathValue.match(/\d+(\.\d+)?%/g);
      if (match && match.length > 0) {
        const rightmost = Math.max(...match.map(val => parseFloat(val)));
        const xPos = (rightmost / 100) * window.innerWidth;
        wiperEdge.style.left = xPos + 'px';
      }
    }

    requestAnimationFrame(trackWiperEdge);
  }

  if (wiperEdge && pageAbout) {
    trackWiperEdge();
  }

  /* ─────────────────────────────────────────────────────────────
     SECTION 2: SCROLL REVEAL OBSERVER
     ───────────────────────────────────────────────────────────── */

  function observeReveals(root) {
    const els = root ? root.querySelectorAll('.reveal') : document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
        }
      });
    }, { root: root || null, threshold: 0.15 });

    els.forEach(el => {
      el.classList.remove('is-visible');
      obs.observe(el);
    });
  }

  // Initial call for landing page
  if (pageLanding) {
    observeReveals(pageLanding);
  }

  /* ─────────────────────────────────────────────────────────────
     SECTION 3: ANIMATE ON SCROLL
     ───────────────────────────────────────────────────────────── */

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

  /* ─────────────────────────────────────────────────────────────
     SECTION 4: HERO LOGO FADE-IN
     ───────────────────────────────────────────────────────────── */

  var heroLogo = document.querySelector('.hero-logo-img');
  if (heroLogo) {
    setTimeout(function() { heroLogo.classList.add('visible'); }, 400);
  }

  /* ─────────────────────────────────────────────────────────────
     SECTION 5: ANIMATED NUMBER COUNTERS
     ───────────────────────────────────────────────────────────── */

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

  /* ─────────────────────────────────────────────────────────────
     SECTION 6: SMOOTH SCROLL FOR ANCHOR LINKS
     ───────────────────────────────────────────────────────────── */

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

  /* ─────────────────────────────────────────────────────────────
     SECTION 7: CONTACT FORM (WEB3FORMS)
     ───────────────────────────────────────────────────────────── */

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const submitBtn  = contactForm.querySelector('[type="submit"]');
    const formMsg    = document.getElementById('formMessage');

    // Check for success parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true' && formMsg) {
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
        'ORGANIZER;CN=WorkLoop:mailto:post@workloop.no\r\nATTENDEE;CN=' + name + ':mailto:' + email + '\r\n' +
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
      const nameVal = contactForm.querySelector('#name') ? contactForm.querySelector('#name').value : '';
      const emailVal = contactForm.querySelector('#email') ? contactForm.querySelector('#email').value : '';
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

  /* ─────────────────────────────────────────────────────────────
     SECTION 8: FAQ ACCORDION
     ───────────────────────────────────────────────────────────── */

  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = this.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(function(el) {
        el.classList.remove('open');
      });
      // Toggle current
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ─────────────────────────────────────────────────────────────
     SECTION 9: BACK TO TOP + MOBILE STICKY CTA
     ───────────────────────────────────────────────────────────── */

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const mobileStickyCtA = document.getElementById('mobileStickyCtA');
  if (mobileStickyCtA) {
    window.addEventListener('scroll', () => {
      mobileStickyCtA.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────────────────
     SECTION 10: NAVBAR SCROLL SHADOW
     ───────────────────────────────────────────────────────────── */

  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─────────────────────────────────────────────────────────────
     COPY EMAIL TO CLIPBOARD
     ───────────────────────────────────────────────────────────── */

  window.copyEmail = function (e) {
    if (e) e.preventDefault();
    var email = 'kontakt@workloop.no';
    navigator.clipboard.writeText(email).then(function () {
      showCopyToast(email);
    }).catch(function () {
      /* Fallback for older browsers */
      var ta = document.createElement('textarea');
      ta.value = email;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showCopyToast(email);
    });
  };

  function showCopyToast(email) {
    var existing = document.getElementById('copyToast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'copyToast';
    toast.textContent = email + ' kopiert!';
    toast.style.cssText =
      'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(20px);' +
      'background:rgba(61,155,225,0.95);color:#fff;padding:0.75rem 1.5rem;border-radius:10px;' +
      'font-family:inherit;font-size:0.9rem;font-weight:600;z-index:9999;' +
      'opacity:0;transition:opacity 0.3s ease,transform 0.3s ease;pointer-events:none;' +
      'backdrop-filter:blur(12px);box-shadow:0 8px 32px rgba(0,0,0,0.25);';
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(function () { toast.remove(); }, 300);
    }, 2000);
  }

  /* ─────────────────────────────────────────────────────────────
     ADDITIONAL: ACTIVE NAV LINK
     ───────────────────────────────────────────────────────────── */

  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

})();
