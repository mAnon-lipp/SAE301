# Les API REST — Principes fondamentaux

## Qu'est-ce qu'une API ?

Une **API** (Application Programming Interface) est une interface qui permet à deux applications de communiquer entre elles. Dans le contexte web, une API permet à un client (navigateur, application mobile, autre serveur) d'interagir avec un serveur pour échanger des données.

## Qu'est-ce que REST ?

**REST** (Representational State Transfer) est un style architectural pour concevoir des APIs web. Une API REST respecte certains principes qui la rendent simple, prévisible et facile à utiliser.

### Principes clés de REST

1. **Ressources** : tout est considéré comme une ressource (un produit, un utilisateur, une commande...)
2. **URI** : chaque ressource est identifiée par une URI unique
3. **Méthodes HTTP** : on utilise les verbes HTTP standard pour les opérations
4. **Représentation** : les ressources sont généralement échangées au format JSON
5. **Sans état** : chaque requête est indépendante et contient toute l'information nécessaire

## Les verbes HTTP et les opérations CRUD

Une API REST utilise les méthodes HTTP pour effectuer des opérations sur les ressources :

| Verbe HTTP | Opération CRUD | Action | Exemple |
|------------|----------------|--------|---------|
| **GET** | Read | Récupérer une ou plusieurs ressources | `GET /api/products` <br> `GET /api/products/42` |
| **POST** | Create | Créer une nouvelle ressource | `POST /api/products` |
| **PATCH** | Update | Modifier partiellement une ressource | `PATCH /api/products/42` |
| **PUT** | Update | Remplacer complètement une ressource | `PUT /api/products/42` |
| **DELETE** | Delete | Supprimer une ressource | `DELETE /api/products/42` |

### Différence entre PATCH et PUT

- **PATCH** : modification partielle (on envoie uniquement les champs à modifier)
- **PUT** : remplacement complet (on envoie la ressource entière)

En pratique, PATCH est souvent préféré car plus flexible.

## Structure des URIs

Une bonne API REST utilise des URIs claires et cohérentes :

```
/api/{ressource}           → Collection (tous les éléments)
/api/{ressource}/{id}      → Élément spécifique
```

### Exemples concrets

```
GET    /api/products           → Récupère tous les produits
GET    /api/products/42        → Récupère le produit d'id 42
POST   /api/products           → Crée un nouveau produit
PATCH  /api/products/42        → Modifie le produit 42
DELETE /api/products/42        → Supprime le produit 42
```

### Paramètres de filtrage

On peut ajouter des paramètres dans l'URL pour filtrer les résultats :

```
GET /api/products?category=3   → Tous les produits de la catégorie 3
GET /api/products?name=chaise  → Recherche par nom
```

## Format des données : JSON

Les APIs REST modernes utilisent **JSON** (JavaScript Object Notation) pour échanger des données.

### Exemple de requête POST

**Requête :**
```http
POST /api/products HTTP/1.1
Content-Type: application/json

{
  "name": "Chaise ergonomique",
  "category": 3
}
```

**Réponse :**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 42,
  "name": "Chaise ergonomique",
  "category": 3
}
```

### Exemple de requête GET

**Requête :**
```http
GET /api/products/42 HTTP/1.1
```

**Réponse :**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 42,
  "name": "Chaise ergonomique",
  "category": 3
}
```

## Codes de statut HTTP

Les codes HTTP indiquent le résultat de la requête :

### Succès (2xx)

| Code | Signification | Utilisation |
|------|---------------|-------------|
| **200 OK** | Succès | GET, PATCH réussis |
| **201 Created** | Ressource créée | POST réussi |
| **204 No Content** | Succès sans contenu | DELETE réussi |

### Erreurs client (4xx)

| Code | Signification | Utilisation |
|------|---------------|-------------|
| **400 Bad Request** | Requête invalide | Données JSON malformées |
| **401 Unauthorized** | Non authentifié | Token manquant ou invalide |
| **403 Forbidden** | Accès refusé | Pas les droits suffisants |
| **404 Not Found** | Ressource introuvable | ID inexistant |

### Erreurs serveur (5xx)

| Code | Signification | Utilisation |
|------|---------------|-------------|
| **500 Internal Server Error** | Erreur serveur | Bug, exception non gérée |
| **503 Service Unavailable** | Service indisponible | Maintenance, surcharge |

## Requête OPTIONS et CORS

Quand un client web (navigateur) fait une requête vers un domaine différent, il envoie d'abord une requête **OPTIONS** (preflight) pour vérifier les permissions.

```http
OPTIONS /api/products HTTP/1.1
Origin: http://localhost:5173
Access-Control-Request-Method: POST
```

Le serveur doit répondre avec les en-têtes CORS appropriés :

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

> Voir le fichier `htaccess.md` pour plus de détails sur la configuration CORS.

## Bonnes pratiques

### ✅ À faire

- Utiliser des noms de ressources au pluriel (`/products` plutôt que `/product`)
- Utiliser les verbes HTTP corrects
- Renvoyer les bons codes de statut
- Utiliser JSON comme format d'échange
- Documenter votre API
- Valider les données entrantes
- Gérer les erreurs proprement

### ❌ À éviter

- Mettre des verbes dans les URIs (`/api/getProducts` ❌)
- Utiliser GET pour des actions qui modifient des données
- Renvoyer toujours 200 même en cas d'erreur
- Exposer des détails techniques dans les messages d'erreur
- Oublier la gestion CORS pour les clients web

## Tester une API REST

### Avec curl (ligne de commande)

```bash
# GET
curl http://localhost:8000/api/products

# GET avec ID
curl http://localhost:8000/api/products/42

# POST
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Chaise","category":3}'

# PATCH
curl -X PATCH http://localhost:8000/api/products/42 \
  -H "Content-Type: application/json" \
  -d '{"name":"Nouvelle chaise"}'

# DELETE
curl -X DELETE http://localhost:8000/api/products/42
```

### Avec JavaScript (fetch)

```javascript
// GET
const response = await fetch('http://localhost:8000/api/products');
const products = await response.json();

// POST
const response = await fetch('http://localhost:8000/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Chaise', category: 3 })
});
const newProduct = await response.json();
```

### Outils graphiques

- **Postman** : application pour tester des APIs
- **Insomnia** : alternative à Postman
- **DevTools du navigateur** : onglet Network pour voir les requêtes

## Pour aller plus loin

- **Authentification** : JWT, OAuth, sessions
- **Pagination** : limiter le nombre de résultats
- **Versioning** : `/api/v1/products`, `/api/v2/products`
- **HATEOAS** : inclure des liens dans les réponses
- **Documentation** : OpenAPI/Swagger, Postman Collections
- **Rate limiting** : limiter le nombre de requêtes par client

## Ressources

- [Documentation REST sur MDN](https://developer.mozilla.org/fr/docs/Glossary/REST)
- [HTTP Status Codes](https://httpstatuses.com/)
- [REST API Tutorial](https://restfulapi.net/)
