/**
 * auth.js
 * Authentification Firebase — connexion, déconnexion, garde admin
 */

import { auth }                     from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
}                                   from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { showToast }                from './utils.js';

/* ===== GARDE DE ROUTE ADMIN ===== */

/**
 * À appeler au chargement de chaque page admin (sauf la page de login).
 * Redirige vers /admin/index.html si l'utilisateur n'est pas connecté.
 */
export function checkAdminAccess() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (!user) {
        // Non connecté → redirection vers la page de login
        window.location.href = '/admin/index.html';
      } else {
        resolve(user);
      }
    });
  });
}

/**
 * Retourne l'utilisateur courant ou null
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/* ===== CONNEXION ===== */

/**
 * Connecte l'administrateur avec email/mot de passe
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export async function loginAdmin(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential;
}

/* ===== DÉCONNEXION ===== */

/**
 * Déconnecte l'administrateur et redirige vers la page de login
 */
export async function logoutAdmin() {
  await signOut(auth);
  window.location.href = '/admin/index.html';
}

/* ===== INITIALISATION PAGE LOGIN ===== */

/**
 * À appeler sur admin/index.html pour initialiser le formulaire de connexion
 */
export function initLoginPage() {
  // Si déjà connecté → aller au dashboard
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = '/admin/dashboard.html';
    }
  });

  const form    = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');
  const btnEl   = document.getElementById('login-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) return;

    errorEl.classList.remove('show');
    btnEl.disabled = true;
    btnEl.textContent = 'Connexion…';

    try {
      await loginAdmin(email, password);
      window.location.href = '/admin/dashboard.html';
    } catch (err) {
      let message = 'Erreur de connexion. Vérifiez vos identifiants.';

      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' ||
          err.code === 'auth/invalid-credential') {
        message = 'Email ou mot de passe incorrect.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Trop de tentatives. Réessayez plus tard.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Erreur réseau. Vérifiez votre connexion.';
      }

      errorEl.textContent = message;
      errorEl.classList.add('show');
      btnEl.disabled = false;
      btnEl.textContent = 'Se connecter';
    }
  });
}

/* ===== BOUTON DE DÉCONNEXION ===== */

/**
 * Initialise tous les boutons de déconnexion présents dans la page
 */
export function initLogoutButtons() {
  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (confirm('Voulez-vous vous déconnecter ?')) {
        try {
          await logoutAdmin();
        } catch {
          showToast('Erreur lors de la déconnexion.', 'error');
        }
      }
    });
  });
}
