// person.js — Person detail page with affiliations, aggregated awards, poster filmography
import { getPersonById, getProjectsByPerson, getAffiliatedEntities, getAwardsForPerson } from '../data.js';
import { createProjectCard } from '../components/projectCard.js';
import { createAwardsSection } from '../components/awardBadge.js';
import { observeReveal } from '../app.js';

export function renderPerson(container, personId, roleFilter) {
  const person = getPersonById(personId);
  if (!person) {
    container.innerHTML = `<div class="page-enter"><section class="section profile"><div class="container"><div class="empty-state"><div class="empty-state__icon">◇</div><p class="empty-state__text">Person not found.</p></div></div></section></div>`;
    return;
  }

  let projects = getProjectsByPerson(personId);
  if (roleFilter) {
    const slugify = str => str.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim();
    projects = projects.filter(p => p.credits.some(c => c.personId === personId && slugify(c.role) === roleFilter));
  }
  const affiliations = getAffiliatedEntities(personId).filter(e => e.id === 'aadmi-productions');
  const awards = getAwardsForPerson(personId);
  const socials = person.socialLinks || {};
  const profileLabel = person.profileType === 'freelancer' ? 'Freelancer' : 'Artist';

  container.innerHTML = `
    <div class="page-enter">
      <section class="section profile">
        <div class="container">
          <button class="detail__back" id="person-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>

          <div class="profile-banner">
            <!-- If person has a backdrop image, it would go here -->
          </div>
          <div class="profile-header-card reveal">
            <div class="entity-hero">
              <div class="entity-hero__logo" style="border-radius:50%; width:160px; height:160px;">
                <img src="${person.photo}" alt="${person.name}" style="border-radius:50%; padding:4px;"
                     onerror="this.parentElement.innerHTML='<div style=\\'border-radius:50%;display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:4rem;color:var(--text-tertiary)\\'>${person.name.charAt(0)}</div>'">
              </div>
              <div class="entity-hero__info">
                <span class="entity-hero__type">${profileLabel}</span>
                <h1 class="entity-hero__name">${person.name}</h1>
                <p class="entity-hero__tagline">${person.title}</p>
                <div class="entity-hero__stats">
                  <div class="entity-hero__stat"><span class="entity-hero__stat-val">${projects.length}</span><span class="entity-hero__stat-label">Projects</span></div>
                  <div class="entity-hero__stat"><span class="entity-hero__stat-val">${awards.length}</span><span class="entity-hero__stat-label">Awards</span></div>
                  ${affiliations.length > 0 ? `<div class="entity-hero__stat"><span class="entity-hero__stat-val">${affiliations.length}</span><span class="entity-hero__stat-label">Affiliations</span></div>` : ''}
                </div>
                <p class="entity-hero__bio">${person.bio}</p>
                <div class="profile__socials">
                  ${Object.entries(socials).map(([k, v]) => `
                    <a href="${v}" target="_blank" rel="noopener" class="profile__social-link">${k.charAt(0).toUpperCase() + k.slice(1)}</a>
                  `).join('')}
                  <button id="btn-share-portfolio" class="profile__social-link" style="border:1px solid var(--border); background:var(--bg-elevated); color:var(--text-primary); cursor:pointer;">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="margin-right:4px;vertical-align:middle;"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    Share Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>

          ${affiliations.length > 0 ? `
            <div class="reveal" style="margin-top: 2rem;">
              <div class="section__header">
                <p class="t-label">Affiliations</p>
                <h2 class="t-section" style="font-size: 1.5rem;">Studios & Companies</h2>
              </div>
              <div class="affiliation-list">
                ${affiliations.map(e => `
                  <a href="#/entity/${e.id}" class="affiliation-item">
                    ${e.photo ? `<img src="${e.photo}" alt="${e.name}" class="affiliation-item__logo">` : `<div class="affiliation-item__initial">${e.name.charAt(0)}</div>`}
                    <div class="affiliation-item__info">
                      <div class="affiliation-item__name">${e.name}</div>
                      <div class="affiliation-item__type">${e.type === 'studio' ? 'Studio' : 'Production House'}</div>
                    </div>
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div id="person-awards-slot"></div>

          ${projects.length > 0 ? `
            <div class="reveal" style="margin-top: 2rem;">
              <div class="section__header">
                <p class="t-label">Body of Work</p>
                <h2 class="t-section" style="font-size: 1.5rem;">${roleFilter ? (roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1).replace('-', ' ')) + ' Portfolio' : 'Filmography'}</h2>
              </div>
              <div class="project-grid stagger" id="filmography-grid"></div>
            </div>
          ` : ''}
        </div>
      </section>
    </div>
  `;

  document.getElementById('person-back').addEventListener('click', () => {
    if (window.history.length > 1) window.history.back();
    else window.location.hash = '#/artists';
  });

  const btnShare = document.getElementById('btn-share-portfolio');
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      const originalText = btnShare.innerHTML;
      btnShare.innerHTML = 'Copied!';
      setTimeout(() => btnShare.innerHTML = originalText, 2000);
    });
  }

  // Awards
  const awardsSlot = document.getElementById('person-awards-slot');
  const awardsSection = createAwardsSection(awards);
  if (awardsSlot && awardsSection) awardsSlot.appendChild(awardsSection);

  const fg = document.getElementById('filmography-grid');
  if (fg) {
    projects.forEach(p => fg.appendChild(createProjectCard(p)));
  }

  observeReveal();
  window.scrollTo(0, 0);
}
