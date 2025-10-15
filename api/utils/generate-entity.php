#!/usr/bin/env php
<?php
/**
 * Script de génération automatique d'entités pour l'API REST
 * 
 * Usage : php generate-entity.php
 * 
 * Ce script génère automatiquement les 3 fichiers nécessaires pour une nouvelle entité :
 * - src/Class/{Entity}.php
 * - src/Controller/{Entity}Controller.php
 * - src/Repository/{Entity}Repository.php
 */

// Couleurs pour le terminal
const COLOR_GREEN = "\033[32m";
const COLOR_YELLOW = "\033[33m";
const COLOR_RED = "\033[31m";
const COLOR_BLUE = "\033[34m";
const COLOR_RESET = "\033[0m";

function printSuccess($message) {
    echo COLOR_GREEN . "✓ " . $message . COLOR_RESET . "\n";
}

function printWarning($message) {
    echo COLOR_YELLOW . "⚠ " . $message . COLOR_RESET . "\n";
}

function printError($message) {
    echo COLOR_RED . "✗ " . $message . COLOR_RESET . "\n";
}

function printInfo($message) {
    echo COLOR_BLUE . "ℹ " . $message . COLOR_RESET . "\n";
}

// Bannière
echo "\n";
echo COLOR_BLUE . "╔═══════════════════════════════════════════════════╗\n";
echo "║   Générateur d'entités pour API REST             ║\n";
echo "║   Entity + Controller + Repository               ║\n";
echo "╚═══════════════════════════════════════════════════╝" . COLOR_RESET . "\n\n";

// Demander le nom de l'entité
echo "Entrez le nom de l'entité (ex: User, Order, Category) : ";
$entityName = trim(fgets(STDIN));

// Validation du nom
if (empty($entityName)) {
    printError("Le nom de l'entité ne peut pas être vide.");
    exit(1);
}

// Vérifier que le nom commence par une majuscule
if (!preg_match('/^[A-Z][a-zA-Z0-9]*$/', $entityName)) {
    printWarning("Le nom devrait commencer par une majuscule et ne contenir que des lettres.");
    echo "Voulez-vous continuer quand même ? (o/n) : ";
    $confirm = trim(fgets(STDIN));
    if (strtolower($confirm) !== 'o') {
        exit(0);
    }
}

// Chemins des répertoires
$baseDir = __DIR__ . '/..';
$classDir = $baseDir . '/src/Class';
$controllerDir = $baseDir . '/src/Controller';
$repositoryDir = $baseDir . '/src/Repository';

// Vérifier que les répertoires existent
foreach ([$classDir, $controllerDir, $repositoryDir] as $dir) {
    if (!is_dir($dir)) {
        printError("Le répertoire $dir n'existe pas.");
        exit(1);
    }
}

// Chemins des fichiers à créer
$entityFile = $classDir . '/' . $entityName . '.php';
$controllerFile = $controllerDir . '/' . $entityName . 'Controller.php';
$repositoryFile = $repositoryDir . '/' . $entityName . 'Repository.php';

// Vérifier si les fichiers existent déjà
$filesExist = [];
if (file_exists($entityFile)) $filesExist[] = $entityName . '.php';
if (file_exists($controllerFile)) $filesExist[] = $entityName . 'Controller.php';
if (file_exists($repositoryFile)) $filesExist[] = $entityName . 'Repository.php';

if (!empty($filesExist)) {
    printWarning("Les fichiers suivants existent déjà : " . implode(', ', $filesExist));
    echo "Voulez-vous les écraser ? (o/n) : ";
    $confirm = trim(fgets(STDIN));
    if (strtolower($confirm) !== 'o') {
        printInfo("Opération annulée.");
        exit(0);
    }
}

echo "\n";
printInfo("Génération des fichiers pour l'entité '$entityName'...\n");

// ==================== GÉNÉRATION DE L'ENTITÉ ====================

$entityContent = <<<PHP
<?php
require_once 'Entity.php';

