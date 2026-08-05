// entity.js — Studio / Production House detail page
import { getEntityById, getProjectsByEntity, getEntityMembers, getAwardsForEntity } from '../data.js';
import { createProjectCard } from '../components/projectCard.js';
import { createPersonCard } from '../components/personCard.js';
import { createAwardsSection } from '../components/awardBadge.js';
import { observeReveal } from '../app.js';

export function renderEntity(container, entityId) {
  const entity = getEntityById(entityId);
  if (!entity || entityId !== 'aadmi-productions') {
    container.innerHTML = `<div class="page-enter"><section class="section"><div class="container"><div class="empty-state"><div class="empty-state__icon">◇</div><p class="empty-state__text">Entity not found.</p></div></div></section></div>`;
    return;
  }

  const projects = getProjectsByEntity(entityId);
  const members = getEntityMembers(entityId);
  const awards = getAwardsForEntity(entityId);
  const typeLabel = entity.type === 'studio' ? 'Studio' : 'Production House';
  
  const logos = entity.logos || {};
  const lv = logos.variants || {};
  const logoSrc = lv.color || lv.white || entity.photo || (entity.logo && (entity.logo.white || entity.logo.color)) || '';

  container.innerHTML = `
    <div class="page-enter">
      <section class="section" style="padding-top: calc(var(--nav-height) + 2rem);">
        <div class="container">
          <button class="detail__back" id="entity-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg> Back
          </button>

          <div class="profile-banner">
            ${entity.backdrop ? `<img src="${entity.backdrop}" alt="Cover">` : ''}
          </div>
          <div class="profile-header-card reveal">
            <div class="entity-hero">
              <div class="entity-hero__logo">
                ${logoSrc
                  ? `<img src="${logoSrc}" alt="${entity.name}">`
                  : `<div class="entity-hero__initial">${entity.name.charAt(0)}</div>`}
              </div>
              <div class="entity-hero__info">
                <span class="entity-hero__type">${typeLabel}</span>
                <h1 class="entity-hero__name">${entity.name}</h1>
                ${entity.tagline ? `<p class="entity-hero__tagline">${entity.tagline}</p>` : ''}
                <div class="entity-hero__stats">
                  <div class="entity-hero__stat"><span class="entity-hero__stat-val">${projects.length}</span><span class="entity-hero__stat-label">Projects</span></div>
                  <div class="entity-hero__stat"><span class="entity-hero__stat-val">${members.length}</span><span class="entity-hero__stat-label">Members</span></div>
                  <div class="entity-hero__stat"><span class="entity-hero__stat-val">${awards.length}</span><span class="entity-hero__stat-label">Awards</span></div>
                </div>
                <p class="entity-hero__bio">${entity.bio}</p>
                <div class="profile__socials">
                  ${Object.entries(entity.socialLinks || {}).map(([k, v]) => `
                    <a href="${v}" target="_blank" rel="noopener" class="profile__social-link">${k.charAt(0).toUpperCase() + k.slice(1)}</a>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          ${members.length > 0 ? `
            <div class="related reveal">
              <div class="section__header"><p class="t-label">Team</p><h2 class="t-section" style="font-size:1.5rem;">Members</h2></div>
              <div class="person-grid stagger" id="entity-members"></div>
            </div>
          ` : ''}

          <div id="entity-awards-slot"></div>

          ${projects.length > 0 ? `
            <div class="related reveal">
              <div class="section__header"><p class="t-label">Body of Work</p><h2 class="t-section" style="font-size:1.5rem;">Projects</h2></div>
              <div class="project-grid stagger" id="entity-projects"></div>
            </div>
          ` : `
            <div class="empty-state reveal"><p class="empty-state__text">No projects linked yet.</p></div>
          `}
        </div>
      </section>
    </div>
  `;

  document.getElementById('entity-back').addEventListener('click', () => {
    if (window.history.length > 1) window.history.back();
    else window.location.hash = entity.type === 'studio' ? '#/studios' : '#/production-houses';
  });

  const mg = document.getElementById('entity-members');
  if (mg) members.forEach(p => mg.appendChild(createPersonCard(p)));

  const awardsSlot = document.getElementById('entity-awards-slot');
  const awardsSection = createAwardsSection(awards);
  if (awardsSlot && awardsSection) awardsSlot.appendChild(awardsSection);

  const pg = document.getElementById('entity-projects');
  if (pg) projects.forEach(p => pg.appendChild(createProjectCard(p)));

  observeReveal();
  window.scrollTo(0, 0);
}
