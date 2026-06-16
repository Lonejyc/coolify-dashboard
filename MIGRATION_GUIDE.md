# 🚀 Migration Guide : Pages Router → App Router + Coolify Integration

Ce guide explique la stratégie de migration progressive de l'application **Liste** vers Next.js App Router avec intégration complète de l'API Coolify.

---

## 🎯 Objectif Final

Transformer **Liste** en une **surcouche intuitive** de Coolify permettant de :

- ✅ Gérer toutes les applications Coolify
- ✅ Déclencher/arrêter/redémarrer des déploiements
- ✅ Visualiser les logs en temps réel
- ✅ Gérer les variables d'environnement
- ✅ Configurer les domaines et SSL
- ✅ Monitorer les ressources (CPU/RAM)
- ✅ Gérer les bases de données
- ✅ Configurer les webhooks CI/CD

**Tout cela avec une UX améliorée par rapport au dashboard Coolify natif.**

---

## 📐 Stratégie de Migration

### **Approche choisie : Cohabitation progressive**

Au lieu d'une migration "Big Bang", nous adoptons une **migration incrémentale** :

```
Phase 1 : Setup                    ✅ TERMINÉ
├── TypeScript configuration
├── Coolify API types
└── API client library

Phase 2 : Infrastructure (Jour 2-3)
├── /app directory structure
├── API proxy routes
└── Test pages

Phase 3 : Features (Jour 4-11)
├── Applications CRUD
├── Deployments management
├── Logs viewer
├── Environment variables
├── Domains management
├── Databases CRUD
└── Webhooks configuration

Phase 4 : Polish (Jour 12-14)
├── Dashboard overview
├── Notifications system
├── Error boundaries
└── Final testing

Phase 5 : Migration complète
└── Suppression /pages (sauf auth)
```

### **Pourquoi cette approche ?**

**Avantages** :

- ✅ **Pas de downtime** : L'app reste fonctionnelle pendant la migration
- ✅ **Tests progressifs** : Chaque feature testée individuellement
- ✅ **Rollback facile** : Pages Router reste en backup
- ✅ **Apprentissage progressif** : Découverte de l'API Coolify étape par étape

**Inconvénients** :

- ⚠️ Code dupliqué temporairement
- ⚠️ Maintenance de deux structures en parallèle

---

## 🗂️ Structure des Répertoires

### **État actuel (Jour 1)**

```
liste/
├── pages/                    # Pages Router (existant)
│   ├── _app.js
│   ├── index.js             # Dashboard système
│   ├── liste/index.js       # Matrix projets statiques
│   └── api/
│       ├── auth/[...nextauth].js
│       └── system-info.js
│
├── app/                      # App Router (nouveau - vide pour l'instant)
│   └── (à créer Jour 2)
│
├── components/
│   └── Layout.js            # Layout existant
│
├── lib/                      # Nouveau
│   ├── coolify-client.ts    # ✅ Client API
│   └── types/
│       └── coolify.ts       # ✅ Types TypeScript
│
├── types/
│   └── env.d.ts             # ✅ Types env vars
│
├── data/
│   └── projects.json        # À remplacer par API Coolify
│
├── tsconfig.json            # ✅ Configuration TypeScript
├── COOLIFY_SETUP.md         # ✅ Guide setup
├── PROGRESS.md              # ✅ Tracker progression
└── MIGRATION_GUIDE.md       # ✅ Ce fichier
```

### **État cible (Jour 14)**

