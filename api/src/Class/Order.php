<?php

require_once ('Entity.php');

/**
 *  Class Order
 * 
 *  Représente une commande (table Commandes)
 * 
 *  Implémente l'interface JsonSerializable pour la conversion en JSON
 */
class Order extends Entity {
    private int $id;
    private int $client_id;
    private ?string $date_commande = null;
    private ?string $statut = null;
    private ?float $montant_total = null;
    private ?array $items = null; // Liste des items de la commande

    public function __construct(int $id = 0){
        $this->id = $id;
    }

    /**
     * Définit comment convertir une commande en JSON
     */
    public function jsonSerialize(): mixed {
        $data = [
            "id" => $this->id,
            "client_id" => $this->client_id,
            "date_commande" => $this->date_commande,
            "statut" => $this->statut,
            "montant_total" => $this->montant_total
        ];
        
        // Inclure les items si disponibles
        if ($this->items !== null) {
            $data["items"] = $this->items;
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
     * Get the value of client_id
     */ 
    public function getClientId(): int
    {
        return $this->client_id;
    }

    /**
     * Set the value of client_id
     */ 
    public function setClientId(int $client_id): self
    {
        $this->client_id = $client_id;
        return $this;
    }

    /**
     * Get the value of date_commande
     */ 
    public function getDateCommande(): ?string
    {
        return $this->date_commande;
    }

    /**
     * Set the value of date_commande
     */ 
    public function setDateCommande(string $date_commande): self
    {
        $this->date_commande = $date_commande;
        return $this;
    }

    /**
     * Get the value of statut
     */ 
    public function getStatut(): ?string
    {
        return $this->statut;
    }

    /**
     * Set the value of statut
     */ 
    public function setStatut(string $statut): self
    {
        $this->statut = $statut;
        return $this;
    }

    /**
     * Get the value of montant_total
     */ 
    public function getMontantTotal(): ?float
    {
        return $this->montant_total;
    }

    /**
     * Set the value of montant_total
     */ 
    public function setMontantTotal(float $montant_total): self
    {
        $this->montant_total = $montant_total;
        return $this;
    }

    /**
     * Get the value of items
     */ 
    public function getItems(): ?array
    {
        return $this->items;
    }

    /**
     * Set the value of items
     */ 
    public function setItems(array $items): self
    {
        $this->items = $items;
        return $this;
    }
}
