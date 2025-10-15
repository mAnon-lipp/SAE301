# Architecture du projet — API REST simplifiée

## Vue d'ensemble

Ce projet implémente une **API REST** côté serveur avec une architecture simplifiée inspirée du framework **Symfony**. L'objectif est pédagogique : comprendre les principes fondamentaux d'une architecture en couches avant d'utiliser un framework complet.

### Les trois couches principales

```
┌─────────────────────────────────────────┐
│           CLIENT (navigateur)           │
│         fetch(), XMLHttpRequest         │
└─────────────────┬───────────────────────┘
                  │ HTTP Request
                  ↓
┌─────────────────────────────────────────┐
│              CONTROLLER                 │
│   Reçoit la requête HTTP et orchestre   │
│        ProductController.php            │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│             REPOSITORY                  │
│    Gère l'accès aux données (BDD)       │
│       ProductRepository.php             │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│               ENTITY                    │
│    Représente un objet métier (modèle)  │
│            Product.php                  │
└─────────────────────────────────────────┘
```

## Structure des fichiers

```
api/
├── index.php                    # Point d'entrée unique
├── .htaccess                    # Configuration Apache (routage + CORS)
│
├── Class/                       # Classes utilitaires et entités
│   ├── Entity.php              # Classe abstraite pour les entités
│   ├── Product.php             # Entité Product
│   └── HttpRequest.php         # Encapsulation de la requête HTTP
│
├── Controller/                  # Contrôleurs
│   ├── Controller.php          # Contrôleur abstrait
│   └── ProductController.php   # Contrôleur des produits
│
└── Repository/                  # Couche d'accès aux données
    ├── EntityRepository.php    # Repository abstrait
    └── ProductRepository.php   # Repository des produits
```

## Le point d'entrée : index.php

Toutes les requêtes HTTP passent par `index.php` grâce au fichier `.htaccess`.

### Rôle de index.php

```php
// 1. Définir le routeur (mapping ressource → contrôleur)
$router = [
    "products" => new ProductController()
];

// 2. Encapsuler la requête HTTP
$request = new HttpRequest();

// 3. Gérer les requêtes preflight (CORS)
if ($request->getMethod() == "OPTIONS") {
    http_response_code(200);
    exit();
}

// 4. Router vers le bon contrôleur
$route = $request->getRessources();
if (isset($router[$route])) {
    $ctrl = $router[$route];
    $json = $ctrl->jsonResponse($request);
    
    if ($json) {
        header("Content-type: application/json;charset=utf-8");
        echo $json;
    } else {
        http_response_code(404);
    }
} else {
    http_response_code(404);
}
```

### Le routeur simplifié

Le "routeur" est un simple tableau associatif :
- **Clé** : nom de la ressource (ex: `"products"`)
- **Valeur** : instance du contrôleur correspondant

Pour ajouter une nouvelle ressource :

```php
$router = [
    "products" => new ProductController(),
    "users" => new UserController(),      // nouvelle ressource
    "orders" => new OrderController()      // nouvelle ressource
];
```

## Couche 1 : Les Entités (Entity)

### Entity.php — Classe abstraite

```php
abstract class Entity implements JsonSerializable {
    abstract public function jsonSerialize(): mixed;
}
```

**Rôle** : 
- Définir un contrat commun pour toutes les entités
- Obliger les entités à implémenter `jsonSerialize()` pour la sérialisation JSON

### Product.php — Entité concrète

```php
class Product extends Entity {
    private int $id;
    private ?string $name = null;
    private ?int $idcategory = null;
    
    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "category" => $this->idcategory
        ];
    }
    
    // getters et setters...
}
```

**Rôle** :
- Représenter un produit avec ses propriétés
- Définir comment un produit est converti en JSON
- Encapsuler les données avec getters/setters

### Pourquoi jsonSerialize() ?

PHP ne peut pas automatiquement convertir des objets avec propriétés privées en JSON. L'interface `JsonSerializable` permet de définir exactement ce qui doit être sérialisé :

