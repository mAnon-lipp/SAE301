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
        // Logique pour une page de profil basique (Critère d'acceptation 6)
        $id = $request->getId();
        if ($id){
            $user = $this->users->find($id);
            if ($user == null) {
                http_response_code(404);
                return ["error" => "Utilisateur introuvable."];
            }
            return $user;
        }
        http_response_code(403);
        return ["error" => "Accès non autorisé."];
    }

    // Autres méthodes désactivées pour cette US
    protected function processDeleteRequest(HttpRequest $request) { http_response_code(405); return ["error" => "Méthode non autorisée."]; }
    protected function processPatchRequest(HttpRequest $request) { http_response_code(405); return ["error" => "Méthode non autorisée."]; }
    protected function processPutRequest(HttpRequest $request) { http_response_code(405); return ["error" => "Méthode non autorisée."]; }
}
?>
