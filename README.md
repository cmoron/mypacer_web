# MyPacer Web

> Frontend Svelte/Vite pour l'application MyPacer - Calculateur de tables d'allure et recherche d'athlètes FFA

[![CI](https://github.com/cmoron/mypacer_web/actions/workflows/ci.yml/badge.svg)](https://github.com/cmoron/mypacer_web/actions/workflows/ci.yml)
[![Docker](https://github.com/cmoron/mypacer_web/actions/workflows/docker.yml/badge.svg)](https://github.com/cmoron/mypacer_web/actions/workflows/docker.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cmoron_mypacer_web&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cmoron_mypacer_web)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=cmoron_mypacer_web&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=cmoron_mypacer_web)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=cmoron_mypacer_web&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=cmoron_mypacer_web)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=cmoron_mypacer_web&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=cmoron_mypacer_web)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=cmoron_mypacer_web&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=cmoron_mypacer_web)

## 📋 Vue d'ensemble

MyPacer Web est une application Svelte qui permet aux coureurs de :

- **Afficher des tables d'allure** personnalisées pour différentes distances
- **Rechercher des athlètes** dans la base de données de la Fédération Française d'Athlétisme (FFA)
- **Afficher les records personnels** des athlètes directement dans le tableau d'allure
- **Ajouter des distances personnalisées** en plus des distances standards

L'application communique avec une API FastAPI ([mypacer_api](https://github.com/cmoron/mypacer_api)) qui gère la logique métier et l'accès aux données.

## ✨ Fonctionnalités

### Table d'allure interactive

- Sélection de la plage d'allure (min/max)
- Incrément configurable
- Distances standards (100m, 200m, 400m, 800m, 1000m, 1500m, mile, 3000m, 5km, 10km, semi, marathon)
- Ajout/suppression de distances personnalisées
- Affichage en temps, vitesse et allure
- Affichage d'une colonne de pourcentage VMA

### Recherche d'athlètes FFA

- Recherche par nom dans la base de données FFA
- Visualisation des records personnels
- Affichage des records dans le tableau d'allure avec code couleur
- Gestion de plusieurs athlètes simultanément
- Lien direct vers la fiche FFA de l'athlète

### Responsive Design

- Interface adaptée desktop et mobile
- Navigation tactile optimisée

## 🚀 Quick Start

### Développement local (sans Docker)

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev   # ou : make dev
```

L'application sera accessible sur `http://localhost:5173`

**Note** : Assurez-vous que l'API (`mypacer_api`) tourne sur `http://localhost:8000` ou modifiez `VITE_API_URL` dans `.env`

### Développement local (avec Docker)

```bash
# Lancement avec docker-compose
docker compose -f docker-compose.dev.yml up

# Ou avec make
make dev-docker
```

Voir [docs/DOCKER_DEV_SETUP.md](docs/DOCKER_DEV_SETUP.md) pour la documentation complète.

## 🧪 Tests & Qualité

### Lancer les tests

```bash
# Tests unitaires
npm run test

# Tests avec UI interactive
npm run test:ui

# Tests avec coverage
npm run coverage

# Ou via Makefile
make test
make coverage
```

### Coverage actuel

- **45.8%** lignes
- **77.96%** fonctions
- **104 tests** passent

**Modules testés à 100%** :

- ✅ `athletesStore.js` (gestion des athlètes)
- ✅ `paceTableStore.js` (gestion de la table d'allure)
- ✅ `vmaStore.js` (gestion VMA)
- ✅ `worldRecordsStore.js`
- ✅ `storeUtils.js` (utilitaires stores + localStorage)
- ✅ `timeUtils.js` (formatage temps/allure/vitesse)
- ✅ `flagsUtils.js` (conversion codes pays)

### Linting & Formatting

```bash
# Vérifier le code
make lint           # ESLint
make format-check   # Prettier

# Auto-fix
make format         # Formatter le code
make fix            # Fix linting issues

# Simulation CI locale
make ci             # Format + Lint + Tests + Build
```

## 🐳 Docker

### Images disponibles

**Production** :

```bash
docker pull ghcr.io/cmoron/mypacer_web:latest-prod
```

**Tags disponibles** :

- `latest-prod` - Dernière version stable
- `vX.Y.Z-prod` - Versions spécifiques
- `main-sha123` - Commits sur main

### Build local

```bash
# Image de production
docker build --target prod -t mypacer_web:prod .

# Image de développement
docker build --target dev -t mypacer_web:dev .
```

### docker-compose

**Développement** :

```bash
docker compose -f docker-compose.dev.yml up
```

**Production** (via mypacer_infra) :

```bash
# Voir https://github.com/cmoron/mypacer_infra
```

## 🏗️ Architecture

```
mypacer_web/
├── src/
│   ├── athletes/           # Recherche et gestion des athlètes
│   │   ├── AthleteSearch.svelte
│   │   └── athletesStore.js
│   ├── paceTable/          # Table d'allure principale
│   │   ├── PaceTable.svelte
│   │   ├── paceTableStore.js
│   │   └── vmaStore.js
│   ├── utils/              # Fonctions utilitaires
│   │   ├── timeUtils.js    # Formatage temps/allure
│   │   ├── flagsUtils.js   # Drapeaux pays
│   │   ├── storeUtils.js   # LocalStorage helpers
│   │   └── constants.js
│   └── App.svelte          # Composant racine
├── tests/                  # Tests Vitest
│   ├── stores/             # Tests des stores Svelte
│   └── utils/              # Tests des utilitaires
├── docs/                   # Documentation
│   └── DOCKER_DEV_SETUP.md
├── Dockerfile              # Multi-stage (dev + prod)
├── docker-compose.dev.yml  # Dev local avec hot-reload
├── Makefile                # Commandes standardisées
└── vitest.config.js        # Configuration tests
```

## 🔧 Configuration

### Variables d'environnement

**Développement** (`.env`) :

```bash
VITE_API_URL=http://localhost:8000
```

**Production** (`.env.production`) :

```bash
VITE_API_URL=/api
```

**Build Docker** :

```bash
docker build --build-arg VITE_API_URL=https://api.mypacer.fr .
```

## 📚 Documentation

- [Docker Development Setup](docs/DOCKER_DEV_SETUP.md) - Configuration Docker dev/prod
- [API Documentation](https://github.com/cmoron/mypacer_api) - Backend FastAPI
- [Infrastructure](https://github.com/cmoron/mypacer_infra) - Orchestration Docker Compose

## 🚀 CI/CD

### Workflows GitHub Actions

**CI (`ci.yml`)** - Sur push/PR vers `main` :

- ✅ Format check (Prettier)
- ✅ Linting (ESLint)
- ✅ Tests (104 tests)
- ✅ Coverage (45.8%)
- ✅ Build (Vite)

**Docker (`docker.yml`)** :

- Sur push `main` : Build + Push image GHCR
- Sur tag `v*` : Build + Push + Release GitHub automatique

### Commandes Makefile

```bash
make help           # Afficher l'aide
make install        # npm ci
make test           # Tests unitaires
make coverage       # Tests avec coverage
make lint           # ESLint
make format         # Prettier --write
make format-check   # Prettier --check
make ci             # Simulation CI locale
make clean          # Nettoyage
```

## 🤝 Contributing

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'feat: add amazing feature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

**Note** : Assurez-vous que `make ci` passe avant de créer une PR.

## 📊 Intégration avec l'écosystème MyPacer

MyPacer est composé de 3 microservices :

- **[mypacer_web](https://github.com/cmoron/mypacer_web)** (ce repo) - Frontend Svelte
- **[mypacer_api](https://github.com/cmoron/mypacer_api)** - Backend FastAPI
- **[mypacer_scraper](https://github.com/cmoron/mypacer_scraper)** - Scraper données FFA

Orchestration via **[mypacer_infra](https://github.com/cmoron/mypacer_infra)** (Docker Compose + Nginx)

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Remerciements

- [Svelte](https://svelte.dev/) - Framework réactif
- [Vite](https://vitejs.dev/) - Build tool
- [Vitest](https://vitest.dev/) - Testing framework
- [Prettier](https://prettier.io/) - Code formatter
- [flag-icons](https://github.com/lipis/flag-icons) - Drapeaux CSS
