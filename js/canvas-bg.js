(function() {
  'use strict';

  /* ─── Performance & Accessibility Checks ───────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    const canvas = document.getElementById('loops');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

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

  const ctx = canvas.getContext('2d');

  let W, H, dpr;
  let mouse      = { x: 0.5, y: 0.5 };
  let smoothMouse = { x: 0.5, y: 0.5 };
  let time = 0;

  const PALETTE = [
    [48,  136, 203],
    [56,  148, 217],
    [66,  163, 234],
    [61,  155, 225],
    [26,  46,  68 ],
  ];

  function lemniscate(t) {
    const s = Math.sin(t);
    const c = Math.cos(t);
    const d = 1 + s * s;
    return { x: c / d, y: (s * c) / d };
  }

  const LOOP_COUNT = 7;
  let loops = [];

  function initLoops() {
    loops = [];
    for (let i = 0; i < LOOP_COUNT; i++) {
      const t = i / LOOP_COUNT;
      const depth = 0.3 + t * 0.7;
      const baseScale = Math.min(W, H);
      loops.push({
        cx: 0.15 + t * 0.7 + Math.sin(i * 2.7) * 0.15,
        cy: 0.2 + Math.cos(i * 1.9) * 0.3,
        scaleX: baseScale * (0.25 + depth * 0.55),
        scaleY: baseScale * (0.15 + depth * 0.35),
        color: PALETTE[i % PALETTE.length],
        opacity: 0.03 + depth * 0.06,
        lineWidth: 1 + depth * 2.5,
        glowRadius: 8 + depth * 20,
        rotSpeed: (0.008 + t * 0.006) * (i % 2 === 0 ? 1 : -1),
        driftX: Math.sin(i * 3.1) * 0.003,
        driftY: Math.cos(i * 2.3) * 0.002,
        phaseOffset: i * 0.9,
        parallax: depth * 0.6,
      });
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initLoops();
  }

  function drawLoop(loop, t) {
    const rot = t * loop.rotSpeed + loop.phaseOffset;
    const drift = t * 0.02;
    const px = (smoothMouse.x - 0.5) * loop.parallax * W * 0.12;
    const py = (smoothMouse.y - 0.5) * loop.parallax * H * 0.12;
    const cx = loop.cx * W + Math.sin(drift + loop.driftX * 500) * W * 0.03 + px;
    const cy = loop.cy * H + Math.cos(drift + loop.driftY * 500) * H * 0.02 + py;
    const breathe = 1 + Math.sin(t * 0.15 + loop.phaseOffset) * 0.04;
    const sx = loop.scaleX * breathe;
    const sy = loop.scaleY * breathe;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    ctx.beginPath();
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const pt = lemniscate(a);
      if (i === 0) ctx.moveTo(pt.x * sx, pt.y * sy);
      else ctx.lineTo(pt.x * sx, pt.y * sy);
    }
    ctx.closePath();

    const [r, g, b] = loop.color;
    ctx.shadowColor = `rgba(${r},${g},${b},${loop.opacity * 1.5})`;
    ctx.shadowBlur = loop.glowRadius;
    ctx.strokeStyle = `rgba(${r},${g},${b},${loop.opacity})`;
    ctx.lineWidth = loop.lineWidth;
    ctx.stroke();
    ctx.fillStyle = `rgba(${r},${g},${b},${loop.opacity * 0.15})`;
    ctx.fill();
    ctx.restore();
  }

  function frame(ts) {
    if (document.hidden) { requestAnimationFrame(frame); return; }
    time = ts * 0.001;
    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.03;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.03;

    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(0, 0, W, H);

    const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
    bg.addColorStop(0, 'rgba(26,46,68,0.4)');
    bg.addColorStop(1, 'rgba(13,27,42,0)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* Mouse glow */
    const gr = ctx.createRadialGradient(smoothMouse.x * W, smoothMouse.y * H, 0, smoothMouse.x * W, smoothMouse.y * H, Math.max(W, H) * 0.5);
    gr.addColorStop(0, 'rgba(61,155,225,0.06)');
    gr.addColorStop(0.3, 'rgba(56,148,217,0.025)');
    gr.addColorStop(1, 'rgba(26,46,68,0)');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < loops.length; i++) drawLoop(loops[i], time);

    /* Vignette */
    const vg = ctx.createRadialGradient(W / 2, H / 2, Math.max(W, H) * 0.22, W / 2, H / 2, Math.max(W, H) * 0.75);
    vg.addColorStop(0, 'rgba(13,27,42,0)');
    vg.addColorStop(1, 'rgba(13,27,42,0.5)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(frame);
  }

  /* ─── Events ──────────────────────────────────────────── */
  window.addEventListener('resize', resize, { passive: true });

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX / window.innerWidth;
      mouse.y = e.touches[0].clientY / window.innerHeight;
    }
  }, { passive: true });

  /* ─── Initialize & Start ──────────────────────────────── */
  resize();
  requestAnimationFrame(frame);

})();