/**
 * Class $entityName
 * 
 * Représente un objet $entityName
 * 
 * Implémente l'interface JsonSerializable pour permettre la conversion en JSON
 */
class $entityName extends Entity {
    private int \$id;
    // TODO: Ajouter vos propriétés ici
    // Exemple :
    // private ?string \$name = null;
    // private ?string \$description = null;

    public function __construct(int \$id) {
        \$this->id = \$id;
    }

    /**
     * Définit comment convertir l'objet $entityName en JSON
     * 
     * @return mixed Tableau associatif représentant l'objet
     */
    public function jsonSerialize(): mixed {
        return [
            "id" => \$this->id,
            // TODO: Ajouter vos propriétés dans la sérialisation
            // "name" => \$this->name,
            // "description" => \$this->description,
        ];
    }

    /**
     * Get the value of id
     */
    public function getId(): int {
        return \$this->id;
    }

    /**
     * Set the value of id
     */
    public function setId(int \$id): self {
        \$this->id = \$id;
        return \$this;
    }

    // TODO: Ajouter vos getters et setters ici
    // Exemple :
    //
    // public function getName(): ?string {
    //     return \$this->name;
    // }
    //
    // public function setName(string \$name): self {
    //     \$this->name = \$name;
    //     return \$this;
    // }
}

PHP;

// ==================== GÉNÉRATION DU REPOSITORY ====================

$repositoryContent = <<<PHP
<?php
require_once 'EntityRepository.php';
require_once '../Class/$entityName.php';

/**
 * Classe {$entityName}Repository
 * 
 * Gère l'accès aux données de l'entité $entityName
 * Toutes les opérations CRUD doivent passer par cette classe
 */
class {$entityName}Repository extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Récupère un $entityName par son ID
     * 
     * @param mixed \$id L'identifiant du $entityName
     * @return ?$entityName L'objet $entityName ou null si non trouvé
     */
    public function find(\$id): ?$entityName {
        // TODO: Implémenter la requête SQL
        // Exemple :
        /*
        \$requete = \$this->cnx->prepare("SELECT * FROM {$entityName} WHERE id=:value");
        \$requete->bindParam(':value', \$id);
        \$requete->execute();
        \$answer = \$requete->fetch(PDO::FETCH_OBJ);
        
        if (\$answer == false) return null;
        
        \$entity = new $entityName(\$answer->id);
        // \$entity->setName(\$answer->name);
        // TODO: Hydrater l'objet avec les données de la BDD
        
        return \$entity;
        */
        
        return null; // À remplacer par votre implémentation
    }

    /**
     * Récupère tous les {$entityName}s
     * 
     * @return array Tableau d'objets $entityName
     */
    public function findAll(): array {
        // TODO: Implémenter la requête SQL
        // Exemple :
        /*
        \$requete = \$this->cnx->prepare("SELECT * FROM {$entityName}");
        \$requete->execute();
        \$answer = \$requete->fetchAll(PDO::FETCH_OBJ);

        \$res = [];
        foreach (\$answer as \$obj) {
            \$entity = new $entityName(\$obj->id);
            // \$entity->setName(\$obj->name);
            // TODO: Hydrater chaque objet
            array_push(\$res, \$entity);
        }
        
        return \$res;
        */
        
        return []; // À remplacer par votre implémentation
    }

    /**
     * Sauvegarde un nouveau $entityName dans la base de données
     * 
     * @param mixed \$entity L'objet $entityName à sauvegarder
     * @return bool true si succès, false sinon
     */
    public function save(\$entity): bool {
        // TODO: Implémenter la requête INSERT
        // Exemple :
        /*
        \$requete = \$this->cnx->prepare(
            "INSERT INTO {$entityName} (name, description) VALUES (:name, :description)"
        );
        \$name = \$entity->getName();
        \$description = \$entity->getDescription();
        \$requete->bindParam(':name', \$name);
        \$requete->bindParam(':description', \$description);
        \$answer = \$requete->execute();

        if (\$answer) {
            \$id = \$this->cnx->lastInsertId();
            \$entity->setId((int)\$id);
            return true;
        }
        
        return false;
        */
        
        return false; // À remplacer par votre implémentation
    }

    /**
     * Supprime un $entityName de la base de données
     * 
     * @param mixed \$id L'identifiant du $entityName à supprimer
     * @return bool true si succès, false sinon
     */
    public function delete(\$id): bool {
        // TODO: Implémenter la requête DELETE
        // Exemple :
        /*
        \$requete = \$this->cnx->prepare("DELETE FROM {$entityName} WHERE id=:value");
        \$requete->bindParam(':value', \$id);
        return \$requete->execute();
        */
        
        return false; // À remplacer par votre implémentation
    }

    /**
     * Met à jour un $entityName existant dans la base de données
     * 
     * @param mixed \$entity L'objet $entityName à mettre à jour
     * @return bool true si succès, false sinon
     */
    public function update(\$entity): bool {
        // TODO: Implémenter la requête UPDATE
        // Exemple :
        /*
        \$requete = \$this->cnx->prepare(
            "UPDATE {$entityName} SET name=:name, description=:description WHERE id=:id"
        );
        \$id = \$entity->getId();
        \$name = \$entity->getName();
        \$description = \$entity->getDescription();
        \$requete->bindParam(':id', \$id);
        \$requete->bindParam(':name', \$name);
        \$requete->bindParam(':description', \$description);
        return \$requete->execute();
        */
        
        return false; // À remplacer par votre implémentation
    }

    // TODO: Ajouter vos méthodes de recherche personnalisées ici
    // Exemple :
    //
    // public function findAllByCategory(\$categoryId): array {
    //     \$requete = \$this->cnx->prepare("SELECT * FROM {$entityName} WHERE category_id=:cat");
    //     \$requete->bindParam(':cat', \$categoryId);
    //     \$requete->execute();
    //     // ...
    // }
}

