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
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.documentElement.scrollHeight;
    generateStars();
  }

  function generateStars() {
    // Star count scales with total canvas area (width × full page height),
    // which on a long single-page site like this can mean thousands of
    // stars — most of them nowhere near the visible viewport at any given
    // moment, but still redrawn 60 times a second forever. Capping the
    // total keeps the same visual density on screen while eliminating the
    // wasted off-screen redraw cost, which is what was causing the
    // low-end-device lag.
    const rawCount = Math.floor((width * height) / 5000);
    const MAX_STARS = 450;
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
  // click-triggered stars, see spawnClickShootingStar below).
  function spawnShootingStarAt(x, y) {
    shootingStars.push({
      x, y,
      len: 100 + Math.random() * 70,
      speed: 11 + Math.random() * 6,
      angle: Math.random() * Math.PI * 2,
      life: 1
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
        sh.life -= 0.012;

        const tailX = sh.x - Math.cos(sh.angle) * sh.len;
        const tailY = sh.y - Math.sin(sh.angle) * sh.len;

        const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${sh.life})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
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
