<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

// Configuration de la session pour l'authentification cross-origin
if (session_status() === PHP_SESSION_NONE) {
    // Configurer les paramètres de cookie de session pour CORS
    session_set_cookie_params([
        'lifetime' => 86400, // 24 heures
        'path' => '/',
        'domain' => '', // Laisser vide pour le domaine actuel
        'secure' => true, // HTTPS uniquement (mettre false en dev local si HTTP)
        'httponly' => true, // Protection XSS
        'samesite' => 'None' // Nécessaire pour cross-origin avec credentials
    ]);
    session_start();
}

// Headers CORS pour permettre les requêtes cross-origin avec credentials
// Déterminer l'origine autorisée dynamiquement
$allowedOrigins = [
    'https://mmi.unilim.fr',
    'http://localhost:5173',
    'http://localhost:5174',  // Port Vite alternatif
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Par défaut, autoriser mmi.unilim.fr
    header("Access-Control-Allow-Origin: https://mmi.unilim.fr");
}

header("Access-Control-Allow-Methods: GET, POST, DELETE, PATCH, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 3600");

require_once "src/Controller/ProductController.php";
require_once "src/Controller/CategoryController.php";
require_once "src/Controller/ProductImageController.php";
require_once "src/Controller/UserController.php";
require_once "src/Controller/AuthController.php";
require_once "src/Controller/AdminController.php";
require_once "src/Controller/OrderController.php";
require_once "src/Controller/ProductVariantController.php";
require_once "src/Controller/OptionValueImageController.php";
require_once "src/Controller/StockThresholdController.php";
require_once "src/Class/HttpRequest.php";


/** IMPORTANT
 * 
 *  De part le .htaccess, toutes les requêtes seront redirigées vers ce fichier index.php
 * 
 *  On pose le principe que toutes les requêtes, pour être valides, doivent être dee la forme :
 * 
 *  http://.../api/ressources ou  http://.../api/ressources/{id}
 * 
 *  Par exemple : http://.../api/products ou  http://.../api/products/3
 */



/**
 *  $router est notre "routeur" rudimentaire.
 * 
 *  C'est un tableau associatif qui associe à chaque nom de ressource 
 *  le Controller en charge de traiter la requête.
 *  Ici ProductController est le controleur qui traitera toutes les requêtes ciblant la ressource "products"
 *  On ajoutera des "routes" à $router si l'on a d'autres ressource à traiter.
 */
$router = [
    "products" => new ProductController(),
    "categories" => new CategoryController(),
    "productimages" => new ProductImageController(),
    "user" => new UserController(), // Singulier pour le profil de l'utilisateur connecté
    "users" => new UserController(), // Garder le pluriel pour compatibilité (inscription)
    "auth" => new AuthController(),
    "admin" => new AdminController(),
    "orders" => new OrderController(), // US007 - Gestion des commandes
    "variants" => new ProductVariantController(), // US008 - Gestion des variants et options
    "optionvalueimages" => new OptionValueImageController(), // US008 - Images par option (couleur)
    "stockthresholds" => new StockThresholdController(), // US009 - Seuils de stock configurables
];

// objet HttpRequest qui contient toutes les infos utiles sur la requêtes (voir class/HttpRequest.php)
$request = new HttpRequest();

// gestion des requêtes preflight (CORS)
if ($request->getMethod() == "OPTIONS"){
    http_response_code(200);
    exit();
}

// on récupère la ressource ciblée par la requête
$route = $request->getRessources();

if ( isset($router[$route]) ){ // si on a un controleur pour cette ressource
    $ctrl = $router[$route];  // on le récupère
    $json = $ctrl->jsonResponse($request); // et on invoque jsonResponse pour obtenir la réponse (json) à la requête (voir class/Controller.php et ProductController.php)
    if ($json){ 
        header("Content-type: application/json;charset=utf-8");
        echo $json;
    }
    else{
        http_response_code(404); // en cas de problème pour produire la réponse, on retourne un 404
    }
    die();
}
http_response_code(404); // si on a pas de controlleur pour traiter la requête -> 404
die();

?>