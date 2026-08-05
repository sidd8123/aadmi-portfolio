// di.js — Bhantook DI Color Grade Before/After Gallery
import { observeReveal } from '../app.js';

const BHANTOOK_PAIRS = [
  { before: 'assets/di/bhantook/before/before_01.jpg', after: 'assets/di/bhantook/after/after_01.jpg' },
  { before: 'assets/di/bhantook/before/before_02.jpg', after: 'assets/di/bhantook/after/after_02.jpg' },
  { before: 'assets/di/bhantook/before/before_03.jpg', after: 'assets/di/bhantook/after/after_03.jpg' },
  { before: 'assets/di/bhantook/before/before_04.jpg', after: 'assets/di/bhantook/after/after_04.jpg' },
  { before: 'assets/di/bhantook/before/before_05.jpg', after: 'assets/di/bhantook/after/after_05.jpg' },
  { before: 'assets/di/bhantook/before/before_06.jpg', after: 'assets/di/bhantook/after/after_06.jpg' },
  { before: 'assets/di/bhantook/before/before_07.jpg', after: 'assets/di/bhantook/after/after_07.jpg' },
  { before: 'assets/di/bhantook/before/before_08.jpg', after: 'assets/di/bhantook/after/after_08.jpg' },
  { before: 'assets/di/bhantook/before/before_09.jpg', after: 'assets/di/bhantook/after/after_09.jpg' },
  { before: 'assets/di/bhantook/before/before_10.jpg', after: 'assets/di/bhantook/after/after_10.jpg' },
  { before: 'assets/di/bhantook/before/before_11.jpg', after: 'assets/di/bhantook/after/after_11.jpg' },
  { before: 'assets/di/bhantook/before/before_12.jpg', after: 'assets/di/bhantook/after/after_12.jpg' },
  { before: 'assets/di/bhantook/before/before_13.jpg', after: 'assets/di/bhantook/after/after_13.jpg' },
  { before: 'assets/di/bhantook/before/before_14.jpg', after: 'assets/di/bhantook/after/after_14.jpg' },
];

export function renderDI(container) {
  let slidersHtml = BHANTOOK_PAIRS.map((pair, i) => `
    <div class="di-slider reveal" style="--pos: 50%; animation-delay: ${0.05 * (i + 1)}s">
      <img class="di-slider__after" src="${pair.after}" alt="Graded DI" loading="lazy">
      <div class="di-slider__before">
        <img src="${pair.before}" alt="RAW DI" loading="lazy">
      </div>
      <input type="range" min="0" max="100" value="50" class="di-slider__range"
             aria-label="Shot ${i + 1} RAW vs GRADED DI Comparison"
             oninput="this.parentElement.style.setProperty('--pos', this.value + '%')">
      <div class="di-slider__handle">
        <div class="di-slider__handle-knob">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
      <div class="di-slider__label di-slider__label--before">RAW</div>
      <div class="di-slider__label di-slider__label--after">GRADED</div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="page-enter">
      <!-- Hero -->
      <section class="di-hero">
        <div class="di-hero__bg">
          <img src="assets/di/bhantook/after/after_03.jpg" alt="Bhantook Color Grade">
        </div>
        <div class="di-hero__content">
          <p class="t-label reveal">DI / Color Grade</p>
          <h1 class="di-hero__title reveal">Bhantook</h1>
          <p class="di-hero__sub reveal">Before & After — 14 Shots Showcase</p>
        </div>
      </section>

      <!-- Gallery -->
      <section class="section">
        <div class="container" style="max-width: 1100px;">
          <div class="di-grid">
            ${slidersHtml}
          </div>
        </div>
      </section>

      <!-- Back to project -->
      <section class="section" style="padding-top: 0;">
        <div class="container" style="text-align: center;">
          <a href="#/project/bhantook" class="btn-back reveal">← View Full Project</a>
        </div>
      </section>
    </div>
  `;

  observeReveal();
  window.scrollTo(0, 0);

  // Setup fallback event listeners for touch/pointer drag
  requestAnimationFrame(() => initSliders());
}

function initSliders() {
  document.querySelectorAll('.di-slider').forEach(slider => {
    const range = slider.querySelector('.di-slider__range');
    if (!range) return;

    // Direct input event update
    range.addEventListener('input', (e) => {
      slider.style.setProperty('--pos', e.target.value + '%');
    });

    // Touch & pointer dragging fallback
    let isDragging = false;
    const updateFromPointer = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      slider.style.setProperty('--pos', pct + '%');
      range.value = pct;
    };

    slider.addEventListener('pointerdown', (e) => {
      isDragging = true;
      updateFromPointer(e.clientX);
    });

    slider.addEventListener('pointermove', (e) => {
      if (isDragging) updateFromPointer(e.clientX);
    });

    const stopDragging = () => { isDragging = false; };
    slider.addEventListener('pointerup', stopDragging);
    slider.addEventListener('pointercancel', stopDragging);
  });
}
