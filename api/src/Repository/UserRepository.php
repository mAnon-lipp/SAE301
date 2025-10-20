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
        $u->setName($answer->name ?? '');
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
        $u->setName($answer->name ?? '');
        return $u;
    }

    /**
     * Sauvegarde un utilisateur (création ou mise à jour).
     * Le mot de passe DOIT être déjà hashé.
     */
    public function save($user): bool {
        // Si l'utilisateur a un ID, c'est une mise à jour
        if ($user->getId() > 0) {
            return $this->update($user);
        }
        
        // Sinon, c'est une création
        $requete = $this->cnx->prepare("INSERT INTO User (email, password_hash, username, name) VALUES (:email, :password_hash, :username, :name)");
        $email = $user->getEmail();
        $hash = $user->getPasswordHash();
        // Nom d'utilisateur par défaut si non fourni
        $username = $user->getUsername() ?? explode('@', $email)[0];
        $name = $user->getName() ?? '';
        
        $requete->bindParam(':email', $email);
        $requete->bindParam(':password_hash', $hash);
        $requete->bindParam(':username', $username);
        $requete->bindParam(':name', $name);
        $answer = $requete->execute();

        if ($answer){
            $id = $this->cnx->lastInsertId();
            $user->setId((int)$id);
            $user->setUsername($username);
            $user->setName($name);
            return true;
        }
        
        return false;
    }
    
    /**
     * Met à jour un utilisateur existant
     */
    public function update($user): bool {
        $requete = $this->cnx->prepare(
            "UPDATE User SET email=:email, password_hash=:password_hash, username=:username, name=:name WHERE id=:id"
        );
        
        $id = $user->getId();
        $email = $user->getEmail();
        $hash = $user->getPasswordHash();
        $username = $user->getUsername();
        $name = $user->getName() ?? '';
        
        $requete->bindParam(':id', $id);
        $requete->bindParam(':email', $email);
        $requete->bindParam(':password_hash', $hash);
        $requete->bindParam(':username', $username);
        $requete->bindParam(':name', $name);
        
        return $requete->execute();
    }
    
    /**
     * Récupère tous les utilisateurs (non implémenté pour des raisons de sécurité)
     */
    public function findAll(): array {
        // Non implémenté pour des raisons de sécurité
        return [];
    }
    
    /**
     * Supprime un utilisateur (non implémenté pour cette US)
     */
    public function delete($id): bool {
        // Non implémenté pour cette US
        return false;
    }
}
?>
