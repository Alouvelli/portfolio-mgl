/**
 * section3.js
 * Chargement et rendu de la Section 3 — Dynamiques & Archives
 * Mémoires avec filtres, galerie + lightbox, carousel témoignages
 */

import {
  loadMemoires,
  loadAnneesAcademiques,
  loadThematiques,
  loadGalerie,
  loadTemoignages,
  countDocuments,
} from './static-data.js';
import {
  escapeHtml,
  formatDate,
  debounce,
  animateCounter,
  observeWhenVisible,
} from './utils.js';

const ITEMS_PER_PAGE = 12;

let allMemoires   = [];
let filteredMemoires = [];
let currentPage   = 1;
let galleryItems  = [];

document.addEventListener('DOMContentLoaded', () => {
  initSection3();
});

async function initSection3() {
  // Chargement parallèle
  const [memoires, annees, themes, galerie, temoignages] = await Promise.all([
    loadMemoires(),
    loadAnneesAcademiques(),
    loadThematiques(),
    loadGalerie(),
    loadTemoignages(),
  ]);

  allMemoires = memoires;
  filteredMemoires = [...allMemoires];
  galleryItems = galerie;

  populateFilters(annees, themes);
  renderMemoires();
  renderStats();
  renderGalerie(galerie);
  renderTemoignages(temoignages);
  initFilters();
}

/* ===== FILTRES ===== */
function populateFilters(annees, themes) {
  const selectAnnee = document.getElementById('filter-annee');
  const selectTheme = document.getElementById('filter-thematique');

  annees.forEach(a => {
    selectAnnee.innerHTML += `<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`;
  });
  themes.forEach(t => {
    selectTheme.innerHTML += `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`;
  });
}

function initFilters() {
  const selAnnee  = document.getElementById('filter-annee');
  const selStatut = document.getElementById('filter-statut');
  const selTheme  = document.getElementById('filter-thematique');
  const search    = document.getElementById('filter-search');

  const applyFilters = () => {
    const annee   = selAnnee?.value   || '';
    const statut  = selStatut?.value  || '';
    const theme   = selTheme?.value   || '';
    const query   = (search?.value    || '').toLowerCase().trim();

    filteredMemoires = allMemoires.filter(m => {
      if (annee  && m.anneeAcademique !== annee)  return false;
      if (statut && m.statut          !== statut) return false;
      if (theme  && m.thematique      !== theme)  return false;
      if (query) {
        const haystack = [m.titre, m.etudiant, m.encadreur, ...(m.motsCles || [])].join(' ').toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    currentPage = 1;
    renderMemoires();
  };

  selAnnee?.addEventListener ('change', applyFilters);
  selStatut?.addEventListener('change', applyFilters);
  selTheme?.addEventListener ('change', applyFilters);
  search?.addEventListener   ('input', debounce(applyFilters, 300));
}

/* ===== RENDU MÉMOIRES ===== */
const MENTIONS_BADGE = {
  'Passable':   'badge-en-cours',
  'Assez Bien': 'badge-bien',
  'Bien':       'badge-bien',
  'Très Bien':  'badge-tres-bien',
  'Excellent':  'badge-tres-bien',
};

function renderMemoires() {
  const grid     = document.getElementById('memoires-grid');
  const countEl  = document.getElementById('memoires-count');
  const totalAff = filteredMemoires.length;

  // Compteur
  if (countEl) {
    countEl.textContent = `${totalAff} mémoire${totalAff > 1 ? 's' : ''} trouvé${totalAff > 1 ? 's' : ''}`;
  }

  if (!grid) return;

  if (totalAff === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:48px;height:48px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
        <p>Aucun mémoire ne correspond à vos critères de recherche.</p>
      </div>`;
    renderPagination(0);
    return;
  }

  // Pagination
  const start   = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filteredMemoires.slice(start, start + ITEMS_PER_PAGE);

  grid.innerHTML = pageItems.map(m => {
    const badge = m.statut === 'soutenu' ? 'badge-soutenu' : 'badge-en-cours';
    const label = m.statut === 'soutenu' ? '✓ Soutenu' : 'En cours';
    return `
      <div class="card card-memoire animate-fade-in-up">
        <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
          <span class="badge ${badge}">${label}</span>
          ${m.mention ? `<span class="badge ${MENTIONS_BADGE[m.mention] || 'badge-en-cours'}">${escapeHtml(m.mention)}</span>` : ''}
          ${m.thematique ? `<span class="badge badge-section">${escapeHtml(m.thematique)}</span>` : ''}
        </div>
        <div class="memoire-title">${escapeHtml(m.titre || 'Sans titre')}</div>
        <div class="memoire-meta" style="margin-top:8px;">
          <span><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${escapeHtml(m.etudiant || '—')}</span>
          &nbsp;·&nbsp;
          <span><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> Encadreur : ${escapeHtml(m.encadreur || '—')}</span>
        </div>
        <div class="memoire-meta">
          <span><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${escapeHtml(m.anneeAcademique || '—')}</span>
          ${m.dateSoutenance ? `&nbsp;·&nbsp;<span><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${formatDate(m.dateSoutenance)}</span>` : ''}
        </div>
        ${(m.motsCles || []).length > 0 ? `
          <div class="memoire-tags" style="margin-top:10px;">
            ${m.motsCles.slice(0, 4).map(k => `<span class="tag">${escapeHtml(k)}</span>`).join('')}
          </div>` : ''}
        ${m.fichierUrl ? `
          <div style="margin-top:12px;">
            <a href="${escapeHtml(m.fichierUrl)}" target="_blank" rel="noopener" class="btn btn-download btn-sm"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Résumé</a>
          </div>` : ''}
      </div>
    `;
  }).join('');

  renderPagination(totalAff);
}

function renderPagination(total) {
  const paginationEl = document.getElementById('pagination');
  if (!paginationEl) return;

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }

  const makeBtn = (label, page, disabled = false, active = false) =>
    `<button class="page-btn ${active ? 'active' : ''}" ${disabled ? 'disabled' : ''} data-page="${page}">${label}</button>`;

  let html = makeBtn('◀', currentPage - 1, currentPage === 1);
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      html += makeBtn(i, i, false, i === currentPage);
    } else if (Math.abs(i - currentPage) === 2) {
      html += '<span style="padding:0 4px;color:var(--text-muted);">…</span>';
    }
  }
  html += makeBtn('▶', currentPage + 1, currentPage === totalPages);

  paginationEl.innerHTML = html;
  paginationEl.querySelectorAll('.page-btn:not(:disabled)').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      renderMemoires();
      document.getElementById('memoires')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ===== STATS ===== */
function renderStats() {
  const soutenus  = allMemoires.filter(m => m.statut === 'soutenu').length;
  const enCours   = allMemoires.filter(m => m.statut === 'en_cours').length;

  observeWhenVisible('.stats-banner', () => {
    const el1 = document.getElementById('total-soutenus');
    const el2 = document.getElementById('total-en-cours');
    if (el1) animateCounter(el1, soutenus);
    if (el2) animateCounter(el2, enCours);
  }, 0.1);
}

/* ===== GALERIE ===== */
function renderGalerie(photos) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  if (!photos || photos.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:48px;height:48px;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
        <p>La galerie photos sera disponible prochainement.</p>
      </div>`;
    return;
  }

  grid.innerHTML = photos.map((photo, i) => `
    <div class="gallery-item" data-index="${i}" role="button" tabindex="0" aria-label="Voir photo : ${escapeHtml(photo.legende || '')}">
      <img src="${escapeHtml(photo.url)}" alt="${escapeHtml(photo.legende || 'Photo de soutenance')}" loading="lazy">
      <div class="gallery-overlay">
        <span>${escapeHtml(photo.legende || '')}</span>
        <span>${escapeHtml(photo.annee || '')}</span>
      </div>
    </div>
  `).join('');

  // Lightbox
  grid.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(i); });
  });
}

