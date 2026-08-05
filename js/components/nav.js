// nav.js — Minimal fixed navigation [v2.2]
// Nav links are now baked into index.html for cache-reliability.
// This function just handles active state, scroll effect, and mobile menu.

export function renderNav(currentRoute) {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  // Active state
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#/') link.classList.toggle('nav__link--active', currentRoute === '#/' || currentRoute === '');
    else link.classList.toggle('nav__link--active', currentRoute.startsWith(href));
  });

  // Scroll effect
  const onScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  window.removeEventListener('scroll', window.__navScroll);
  window.__navScroll = onScroll;
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle (Listener setup once)
  const btn = document.getElementById('nav-menu-btn');
  const links_el = document.getElementById('nav-links');
  
  if (btn && links_el && !btn.dataset.init) {
    btn.dataset.init = 'true';
    
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('nav__menu-btn--open');
      links_el.classList.toggle('nav__links--open');
    });

    links_el.addEventListener('click', (e) => {
      const dropToggle = e.target.closest('.nav__dropdown-toggle');
      const link = e.target.closest('.nav__link');

      if (dropToggle && window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        dropToggle.closest('.nav__dropdown').classList.toggle('open');
      } else if (link && link.getAttribute('href')) {
        btn.classList.remove('nav__menu-btn--open');
        links_el.classList.remove('nav__links--open');
        links_el.querySelectorAll('.nav__dropdown').forEach(d => d.classList.remove('open'));
      }
    });

    document.addEventListener('click', (e) => {
      if (!links_el.contains(e.target) && !btn.contains(e.target)) {
        btn.classList.remove('nav__menu-btn--open');
        links_el.classList.remove('nav__links--open');
      }
    });
  }
}
