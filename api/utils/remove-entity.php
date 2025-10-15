#!/usr/bin/env php
<?php
/**
 * Script de suppression d'entités de l'API REST
 * 
 * Usage : php delete-entity.php
 * 
 * Ce script supprime les 3 fichiers liés à une entité :
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
echo COLOR_RED . "╔═══════════════════════════════════════════════════╗\n";
echo "║   Suppresseur d'entités pour API REST            ║\n";
echo "║   ⚠ ATTENTION : Opération irréversible           ║\n";
echo "╚═══════════════════════════════════════════════════╝" . COLOR_RESET . "\n\n";

// Chemins des répertoires
$baseDir = __DIR__ . '/..';
$classDir = $baseDir . '/src/Class';
$controllerDir = $baseDir . '/src/Controller';
$repositoryDir = $baseDir . '/src/Repository';

// Lister les entités existantes (en se basant sur les fichiers dans Class/)
$existingEntities = [];
if (is_dir($classDir)) {
    $files = scandir($classDir);
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..' && $file !== 'Entity.php' && $file !== 'HttpRequest.php' && pathinfo($file, PATHINFO_EXTENSION) === 'php') {
            $entityName = pathinfo($file, PATHINFO_FILENAME);
            $existingEntities[] = $entityName;
        }
    }
}

if (empty($existingEntities)) {
    printWarning("Aucune entité trouvée à supprimer (à part Entity et HttpRequest).");
    exit(0);
}

// Afficher les entités disponibles
printInfo("Entités disponibles :");
foreach ($existingEntities as $index => $entity) {
    echo "  " . ($index + 1) . ". " . COLOR_BLUE . $entity . COLOR_RESET . "\n";
}
echo "\n";

// Demander le nom de l'entité
echo "Entrez le nom de l'entité à supprimer : ";
$entityName = trim(fgets(STDIN));

// Validation du nom
if (empty($entityName)) {
    printError("Le nom de l'entité ne peut pas être vide.");
    exit(1);
}

// Vérifier que l'entité n'est pas Entity ou HttpRequest (classes de base)
if ($entityName === 'Entity' || $entityName === 'HttpRequest') {
    printError("Vous ne pouvez pas supprimer les classes de base Entity ou HttpRequest.");
    exit(1);
}

// Chemins des fichiers à supprimer
$entityFile = $classDir . '/' . $entityName . '.php';
$controllerFile = $controllerDir . '/' . $entityName . 'Controller.php';
$repositoryFile = $repositoryDir . '/' . $entityName . 'Repository.php';

// Vérifier quels fichiers existent
$filesToDelete = [];
if (file_exists($entityFile)) {
    $filesToDelete[] = [
        'path' => $entityFile,
        'name' => "src/Class/$entityName.php"
    ];
}
if (file_exists($controllerFile)) {
    $filesToDelete[] = [
        'path' => $controllerFile,
        'name' => "src/Controller/{$entityName}Controller.php"
    ];
}
if (file_exists($repositoryFile)) {
    $filesToDelete[] = [
        'path' => $repositoryFile,
        'name' => "src/Repository/{$entityName}Repository.php"
    ];
}

if (empty($filesToDelete)) {
    printError("Aucun fichier trouvé pour l'entité '$entityName'.");
    exit(1);
}

// Afficher les fichiers qui seront supprimés
echo "\n";
printWarning("Les fichiers suivants seront SUPPRIMÉS DÉFINITIVEMENT :");
foreach ($filesToDelete as $file) {
    echo COLOR_RED . "  ✗ " . $file['name'] . COLOR_RESET . "\n";
}
echo "\n";

// Demander confirmation
echo COLOR_RED . "Cette opération est IRRÉVERSIBLE !" . COLOR_RESET . "\n";
echo "Voulez-vous vraiment supprimer l'entité '$entityName' ? (tapez 'oui' pour confirmer) : ";
$confirm = trim(fgets(STDIN));

if (strtolower($confirm) !== 'oui') {
    printInfo("Opération annulée.");
    exit(0);
}

echo "\n";
printInfo("Suppression en cours...\n");

// Supprimer les fichiers
$deletedCount = 0;
$errors = [];

foreach ($filesToDelete as $file) {
    if (unlink($file['path'])) {
        printSuccess("Supprimé : " . $file['name']);
        $deletedCount++;
    } else {
        printError("Échec de suppression : " . $file['name']);
        $errors[] = $file['name'];
    }
}

echo "\n";

if (empty($errors)) {
    printSuccess("Suppression terminée avec succès ! ($deletedCount fichier(s) supprimé(s))");
    
    echo "\n";
    printWarning("IMPORTANT : Actions manuelles requises :\n");
    echo "  1. " . COLOR_YELLOW . "Supprimez la route dans index.php :" . COLOR_RESET . "\n";
    echo "     Recherchez et supprimez la ligne :\n";
    echo COLOR_RED . "     \$router[\"" . strtolower($entityName) . "s\"] = new {$entityName}Controller();" . COLOR_RESET . "\n";
    echo "\n";
    echo "  2. " . COLOR_YELLOW . "Supprimez la table SQL correspondante (si elle existe) :" . COLOR_RESET . "\n";
    echo "     DROP TABLE IF EXISTS " . $entityName . ";\n";
    echo "\n";
    echo "  3. " . COLOR_YELLOW . "Vérifiez les dépendances :" . COLOR_RESET . "\n";
    echo "     D'autres entités utilisent peut-être $entityName.\n";
    
} else {
    printError("Des erreurs se sont produites lors de la suppression :");
    foreach ($errors as $error) {
        echo "  - $error\n";
    }
    exit(1);
}

echo "\n";
