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

  /* ─── Mobile hamburger ──────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    const lockScroll = () => {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    };

    const unlockScroll = () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };

    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', open);
      if (open) {
        lockScroll();
      } else {
        unlockScroll();
      }
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        unlockScroll();
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        unlockScroll();
      }
    });
  }

  /* ─── Active nav link ───────────────────────────────────── */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  // Exclude buttons from active state management
  document.querySelectorAll('.nav-links a:not(.btn)').forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '') || '/';
    const shouldBeActive = href === currentPath || (currentPath === '/' && href === '/');
    const isActive = link.classList.contains('active');

    // Only modify DOM when state needs to change
    if (shouldBeActive && !isActive) {
      link.classList.add('active');
    } else if (!shouldBeActive && isActive) {
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
        const offset = 80; // navbar height
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

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sender…';

      try {
        const formData = new FormData(contactForm);
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const json = await res.json();

        if (json.success) {
          formMsg.className = 'form-message success';
          formMsg.textContent = 'Takk! Vi tar kontakt innen 1 virkedag.';
          contactForm.reset();
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
