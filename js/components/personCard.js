// personCard.js — Reusable team member card with SOP verified badge

export function createPersonCard(person, roleOverride) {
  const card = document.createElement('a');
  card.href = `#/person/${person.id}`;
  card.className = 'person-card';
  card.id = `person-card-${person.id}`;
  const verifiedDot = person.status === 'verified' ? '<span class="verified-dot"></span>' : '';
  card.innerHTML = `
    <div class="person-card__photo">
      <img src="${person.photo}" alt="${person.name}" loading="lazy"
           onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:2rem;color:var(--text-tertiary)\\'>${person.name.charAt(0)}</div>'">
    </div>
    <div class="person-card__name">${person.name}${verifiedDot}</div>
    <div class="person-card__role">${roleOverride || person.title}</div>
  `;
  return card;
}
