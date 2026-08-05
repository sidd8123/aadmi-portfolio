// awards.js — Global awards listing page
import { getAllAwards } from '../data.js';
import { createAwardBadge } from '../components/awardBadge.js';
import { observeReveal } from '../app.js';

export function renderAwards(container) {
  const awards = getAllAwards();

  container.innerHTML = `
    <div class="page-enter">
      <section class="section" style="padding-top: calc(var(--nav-height) + 2rem);">
        <div class="container" style="max-width: 800px;">
          <div class="section__header reveal">
            <p class="t-label">Recognition</p>
            <h1 class="t-section">Awards & Nominations</h1>
          </div>
          ${awards.length > 0 ? `
            <div class="awards-grid stagger" id="awards-grid"></div>
          ` : `
            <div class="empty-state reveal">
              <div class="empty-state__icon">🏆</div>
              <p class="empty-state__text">Awards will appear here as projects receive recognition.</p>
            </div>
          `}
        </div>
      </section>
    </div>
  `;

  const grid = document.getElementById('awards-grid');
  if (grid) awards.forEach(a => grid.appendChild(createAwardBadge(a)));

  observeReveal();
}
