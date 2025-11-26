# 🚀 Guide Rapide : Déploiement GitHub Pages

## ✅ Modifications Appliquées Côté Client

Les fichiers suivants ont été modifiés pour fonctionner sur GitHub Pages :

### 1. **Routeur** (`client/src/lib/router.js`)
- ✅ Ajout de la détection automatique du base path (`/SAE301/`)
- ✅ Gestion automatique des navigations avec le préfixe
- ✅ Support du bouton retour/avance du navigateur

### 2. **Configuration API** (`client/src/lib/api-request.js`)
- ✅ Utilisation de variables d'environnement
- ✅ URL API configurable selon l'environnement

### 3. **Variables d'environnement**
- ✅ `.env.production` créé
- ✅ `.env.development` créé

### 4. **Navigation**
- ✅ Bouton de déconnexion corrigé pour utiliser le routeur

---

## ⚠️ MODIFICATION REQUISE SUR LE SERVEUR

### 📍 Fichier à modifier
```
~/SAE301/api/index.php
```

### 🔧 Modification à apporter

**Ligne 21 environ**, dans le tableau `$allowedOrigins`, ajoutez :

```php
$allowedOrigins = [
    'https://mmi.unilim.fr',
    'https://manon-lipp.github.io',  // ← AJOUTEZ CETTE LIGNE
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
];
```

### 📝 Comment faire ?

**Option 1 : Via SSH**
```bash
ssh votre_login@mmi.unilim.fr
cd SAE301/api
nano index.php
# Ajoutez la ligne puis Ctrl+X, Y, Enter
```

**Option 2 : Via FTP/SFTP**
1. Connectez-vous avec FileZilla ou WinSCP
2. Naviguez vers `SAE301/api/`
3. Téléchargez `index.php`
4. Modifiez-le localement
5. Téléversez-le sur le serveur

**Option 3 : Copier le fichier pré-configuré**
```bash
# Un fichier de référence a été créé : api/index.php.GITHUB_PAGES
# Vous pouvez le comparer avec votre fichier actuel
```

---

## 🧪 Tests à Effectuer

### Avant de pousser sur GitHub :

```powershell
# Dans le dossier client
cd d:\SAE301\client

# Installer les dépendances si nécessaire
npm install

# Tester en local
npm run dev

# Vérifier que tout fonctionne (produits, connexion, panier)

# Faire un build de test
npm run build

# Vérifier qu'il n'y a pas d'erreurs
```

### Après avoir poussé sur GitHub :

1. ⏳ Attendre 2-3 minutes (déploiement automatique)
2. 🌐 Ouvrir : https://manon-lipp.github.io/SAE301/
3. ✅ Vérifier :
   - [ ] La page d'accueil s'affiche
   - [ ] Les produits se chargent
   - [ ] La navigation fonctionne
   - [ ] Le panier fonctionne
   - [ ] La connexion fonctionne (après modification de l'API)

---

## 🐛 Résolution de Problèmes

### ❌ Erreur CORS dans la console

```
Access to fetch at 'https://mmi.unilim.fr/...' from origin 'https://manon-lipp.github.io' 
has been blocked by CORS policy
```

**Solution :** L'API n'a pas encore été modifiée sur le serveur. Suivez les instructions ci-dessus.

---

### ❌ 404 lors de la navigation

**Cause possible :** Le routeur ne gère pas bien le base path.

**Solution :**
1. Vérifiez que `vite.config.js` contient `base: "/SAE301/"`
2. Vérifiez dans la console : `console.log(import.meta.env.BASE_URL)`
3. Devrait afficher `/SAE301/`

---

### ❌ Les produits ne s'affichent pas

**Causes possibles :**
1. **CORS non configuré** → Vérifier l'erreur dans la console
2. **API ne répond pas** → Tester directement : https://mmi.unilim.fr/~lippler1/SAE301/api/products
3. **Problème réseau** → Vérifier l'onglet Network dans DevTools
4. **⚠️ API accessible uniquement depuis l'IUT** → `mmi.unilim.fr` n'est peut-être accessible que depuis le réseau de l'université

**Si l'API n'est accessible que depuis l'IUT :**

Vous avez 3 solutions :

**Option A : Déployer l'API ailleurs (recommandé)**
- Utilisez un hébergement gratuit comme :
  - **Vercel** (supporte PHP avec config)
  - **Railway** (gratuit pour petits projets)
  - **PlanetHoster** (hébergement PHP gratuit)
  - **InfinityFree** (hébergement PHP gratuit)

**Option B : Utiliser des données mockées**
- Créer un fichier JSON avec vos produits
- L'héberger dans le dossier `public/` de votre projet
- Modifier `api-request.js` pour pointer vers ces données en production

**Option C : GitHub Pages uniquement pour démonstration**
- Le site ne fonctionnera que depuis l'IUT
- Pour les démos, utilisez des captures d'écran ou vidéos

---

### ❌ La connexion ne fonctionne pas

**Causes possibles :**
1. **Cookies bloqués** → Les cookies tiers doivent être autorisés
2. **Session non persistante** → Vérifier que `SameSite=None` et `Secure=true` sont configurés dans l'API
3. **CORS** → Vérifier que `Access-Control-Allow-Credentials: true` est présent

**Vérification :**
```javascript
// Dans la console du navigateur
fetch('https://mmi.unilim.fr/~lippler1/SAE301/api/auth', {
  credentials: 'include'
})
.then(r => r.json())
.then(console.log)
```

---

## 📋 Checklist Complète

### Configuration Locale
- [x] `vite.config.js` : `base: "/SAE301/"`
- [x] Router modifié pour gérer le base path
- [x] API configurée avec variables d'environnement
- [x] `.env.production` créé
- [x] `.env.development` créé
- [x] Bouton déconnexion corrigé

### Sur le Serveur
- [ ] Modifier `api/index.php`
- [ ] Ajouter `'https://manon-lipp.github.io'` dans `$allowedOrigins`
- [ ] Vérifier que `SameSite=None` et `Secure=true` sont configurés

### Sur GitHub
- [ ] Commit et push des modifications
- [ ] Vérifier que GitHub Actions déploie correctement
- [ ] Tester le site déployé

---

## 📞 Commandes Utiles

```powershell
# Tester localement
cd d:\SAE301\client
npm run dev

# Builder pour production
npm run build

# Voir la structure du build
ls dist

# Commit et push
git add .
git commit -m "Fix: Configuration GitHub Pages avec routeur et CORS"
git push origin main

# Vérifier le statut Git
git status

# Voir les derniers commits
git log --oneline -5
```

---

## 🎯 Résultat Attendu

Après toutes ces modifications :

✅ **https://manon-lipp.github.io/SAE301/** devrait :
- Afficher la page d'accueil avec les produits
- Permettre la navigation entre les pages
- Permettre la connexion (si API modifiée)
- Gérer le panier correctement
- Supporter le bouton retour/avance du navigateur
- Fonctionner sans erreurs CORS

---

## 📚 Documentation Complète

Pour plus de détails, consultez : **GITHUB_PAGES_SETUP.md**
