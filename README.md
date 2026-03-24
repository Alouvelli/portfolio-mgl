# Portfolio Numérique — Master Génie Logiciel (ANAQ)

Portfolio numérique pour le dossier d'accréditation ANAQ du Master Génie Logiciel.

## Structure

```
PORTFOLIO_MGL/
├── index.html          # Page d'accueil publique
├── section1.html       # Cadre Stratégique et Pédagogique
├── section2.html       # Processus de Recherche et de Stage
├── section3.html       # Dynamiques en Cours et Archives
├── admin/              # Espace d'administration (protégé)
│   ├── index.html      # Connexion admin
│   ├── dashboard.html  # Tableau de bord
│   ├── upload.html     # Upload de documents
│   ├── gestion-section1.html
│   ├── gestion-section2.html
│   └── gestion-section3.html
├── assets/             # CSS, JS, images
├── firebase.json       # Config Firebase Hosting
├── firestore.rules     # Règles de sécurité Firestore
└── storage.rules       # Règles de sécurité Storage
```

## Mise en place

### 1. Configurer Firebase

1. Créer un projet sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activer : **Authentication** (Email/Password), **Firestore**, **Storage**, **Hosting**
3. Copier la configuration SDK et remplacer les valeurs dans `assets/js/firebase-config.js`
4. Créer le compte admin : Authentication > Users > Ajouter un utilisateur

### 2. Installer Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 3. Initialiser le projet

```bash
cd PORTFOLIO_MGL
firebase init
```
Sélectionner : Firestore, Hosting, Storage

### 4. Déployer

```bash
firebase deploy
```

## Utilisation de l'interface admin

1. Naviguer vers `/admin/index.html`
2. Se connecter avec les identifiants créés
3. Utiliser le tableau de bord pour :
   - Modifier le contenu des 3 sections
   - Uploader des documents (PDF, DOCX, images)
   - Gérer les mémoires (CRUD complet)
   - Modérer les témoignages
   - Gérer la galerie photos

## Technologies

- **Frontend** : HTML5 / CSS3 / Vanilla JavaScript (ES Modules)
- **Backend** : Firebase (Auth, Firestore, Storage, Hosting)
- **Design** : Système de design académique personnalisé
- **Typographie** : Playfair Display + Inter (Google Fonts)
