// studios.js — Organizations grid with SOP-aligned type filtering
import { getEntities, getEntitiesByType } from '../data.js';
import { createEntityCard } from '../components/entityCard.js';
import { observeReveal } from '../app.js';

export function renderOrganizations(container, type) {
  let orgs = getEntities();
  let title = 'All Studios';
  const label = 'Studios';

  switch (type) {
    case 'studio':
      title = 'Production Houses';
      orgs = getEntitiesByType('studio');
      // Also include production_house type
      orgs = orgs.concat(getEntitiesByType('production_house'));
      break;
    case 'production_house':
      title = 'Production Houses';
      orgs = getEntitiesByType('production_house');
      break;
    case 'post_production':
      title = 'Post Production';
      orgs = getEntitiesByType('post_production');
      if (orgs.length === 0) {
        // Fallback: show studios that do post production work
        orgs = getEntities().filter(e =>
          /post.?prod|di|color|vfx|edit/i.test(e.tagline || '') ||
          /post.?prod|di|color|vfx|edit/i.test(e.bio || '')
        );
      }
      break;
    case 'animation_studio':
      title = 'Animation Studios';
      orgs = getEntitiesByType('animation_studio');
      if (orgs.length === 0) {
        orgs = getEntities().filter(e =>
          /animat/i.test(e.tagline || '') || /animat/i.test(e.bio || '')
        );
      }
      break;
  }
  
  // Rework: Only AADMI Productions should show up on the public site
  orgs = orgs.filter(e => e.id === 'aadmi-productions');

  container.innerHTML = `
    <div class="page-enter">
      <section class="section" style="padding-top: calc(var(--nav-height) + 2rem);">
        <div class="container">
          <div class="section__header reveal">
            <p class="t-label">${label}</p>
            <h1 class="t-section">${title}</h1>
          </div>
          <div class="entity-grid stagger" id="org-grid"></div>
          ${orgs.length === 0 ? '<div class="empty-state"><p class="empty-state__text">No ' + title.toLowerCase() + ' found yet.</p></div>' : ''}
        </div>
      </section>
    </div>
  `;

  const grid = document.getElementById('org-grid');
  orgs.forEach(e => grid.appendChild(createEntityCard(e)));
  observeReveal();
}
