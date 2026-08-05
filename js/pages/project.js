// project.js — TMDB-style cinematic project detail page with awards, campaigns, entities
import { getProjectById, getPersonById, getRelatedProjects, formatCategoryLabel, getEntityById, getCampaignForProject } from '../data.js';
import { createProjectCard } from '../components/projectCard.js';
import { createPersonCard } from '../components/personCard.js';
import { createAwardsSection } from '../components/awardBadge.js';
import { openVideo } from '../components/videoPlayer.js';
import { observeReveal } from '../app.js';

function getBackdrop(p) {
  if (p.backdrop) return p.backdrop;
  const m = (p.videoUrl||'').match(/embed\/([^?&]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/maxresdefault.jpg` : (p.poster || '');
}

export function renderProject(container, projectId) {
  const project = getProjectById(projectId);
  if (!project) {
    container.innerHTML = `<div class="page-enter"><section class="section detail"><div class="container"><div class="empty-state"><div class="empty-state__icon">◇</div><p class="empty-state__text">Project not found.</p></div></div></section></div>`;
    return;
  }

  const related = getRelatedProjects(project, 4);
  const backdrop = getBackdrop(project);
  const studio = project.studioId ? getEntityById(project.studioId) : null;
  const prodHouse = project.productionHouseId ? getEntityById(project.productionHouseId) : null;
  const campaign = getCampaignForProject(projectId);
  const isPrivate = project.status === 'private';

  const creditsByPerson = {};
  project.credits.forEach(c => {
    if (creditsByPerson[c.personId]) creditsByPerson[c.personId].roles.push(c.role);
    else creditsByPerson[c.personId] = { personId: c.personId, roles: [c.role] };
  });
  const uniqueCredits = Object.values(creditsByPerson);

  // Build attribution links
  let attributionHtml = '';
  if (studio || prodHouse || campaign) {
    const parts = [];
    if (campaign) parts.push(`<a href="#/campaign/${campaign.id}" class="project-attr__link"><span class="cat-pill">Campaign</span> ${campaign.name}</a>`);
    if (studio && studio.id === 'aadmi-productions') parts.push(`<a href="#/entity/${studio.id}" class="project-attr__link"><span class="cat-pill">Studio</span> ${studio.name}</a>`);
    if (prodHouse && prodHouse.id === 'aadmi-productions') parts.push(`<a href="#/entity/${prodHouse.id}" class="project-attr__link"><span class="cat-pill">Production</span> ${prodHouse.name}</a>`);
    attributionHtml = `<div class="project-attr reveal">${parts.join('')}</div>`;
  }

  container.innerHTML = `
    <div class="page-enter">
      <div class="spotlight" style="height: 70vh; min-height: 400px;">
        <div class="spotlight__slide spotlight__slide--active">
          <div class="spotlight__bg"><img src="${backdrop}" alt=""></div>
          <div class="spotlight__vignette"></div>
          <div class="spotlight__content" style="max-width: 650px;">
            <button class="detail__back" id="detail-back" style="margin-bottom: 1rem;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg> Back
            </button>
            ${isPrivate ? `<div class="status-badge status-badge--private">🔒 In Progress</div>` : ''}
            ${project.titleImage
              ? `<img src="${project.titleImage}" alt="${project.title}" class="spotlight__title-logo">`
              : `<div class="spotlight__title-text">${project.title}</div>`}
            <div class="spotlight__meta">
              <span>${project.year}</span>
              ${project.duration ? `<span>·</span><span>${project.duration}</span>` : ''}
              <span>·</span>
              ${project.categories.map(c => `<span>${formatCategoryLabel(c)}</span>`).join('<span>·</span>')}
            </div>
            ${project.role ? `<div style="display:inline-block;font-size:0.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;padding:0.375rem 0.875rem;border-radius:var(--radius-full);background:var(--bg-glass);color:var(--text-secondary);border:1px solid var(--border);margin-bottom:1rem;">Role: ${project.role}</div>` : ''}
            <div class="spotlight__desc">${project.description}</div>
            <div class="spotlight__actions">
              ${project.videoUrl && !isPrivate ? (project.externalLink ? `
                <a href="${project.videoUrl}" target="_blank" rel="noopener" class="spotlight__btn spotlight__btn--play">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg> View on FilmFreeway
                </a>
              ` : `
                <button class="spotlight__btn spotlight__btn--play" id="watch-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg> Watch
                </button>
              `) : ''}
            </div>
          </div>
        </div>
      </div>

      <section class="section" style="padding-top: 2rem;">
        <div class="container">
          ${attributionHtml}

          <div class="detail__credits-list reveal" style="margin-bottom: 3rem;">
            ${uniqueCredits.map(c => {
              const person = getPersonById(c.personId);
              const name = person ? person.name : c.personId;
              return `<div class="detail__credit"><span class="detail__credit-role">${c.roles.join(' / ')}</span><a href="#/person/${c.personId}" class="detail__credit-name">${name}</a></div>`;
            }).join('')}
          </div>

          <div id="project-awards-slot"></div>

          ${(project.diComparisons && project.diComparisons.length > 0) || (project.vfxGallery && project.vfxGallery.length > 0) ? `
            <div class="related reveal" style="margin-top:4rem; border-top:1px solid var(--border); padding-top:2rem;">
              <div class="section__header">
                <p class="t-label">Technical Specs</p>
                <h2 class="t-section" style="font-size:1.5rem;">Visual Effects & Color Grade</h2>
              </div>
              <div class="tech-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
                ${(project.diComparisons||[]).map((di, idx) => `
                  <div class="tech-card" style="background:var(--bg-elevated); border:1px solid var(--border); border-radius:var(--radius-sm); padding:1rem;">
                    <div style="font-size:0.75rem; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:0.75rem; font-weight:600;">Color Grade — Shot ${idx+1}</div>
                    <div class="di-slider" style="margin:0;">
                      <img src="${di.after}" class="di-slider__after" alt="After" loading="lazy" onerror="this.style.display='none'">
                      <div class="di-slider__before"><img src="${di.before}" alt="Before" loading="lazy" onerror="this.style.display='none'"></div>
                      <input type="range" min="0" max="100" value="50" class="di-slider__range" oninput="this.parentElement.style.setProperty('--pos',this.value+'%')">
                      <div class="di-slider__handle"></div>
                    </div>
                  </div>
                `).join('')}
                ${(project.vfxGallery||[]).map((vfx, idx) => `
                  <div class="tech-card" style="background:var(--bg-elevated); border:1px solid var(--border); border-radius:var(--radius-sm); padding:1rem;">
                    <div style="font-size:0.75rem; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:0.75rem; font-weight:600;">VFX Breakdown — Shot ${idx+1}</div>
                    <div class="di-slider" style="margin:0;">
                      <img src="${vfx.after}" class="di-slider__after" alt="After" loading="lazy" onerror="this.style.display='none'">
                      <div class="di-slider__before"><img src="${vfx.before}" alt="Before" loading="lazy" onerror="this.style.display='none'"></div>
                      <input type="range" min="0" max="100" value="50" class="di-slider__range" oninput="this.parentElement.style.setProperty('--pos',this.value+'%')">
                      <div class="di-slider__handle"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${(project.btsImages && project.btsImages.length > 0) ? `
            <div class="related reveal" style="margin-top:3rem;">
              <div class="section__header"><p class="t-label">Gallery</p><h2 class="t-section" style="font-size:1.5rem;">Behind The Scenes</h2></div>
              <div class="bts-grid">${project.btsImages.map(img => `<img src="${img}" alt="BTS" onerror="this.style.display='none'">`).join('')}</div>
            </div>
          ` : ''}

          ${(project.autoTags && project.autoTags.length > 0) ? `
            <div class="related reveal" style="margin-top:2rem;">
              <div class="tag-cloud">${project.autoTags.map(t => `<span class="cat-pill">${t}</span>`).join('')}</div>
            </div>
          ` : ''}

          ${uniqueCredits.length > 0 ? `
            <div class="related reveal">
              <div class="section__header"><p class="t-label">Credits</p><h2 class="t-section" style="font-size:1.5rem;">Cast & Crew</h2></div>
              <div class="person-grid stagger" id="credits-grid"></div>
            </div>
          ` : ''}

          ${related.length > 0 ? `
            <div class="related reveal" style="margin-top:3rem;">
              <div class="section__header"><p class="t-label">Explore</p><h2 class="t-section" style="font-size:1.5rem;">More Like This</h2></div>
              <div class="project-grid stagger" id="related-grid"></div>
            </div>
          ` : ''}
        </div>
      </section>
    </div>
  `;

  document.getElementById('detail-back').addEventListener('click', () => {
    if (window.history.length > 1) window.history.back();
    else window.location.hash = '#/work';
  });

  const watchBtn = document.getElementById('watch-btn');
  if (watchBtn && !project.externalLink) {
    watchBtn.addEventListener('click', () => openVideo(project.videoUrl));
  }

  // Awards
  const awardsSlot = document.getElementById('project-awards-slot');
  const awardsSection = createAwardsSection(project.awards || []);
  if (awardsSlot && awardsSection) awardsSlot.appendChild(awardsSection);

  const cg = document.getElementById('credits-grid');
  if (cg) uniqueCredits.forEach(c => {
    const person = getPersonById(c.personId);
    if (person) cg.appendChild(createPersonCard(person, c.roles.join(' / ')));
  });

  const rg = document.getElementById('related-grid');
  if (rg) related.forEach(p => rg.appendChild(createProjectCard(p)));

  observeReveal();
  window.scrollTo(0, 0);
}
