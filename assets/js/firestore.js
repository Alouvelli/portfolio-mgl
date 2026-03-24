/**
 * firestore.js
 * Couche d'accès aux données Firestore — lecture publique uniquement
 * Toutes les fonctions d'écriture sont dans les modules admin-sectionX.js
 */

import { db } from './firebase-config.js';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

/* ===== CONFIGURATION SITE ===== */

/**
 * Charge la configuration générale du site
 * @returns {Promise<Object|null>}
 */
export async function loadSiteConfig() {
  try {
    const snap = await getDoc(doc(db, 'site_config', 'general'));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('Impossible de charger site_config:', err);
    return null;
  }
}

/* ===== SECTION 1 ===== */

/**
 * Charge un document de la section 1
 * @param {'presentation'|'objectifs'|'competences'|'debouches'|'organisation_enseignements'} docId
 */
export async function loadSection1(docId) {
  try {
    const snap = await getDoc(doc(db, 'section1_contenu', docId));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn(`Impossible de charger section1/${docId}:`, err);
    return null;
  }
}

/* ===== SECTION 2 ===== */

/**
 * Charge un document de la section 2
 * @param {'chronogramme'|'guide_redaction'|'fiche_depot'|'fiche_suivi'|'modalites_soutenance'|'grilles_evaluation'} docId
 */
export async function loadSection2(docId) {
  try {
    const snap = await getDoc(doc(db, 'section2_documents', docId));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn(`Impossible de charger section2/${docId}:`, err);
    return null;
  }
}

/* ===== MÉMOIRES ===== */

/**
 * Charge tous les mémoires (avec filtres optionnels)
 * @param {{ annee?: string, statut?: string, thematique?: string }} filters
 * @returns {Promise<Array>}
 */
export async function loadMemoires(filters = {}) {
  try {
    let q = collection(db, 'memoires');
    const constraints = [];

    if (filters.annee)       constraints.push(where('anneeAcademique', '==', filters.annee));
    if (filters.statut)      constraints.push(where('statut', '==', filters.statut));
    if (filters.thematique)  constraints.push(where('thematique', '==', filters.thematique));

    constraints.push(orderBy('createdAt', 'desc'));

    const snap = await getDocs(query(q, ...constraints));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Impossible de charger les mémoires:', err);
    return [];
  }
}

/**
 * Charge les mémoires d'une année académique donnée
 * @param {string} annee - ex: "2025-2026"
 */
export async function loadMemoiresByAnnee(annee) {
  return loadMemoires({ annee });
}

/**
 * Charge les mémoires récents (soutenus en priorité)
 * @param {number} count - nombre max à retourner
 */
export async function loadMemoiresRecents(count = 6) {
  try {
    const snap = await getDocs(
      query(
        collection(db, 'memoires'),
        where('statut', '==', 'soutenu'),
        orderBy('dateSoutenance', 'desc'),
        limit(count)
      )
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Impossible de charger les mémoires récents:', err);
    return [];
  }
}

/**
 * Retourne les années académiques distinctes présentes dans la collection
 */
export async function loadAnneesAcademiques() {
  try {
    const snap = await getDocs(collection(db, 'memoires'));
    const annees = new Set(snap.docs.map(d => d.data().anneeAcademique).filter(Boolean));
    return Array.from(annees).sort().reverse();
  } catch {
    return [];
  }
}

/**
 * Retourne les thématiques distinctes
 */
export async function loadThematiques() {
  try {
    const snap = await getDocs(collection(db, 'memoires'));
    const themes = new Set(snap.docs.map(d => d.data().thematique).filter(Boolean));
    return Array.from(themes).sort();
  } catch {
    return [];
  }
}

/* ===== GALERIE ===== */

/**
 * Charge toutes les photos de la galerie, triées par ordre
 */
export async function loadGalerie() {
  try {
    const snap = await getDocs(
      query(collection(db, 'galerie'), orderBy('ordre', 'asc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Impossible de charger la galerie:', err);
    return [];
  }
}

/* ===== TÉMOIGNAGES ===== */

/**
 * Charge les témoignages visibles (modérés)
 */
export async function loadTemoignages() {
  try {
    const snap = await getDocs(
      query(
        collection(db, 'temoignages'),
        where('visible', '==', true),
        orderBy('createdAt', 'desc')
      )
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Impossible de charger les témoignages:', err);
    return [];
  }
}

/* ===== STATISTIQUES GLOBALES ===== */

/**
 * Compte les documents dans une collection
 * @param {string} collectionName
 * @param {Array} queryConstraints - contraintes Firestore optionnelles
 */
export async function countDocuments(collectionName, queryConstraints = []) {
  try {
    const snap = await getDocs(
      queryConstraints.length
        ? query(collection(db, collectionName), ...queryConstraints)
        : collection(db, collectionName)
    );
    return snap.size;
  } catch {
    return 0;
  }
}

/**
 * Charge toutes les statistiques du portfolio pour la page d'accueil
 */
export async function loadPortfolioStats() {
  const [totalMemoires, memoiresSoutenus, totalPhotos] = await Promise.all([
    countDocuments('memoires'),
    countDocuments('memoires', [where('statut', '==', 'soutenu')]),
    countDocuments('galerie'),
  ]);

  return {
    totalMemoires,
    memoiresSoutenus,
    totalPhotos,
    anneesCouvertes: 4,  // 2022 → 2026
  };
}
