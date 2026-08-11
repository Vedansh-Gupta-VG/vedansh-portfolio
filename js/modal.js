// ============================================================
// MODAL: generic open/close logic reused by every popup
// (About "more_about_me", certificates, projects, patents, paper)
// Usage: openModal('modalId') / closeModal('modalId')
// Closes on: overlay click, Escape key, [data-modal-close] elements
// Supports stacked modals (e.g. Project Explorer -> Project Detail):
// Escape and the browser back-gesture only close the most recently
// opened modal, not everything at once.
// ============================================================

const openModalStack = [];

function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('is-open');
  document.body.classList.add('modal-open');
  const existingIndex = openModalStack.indexOf(id);
  if (existingIndex !== -1) openModalStack.splice(existingIndex, 1);
  openModalStack.push(id);
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('is-open');
  const index = openModalStack.indexOf(id);
  if (index !== -1) openModalStack.splice(index, 1);
  if (openModalStack.length === 0) document.body.classList.remove('modal-open');
}

function closeTopModal() {
  const topId = openModalStack[openModalStack.length - 1];
  if (topId) closeModal(topId);
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.is-open').forEach(overlay => {
    overlay.classList.remove('is-open');
  });
  openModalStack.length = 0;
  document.body.classList.remove('modal-open');
}

document.addEventListener('DOMContentLoaded', () => {
  // Any element with data-modal-open="modalId" opens that modal
  document.querySelectorAll('[data-modal-open]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(trigger.getAttribute('data-modal-open'));
    });
  });

  // Any element with data-modal-close inside a modal closes it
  document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', () => {
      const overlay = el.closest('.modal-overlay');
      if (overlay) closeModal(overlay.id);
    });
  });

  // Click outside the modal box (on the overlay itself) closes just
  // that overlay — if another modal sits behind it, it stays open.
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // Escape closes only the topmost modal in the stack.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTopModal();
  });
});
