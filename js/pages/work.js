// work.js — Filterable project grid with shareable category links
import { getProjects, getProjectsByCategory, getAllCategories, formatCategoryLabel } from '../data.js';
import { createProjectCard } from '../components/projectCard.js';
import { observeReveal } from '../app.js';

export function renderWork(container, categorySlug) {
  const categories = getAllCategories();
  const activeCategory = categorySlug || 'all';
  const projects = getProjectsByCategory(activeCategory);

  container.innerHTML = `
    <div class="page-enter">
      <section class="section" style="padding-top: calc(var(--nav-height) + 2rem);">
        <div class="container">
          <div class="section__header">
            <p class="t-label">Portfolio</p>
            <h1 class="t-section">Our Work</h1>
          </div>
          <div class="filter-bar" id="filter-bar">
            <button class="filter-btn ${activeCategory === 'all' ? 'filter-btn--active' : ''}"
                    data-cat="all" id="filter-all">All</button>
            ${categories.map(c => `
              <button class="filter-btn ${activeCategory === c ? 'filter-btn--active' : ''}"
                      data-cat="${c}" id="filter-${c}">${formatCategoryLabel(c)}</button>
            `).join('')}
          </div>
          <div class="project-grid stagger" id="work-grid"></div>
          ${projects.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state__icon">◇</div>
              <p class="empty-state__text">No projects in this category yet.</p>
            </div>
          ` : ''}
        </div>
      </section>
    </div>
  `;

  const grid = document.getElementById('work-grid');
  projects.forEach(p => grid.appendChild(createProjectCard(p)));

  // Filter button clicks — update URL hash which triggers re-render
  document.getElementById('filter-bar').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    const cat = btn.dataset.cat;
    window.location.hash = cat === 'all' ? '#/work' : `#/work/${cat}`;
  });

  observeReveal();
}
