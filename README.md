# 🎛️ Liste — Personal Server Dashboard

> **Un dashboard centralisé pour monitorer et gérer l'ensemble de mes projets hébergés sur mon infrastructure Coolify.**

Liste est une interface de contrôle moderne qui offre une vue d'ensemble en temps réel de mes projets web/mobile, avec métriques système en direct et gestion centralisée des déploiements.

---

## 📸 Vue d'ensemble

**Dashboard principal** : Métriques système en temps réel (CPU, RAM, Disque, Réseau, Uptime)  
**Matrix des projets** : Grille visuelle de tous les projets avec status, technologies et liens rapides  
**Authentification sécurisée** : Protection par NextAuth avec whitelist IP et credentials

---

## ⚡ Stack Technique

### **Core Framework**
- **Next.js 15** (Pages Router) — Framework React pour SSR et API Routes
- **React 19** — Bibliothèque UI
- **NextAuth.js 4.24.7** — Authentification avec stratégie JWT

### **Styling & UI**
- **Tailwind CSS 3.4** — Utility-first CSS framework
- **React Icons 5.5** — Collection d'icônes (Feather, FontAwesome, HeroIcons)
- **Aesthetic** : Design glassmorphism dark mode avec accents emerald et effet "cyberpunk"

### **Monitoring & System**
- **systeminformation 5.22** — Collecte de métriques système (Node.js)
- **Agent Python externe** (port 8000) — Service de monitoring avancé
- **Sparkline charts** — Visualisation temps réel des historiques CPU/RAM

### **Configuration**
- **jsconfig.json** — Path aliases (`@/*`, `@api/*`)
- **PostCSS + Tailwind** — Pipeline de transformation CSS

---

## 🚀 Fonctionnalités

### ✅ **Actuellement implémenté**

#### 🏠 Dashboard Système (`/`)
- **Métriques en temps réel** (refresh automatique toutes les 1s)
  - CPU : Usage %, température, fréquence
  - RAM : Usage %, allouée/totale
  - Disque : Usage %, espace libre
  - Réseau : Upload/Download I/O
  - Système : Uptime formaté, OS platform/release/architecture
- **Graphiques sparkline** : Historique des 30 dernières mesures CPU/RAM
- **SSR + CSR** : Données initiales en server-side, puis client-side polling

#### 🗂️ Matrix des Projets (`/liste`)
- **Vue grille** : 5 projets actuellement configurés
- **Badges de status** : ONLINE (vert), DEV (jaune), OFFLINE (rouge)
- **Tech stack tags** : Technologies utilisées par projet
- **Quick launch** : Liens directs vers prod/staging/repo GitHub
- **Données statiques** : Chargées depuis `data/projects.json`

**Projets actuels** :
1. **Portfolio Nono** (ONLINE) — TypeScript, Next.js, Tailwind
2. **PoC MyRole** (OFFLINE) — PHP, Symfony, API Platform
3. **Budgy App** (DEV) — Next.js, Elysia, Tailwind
4. **The Maze** (ONLINE) — JavaScript, Canvas, Algorithmes
5. **Symfo Gobelins** (ONLINE) — PHP, Symfony, API Platform

#### 🔐 Authentification
- **NextAuth custom provider** : Credentials + IP whitelist
- **IPs autorisées** : `176.150.41.253`, `82.66.241.186`
- **Fallback** : Username/password depuis `.env.local`
- **Session JWT** : Tokens sécurisés avec rotation automatique
- **Page de connexion custom** : UI glassmorphic avec protection CSRF

#### 🔌 API Routes
- **`/api/system-info`** (GET) — Proxy vers agent de monitoring Python
- **`/api/explore`** (GET) — Liste des fichiers du répertoire `/public`
- **`/api/auth/[...nextauth]`** — Endpoints NextAuth (sign in/out, session)

---

### 🚧 **Roadmap (Prochaines évolutions)**

L'objectif à terme est de transformer ce dashboard en **Control Plane complet** pour Coolify :

