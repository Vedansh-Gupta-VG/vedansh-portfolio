// ============================================================
// EDUCATION TIMELINE
// Same behaviour as the Experience timeline:
// - The dashed line fills as the section scrolls into view.
// - Each card fades in the first time it enters the viewport.
// - The node next to whichever card is centred in the viewport
//   gets an "active" glow.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.querySelector('.edu-timeline');
  const track = document.querySelector('.edu-timeline__track');
  const fill = document.getElementById('eduTimelineFill');
  const cards = document.querySelectorAll('.edu-card');
  const nodes = document.querySelectorAll('.edu-timeline__node');
  if (!timeline) return;

  let trackTop = 22;
  let trackHeight = 0;

  function measureTrack() {
    if (!track || nodes.length < 2) return;
    // All positions below are measured relative to the timeline
    // container's top edge (not the page/viewport), so the dashed line
    // and its fill can be positioned with simple top/height CSS values
    // that don't need to account for scroll position.
    const timelineRect = timeline.getBoundingClientRect();
    const firstRect = nodes[0].getBoundingClientRect();
    const lastNodeRect = nodes[nodes.length - 1].getBoundingClientRect();
    const firstCenter = (firstRect.top + firstRect.height / 2) - timelineRect.top;
    const lastNodeCenter = (lastNodeRect.top + lastNodeRect.height / 2) - timelineRect.top;

    // Run the line past the last node down to the bottom of the last
    // card (the school entry), so it reads as reaching the end of the
    // whole journey instead of stopping at the node's center.
    let lastEdge = lastNodeCenter;
    if (cards.length) {
      const lastCardRect = cards[cards.length - 1].getBoundingClientRect();
      const lastCardBottom = (lastCardRect.bottom - timelineRect.top);
      lastEdge = Math.max(lastNodeCenter, lastCardBottom - 6);
    }

    trackTop = firstCenter;
    trackHeight = Math.max(0, lastEdge - firstCenter);
    track.style.top = trackTop + 'px';
    track.style.height = trackHeight + 'px';
    if (fill) fill.style.top = trackTop + 'px';
  }

  function updateFill() {
    if (!fill) return;
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height || 1;
    // Progress reaches 1 (fully filled) once the timeline's bottom edge
    // has scrolled up to 85% of the viewport height — i.e. the line
    // finishes filling a bit before the section is fully scrolled past,
    // rather than exactly at the very last pixel.
    let progress = (vh * 0.85 - rect.top) / total;
    progress = Math.max(0, Math.min(1, progress));
    fill.style.height = (progress * trackHeight) + 'px';
  }

  function refresh() { measureTrack(); updateFill(); }

  window.addEventListener('scroll', updateFill, { passive: true });
  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  // refresh() is called from many different triggers below because the
  // timeline's node/card positions can shift for several unrelated
  // reasons after the page first paints: web fonts finishing loading
  // (changes text width → card height), images finishing loading,
  // layout settling after CSS transitions, etc. Each trigger below
  // catches a different one of those cases; the fixed-delay setTimeouts
  // are a pragmatic catch-all for whatever the more specific listeners
  // above might still miss.
  refresh();
  requestAnimationFrame(refresh);
  setTimeout(refresh, 400);
  setTimeout(refresh, 1200);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh);
  }

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => refresh());
    ro.observe(timeline);
    cards.forEach(card => ro.observe(card));
  }

  // Fades in each card the first time it scrolls into view, then stops
  // watching it (unobserve) so it doesn't re-trigger on scroll back up.
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-inview');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  cards.forEach(card => revealObserver.observe(card));

  // Lights up the timeline node next to whichever card currently sits in
  // the middle 20% of the viewport (rootMargin shrinks the observed area
  // by 40% top and bottom), rather than whichever card is merely visible
  // at all — keeps only one node "active" at a time as you scroll.
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const nodeId = entry.target.dataset.eduTarget;
      const node = nodeId && document.getElementById(nodeId);
      if (!node) return;
      node.classList.toggle('is-active', entry.isIntersecting);
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
  cards.forEach(card => activeObserver.observe(card));
});
