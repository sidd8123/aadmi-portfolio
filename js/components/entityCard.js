// entityCard.js — Card component for Studios and Production Houses

export function createEntityCard(entity) {
  const card = document.createElement('a');
  card.href = `#/entity/${entity.id}`;
  card.className = 'entity-card';
  card.id = `entity-card-${entity.id}`;

  const logoSrc = entity.photo || (entity.logo && (entity.logo.white || entity.logo.color)) || '';
  const typeLabel = entity.type === 'studio' ? 'Studio' : 'Production House';
  const memberCount = (entity.members || []).length;

  card.innerHTML = `
    <div class="entity-card__logo">
      ${logoSrc
        ? `<img src="${logoSrc}" alt="${entity.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'entity-card__initial\\'>${entity.name.charAt(0)}</div>'">`
        : `<div class="entity-card__initial">${entity.name.charAt(0)}</div>`}
    </div>
    <div class="entity-card__body">
      <div class="entity-card__type">${typeLabel}</div>
      <div class="entity-card__name">${entity.name}</div>
      ${entity.tagline ? `<div class="entity-card__tagline">${entity.tagline}</div>` : ''}
      <div class="entity-card__stats">
        ${memberCount > 0 ? `<span>${memberCount} member${memberCount !== 1 ? 's' : ''}</span>` : ''}
      </div>
    </div>
  `;
  return card;
}
