(function() {
  'use strict';

  /* ─── Performance & Accessibility Checks ───────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobileOrLowPower = navigator.hardwareConcurrency < 4 || window.innerWidth < 768;

  if (prefersReducedMotion) {
    // Static background for reduced motion preference
    const canvas = document.getElementById('loops');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(0, window.innerWidth, window.innerWidth, window.innerHeight);

    const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
    gradient.addColorStop(0, 'rgba(61, 155, 225, 0.05)');
    gradient.addColorStop(1, 'rgba(61, 155, 225, 0.02)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    return;
  }

  /* ─── Canvas Setup ─────────────────────────────────────── */
  const canvas = document.getElementById('loops');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let W = window.innerWidth;
  let H = window.innerHeight;
  let dpr = window.devicePixelRatio || 1;

  /* ─── Mouse Tracking & Animation State ───────────────── */
  let mouse = { x: W / 2, y: H / 2 };
  let smoothMouse = { x: W / 2, y: H / 2 };
  let time = 0;

  /* ─── Color Palette ────────────────────────────────────── */
  const PALETTE = [
    [48, 136, 203],   // shadow
    [56, 148, 217],   // midtone
    [66, 163, 234],   // highlight
    [61, 155, 225],   // blue-600
    [26, 46, 68],     // blue-900
  ];

  /* ─── Animation Configuration ──────────────────────────── */
  let LOOP_COUNT = isMobileOrLowPower ? 4 : 7;
  let loops = [];

  /* ─── Lemniscate (Infinity Loop) Shape ───────────────── */
  function lemniscate(t) {
    const a = 1;
    const r = a * Math.sqrt(Math.cos(2 * t));
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    return { x, y };
  }

  /* ─── Initialize Loops ─────────────────────────────────– */
  function initLoops() {
    loops = [];
    for (let i = 0; i < LOOP_COUNT; i++) {
      const color = PALETTE[i % PALETTE.length];
      loops.push({
        cx: W / 2,
        cy: H / 2,
        scaleX: 40 + i * 12,
        scaleY: 30 + i * 10,
        color: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
        opacity: 0.15 + (i * 0.08),
        lineWidth: 1.5 + (i * 0.3),
        glowRadius: 8 + i * 2,
        rotSpeed: 0.0003 + (Math.random() - 0.5) * 0.0001,
        driftX: (Math.random() - 0.5) * 40,
        driftY: (Math.random() - 0.5) * 30,
        phaseOffset: Math.random() * Math.PI * 2,
        parallax: 0.3 + (i * 0.08),
      });
    }
  }

  /* ─── Handle Window Resize ─────────────────────────────– */
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = window.devicePixelRatio || 1;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    initLoops();
  }

  /* ─── Draw Single Loop ─────────────────────────────────– */
  function drawLoop(loop, t) {
    const phase = t * loop.rotSpeed + loop.phaseOffset;
    const breathing = 1 + Math.sin(t * 0.0005) * 0.15;
    const driftInfluence = (smoothMouse.x - W / 2) * loop.parallax * 0.02;

    ctx.save();
    ctx.globalAlpha = loop.opacity * (0.6 + Math.sin(t * 0.0004) * 0.4);

    ctx.translate(loop.cx + driftInfluence + loop.driftX, loop.cy + loop.driftY);
    ctx.rotate(phase);

    ctx.strokeStyle = loop.color;
    ctx.lineWidth = loop.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (!isMobileOrLowPower) {
      ctx.shadowColor = loop.color;
      ctx.shadowBlur = loop.glowRadius;
    }

    ctx.beginPath();
    let firstPoint = true;
    for (let i = 0; i <= Math.PI * 2; i += 0.1) {
      const point = lemniscate(i);
      const x = point.x * loop.scaleX * breathing;
      const y = point.y * loop.scaleY * breathing;

      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    ctx.restore();
  }

  /* ─── Main Animation Loop ──────────────────────────────– */
  function frame(ts) {
    time = ts || time + 16;

    /* Smooth mouse interpolation */
    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.03;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.03;

    /* Dark background */
    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(0, 0, W, H);

    /* Subtle gradient overlay */
    const gradientBg = ctx.createLinearGradient(0, 0, 0, H);
    gradientBg.addColorStop(0, 'rgba(61, 155, 225, 0.08)');
    gradientBg.addColorStop(0.5, 'rgba(61, 155, 225, 0.02)');
    gradientBg.addColorStop(1, 'rgba(26, 46, 68, 0.06)');
    ctx.fillStyle = gradientBg;
    ctx.fillRect(0, 0, W, H);

    /* Mouse glow (skip on low-power devices) */
    if (!isMobileOrLowPower) {
      const glowGradient = ctx.createRadialGradient(smoothMouse.x, smoothMouse.y, 0, smoothMouse.x, smoothMouse.y, 200);
      glowGradient.addColorStop(0, 'rgba(61, 155, 225, 0.08)');
      glowGradient.addColorStop(1, 'rgba(61, 155, 225, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(smoothMouse.x - 200, smoothMouse.y - 200, 400, 400);
    }

    /* Draw all loops */
    loops.forEach((loop) => {
      drawLoop(loop, time);
    });

    /* Vignette effect */
    const vignetteGradient = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.8);
    vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
    ctx.fillStyle = vignetteGradient;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(frame);
  }

  /* ─── Event Listeners ──────────────────────────────────– */
  window.addEventListener('resize', resize, { passive: true });

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  /* ─── Initialize & Start Animation ────────────────────– */
  resize();
  requestAnimationFrame(frame);

})();
