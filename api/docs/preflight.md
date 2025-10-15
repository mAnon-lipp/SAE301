# Les requêtes preflight — CORS et API REST

## Qu'est-ce qu'une requête preflight ?

Une **requête preflight** est une requête HTTP automatique envoyée par le navigateur **avant** la vraie requête, pour vérifier si le serveur autorise l'opération cross-origin demandée.

## Pourquoi existe-t-elle ?

### Contexte : Same-Origin Policy

Par défaut, les navigateurs appliquent la **Same-Origin Policy** (politique de même origine) : un script JavaScript ne peut faire des requêtes qu'à son propre domaine.

**Exemple :**
- Frontend sur `http://localhost:5173` (Vite)
- API sur `http://localhost:8000` (PHP)
- → Origines différentes ❌

Pour autoriser ces requêtes **cross-origin**, on utilise **CORS** (Cross-Origin Resource Sharing).

### Déclenchement du preflight

Le navigateur envoie automatiquement une requête preflight dans ces cas :

1. **Méthodes HTTP autres que GET/POST/HEAD** : `PATCH`, `DELETE`, `PUT`
2. **En-têtes personnalisés** : `Authorization`, `X-Custom-Header`
3. **Content-Type non-standard** : `application/json` (contrairement à `application/x-www-form-urlencoded`)

## Comment fonctionne le preflight ?

### Flux d'une requête cross-origin avec preflight

```
1. Client (JavaScript)
   ↓
   fetch('http://localhost:8000/api/products/42', {
     method: 'DELETE',
     headers: { 'Authorization': 'Bearer token123' }
   })

2. Navigateur détecte : 
   - Méthode DELETE ✓
   - En-tête Authorization ✓
   → Envoie automatiquement une requête preflight

3. Requête OPTIONS (preflight)
   ↓
   OPTIONS /api/products/42 HTTP/1.1
   Origin: http://localhost:5173
   Access-Control-Request-Method: DELETE
   Access-Control-Request-Headers: Authorization

4. Serveur répond
   ↓
   HTTP/1.1 200 OK
   Access-Control-Allow-Origin: http://localhost:5173
   Access-Control-Allow-Methods: GET, POST, DELETE, PATCH, OPTIONS
   Access-Control-Allow-Headers: Authorization, Content-Type
   Access-Control-Allow-Credentials: true

5. Navigateur vérifie les permissions
   - DELETE autorisé ? ✓
   - Authorization autorisé ? ✓
   → Autorise la vraie requête

6. Vraie requête DELETE
   ↓
   DELETE /api/products/42 HTTP/1.1
   Authorization: Bearer token123

7. Serveur traite et répond
   ↓
   HTTP/1.1 204 No Content
```

## Anatomie d'une requête preflight

### Requête OPTIONS envoyée par le navigateur

```http
OPTIONS /api/products/42 HTTP/1.1
Host: localhost:8000
Origin: http://localhost:5173
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: authorization, content-type
```

**En-têtes clés :**
- `Origin` : d'où vient la requête
- `Access-Control-Request-Method` : méthode que le client veut utiliser
- `Access-Control-Request-Headers` : en-têtes que le client veut envoyer

### Réponse du serveur

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

**En-têtes clés :**
- `Access-Control-Allow-Origin` : origine(s) autorisée(s)
- `Access-Control-Allow-Methods` : méthodes autorisées
- `Access-Control-Allow-Headers` : en-têtes autorisés
- `Access-Control-Allow-Credentials` : autorise cookies/credentials
- `Access-Control-Max-Age` : durée du cache (en secondes)

## Gestion dans notre API

### Dans .htaccess

```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, DELETE, PATCH, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization"
Header set Access-Control-Allow-Credentials "true"
```

### Dans index.php

```php
// Gestion des requêtes preflight (OPTIONS)
if ($request->getMethod() == "OPTIONS") {
    http_response_code(200);
    exit();
}
```

