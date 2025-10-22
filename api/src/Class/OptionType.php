<?php

require_once('Entity.php');

/**
 * Class OptionType
 * 
 * Représente un type d'option pour les produits (ex: Size, Color, Material)
 * Un OptionType peut avoir plusieurs OptionValue
 * 
 * Implémente l'interface JsonSerializable pour la conversion en JSON
 */
class OptionType extends Entity {
    private int $id;
    private string $name;

    public function __construct(int $id) {
        $this->id = $id;
    }

    /**
     * Définit comment convertir un OptionType en JSON
     * 
     * @return array Représentation du type d'option sous forme de tableau associatif
     */
    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "name" => $this->name
        ];
    }

    /**
     * Get the value of id
     */
    public function getId(): int {
        return $this->id;
    }

    /**
     * Set the value of id
     * 
     * @return self
     */
    public function setId(int $id): self {
        $this->id = $id;
        return $this;
    }

    /**
     * Get the value of name
     */
    public function getName(): string {
        return $this->name;
    }

    /**
     * Set the value of name
     * 
     * @return self
     */
    public function setName(string $name): self {
        $this->name = $name;
        return $this;
    }
}
