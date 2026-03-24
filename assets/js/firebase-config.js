/**
 * firebase-config.js
 * Initialisation Firebase — à configurer avec vos propres clés
 * depuis console.firebase.google.com
 */

import { initializeApp }   from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore }    from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';
import { getAuth }         from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { getStorage }      from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js';

/**
 * ⚠️  CONFIGURATION — Remplacez ces valeurs par celles de votre projet Firebase
 *
 * Pour obtenir ces valeurs :
 *   1. Aller sur https://console.firebase.google.com
 *   2. Sélectionner votre projet
 *   3. Paramètres du projet > Vos applications > SDK Firebase > Configuration
 */
const firebaseConfig = {
  apiKey:            "VOTRE_API_KEY",
  authDomain:        "VOTRE_PROJECT_ID.firebaseapp.com",
  projectId:         "VOTRE_PROJECT_ID",
  storageBucket:     "VOTRE_PROJECT_ID.appspot.com",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId:             "VOTRE_APP_ID"
};

// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);

// Export des services Firebase
export const db      = getFirestore(app);
export const auth    = getAuth(app);
export const storage = getStorage(app);

export default app;