```php
$product = new Product(42);
$product->setName("Chaise");
$product->setIdcategory(3);

echo json_encode($product);
// Résultat : {"id":42,"name":"Chaise","category":3}
```

## Couche 2 : Les Repositories

### EntityRepository.php — Repository abstrait

```php
abstract class EntityRepository {
    protected $cnx;  // Connexion PDO
    
    protected function __construct() {
        $this->cnx = new PDO("mysql:host=127.0.0.1:8889;dbname=SAE301", "root", "root");
    }
    
    abstract public function find($id);
    abstract public function findAll();
    abstract public function save($entity);
    abstract public function delete($id);
    abstract public function update($entity);
}
```

**Rôle** :
- Établir la connexion à la base de données
- Définir le contrat des opérations CRUD
- Être étendu par des repositories concrets

### ProductRepository.php — Repository concret

```php
class ProductRepository extends EntityRepository {
    
    public function find($id): ?Product {
        $requete = $this->cnx->prepare("SELECT * FROM Product WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $p = new Product($answer->id);
        $p->setName($answer->name);
        $p->setIdcategory($answer->category);
        return $p;
    }
    
    public function findAll(): array {
        $requete = $this->cnx->prepare("SELECT * FROM Product");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);
        
        $res = [];
        foreach($answer as $obj) {
            $p = new Product($obj->id);
            $p->setName($obj->name);
            $p->setIdcategory($obj->category);
            array_push($res, $p);
        }
        return $res;
    }
    
    public function save($product) {
        $requete = $this->cnx->prepare(
            "INSERT INTO Product (name, category) VALUES (:name, :idcategory)"
        );
        $name = $product->getName();
        $idcat = $product->getIdcategory();
        $requete->bindParam(':name', $name);
        $requete->bindParam(':idcategory', $idcat);
        $answer = $requete->execute();
        
        if ($answer) {
            $id = $this->cnx->lastInsertId();
            $product->setId($id);
            return true;
        }
        return false;
    }
}
```

**Rôle** :
- Implémenter les requêtes SQL spécifiques aux produits
- Convertir les résultats SQL en objets Product
- Gérer la persistance des données

### Pourquoi les requêtes préparées ?

```php
// ❌ DANGEREUX (injection SQL possible)
$requete = $this->cnx->query("SELECT * FROM Product WHERE id=$id");

// ✅ SÉCURISÉ (paramètres bindés)
$requete = $this->cnx->prepare("SELECT * FROM Product WHERE id=:value");
$requete->bindParam(':value', $id);
```

Les requêtes préparées avec `bindParam()` protègent contre les injections SQL.

## Couche 3 : Les Controllers

### Controller.php — Contrôleur abstrait

```php
abstract class Controller {
    
    public function jsonResponse(HttpRequest $request): ?string {
        $method = $request->getMethod();
        
        switch($method) {
            case "GET":
                $data = $this->processGetRequest($request);
                break;
            case "POST":
                $data = $this->processPostRequest($request);
                break;
            case "DELETE":
                $data = $this->processDeleteRequest($request);
                break;
            case "PATCH":
                $data = $this->processPatchRequest($request);
                break;
            default:
                $data = false;
        }
        
        if ($data) {
            return json_encode($data);
        }
        return null;
    }
    
    // Méthodes à implémenter dans les classes filles
    protected function processGetRequest(HttpRequest $request) { }
    protected function processPostRequest(HttpRequest $request) { }
    protected function processDeleteRequest(HttpRequest $request) { }
    protected function processPatchRequest(HttpRequest $request) { }
}
```

**Rôle** :
- Dispatcher les requêtes selon la méthode HTTP
- Convertir les données en JSON
- Fournir une structure commune à tous les contrôleurs

### ProductController.php — Contrôleur concret

