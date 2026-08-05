// app.js — Router, app shell, initialization [v6.0 — Theme toggle, accent color]
import { loadData } from './data.js';
import { renderFooter } from './components/footer.js';
import { initVideoModal } from './components/videoPlayer.js';
import { renderHome } from './pages/home.js';
import { renderWork } from './pages/work.js';
import { renderProject } from './pages/project.js';
import { renderIndividuals } from './pages/artists.js';
import { renderOrganizations } from './pages/studios.js';
import { renderPerson } from './pages/person.js';
import { renderDI } from './pages/di.js';
import { renderEntity } from './pages/entity.js';
import { renderCampaign } from './pages/campaign.js';
import { renderAwards } from './pages/awards.js';
import { renderSearch } from './pages/search.js';

// ============ SCROLL REVEAL ============
let revealObserver = null;

export function observeReveal() {
  // Disconnect previous observer to avoid stacking
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(
          entry.target.classList.contains('stagger') ? 'stagger--visible' : 'reveal--visible'
        );
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .stagger').forEach(el => revealObserver.observe(el));
}

// ============ ROUTE MATCHING ============
function matchRoute(hash) {
  const h = hash || '#/';
  if (h === '#/' || h === '#' || h === '') return { page: 'home' };

  // Work routes
  if (h === '#/work') return { page: 'work', category: null };
  if (h === '#/ads') return { page: 'work', category: 'ads' };

  // Studio routes
  if (h === '#/studios') return { page: 'organizations', type: null };
  if (h === '#/production-houses') return { page: 'organizations', type: 'production_house' };
  if (h === '#/post-production') return { page: 'organizations', type: 'post_production' };
  if (h === '#/animation-studios') return { page: 'organizations', type: 'animation_studio' };

  // Creator routes
  if (h === '#/creators') return { page: 'individuals', type: null };
  if (h === '#/artists') return { page: 'individuals', type: 'artist' };
  if (h === '#/directors-dops') return { page: 'individuals', type: 'director_dop' };
  if (h === '#/actors') return { page: 'individuals', type: 'actor' };
  if (h === '#/editors-colorists') return { page: 'individuals', type: 'editor_colorist' };
  if (h === '#/freelancers') return { page: 'individuals', type: 'freelancer' };

  // DI / Color Grade
  if (h === '#/di') return { page: 'di' };

  // Awards
  if (h === '#/awards') return { page: 'awards' };

  // About
  if (h === '#/about') return { page: 'about' };

  let m;

  m = h.match(/^#\/search\?q=(.+)$/);
  if (m) return { page: 'search', query: decodeURIComponent(m[1]) };
  if (h === '#/search') return { page: 'search', query: '' };

  m = h.match(/^#\/work\/(.+)$/);
  if (m) return { page: 'work', category: m[1] };

  m = h.match(/^#\/project\/(.+)$/);
  if (m) return { page: 'project', id: m[1] };

  m = h.match(/^#\/person\/([^?]+)(?:\?filter=(.+))?$/);
  if (m) return { page: 'person', id: m[1], filter: m[2] ? decodeURIComponent(m[2]) : null };

  m = h.match(/^#\/entity\/(.+)$/);
  if (m) return { page: 'entity', id: m[1] };

  m = h.match(/^#\/campaign\/(.+)$/);
  if (m) return { page: 'campaign', id: m[1] };

  return { page: 'home' };
}

// ============ NAV ACTIVE STATES ============
function updateNavState(route) {
  // Desktop nav
  document.querySelectorAll('.nav__link[data-route]').forEach(link => {
    link.classList.remove('nav__link--active');
    const r = link.dataset.route;
    if (r === 'work' && (route.page === 'work' || route.page === 'project')) link.classList.add('nav__link--active');
    else if (r === 'di' && route.page === 'di') link.classList.add('nav__link--active');
    else if (r === 'creators' && (route.page === 'individuals' || route.page === 'person')) link.classList.add('nav__link--active');
    else if (r === 'about' && route.page === 'about') link.classList.add('nav__link--active');
  });

  // Mobile bottom nav
  document.querySelectorAll('.bottom-nav__item[data-route]').forEach(item => {
    item.classList.remove('bottom-nav__item--active');
    const r = item.dataset.route;
    if (r === 'home' && route.page === 'home') item.classList.add('bottom-nav__item--active');
    else if (r === 'work' && (route.page === 'work' || route.page === 'project')) item.classList.add('bottom-nav__item--active');
    else if (r === 'di' && route.page === 'di') item.classList.add('bottom-nav__item--active');
    else if (r === 'creators' && (route.page === 'individuals' || route.page === 'person')) item.classList.add('bottom-nav__item--active');
    else if (r === 'about' && route.page === 'about') item.classList.add('bottom-nav__item--active');
  });
}

// ============ ABOUT PAGE ============
function renderAbout(container) {
  container.innerHTML = `
    <div class="page-enter">
      <section class="section" style="padding-top: calc(var(--nav-height) + 2rem);">
        <div class="container" style="max-width: 680px;">
          <div class="section__header reveal">
            <p class="t-label">About</p>
            <h1 class="t-section">AADMI</h1>
          </div>
          <div class="reveal" style="animation-delay: 0.2s;">
            <p class="t-body" style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 1.5rem;">
              AADMI is an AV production house built on the belief that great stories demand great craft. From concept through final color, we bring together directors, animators, colorists, and producers who care deeply about the work.
            </p>
            <p class="t-body" style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 1.5rem;">
              Our portfolio spans short films, feature-length narratives, music videos, documentaries, and specialized DI/color grading. Every project is an opportunity to push the boundaries of visual storytelling.
            </p>
            <p class="t-body" style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 2rem;">
              We don't just make content — we make it matter.
            </p>
            <a href="mailto:hello@aadmi.online" class="detail__watch-btn" style="display: inline-flex;">
              Get in Touch
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  `;
  observeReveal();
}

// ============ NAV SCROLL EFFECT ============
function handleNavScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ============ SPOTLIGHT CLEANUP ============
let spotlightInterval = null;

// ============ MAIN ROUTER ============
async function navigate() {
  const container = document.getElementById('app');
  const route = matchRoute(window.location.hash);

  // Clean up previous spotlight interval
  if (spotlightInterval) {
    clearInterval(spotlightInterval);
    spotlightInterval = null;
  }

  updateNavState(route);

  switch (route.page) {
    case 'home': renderHome(container); break;
    case 'work': renderWork(container, route.category); break;
    case 'project': renderProject(container, route.id); break;
    case 'individuals': renderIndividuals(container, route.type); break;
    case 'organizations': renderOrganizations(container, route.type); break;
    case 'person': renderPerson(container, route.id, route.filter); break;
    case 'entity': renderEntity(container, route.id); break;
    case 'campaign': renderCampaign(container, route.id); break;
    case 'awards': renderAwards(container); break;
    case 'search': renderSearch(container, route.query); break;
    case 'di': renderDI(container); break;
    case 'about': renderAbout(container); break;
    default: renderHome(container);
  }
}

// Export for home.js to set the interval reference
export function setSpotlightInterval(intervalId) {
  spotlightInterval = intervalId;
}

// ============ INITIALIZE ============
async function init() {
  handleNavScroll();

  try {
    await loadData();
    initVideoModal();
    renderFooter();
    window.addEventListener('hashchange', navigate);
    navigate();
  } catch (err) {
    console.error('Failed to initialize:', err);
    document.getElementById('app').innerHTML = `
      <div class="empty-state" style="min-height: 80vh;">
        <div class="empty-state__icon">⚠</div>
        <p class="empty-state__text">Failed to load data. Please check your connection.</p>
      </div>
    `;
  }
}

init();
