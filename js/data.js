// data.js — Studio Portfolio Data Layer (Local JSON & Firestore Support)

import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let projectsCache = null;
let peopleCache = null;
let entitiesCache = null;
let campaignsCache = null;

async function loadLocalJsonData() {
  const [pRes, peRes, eRes, cRes] = await Promise.all([
    fetch('data/projects.json'),
    fetch('data/people.json'),
    fetch('data/entities.json'),
    fetch('data/campaigns.json')
  ]);

  projectsCache = pRes.ok ? await pRes.json() : [];
  peopleCache = peRes.ok ? await peRes.json() : [];
  entitiesCache = eRes.ok ? await eRes.json() : [];
  campaignsCache = cRes.ok ? await cRes.json() : [];
}

export async function loadData() {
  if (projectsCache && peopleCache && entitiesCache && campaignsCache) return;

  try {
    // Attempt Firestore load
    const [pSnap, peSnap, eSnap, cSnap] = await Promise.all([
      getDocs(collection(db, 'projects')),
      getDocs(collection(db, 'people')),
      getDocs(collection(db, 'entities')),
      getDocs(collection(db, 'campaigns'))
    ]);

    if (!pSnap.empty) {
      projectsCache = pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      peopleCache = peSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      entitiesCache = eSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      campaignsCache = cSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      await loadLocalJsonData();
    }
  } catch (err) {
    console.warn("Firestore unavailable, loading local static JSON data:", err);
    await loadLocalJsonData();
  }

  // Sort projects by year descending as default
  if (projectsCache) {
    projectsCache.sort((a, b) => (b.year || 0) - (a.year || 0));
  }
}

// Force reload from local JSON / Firestore
export async function reloadData() {
  projectsCache = null;
  peopleCache = null;
  entitiesCache = null;
  campaignsCache = null;
  await loadData();
}

// === Project queries ===
export function getProjects() { return projectsCache || []; }
export function getProjectById(id) { return (projectsCache || []).find(p => p.id === id) || null; }

export function getFeaturedProjects() {
  return (projectsCache || []).filter(p => p.featured && p.status !== 'private');
}

export function getProjectsByCategory(cat) {
  const all = (projectsCache || []).filter(p => p.status !== 'private');
  if (!cat || cat === 'all') return all;
  if (cat === 'film-doc-mv') {
    return all.filter(p =>
      (p.categories || []).includes('short-films') ||
      (p.categories || []).includes('documentaries') ||
      (p.categories || []).includes('music-videos')
    );
  }
  return all.filter(p => (p.categories || []).includes(cat));
}

export function getProjectsByPerson(personId) {
  return (projectsCache || []).filter(p =>
    (p.credits || []).some(c => c.personId === personId)
  );
}

export function getProjectsByEntity(entityId) {
  return (projectsCache || []).filter(p =>
    p.studioId === entityId || p.productionHouseId === entityId
  );
}

export function getProjectsByStatus(status) {
  return (projectsCache || []).filter(p => p.status === status);
}

export function getRoleForPerson(project, personId) {
  const credit = (project.credits || []).find(c => c.personId === personId);
  return credit ? credit.role : '';
}

export function getRelatedProjects(project, limit = 4) {
  return (projectsCache || [])
    .filter(p => p.id !== project.id && p.status !== 'private' && (p.categories || []).some(c => (project.categories || []).includes(c)))
    .slice(0, limit);
}

export function getAllCategories() {
  const cats = new Set();
  (projectsCache || []).forEach(p => (p.categories || []).forEach(c => cats.add(c)));
  return Array.from(cats).sort();
}

export function formatCategoryLabel(slug) {
  const map = {
    'animation': 'Animation',
    'music-videos': 'Music Videos',
    'short-films': 'Short Films',
    'di-color-grade': 'DI / Color Grade',
    'full-projects': 'Full Projects',
    'documentaries': 'Documentaries',
    'direction': 'Direction',
    'production': 'Production',
    'ads': 'Ads'
  };
  return map[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// === People queries ===
export function getPeople() { return peopleCache || []; }
export function getPersonById(id) { return (peopleCache || []).find(p => p.id === id) || null; }

export function getPeopleByType(profileType) {
  return (peopleCache || []).filter(p => p.profileType === profileType);
}

export function getAffiliatedEntities(personId) {
  const person = getPersonById(personId);
  if (!person || !person.affiliations) return [];
  return person.affiliations.map(id => getEntityById(id)).filter(Boolean);
}

// === Entity queries ===
export function getEntities() { return entitiesCache || []; }
export function getEntityById(id) { return (entitiesCache || []).find(e => e.id === id) || null; }

export function getEntitiesByType(type) {
  return (entitiesCache || []).filter(e => e.type === type);
}

export function getEntityMembers(entityId) {
  const entity = getEntityById(entityId);
  if (!entity || !entity.members) return [];
  return entity.members.map(id => getPersonById(id)).filter(Boolean);
}

// === Campaign queries ===
export function getCampaigns() { return campaignsCache || []; }
export function getCampaignById(id) { return (campaignsCache || []).find(c => c.id === id) || null; }

export function getProjectsForCampaign(campaignId) {
  const campaign = getCampaignById(campaignId);
  if (!campaign || !campaign.projectIds) return [];
  return campaign.projectIds.map(id => getProjectById(id)).filter(Boolean);
}

export function getCampaignForProject(projectId) {
  return (campaignsCache || []).find(c => (c.projectIds || []).includes(projectId)) || null;
}

// === Award queries ===
export function getAwardsForProject(projectId) {
  const project = getProjectById(projectId);
  return project ? (project.awards || []) : [];
}

export function getAwardsForPerson(personId) {
  const projects = getProjectsByPerson(personId);
  const awards = [];
  projects.forEach(p => {
    (p.awards || []).forEach(a => {
      awards.push({ ...a, projectId: p.id, projectTitle: p.title });
    });
  });
  return awards;
}

export function getAwardsForEntity(entityId) {
  const projects = getProjectsByEntity(entityId);
  const awards = [];
  projects.forEach(p => {
    (p.awards || []).forEach(a => {
      awards.push({ ...a, projectId: p.id, projectTitle: p.title });
    });
  });
  return awards;
}

export function getAllAwards() {
  const awards = [];
  (projectsCache || []).forEach(p => {
    (p.awards || []).forEach(a => {
      awards.push({ ...a, projectId: p.id, projectTitle: p.title });
    });
  });
  return awards;
}

// === Search ===
export function searchAll(query) {
  if (!query || query.length < 2) return { projects: [], people: [], entities: [], campaigns: [] };
  const q = query.toLowerCase();

  const projects = (projectsCache || []).filter(p =>
    (p.title || '').toLowerCase().includes(q) ||
    (p.description || '').toLowerCase().includes(q) ||
    (p.autoTags || []).some(t => t.includes(q))
  ).slice(0, 10);

  const people = (peopleCache || []).filter(p =>
    (p.name || '').toLowerCase().includes(q) ||
    (p.title || '').toLowerCase().includes(q)
  ).slice(0, 10);

  const entities = (entitiesCache || []).filter(e =>
    (e.name || '').toLowerCase().includes(q) ||
    (e.tagline || '').toLowerCase().includes(q)
  ).slice(0, 10);

  const campaigns = (campaignsCache || []).filter(c =>
    (c.name || '').toLowerCase().includes(q) ||
    (c.client || '').toLowerCase().includes(q)
  ).slice(0, 10);

  return { projects, people, entities, campaigns };
}
