// artists.js — Individuals grid with SOP-aligned creator type filtering
import { getPeople, getPeopleByType } from '../data.js';
import { createPersonCard } from '../components/personCard.js';
import { observeReveal } from '../app.js';

export function renderIndividuals(container, type) {
  let people;
  let title;
  let label = 'Our Team';

  switch (type) {
    case 'director_dop':
      title = 'Directors & DOPs';
      // Filter people whose title/role includes director or DOP
      people = getPeople().filter(p =>
        /director|dop|cinematograph/i.test(p.title || '')
      );
      break;
    case 'actor':
      title = 'Actors';
      people = getPeople().filter(p =>
        /actor|actress|performer/i.test(p.title || '')
      );
      break;
    case 'editor_colorist':
      title = 'Editors & Colorists';
      people = getPeople().filter(p =>
        /editor|colorist|di |color/i.test(p.title || '')
      );
      break;
    case 'freelancer':
      title = 'Team & Collaborators';
      people = getPeopleByType('freelancer');
      if (people.length === 0) people = getPeople(); // Show all if no freelancer type
      break;
    case 'artist':
    default:
      title = 'Our Team';
      people = getPeople();
      break;
  }

  container.innerHTML = `
    <div class="page-enter">
      <section class="section" style="padding-top: calc(var(--nav-height) + 2rem);">
        <div class="container">
          <div class="section__header reveal">
            <p class="t-label">${label}</p>
            <h1 class="t-section">${title}</h1>
          </div>
          <div class="person-grid stagger" id="ind-grid"></div>
          ${people.length === 0 ? '<div class="empty-state"><p class="empty-state__text">No ' + title.toLowerCase() + ' found yet.</p></div>' : ''}
        </div>
      </section>
    </div>
  `;

  const grid = document.getElementById('ind-grid');
  people.forEach(p => grid.appendChild(createPersonCard(p)));
  observeReveal();
}
