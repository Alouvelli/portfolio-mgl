/**
 * section1.js
 * Chargement et rendu dynamique de la Section 1 — Cadre Pédagogique
 */

import { loadSection1 } from './static-data.js';
import { escapeHtml }   from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  loadAllSection1();
});

async function loadAllSection1() {
  // Chargement parallèle de tous les documents Section 1
  const [presentation, objectifs, competences, debouches, enseignements] = await Promise.all([
    loadSection1('presentation'),
    loadSection1('objectifs'),
    loadSection1('competences'),
    loadSection1('debouches'),
    loadSection1('organisation_enseignements'),
  ]);

  renderPresentation(presentation);
  renderObjectifs(objectifs);
  renderCompetences(competences);
  renderDebouches(debouches);
  renderEnseignements(enseignements);
}

/* ===== PRÉSENTATION ===== */
function renderPresentation(data) {
  const el = document.getElementById('presentation-content');
  if (!el) return;

  if (!data) {
    el.innerHTML = defaultContent('présentation', `
      <p>Le Master Génie Logiciel (GL) est un programme de formation de niveau Bac+5 qui vise à former des ingénieurs de haut niveau spécialisés dans la conception, le développement et la gestion de systèmes logiciels complexes.</p>
      <p style="margin-top:12px;">Ce programme répond aux besoins croissants des entreprises en experts capables de maîtriser l'ensemble du cycle de vie du logiciel, de l'analyse des besoins jusqu'à la maintenance des systèmes en production.</p>
    `);
    return;
  }

  el.innerHTML = `
    ${data.mission ? `<div class="card" style="border-left:4px solid var(--primary-color);margin-bottom:16px;padding:20px 24px;">
      <h4 style="color:var(--primary-dark);margin-bottom:8px;"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Mission</h4>
      <p>${escapeHtml(data.mission)}</p>
    </div>` : ''}
    ${data.texteIntro ? `<p style="font-size:var(--text-lg);line-height:var(--lh-relaxed);color:var(--text-secondary);">${escapeHtml(data.texteIntro)}</p>` : ''}
    ${data.vision ? `<div class="card" style="border-left:4px solid var(--secondary-color);margin-top:16px;padding:20px 24px;">
      <h4 style="color:var(--primary-dark);margin-bottom:8px;"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Vision</h4>
      <p>${escapeHtml(data.vision)}</p>
    </div>` : ''}
  `;
}