PHP;

// ==================== GÉNÉRATION DU CONTROLLER ====================

$controllerContent = <<<PHP
<?php
require_once 'Controller.php';
require_once '../Repository/{$entityName}Repository.php';

/**
 * Classe {$entityName}Controller
 * 
 * Gère les requêtes HTTP concernant l'entité $entityName
 * Hérite de Controller pour bénéficier de la méthode jsonResponse()
 */
class {$entityName}Controller extends Controller {

    private {$entityName}Repository \$repository;

    public function __construct() {
        \$this->repository = new {$entityName}Repository();
    }

    /**
     * Traite les requêtes GET
     * 
     * GET /api/{strtolower($entityName)}s        → Récupère tous les {$entityName}s
     * GET /api/{strtolower($entityName)}s/{id}   → Récupère un $entityName spécifique
     * 
     * @param HttpRequest \$request
     * @return mixed Données à convertir en JSON, ou false en cas d'erreur
     */
    protected function processGetRequest(HttpRequest \$request) {
        \$id = \$request->getId();
        
        if (\$id) {
            // GET /api/{strtolower($entityName)}s/{id}
            \$entity = \$this->repository->find(\$id);
            return \$entity == null ? false : \$entity;
        } else {
            // GET /api/{strtolower($entityName)}s
            // TODO: Gérer les paramètres de filtrage si nécessaire
            // Exemple :
            // \$category = \$request->getParam("category");
            // if (\$category) {
            //     return \$this->repository->findAllByCategory(\$category);
            // }
            
            return \$this->repository->findAll();
        }
    }

    /**
     * Traite les requêtes POST
     * 
     * POST /api/{strtolower($entityName)}s       → Crée un nouveau $entityName
     * 
     * @param HttpRequest \$request
     * @return mixed Le $entityName créé avec son ID, ou false en cas d'erreur
     */
    protected function processPostRequest(HttpRequest \$request) {
        // TODO: Implémenter la création
        // Exemple :
        /*
        \$json = \$request->getJson();
        \$obj = json_decode(\$json);
        
        // Validation basique
        if (!isset(\$obj->name)) {
            return false;
        }
        
        \$entity = new $entityName(0);
        \$entity->setName(\$obj->name);
        // TODO: Hydrater l'objet avec les données reçues
        
        \$ok = \$this->repository->save(\$entity);
        return \$ok ? \$entity : false;
        */
        
        return false; // À remplacer par votre implémentation
    }

