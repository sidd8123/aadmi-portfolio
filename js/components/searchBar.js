// searchBar.js — Global search with instant results dropdown
import { searchAll } from '../data.js';

export function createSearchBar() {
  const wrapper = document.createElement('div');
  wrapper.className = 'search-global';
  wrapper.innerHTML = `
    <div class="search-global__input-wrap">
      <svg class="search-global__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" class="search-global__input" placeholder="Search projects, people, studios..." id="global-search-input">
    </div>
    <div class="search-global__results" id="global-search-results" style="display:none;"></div>
  `;

  const input = wrapper.querySelector('#global-search-input');
  const resultsEl = wrapper.querySelector('#global-search-results');
  let debounce = null;

  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const q = input.value.trim();
      if (q.length < 2) { resultsEl.style.display = 'none'; return; }
      const results = searchAll(q);
      renderResults(resultsEl, results);
    }, 200);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { input.value = ''; resultsEl.style.display = 'none'; }
    if (e.key === 'Enter') {
      e.preventDefault();
      window.location.hash = `#/search?q=${encodeURIComponent(input.value.trim())}`;
      resultsEl.style.display = 'none';
    }
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) resultsEl.style.display = 'none';
  });

  return wrapper;
}

function renderResults(el, results) {
  const { projects, people, entities, campaigns } = results;
  const total = projects.length + people.length + entities.length + campaigns.length;
  if (total === 0) {
    el.innerHTML = '<div class="search-global__empty">No results found</div>';
    el.style.display = 'block';
    return;
  }

  let html = '';

  if (projects.length > 0) {
    html += `<div class="search-global__group"><div class="search-global__group-title">Projects</div>`;
    projects.slice(0, 5).forEach(p => {
      html += `<a href="#/project/${p.id}" class="search-global__item">
        <span class="search-global__item-name">${p.title}</span>
        <span class="search-global__item-meta">${p.year}</span>
      </a>`;
    });
    html += `</div>`;
  }

  if (people.length > 0) {
    html += `<div class="search-global__group"><div class="search-global__group-title">People</div>`;
    people.slice(0, 5).forEach(p => {
      html += `<a href="#/person/${p.id}" class="search-global__item">
        <span class="search-global__item-name">${p.name}</span>
        <span class="search-global__item-meta">${p.title}</span>
      </a>`;
    });
    html += `</div>`;
  }

  if (entities.length > 0) {
    html += `<div class="search-global__group"><div class="search-global__group-title">Studios & Companies</div>`;
    entities.slice(0, 5).forEach(e => {
      html += `<a href="#/entity/${e.id}" class="search-global__item">
        <span class="search-global__item-name">${e.name}</span>
        <span class="search-global__item-meta">${e.type === 'studio' ? 'Studio' : 'Production House'}</span>
      </a>`;
    });
    html += `</div>`;
  }

  if (campaigns.length > 0) {
    html += `<div class="search-global__group"><div class="search-global__group-title">Campaigns</div>`;
    campaigns.slice(0, 3).forEach(c => {
      html += `<a href="#/campaign/${c.id}" class="search-global__item">
        <span class="search-global__item-name">${c.name}</span>
        <span class="search-global__item-meta">${c.client}</span>
      </a>`;
    });
    html += `</div>`;
  }

  el.innerHTML = html;
  el.style.display = 'block';
}
