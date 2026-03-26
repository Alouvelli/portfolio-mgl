/**
 * static-data.js — Option B (architecture statique sans Firebase)
 * Remplace firestore.js avec les mêmes signatures de fonctions.
 * Les données section1/section2 utilisent les fallbacks définis dans section1.js/section2.js.
 * Les mémoires, galerie et témoignages sont chargés depuis le dossier data/.
 *
 * Pour revenir à Firebase (Option A) : remplacer l'import dans index.html,
 * section1.js, section2.js, section3.js : './static-data.js' → './firestore.js'
 */

async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function loadSection1(docId) {
  const data = await fetchJSON('./data/section1.json');
  return data ? (data[docId] ?? null) : null;
}

export async function loadSection2(docId) {
  const data = await fetchJSON('./data/section2.json');
  return data ? (data[docId] ?? null) : null;
}

export async function loadSiteConfig() {
  return fetchJSON('./data/config.json');
}

export async function loadMemoires(filters = {}) {
  const memoires = await fetchJSON('./data/memoires.json') ?? [];
  let result = [...memoires];
  if (filters.anneeAcademique) result = result.filter(m => m.anneeAcademique === filters.anneeAcademique);
  if (filters.statut)          result = result.filter(m => m.statut === filters.statut);
  if (filters.thematique)      result = result.filter(m => m.thematique === filters.thematique);
  return result;
}

export async function loadMemoiresByAnnee(annee) {
  return loadMemoires({ anneeAcademique: annee });
}

export async function loadMemoiresRecents(count = 3) {
  const all = await fetchJSON('./data/memoires.json') ?? [];
  return all.filter(m => m.statut === 'Soutenu').slice(0, count);
}

export async function loadAnneesAcademiques() {
  const all = await fetchJSON('./data/memoires.json') ?? [];
  return [...new Set(all.map(m => m.anneeAcademique).filter(Boolean))].sort().reverse();
}

export async function loadThematiques() {
  const all = await fetchJSON('./data/memoires.json') ?? [];
  return [...new Set(all.map(m => m.thematique).filter(Boolean))].sort();
}

export async function loadGalerie() {
  return fetchJSON('./data/galerie.json') ?? [];
}

export async function loadTemoignages() {
  const all = await fetchJSON('./data/temoignages.json') ?? [];
  return all.filter(t => t.visible !== false);
}

export async function countDocuments() {
  return 0;
}

export async function loadPortfolioStats() {
  const memoires = await fetchJSON('./data/memoires.json') ?? [];
  const galerie  = await fetchJSON('./data/galerie.json')  ?? [];
  const annees   = new Set(memoires.map(m => m.anneeAcademique).filter(Boolean));
  return {
    totalMemoires:     memoires.length,
    memoiresSoutenus:  memoires.filter(m => m.statut === 'Soutenu').length,
    anneesCouvertes:   annees.size || 4,
    totalPhotos:       galerie.length,
  };
}
