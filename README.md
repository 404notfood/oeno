# OenoClass

Plateforme SaaS pédagogique dédiée à l'enseignement de l'oenologie dans les lycées agricoles français. OenoClass s'intègre au **GAR** (Gestionnaire d'Accès aux Ressources) pour l'authentification SSO avec les systèmes du Ministère de l'Éducation nationale.

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Langage | TypeScript (strict) |
| Styling | TailwindCSS 4 |
| Authentification | [Better Auth](https://www.better-auth.com/) + SAML (GAR/ENT) |
| ORM | [Prisma](https://www.prisma.io/) |
| Base de données | PostgreSQL |
| Formulaires | React Hook Form + Zod |
| Graphiques | Recharts |
| Hébergement | Vercel |

## Prérequis

- **Node.js** 18+
- **PostgreSQL** 15+
- **npm** (ou équivalent)

## Installation

```bash
# Cloner le dépôt puis se placer dans /site
cd site

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Remplir les variables dans .env (DATABASE_URL, BETTER_AUTH_SECRET, etc.)

# Générer le client Prisma et appliquer les migrations
npx prisma generate
npx prisma migrate dev

# (Optionnel) Peupler la base avec des données de test
npx prisma db seed
```

## Développement

```bash
npm run dev        # Serveur de développement → http://localhost:3000
npm run build      # Build de production
npm run start      # Démarrer le serveur de production
npm run lint       # Linting ESLint
```

### Base de données

```bash
npm run db:generate   # Générer le client Prisma
npm run db:migrate    # Créer/appliquer les migrations
npm run db:push       # Push du schéma sans migration
npm run db:seed       # Peupler la base de test
npm run db:studio     # Interface visuelle Prisma Studio
npm run db:reset      # Réinitialiser la base (⚠️ destructif)
```

## Architecture

```
site/
├── app/                    # Routes Next.js (App Router)
│   ├── (admin)/            # Routes administration
│   ├── dashboard/          # Tableau de bord élève
│   ├── enseignant/         # Espace enseignant
│   ├── login/              # Connexion
│   ├── register/           # Inscription
│   ├── api/                # Routes API (auth)
│   ├── tarifs/             # Page tarifs
│   ├── contact/            # Page contact
│   ├── aide/               # Page aide
│   ├── cgu/                # Conditions générales
│   ├── confidentialite/    # Politique de confidentialité
│   ├── mentions-legales/   # Mentions légales
│   └── layout.tsx          # Layout racine
│
├── components/             # Composants React
│   ├── ui/                 # Composants UI réutilisables
│   ├── activities/         # Composants d'activités pédagogiques
│   ├── admin/              # Composants administration
│   ├── auth/               # Composants authentification
│   ├── enseignant/         # Composants espace enseignant
│   ├── quiz/               # Composants quiz
│   └── student/            # Composants espace élève
│
├── actions/                # Server Actions
│   ├── admin/              # Actions administration
│   ├── notifications.ts    # Gestion des notifications
│   ├── progress.ts         # Suivi de progression
│   ├── sequences.ts        # Séquences pédagogiques
│   └── tastings.ts         # Dégustations
│
├── lib/                    # Utilitaires & configuration
│   ├── auth.ts             # Config Better Auth (serveur)
│   ├── auth-client.ts      # Hooks auth (client)
│   ├── auth-server.ts      # Helpers auth (serveur)
│   ├── prisma.ts           # Client Prisma singleton
│   ├── csv.ts              # Utilitaire CSV
│   └── validations/        # Schémas Zod
│
├── prisma/
│   ├── schema.prisma       # Schéma de la base de données
│   ├── seed.ts             # Script de seed principal
│   └── seed-wines.ts       # Seed des données vinicoles
│
├── middleware.ts            # Protection des routes & redirections
└── public/                 # Fichiers statiques
```

## Modèle de données

Les entités principales de la base :

- **User** — Utilisateurs (élèves, enseignants, admins) avec intégration GAR
- **Establishment / ClassGroup** — Établissements scolaires et classes
- **CompetencyBlock / Activity** — Blocs de compétences et activités pédagogiques
- **Quiz / QuizQuestion / QuizAttempt** — Système de quiz avec correction automatique
- **Tasting** — Fiches de dégustation (analyses visuelle, olfactive, gustative)
- **Wine / GrapeVariety / Appellation** — Référentiel vinicole complet
- **AromaCategory / Aroma** — Roue des arômes structurée
- **Sequence / SequenceActivity** — Séquences pédagogiques composées par les enseignants
- **GlossaryTerm** — Glossaire des termes oenologiques
- **Notification / AuditLog** — Notifications et traçabilité

### Rôles utilisateurs

| Rôle | Description |
|---|---|
| `STUDENT` | Élève — accès aux activités et dégustations |
| `TEACHER` | Enseignant — création de séquences, suivi des élèves |
| `ADMIN` | Administrateur d'établissement |
| `SUPER_ADMIN` | Administrateur de la plateforme |

## Design System — "Terroir Numérique"

### Palette de couleurs

| Couleur | Hex | Usage |
|---|---|---|
| Bordeaux | `#6B1F3D` | Couleur principale |
| Or | `#C5975C` | Accents, éléments dorés |
| Vert | `#4A5D3F` | Nature, succès |
| Beige | `#F5F1E8` | Fond de page |
| Gris tech | `#566573` | Texte secondaire |

### Typographie

- **Titres** : Cormorant Garamond (serif)
- **Corps** : Poppins (sans-serif)

### Accessibilité

- Conformité RGAA niveau AA
- Contraste minimum 4.5:1
- Zones cliquables 44×44px minimum
- Navigation complète au clavier

## Variables d'environnement

Voir [`.env.example`](.env.example) pour la liste complète. Variables requises :

| Variable | Description |
|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL |
| `BETTER_AUTH_SECRET` | Secret Better Auth (32 caractères min.) |
| `BETTER_AUTH_URL` | URL de l'application |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'application |

## Licence

Projet propriétaire — Tous droits réservés.
