<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/UserRepository.php";
require_once "src/Class/User.php";

/**
 * UserController
 * Gère les requêtes relatives aux utilisateurs (notamment la création / inscription)
 */
class UserController extends EntityController {

    private UserRepository $users;

    public function __construct(){
        $this->users = new UserRepository();
    }

    // Inscription (Critère d'acceptation 1)
    protected function processPostRequest(HttpRequest $request) {
        $json = $request->getJson();
        $obj = json_decode($json);

        if (!isset($obj->email) || !isset($obj->password) || empty($obj->email) || empty($obj->password)) {
            http_response_code(400);
            return ["error" => "Email et mot de passe requis."];
        }
        
        if ($this->users->findByEmail($obj->email)) {
            http_response_code(409); // Conflict
            return ["error" => "Cet email est déjà utilisé."];
        }

        $u = new User(0);
        $u->setEmail($obj->email);
        
        // Hachage sécurisé du mot de passe (Critère d'acceptation 4 / DoD 2)
        $hashedPassword = password_hash($obj->password, PASSWORD_DEFAULT);
        $u->setPasswordHash($hashedPassword);
        
        if (isset($obj->username)) {
            $u->setUsername($obj->username);
        }
        
        $ok = $this->users->save($u); 
        
        if ($ok) {
            http_response_code(201);
            return $u;
        } else {
            http_response_code(500);
            return ["error" => "Échec de la création de l'utilisateur."];
        }
    }
    
    protected function processGetRequest(HttpRequest $request) {
        // Démarrer la session si nécessaire
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Vérifier l'authentification
        if (!isset($_SESSION['auth_user_id'])) {
            http_response_code(401);
            return ["error" => "Non authentifié."];
        }
        
        $id = $request->getId();
        
        // Si pas d'ID, retourner l'utilisateur connecté
        if (!$id) {
            $id = $_SESSION['auth_user_id'];
        }
        
        // Vérifier que l'utilisateur ne peut accéder qu'à son propre profil
        if ($id != $_SESSION['auth_user_id']) {
            http_response_code(403);
            return ["error" => "Accès non autorisé."];
        }
        
        $user = $this->users->find($id);
        if ($user == null) {
            http_response_code(404);
            return ["error" => "Utilisateur introuvable."];
        }
        return $user;
    }
    
    // Mise à jour du profil utilisateur (PATCH pour modifications partielles)
    protected function processPatchRequest(HttpRequest $request) {
        // Démarrer la session si nécessaire
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Vérifier l'authentification
        if (!isset($_SESSION['auth_user_id'])) {
            http_response_code(401);
            return ["error" => "Non authentifié."];
        }
        
        $id = $request->getId();
        
        // Si pas d'ID, utiliser l'utilisateur connecté
        if (!$id) {
            $id = $_SESSION['auth_user_id'];
        }
        
        // Vérifier que l'utilisateur ne peut modifier que son propre profil
        if ($id != $_SESSION['auth_user_id']) {
            http_response_code(403);
            return ["error" => "Accès non autorisé."];
        }
        
        $user = $this->users->find($id);
        if (!$user) {
            http_response_code(404);
            return ["error" => "Utilisateur introuvable."];
        }
        
        $json = $request->getJson();
        $obj = json_decode($json);
        
        // Validation et mise à jour du nom
        if (isset($obj->name)) {
            if (empty(trim($obj->name))) {
                http_response_code(400);
                return ["error" => "Le nom ne peut pas être vide."];
            }
            $user->setName($obj->name);
        }
        
        // Validation et mise à jour de l'email
        if (isset($obj->email)) {
            if (!filter_var($obj->email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                return ["error" => "Format d'email invalide."];
            }
            
            // Vérifier si l'email n'est pas déjà utilisé par un autre utilisateur
            $existingUser = $this->users->findByEmail($obj->email);
            if ($existingUser && $existingUser->getId() != $id) {
                http_response_code(409);
                return ["error" => "Cet email est déjà utilisé."];
            }
            
            $user->setEmail($obj->email);
            // Le username n'est plus synchronisé, on garde l'email comme identifiant principal
            
            // Mettre à jour la session
            $_SESSION['auth_user_email'] = $obj->email;
        }
        
        // Validation et mise à jour du mot de passe
        if (isset($obj->old_password) && isset($obj->new_password)) {
            // Vérifier l'ancien mot de passe
            if (!password_verify($obj->old_password, $user->getPasswordHash())) {
                http_response_code(400);
                return ["error" => "Ancien mot de passe incorrect."];
            }
            
            // Valider le nouveau mot de passe
            if (strlen($obj->new_password) < 6) {
                http_response_code(400);
                return ["error" => "Le nouveau mot de passe doit contenir au moins 6 caractères."];
            }
            
            $hashedPassword = password_hash($obj->new_password, PASSWORD_DEFAULT);
            $user->setPasswordHash($hashedPassword);
        }
        
        // Sauvegarder les modifications
        $ok = $this->users->save($user);
        
        if ($ok) {
            http_response_code(200);
            return ["success" => true, "user" => $user];
        } else {
            http_response_code(500);
            return ["error" => "Échec de la mise à jour du profil."];
        }
    }

    // Autres méthodes désactivées pour cette US
    protected function processDeleteRequest(HttpRequest $request) { http_response_code(405); return ["error" => "Méthode non autorisée."]; }
    protected function processPutRequest(HttpRequest $request) { http_response_code(405); return ["error" => "Méthode non autorisée."]; }
}
?>
