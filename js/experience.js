// ============================================================
// EXPERIENCE TIMELINE
// - The dashed line fills as the section scrolls into view.
// - Each card fades in (bullets staggered) the first time it
//   enters the viewport.
// - The node next to whichever card is centred in the viewport
//   gets an "active" glow.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.querySelector('.exp-timeline');
  const fill = document.getElementById('expTimelineFill');
  const cards = document.querySelectorAll('.exp-card');

  // --- Scroll-linked fill: how far through the timeline the user has scrolled ---
  function updateFill() {
    if (!timeline || !fill) return;
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height || 1;
    let progress = (vh * 0.85 - rect.top) / total;
    progress = Math.max(0, Math.min(1, progress));
    fill.style.height = (progress * 100) + '%';
  }
  window.addEventListener('scroll', updateFill, { passive: true });
  window.addEventListener('resize', updateFill);
  updateFill();

  // --- Reveal each card once, staggering its bullet points ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-inview');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  cards.forEach(card => revealObserver.observe(card));

  // --- Glow the node whose card currently owns the middle of the viewport ---
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const nodeId = entry.target.dataset.expTarget;
      const node = nodeId && document.getElementById(nodeId);
      if (!node) return;
      node.classList.toggle('is-active', entry.isIntersecting);
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
  cards.forEach(card => activeObserver.observe(card));
});
