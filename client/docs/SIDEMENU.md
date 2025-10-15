# 🗂️ Side Menu - Filtrage par Catégorie

## 📝 Composant créé

Le composant **SideMenu** permet de filtrer les produits par catégorie avec :
- Un menu déroulant "CATÉGORIE" avec toutes les catégories
- Un bouton "Tous les produits" séparé
- Design conforme au Figma
- Filtrage dynamique des produits

## 📁 Structure

```
client/src/ui/sidemenu/
├── index.js              → Logique du composant
├── template.html         → Template principal
└── category-item.html    → Template pour chaque catégorie

client/src/data/
└── category.js           → Récupération des catégories
```

## 🎯 Fonctionnalités

### 1. Menu déroulant
- Cliquez sur "CATÉGORIE" pour ouvrir/fermer
- Animation de la flèche
- Liste des catégories dynamique

### 2. Filtrage
- Cliquez sur une catégorie → Affiche uniquement les produits de cette catégorie
- Cliquez sur "Tous les produits" → Affiche tous les produits

### 3. Données
- Récupère les catégories depuis l'API `/categories`
- Fallback vers des catégories fake si l'API échoue

## 🔧 Intégration dans la page products

La page products a été mise à jour pour :
1. Charger les catégories en même temps que les produits
2. Afficher le sidemenu à gauche
3. Gérer le filtrage par catégorie
4. Rafraîchir l'affichage des produits dynamiquement

## 🌐 API Catégories (Optionnel)

### Si vous voulez créer l'API pour les catégories :

#### 1. Créer `Category.php`

```php
<?php
// api/src/Class/Category.php

require_once ('Entity.php');

class Category extends Entity {
    private int $id;
    private ?string $name = null;

    public function __construct(int $id){
        $this->id = $id;
    }

    public function jsonSerialize(): mixed{
        return [
            "id" => $this->id,
            "name" => $this->name
        ];
    }

    public function getId(): int {
        return $this->id;
    }

    public function setId(int $id): self {
        $this->id = $id;
        return $this;
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): self {
        $this->name = $name;
        return $this;
    }
}
```

#### 2. Créer `CategoryRepository.php`

```php
<?php
// api/src/Repository/CategoryRepository.php

require_once("src/Repository/EntityRepository.php");
require_once("src/Class/Category.php");

class CategoryRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    public function find($id): ?Category{
        $requete = $this->cnx->prepare("select * from Category where id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer==false) return null;
        
        $c = new Category($answer->id);
        $c->setName($answer->name);
        return $c;
    }

    public function findAll(): array {
        $requete = $this->cnx->prepare("select * from Category");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj){
            $c = new Category($obj->id);
            $c->setName($obj->name);
            array_push($res, $c);
        }
       
        return $res;
    }

    public function save($category){
        $requete = $this->cnx->prepare("insert into Category (name) values (:name)");
        $name = $category->getName();
        $requete->bindParam(':name', $name);
        $answer = $requete->execute();

        if ($answer){
            $id = $this->cnx->lastInsertId();
            $category->setId($id);
            return true;
        }
          
        return false;
    }

    public function delete($id){
        $requete = $this->cnx->prepare("delete from Category where id=:value");
        $requete->bindParam(':value', $id);
        return $requete->execute();
    }

    public function update($id, $category){
        $requete = $this->cnx->prepare("update Category set name=:name where id=:id");
        $name = $category->getName();
        $requete->bindParam(':name', $name);
        $requete->bindParam(':id', $id);
        return $requete->execute();
    }
}
```

#### 3. Créer `CategoryController.php`

```php
<?php
// api/src/Controller/CategoryController.php

require_once "src/Controller/EntityController.php";
require_once "src/Repository/CategoryRepository.php";

class CategoryController extends EntityController {

    private CategoryRepository $categories;

    public function __construct(){
        $this->categories = new CategoryRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId("id");
        if ($id){
            // URI is .../categories/{id}
            $c = $this->categories->find($id);
            return $c==null ? false : $c;
        }
        else{
            // URI is .../categories
            return $this->categories->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
        $json = $request->getJson();
        $obj = json_decode($json);
        $c = new Category(0);
        $c->setName($obj->name);
        $ok = $this->categories->save($c);
        return $ok ? $c : false;
    }
}
```

#### 4. Ajouter la route dans `index.php`

```php
<?php
// api/index.php

require_once "src/Controller/ProductController.php";
require_once "src/Controller/CategoryController.php"; // ← Ajouter
require_once "src/Class/HttpRequest.php";

// ...

$router = [
    "products" => new ProductController(),
    "categories" => new CategoryController() // ← Ajouter
];

// ...
```

## 🎨 Personnalisation du design

### Modifier les couleurs

Dans `sidemenu/template.html` :
```html
<!-- Changer la couleur du titre -->
<span class="text-[#5f6368]">CATÉGORIE</span>

<!-- Changer la couleur des items -->
<button class="text-black hover:underline">{{name}}</button>
```

### Modifier la taille

```html
<aside class="w-64 flex-shrink-0"> <!-- ← Largeur du menu -->
```

### Ajouter des icônes

```html
<button>
  🛋️ {{name}}
</button>
```

## 📊 État actuel

✅ **Fonctionne sans API** : Le composant utilise des catégories fake si l'API n'existe pas

⚠️ **Pour utiliser l'API** : Créez les fichiers PHP ci-dessus

## 🧪 Tester

1. Ouvrez la page products : `http://localhost:5173/`
2. Cliquez sur "CATÉGORIE" pour ouvrir le menu
3. Cliquez sur une catégorie → Les produits sont filtrés
4. Cliquez sur "Tous les produits" → Tous les produits réapparaissent

## 🐛 Dépannage

### Le menu ne s'ouvre pas
Vérifiez que le JavaScript est bien chargé et qu'il n'y a pas d'erreur dans la console (F12)

### Le filtrage ne fonctionne pas
Vérifiez que vos produits ont bien une propriété `category` qui correspond aux IDs des catégories

### Pas de catégories affichées
C'est normal si l'API n'existe pas encore. Les catégories fake s'affichent automatiquement.
