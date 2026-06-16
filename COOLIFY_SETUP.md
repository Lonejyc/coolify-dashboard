# 🔧 Configuration Coolify API - Guide Complet

Ce guide vous accompagne pas à pas pour configurer l'accès API à votre instance Coolify.

---

## 📋 Pré-requis

- ✅ Une instance Coolify fonctionnelle (self-hosted ou Coolify Cloud)
- ✅ Accès administrateur au dashboard Coolify
- ✅ L'URL de votre instance (ex: `https://coolify.monserveur.com`)

---

## 🔑 Étape 1 : Générer un Bearer Token API

### **1.1 Accéder à votre instance Coolify**

Ouvrez votre navigateur et connectez-vous à votre dashboard Coolify :

```
https://your-coolify-instance.com
```

### **1.2 Naviguer vers les API Tokens**

1. Dans le menu de gauche, cliquez sur **"Keys & Tokens"**
2. Puis cliquez sur l'onglet **"API Tokens"**

### **1.3 Créer un nouveau token**

1. Cliquez sur le bouton **"Create New Token"**
2. Remplissez les informations :
   - **Name** : `Liste Control Plane` (ou un nom descriptif)
   - **Permissions** : Sélectionnez `*` (all permissions)

   **Pourquoi `*` ?** Ce scope donne un accès complet pour :
   - Lire toutes les applications, databases, services
   - Créer, modifier, supprimer des ressources
   - Déclencher des déploiements
   - Gérer les variables d'environnement
   - Voir les données sensibles (tokens, passwords redacted si read-only)

3. Cliquez sur **"Create"**

### **1.4 Copier le token**

⚠️ **IMPORTANT** : Le token ne sera affiché **qu'une seule fois** !

1. Copiez le token qui apparaît (format : `3|WaobqX9tJQshKPuQFHsyApxuOOggg4w...`)
2. Conservez-le dans un endroit sûr (gestionnaire de mots de passe recommandé)

**Exemple de token** :

```
3|WaobqX9tJQshKPuQFHsyApxuOOggg4wOfvGc9xa233c376d7
```

---

## 🔐 Étape 2 : Configurer le fichier `.env.local`

### **2.1 Ouvrir le fichier `.env.local`**

À la racine du projet `/Users/jocelyn/Documents/React/liste/.env.local`

### **2.2 Remplir les variables Coolify**

Remplacez les valeurs par défaut par vos vraies informations :

```env
# ============================================
# Coolify API Configuration
# ============================================
COOLIFY_API_URL=https://coolify.monserveur.com/api/v1
COOLIFY_API_TOKEN=3|WaobqX9tJQshKPuQFHsyApxuOOggg4wOfvGc9xa233c376d7
```

**⚠️ Checklist de vérification :**

- ✅ L'URL se termine bien par `/api/v1`
- ✅ L'URL utilise `https://` (pas `http://` sauf en local)
- ✅ Le token est complet (commence par un chiffre puis `|`)
- ✅ Pas d'espaces avant/après les valeurs

### **2.3 Exemple complet**

```env
# ============================================
# Coolify API Configuration
# ============================================
COOLIFY_API_URL=https://coolify.mydomain.com/api/v1
COOLIFY_API_TOKEN=3|WaobqX9tJQshKPuQFHsyApxuOOggg4wOfvGc9xa233c376d7
```

---

## ✅ Étape 3 : Tester la connexion

### **3.1 Démarrer le serveur de développement**

```bash
npm run dev
```

### **3.2 Vérifier dans les logs**

Au démarrage, l'application va tenter de se connecter à l'API Coolify.

Si tout est OK, vous verrez dans la console :

```
✅ Coolify API connected successfully
```

Si erreur, vérifiez :

- ❌ Token invalide ou expiré
- ❌ URL incorrecte (vérifiez les typos)
- ❌ Firewall bloque les requêtes
- ❌ Instance Coolify down

### **3.3 Test manuel via curl**

Pour tester directement l'API Coolify :

