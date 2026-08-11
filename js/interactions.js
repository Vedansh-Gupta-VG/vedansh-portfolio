// ============================================================
// INTERACTIONS: fires a shooting star from a random point on
// screen whenever a button/interactive element is clicked.
// Relies on window.spawnShootingStarAt(x, y) from atmosphere.js.
// ============================================================

document.addEventListener('error', (e) => {
  if (e.target.closest && e.target.closest('.skill-badge')) {
    e.target.style.display = 'none'; // hide a broken logo instead of showing the browser's broken-image icon
  }
}, true);

document.addEventListener('click', (e) => {
  const trigger = e.target.closest(
    '.btn, .rail-icon, .social-rail__icons a, .logo-home, [data-modal-open], [data-modal-close], [data-cert-open], .navbar__toggle, #navToggle, .navbar__links a, .nav-links a, .about__cta, .achv-row__btn, .patent-card__appnum, .patent-card__link'
  );
  if (!trigger) return;
  if (typeof window.spawnShootingStarAt !== 'function') return;

  // The starfield canvas is a fixed viewport-sized backdrop (see
  // js/atmosphere.js), so coordinates here are plain viewport
  // coordinates — not document/scroll coordinates — and this is
  // genuinely random across the whole visible screen, unrelated to
  // whatever was actually clicked.
  const randomX = Math.random() * window.innerWidth;
  const randomY = Math.random() * window.innerHeight;
  window.spawnShootingStarAt(randomX, randomY);
});
