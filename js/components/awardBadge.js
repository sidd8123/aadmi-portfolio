// awardBadge.js — Reusable award display component

export function createAwardBadge(award) {
  const el = document.createElement('div');
  el.className = `award-badge ${award.type === 'win' ? 'award-badge--win' : 'award-badge--nom'}`;
  el.innerHTML = `
    <div class="award-badge__icon">${award.type === 'win' ? '🏆' : '⭐'}</div>
    <div class="award-badge__info">
      <div class="award-badge__name">${award.name}</div>
      <div class="award-badge__festival">${award.festival}${award.year ? ` · ${award.year}` : ''}</div>
      ${award.projectTitle ? `<div class="award-badge__project">for "${award.projectTitle}"</div>` : ''}
    </div>
    ${award.url ? `<a href="${award.url}" target="_blank" rel="noopener" class="award-badge__link" title="View on festival site">↗</a>` : ''}
  `;
  return el;
}

export function createAwardsSection(awards, title = 'Awards & Recognition') {
  if (!awards || awards.length === 0) return null;
  const section = document.createElement('div');
  section.className = 'awards-section reveal';
  section.innerHTML = `
    <div class="section__header">
      <p class="t-label">Recognition</p>
      <h2 class="t-section" style="font-size:1.5rem;">${title}</h2>
    </div>
    <div class="awards-grid"></div>
  `;
  const grid = section.querySelector('.awards-grid');
  awards.forEach(a => grid.appendChild(createAwardBadge(a)));
  return section;
}
