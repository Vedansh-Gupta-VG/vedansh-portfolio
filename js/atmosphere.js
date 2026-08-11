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
    // Canvas matches the viewport, not the full page — the backdrop is fixed, so it should be too.
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    generateStars();
  }

  function generateStars() {
    // Count scales with viewport area; capped lower on mobile since redraws are costlier there.
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

  // Click-triggered shooting star — brighter/thicker than the ambient ones so it's clearly visible.
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
          // Bolder white glow for click-triggered stars.
          grad.addColorStop(0, `rgba(255, 255, 255, ${sh.life})`);
          grad.addColorStop(0.4, `rgba(255, 255, 255, ${sh.life * 0.75})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.save();
          ctx.shadowColor = `rgba(255, 255, 255, ${sh.life * 0.8})`;
          ctx.shadowBlur = 8;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.4;
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
