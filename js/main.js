/* MVI Appliance Services — mobile nav, scroll reveal, contact form */
(function () {
  'use strict';

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Scroll reveal ---- */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealSelector = '.section, .quote-bar-wrap, .service-card, .info-card, ' +
      '.before-card, .blog-card, .reviews-card, .tech-feature, .quick-section';
    var revealTargets = document.querySelectorAll(revealSelector);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el) {
      el.classList.add('reveal-init');
      io.observe(el);
    });

    /* Safety net: guarantee nothing stays hidden if a section is never
       scrolled through the viewport (e.g. jump-scroll, resize, or any
       IntersectionObserver edge case). */
    window.setTimeout(function () {
      revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
    }, 2500);
  }

  /* ---- Contact form: submit via fetch so Netlify doesn't redirect away ---- */
  var form = document.querySelector('form.site-form[data-netlify="true"]');

  if (form) {
    var statusEl = document.createElement('p');
    statusEl.className = 'form-status';
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', 'polite');
    form.appendChild(statusEl);

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var submitBtn = form.querySelector('button[type="submit"]');
      var formData = new FormData(form);

      if (submitBtn) submitBtn.disabled = true;
      statusEl.className = 'form-status';
      statusEl.textContent = 'Sending...';

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Bad response: ' + response.status);
          statusEl.className = 'form-status form-status-success';
          statusEl.textContent = "Thanks! We've got your request and will be in touch shortly.";
          form.reset();
        })
        .catch(function () {
          statusEl.className = 'form-status form-status-error';
          statusEl.textContent = 'Something went wrong sending that. Please call/text us at (559) 905-7810 or try again.';
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();
