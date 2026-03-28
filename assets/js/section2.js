/**
 * section2.js
 * Chargement et rendu dynamique de la Section 2 — Processus de Recherche & Stage
 */

import { loadSection2 }            from './static-data.js';
import { escapeHtml, formatDate }  from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  loadAllSection2();
});

async function loadAllSection2() {
  const [chrono, guide, ficheDepot, ficheSuivi, soutenance, grilles] = await Promise.all([
    loadSection2('chronogramme'),
    loadSection2('guide_redaction'),
    loadSection2('fiche_depot'),
    loadSection2('fiche_suivi'),
    loadSection2('modalites_soutenance'),
    loadSection2('grilles_evaluation'),
  ]);

  renderChronogramme(chrono);
  renderDocuments({ guide, ficheDepot, ficheSuivi });
  renderSoutenance(soutenance);
  renderGrilles(grilles);
}

/* ===== CHRONOGRAMME ===== */
function renderChronogramme(data) {
  const el = document.getElementById('chronogramme-content');
  if (!el) return;

  const now = new Date();

  const defaultEtapes = [
    { intitule: 'Lancement de l\'année académique',       dateDebut: '2025-10-01', dateFin: '2025-10-15', responsable: 'Direction', statut: 'done' },
    { intitule: 'Dépôt des propositions de sujets',       dateDebut: '2025-10-16', dateFin: '2025-11-15', responsable: 'Étudiants', statut: 'done' },
    { intitule: 'Validation des sujets et encadreurs',    dateDebut: '2025-11-16', dateFin: '2025-12-05', responsable: 'Commission pédagogique', statut: 'done' },
    { intitule: 'Rédaction du mémoire',                   dateDebut: '2026-01-06', dateFin: '2026-05-31', responsable: 'Étudiants + Encadreurs', statut: 'active' },
    { intitule: 'Dépôt final du mémoire',                 dateDebut: '2026-06-01', dateFin: '2026-06-30', responsable: 'Scolarité', statut: 'upcoming' },
    { intitule: 'Lecture et évaluation par les rapporteurs', dateDebut: '2026-07-01', dateFin: '2026-07-20', responsable: 'Jury', statut: 'upcoming' },
    { intitule: 'Soutenances des mémoires',               dateDebut: '2026-07-21', dateFin: '2026-08-10', responsable: 'Jury + Étudiants', statut: 'upcoming' },
    { intitule: 'Délibérations et résultats',             dateDebut: '2026-08-11', dateFin: '2026-08-20', responsable: 'Direction', statut: 'upcoming' },
  ];

  const etapes = data?.etapes || defaultEtapes;

  const STATUS_CONFIG = {
    done:     { cls: 'done',     icon: '✓', label: 'Terminé' },
    active:   { cls: 'active',   icon: '▶', label: 'En cours' },
    upcoming: { cls: 'upcoming', icon: '◦', label: 'À venir' },
  };

  el.innerHTML = `
    <div class="timeline">
      ${etapes.map(etape => {
        const cfg     = STATUS_CONFIG[etape.statut] || STATUS_CONFIG.upcoming;
        const debut   = etape.dateDebut instanceof Object ? formatDate(etape.dateDebut) : etape.dateDebut;
        const fin     = etape.dateFin instanceof Object   ? formatDate(etape.dateFin)   : etape.dateFin;
        return `
          <div class="timeline-item">
            <div class="timeline-dot ${cfg.cls}" title="${cfg.label}">${cfg.icon}</div>
            <div class="timeline-content">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap;">
                <h4>${escapeHtml(etape.intitule)}</h4>
                <span class="badge ${etape.statut === 'done' ? 'badge-soutenu' : etape.statut === 'active' ? 'badge-en-cours' : 'badge-archive'}">${cfg.label}</span>
              </div>
              <div class="timeline-dates">
                <span><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${escapeHtml(debut)} → ${escapeHtml(fin)}</span>
                <span>·</span>
                <span><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${escapeHtml(etape.responsable || '—')}</span>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Bouton PDF du chronogramme
  const pdfEl = document.getElementById('chronogramme-pdf');
  if (pdfEl && data?.fichierUrl) {
    pdfEl.innerHTML = `
      <a href="${escapeHtml(data.fichierUrl)}" target="_blank" rel="noopener" class="btn btn-download">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Télécharger le chronogramme officiel (PDF)
      </a>
    `;
  }
}