let currentLightboxIndex = 0;

function openLightbox(index) {
  currentLightboxIndex = index;
  const photo   = galleryItems[index];
  const overlay = document.getElementById('lightbox');
  const img     = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  if (!overlay || !img || !photo) return;

  img.src           = photo.url;
  img.alt           = photo.legende || 'Photo de soutenance';
  caption.textContent = `${photo.legende || ''}${photo.evenement ? ' — ' + photo.evenement : ''}${photo.annee ? ' (' + photo.annee + ')' : ''}`;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox')?.classList.remove('open');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + galleryItems.length) % galleryItems.length;
  openLightbox(currentLightboxIndex);
}

document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
document.getElementById('lightbox-prev')?.addEventListener('click', () => navigateLightbox(-1));
document.getElementById('lightbox-next')?.addEventListener('click', () => navigateLightbox(1));
document.getElementById('lightbox')?.addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') closeLightbox();
});
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb?.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

/* ===== TÉMOIGNAGES ===== */
function renderTemoignages(temoignages) {
  const track = document.getElementById('carousel-track');
  const dots  = document.getElementById('carousel-dots');
  if (!track) return;

  const defaultTemoignages = [
    {
      nomEtudiant: 'Exemple — À renseigner',
      promotionAnnee: '2022-2023',
      posteActuel: 'Développeur Full-Stack — Entreprise X',
      texte: 'Ce Master m\'a permis d\'acquérir une solide formation en génie logiciel et de m\'intégrer rapidement dans le monde professionnel avec des compétences concrètes et reconnues.',
    }
  ];

  const items = temoignages.length > 0 ? temoignages : defaultTemoignages;
  let current = 0;

  track.innerHTML = items.map(t => `
    <div class="carousel-slide">
      <div class="temoignage-card">
        <blockquote>${escapeHtml(t.texte)}</blockquote>
        <div class="temoignage-author">${escapeHtml(t.nomEtudiant)}</div>
        <div class="temoignage-role">${escapeHtml(t.posteActuel || '')} · Promotion ${escapeHtml(t.promotionAnnee || '')}</div>
      </div>
    </div>
  `).join('');

  if (dots) {
    dots.innerHTML = items.map((_, i) =>
      `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');
    dots.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index)));
    });
  }

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots?.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.getElementById('carousel-prev')?.addEventListener('click', () => goTo((current - 1 + items.length) % items.length));
  document.getElementById('carousel-next')?.addEventListener('click', () => goTo((current + 1) % items.length));

  // Auto-avance
  if (items.length > 1) setInterval(() => goTo((current + 1) % items.length), 6000);
}
