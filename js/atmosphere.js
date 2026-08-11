// ============================================================
// ATMOSPHERE: starfield canvas
// Lightweight ambient twinkle + occasional shooting star.
// Purely decorative, capped frame work so it stays cheap.
// ============================================================

(function () {
  const canvas = document.getElementById('starfieldCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, stars, shootingStars = [];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    // The starfield's parent (.atmosphere) is position:fixed — it's a
    // backdrop pinned to the viewport, not something that scrolls with
    // the page. The canvas needs to match that: sizing it to the full
    // page's scrollHeight while it's displayed at only the viewport's
    // height was squashing everything drawn (stars, and especially
    // click-triggered shooting stars) down into a thin band near the
    // top of the screen. Sizing it to the viewport keeps what's drawn
    // matching what's actually shown, and is also lighter to redraw.
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    generateStars();
  }

  function generateStars() {
    // Star count scales with viewport area. Small mobile screens are
    // additionally capped lower since backdrop redraws are relatively
    // more expensive on those devices.
    const rawCount = Math.floor((width * height) / 5000);
    const MAX_STARS = width <= 768 ? 220 : 450;
    const count = Math.min(rawCount, MAX_STARS);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.4,
      baseAlpha: Math.random() * 0.6 + 0.35,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function maybeSpawnShootingStar() {
    if (Math.random() < 0.004 && shootingStars.length < 2) {
      const startX = Math.random() * width * 0.6;
      const startY = Math.random() * height * 0.3;
      shootingStars.push({
        x: startX, y: startY,
        len: 90 + Math.random() * 60,
        speed: 9 + Math.random() * 5,
        angle: Math.PI / 5,
        life: 1
      });
    }
  }

  // Manually trigger a shooting star from a specific point (used by
  // click-triggered stars — see js/interactions.js, which picks a random
  // x/y anywhere on screen before calling this, so the star doesn't
  // visually tie itself to whatever was clicked). These are drawn
  // noticeably brighter/thicker/longer than the ambient ones so a click
  // clearly produces something, instead of blending into the background.
  function spawnShootingStarAt(x, y) {
    shootingStars.push({
      x, y,
      len: 130 + Math.random() * 90,
      speed: 12 + Math.random() * 6,
      angle: Math.random() * Math.PI * 2,
      life: 1,
      bright: true
    });
  }
  window.spawnShootingStarAt = spawnShootingStarAt;

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // twinkling stars
    for (const s of stars) {
      // With reduced motion, skip the phase/twinkle math and just draw
      // stars at a fixed brightness — visually present, but no per-frame
      // animation work for visitors who've asked their OS to minimize it.
      const alpha = prefersReducedMotion
        ? s.baseAlpha
        : (s.phase += s.twinkleSpeed, s.baseAlpha + Math.sin(s.phase) * 0.25);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, alpha)})`;
      ctx.fill();
    }

    // shooting stars: skip entirely under reduced motion, they're the
    // most visually "busy" part of this animation
    if (!prefersReducedMotion) {
      maybeSpawnShootingStar();
      shootingStars.forEach((sh) => {
        const dx = Math.cos(sh.angle) * sh.speed;
        const dy = Math.sin(sh.angle) * sh.speed;
        sh.x += dx;
        sh.y += dy;
        sh.life -= sh.bright ? 0.009 : 0.012;

        const tailX = sh.x - Math.cos(sh.angle) * sh.len;
        const tailY = sh.y - Math.sin(sh.angle) * sh.len;

        const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
        if (sh.bright) {
          // Click-triggered star: brighter core, a soft lime glow, and a
          // thicker line so it reads clearly against busy backgrounds
          // instead of getting lost like the faint ambient ones.
          grad.addColorStop(0, `rgba(210, 255, 205, ${sh.life})`);
          grad.addColorStop(0.4, `rgba(121, 239, 117, ${sh.life * 0.7})`);
          grad.addColorStop(1, 'rgba(121, 239, 117, 0)');
          ctx.save();
          ctx.shadowColor = `rgba(121, 239, 117, ${sh.life * 0.8})`;
          ctx.shadowBlur = 8;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(sh.x, sh.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
          ctx.restore();
        } else {
          grad.addColorStop(0, `rgba(255,255,255,${sh.life})`);
          grad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(sh.x, sh.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
      });

      shootingStars = shootingStars.filter(sh => sh.life > 0 && sh.y < height + 100);
    }

    animationFrameId = requestAnimationFrame(draw);
  }

  // Pause entirely when the tab is in the background — a portfolio visitor
  // very often has the tab open but not focused (reading a resume PDF,
  // checking email, etc). There's no reason to keep burning CPU/battery on
  // an animation nobody can see; resume immediately when they come back.
  let animationFrameId = null;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    } else if (!animationFrameId) {
      draw();
    }
  });

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();
