<?php

require_once('Entity.php');

/**
 * Class OptionValue
 * 
 * Représente une valeur spécifique d'un type d'option
 * Ex: Pour OptionType "Size", les OptionValue pourraient être "35", "36", "38", etc.
 * Ex: Pour OptionType "Color", les OptionValue pourraient être "White", "Black", etc.
 * 
 * Implémente l'interface JsonSerializable pour la conversion en JSON
 */
class OptionValue extends Entity {
    private int $id;
    private int $option_type_id;
    private string $value;
    private ?string $label = null;

    public function __construct(int $id) {
        $this->id = $id;
    }

    /**
     * Définit comment convertir un OptionValue en JSON
     * 
     * @return array Représentation de la valeur d'option sous forme de tableau associatif
     */
    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "option_type_id" => $this->option_type_id,
            "value" => $this->value,
            "label" => $this->label ?? $this->value
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
     * Get the value of option_type_id
     */
    public function getOptionTypeId(): int {
        return $this->option_type_id;
    }

    /**
     * Set the value of option_type_id
     * 
     * @return self
     */
    public function setOptionTypeId(int $option_type_id): self {
        $this->option_type_id = $option_type_id;
        return $this;
    }

    /**
     * Get the value of value
     */
    public function getValue(): string {
        return $this->value;
    }

    /**
     * Set the value of value
     * 
     * @return self
     */
    public function setValue(string $value): self {
        $this->value = $value;
        return $this;
    }

    /**
     * Get the value of label
     */
    public function getLabel(): ?string {
        return $this->label;
    }

    /**
     * Set the value of label
     * 
     * @return self
     */
    public function setLabel(?string $label): self {
        $this->label = $label;
        return $this;
    }
}
