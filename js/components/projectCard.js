// projectCard.js — Reusable YouTube-style 16:9 card with auto thumbnail extraction
import { formatCategoryLabel } from '../data.js';

function extractYTId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&?/]+)/);
  return m ? m[1] : null;
}

function getThumb(project) {
  // Priority: uploaded poster > YouTube auto-extract > empty
  if (project.poster && !project.poster.startsWith('https://img.youtube.com')) {
    return project.poster;
  }
  const ytId = extractYTId(project.videoUrl || '');
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  return project.poster || '';
}

export function createProjectCard(project) {
  const card = document.createElement('a');
  card.href = `#/project/${project.id}`;
  card.className = 'project-card';
  card.id = `card-${project.id}`;
  const thumb = getThumb(project);
  card.innerHTML = `
    <div class="project-card__poster">
      ${thumb ? `<img src="${thumb}" alt="${project.title}" loading="lazy" onerror="this.style.display='none'">` : '<div class="project-card__poster-placeholder"></div>'}
    </div>
    <div class="project-card__info">
      <div class="project-card__title">${project.title}</div>
      <div class="project-card__meta">${project.year}${project.duration ? ' · ' + project.duration : ''}</div>
      <div class="project-card__cats">
        ${(project.categories || []).map(c => `<span class="cat-pill">${formatCategoryLabel(c)}</span>`).join('')}
      </div>
    </div>
  `;
  return card;
}
