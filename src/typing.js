/**
 * typing.js
 * Small dependency-free typewriter effect for the hero role line.
 * Cycles through a list of roles, typing and deleting each one.
 */
(function () {
  'use strict';

  const ROLES = [
    'Electrical Engineering Student',
    'Embedded Systems Enthusiast',
    'PCB Design Learner',
    'Arduino & ESP32 Developer',
  ];

  const TYPE_SPEED = 55;      // ms per character while typing
  const DELETE_SPEED = 32;    // ms per character while deleting
  const HOLD_TIME = 1600;     // ms to pause once a role is fully typed
  const GAP_TIME = 400;       // ms to pause once a role is fully deleted

  function initTyping() {
    const target = document.getElementById('typingTarget');
    if (!target) return;

    // If the user prefers reduced motion, just show the first role statically.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      target.textContent = ROLES[0];
      return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
      const currentRole = ROLES[roleIndex];

      if (!isDeleting) {
        charIndex++;
        target.textContent = currentRole.slice(0, charIndex);

        if (charIndex === currentRole.length) {
          isDeleting = true;
          setTimeout(tick, HOLD_TIME);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        target.textContent = currentRole.slice(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % ROLES.length;
          setTimeout(tick, GAP_TIME);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    tick();
  }

  document.addEventListener('DOMContentLoaded', initTyping);
})();