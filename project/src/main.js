/**
 * main.js
 * Core interactivity: sticky header state, mobile nav toggle,
 * signature circuit-trace scroll rail, back-to-top button,
 * and a lightweight client-side contact form handler.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------
     Header: add background once the page has scrolled
  --------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------- */
  // function initNavToggle() {
  //   const toggle = document.getElementById('navToggle');
  //   const menu = document.getElementById('navMenu');
  //   if (!toggle || !menu) return;

  //   function closeMenu() {
  //     menu.classList.remove('is-open');
  //     toggle.setAttribute('aria-expanded', 'false');
  //   }

  //   toggle.addEventListener('click', () => {
  //     const isOpen = menu.classList.toggle('is-open');
  //     toggle.setAttribute('aria-expanded', String(isOpen));
  //   });

  //   // Close menu after a link is chosen (mobile UX)
  //   menu.querySelectorAll('.nav__link').forEach((link) => {
  //     link.addEventListener('click', closeMenu);
  //   });

    // Close on Escape
  //   document.addEventListener('keydown', (e) => {
  //     if (e.key === 'Escape') closeMenu();
  //   });
  // }

  /* ---------------------------------------------------
     Signature circuit-trace scroll rail: dash-offset maps
     directly to how far the visitor has scrolled through
     the page, like current advancing along a bus.
  --------------------------------------------------- */
  function initTraceRail() {
    const fill = document.querySelector('.trace-rail__fill');
    if (!fill) return;

    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      // Path length is normalized to 100 in the viewBox (see index.html)
      const offset = 100 - progress * 100;
      fill.style.strokeDashoffset = String(offset);
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------------------------------------------
     Smooth scroll for in-page nav links (native CSS
     scroll-behavior already covers most browsers; this is
     a safe fallback + accounts for the fixed header offset)
  --------------------------------------------------- */
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const header = document.getElementById('siteHeader');

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ---------------------------------------------------
     Back-to-top button
  --------------------------------------------------- */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------
     Contact form: client-side only demo handler.
     Replace with a real endpoint / mailto service as needed.
  --------------------------------------------------- */
  // function initContactForm() {
  //   const form = document.getElementById('contactForm');
  //   const status = document.getElementById('formStatus');
  //   if (!form || !status) return;

  //   form.addEventListener('submit', (e) => {
  //     e.preventDefault();

  //     const name = form.name.value.trim();
  //     const email = form.email.value.trim();
  //     const message = form.message.value.trim();

  //     if (!name || !email || !message) {
  //       status.textContent = 'Please fill in every field before sending.';
  //       status.style.color = 'var(--accent-copper)';
  //       return;
  //     }

  //     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     if (!emailPattern.test(email)) {
  //       status.textContent = 'That email address looks off — mind checking it?';
  //       status.style.color = 'var(--accent-copper)';
  //       return;
  //     }

  //     // No backend wired up yet: acknowledge locally and reset the form.
  //     status.textContent = `Thanks, ${name}! Your message is queued — I reply within 24–48 hours.`;
  //     status.style.color = 'var(--accent-cyan)';
  //     form.reset();
  //   });
  // }

  async function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (!form || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.textContent = "Sending message...";
    status.style.color = "var(--accent-cyan)";

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        status.textContent = "✅ Message sent successfully! I'll get back to you soon.";
        status.style.color = "var(--accent-cyan)";
        form.reset();
      } else {
        status.textContent = "❌ Failed to send message. Please try again.";
        status.style.color = "var(--accent-copper)";
      }

    } catch (error) {
      status.textContent = "❌ Something went wrong. Please try again later.";
      status.style.color = "var(--accent-copper)";
    }
  });
}
  
  /* ---------------------------------------------------
     Footer year
  --------------------------------------------------- */
  function initFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    // initNavToggle();
    initTraceRail();
    initSmoothScroll();
    initBackToTop();
    initContactForm();
    initFooterYear();
  });}
)();