    /**
     * Traite les requêtes DELETE
     * 
     * DELETE /api/{strtolower($entityName)}s/{id} → Supprime un $entityName
     * 
     * @param HttpRequest \$request
     * @return mixed true si supprimé, false sinon
     */
    protected function processDeleteRequest(HttpRequest \$request) {
        // TODO: Implémenter la suppression
        // Exemple :
        /*
        \$id = \$request->getId();
        
        if (!\$id) {
            return false;
        }
        
        return \$this->repository->delete(\$id);
        */
        
        return false; // À remplacer par votre implémentation
    }

    /**
     * Traite les requêtes PATCH
     * 
     * PATCH /api/{strtolower($entityName)}s/{id}  → Met à jour un $entityName
     * 
     * @param HttpRequest \$request
     * @return mixed Le $entityName modifié, ou false en cas d'erreur
     */
    protected function processPatchRequest(HttpRequest \$request) {
        // TODO: Implémenter la modification
        // Exemple :
        /*
        \$id = \$request->getId();
        
        if (!\$id) {
            return false;
        }
        
        \$entity = \$this->repository->find(\$id);
        if (!\$entity) {
            return false;
        }
        
        \$json = \$request->getJson();
        \$obj = json_decode(\$json);
        
        // Mise à jour des propriétés (uniquement celles fournies)
        if (isset(\$obj->name)) {
            \$entity->setName(\$obj->name);
        }
        // TODO: Mettre à jour les autres propriétés
        
        \$ok = \$this->repository->update(\$entity);
        return \$ok ? \$entity : false;
        */
        
        return false; // À remplacer par votre implémentation
    }

    /**
     * Traite les requêtes PUT
     * 
     * PUT /api/{strtolower($entityName)}s/{id}    → Remplace complètement un $entityName
     * 
     * @param HttpRequest \$request
     * @return mixed Le $entityName remplacé, ou false en cas d'erreur
     */
    protected function processPutRequest(HttpRequest \$request) {
        // TODO: Implémenter le remplacement complet (optionnel)
        // Note : PATCH est généralement préféré à PUT
        return false;
    }
}

PHP;

// ==================== ÉCRITURE DES FICHIERS ====================

$success = true;

// Écrire l'entité
if (file_put_contents($entityFile, $entityContent) !== false) {
    printSuccess("Entité créée : src/Class/$entityName.php");
} else {
    printError("Échec de la création de l'entité");
    $success = false;
}

// Écrire le repository
if (file_put_contents($repositoryFile, $repositoryContent) !== false) {
    printSuccess("Repository créé : src/Repository/{$entityName}Repository.php");
} else {
    printError("Échec de la création du repository");
    $success = false;
}

// Écrire le controller
if (file_put_contents($controllerFile, $controllerContent) !== false) {
    printSuccess("Controller créé : src/Controller/{$entityName}Controller.php");
} else {
    printError("Échec de la création du controller");
    $success = false;
}

echo "\n";

if ($success) {
    printSuccess("Génération terminée avec succès !");
    echo "\n";
    printInfo("Prochaines étapes :\n");
    echo "  1. Complétez les propriétés dans src/Class/$entityName.php\n";
    echo "  2. Implémentez les méthodes CRUD dans src/Repository/{$entityName}Repository.php\n";
    echo "  3. Complétez les méthodes HTTP dans src/Controller/{$entityName}Controller.php\n";
    echo "  4. Ajoutez la route dans index.php :\n";
    echo COLOR_YELLOW . "     \$router[\"" . strtolower($entityName) . "s\"] = new {$entityName}Controller();" . COLOR_RESET . "\n";
    echo "  5. Créez la table SQL correspondante dans votre base de données\n";
} else {
    printError("Des erreurs se sont produites lors de la génération.");
    exit(1);
}

echo "\n";