```
liste/
├── app/                      # App Router (nouveau - principal)
│   ├── layout.tsx           # Layout global
│   ├── page.tsx             # Dashboard overview
│   ├── loading.tsx          # Loading states
│   ├── error.tsx            # Error handling
│   │
│   ├── applications/
│   │   ├── page.tsx                    # Liste apps
│   │   └── [uuid]/
│   │       ├── page.tsx                # Détail app
│   │       ├── logs/page.tsx           # Logs
│   │       ├── environment/page.tsx    # Env vars
│   │       ├── domains/page.tsx        # Domaines
│   │       └── webhooks/page.tsx       # CI/CD
│   │
│   ├── deployments/
│   │   └── page.tsx         # Historique déploiements
│   │
│   ├── databases/
│   │   ├── page.tsx         # Liste databases
│   │   └── [uuid]/page.tsx  # Détail database
│   │
│   ├── servers/
│   │   ├── page.tsx         # Liste serveurs
│   │   └── [uuid]/
│   │       └── monitoring/page.tsx
│   │
│   ├── settings/
│   │   └── page.tsx         # Configuration
│   │
│   └── api/
│       └── coolify/
│           └── [...slug]/route.ts  # Proxy API dynamique
│
├── pages/                    # À supprimer (sauf auth)
│   └── api/
│       └── auth/[...nextauth].js  # NextAuth (garder)
│
├── components/
│   ├── coolify/             # Composants Coolify
│   │   ├── ApplicationCard.tsx
│   │   ├── DeploymentTimeline.tsx
│   │   ├── LogViewer.tsx
│   │   ├── EnvironmentEditor.tsx
│   │   ├── StatusBadge.tsx
│   │   └── ActionButton.tsx
│   │
│   └── ui/                  # Composants UI réutilisables
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── Toast.tsx
│
├── lib/
│   ├── coolify-client.ts    # ✅ Client API
│   ├── api-routes.ts        # Helpers routes
│   ├── notifications.ts     # Système notifications
│   └── types/
│       └── coolify.ts       # ✅ Types
│
└── types/
    └── env.d.ts             # ✅ Types env
```

---

## 🔧 Configuration Requise

### **1. Variables d'environnement**

Copier et remplir dans `.env.local` :

```env
# Coolify API (OBLIGATOIRE)
COOLIFY_API_URL=https://your-coolify-instance.com/api/v1
COOLIFY_API_TOKEN=3|WaobqX9tJQshKPuQFHsyApxuOOggg4w...

# NextAuth (existant)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
JWT_SECRET=...

# Admin credentials (existant)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=...

# Monitoring agent (optionnel)
MONITOR_AGENT_URL=http://localhost:8000/api/stats
```

### **2. Génération Bearer Token**

Suivre le guide complet : `COOLIFY_SETUP.md`

**Résumé rapide** :

1. Aller sur ton instance Coolify
2. Keys & Tokens > API Tokens
3. Create New Token
4. Name: "Liste Control Plane"
5. Permissions: `*` (all)
6. Copier le token généré

### **3. Test de connexion**

```bash
# Test avec curl
curl -X GET "https://your-instance.com/api/v1/version" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# Réponse attendue :
# {"version": "4.x.x", "status": "success"}
```

---

## 🛠️ Commandes Utiles

### **Développement**

```bash
# Démarrer en dev
npm run dev

# Build TypeScript (check types)
npx tsc --noEmit

# Linter
npm run lint

# Format code
npx prettier --write "**/*.{ts,tsx,js,jsx,json,md}"
```

### **Git Workflow**

```bash
# Créer une branche feature
git checkout -b feature/nom-feature

# Status
git status

# Commits
git add .
git commit -m "feat: description"

# Push
git push origin feature/coolify-control-plane

# Merge vers main (après tests)
git checkout main
git merge feature/coolify-control-plane
git push origin main
```

---

## 🔐 Sécurité

### **Bonnes pratiques implémentées**

1. **Token API jamais exposé au client**
   - ✅ Toutes les requêtes passent par `/app/api/coolify/`
   - ✅ Token stocké dans `.env.local` (server-side only)
   - ✅ `.env.local` dans `.gitignore`

2. **Authentification sur toutes les routes API**
   - ✅ `getServerSession()` dans chaque route handler
   - ✅ Redirection automatique si non authentifié

3. **Validation des inputs**
   - ✅ Schémas Zod pour POST/PATCH
   - ✅ Sanitization des données

4. **Error handling**
   - ✅ Messages d'erreur génériques côté client
   - ✅ Détails d'erreur loggés côté serveur uniquement

