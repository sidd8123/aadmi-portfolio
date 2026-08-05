// home.js — Platform home with spotlight hero, search, carousels, and featured creators
import { getFeaturedProjects, getProjects, getPeople, getEntities, getCampaigns, formatCategoryLabel, getAllAwards } from '../data.js';
import { createProjectCard } from '../components/projectCard.js';
import { createPersonCard } from '../components/personCard.js';
import { createEntityCard } from '../components/entityCard.js';
import { createSearchBar } from '../components/searchBar.js';
import { openVideo } from '../components/videoPlayer.js';
import { observeReveal } from '../app.js';

function getBackdrop(p) {
  if (p.backdrop) return p.backdrop;
  if (p.poster && !p.poster.startsWith('https://img.youtube.com')) return p.poster;
  const m = (p.videoUrl||'').match(/embed\/([^?&]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/maxresdefault.jpg` : (p.poster || '');
}

export function renderHome(container) {
  const featured = getFeaturedProjects().slice(0, 5);
  const allProjects = getProjects();
  const people = getPeople();
  const entities = getEntities().filter(e => e.id === 'aadmi-productions');
  const campaigns = getCampaigns();
  const awards = getAllAwards();

  // Group projects by category for carousels
  const catMap = {};
  allProjects.forEach(p => {
    (p.categories || []).forEach(c => {
      if (!catMap[c]) catMap[c] = [];
      catMap[c].push(p);
    });
  });

  // Build spotlight slides HTML
  const slidesHtml = featured.map((p, i) => `
    <div class="spotlight__slide ${i === 0 ? 'spotlight__slide--active' : ''}" data-idx="${i}">
      <div class="spotlight__bg"><img src="${getBackdrop(p)}" alt="" loading="${i === 0 ? 'eager' : 'lazy'}"></div>
      <div class="spotlight__vignette"></div>
      <div class="spotlight__content">
        ${p.titleImage
          ? `<img src="${p.titleImage}" alt="${p.title}" class="spotlight__title-logo">`
          : `<div class="spotlight__title-text">${p.title}</div>`}
        <div class="spotlight__meta">
          <span>${p.year}</span>
          ${p.duration ? `<span>·</span><span>${p.duration}</span>` : ''}
          <span>·</span>
          ${p.categories.map(c => `<span>${formatCategoryLabel(c)}</span>`).join('<span>·</span>')}
        </div>
        <div class="spotlight__desc">${p.description}</div>
        <div class="spotlight__actions">
          ${p.videoUrl && p.status !== 'private' ? `<button class="spotlight__btn spotlight__btn--play" data-video="${p.videoUrl}" data-external="${p.externalLink||false}">
            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg> Watch
          </button>` : ''}
          <a href="#/project/${p.id}" class="spotlight__btn spotlight__btn--info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> More Info
          </a>
        </div>
      </div>
    </div>
  `).join('');

  const dotsHtml = featured.map((_, i) =>
    `<div class="spotlight__dot ${i === 0 ? 'spotlight__dot--active' : ''}" data-idx="${i}"></div>`
  ).join('');

  // Build carousel rows
  const carouselHtml = Object.entries(catMap).map(([slug, projects]) => `
    <div class="carousel-section">
      <div class="carousel-header">
        <div class="carousel-header__title">${formatCategoryLabel(slug)}</div>
        <a href="#/work/${slug}" class="carousel-header__link">See All →</a>
      </div>
      <div class="carousel-track" id="carousel-${slug}"></div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="page-enter">
      <div class="spotlight" id="spotlight">${slidesHtml}${featured.length > 1 ? `<div class="spotlight__dots">${dotsHtml}</div>` : ''}</div>

      <div class="home-search-bar reveal" id="home-search-slot"></div>

      ${campaigns.length > 0 ? `
        <div class="carousel-section">
          <div class="carousel-header">
            <div class="carousel-header__title">Ad Campaigns</div>
            <a href="#/ads" class="carousel-header__link">See All →</a>
          </div>
          <div class="carousel-track" id="carousel-campaigns"></div>
        </div>
      ` : ''}

      ${carouselHtml}

      ${entities.length > 0 ? `
        <section class="section" style="border-top: 1px solid var(--border);">
          <div class="container">
            <div class="section__header reveal"><p class="t-label">Production Studio</p><h2 class="t-section">AADMI Productions</h2></div>
            <div class="entity-grid stagger" id="entities-grid"></div>
          </div>
        </section>
      ` : ''}

      <section class="section" style="border-top: 1px solid var(--border);">
        <div class="container">
          <div class="section__header reveal"><p class="t-label">Our Team</p><h2 class="t-section">The People Behind AADMI</h2></div>
          <div class="person-grid stagger" id="team-grid"></div>
        </div>
      </section>
    </div>
  `;

  // Inject search bar
  const searchSlot = document.getElementById('home-search-slot');
  if (searchSlot) searchSlot.appendChild(createSearchBar());

  // Populate campaign carousel
  const ccTrack = document.getElementById('carousel-campaigns');
  if (ccTrack) {
    campaigns.forEach(c => {
      const card = document.createElement('a');
      card.href = `#/campaign/${c.id}`;
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-card__poster"><img src="${c.poster || ''}" alt="${c.name}" loading="lazy"></div>
        <div class="project-card__info">
          <div class="project-card__title">${c.name}</div>
          <div class="project-card__meta">${c.client} · ${c.year}</div>
          <div class="project-card__cats"><span class="cat-pill">Campaign</span></div>
        </div>
      `;
      ccTrack.appendChild(card);
    });
  }

  // Populate carousel tracks
  Object.entries(catMap).forEach(([slug, projects]) => {
    const track = document.getElementById(`carousel-${slug}`);
    if (track) projects.forEach(p => track.appendChild(createProjectCard(p)));
  });

  // Populate entities grid
  const eg = document.getElementById('entities-grid');
  if (eg) entities.forEach(e => eg.appendChild(createEntityCard(e)));

  // Populate featured creators
  const tg = document.getElementById('team-grid');
  people.forEach(p => tg.appendChild(createPersonCard(p)));

  // Spotlight rotation
  if (featured.length > 1) {
    let current = 0;
    const slides = document.querySelectorAll('.spotlight__slide');
    const dots = document.querySelectorAll('.spotlight__dot');
    const goTo = (idx) => {
      slides.forEach(s => s.classList.remove('spotlight__slide--active'));
      dots.forEach(d => d.classList.remove('spotlight__dot--active'));
      slides[idx]?.classList.add('spotlight__slide--active');
      dots[idx]?.classList.add('spotlight__dot--active');
      current = idx;
    };
    dots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.idx))));
    setInterval(() => goTo((current + 1) % featured.length), 8000);
  }

  // Watch buttons
  document.querySelectorAll('.spotlight__btn--play').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.external === 'true') window.open(btn.dataset.video, '_blank');
      else openVideo(btn.dataset.video);
    });
  });

  observeReveal();
}
