// ============================================================
// ACHIEVEMENTS: click an Application Number to copy it, so the
// user can paste it straight into the IP India portal search.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-copy-appnum]').forEach(btn => {
    const textEl = btn.querySelector('.patent-card__appnum-text');
    const original = textEl ? textEl.textContent : '';
    let resetTimer = null;

    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy-appnum');
      try {
        await navigator.clipboard.writeText(value);
      } catch (err) {
        // Clipboard API unavailable (older browser / insecure context) —
        // fail silently, the number is still visible to copy by hand.
        return;
      }

      btn.classList.add('is-copied');
      if (textEl) textEl.textContent = 'Copied!';

      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        btn.classList.remove('is-copied');
        if (textEl) textEl.textContent = original;
      }, 2000);
    });
  });
});
