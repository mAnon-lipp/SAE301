<?php

require_once('Entity.php');

/**
 * Class ProductVariant
 * 
 * Représente un variant de produit avec ses options spécifiques (taille, couleur, etc.)
 * Chaque variant a son propre prix, stock et SKU
 * 
 * Implémente l'interface JsonSerializable pour la conversion en JSON
 */
class ProductVariant extends Entity {
    private int $id;
    private int $product_id;
    private ?string $sku = null;
    private float $price;
    private int $stock = 0;
    private array $options = []; // Tableau d'options associées à ce variant

    public function __construct(int $id) {
        $this->id = $id;
    }

    /**
     * Définit comment convertir un ProductVariant en JSON
     * 
     * @return array Représentation du variant sous forme de tableau associatif
     */
    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "product_id" => $this->product_id,
            "sku" => $this->sku,
            "price" => $this->price,
            "stock" => $this->stock,
            "options" => $this->options
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
     * Get the value of product_id
     */
    public function getProductId(): int {
        return $this->product_id;
    }

    /**
     * Set the value of product_id
     * 
     * @return self
     */
    public function setProductId(int $product_id): self {
        $this->product_id = $product_id;
        return $this;
    }

    /**
     * Get the value of sku
     */
    public function getSku(): ?string {
        return $this->sku;
    }

    /**
     * Set the value of sku
     * 
     * @return self
     */
    public function setSku(?string $sku): self {
        $this->sku = $sku;
        return $this;
    }

    /**
     * Get the value of price
     */
    public function getPrice(): float {
        return $this->price;
    }

    /**
     * Set the value of price
     * 
     * @return self
     */
    public function setPrice(float $price): self {
        $this->price = $price;
        return $this;
    }

    /**
     * Get the value of stock
     */
    public function getStock(): int {
        return $this->stock;
    }

    /**
     * Set the value of stock
     * 
     * @return self
     */
    public function setStock(int $stock): self {
        $this->stock = $stock;
        return $this;
    }

    /**
     * Get the value of options
     */
    public function getOptions(): array {
        return $this->options;
    }

    /**
     * Set the value of options
     * 
     * @param array $options Tableau d'options [{"type": "Size", "value": "36"}, ...]
     * @return self
     */
    public function setOptions(array $options): self {
        $this->options = $options;
        return $this;
    }

    /**
     * Add a single option to the variant
     * 
     * @param string $type Type d'option (ex: "Size", "Color")
     * @param string $value Valeur de l'option (ex: "36", "White")
     * @return self
     */
    public function addOption(string $type, string $value, ?string $label = null): self {
        $this->options[] = [
            "type" => $type,
            "value" => $value,
            "label" => $label ?? $value
        ];
        return $this;
    }
}
