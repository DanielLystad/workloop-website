/* WorkLoop AS — main.js */

(function () {
  'use strict';

  /* ─── Navbar scroll shadow ─────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── Active nav link ───────────────────────────────────── */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

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

  /* ─── Hero logo 3D perspective wobble ────────────────────── */
  var heroLogo = document.querySelector('.hero-logo-img');
  if (heroLogo) {
    // Entrance fade-in
    setTimeout(function() { heroLogo.classList.add('visible'); }, 400);

    // 3D wobble with requestAnimationFrame
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      var wobbleStart = performance.now();
      function heroWobble(now) {
        var t = (now - wobbleStart) / 1000;
        var rx = Math.sin(t * 0.15) * 3;
        var ry = Math.cos(t * 0.12) * 2.5;
        var tz = Math.sin(t * 0.08) * 2;
        heroLogo.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(' + tz + 'px) scale(1)';
        requestAnimationFrame(heroWobble);
      }
      // Start wobble after entrance completes
      setTimeout(function() { requestAnimationFrame(heroWobble); }, 1200);
    }
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
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

})();
