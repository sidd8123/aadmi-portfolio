// campaign.js — Ad Campaign overview page
import { getCampaignById, getProjectsForCampaign, getEntityById } from '../data.js';
import { createProjectCard } from '../components/projectCard.js';
import { observeReveal } from '../app.js';

export function renderCampaign(container, campaignId) {
  const campaign = getCampaignById(campaignId);
  if (!campaign) {
    container.innerHTML = `<div class="page-enter"><section class="section"><div class="container"><div class="empty-state"><div class="empty-state__icon">◇</div><p class="empty-state__text">Campaign not found.</p></div></div></section></div>`;
    return;
  }

  const projects = getProjectsForCampaign(campaignId);
  const studio = campaign.studioId ? getEntityById(campaign.studioId) : null;
  const posterSrc = campaign.poster || (projects[0] && projects[0].poster) || '';

  container.innerHTML = `
    <div class="page-enter">
      <div class="spotlight" style="height: 55vh; min-height: 350px;">
        <div class="spotlight__slide spotlight__slide--active">
          <div class="spotlight__bg"><img src="${posterSrc}" alt=""></div>
          <div class="spotlight__vignette"></div>
          <div class="spotlight__content" style="max-width: 600px;">
            <button class="detail__back" id="campaign-back" style="margin-bottom: 1rem;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg> Back
            </button>
            <div class="spotlight__meta">
              <span class="cat-pill">Campaign</span>
              <span>·</span>
              <span>${campaign.year}</span>
              <span>·</span>
              <span>${projects.length} spot${projects.length !== 1 ? 's' : ''}</span>
            </div>
            <div class="spotlight__title-text">${campaign.name}</div>
            <div class="spotlight__desc">${campaign.description}</div>
            ${studio ? `<a href="#/entity/${studio.id}" class="campaign__studio-link">by ${studio.name} →</a>` : ''}
          </div>
        </div>
      </div>

      <section class="section" style="padding-top: 2rem;">
        <div class="container">
          <div class="section__header reveal">
            <p class="t-label">${campaign.client}</p>
            <h2 class="t-section" style="font-size: 1.5rem;">Individual Spots</h2>
          </div>
          <div class="project-grid stagger" id="campaign-projects"></div>
        </div>
      </section>
    </div>
  `;

  document.getElementById('campaign-back').addEventListener('click', () => {
    if (window.history.length > 1) window.history.back();
    else window.location.hash = '#/ads';
  });

  const pg = document.getElementById('campaign-projects');
  if (pg) projects.forEach(p => pg.appendChild(createProjectCard(p)));

  observeReveal();
  window.scrollTo(0, 0);
}
