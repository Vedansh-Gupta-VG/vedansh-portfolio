// ============================================================
// TEXT SELECTION: applies everywhere on the site.
// - Escape clears whatever text is currently highlighted.
// - Clicking on empty space (anywhere that isn't part of an
//   active drag-select) clears the highlight too.
// ============================================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) selection.removeAllRanges();
  }
});

document.addEventListener('mousedown', (e) => {
  // A plain click (no drag) always collapses the previous selection,
  // this just makes sure it happens even if something upstream
  // stops the event from reaching the default handling.
  if (e.detail > 1) return; // ignore double/triple click (used for word/line select)
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed) selection.removeAllRanges();
});