#### Phase 1 : Intégration Coolify API
- [x] **Connexion Coolify REST API** : Proxy routes dynamiques vers l'instance Coolify (`lib/coolify-client.ts`)
- [x] **Chargement dynamique des projets** : Appels API Coolify via `useCoolifyApplications` hook
- [x] **Status réels** : Récupération automatique de l'état des containers Docker (parsing du format composite Coolify)
- [ ] **Health checks automatisés** : Ping/latency en temps réel pour chaque service

#### Phase 2 : Gestion des Déploiements
- [x] **Trigger deployments** : Boutons d'action sur la page applications (lancer/arrêter/redémarrer)
- [ ] **Logs en temps réel** : Visualisation des logs Coolify directement dans l'UI
- [ ] **Notifications** : Alertes en cas de déploiement échoué
- [ ] **Templates Nixpacks/Docker** : Configuration automatisée pour éviter les erreurs

#### Phase 3 : Migration Technique ✅
- [x] **Migré vers App Router** (Next.js 15)
- [x] **Conversion TypeScript** : Projet entièrement en `.ts/.tsx`
- [x] **Intégré Shadcn/UI** : Design system Shadcn en place
- [x] **Ajouté Lucide React** : Icônes Lucide, suppression de React Icons
- [x] **Header/Footer** : Composants globaux de layout

#### Phase 4 : Monitoring Avancé
- [ ] **Dashboard multi-serveurs** : Support de plusieurs instances Coolify
- [ ] **Métriques Docker** : CPU/RAM par container
- [ ] **Alerting system** : Webhooks Discord/Slack en cas d'incident
- [ ] **Historique des déploiements** : Timeline avec rollback possible

---

## 🛠️ Installation & Développement

### **Pré-requis**
- **Node.js 18+** (recommandé : 20 LTS)
- **npm** ou **pnpm**
- **Agent de monitoring Python** (optionnel, pour métriques système)

### **1. Cloner le repository**
```bash
git clone github.com/Lonejyc/liste.git
cd liste
```

### **2. Installer les dépendances**
```bash
npm install
```

### **3. Configuration de l'environnement**

Créer un fichier `.env.local` à la racine du projet :

```env
# URL de l'application (local ou production)
NEXTAUTH_URL=http://localhost:3000

# Secrets pour NextAuth (générer avec `openssl rand -base64 32`)
NEXTAUTH_SECRET=votre_secret_super_securise_ici
JWT_SECRET=votre_jwt_secret_ici

# Credentials administrateur
ADMIN_USERNAME=admin
ADMIN_PASSWORD=votre_mot_de_passe_securise

# URL de l'agent de monitoring externe (optionnel)
MONITOR_AGENT_URL=http://localhost:8000/api/stats
```

### **4. Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera disponible sur **http://localhost:3000**

### **5. Build de production**
```bash
npm run build
npm run start
```

---

## 📂 Structure du Projet

```
liste/
├── pages/                          # Pages Router (Next.js)
│   ├── _app.js                     # Global app wrapper + SessionProvider
│   ├── index.js                    # Dashboard système (métriques temps réel)
│   ├── liste/
│   │   └── index.js                # Matrix des projets
│   ├── auth/
│   │   └── signin.js               # Page de connexion custom
│   └── api/                        # API Routes
│       ├── auth/
│       │   └── [...nextauth].js    # Configuration NextAuth
│       ├── system-info.js          # Proxy vers agent de monitoring
│       └── explore.js              # Exploration fichiers publics
│
├── components/
│   └── Layout.js                   # Layout global (header, nav, footer)
│
├── data/
│   └── projects.json               # Données des projets (à migrer vers Coolify API)
│
├── styles/
│   ├── globals.css                 # Styles globaux + scrollbar custom
│   └── Home.module.css             # CSS modules (legacy)
│
├── public/
│   ├── background.webp             # Image de fond principale
│   └── favicon.ico
│
├── .env                            # Variables d'environnement
├── CLAUDE.md                       # Instructions pour l'assistant AI
├── package.json                    # Dépendances & scripts
├── jsconfig.json                   # Configuration path aliases
├── tailwind.config.js              # Configuration Tailwind
└── next.config.mjs                 # Configuration Next.js
```

