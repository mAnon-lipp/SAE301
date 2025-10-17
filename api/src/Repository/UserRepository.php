<?php
require_once("src/Repository/EntityRepository.php");
require_once("src/Class/User.php");

/**
 * Classe UserRepository
 * Gère l'accès aux données de l'entité User
 */
class UserRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    // Trouve un utilisateur par son ID
    public function find($id): ?User {
        $requete = $this->cnx->prepare("SELECT * FROM User WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $u = new User($answer->id);
        $u->setEmail($answer->email);
        $u->setPasswordHash($answer->password_hash);
        $u->setUsername($answer->username);
        return $u;
    }
    
    // Trouve un utilisateur par son email (crucial pour la connexion)
    public function findByEmail(string $email): ?User {
        $requete = $this->cnx->prepare("SELECT * FROM User WHERE email=:email");
        $requete->bindParam(':email', $email);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $u = new User($answer->id);
        $u->setEmail($answer->email);
        $u->setPasswordHash($answer->password_hash);
        $u->setUsername($answer->username);
        return $u;
    }

    /**
     * Sauvegarde un nouvel utilisateur. Le mot de passe DOIT être déjà hashé.
     */
    public function save($user): bool {
        $requete = $this->cnx->prepare("INSERT INTO User (email, password_hash, username) VALUES (:email, :password_hash, :username)");
        $email = $user->getEmail();
        $hash = $user->getPasswordHash();
        // Nom d'utilisateur par défaut si non fourni
        $username = $user->getUsername() ?? explode('@', $email)[0];
        
        $requete->bindParam(':email', $email);
        $requete->bindParam(':password_hash', $hash);
        $requete->bindParam(':username', $username);
        $answer = $requete->execute();

        if ($answer){
            $id = $this->cnx->lastInsertId();
            $user->setId((int)$id);
            $user->setUsername($username);
            return true;
        }
        
        return false;
    }
    
    public function findAll(): array { return []; }
    public function delete($id): bool { return false; }
    public function update($entity): bool { return false; }
}
?>