/* ===== DOCUMENTS OFFICIELS ===== */
function renderDocuments({ guide, ficheDepot, ficheSuivi }) {
  const el = document.getElementById('documents-content');
  if (!el) return;

  const docs = [
    {
      icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
      iconType: 'pdf',
      titre: 'Guide de Rédaction — Canevas de Mémoire',
      description: 'Structure officielle attendue pour la rédaction du mémoire de fin d\'études : plan type, normes bibliographiques, mise en forme.',
      fichierUrl: guide?.fichierUrl,
      version: guide?.version || 'v1.0',
      badge: 'Guide officiel',
    },
    {
      icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
      iconType: 'docx',
      titre: 'Fiche de Dépôt — Validation du Sujet',
      description: 'Formulaire de validation du sujet et de la problématique. À remettre signé par l\'étudiant et l\'encadreur.',
      fichierUrl: ficheDepot?.fichierUrl,
      badge: 'Formulaire',
    },
    {
      icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
      iconType: 'docx',
      titre: 'Fiche de Suivi des Encadrements — Modèle Vierge',
      description: 'Fiche de suivi à remplir lors de chaque séance d\'encadrement. Preuve officielle de l\'encadrement pédagogique.',
      fichierUrl: ficheSuivi?.fichierViergeUrl,
      badge: 'Modèle vierge',
    },
    {
      icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      iconType: 'pdf',
      titre: 'Fiche de Suivi des Encadrements — Exemple Rempli',
      description: 'Exemple de fiche de suivi correctement remplie pour illustration. Preuve de l\'encadrement effectif.',
      fichierUrl: ficheSuivi?.fichierExempleUrl,
      badge: 'Exemple',
    },
  ];

  el.innerHTML = docs.map(doc => `
    <div class="card card-document">
      <div class="doc-icon ${doc.iconType}">${doc.icon}</div>
      <div class="doc-info">
        <div class="doc-meta">
          <span class="badge badge-section">${escapeHtml(doc.badge)}</span>
          ${doc.version ? `<span style="font-size:var(--text-xs);color:var(--text-muted);">${escapeHtml(doc.version)}</span>` : ''}
        </div>
        <h4>${escapeHtml(doc.titre)}</h4>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:12px;">${escapeHtml(doc.description)}</p>
        ${doc.fichierUrl
          ? (() => {
              const ext = doc.fichierUrl.split('.').pop().toLowerCase();
              const isDocx = ext === 'docx' || ext === 'doc';
              const formatLabel = isDocx ? ' Word (.docx)' : ' PDF';
              const attrs = isDocx
                ? `href="${escapeHtml(doc.fichierUrl)}" download rel="noopener"`
                : `href="${escapeHtml(doc.fichierUrl)}" target="_blank" rel="noopener"`;
              return `<a ${attrs} class="btn btn-download btn-sm">
               <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Télécharger${formatLabel}
             </a>`;
            })()
          : `<span style="font-size:var(--text-xs);color:var(--text-muted);font-style:italic;">Document à venir</span>`
        }
      </div>
    </div>
  `).join('');
}