---

## 📊 Architecture & Patterns

### **Authentification Flow**
1. User accède à une page protégée
2. Middleware NextAuth vérifie la session JWT
3. Si non authentifié → redirect `/auth/signin`
4. Page de connexion :
   - **IP whitelisting** : IPs autorisées passent directement
   - **Credentials** : Formulaire username/password
5. Si authentifié → session stockée en JWT (pas de DB)

### **Monitoring System**
1. **Server-Side Rendering** : `getServerSideProps` fetch initial data
2. **Client-Side Polling** : `useEffect` appelle `/api/system-info` toutes les 1s
3. **Proxy API Route** : Next.js → Agent Python externe (port 8000)
4. **Sparkline History** : Stocke les 30 dernières mesures en état React
5. **UI Update** : Composants re-render avec nouvelles données

### **Projects Data Flow**
```
data/projects.json → getServerSideProps → SSR → Client Hydration → Matrix UI
```

**À venir** : Remplacer par appels directs à l'API Coolify

---

## 🔒 Sécurité

### **Mesures implémentées**
✅ **NextAuth JWT** : Sessions sans base de données  
✅ **IP Whitelisting** : Limitation des IPs autorisées  
✅ **Credentials hashing** : (recommandé : ajouter bcrypt pour passwords)  
✅ **CSRF Protection** : Tokens NextAuth intégrés  
✅ **Environment variables** : Secrets non versionnés  
✅ **SSR Auth checks** : Redirection server-side si non authentifié  

### **Recommandations**
- [ ] Ajouter **rate limiting** sur `/api/auth`
- [ ] Implémenter **2FA** pour l'authentification
- [ ] Logger les tentatives de connexion échouées
- [ ] Rotate les secrets JWT régulièrement

---

## 📜 Scripts Disponibles

```bash
npm run dev      # Lancer le serveur de développement (port 3000)
npm run build    # Créer un build de production optimisé
npm run start    # Lancer le serveur de production
npm run export   # Générer un export statique (SSG)
npm run lint     # Linter Next.js (ESLint)
```

---

## 🐛 Dépendances Externes

### **Agent de Monitoring Python** (optionnel)
Le dashboard nécessite un agent Python externe pour collecter les métriques système avancées.

**Configuration** :
- **URL** : Définie dans `MONITOR_AGENT_URL` (`.env.local`)
- **Endpoint** : `GET /api/stats`
- **Port par défaut** : `8000`

**Comportement si agent indisponible** :
- `/api/system-info` retourne une erreur 500
- Le dashboard affiche un état de chargement infini (amélioration à prévoir)

---

## 🤝 Contribution & Développement

### **Conventions de code**
- **Modularité** : Composants réutilisables dans `/components`
- **Clarté > Cleverness** : Code lisible et maintainable avant tout
- **Error Handling** : Toujours gérer les états d'erreur et de chargement
- **Types** : (À venir) Utiliser TypeScript pour la sûreté des types

### **Workflow Git**
1. Créer une branche feature : `git checkout -b feature/nom-feature`
2. Commit avec messages descriptifs : `feat: ajout du système de notifications`
3. Push et créer une PR
4. Review → Merge sur `main`

---

## 📄 Licence

**Projet personnel** — Tous droits réservés.  
Ce dashboard est créé pour un usage personnel. Si vous souhaitez l'utiliser ou le modifier, contactez-moi.

---

## 📞 Contact

**Auteur** : Jocelyn  
**Projet** : Liste — Personal Server Dashboard  
**Repository** : [Lien vers le repo](https://github.com/Lonejyc/liste)

---

**Status du projet** : 🟡 **En développement actif**  
**Version** : 0.0.1 (Monitoring Dashboard)  
**Next milestone** : Intégration Coolify API (v1.0)
