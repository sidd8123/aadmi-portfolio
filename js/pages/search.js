// search.js — Full search results page
import { searchAll } from '../data.js';
import { createProjectCard } from '../components/projectCard.js';
import { createPersonCard } from '../components/personCard.js';
import { createEntityCard } from '../components/entityCard.js';
import { observeReveal } from '../app.js';

export function renderSearch(container, query) {
  const results = query ? searchAll(query) : { projects: [], people: [], entities: [], campaigns: [] };
  const total = results.projects.length + results.people.length + results.entities.length + results.campaigns.length;

  container.innerHTML = `
    <div class="page-enter">
      <section class="section" style="padding-top: calc(var(--nav-height) + 2rem);">
        <div class="container">
          <div class="section__header reveal">
            <p class="t-label">Search Results</p>
            <h1 class="t-section">${query ? `"${query}"` : 'Search'}</h1>
            ${query ? `<p class="t-caption" style="margin-top: 0.5rem;">${total} result${total !== 1 ? 's' : ''} found</p>` : ''}
          </div>

          ${!query ? `<div class="empty-state reveal"><p class="empty-state__text">Enter a search term to find projects, people, and studios.</p></div>` : ''}

          ${total === 0 && query ? `<div class="empty-state reveal"><div class="empty-state__icon">◇</div><p class="empty-state__text">No results found for "${query}"</p></div>` : ''}

          ${results.projects.length > 0 ? `
            <div class="reveal" style="margin-bottom: 3rem;">
              <div class="section__header"><h2 class="t-section" style="font-size:1.25rem;">Projects</h2></div>
              <div class="project-grid stagger" id="search-projects"></div>
            </div>
          ` : ''}

          ${results.people.length > 0 ? `
            <div class="reveal" style="margin-bottom: 3rem;">
              <div class="section__header"><h2 class="t-section" style="font-size:1.25rem;">People</h2></div>
              <div class="person-grid stagger" id="search-people"></div>
            </div>
          ` : ''}

          ${results.entities.length > 0 ? `
            <div class="reveal" style="margin-bottom: 3rem;">
              <div class="section__header"><h2 class="t-section" style="font-size:1.25rem;">Studios & Companies</h2></div>
              <div class="entity-grid stagger" id="search-entities"></div>
            </div>
          ` : ''}

          ${results.campaigns.length > 0 ? `
            <div class="reveal" style="margin-bottom: 3rem;">
              <div class="section__header"><h2 class="t-section" style="font-size:1.25rem;">Campaigns</h2></div>
              <div class="campaign-list" id="search-campaigns">
                ${results.campaigns.map(c => `
                  <a href="#/campaign/${c.id}" class="campaign-item">
                    <span class="campaign-item__name">${c.name}</span>
                    <span class="campaign-item__client">${c.client} · ${c.year}</span>
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </section>
    </div>
  `;

  const pg = document.getElementById('search-projects');
  if (pg) results.projects.forEach(p => pg.appendChild(createProjectCard(p)));

  const ppg = document.getElementById('search-people');
  if (ppg) results.people.forEach(p => ppg.appendChild(createPersonCard(p)));

  const eg = document.getElementById('search-entities');
  if (eg) results.entities.forEach(e => eg.appendChild(createEntityCard(e)));

  observeReveal();
}
