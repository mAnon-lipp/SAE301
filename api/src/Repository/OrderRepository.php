<?php

require_once("src/Repository/EntityRepository.php");
require_once("src/Class/Order.php");
require_once("src/Class/OrderItem.php");

/**
 *  Classe OrderRepository
 * 
 *  Cette classe gère toutes les opérations sur les commandes (Commandes)
 *  Elle hérite de EntityRepository et implémente les méthodes CRUD
 */
class OrderRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    /**
     * Trouve une commande par son ID avec ses items
     */
    public function find($id): ?Order {
        $requete = $this->cnx->prepare("SELECT * FROM Commandes WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $order = new Order($answer->id);
        $order->setClientId($answer->client_id);
        $order->setDateCommande($answer->date_commande);
        $order->setStatut($answer->statut);
        $order->setMontantTotal($answer->montant_total);
        
        // Charger les items de la commande
        $items = $this->findItemsByOrderId($id);
        $order->setItems($items);
        
        return $order;
    }

    /**
     * Trouve toutes les commandes
     */
    public function findAll(): array {
        $requete = $this->cnx->prepare("SELECT * FROM Commandes ORDER BY date_commande DESC");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj){
            $order = new Order($obj->id);
            $order->setClientId($obj->client_id);
            $order->setDateCommande($obj->date_commande);
            $order->setStatut($obj->statut);
            $order->setMontantTotal($obj->montant_total);
            
            // Charger les items
            $items = $this->findItemsByOrderId($obj->id);
            $order->setItems($items);
            
            array_push($res, $order);
        }
       
        return $res;
    }

    /**
     * Trouve toutes les commandes d'un utilisateur
     */
    public function findAllByUserId($userId): array {
        $requete = $this->cnx->prepare("SELECT * FROM Commandes WHERE client_id=:userId ORDER BY date_commande DESC");
        $requete->bindParam(':userId', $userId);
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj){
            $order = new Order($obj->id);
            $order->setClientId($obj->client_id);
            $order->setDateCommande($obj->date_commande);
            $order->setStatut($obj->statut);
            $order->setMontantTotal($obj->montant_total);
            
            // Charger les items
            $items = $this->findItemsByOrderId($obj->id);
            $order->setItems($items);
            
            array_push($res, $order);
        }
       
        return $res;
    }

    /**
     * Sauvegarde une nouvelle commande avec ses items
     * Utilise une transaction pour garantir l'intégrité
     */
    public function save($order){
        try {
            // Démarrer une transaction
            $this->cnx->beginTransaction();
            
            // Insérer la commande
            $requete = $this->cnx->prepare(
                "INSERT INTO Commandes (client_id, date_commande, statut, montant_total) 
                 VALUES (:client_id, :date_commande, :statut, :montant_total)"
            );
            
            $clientId = $order->getClientId();
            $dateCommande = $order->getDateCommande() ?? date('Y-m-d H:i:s');
            $statut = $order->getStatut() ?? 'Validée';
            $montantTotal = $order->getMontantTotal();
            
            $requete->bindParam(':client_id', $clientId);
            $requete->bindParam(':date_commande', $dateCommande);
            $requete->bindParam(':statut', $statut);
            $requete->bindParam(':montant_total', $montantTotal);
            
            $answer = $requete->execute();
            
            if (!$answer) {
                error_log("Erreur lors de l'insertion de la commande");
                $this->cnx->rollBack();
                return false;
            }
            
            $orderId = $this->cnx->lastInsertId();
            $order->setId($orderId);
            $order->setDateCommande($dateCommande);
            $order->setStatut($statut);
            
            // Insérer les items de la commande
            $items = $order->getItems();
            if ($items && count($items) > 0) {
                // US011 - Créer une instance du repository de variants pour la décrémentation
                require_once("src/Repository/ProductVariantRepository.php");
                $variantRepo = new ProductVariantRepository();
                
                foreach ($items as $item) {
                    // Gérer variant_id ou produit_id (pour rétrocompatibilité)
                    $variantId = isset($item['variant_id']) ? $item['variant_id'] : null;
                    
                    // Si produit_id fourni mais pas variant_id, trouver le variant par défaut
                    if (!$variantId && isset($item['produit_id'])) {
                        // Récupérer le premier variant du produit (ou créer une logique pour variant par défaut)
                        $variantQuery = $this->cnx->prepare(
                            "SELECT id FROM ProductVariant WHERE product_id=:product_id LIMIT 1"
                        );
                        $productId = $item['produit_id'];
                        $variantQuery->bindParam(':product_id', $productId);
                        $variantQuery->execute();
                        $variantResult = $variantQuery->fetch(PDO::FETCH_OBJ);
                        
                        if ($variantResult) {
                            $variantId = $variantResult->id;
                        } else {
                            // Si pas de variant, erreur
                            error_log("Aucun variant trouvé pour product_id: " . $productId);
                            $this->cnx->rollBack();
                            return false;
                        }
                    }
                    
                    if (!$variantId) {
                        error_log("variant_id manquant pour un item");
                        $this->cnx->rollBack();
                        return false;
                    }
                    
                    // Vérifier que le variant existe
                    $checkVariant = $this->cnx->prepare("SELECT id FROM ProductVariant WHERE id=:variant_id");
                    $checkVariant->bindParam(':variant_id', $variantId);
                    $checkVariant->execute();
                    if (!$checkVariant->fetch()) {
                        error_log("Variant inexistant: " . $variantId);
                        $this->cnx->rollBack();
                        return false;
                    }
                    
                    // US011 - Décrémenter le stock pour le variant (Critère 1 & 6)
                    // La méthode de décrémentation assure l'impossibilité des stocks négatifs
                    $quantite = $item['quantite'];
                    
                    if (!$variantRepo->decrementStock((int)$variantId, (int)$quantite, (int)$orderId)) {
                        error_log("US011 - Stock insuffisant pour variant: " . $variantId);
                        // Cette erreur devrait déjà être gérée par le Controller (US010),
                        // mais le rollback ici garantit l'atomicité (DoD 1, 4)
                        $this->cnx->rollBack();
                        return false; 
                    }
                    
                    $itemRequete = $this->cnx->prepare(
                        "INSERT INTO Order_Items (commande_id, variant_id, quantite, prix_unitaire) 
                         VALUES (:commande_id, :variant_id, :quantite, :prix_unitaire)"
                    );
                    
                    $prixUnitaire = $item['prix_unitaire'];
                    
                    $itemRequete->bindParam(':commande_id', $orderId);
                    $itemRequete->bindParam(':variant_id', $variantId);
                    $itemRequete->bindParam(':quantite', $quantite);
                    $itemRequete->bindParam(':prix_unitaire', $prixUnitaire);
                    
                    $itemAnswer = $itemRequete->execute();
                    
                    if (!$itemAnswer) {
                        error_log("Erreur lors de l'insertion de l'item: " . print_r($this->cnx->errorInfo(), true));
                        $this->cnx->rollBack();
                        return false;
                    }
                }
            }
            
            // Valider la transaction
            $this->cnx->commit();
            return true;
            
        } catch (Exception $e) {
            // En cas d'erreur, annuler la transaction
            error_log("Exception dans OrderRepository::save(): " . $e->getMessage());
            $this->cnx->rollBack();
            return false;
        }
    }

    /**
     * Supprime une commande et ses items (cascade)
     */
    public function delete($id){
        try {
            $this->cnx->beginTransaction();
            
            // Supprimer les items (même si CASCADE devrait le faire)
            $requete = $this->cnx->prepare("DELETE FROM Order_Items WHERE commande_id=:value");
            $requete->bindParam(':value', $id);
            $requete->execute();
            
            // Supprimer la commande
            $requete = $this->cnx->prepare("DELETE FROM Commandes WHERE id=:value");
            $requete->bindParam(':value', $id);
            $answer = $requete->execute();
            
            $this->cnx->commit();
            return $answer;
            
        } catch (Exception $e) {
            $this->cnx->rollBack();
            return false;
        }
    }

    /**
     * Met à jour une commande (principalement le statut)
     */
    public function update($order){
        $requete = $this->cnx->prepare(
            "UPDATE Commandes 
             SET statut=:statut, montant_total=:montant_total 
             WHERE id=:id"
        );
        
        $id = $order->getId();
        $statut = $order->getStatut();
        $montantTotal = $order->getMontantTotal();
        
        $requete->bindParam(':id', $id);
        $requete->bindParam(':statut', $statut);
        $requete->bindParam(':montant_total', $montantTotal);
        
        return $requete->execute();
    }

    /**
     * US011 - Méthode publique pour charger les items d'une commande avec détails produit et variant
     * Nécessaire pour le recrédit de stock lors de l'annulation
     */
    public function findItemsByOrderId($orderId): array {
        $requete = $this->cnx->prepare(
            "SELECT oi.*, 
                    pv.product_id, pv.sku, pv.price as variant_price, pv.stock,
                    p.name, p.image, p.description 
             FROM Order_Items oi 
             LEFT JOIN ProductVariant pv ON oi.variant_id = pv.id 
             LEFT JOIN Product p ON pv.product_id = p.id 
             WHERE oi.commande_id=:orderId"
        );
        $requete->bindParam(':orderId', $orderId);
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);
        
        $items = [];
        foreach($answer as $obj){
            $item = new OrderItem($obj->id);
            $item->setCommandeId($obj->commande_id);
            $item->setVariantId($obj->variant_id);
            $item->setQuantite($obj->quantite);
            $item->setPrixUnitaire($obj->prix_unitaire);
            
            // Ajouter les détails du produit et du variant si disponibles
            if (isset($obj->name)) {
                $item->setProductDetails([
                    'name' => $obj->name,
                    'image' => $obj->image ?? null,
                    'description' => $obj->description ?? null,
                    'sku' => $obj->sku ?? null,
                    'product_id' => $obj->product_id ?? null
                ]);
            }
            
            array_push($items, $item);
        }
        
        return $items;
    }
}
