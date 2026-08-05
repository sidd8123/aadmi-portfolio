// videoPlayer.js — Modal video player overlay

let isOpen = false;

export function initVideoModal() {
  const el = document.getElementById('video-modal');
  el.innerHTML = `
    <div class="video-overlay" id="video-overlay">
      <button class="video-overlay__close" id="video-close" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="video-overlay__player" id="video-player"></div>
    </div>
  `;

  document.getElementById('video-close').addEventListener('click', closeVideo);
  document.getElementById('video-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'video-overlay') closeVideo();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeVideo();
  });
}

export function openVideo(url) {
  const overlay = document.getElementById('video-overlay');
  const player = document.getElementById('video-player');
  // Convert YouTube watch URLs to embed
  let embedUrl = url;
  if (url.includes('youtube.com/watch')) {
    const vid = new URL(url).searchParams.get('v');
    embedUrl = `https://www.youtube.com/embed/${vid}?autoplay=1`;
  } else if (url.includes('youtu.be/')) {
    const vid = url.split('youtu.be/')[1].split('?')[0];
    embedUrl = `https://www.youtube.com/embed/${vid}?autoplay=1`;
  } else if (!url.includes('autoplay')) {
    embedUrl = url + (url.includes('?') ? '&' : '?') + 'autoplay=1';
  }
  player.innerHTML = `<iframe src="${embedUrl}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
  overlay.classList.add('video-overlay--open');
  document.body.style.overflow = 'hidden';
  isOpen = true;
}

export function closeVideo() {
  const overlay = document.getElementById('video-overlay');
  const player = document.getElementById('video-player');
  overlay.classList.remove('video-overlay--open');
  document.body.style.overflow = '';
  player.innerHTML = '';
  isOpen = false;
}