```php
class ProductController extends Controller {
    private ProductRepository $products;
    
    public function __construct() {
        $this->products = new ProductRepository();
    }
    
    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId();
        
        if ($id) {
            // GET /api/products/42
            $p = $this->products->find($id);
            return $p == null ? false : $p;
        } else {
            // GET /api/products ou GET /api/products?category=3
            $cat = $request->getParam("category");
            
            if ($cat == false) {
                return $this->products->findAll();
            } else {
                return $this->products->findAllByCategory($cat);
            }
        }
    }
    
    protected function processPostRequest(HttpRequest $request) {
        // Récupérer et décoder le JSON
        $json = $request->getJson();
        $obj = json_decode($json);
        
        // Créer un nouveau produit
        $p = new Product(0);  // ID temporaire
        $p->setName($obj->name);
        $p->setIdcategory($obj->category);
        
        // Sauvegarder en base
        $ok = $this->products->save($p);
        
        return $ok ? $p : false;
    }
}
```

**Rôle** :
- Analyser la requête (ID, paramètres, corps JSON)
- Appeler les bonnes méthodes du repository
- Retourner les données à sérialiser en JSON

## Classe utilitaire : HttpRequest

Cette classe encapsule toutes les informations d'une requête HTTP.

```php
class HttpRequest {
    private string $method;        // GET, POST, DELETE, PATCH...
    private string $ressources;    // "products", "users"...
    private string $id;            // "42" ou ""
    private ?array $params;        // $_REQUEST
    private string $json;          // Corps de la requête
    
    public function __construct() {
        $this->method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $uri = $_SERVER["REQUEST_URI"] ?? '/';
        
        // Parser l'URI pour extraire ressource et id
        // /api/products/42 → ressources="products", id="42"
        // ...
        
        $this->params = $_REQUEST ?? [];
        $this->json = (string) file_get_contents("php://input");
    }
    
    // Getters...
}
```

**Rôle** :
- Encapsuler `$_SERVER`, `$_REQUEST`, `$_FILES`
- Parser l'URI pour extraire la ressource et l'ID
- Fournir un accès propre aux données de la requête

## Flux complet d'une requête

### Exemple : GET /api/products/42

```
1. Client                    →  GET /api/products/42
                                 
2. .htaccess                 →  Redirige vers index.php
                                 
3. index.php                 →  new HttpRequest()
                                 → méthode = "GET"
                                 → ressource = "products"
                                 → id = "42"
                                 
4. index.php                 →  $router["products"] → ProductController
                                 
5. Controller.php            →  jsonResponse() → processGetRequest()
                                 
6. ProductController.php     →  processGetRequest($request)
                                 → id = "42" ?
                                 → $this->products->find(42)
                                 
7. ProductRepository.php     →  find(42)
                                 → SELECT * FROM Product WHERE id=42
                                 → new Product(42)
                                 → setName(), setIdcategory()
                                 → return $product
                                 
8. ProductController.php     →  return $product
                                 
9. Controller.php            →  json_encode($product)
                                 → {"id":42,"name":"Chaise","category":3}
                                 
10. index.php                →  echo $json
                                 
11. Client                   ←  {"id":42,"name":"Chaise","category":3}
```

### Exemple : POST /api/products

```
1. Client                    →  POST /api/products
                                 Body: {"name":"Table","category":2}
                                 
2. .htaccess                 →  Redirige vers index.php
                                 
3. index.php                 →  new HttpRequest()
                                 → méthode = "POST"
                                 → ressource = "products"
                                 → json = '{"name":"Table","category":2}'
                                 
4. index.php                 →  ProductController → jsonResponse()
                                 
5. Controller.php            →  processPostRequest($request)
                                 
6. ProductController.php     →  $obj = json_decode($request->getJson())
                                 → new Product(0)
                                 → setName($obj->name)
                                 → setIdcategory($obj->category)
                                 → $this->products->save($product)
                                 
7. ProductRepository.php     →  save($product)
                                 → INSERT INTO Product...
                                 → $id = lastInsertId()
                                 → $product->setId($id)
                                 → return true
                                 
8. ProductController.php     →  return $product (avec son nouvel ID)
                                 
9. Controller.php            →  json_encode($product)
                                 
10. index.php                →  echo $json
                                 
11. Client                   ←  {"id":17,"name":"Table","category":2}
```

