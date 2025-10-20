<?php

require_once ('Entity.php');

/**
 *  Class OrderItem
 * 
 *  Représente un article dans une commande (table Order_Items)
 * 
 *  Implémente l'interface JsonSerializable pour la conversion en JSON
 */
class OrderItem extends Entity {
    private int $id;
    private int $commande_id;
    private int $produit_id;
    private int $quantite;
    private float $prix_unitaire;
    private ?array $product_details = null; // Détails du produit (optionnel)

    public function __construct(int $id = 0){
        $this->id = $id;
    }

    /**
     * Définit comment convertir un item de commande en JSON
     */
    public function jsonSerialize(): mixed {
        $data = [
            "id" => $this->id,
            "commande_id" => $this->commande_id,
            "produit_id" => $this->produit_id,
            "quantite" => $this->quantite,
            "prix_unitaire" => $this->prix_unitaire
        ];
        
        // Inclure les détails du produit si disponibles
        if ($this->product_details !== null) {
            $data["product_details"] = $this->product_details;
        }
        
        return $data;
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
     * Get the value of commande_id
     */ 
    public function getCommandeId(): int
    {
        return $this->commande_id;
    }

    /**
     * Set the value of commande_id
     */ 
    public function setCommandeId(int $commande_id): self
    {
        $this->commande_id = $commande_id;
        return $this;
    }

    /**
     * Get the value of produit_id
     */ 
    public function getProduitId(): int
    {
        return $this->produit_id;
    }

    /**
     * Set the value of produit_id
     */ 
    public function setProduitId(int $produit_id): self
    {
        $this->produit_id = $produit_id;
        return $this;
    }

    /**
     * Get the value of quantite
     */ 
    public function getQuantite(): int
    {
        return $this->quantite;
    }

    /**
     * Set the value of quantite
     */ 
    public function setQuantite(int $quantite): self
    {
        $this->quantite = $quantite;
        return $this;
    }

    /**
     * Get the value of prix_unitaire
     */ 
    public function getPrixUnitaire(): float
    {
        return $this->prix_unitaire;
    }

    /**
     * Set the value of prix_unitaire
     */ 
    public function setPrixUnitaire(float $prix_unitaire): self
    {
        $this->prix_unitaire = $prix_unitaire;
        return $this;
    }

    /**
     * Get the value of product_details
     */ 
    public function getProductDetails(): ?array
    {
        return $this->product_details;
    }

    /**
     * Set the value of product_details
     */ 
    public function setProductDetails(array $product_details): self
    {
        $this->product_details = $product_details;
        return $this;
    }
}
