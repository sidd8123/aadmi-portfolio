// footer.js — Premium Footer with Accent and Social Links
export function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;

  el.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer__content" style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
          <div class="footer__logo">
            <img src="assets/logo/aadmi-logo.svg" alt="AADMI" class="nav__logo-img" style="height: 28px; width: auto;">
          </div>
          
          <div class="footer__socials" style="display: flex; gap: 1.5rem;">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="footer__link" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer" class="footer__link" aria-label="Vimeo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 12a11.02 11.02 0 0 1-5.5 9.5L12 21.5l-5.5-1A11.02 11.02 0 0 1 1 12a11.02 11.02 0 0 1 5.5-9.5L12 1.5l5.5 1A11.02 11.02 0 0 1 23 12z"/></svg>
            </a>
            <a href="mailto:hello@aadmi.online" class="footer__link" aria-label="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </a>
          </div>

          <div class="footer__links" style="display: flex; gap: 1.5rem; font-size: 0.8125rem; font-weight: 500;">
            <a href="#/work" class="footer__link">Work</a>
            <a href="#/di" class="footer__link">DI / Color</a>
            <a href="#/creators" class="footer__link">Team</a>
            <a href="#/about" class="footer__link">About</a>
            <a href="#/awards" class="footer__link">Awards</a>
          </div>

          <p class="footer__text" style="margin-top: 0.5rem;">
            &copy; ${new Date().getFullYear()} AADMI. All rights reserved. &nbsp;·&nbsp;
            <a href="mailto:hello@aadmi.online" class="footer__link" style="color: var(--accent);">hello@aadmi.online</a>
          </p>
        </div>
      </div>
    </footer>
  `;
}
