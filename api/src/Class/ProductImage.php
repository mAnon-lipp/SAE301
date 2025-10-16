<?php

require_once ('Entity.php');

/**
 * Class ProductImage
 * 
 * Représente une image de produit dans la galerie
 */
class ProductImage extends Entity {
    private int $id;
    private int $product_id;
    private ?string $image_path = null;

    public function __construct(int $id){
        $this->id = $id;
    }

    /**
     * Get the value of id
     */ 
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * Set the value of id
     */ 
    public function setId(int $id): self
    {
        $this->id = $id;
        return $this;
    }

    /**
     * Get the value of product_id
     */ 
    public function getProductId(): int
    {
        return $this->product_id;
    }

    /**
     * Set the value of product_id
     */ 
    public function setProductId(int $product_id): self
    {
        $this->product_id = $product_id;
        return $this;
    }

    /**
     * Get the value of image_path
     */ 
    public function getImagePath(): ?string
    {
        return $this->image_path;
    }

    /**
     * Set the value of image_path
     */ 
    public function setImagePath(string $image_path): self
    {
        $this->image_path = $image_path;
        return $this;
    }

    /**
     * JsonSerialize implementation
     */
    public function jsonSerialize(): mixed
    {
        return [
            "id" => $this->id,
            "product_id" => $this->product_id,
            "image_path" => $this->image_path
        ];
    }
}