**Important :** Le serveur doit répondre `200 OK` aux requêtes OPTIONS sans traiter la logique métier.

## Exemples concrets

### Exemple 1 : GET simple (PAS de preflight)

```javascript
// Pas de preflight car GET sans en-têtes custom
fetch('http://localhost:8000/api/products')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Flux :**
```
Client → GET /api/products → Serveur
       ← 200 OK + JSON     ←
```

### Exemple 2 : POST avec JSON (preflight déclenché)

```javascript
// Preflight car Content-Type: application/json
fetch('http://localhost:8000/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Chaise', category: 3 })
})
```

**Flux :**
```
Client → OPTIONS /api/products → Serveur (preflight)
       ← 200 OK + CORS headers ←
       → POST /api/products    → Serveur (vraie requête)
       ← 201 Created + JSON    ←
```

### Exemple 3 : DELETE avec Authorization (preflight déclenché)

```javascript
// Preflight car DELETE + en-tête Authorization
fetch('http://localhost:8000/api/products/42', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer abc123' }
})
```

**Flux :**
```
Client → OPTIONS /api/products/42 → Serveur (preflight)
       ← 200 OK + CORS headers    ←
       → DELETE /api/products/42  → Serveur (vraie requête)
       ← 204 No Content           ←
```

## Optimisation : Cache du preflight

Pour éviter d'envoyer un preflight à chaque requête, le serveur peut indiquer une durée de cache :

```apache
Header set Access-Control-Max-Age "86400"
```

Le navigateur mettra en cache la réponse preflight pendant **24 heures** (86400 secondes).

## Débogage

### Dans les DevTools du navigateur

1. Ouvrir **Network** (onglet Réseau)
2. Filtrer par méthode `OPTIONS`
3. Vérifier les en-têtes de réponse CORS

### Problèmes courants

| Erreur | Cause | Solution |
|--------|-------|----------|
| `CORS policy: No 'Access-Control-Allow-Origin'` | En-tête manquant | Ajouter dans .htaccess |
| `Method DELETE not allowed` | Méthode non listée | Ajouter DELETE dans Allow-Methods |
| `Header Authorization not allowed` | En-tête non listé | Ajouter Authorization dans Allow-Headers |
| `Credentials flag is true, but origin is *` | Wildcard avec credentials | Spécifier l'origine exacte |

### Tester avec curl

```bash
# Simuler un preflight
curl -X OPTIONS http://localhost:8000/api/products \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: DELETE" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v
```

Vérifier que la réponse contient les en-têtes `Access-Control-Allow-*`.

## Sécurité

### ⚠️ Wildcard en production

```apache
# ❌ DANGEREUX en production
Header set Access-Control-Allow-Origin "*"
```

Utiliser plutôt :

```apache
# ✅ Sécurisé
Header set Access-Control-Allow-Origin "https://monapp.com"
```

### ⚠️ Credentials avec wildcard

```apache
# ❌ INVALIDE (le navigateur rejettera)
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Credentials "true"
```

Si vous utilisez `Access-Control-Allow-Credentials: true`, vous **devez** spécifier une origine précise.

## Résumé

| Question | Réponse |
|----------|---------|
| **C'est quoi ?** | Requête OPTIONS automatique avant la vraie requête |
| **Pourquoi ?** | Vérifier les permissions CORS cross-origin |
| **Quand ?** | DELETE, PATCH, PUT, en-têtes custom, Content-Type JSON |
| **Comment gérer ?** | Répondre 200 aux OPTIONS + en-têtes CORS dans .htaccess |
| **Comment optimiser ?** | Access-Control-Max-Age pour mettre en cache |
| **Comment déboguer ?** | DevTools → Network → filtrer OPTIONS |

## Pour aller plus loin

- [CORS sur MDN](https://developer.mozilla.org/fr/docs/Web/HTTP/CORS)
- [Preflight request](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)
- [Access-Control-Max-Age](https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Access-Control-Max-Age)
