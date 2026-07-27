/**
 * animations.js
 * Handles: scroll-reveal (Intersection Observer), animated stat counters,
 * timeline progress fill, and the ambient hero canvas "signal trace" effect.
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------
     1. Scroll reveal — fade/slide elements into view
  --------------------------------------------------- */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal-up');
    if (!revealEls.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // Stagger siblings within the same parent slightly for a natural cascade.
    const groups = new Map();
    revealEls.forEach((el) => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });
    groups.forEach((els) => {
      els.forEach((el, i) => {
        if (!el.style.getPropertyValue('--delay')) {
          el.style.setProperty('--delay', Math.min(i, 6));
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------
     2. Animated stat counters (About section)
  --------------------------------------------------- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = target;
        el.classList.add('is-counting');
      }
    }
    requestAnimationFrame(frame);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.stat-card__value');
    if (!counters.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      counters.forEach((el) => (el.textContent = el.dataset.count));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------
     3. Timeline vertical progress fill, tied to scroll
  --------------------------------------------------- */
  function initTimelineFill() {
    const timeline = document.querySelector('.timeline');
    const fill = document.querySelector('.timeline__line-fill');
    if (!timeline || !fill) return;

    function update() {
      const rect = timeline.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height;
      const visible = Math.min(Math.max(viewportH * 0.75 - rect.top, 0), total);
      const pct = total > 0 ? (visible / total) * 100 : 0;
      fill.style.height = pct + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------------------------------------------
     4. Ambient hero canvas — drifting "signal node" particles
        connected by faint traces, evoking a live PCB net.
  --------------------------------------------------- */
  function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let width, height, nodes;
    const NODE_COUNT_DIVISOR = 22000; // fewer nodes on smaller screens

    function resize() {
      width = canvas.width = canvas.offsetWidth * devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * devicePixelRatio;
      const count = Math.max(18, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / NODE_COUNT_DIVISOR));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
      }));
    }

    const MAX_DIST = 150 * devicePixelRatio;

    function frame() {
      ctx.clearRect(0, 0, width, height);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.strokeStyle = `rgba(59, 125, 255, ${0.12 * (1 - dist / MAX_DIST)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        ctx.fillStyle = 'rgba(34, 211, 238, 0.5)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(frame);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCounters();
    initTimelineFill();
    initHeroCanvas();
  });
})();