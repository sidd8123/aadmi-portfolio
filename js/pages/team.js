// team.js — Team member grid
import { getPeople } from '../data.js';
import { createPersonCard } from '../components/personCard.js';
import { observeReveal } from '../app.js';

export function renderTeam(container) {
  const people = getPeople();

  container.innerHTML = `
    <div class="page-enter">
      <section class="section" style="padding-top: calc(var(--nav-height) + 2rem);">
        <div class="container">
          <div class="section__header reveal">
            <p class="t-label">The People</p>
            <h1 class="t-section">Our Team</h1>
          </div>
          <div class="person-grid stagger" id="team-full-grid"></div>
        </div>
      </section>
    </div>
  `;

  const grid = document.getElementById('team-full-grid');
  people.forEach(p => grid.appendChild(createPersonCard(p)));
  observeReveal();
}