/* ===== MODALITÉS DE SOUTENANCE ===== */
function renderSoutenance(data) {
  const el = document.getElementById('soutenance-content');
  if (!el) return;

  const defaultJury = [
    { role: 'Président du jury', nombre: 1, criteres: 'Enseignant-chercheur Habilité à Diriger des Recherches (HDR) ou Professeur Titulaire' },
    { role: 'Directeur de mémoire',   nombre: 1, criteres: 'Encadreur principal de l\'étudiant, présent mais non votant' },
    { role: 'Examinateur / Rapporteur', nombre: 1, criteres: 'Enseignant spécialiste du domaine du mémoire' },
    { role: 'Examinateur externe',    nombre: 1, criteres: 'Professionnel ou chercheur extérieur à l\'établissement (optionnel)' },
  ];

  const defaultProtocole = [
    { etape: 'Présentation orale', duree: '20 min', description: 'L\'étudiant présente son travail avec support (PowerPoint, démo).' },
    { etape: 'Questions du jury',  duree: '30 min', description: 'Chaque membre du jury pose des questions sur le fond et la forme.' },
    { etape: 'Délibération',       duree: '15 min', description: 'Le jury délibère à huis clos et attribue la note finale et la mention.' },
    { etape: 'Proclamation',       duree: '5 min',  description: 'Le président annonce la note et la mention devant l\'étudiant.' },
  ];

  const jury      = data?.compositionJury || defaultJury;
  const protocole = data?.protocole       || defaultProtocole;

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;">

      <!-- Composition du jury -->
      <div class="admin-card">
        <div class="admin-card-header"><h3><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="9" width="18" height="12"/><path d="M3 9L12 3l9 6"/><line x1="9" y1="21" x2="9" y2="9"/><line x1="15" y1="21" x2="15" y2="9"/></svg> Composition du jury</h3></div>
        <div class="admin-card-body">
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Rôle</th>
                  <th style="text-align:center;">Nb</th>
                  <th>Critères</th>
                </tr>
              </thead>
              <tbody>
                ${jury.map(j => `
                  <tr>
                    <td style="font-weight:var(--fw-medium);color:var(--primary-dark);">${escapeHtml(j.role)}</td>
                    <td style="text-align:center;"><span class="badge badge-section">${j.nombre}</span></td>
                    <td style="font-size:var(--text-sm);">${escapeHtml(j.criteres || '—')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Protocole de soutenance -->
      <div class="admin-card">
        <div class="admin-card-header"><h3><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Déroulement de la soutenance</h3></div>
        <div class="admin-card-body">
          ${protocole.map((p, i) => `
            <div style="display:flex;gap:14px;padding:12px 0;${i < protocole.length - 1 ? 'border-bottom:1px solid var(--border-light);' : ''}">
              <div style="min-width:28px;height:28px;background:var(--primary-color);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:var(--text-xs);font-weight:var(--fw-bold);flex-shrink:0;">${i + 1}</div>
              <div>
                <div style="display:flex;gap:10px;align-items:center;margin-bottom:4px;">
                  <span style="font-weight:var(--fw-semibold);color:var(--primary-dark);font-size:var(--text-sm);">${escapeHtml(p.etape)}</span>
                  <span class="badge badge-en-cours">${escapeHtml(p.duree)}</span>
                </div>
                <p style="font-size:var(--text-sm);margin:0;">${escapeHtml(p.description)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    ${data?.fichierUrl ? `
      <a href="${escapeHtml(data.fichierUrl)}" target="_blank" rel="noopener" class="btn btn-download">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Télécharger le règlement officiel de soutenance (PDF)
      </a>
    ` : ''}
  `;
}

/* ===== GRILLES D'ÉVALUATION ===== */
function renderGrilles(data) {
  const el = document.getElementById('grilles-content');
  if (!el) return;

  const defaultGrilles = [
    {
      type: 'technique',
      intitule: 'Grille Technique — Qualité du Travail Réalisé',
      fichierUrl: null,
      criteres: [
        { critere: 'Pertinence et originalité du sujet',        ponderationMax: 4,  description: 'Adéquation du sujet avec les enjeux actuels du génie logiciel' },
        { critere: 'Maîtrise de la méthodologie',               ponderationMax: 4,  description: 'Rigueur dans la démarche scientifique et technique adoptée' },
        { critere: 'Qualité de la solution technique',          ponderationMax: 6,  description: 'Architecture, code, tests, documentation technique' },
        { critere: 'Validation et résultats',                   ponderationMax: 4,  description: 'Tests, benchmarks, mesures de performance ou d\'utilité' },
        { critere: 'Innovation et valeur ajoutée',              ponderationMax: 2,  description: 'Apport nouveau par rapport à l\'état de l\'art' },
      ]
    },
    {
      type: 'redactionnel',
      intitule: 'Grille Rédactionnelle — Qualité du Mémoire',
      fichierUrl: null,
      criteres: [
        { critere: 'Structure et organisation du mémoire',      ponderationMax: 4,  description: 'Respect du plan type, enchaînement logique des parties' },
        { critere: 'Qualité de la revue de littérature',        ponderationMax: 4,  description: 'Pertinence des références, analyse critique des travaux existants' },
        { critere: 'Clarté et précision de l\'expression',      ponderationMax: 4,  description: 'Français correct, vocabulaire technique approprié' },
        { critere: 'Qualité des illustrations (figures, tableaux)', ponderationMax: 4, description: 'Légendes, numérotation, lisibilité' },
        { critere: 'Respect des normes bibliographiques',        ponderationMax: 4,  description: 'Citations correctes, bibliographie complète et normalisée' },
      ]
    },
    {
      type: 'oral',
      intitule: 'Grille Orale — Qualité de la Présentation et de la Défense',
      fichierUrl: null,
      criteres: [
        { critere: 'Maîtrise du sujet lors de la présentation', ponderationMax: 5,  description: 'Clarté de l\'exposé, respect du temps imparti' },
        { critere: 'Qualité du support de présentation',        ponderationMax: 3,  description: 'Slides claires, visuel professionnel, démo le cas échéant' },
        { critere: 'Réponses aux questions du jury',            ponderationMax: 8,  description: 'Pertinence, profondeur, réactivité face aux remarques' },
        { critere: 'Posture professionnelle',                   ponderationMax: 4,  description: 'Tenue, expression orale, gestion du stress et des échanges' },
      ]
    },
  ];

  const GRILLE_COLORS = {
    technique:     'var(--primary-color)',
    redactionnel:  'var(--secondary-color)',
    oral:          'var(--accent-color)',
  };

  const grilles = data?.grilles || defaultGrilles;

  el.innerHTML = `
    <div style="margin-bottom:16px;padding:14px 18px;background:var(--accent-100);border:1px solid var(--accent-color);border-radius:var(--radius-md);">
      <strong>Barème total :</strong> La soutenance est notée sur 60 points répartis entre les trois grilles. La note de soutenance est pondérée avec la note du mémoire écrit pour obtenir la note finale.
    </div>
    ${grilles.map(g => {
      const total = (g.criteres || []).reduce((s, c) => s + (c.ponderationMax || 0), 0);
      const color = GRILLE_COLORS[g.type] || 'var(--primary-color)';
      return `
        <div class="accordion-item" style="margin-bottom:12px;border-left:4px solid ${color};">
          <button class="accordion-header" style="gap:12px;">
            <div style="display:flex;align-items:center;gap:12px;flex:1;">
              <span>${escapeHtml(g.intitule)}</span>
              <span class="badge badge-section" style="margin-left:auto;">${total} pts</span>
            </div>
            <span class="acc-icon">▼</span>
          </button>
          <div class="accordion-body">
            <div class="table-responsive">
              <table class="grille-table">
                <thead>
                  <tr>
                    <th>Critère d'évaluation</th>
                    <th style="text-align:center;width:80px;">/ Points</th>
                    <th>Description / Indicateurs</th>
                  </tr>
                </thead>
                <tbody>
                  ${(g.criteres || []).map(c => `
                    <tr>
                      <td style="font-weight:var(--fw-medium);color:var(--text-primary);">${escapeHtml(c.critere)}</td>
                      <td style="text-align:center;"><span class="badge badge-section">${c.ponderationMax}</span></td>
                      <td style="font-size:var(--text-sm);">${escapeHtml(c.description || '—')}</td>
                    </tr>
                  `).join('')}
                </tbody>
                <tfoot>
                  <tr class="grille-total-row">
                    <td><strong>Total</strong></td>
                    <td style="text-align:center;"><strong>${total}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            ${g.fichierUrl ? `
              <div style="margin-top:14px;">
                <a href="${escapeHtml(g.fichierUrl)}" target="_blank" rel="noopener" class="btn btn-download btn-sm">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Télécharger la grille ${escapeHtml(g.intitule)} (PDF)
                </a>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('')}
  `;

  // Initialiser les accordéons
  el.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    header?.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
}
