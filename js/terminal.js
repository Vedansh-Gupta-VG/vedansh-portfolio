// ============================================================
// TERMINAL MODAL: powers the "more_about_me.exe" popup
// - Plays a one-time boot sequence each time it opens
// - Switches sections in the fixed left nav without scrolling the shell
// - Wires the bottom command line buttons
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.querySelector('[data-modal-open="modalAboutMe"]');
  const overlay = document.getElementById('modalAboutMe');
  if (!trigger || !overlay) return;

  const boot = document.getElementById('terminalBoot');
  const main = document.getElementById('terminalMain');
  const navItems = overlay.querySelectorAll('.term-nav-item');
  const panels = overlay.querySelectorAll('.term-panel');

  function showSection(name) {
    // Toggle .is-active on whichever nav item / panel matches `name`,
    // and remove it from all the others — only one section visible at a time.
    navItems.forEach(btn => btn.classList.toggle('is-active', btn.dataset.termSection === name));
    panels.forEach(panel => panel.classList.toggle('is-active', panel.dataset.termPanel === name));
  }

  navItems.forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.termSection));
  });

  // The "> contact_me" command line button: close this modal and smooth-scroll
  // to the real Contact section instead of trying to replicate a contact form
  // inside the terminal itself.
  overlay.querySelectorAll('[data-term-action="contact"]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal('modalAboutMe');
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth' });
    });
  });

  function runBoot() {
    // reset to first section every time the terminal opens
    showSection('whoami');

    main.classList.remove('is-visible');
    boot.classList.remove('is-visible', 'is-booting');

    // Reading offsetWidth forces the browser to apply the class removal
    // above immediately (a "layout reflow"), before we re-add the classes
    // on the next lines. Without this, the browser can batch all these
    // class changes together and skip straight to the end state, so the
    // boot animation wouldn't replay on the 2nd+ time the modal opens —
    // only reset instantly with no visible animation.
    void boot.offsetWidth;
    boot.classList.add('is-visible');
    requestAnimationFrame(() => boot.classList.add('is-booting'));

    // After the boot animation's had time to play, swap from the boot
    // screen to the real terminal content.
    window.setTimeout(() => {
      boot.classList.remove('is-visible', 'is-booting');
      main.classList.add('is-visible');
    }, 1000);
  }

  trigger.addEventListener('click', runBoot);
});
