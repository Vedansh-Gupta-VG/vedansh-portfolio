// ============================================================
// FOOTER / END SECTION
// - "Return to Orbit" link smooth-scrolls back to the top of the page
// - Elements marked [data-mc-animate] (the mission-complete footer
//   content) fade/slide into view once when they first scroll into
//   the viewport, then stop being observed (no re-triggering on
//   scroll back up/down).
// ============================================================
(() => {
  /* ── Return to Orbit: smooth scroll ── */
  const returnBtn = document.getElementById('returnToOrbit');
  if (returnBtn) {
    returnBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Scroll-triggered entrance animations ── */
  const animTargets = document.querySelectorAll('[data-mc-animate]');
  if (!animTargets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mc-visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animTargets.forEach((el) => observer.observe(el));
})();
