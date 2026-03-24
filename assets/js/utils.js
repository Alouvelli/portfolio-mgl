/**
 * utils.js
 * Fonctions utilitaires partagées — formatage, UI helpers, sécurité
 */

/* ===== FORMATAGE ===== */

/**
 * Formate un timestamp Firebase ou objet Date en date française
 * @param {Object|Date|null} timestamp
 * @param {string} format - 'short' (12 mars) | 'full' (12 mars 2025)
 */
export function formatDate(timestamp, format = 'full') {
  if (!timestamp) return '—';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  if (isNaN(date.getTime())) return '—';

  const options = format === 'short'
    ? { day: 'numeric', month: 'long' }
    : { day: 'numeric', month: 'long', year: 'numeric' };

  return date.toLocaleDateString('fr-FR', options);
}

/**
 * Formate une taille de fichier en octets → "2,4 Mo"
 * @param {number} bytes
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '—';
  const sizes = ['o', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1).replace('.', ',') + ' ' + sizes[i];
}

/**
 * Tronque un texte avec ellipse
 * @param {string} text
 * @param {number} maxLength
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength).trim() + '…' : text;
}

/**
 * Retourne le label de l'année académique
 * @param {string} annee - ex: "2025-2026"
 */
export function getAnneeLabel(annee) {
  return annee ? `Promotion ${annee}` : '';
}

/* ===== SÉCURITÉ XSS ===== */

/**
 * Échappe les caractères HTML pour éviter les injections XSS
 * À utiliser avant tout innerHTML avec données externes
 * @param {string} str
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return str.replace(/[&<>"']/g, m => map[m]);
}

/* ===== TOAST NOTIFICATIONS ===== */

let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

const TOAST_ICONS = {
  success: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  error:   '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  warning: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  info:    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
};

/**
 * Affiche une notification toast
 * @param {string} message
 * @param {'success'|'error'|'warning'|'info'} type
 * @param {number} duration - ms (0 = permanent)
 */
export function showToast(message, type = 'info', duration = 4000) {
  const container = getToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</span>
    <span>${escapeHtml(message)}</span>
    <button class="toast-close" aria-label="Fermer">✕</button>
  `;

  const close = () => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector('.toast-close').addEventListener('click', close);
  container.appendChild(toast);

  if (duration > 0) setTimeout(close, duration);
  return toast;
}

/* ===== LOADING SPINNER ===== */

/**
 * Affiche un spinner dans un conteneur
 * @param {string|Element} container - ID ou élément DOM
 */
export function showSpinner(container) {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  if (!el) return;
  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;padding:48px;gap:12px;color:var(--text-muted);">
      <div class="spinner"></div>
      <span>Chargement…</span>
    </div>`;
}

/**
 * Supprime le spinner d'un conteneur
 */
export function hideSpinner(container) {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  if (el) el.innerHTML = '';
}

/* ===== SKELETON LOADING ===== */

/**
 * Génère du HTML skeleton pour cards
 * @param {number} count
 */
export function renderSkeletonCards(count = 3) {
  return Array.from({ length: count }, () => `
    <div class="card" style="padding:24px;">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text short"></div>
    </div>
  `).join('');
}

/* ===== UTILITAIRES DOM ===== */

/**
 * Debounce — limite le taux d'exécution d'une fonction
 * @param {Function} fn
 * @param {number} delay - ms
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Génère un ID court unique (pour clés temporaires)
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Récupère le type d'icône selon le type MIME
 * @param {string} mimeType
 * @returns {'pdf'|'docx'|'img'|'file'}
 */
export function getFileType(mimeType) {
  if (!mimeType) return 'file';
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('word') || mimeType.includes('officedocument.wordprocessing')) return 'docx';
  if (mimeType.includes('image')) return 'img';
  return 'file';
}

export const FILE_ICONS = {
  pdf:  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  docx: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>',
  img:  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  file: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
};

/**
 * Formate la date de dernière mise à jour
 * @param {Object} timestamp
 */
export function formatLastUpdate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7)  return `Il y a ${diffDays} jours`;
  return formatDate(timestamp, 'full');
}

/* ===== COMPTEUR ANIMÉ ===== */

/**
 * Anime un compteur numérique de 0 vers la valeur cible
 * @param {Element} el - élément DOM
 * @param {number} target - valeur finale
 * @param {number} duration - ms
 */
export function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Easing out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ===== INTERSECTION OBSERVER (lazy init) ===== */

/**
 * Observe les éléments et déclenche un callback quand ils deviennent visibles
 * @param {string} selector - sélecteur CSS
 * @param {Function} callback - (element) => void
 * @param {number} threshold
 */
export function observeWhenVisible(selector, callback, threshold = 0.2) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold });

  document.querySelectorAll(selector).forEach(el => observer.observe(el));
}

/* ===== EXPORT DU CONTENU DE LA PAGE ===== */
/**
 * Déclenche l'impression de la page courante
 */
export function printPage() {
  window.print();
}