5. **Rate limiting** (À IMPLÉMENTER Jour 12)
   - [ ] Middleware pour limiter requêtes API
   - [ ] Protection contre brute force

---

## 🧪 Testing Strategy

### **Tests manuels (Jour 14)**

Checklist à valider avant merge :

**Applications** :

- [ ] Liste toutes les applications
- [ ] Détail d'une application
- [ ] Deploy une application
- [ ] Stop/Start/Restart fonctionnent
- [ ] Delete avec confirmation

**Logs** :

- [ ] Affichage logs build
- [ ] Affichage logs runtime
- [ ] Auto-scroll fonctionne
- [ ] Filtres logs (error/warn/info)

**Environment Variables** :

- [ ] Liste toutes les env vars
- [ ] Ajouter nouvelle variable
- [ ] Éditer variable existante
- [ ] Supprimer variable
- [ ] Bulk edit fonctionne

**Domaines** :

- [ ] Liste domaines
- [ ] Ajouter nouveau domaine
- [ ] Status SSL affiché
- [ ] Test DNS fonctionne

**Databases** :

- [ ] Liste databases
- [ ] Créer nouvelle database
- [ ] Configuration backup
- [ ] Restore backup

**Error States** :

- [ ] API down → message d'erreur
- [ ] 404 → page not found
- [ ] 500 → error boundary
- [ ] Timeout → message timeout

---

## 📊 Métriques de Succès

### **Performance**

- ⚡ First Contentful Paint < 1.5s
- ⚡ Time to Interactive < 3s
- ⚡ API response time < 500ms (moyenne)

### **UX**

- ✅ Toutes les actions Coolify disponibles
- ✅ Moins de clics que dashboard Coolify natif
- ✅ Feedback visuel sur toutes les actions
- ✅ Messages d'erreur clairs et actionnables

### **Code Quality**

- ✅ 0 erreurs TypeScript
- ✅ 0 warnings ESLint critiques
- ✅ Composants réutilisables modulaires
- ✅ Types exhaustifs pour API

---

## 🐛 Troubleshooting Common Issues

### **`Module not found: Can't resolve '@/lib/...'`**

**Solution** : Redémarrer le serveur dev

```bash
# Ctrl+C puis
npm run dev
```

---

### **`TypeError: Cannot read properties of undefined`**

**Cause** : Data fetching échoué, props undefined

**Solution** : Ajouter loading state et error boundary

```tsx
if (!data) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

---

### **`401 Unauthorized` sur API Coolify**

**Cause** : Token invalide ou expiré

**Solution** : Régénérer token et mettre à jour `.env.local`

---

### **Changes not reflected in UI**

**Cause** : Cache SWR ou browser

**Solutions** :

1. Hard refresh : `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)
2. Clear SWR cache :

```tsx
import { mutate } from "swr";
mutate("/api/coolify/applications"); // Revalidate
```

---

## 📚 Ressources

### **Documentation**

- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Coolify API Reference](https://coolify.io/docs/api-reference/authorization)
- [SWR Documentation](https://swr.vercel.app/)

### **Fichiers de référence**

- `COOLIFY_SETUP.md` - Setup API Coolify
- `PROGRESS.md` - Tracker progression jour par jour
- `lib/types/coolify.ts` - Types complets API
- `lib/coolify-client.ts` - Client API avec exemples

---

## 🎯 Next Steps

### **Pour toi (User)**

1. ✅ Lire `COOLIFY_SETUP.md`
2. ✅ Générer Bearer Token Coolify
3. ✅ Remplir `.env.local`
4. ✅ Tester connexion avec curl
5. ✅ Valider que `npm run dev` démarre sans erreur

### **Pour moi (Claude)**

1. Attendre validation Jour 1
2. Démarrer Jour 2 : Infrastructure API
3. Créer structure `/app`
4. Implémenter proxy API routes
5. Page de test connexion

---

**Status** : ✅ **Jour 1 terminé**  
**Prochaine étape** : Configuration Coolify API (toi) → Jour 2 (moi)

---

**Questions ?** Relis ce guide ou demande des clarifications ! 🚀
