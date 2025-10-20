<?php
require_once ('Entity.php');

/**
 * Class User
 * Représente un utilisateur avec id, email et mot de passe (hashé)
 */
class User extends Entity {
    private int $id;
    private ?string $email = null;
    private ?string $password_hash = null;
    private ?string $username = null;
    private ?string $name = null;

    public function __construct(int $id){
        $this->id = $id;
    }

    // Ne jamais sérialiser le hash du mot de passe
    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "email" => $this->email,
            "username" => $this->username,
            "name" => $this->name
        ];
    }

    // Getters
    public function getId(): int { return $this->id; }
    public function getEmail(): ?string { return $this->email; }
    public function getPasswordHash(): ?string { return $this->password_hash; }
    public function getUsername(): ?string { return $this->username; }
    public function getName(): ?string { return $this->name; }

    // Setters
    public function setId(int $id): self { $this->id = $id; return $this; }
    public function setEmail(string $email): self { $this->email = $email; return $this; }
    public function setPasswordHash(string $password_hash): self { $this->password_hash = $password_hash; return $this; }
    public function setUsername(string $username): self { $this->username = $username; return $this; }
    public function setName(string $name): self { $this->name = $name; return $this; }
}
?>