## Ajouter une nouvelle ressource

Pour ajouter une ressource "users" par exemple :

### 1. Créer l'entité

```php
// Class/User.php
class User extends Entity {
    private int $id;
    private ?string $username = null;
    private ?string $email = null;
    
    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "username" => $this->username,
            "email" => $this->email
        ];
    }
    
    // getters et setters...
}
```

### 2. Créer le repository

```php
// Repository/UserRepository.php
class UserRepository extends EntityRepository {
    public function find($id): ?User { /* ... */ }
    public function findAll(): array { /* ... */ }
    public function save($user) { /* ... */ }
    public function delete($id) { /* ... */ }
    public function update($user) { /* ... */ }
}
```

### 3. Créer le controller

```php
// Controller/UserController.php
class UserController extends Controller {
    private UserRepository $users;
    
    public function __construct() {
        $this->users = new UserRepository();
    }
    
    protected function processGetRequest(HttpRequest $request) { /* ... */ }
    protected function processPostRequest(HttpRequest $request) { /* ... */ }
    // ...
}
```

### 4. Enregistrer dans le routeur

```php
// index.php
$router = [
    "products" => new ProductController(),
    "users" => new UserController()  // ← Ajouter ici
];
```

C'est tout ! L'URI `/api/users` est maintenant fonctionnelle.

## Points d'attention et limites

### ✅ Points forts de cette architecture

- **Séparation des responsabilités** : chaque couche a un rôle précis
- **Réutilisabilité** : classes abstraites, héritage
- **Extensibilité** : facile d'ajouter de nouvelles ressources
- **Sécurité** : requêtes préparées contre les injections SQL
- **Simplicité** : idéal pour apprendre les concepts

### ⚠️ Limitations et améliorations possibles

| Limitation | Solution professionnelle |
|-----------|-------------------------|
| Pas de validation des données | Ajouter des validateurs (Symfony Validator) |
| Pas de gestion fine des erreurs | Exceptions personnalisées, gestionnaire global |
| Couplage fort (new direct) | Injection de dépendances (DI Container) |
| Pas d'authentification | JWT, OAuth, sessions sécurisées |
| Pas de tests unitaires | PHPUnit, fixtures |
| Configuration en dur (BDD) | Variables d'environnement (.env) |
| Routeur simpliste | Routeur avec paramètres nommés, wildcards |

## Comparaison avec Symfony

| Concept | Ce projet | Symfony |
|---------|-----------|---------|
| **Entité** | `Entity.php`, `Product.php` | Doctrine Entities avec annotations |
| **Repository** | `ProductRepository.php` | Doctrine Repository + QueryBuilder |
| **Controller** | `ProductController.php` | Controller avec attributs de routage |
| **Routeur** | Tableau associatif | Component Routing (annotations) |
| **Request** | `HttpRequest.php` | Symfony HttpFoundation |
| **Response** | `echo json_encode()` | JsonResponse |
| **Config** | En dur dans le code | YAML/XML/PHP + .env |
| **DI** | Aucune | Service Container |

## Pour aller plus loin

Une fois ces concepts maîtrisés, vous pouvez :

1. **Ajouter de la validation** : vérifier les données avant insertion
2. **Gérer les erreurs proprement** : try/catch, exceptions personnalisées
3. **Implémenter l'authentification** : JWT tokens, middleware d'auth
4. **Écrire des tests** : PHPUnit pour tester controllers et repositories
5. **Utiliser un framework** : Symfony, Laravel, Slim pour la production
6. **Découvrir les ORMs** : Doctrine, Eloquent pour simplifier la gestion BDD

## Ressources

- [Documentation Symfony](https://symfony.com/doc/current/index.html)
- [PHP PDO](https://www.php.net/manual/fr/book.pdo.php)
- [JsonSerializable](https://www.php.net/manual/fr/class.jsonserializable.php)
- [REST API Best Practices](https://restfulapi.net/)
