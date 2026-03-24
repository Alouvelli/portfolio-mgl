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


## Technologies

- **Frontend** : HTML5 / CSS3 / Vanilla JavaScript (ES Modules)
- **Backend** : Firebase (Auth, Firestore, Storage, Hosting)
- **Design** : Système de design académique personnalisé
- **Typographie** : Playfair Display + Inter (Google Fonts)
