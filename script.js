// =========================================================
// JO PARIS 2024 — Skeleton interactions
// 1) Toggle mobile nav
// 2) Scrollspy: highlight active nav link
// 3) Reveal-on-scroll for .reveal elements
// 4) Header scroll-progress rail
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = Array.from(document.querySelectorAll('.project-section'));
  const progressFill = document.getElementById('progress-fill');

  // --- 1) Mobile nav toggle ---
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    // Close mobile nav after choosing a link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 2) Scrollspy via IntersectionObserver ---
  if (sections.length && navLinks.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle('is-active', link.dataset.section === id);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  // --- 3) Reveal-on-scroll ---
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // --- 4) Header scroll progress + subtle shadow on scroll ---
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';
    if (header) header.style.boxShadow = scrollTop > 8 ? '0 8px 24px rgba(0,0,0,.25)' : 'none';
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
});