/* ===== OBJECTIFS ===== */
function renderObjectifs(data) {
  const el = document.getElementById('objectifs-content');
  if (!el) return;

  const defaultObjectifs = [
    { icone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>', texte: "Former des ingénieurs logiciel compétents en conception de systèmes complexes" },
    { icone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2v7.31L5.5 18A2 2 0 0 0 7.36 21h9.28a2 2 0 0 0 1.86-2.69L14 9.31V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>', texte: "Développer les capacités de recherche et d'innovation en génie logiciel" },
    { icone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', texte: "Renforcer les aptitudes à la gestion de projets et au travail collaboratif" },
    { icone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>', texte: "Préparer les diplômés aux défis de la transformation numérique des organisations" },
    { icone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>', texte: "Maîtriser les méthodes agiles, DevOps et les architectures logicielles modernes" },
    { icone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', texte: "Intégrer les bonnes pratiques de qualité, sécurité et fiabilité logicielle" },
  ];

  const liste = data?.liste || defaultObjectifs;

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;">
      ${liste.map(obj => `
        <div class="card" style="padding:20px;display:flex;align-items:flex-start;gap:14px;">
          <span style="font-size:28px;flex-shrink:0;">${obj.icone || '▸'}</span>
          <p style="margin:0;font-size:var(--text-sm);">${escapeHtml(obj.texte)}</p>
        </div>
      `).join('')}
    </div>
  `;
}

/* ===== COMPÉTENCES ===== */
function renderCompetences(data) {
  const el = document.getElementById('competences-content');
  if (!el) return;

  const defaultDomaines = [
    {
      titre: 'Conception et Architecture',
      competences: [
        'Modélisation UML des systèmes complexes',
        'Conception d\'architectures logicielles (MVC, microservices)',
        'Patterns de conception (Design Patterns)',
        'Architecture orientée services (SOA)',
      ]
    },
    {
      titre: 'Développement Logiciel',
      competences: [
        'Maîtrise de langages de programmation avancés (Java, Python, JS)',
        'Développement mobile (Android, iOS, Flutter)',
        'Développement web full-stack',
        'Intégration d\'API et services tiers',
      ]
    },
    {
      titre: 'Qualité et Tests',
      competences: [
        'Tests unitaires, d\'intégration et fonctionnels',
        'Test Driven Development (TDD)',
        'Revue de code et bonnes pratiques',
        'Métriques de qualité logicielle',
      ]
    },
    {
      titre: 'Gestion de Projets & Méthodes Agiles',
      competences: [
        'Scrum, Kanban, SAFe',
        'Planification et suivi de sprint',
        'Gestion des risques et de la dette technique',
        'Outils de collaboration (Jira, GitHub, CI/CD)',
      ]
    },
  ];

  const domaines = data?.domaines || defaultDomaines;

  el.innerHTML = domaines.map(d => `
    <div class="competence-domain-card">
      <h4>${escapeHtml(d.titre)}</h4>
      <ul>
        ${(d.competences || []).map(c => `<li>${escapeHtml(c)}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

/* ===== DÉBOUCHÉS ===== */
function renderDebouches(data) {
  const el = document.getElementById('debouches-content');
  if (!el) return;

  const defaultDebouches = [
    { icone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>', titre: 'Entreprises de Services du Numérique (ESN)', description: 'Intégration dans les grandes ESN locales et internationales pour des missions de développement et de conseil.', exemples: ['Développeur Senior', 'Architecte logiciel', 'Consultant IT'] },
    { icone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>', titre: 'Secteur Bancaire & Fintech', description: 'Développement de solutions financières numériques et de systèmes de paiement.', exemples: ['Chef de projet SI', 'Analyste fonctionnel', 'Développeur Fintech'] },
    { icone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="9" width="18" height="12"/><path d="M3 9L12 3l9 6"/><line x1="9" y1="21" x2="9" y2="9"/><line x1="15" y1="21" x2="15" y2="9"/></svg>', titre: 'Secteur Public & e-Gouvernement', description: 'Modernisation des systèmes d\'information de l\'État et des collectivités locales.', exemples: ['DSI', 'Responsable informatique', 'Chef de projet public'] },
    { icone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>', titre: 'Entrepreneuriat & Startups', description: 'Création de startups technologiques ou intégration dans des entreprises innovantes.', exemples: ['Co-fondateur tech', 'CTO', 'Product Owner'] },
    { icone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2v7.31L5.5 18A2 2 0 0 0 7.36 21h9.28a2 2 0 0 0 1.86-2.69L14 9.31V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>', titre: 'Recherche & Enseignement', description: 'Poursuite en doctorat ou carrière dans l\'enseignement supérieur et la recherche.', exemples: ['Doctorant', 'Enseignant-chercheur', 'Ingénieur R&D'] },
    { icone: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>', titre: 'Organisations Internationales', description: 'Organisations non-gouvernementales, agences de développement et entreprises multinationales.', exemples: ['Expert IT', 'Consultant international', 'Chargé de programme numérique'] },
  ];

  const secteurs = data?.secteurs || defaultDebouches;

  el.innerHTML = secteurs.map(s => `
    <div class="debouche-card">
      <div class="debouche-icon">${s.icone}</div>
      <h4>${escapeHtml(s.titre)}</h4>
      <p>${escapeHtml(s.description)}</p>
      <div class="debouche-examples">
        ${(s.exemples || []).map(e => `<span class="tag">${escapeHtml(e)}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

/* ===== ORGANISATION DES ENSEIGNEMENTS ===== */
function renderEnseignements(data) {
  const tabsNav    = document.getElementById('semestres-tabs');
  const tabsPanels = document.getElementById('semestres-panels');
  if (!tabsNav || !tabsPanels) return;

  const defaultSemestres = [
    {
      numero: 1,
      intitule: 'Semestre 1 — Fondements',
      ues: [
        { codeUE: 'GL101', intituleUE: 'Génie Logiciel Avancé', credits: 6, volumeHoraire: 60, enseignant: 'Pr. X' },
        { codeUE: 'GL102', intituleUE: 'Architecture des Systèmes', credits: 6, volumeHoraire: 60, enseignant: 'Dr. Y' },
        { codeUE: 'GL103', intituleUE: 'Base de Données Avancées', credits: 4, volumeHoraire: 40, enseignant: 'Pr. Z' },
        { codeUE: 'GL104', intituleUE: 'Algorithmique & Optimisation', credits: 4, volumeHoraire: 40, enseignant: 'Dr. A' },
        { codeUE: 'GL105', intituleUE: 'Méthodes de Recherche', credits: 4, volumeHoraire: 30, enseignant: 'Pr. B' },
        { codeUE: 'GL106', intituleUE: 'Anglais Professionnel', credits: 2, volumeHoraire: 20, enseignant: 'M. C' },
      ]
    },
    {
      numero: 2,
      intitule: 'Semestre 2 — Spécialisation',
      ues: [
        { codeUE: 'GL201', intituleUE: 'Développement Web & Mobile', credits: 6, volumeHoraire: 60, enseignant: 'Dr. D' },
        { codeUE: 'GL202', intituleUE: 'Cloud Computing & DevOps', credits: 6, volumeHoraire: 60, enseignant: 'Pr. E' },
        { codeUE: 'GL203', intituleUE: 'Sécurité des Systèmes d\'Information', credits: 4, volumeHoraire: 40, enseignant: 'Dr. F' },
        { codeUE: 'GL204', intituleUE: 'Intelligence Artificielle Appliquée', credits: 6, volumeHoraire: 50, enseignant: 'Pr. G' },
        { codeUE: 'GL205', intituleUE: 'Gestion de Projets Agile', credits: 4, volumeHoraire: 30, enseignant: 'Dr. H' },
        { codeUE: 'GL206', intituleUE: 'Entrepreneuriat Numérique', credits: 4, volumeHoraire: 30, enseignant: 'M. I' },
      ]
    },
    {
      numero: 3,
      intitule: 'Semestre 3 — Approfondissement',
      ues: [
        { codeUE: 'GL301', intituleUE: 'Tests & Assurance Qualité Logicielle', credits: 6, volumeHoraire: 50, enseignant: 'Pr. J' },
        { codeUE: 'GL302', intituleUE: 'Big Data & Traitement de Données', credits: 6, volumeHoraire: 50, enseignant: 'Dr. K' },
        { codeUE: 'GL303', intituleUE: 'Systèmes Embarqués & IoT', credits: 4, volumeHoraire: 40, enseignant: 'Pr. L' },
        { codeUE: 'GL304', intituleUE: 'UX Design & Interfaces', credits: 4, volumeHoraire: 30, enseignant: 'Dr. M' },
        { codeUE: 'GL305', intituleUE: 'Rédaction Scientifique', credits: 2, volumeHoraire: 20, enseignant: 'Pr. N' },
        { codeUE: 'GL306', intituleUE: 'Stage de Recherche (4 semaines)', credits: 8, volumeHoraire: 160, enseignant: 'Encadreur désigné' },
      ]
    },
    {
      numero: 4,
      intitule: 'Semestre 4 — Mémoire',
      ues: [
        { codeUE: 'GL401', intituleUE: 'Mémoire de Fin d\'Études', credits: 30, volumeHoraire: 600, enseignant: 'Encadreur désigné' },
      ]
    },
  ];

  const semestres = data?.semestres || defaultSemestres;

  // Onglets
  tabsNav.innerHTML = semestres.map((sem, i) => `
    <button
      class="tab-btn ${i === 0 ? 'active' : ''}"
      role="tab"
      aria-selected="${i === 0}"
      aria-controls="panel-sem${sem.numero}"
      data-tab="sem${sem.numero}"
    >
      S${sem.numero}
    </button>
  `).join('');

  // Panneaux
  tabsPanels.innerHTML = semestres.map((sem, i) => {
    const totalCredits = (sem.ues || []).reduce((s, ue) => s + (ue.credits || 0), 0);
    const totalVH      = (sem.ues || []).reduce((s, ue) => s + (ue.volumeHoraire || 0), 0);

    return `
    <div id="panel-sem${sem.numero}" class="tab-panel ${i === 0 ? 'active' : ''}" role="tabpanel">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
        <h3 style="font-size:var(--text-xl);color:var(--primary-dark);">${escapeHtml(sem.intitule)}</h3>
        <div style="display:flex;gap:12px;">
          <span class="badge badge-section"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> ${totalCredits} crédits</span>
          <span class="badge badge-en-cours"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${totalVH}h</span>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table-enseignements">
          <thead>
            <tr>
              <th>Code UE</th>
              <th>Intitulé de l'Unité d'Enseignement</th>
              <th style="text-align:center;">Crédits</th>
              <th style="text-align:center;">Volume Horaire</th>
              <th>Enseignant</th>
            </tr>
          </thead>
          <tbody>
            ${(sem.ues || []).map(ue => `
              <tr>
                <td><code style="background:var(--primary-100);color:var(--primary-dark);padding:2px 8px;border-radius:4px;font-size:0.8em;">${escapeHtml(ue.codeUE || '')}</code></td>
                <td style="font-weight:var(--fw-medium);color:var(--text-primary);">${escapeHtml(ue.intituleUE || '')}</td>
                <td style="text-align:center;"><span class="badge badge-section">${ue.credits || 0}</span></td>
                <td style="text-align:center;">${ue.volumeHoraire || 0}h</td>
                <td style="color:var(--text-muted);">${escapeHtml(ue.enseignant || '—')}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background:var(--primary-100);">
              <td colspan="2" style="font-weight:var(--fw-bold);color:var(--primary-dark);">Total ${escapeHtml(sem.intitule)}</td>
              <td style="text-align:center;font-weight:var(--fw-bold);color:var(--primary-dark);">${totalCredits}</td>
              <td style="text-align:center;font-weight:var(--fw-bold);color:var(--primary-dark);">${totalVH}h</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
  }).join('');

  // Gestion des onglets
  tabsNav.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsNav.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      tabsPanels.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panelId = btn.dataset.tab;
      document.getElementById(`panel-${panelId}`)?.classList.add('active');
    });
  });
}

/* ===== CONTENU PAR DÉFAUT ===== */
function defaultContent(section, html) {
  return `
    <div class="card" style="border:1px dashed var(--border-strong);background:var(--bg-surface);padding:20px;margin-bottom:16px;">
      <p style="font-size:var(--text-sm);color:var(--text-muted);">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Contenu de démonstration — À personnaliser via l'espace d'administration.
      </p>
    </div>
    ${html}
  `;
}
