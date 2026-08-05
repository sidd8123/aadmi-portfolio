// di.js — Bhantook DI Color Grade Before/After Gallery
import { getProjectById } from '../data.js';
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
    <div class="di-compare reveal" style="animation-delay: ${0.08 * (i + 1)}s">
      <div class="di-compare__wrap" data-idx="${i}">
        <img class="di-compare__after" src="${pair.after}" alt="After DI" loading="lazy">
        <div class="di-compare__before" style="--pos: 50%;">
          <img src="${pair.before}" alt="Before DI" loading="lazy">
        </div>
        <div class="di-compare__handle" style="left: 50%;">
          <div class="di-compare__handle-line"></div>
          <div class="di-compare__handle-knob">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </div>
          <div class="di-compare__handle-line"></div>
        </div>
        <div class="di-compare__label di-compare__label--before">RAW</div>
        <div class="di-compare__label di-compare__label--after">GRADED</div>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="page-enter">
      <!-- Hero -->
      <section class="di-hero">
        <div class="di-hero__bg">
          <img src="assets/di/bhantook/after/after_03.jpg" alt="">
        </div>
        <div class="di-hero__content">
          <p class="t-label reveal">DI / Color Grade</p>
          <h1 class="di-hero__title reveal">Bhantook</h1>
          <p class="di-hero__sub reveal">Before & After — 14 Shots</p>
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

  // Initialise all sliders with pointer/touch drag
  requestAnimationFrame(() => initSliders());
}

function initSliders() {
  document.querySelectorAll('.di-compare__wrap').forEach(wrap => {
    const before = wrap.querySelector('.di-compare__before');
    const handle = wrap.querySelector('.di-compare__handle');
    let dragging = false;

    function updatePos(clientX) {
      const rect = wrap.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      before.style.setProperty('--pos', pct + '%');
      handle.style.left = pct + '%';
    }

    wrap.addEventListener('pointerdown', (e) => {
      dragging = true;
      wrap.setPointerCapture(e.pointerId);
      updatePos(e.clientX);
    });
    wrap.addEventListener('pointermove', (e) => {
      if (dragging) updatePos(e.clientX);
    });
    wrap.addEventListener('pointerup', () => { dragging = false; });
    wrap.addEventListener('pointercancel', () => { dragging = false; });

    // Keyboard accessibility
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('role', 'slider');
    wrap.setAttribute('aria-label', 'Before and after comparison');
    wrap.addEventListener('keydown', (e) => {
      const rect = wrap.getBoundingClientRect();
      const current = parseFloat(before.style.getPropertyValue('--pos')) || 50;
      if (e.key === 'ArrowLeft') updatePos(rect.left + (current - 2) / 100 * rect.width);
      if (e.key === 'ArrowRight') updatePos(rect.left + (current + 2) / 100 * rect.width);
    });
  });
}