```bash
curl -X GET "https://your-coolify-instance.com/api/v1/version" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

**Réponse attendue** :

```json
{
  "version": "4.x.x",
  "status": "success"
}
```

---

## 🔒 Sécurité

### **Bonnes pratiques**

1. ✅ **Ne jamais commit le `.env.local`**
   - Le fichier est déjà dans `.gitignore`
   - Vérifiez avec `git status` qu'il n'apparaît pas

2. ✅ **Rotation régulière des tokens**
   - Changez le token tous les 3-6 mois
   - En cas de compromission, révoquez immédiatement

3. ✅ **Permissions minimales**
   - Pour un usage read-only, utilisez `read-only` au lieu de `*`
   - Pour voir les logs uniquement, utilisez `read:sensitive`

4. ✅ **Surveillance des accès**
   - Consultez régulièrement les logs d'API dans Coolify
   - Surveillez les appels suspects

### **Révocation d'un token**

Si vous devez révoquer un token :

1. Retournez dans **Keys & Tokens** > **API Tokens**
2. Cliquez sur l'icône **poubelle** à côté du token
3. Confirmez la suppression
4. Générez un nouveau token et mettez à jour `.env.local`

---

## 🐛 Troubleshooting

### **Erreur : `401 Unauthorized`**

**Cause** : Token invalide ou expiré

**Solution** :

1. Vérifiez que le token est correct (copier-coller complet)
2. Générez un nouveau token dans Coolify
3. Mettez à jour `.env.local`
4. Redémarrez le serveur (`npm run dev`)

---

### **Erreur : `404 Not Found`**

**Cause** : URL incorrecte

**Solution** :

1. Vérifiez l'URL (doit finir par `/api/v1`)
2. Testez l'URL dans le navigateur : `https://your-instance.com/api/v1/version`
3. Si erreur SSL, vérifiez le certificat

---

### **Erreur : `Network Error` / `ECONNREFUSED`**

**Cause** : Impossible de joindre l'instance Coolify

**Solution** :

1. Vérifiez que l'instance Coolify est bien en ligne
2. Testez un `ping` vers le serveur
3. Vérifiez les règles de firewall (ports 80/443 ouverts)
4. Si derrière un VPN, assurez-vous d'être connecté

---

### **Erreur : `403 Forbidden`**

**Cause** : Token valide mais permissions insuffisantes

**Solution** :

1. Retournez dans Coolify > API Tokens
2. Éditez le token
3. Changez les permissions vers `*` (all permissions)
4. Sauvegardez

---

### **Erreur : `Too Many Requests (429)`**

**Cause** : Rate limiting dépassé

**Solution** :

1. Attendez quelques minutes
2. Réduisez la fréquence des polling (augmenter `refreshInterval`)
3. Implémentez un cache côté client (SWR le fait déjà)

---

## 📚 Ressources Utiles

### **Documentation Coolify API**

- [API Reference officielle](https://coolify.io/docs/api-reference/authorization)
- [Liste des endpoints disponibles](https://coolify.io/docs/api-reference/api/operations/list-applications)

### **Tester l'API**

- **Postman** : Importez la collection OpenAPI de Coolify
- **Bruno** : Alternative open-source à Postman
- **curl** : Pour tester en ligne de commande

### **Permissions détaillées**

| Permission       | Description                                  | Usage                                      |
| ---------------- | -------------------------------------------- | ------------------------------------------ |
| `read-only`      | Lecture seule (données publiques)            | Monitoring, dashboards read-only           |
| `read:sensitive` | Lecture + données sensibles                  | Voir env vars, tokens                      |
| `view:sensitive` | Voir mais pas modifier les données sensibles | Debugging, support                         |
| `*`              | Toutes les permissions                       | Contrôle total (recommandé pour cette app) |

---

## ✅ Checklist finale

Avant de continuer vers le Jour 2, vérifiez que :

- [ ] Vous avez généré un token API dans Coolify
- [ ] Le token est copié dans `.env.local`
- [ ] L'URL Coolify est correcte et se termine par `/api/v1`
- [ ] Le test curl fonctionne
- [ ] Le serveur dev démarre sans erreur
- [ ] Le `.env.local` n'est pas versionné (dans `.gitignore`)

---

**🎉 Félicitations !** Votre configuration Coolify API est prête. Vous pouvez maintenant passer au **Jour 2** : Infrastructure API et création des routes proxy.

---

**Besoin d'aide ?**

- Discord Coolify : [https://coollabs.io/discord](https://coollabs.io/discord)
- GitHub Issues : [https://github.com/coollabsio/coolify/issues](https://github.com/coollabsio/coolify/issues)
