// ============================================================
// PROJECTS SECTION
// Renders the 3 featured cards, the Project Explorer rows, and
// fills the single shared project-detail modal on click. All
// content comes from PROJECTS_DATA (js/projects-data.js) — add a
// project there and it appears here automatically.
// ============================================================

function pmEscapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function pmPlaceholderMedia(project) {
  return `<div class="project-card__placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${project.categoryIcon}</svg></div>`;
}

function pmLinkIcons() {
  return {
    repo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
    demo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };
}

// --- Featured cards (main screen) ---
function renderFeaturedCards() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  const icons = pmLinkIcons();
  const featured = PROJECTS_DATA.filter(p => p.featured).sort((a, b) => a.order - b.order);

  grid.innerHTML = featured.map(project => `
    <article class="project-card glass-card" style="--card-accent: var(--${project.accent})" data-project-open="${project.id}" tabindex="0" role="button" aria-label="View ${pmEscapeHtml(project.title)} details">
      <div class="project-card__media">
        ${project.image ? `<img src="${project.image}" alt="${pmEscapeHtml(project.title)} preview" loading="lazy">` : pmPlaceholderMedia(project)}
        <span class="project-card__num">0${project.order}</span>
        <span class="project-card__category" title="${pmEscapeHtml(project.category)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${project.categoryIcon}</svg></span>
      </div>
      <div class="project-card__body">
        <h3 class="project-card__title">${pmEscapeHtml(project.title)}</h3>
        <p class="project-card__desc">${pmEscapeHtml(project.cardDescription)}</p>
        <div class="project-card__chips">
          ${project.techStack.map(t => `<span class="project-card__chip">${pmEscapeHtml(t)}</span>`).join('')}
        </div>
        <span class="project-card__link">View Details ${icons.arrow}</span>
      </div>
    </article>
  `).join('');
}

// --- Project Explorer rows (view all popup) ---
function renderExplorerRows() {
  const list = document.getElementById('explorerList');
  if (!list) return;
  const icons = pmLinkIcons();
  const rest = PROJECTS_DATA.filter(p => !p.featured).sort((a, b) => a.order - b.order);

  list.innerHTML = rest.map(project => `
    <article class="explorer-row" style="--row-accent: var(--${project.accent})" data-project-open="${project.id}" tabindex="0" role="button" aria-label="View ${pmEscapeHtml(project.title)} details">
      <div class="explorer-row__links">
        ${project.repo ? `<a href="${project.repo}" target="_blank" rel="noopener" data-stop-row-click>${icons.repo} Repository</a>` : ''}
        <button type="button" data-project-open="${project.id}">${icons.demo} Details</button>
      </div>
      <div class="explorer-row__media">
        ${project.image ? `<img src="${project.image}" alt="" loading="lazy">` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${project.categoryIcon}</svg>`}
      </div>
      <div class="explorer-row__info">
        <h4 class="explorer-row__title">${pmEscapeHtml(project.title)}</h4>
        <p class="explorer-row__desc">${pmEscapeHtml(project.cardDescription)}</p>
        <div class="explorer-row__chips">
          ${project.techStack.map(t => `<span class="explorer-row__chip">${pmEscapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');
}

// --- Shared project-detail modal ---
function fillProjectModal(project) {
  const icons = pmLinkIcons();
  const modal = document.getElementById('modalProject');
  if (!modal) return;
  const pmodal = modal.querySelector('.pmodal');
  pmodal.style.setProperty('--card-accent', `var(--${project.accent})`);

  document.getElementById('pmMedia').innerHTML = project.image
    ? `<img src="${project.image}" alt="${pmEscapeHtml(project.title)} preview">`
    : pmPlaceholderMedia(project);

  document.getElementById('pmTitle').textContent = project.title;
  document.getElementById('pmSubtitle').textContent = project.subtitle;
  document.getElementById('pmDesc').textContent = project.overview;

  const actions = document.getElementById('pmActions');
  let actionsHtml = '';
  if (project.repo) actionsHtml += `<a href="${project.repo}" target="_blank" rel="noopener" class="btn btn-outline">${icons.repo}Repository</a>`;
  if (project.demo) actionsHtml += `<a href="${project.demo}" target="_blank" rel="noopener" class="btn btn-primary">${icons.demo}Live Demo</a>`;
  actions.innerHTML = actionsHtml;
  actions.style.display = actionsHtml ? 'flex' : 'none';

  document.getElementById('pmProblem').textContent = project.problem;
  document.getElementById('pmSolution').textContent = project.solution;
  document.getElementById('pmFeatures').innerHTML = project.features.map(f => `<li>${pmEscapeHtml(f)}</li>`).join('');
  document.getElementById('pmStack').innerHTML = project.stack.map(s => `<span class="pmodal__chip">${pmEscapeHtml(s)}</span>`).join('');
  document.getElementById('pmChallenges').textContent = project.challenges;
  document.getElementById('pmLearned').innerHTML = project.learned.map(l => `<li>${pmEscapeHtml(l)}</li>`).join('');

  const scrollArea = modal.querySelector('.pmodal__scroll');
  if (scrollArea) scrollArea.scrollTop = 0;
  updateProjectModalProgress();
}

function openProjectModal(id) {
  const project = PROJECTS_DATA.find(p => p.id === id);
  if (!project) return;
  fillProjectModal(project);
  openModal('modalProject');
}

function updateProjectModalProgress() {
  const scrollArea = document.querySelector('#modalProject .pmodal__scroll');
  const fill = document.getElementById('pmProgressFill');
  if (!scrollArea || !fill) return;
  const max = scrollArea.scrollHeight - scrollArea.clientHeight;
  const pct = max > 0 ? (scrollArea.scrollTop / max) * 100 : 0;
  fill.style.height = `${Math.min(100, Math.max(0, pct))}%`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedCards();
  renderExplorerRows();

  // Any element with data-project-open opens the detail modal, on top
  // of whatever else is currently open (explorer or main screen).
  //
  // The Repository link inside an explorer row sits on top of a row that
  // itself opens the detail modal on click — clicking the link shouldn't
  // also open the modal underneath it. That used to be handled with an
  // inline onclick="event.stopPropagation()" in the generated markup, but
  // that's blocked by this site's Content-Security-Policy (no unsafe-inline
  // in script-src). Checking for data-stop-row-click here does the same
  // job in a CSP-safe way, without needing a second listener on the same
  // element (stopPropagation() between two listeners on the same node
  // wouldn't stop the second one from firing anyway).
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-stop-row-click]')) return;
    const trigger = e.target.closest('[data-project-open]');
    if (!trigger) return;
    e.preventDefault();
    openProjectModal(trigger.getAttribute('data-project-open'));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const trigger = e.target.closest('[data-project-open]');
    if (!trigger) return;
    e.preventDefault();
    openProjectModal(trigger.getAttribute('data-project-open'));
  });

  const scrollArea = document.querySelector('#modalProject .pmodal__scroll');
  if (scrollArea) scrollArea.addEventListener('scroll', updateProjectModalProgress);
});
