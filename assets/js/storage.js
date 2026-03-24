/**
 * storage.js
 * Gestion des uploads Firebase Storage avec barre de progression
 */

import { storage } from './firebase-config.js';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js';

/**
 * Upload un fichier vers Firebase Storage avec suivi de progression
 * @param {File} file - objet File du navigateur
 * @param {string} path - chemin de stockage ex: "section2/guide_redaction.pdf"
 * @param {Function} onProgress - callback(percentage: number, bytesTransferred, totalBytes)
 * @returns {Promise<string>} URL de téléchargement publique
 */
export function uploadWithProgress(file, path, onProgress = () => {}) {
  return new Promise((resolve, reject) => {
    const storageRef  = ref(storage, path);
    const uploadTask  = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress(pct, snapshot.bytesTransferred, snapshot.totalBytes);
      },
      (error) => {
        let message = 'Erreur lors du téléversement.';
        if (error.code === 'storage/unauthorized') {
          message = 'Non autorisé — vérifiez la connexion admin.';
        } else if (error.code === 'storage/quota-exceeded') {
          message = 'Quota de stockage dépassé.';
        } else if (error.code === 'storage/canceled') {
          message = 'Téléversement annulé.';
        }
        reject(new Error(message));
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );

    // Exposer la task pour pouvoir annuler
    uploadWithProgress._lastTask = uploadTask;
  });
}

/**
 * Upload simple sans progression
 * @param {File} file
 * @param {string} path
 * @returns {Promise<string>} URL publique
 */
export async function uploadDocument(file, path) {
  return uploadWithProgress(file, path);
}

/**
 * Upload une image vers la galerie
 * @param {File} file
 * @param {string} subfolder - ex: "galerie"
 * @returns {Promise<string>} URL publique
 */
export async function uploadImage(file, subfolder = 'galerie') {
  const ext  = file.name.split('.').pop();
  const name = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const path = `${subfolder}/${name}`;
  return uploadWithProgress(file, path);
}

/**
 * Supprime un fichier de Firebase Storage
 * @param {string} path - chemin complet ex: "section2/guide.pdf"
 */
export async function deleteFile(path) {
  if (!path) return;
  const fileRef = ref(storage, path);
  await deleteObject(fileRef);
}

/**
 * Extrait le chemin de stockage depuis une URL Firebase Storage
 * @param {string} url - URL Firebase Storage
 * @returns {string|null}
 */
export function getPathFromUrl(url) {
  if (!url) return null;
  try {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/\/o\/(.+)\?/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Valide un fichier avant upload
 * @param {File} file
 * @param {{ maxSizeMB: number, allowedTypes: string[] }} options
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFile(file, options = {}) {
  const { maxSizeMB = 50, allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/webp'] } = options;

  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `Fichier trop volumineux. Maximum : ${maxSizeMB} Mo.` };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, error: `Type de fichier non autorisé. Types acceptés : PDF, DOCX, JPG, PNG.` };
  }

  return { valid: true };
}
